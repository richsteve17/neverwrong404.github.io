// Fallback manual sign-in for iOS
function manualSignIn() {
    const clientId = localStorage.getItem('GOOGLE_CLIENT_ID') || '469028529540-dut6tah0v1n0ad21ppta3afhcqun78pf.apps.googleusercontent.com';
    const redirectUri = window.location.href.split('#')[0].split('?')[0]; // Use current page URL
    const scope = 'https://www.googleapis.com/auth/gmail.readonly';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${encodeURIComponent(clientId)}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `response_type=token&` +
        `scope=${encodeURIComponent(scope)}`;

    window.location.href = authUrl;
}

// Show fallback button if Google button doesn't load
setTimeout(function() {
    const signInDiv = document.getElementById('signInButton');
    const manualBtn = document.getElementById('manualSignInBtn');

    if (signInDiv && (!signInDiv.children || signInDiv.children.length === 0) && manualBtn) {
        manualBtn.style.display = 'block';
    }
}, 3000);
