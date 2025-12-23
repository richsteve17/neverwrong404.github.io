# Gmail Sorter - Web App for iOS

A Progressive Web App (PWA) that uses Gemini AI to automatically categorize your Gmail emails. **Works directly on your iPhone** - no Mac or Xcode needed!

## ✨ Features

- 📱 **Works on iOS Safari** - Use directly in your browser
- 🏠 **Add to Home Screen** - Install as an app on your iPhone
- 🤖 **AI-Powered** - Gemini categorizes emails intelligently
- 🎯 **Smart Categories**: Casinos, OTP, Shopping, Social Media, Finance, Work, and more
- 🎨 **Beautiful UI** - Native iOS look and feel
- ⚡ **Fast & Responsive** - Optimized for mobile

## 🚀 Quick Start for iOS Users

### Step 1: Get Your API Keys (10 minutes)

#### A. Google OAuth Client ID

1. Open Safari and go to [Google Cloud Console](https://console.cloud.google.com/)
2. Tap **"New Project"**
   - Name it "Gmail Sorter"
   - Tap **"Create"**
3. Enable Gmail API:
   - Tap menu (☰) → **"APIs & Services"** → **"Library"**
   - Search for **"Gmail API"**
   - Tap it and press **"Enable"**
4. Create OAuth Credentials:
   - Go to **"APIs & Services"** → **"Credentials"**
   - Tap **"Create Credentials"** → **"OAuth client ID"**
   - If prompted, configure consent screen:
     - Choose **"External"**
     - App name: **"Gmail Sorter"**
     - Add your email
     - Tap **"Save and Continue"** through all screens
   - Back to creating OAuth client ID:
     - Application type: **"Web application"**
     - Name: **"Gmail Sorter Web"**
     - Authorized JavaScript origins: Add `https://yourusername.github.io`
       - (Replace `yourusername` with your actual GitHub username)
     - Authorized redirect URIs: Add `https://yourusername.github.io/webapp/`
   - Tap **"Create"**
   - **Copy your Client ID** (looks like: `123456789-abc...xyz.apps.googleusercontent.com`)

#### B. Gemini API Key

1. In Safari, go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Tap **"Create API Key"**
3. Select your Gmail Sorter project
4. Tap **"Create API key in existing project"**
5. **Copy your API Key** (looks like: `AIzaSy...`)

### Step 2: Configure the App (5 minutes)

You'll need to edit the config file. You can do this:

**Option A: On Your iPhone (using GitHub web)**
1. Go to your repository on GitHub in Safari
2. Navigate to `webapp/js/config.js`
3. Tap the pencil icon (Edit)
4. Replace:
   - `YOUR_GOOGLE_CLIENT_ID` with your Client ID
   - `YOUR_GEMINI_API_KEY` with your API Key
5. Scroll down and tap **"Commit changes"**

**Option B: On a Computer**
1. Clone your repository
2. Edit `webapp/js/config.js`
3. Replace the placeholder values
4. Commit and push changes

### Step 3: Enable GitHub Pages (2 minutes)

1. Go to your repository on GitHub
2. Tap **Settings** → **Pages**
3. Under "Source", select **"main"** branch
4. Tap **Save**
5. Wait a few minutes for deployment
6. Your app will be live at: `https://yourusername.github.io/webapp/`

### Step 4: Use the App on Your iPhone! 🎉

1. Open Safari on your iPhone
2. Go to `https://yourusername.github.io/webapp/`
3. Tap the **Share** button (square with arrow)
4. Scroll down and tap **"Add to Home Screen"**
5. Tap **"Add"**
6. The Gmail Sorter icon will appear on your home screen!

### Step 5: Sign In and Sort

1. Tap the Gmail Sorter icon on your home screen
2. Tap **"Sign in with Google"**
3. Select your Gmail account
4. Grant permissions when asked
5. Wait while your emails are fetched and categorized
6. Enjoy your organized inbox! 📧✨

## 📱 Using the App

### Main Features

- **Category Pills**: Swipe horizontally to see all categories
- **Tap a Category**: View only emails in that category
- **Refresh Button** (🔄): Reload and re-categorize emails
- **Settings Button** (⚙️): Adjust number of emails to fetch
- **Sign Out** (🚪): Log out of your account

### Email Categories

The app automatically sorts emails into:

- 🎰 **Casinos** - Gambling sites, betting promotions
- 🔑 **OTP** - Verification codes, 2FA
- ✉️ **General** - Standard correspondence
- 👥 **Social Media** - Facebook, Twitter, Instagram, etc.
- 🛒 **Shopping** - Orders, shipping, e-commerce
- 📣 **Promotions** - Marketing, sales, offers
- 💰 **Finance** - Banks, bills, payments
- 💼 **Work** - Professional emails, meetings
- ❤️ **Personal** - Friends and family
- 📰 **Newsletters** - Subscriptions, digests
- ❓ **Uncategorized** - Everything else

## 🔧 Troubleshooting

### "Invalid Client ID" Error

- Check that you copied the full Client ID
- Make sure there are no extra spaces
- Verify you added the correct authorized origin in Google Cloud Console
- The origin should match your GitHub Pages URL exactly

### "Authorization Error"

- Ensure Gmail API is enabled in Google Cloud Console
- Check that your OAuth consent screen is configured
- Make sure you're signing in with the correct Google account
- Try adding yourself as a test user if the app is in development mode

### Emails Not Loading

- Check your internet connection
- Make sure you granted Gmail permissions
- Look at Settings to confirm API keys are configured
- Try signing out and signing in again

### Categorization Not Working

- Verify your Gemini API key is correct
- Check that you have remaining quota in Google AI Studio
- Try with fewer emails first (adjust in Settings)

### App Not Installing on Home Screen

- Make sure you're using Safari (not Chrome or other browsers)
- The "Add to Home Screen" option is in the Share menu
- Make sure JavaScript is enabled in Safari settings

## ⚙️ Configuration Options

### Number of Emails

Default: 50 emails

To change:
1. Tap Settings (⚙️)
2. Select number of emails (25, 50, 100, or 200)
3. Tap Save
4. Tap Refresh to reload with new limit

**Note**: More emails = longer processing time

### Custom Categories

To add or modify categories, edit `webapp/js/categories.js`:

```javascript
mycategory: {
    name: 'My Category',
    icon: '🌟',
    color: 'purple',
    keywords: ['keyword1', 'keyword2']
}
```

## 🔒 Privacy & Security

- **No Data Storage**: Emails are only loaded temporarily
- **No Server**: Everything runs in your browser
- **OAuth 2.0**: Secure authentication via Google
- **API Keys**: Kept in your code, never shared
- **Read-Only**: App can only read emails, not send or delete

## 📊 Limitations

- **Gmail API Quota**: 1 billion quota units/day (plenty for personal use)
- **Gemini API**: Free tier limits apply
- **Browser Storage**: Limited by device storage
- **iOS Safari Only**: Best experience in Safari on iOS

## 🎨 Customization

### Change Colors

Edit `webapp/css/styles.css` and modify CSS variables:

```css
:root {
    --primary: #4285f4;  /* Main blue color */
    --casino: #9333ea;   /* Category colors */
    /* ... etc */
}
```

### Change Icons

Replace files in `webapp/icons/` with your own:
- Use the same filenames
- Keep the same dimensions
- PNG format recommended

## 🆘 Need Help?

1. Check the in-app setup instructions (tap "View Setup Instructions")
2. Review this README carefully
3. Check the browser console for errors (Safari → Develop → Show JavaScript Console)
4. Verify all API keys are correct in `config.js`

## 🔄 Updates

To update the app:
1. Pull latest changes from repository
2. Clear Safari cache: Settings → Safari → Clear History and Website Data
3. Reload the app

## 📝 File Structure

```
webapp/
├── index.html          # Main HTML
├── manifest.json       # PWA manifest
├── sw.js              # Service worker
├── css/
│   └── styles.css     # All styles
├── js/
│   ├── config.js      # API keys (EDIT THIS!)
│   ├── categories.js  # Category definitions
│   ├── gmail.js       # Gmail API integration
│   ├── gemini.js      # Gemini AI integration
│   └── app.js         # Main app logic
└── icons/             # App icons
```

## ✅ Checklist

Before using the app, make sure you have:

- [ ] Google OAuth Client ID
- [ ] Gemini API Key
- [ ] Updated `config.js` with your keys
- [ ] Enabled GitHub Pages
- [ ] Added authorized origins in Google Cloud Console
- [ ] Tested the app in Safari
- [ ] Added to home screen

## 🌟 Tips

- **Best Performance**: Use WiFi for initial load
- **Privacy**: Sign out when done on shared devices
- **Quota**: Refresh sparingly to conserve API quota
- **Categories**: Give Gemini a few seconds per email
- **Offline**: App shell caches for offline viewing

---

**Enjoy your organized inbox! 📧✨**

Made with ❤️ for iOS users who want better email management
