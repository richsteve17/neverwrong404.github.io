// Main application logic

let currentEmails = [];
let currentCategory = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check configuration
    if (!isConfigured()) {
        console.warn('App is not configured. Please update config.js with your API keys.');
    }

    // Set up event listeners
    setupEventListeners();

    // Show login screen initially
    showLoginScreen();
});

// Set up all event listeners
function setupEventListeners() {
    // Refresh button
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadEmails();
    });

    // Settings button
    document.getElementById('settingsBtn').addEventListener('click', () => {
        showSettings();
    });

    // Sign out button
    document.getElementById('signOutBtn').addEventListener('click', () => {
        signOut();
    });
}

// Show login screen
function showLoginScreen() {
    document.getElementById('loginScreen').classList.remove('hidden');
    document.getElementById('appScreen').classList.add('hidden');
    currentEmails = [];
}

// Show app screen
function showAppScreen(userEmail) {
    document.getElementById('loginScreen').classList.add('hidden');
    document.getElementById('appScreen').classList.remove('hidden');
    document.getElementById('userEmail').textContent = userEmail;
}

// Load emails
async function loadEmails() {
    const loadingIndicator = document.getElementById('loadingIndicator');
    const emailList = document.getElementById('emailList');

    // Show loading
    loadingIndicator.classList.remove('hidden');
    emailList.innerHTML = '';
    emailList.appendChild(loadingIndicator);

    try {
        // Fetch emails from Gmail
        const emails = await fetchEmails(CONFIG.MAX_EMAILS);

        // Update loading message
        const loadingText = loadingIndicator.querySelector('p');
        loadingText.textContent = 'Categorizing emails with AI...';

        // Categorize emails with Gemini
        const categorizedEmails = await categorizeEmails(emails, (current, total) => {
            loadingText.textContent = `Categorizing emails... ${current}/${total}`;
        });

        // Store emails
        currentEmails = categorizedEmails;

        // Hide loading
        loadingIndicator.classList.add('hidden');

        // Render category pills
        renderCategoryPills();

        // Render emails
        renderEmails();

    } catch (error) {
        console.error('Error loading emails:', error);
        loadingIndicator.classList.add('hidden');

        // Show error message
        emailList.innerHTML = `
            <div class="empty-state">
                <div class="icon">⚠️</div>
                <h2>Error Loading Emails</h2>
                <p>${error.message || 'An unknown error occurred'}</p>
                <p style="margin-top: 1rem;">
                    <button class="btn-primary" onclick="loadEmails()">Try Again</button>
                </p>
            </div>
        `;
    }
}

// Render category pills
function renderCategoryPills() {
    const pillsContainer = document.getElementById('categoryPills');

    // Count emails per category
    const categoryCounts = {};
    getAllCategoryIds().forEach(id => {
        categoryCounts[id] = currentEmails.filter(e => e.category === id).length;
    });

    // Build pills HTML
    let pillsHTML = `
        <button class="pill ${currentCategory === 'all' ? 'active' : ''}" data-category="all" onclick="filterByCategory('all')">
            All <span class="count">${currentEmails.length}</span>
        </button>
    `;

    getAllCategoryIds().forEach(categoryId => {
        const count = categoryCounts[categoryId];
        if (count > 0) {
            const category = getCategoryInfo(categoryId);
            pillsHTML += `
                <button class="pill ${currentCategory === categoryId ? 'active' : ''}" data-category="${categoryId}" onclick="filterByCategory('${categoryId}')">
                    ${category.icon} ${category.name} <span class="count">${count}</span>
                </button>
            `;
        }
    });

    pillsContainer.innerHTML = pillsHTML;
}

// Filter emails by category
function filterByCategory(categoryId) {
    currentCategory = categoryId;
    renderCategoryPills();
    renderEmails();
}

// Render emails
function renderEmails() {
    const emailList = document.getElementById('emailList');

    // Filter emails
    let filteredEmails = currentEmails;
    if (currentCategory !== 'all') {
        filteredEmails = currentEmails.filter(e => e.category === currentCategory);
    }

    // Check if empty
    if (filteredEmails.length === 0) {
        const categoryName = currentCategory === 'all' ? 'inbox' : getCategoryInfo(currentCategory).name;
        emailList.innerHTML = `
            <div class="empty-state">
                <div class="icon">📭</div>
                <h2>No Emails</h2>
                <p>No emails in ${categoryName}</p>
            </div>
        `;
        return;
    }

    // Render emails
    let emailsHTML = '';
    filteredEmails.forEach(email => {
        emailsHTML += renderEmailItem(email);
    });

    emailList.innerHTML = emailsHTML;
}

// Render a single email item
function renderEmailItem(email) {
    const category = getCategoryInfo(email.category);
    const senderName = extractSenderName(email.from);
    const dateStr = formatDate(email.date);

    return `
        <div class="email-item">
            <div class="email-header">
                <span class="category-badge badge-${category.color}">
                    ${category.icon} ${category.name}
                </span>
                <span class="email-date">${dateStr}</span>
            </div>
            <div class="email-sender ${email.isUnread ? 'unread' : ''}">
                ${senderName}
                ${email.isUnread ? '<span class="unread-indicator"></span>' : ''}
            </div>
            <div class="email-subject ${email.isUnread ? 'unread' : ''}">
                ${escapeHtml(email.subject)}
            </div>
            <div class="email-snippet">
                ${escapeHtml(email.snippet)}
            </div>
        </div>
    `;
}

// Extract sender name from "Name <email>" format
function extractSenderName(from) {
    const match = from.match(/^([^<]+)/);
    if (match) {
        return match[1].trim();
    }
    return from;
}

// Format date relative to now
function formatDate(date) {
    const now = new Date();
    const diff = now - date;

    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    // Format as date
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show setup modal
function showSetup() {
    document.getElementById('setupModal').classList.remove('hidden');
}

// Hide setup modal
function hideSetup() {
    document.getElementById('setupModal').classList.add('hidden');
}

// Show settings modal
function showSettings() {
    const modal = document.getElementById('settingsModal');
    const maxEmailsSelect = document.getElementById('maxEmails');
    const apiStatus = document.getElementById('apiStatus');

    // Set current value
    maxEmailsSelect.value = CONFIG.MAX_EMAILS;

    // Show API status
    const googleConfigured = CONFIG.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID';
    const geminiConfigured = CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';

    apiStatus.innerHTML = `
        Google Client ID: ${googleConfigured ? '✅ Configured' : '❌ Not configured'}<br>
        Gemini API Key: ${geminiConfigured ? '✅ Configured' : '❌ Not configured'}
    `;

    modal.classList.remove('hidden');
}

// Hide settings modal
function hideSettings() {
    document.getElementById('settingsModal').classList.add('hidden');
}

// Save settings
function saveSettings() {
    const maxEmails = parseInt(document.getElementById('maxEmails').value);
    CONFIG.MAX_EMAILS = maxEmails;

    hideSettings();

    // Show success message
    alert('Settings saved! Refresh to apply changes.');
}

// Service Worker registration for PWA
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js').then(
            registration => {
                console.log('ServiceWorker registered:', registration.scope);
            },
            error => {
                console.log('ServiceWorker registration failed:', error);
            }
        );
    });
}
