// Gmail API integration

let tokenClient;
let gapiInited = false;
let gisInited = false;

// Initialize Google API
function gapiInit() {
    gapi.client.init({
        apiKey: CONFIG.GOOGLE_CLIENT_ID,
        discoveryDocs: [CONFIG.GMAIL_DISCOVERY_DOC],
    }).then(() => {
        gapiInited = true;
        maybeEnableAuth();
    }).catch(error => {
        console.error('GAPI init error:', error);
    });
}

// Initialize Google Identity Services
function gisInit() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        scope: CONFIG.GMAIL_SCOPES,
        callback: (tokenResponse) => {
            if (tokenResponse.access_token) {
                handleAuthSuccess(tokenResponse);
            }
        },
    });
    gisInited = true;
    maybeEnableAuth();
}

// Check if both APIs are ready
function maybeEnableAuth() {
    if (gapiInited && gisInited) {
        initializeSignInButton();
    }
}

// Initialize the sign-in button
function initializeSignInButton() {
    const signInDiv = document.getElementById('signInButton');
    google.accounts.id.renderButton(
        signInDiv,
        {
            theme: 'filled_blue',
            size: 'large',
            text: 'signin_with',
            width: 250
        }
    );

    // Also set up custom click handler
    google.accounts.id.initialize({
        client_id: CONFIG.GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });
}

// Handle credential response
function handleCredentialResponse(response) {
    // Request access token
    tokenClient.requestAccessToken();
}

// Handle successful authentication
function handleAuthSuccess(tokenResponse) {
    gapi.client.setToken(tokenResponse);
    getUserEmail().then(email => {
        showAppScreen(email);
        loadEmails();
    });
}

// Get user's email address
async function getUserEmail() {
    try {
        const response = await gapi.client.gmail.users.getProfile({
            userId: 'me'
        });
        return response.result.emailAddress;
    } catch (error) {
        console.error('Error getting user email:', error);
        return 'Unknown';
    }
}

// Fetch emails from Gmail
async function fetchEmails(maxResults = CONFIG.MAX_EMAILS) {
    try {
        const response = await gapi.client.gmail.users.messages.list({
            userId: 'me',
            maxResults: maxResults,
            labelIds: ['INBOX']
        });

        const messages = response.result.messages || [];
        const emailPromises = messages.map(msg => fetchEmailDetail(msg.id));
        const emails = await Promise.all(emailPromises);

        return emails.filter(email => email !== null);
    } catch (error) {
        console.error('Error fetching emails:', error);
        throw error;
    }
}

// Fetch individual email details
async function fetchEmailDetail(messageId) {
    try {
        const response = await gapi.client.gmail.users.messages.get({
            userId: 'me',
            id: messageId,
            format: 'full'
        });

        const message = response.result;
        const headers = message.payload.headers;

        // Extract relevant headers
        const getHeader = (name) => {
            const header = headers.find(h => h.name.toLowerCase() === name.toLowerCase());
            return header ? header.value : '';
        };

        const subject = getHeader('Subject') || '(No Subject)';
        const from = getHeader('From') || 'Unknown Sender';
        const dateStr = getHeader('Date');
        const date = dateStr ? new Date(dateStr) : new Date();

        // Check if unread
        const isUnread = message.labelIds?.includes('UNREAD') || false;

        // Get snippet
        const snippet = message.snippet || '';

        return {
            id: message.id,
            threadId: message.threadId,
            subject: subject,
            from: from,
            date: date,
            isUnread: isUnread,
            snippet: snippet,
            category: null // Will be set by Gemini
        };
    } catch (error) {
        console.error('Error fetching email detail:', error);
        return null;
    }
}

// Sign out
function signOut() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');
    }
    showLoginScreen();
}

// Initialize Gmail API when script loads
if (typeof gapi !== 'undefined') {
    gapi.load('client', gapiInit);
}

// Initialize GIS when available
window.addEventListener('load', () => {
    if (typeof google !== 'undefined' && google.accounts) {
        gisInit();
    }
});
