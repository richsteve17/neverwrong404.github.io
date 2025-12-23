// Configuration file - REPLACE THESE WITH YOUR ACTUAL API KEYS

const CONFIG = {
    // Get this from Google Cloud Console
    // https://console.cloud.google.com/
    GOOGLE_CLIENT_ID: localStorage.getItem('GOOGLE_CLIENT_ID') || '469028529540-dut6tah0v1n0ad21ppta3afhcqun78pf.apps.googleusercontent.com',

    // Get this from Google AI Studio - CONFIGURE AT /webapp/setup.html
    // https://makersuite.google.com/app/apikey
    GEMINI_API_KEY: localStorage.getItem('GEMINI_API_KEY') || '',

    // Gmail API settings
    GMAIL_SCOPES: 'https://www.googleapis.com/auth/gmail.readonly',
    GMAIL_DISCOVERY_DOC: 'https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest',

    // Gemini API endpoint
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',

    // App settings
    MAX_EMAILS: 50,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Check if configuration is complete
function isConfigured() {
    return CONFIG.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' &&
           CONFIG.GEMINI_API_KEY !== 'YOUR_GEMINI_API_KEY';
}
