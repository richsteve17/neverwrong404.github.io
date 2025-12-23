// Gemini AI integration for email categorization

// Categorize a single email
async function categorizeEmail(email) {
    // Check if API key exists
    if (!CONFIG.GEMINI_API_KEY || CONFIG.GEMINI_API_KEY === '') {
        console.error('Gemini API key missing');
        return 'uncategorized';
    }

    const prompt = buildCategorizationPrompt(email);

    try {
        const response = await fetch(
            `${CONFIG.GEMINI_API_URL}?key=${CONFIG.GEMINI_API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ text: prompt }]
                    }],
                    generationConfig: {
                        temperature: 0.1,
                        maxOutputTokens: 50
                    }
                })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Gemini API error (${response.status}):`, errorText);
            throw new Error(`Gemini API error: ${response.statusText}`);
        }

        const data = await response.json();
        const category = parseCategoryResponse(data);
        return category;
    } catch (error) {
        console.error('Error categorizing email:', email.subject, error);
        // Show alert only once for first error
        if (!window.geminiErrorShown) {
            window.geminiErrorShown = true;
            alert(`Gemini API Error: ${error.message}\n\nCheck console for details. Your API key may be invalid.`);
        }
        return 'uncategorized';
    }
}

// Build the categorization prompt
function buildCategorizationPrompt(email) {
    const categoryList = getAllCategoryIds()
        .map(id => CATEGORIES[id].name)
        .join(', ');

    return `Categorize the following email into one of these categories: ${categoryList}

Email Details:
From: ${email.from}
Subject: ${email.subject}
Preview: ${email.snippet}

Rules for categorization:
- "OTP" for one-time passwords, verification codes, 2FA codes, authentication codes
- "Casinos" for online gambling, casino promotions, betting sites
- "Social Media" for Facebook, Twitter, Instagram, LinkedIn, TikTok, etc.
- "Shopping" for e-commerce sites, order confirmations, shipping notifications
- "Promotions" for marketing emails, sales, discounts, promotional offers
- "Finance" for bank statements, credit card bills, investment updates, payment confirmations
- "Work" for work-related emails, meetings, project discussions
- "Personal" for emails from friends, family, personal contacts
- "Newsletters" for subscriptions, digests, regular updates
- "General" for general communication that doesn't fit other categories
- "Uncategorized" only if none of the above apply

Respond with ONLY the category name, nothing else. Be strict and accurate.`;
}

// Parse Gemini response to extract category
function parseCategoryResponse(data) {
    try {
        const text = data.candidates[0].content.parts[0].text.trim().toLowerCase();

        // Try to match to a category
        for (const [categoryId, categoryInfo] of Object.entries(CATEGORIES)) {
            if (text.includes(categoryInfo.name.toLowerCase())) {
                return categoryId;
            }
        }

        return 'uncategorized';
    } catch (error) {
        console.error('Error parsing category response:', error);
        return 'uncategorized';
    }
}

// Categorize multiple emails
async function categorizeEmails(emails, progressCallback) {
    const categorizedEmails = [];

    for (let i = 0; i < emails.length; i++) {
        const email = emails[i];
        const category = await categorizeEmail(email);
        email.category = category;
        categorizedEmails.push(email);

        // Call progress callback if provided
        if (progressCallback) {
            progressCallback(i + 1, emails.length);
        }

        // Add small delay to avoid rate limiting
        if (i < emails.length - 1) {
            await sleep(200);
        }
    }

    return categorizedEmails;
}

// Helper function to sleep
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Batch categorize emails (faster, but less accurate)
async function batchCategorizeEmails(emails) {
    // For now, we'll use individual categorization
    // In the future, we could optimize this with batch requests
    return categorizeEmails(emails);
}
