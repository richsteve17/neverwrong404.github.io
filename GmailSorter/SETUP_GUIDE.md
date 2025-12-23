# Quick Setup Guide for Gmail Sorter

Follow these steps to get your Gmail Sorter app up and running!

## 📋 Checklist

- [ ] Google Cloud Project created
- [ ] Gmail API enabled
- [ ] OAuth 2.0 credentials created
- [ ] Gemini API key obtained
- [ ] App configuration updated
- [ ] App built and running

## 🚀 Quick Start

### Step 1: Google Cloud Setup (5 minutes)

1. **Create a Google Cloud Project**
   - Go to https://console.cloud.google.com/
   - Click "New Project"
   - Name it "Gmail Sorter" (or your preferred name)
   - Click "Create"

2. **Enable Gmail API**
   - In your project, go to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click on it and press "Enable"

3. **Create OAuth Credentials**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - If prompted, configure the OAuth consent screen:
     - Choose "External"
     - Fill in app name: "Gmail Sorter"
     - Add your email
     - Click "Save and Continue"
   - Back to creating OAuth client ID:
     - Application type: "iOS"
     - Name: "Gmail Sorter iOS"
     - Bundle ID: `com.gmailsorter.app`
   - Click "Create"
   - **Save your Client ID** - you'll need this!

4. **Get Client Secret**
   - You might need to create a "Web application" type credential temporarily to get a client secret
   - Or use the iOS credential and check if a secret is provided
   - **Save your Client Secret**

### Step 2: Gemini API Setup (2 minutes)

1. Visit https://makersuite.google.com/app/apikey
2. Click "Create API Key"
3. Select your Google Cloud project (the one you just created)
4. Click "Create API key in existing project"
5. **Copy and save your API key**

### Step 3: Configure the App (3 minutes)

Open the project in Xcode and update these 3 files:

#### 1. `GmailSorter/Services/AuthenticationManager.swift`

Find line ~10 and replace:
```swift
private let clientID = "YOUR_GOOGLE_CLIENT_ID"
```
With your actual Client ID:
```swift
private let clientID = "123456789-abcdefghijklmnop.apps.googleusercontent.com"
```

Find line ~12 and replace:
```swift
private let redirectURI = "com.googleusercontent.apps.YOUR_CLIENT_ID:/oauth2redirect"
```
With your Client ID:
```swift
private let redirectURI = "com.googleusercontent.apps.123456789-abcdefghijklmnop:/oauth2redirect"
```

Find line ~70 (in the `exchangeCodeForToken` method) and replace:
```swift
"client_secret": "YOUR_CLIENT_SECRET"
```
With your actual Client Secret:
```swift
"client_secret": "GOCSPX-your-actual-client-secret-here"
```

#### 2. `GmailSorter/Services/GeminiService.swift`

Find line ~6 and replace:
```swift
private let apiKey = "YOUR_GEMINI_API_KEY"
```
With your Gemini API key:
```swift
private let apiKey = "AIzaSyYourActualGeminiAPIKeyHere"
```

#### 3. `GmailSorter/Info.plist`

Find this section:
```xml
<string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
```

Replace with your Client ID:
```xml
<string>com.googleusercontent.apps.123456789-abcdefghijklmnop</string>
```

### Step 4: Build and Run! (1 minute)

1. Connect your iPhone or select a simulator
2. Press `Cmd + R` or click the Play button
3. The app will build and launch
4. Tap "Sign in with Google"
5. Sign in with your Gmail account
6. Grant permissions when prompted
7. Watch your emails get categorized! 🎉

## 🔍 Verification

After setup, you should see:
- ✅ Login screen on first launch
- ✅ Google sign-in flow
- ✅ Email list loading
- ✅ Categories appearing in the sidebar
- ✅ Emails sorted into categories

## ⚠️ Common Issues

### "Invalid Client ID"
- Double-check your Client ID is correct
- Make sure there are no extra spaces
- Verify it matches in all 3 places (AuthenticationManager.swift x2, Info.plist)

### "Authorization Error"
- Check that Gmail API is enabled in Google Cloud Console
- Verify your OAuth consent screen is configured
- Make sure you're using the correct Google account

### "Categorization Not Working"
- Verify your Gemini API key is valid
- Check you have quota remaining in Google AI Studio
- Ensure you're connected to the internet

### Build Errors
- Make sure you're using Xcode 15.0+
- Clean build folder: `Cmd + Shift + K`
- Restart Xcode

## 📱 Test the App

Try these actions to verify everything works:

1. **Sign In**: Tap "Sign in with Google" and complete authentication
2. **View Categories**: Check that the sidebar shows category counts
3. **Filter Emails**: Tap different categories to filter emails
4. **Refresh**: Tap the refresh button to reload emails
5. **Check Details**: Verify emails show sender, subject, and preview

## 🎯 Next Steps

Once everything is working:

- Star/favorite important emails (future feature)
- Customize categories in `EmailCategory.swift`
- Adjust the number of emails fetched
- Explore the code and make it your own!

## 💡 Tips

- **Keep API Keys Secret**: Never commit them to git or share publicly
- **Test with Few Emails**: Start with a small batch to verify categorization
- **Rate Limits**: Be aware of Gmail API and Gemini API rate limits
- **Development Mode**: Google OAuth consent screen in development mode limits to test users

## 🆘 Need Help?

If you encounter issues:

1. Check the Xcode console for error messages
2. Verify all API keys and credentials
3. Review the main README.md for detailed information
4. Check Google Cloud Console for API quotas and errors

---

**Estimated Setup Time**: 10-15 minutes

Happy email sorting! 📧✨
