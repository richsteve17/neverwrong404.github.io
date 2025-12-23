# Gmail Sorter - AI-Powered Email Categorization for iOS

An intelligent iOS Gmail client that uses Google's Gemini AI to automatically categorize your emails into meaningful groups, making inbox management effortless.

## Features

- **AI-Powered Categorization**: Uses Gemini AI to intelligently sort emails into categories
- **Multiple Categories**:
  - 🎰 Casinos - Gambling and casino promotions
  - 🔑 OTP - One-time passwords and verification codes
  - ✉️ General Correspondence - Standard communications
  - 👥 Social Media - Facebook, Twitter, Instagram, LinkedIn, etc.
  - 🛒 Shopping - E-commerce and order confirmations
  - 📣 Promotions - Marketing emails and offers
  - 💰 Finance - Banking, payments, and financial updates
  - 💼 Work - Professional emails and meetings
  - ❤️ Personal - Friends and family
  - 📰 Newsletters - Subscriptions and digests
- **Clean UI**: Beautiful, native iOS interface built with SwiftUI
- **Real-time Sync**: Fetches emails directly from Gmail API
- **Category Filtering**: View emails by category or see all at once
- **Unread Indicators**: Clear visual indicators for unread messages

## Prerequisites

Before you begin, you'll need:

1. **Xcode 15.0+** installed on your Mac
2. **iOS 16.0+** device or simulator
3. **Google Cloud Project** with Gmail API enabled
4. **Gemini API Key** from Google AI Studio

## Setup Instructions

### 1. Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Gmail API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Gmail API"
   - Click "Enable"

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "iOS" as the application type
   - Enter your bundle identifier: `com.gmailsorter.app`
   - Download the configuration file

5. Note your:
   - Client ID
   - Client Secret (for OAuth flow)

### 2. Gemini API Key Setup

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the API key for use in the app

### 3. Configure the App

1. Open `GmailSorter.xcodeproj` in Xcode

2. Update **AuthenticationManager.swift**:
   ```swift
   private let clientID = "YOUR_GOOGLE_CLIENT_ID" // Replace with your Client ID
   private let redirectURI = "com.googleusercontent.apps.YOUR_CLIENT_ID:/oauth2redirect"
   ```

   In the `exchangeCodeForToken` method:
   ```swift
   "client_secret": "YOUR_CLIENT_SECRET" // Replace with your Client Secret
   ```

3. Update **GeminiService.swift**:
   ```swift
   private let apiKey = "YOUR_GEMINI_API_KEY" // Replace with your Gemini API key
   ```

4. Update **Info.plist**:
   ```xml
   <key>CFBundleURLSchemes</key>
   <array>
       <string>com.googleusercontent.apps.YOUR_CLIENT_ID</string>
   </array>
   ```
   Replace `YOUR_CLIENT_ID` with your actual Google OAuth Client ID

### 4. Build and Run

1. Select your target device or simulator
2. Press `Cmd + R` to build and run
3. Sign in with your Google account when prompted
4. Grant permissions to access Gmail
5. Watch as your emails are automatically categorized!

## Project Structure

```
GmailSorter/
├── GmailSorter/
│   ├── Models/
│   │   ├── Email.swift              # Email data model
│   │   └── EmailCategory.swift      # Category definitions
│   ├── Services/
│   │   ├── AuthenticationManager.swift  # Google OAuth handling
│   │   ├── GmailService.swift          # Gmail API integration
│   │   └── GeminiService.swift         # Gemini AI integration
│   ├── ViewModels/
│   │   └── EmailViewModel.swift     # Business logic
│   ├── Views/
│   │   ├── ContentView.swift        # Root view
│   │   └── EmailInboxView.swift     # Main inbox interface
│   ├── Resources/
│   │   └── Assets.xcassets/
│   ├── Info.plist
│   └── GmailSorterApp.swift         # App entry point
└── GmailSorter.xcodeproj/
```

## How It Works

1. **Authentication**: Uses Google OAuth 2.0 to securely authenticate with your Gmail account
2. **Email Fetching**: Retrieves emails via the Gmail API
3. **AI Categorization**: Sends email metadata (subject, sender, preview) to Gemini AI
4. **Smart Sorting**: Gemini analyzes the content and assigns appropriate categories
5. **Display**: Shows categorized emails in a clean, organized interface

## Customization

### Adding New Categories

Edit `EmailCategory.swift` to add new categories:

```swift
enum EmailCategory: String, CaseIterable {
    case yourNewCategory = "Your Category Name"
    // ... existing categories

    var color: Color {
        switch self {
        case .yourNewCategory:
            return .purple
        // ...
        }
    }

    var icon: String {
        switch self {
        case .yourNewCategory:
            return "star.fill"
        // ...
        }
    }
}
```

Then update the categorization prompt in `GeminiService.swift`.

### Adjusting Email Fetch Limit

In `EmailInboxView.swift`, modify the `loadEmails()` call:

```swift
GmailService.shared.fetchEmails(maxResults: 100) // Change this number
```

## Privacy & Security

- **No Email Storage**: Emails are fetched on-demand and not stored permanently
- **Local Processing**: All categorization happens via API calls; no data is stored on external servers
- **OAuth 2.0**: Secure authentication without storing passwords
- **API Keys**: Keep your API keys secure and never commit them to version control

## Troubleshooting

### Authentication Issues
- Verify your Client ID and Client Secret are correct
- Ensure the redirect URI matches exactly in both the code and Google Cloud Console
- Check that Gmail API is enabled in your Google Cloud project

### Categorization Not Working
- Verify your Gemini API key is valid
- Check your API quota in Google AI Studio
- Review network connectivity

### Build Errors
- Ensure you're using Xcode 15.0 or later
- Clean the build folder: `Cmd + Shift + K`
- Reset package cache if needed

## Future Enhancements

- [ ] Local caching for offline viewing
- [ ] Email search functionality
- [ ] Swipe actions (archive, delete, mark as read)
- [ ] Push notifications for new emails
- [ ] Multiple account support
- [ ] Custom category creation
- [ ] Batch categorization improvements
- [ ] Email threading support

## License

This project is provided as-is for educational and personal use.

## Contributing

Feel free to submit issues and enhancement requests!

## Acknowledgments

- Built with SwiftUI
- Powered by Google Gmail API
- AI categorization by Google Gemini
- Icons from SF Symbols

---

**Note**: This is a client application and requires valid API credentials to function. Make sure to keep your credentials secure and follow Google's API usage policies.
