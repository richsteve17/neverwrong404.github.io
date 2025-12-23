# 📱 iOS Setup Guide - Gmail Sorter

## Complete Setup in 15 Minutes!

Follow these steps **on your iPhone** or any device with a browser.

---

## ⚡ Quick Setup Steps

### 1️⃣ Get Google Client ID (5 min)

1. Open [Google Cloud Console](https://console.cloud.google.com/) in Safari
2. Sign in with your Google account
3. Create a new project:
   - Click **"New Project"**
   - Name: `Gmail Sorter`
   - Click **"Create"**
4. Enable Gmail API:
   - Menu (☰) → **APIs & Services** → **Library**
   - Search: `Gmail API`
   - Click **"Enable"**
5. Create OAuth credentials:
   - **APIs & Services** → **Credentials**
   - **Create Credentials** → **OAuth client ID**
   - First time? Configure consent screen:
     - User Type: **External**
     - App name: `Gmail Sorter`
     - Your email address
     - Click **"Save and Continue"** × 3
   - Back to OAuth client ID:
     - Type: **Web application**
     - Name: `Gmail Sorter`
     - Authorized JavaScript origins:
       ```
       https://YOUR_GITHUB_USERNAME.github.io
       ```
     - Authorized redirect URIs:
       ```
       https://YOUR_GITHUB_USERNAME.github.io/webapp/
       ```
   - Click **"Create"**
   - **📋 COPY YOUR CLIENT ID**
     - Looks like: `123456789-abcdef.apps.googleusercontent.com`

### 2️⃣ Get Gemini API Key (3 min)

1. Open [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select your **Gmail Sorter** project
4. Click **"Create API key in existing project"**
5. **📋 COPY YOUR API KEY**
   - Looks like: `AIzaSyABCDEF1234567890...`

### 3️⃣ Configure the App (5 min)

#### Option A: Edit on iPhone (GitHub App/Web)

1. Go to your repo: `github.com/YOUR_USERNAME/YOUR_REPO`
2. Navigate to: `webapp/js/config.js`
3. Click the ✏️ (Edit) button
4. Find and replace:
   ```javascript
   GOOGLE_CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID'
   ```
   With your actual Client ID:
   ```javascript
   GOOGLE_CLIENT_ID: '123456789-abcdef.apps.googleusercontent.com'
   ```

5. Find and replace:
   ```javascript
   GEMINI_API_KEY: 'YOUR_GEMINI_API_KEY'
   ```
   With your actual API key:
   ```javascript
   GEMINI_API_KEY: 'AIzaSyABCDEF1234567890...'
   ```

6. Scroll to bottom → **Commit changes**

#### Option B: Edit on Computer

1. Clone repository
2. Open `webapp/js/config.js`
3. Replace both placeholder values
4. Save, commit, and push

### 4️⃣ Enable GitHub Pages (2 min)

1. Go to repo **Settings** → **Pages**
2. Source: **main** branch
3. Folder: **/ (root)**
4. Click **Save**
5. Wait 1-2 minutes for deployment
6. Your app URL: `https://YOUR_USERNAME.github.io/webapp/`

### 5️⃣ Install on iPhone! 🎉

1. Open **Safari** on iPhone
2. Go to: `https://YOUR_USERNAME.github.io/webapp/`
3. You should see the login screen
4. Tap **Share** button (□↑)
5. Scroll down → **"Add to Home Screen"**
6. Tap **"Add"**
7. App icon appears on home screen!

### 6️⃣ Use the App

1. Tap **Gmail Sorter** icon
2. Tap **"Sign in with Google"**
3. Choose your Gmail account
4. Tap **"Allow"** for permissions
5. Wait for emails to load and categorize
6. Browse by category!

---

## 🎯 What You'll See

### Login Screen
- Gmail Sorter logo
- "Sign in with Google" button
- Setup instructions link

### Main App
- Your email address at top
- Category filter pills (swipe to see all)
- List of categorized emails
- Unread indicators
- Refresh, settings, sign out buttons

### Categories
- 🎰 Casinos
- 🔑 OTP (verification codes)
- ✉️ General
- 👥 Social Media
- 🛒 Shopping
- 📣 Promotions
- 💰 Finance
- 💼 Work
- ❤️ Personal
- 📰 Newsletters

---

## ❗ Common Issues

### Can't Sign In

**"Invalid Client ID"**
- Check you copied the FULL Client ID
- No extra spaces or line breaks
- Quotes must be matching: `'...'` not `'...'`

**"Authorization Error"**
- Gmail API enabled? Check Google Cloud Console
- Authorized origin set correctly?
- Should be: `https://YOUR_USERNAME.github.io`

### Emails Won't Load

- Check internet connection
- Did you allow Gmail permissions?
- Try signing out and back in
- Check browser console for errors

### Categories Not Working

- Is Gemini API key correct?
- Check quota in Google AI Studio
- Wait a few seconds per email
- Try with fewer emails first

### Can't Add to Home Screen

- Must use **Safari** (not Chrome)
- **Share** button → **"Add to Home Screen"**
- If missing, check iOS version (need iOS 11.3+)

---

## 🔧 Advanced Settings

### Change Email Count

1. Open app
2. Tap ⚙️ (Settings)
3. Choose: 25, 50, 100, or 200 emails
4. Tap Save
5. Tap Refresh (🔄)

**Note**: More emails = longer wait time

### Check Configuration

In Settings, you'll see:
- ✅ Google Client ID: Configured
- ✅ Gemini API Key: Configured

If ❌, go back and update config.js

---

## 🔒 Security Notes

- **Read-Only**: App can't send or delete emails
- **OAuth**: Never stores your password
- **No Server**: Everything runs in your browser
- **Private**: No one can see your emails
- **API Keys**: Keep them secret, don't share publicly

---

## 📊 Usage Limits

### Gmail API
- **Quota**: 1 billion units/day
- **Typical use**: 50 emails ≈ 1000 units
- **Means**: You can refresh 1000+ times/day

### Gemini API
- **Free Tier**: 60 requests/minute
- **With 50 emails**: ~50 seconds to categorize
- **Plenty** for personal use

---

## ✅ Final Checklist

Before first use:

- [ ] Created Google Cloud project
- [ ] Enabled Gmail API
- [ ] Created OAuth client ID
- [ ] Added authorized origin
- [ ] Got Gemini API key
- [ ] Updated config.js
- [ ] Committed changes
- [ ] Enabled GitHub Pages
- [ ] Waited for deployment
- [ ] Opened app in Safari
- [ ] Added to home screen
- [ ] Signed in successfully

---

## 🎉 You're Done!

Now enjoy your organized inbox with AI-powered categories!

**Tip**: Tap categories to filter. Swipe category pills to see all options.

---

## 🆘 Still Need Help?

1. Re-read this guide carefully
2. Check that URLs match exactly
3. Verify API keys in config.js
4. Try the in-app setup guide
5. Check Safari console: Develop → Show JavaScript Console

---

**Made with ❤️ for iOS** | No Mac required!
