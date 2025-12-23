import Foundation
import AuthenticationServices

class AuthenticationManager: ObservableObject {
    static let shared = AuthenticationManager()

    @Published var isAuthenticated = false
    @Published var userEmail: String?
    @Published var accessToken: String?

    private let clientID = "YOUR_GOOGLE_CLIENT_ID" // Replace with your Google OAuth Client ID
    private let redirectURI = "com.googleusercontent.apps.YOUR_CLIENT_ID:/oauth2redirect"

    private init() {
        // Check if we have a stored token
        loadStoredToken()
    }

    func signIn() {
        let authURL = buildAuthURL()

        guard let url = URL(string: authURL) else {
            print("Invalid auth URL")
            return
        }

        let session = ASWebAuthenticationSession(
            url: url,
            callbackURLScheme: "com.googleusercontent.apps"
        ) { [weak self] callbackURL, error in
            guard error == nil, let callbackURL = callbackURL else {
                print("Authentication error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }

            self?.handleAuthCallback(url: callbackURL)
        }

        session.presentationContextProvider = ASWebAuthenticationPresentationContextProvider()
        session.start()
    }

    func signOut() {
        accessToken = nil
        userEmail = nil
        isAuthenticated = false
        UserDefaults.standard.removeObject(forKey: "gmail_access_token")
        UserDefaults.standard.removeObject(forKey: "gmail_user_email")
    }

    private func buildAuthURL() -> String {
        let scope = "https://www.googleapis.com/auth/gmail.readonly"
        let authEndpoint = "https://accounts.google.com/o/oauth2/v2/auth"

        var components = URLComponents(string: authEndpoint)!
        components.queryItems = [
            URLQueryItem(name: "client_id", value: clientID),
            URLQueryItem(name: "redirect_uri", value: redirectURI),
            URLQueryItem(name: "response_type", value: "code"),
            URLQueryItem(name: "scope", value: scope),
            URLQueryItem(name: "access_type", value: "offline")
        ]

        return components.url!.absoluteString
    }

    private func handleAuthCallback(url: URL) {
        guard let components = URLComponents(url: url, resolvingAgainstBaseURL: false),
              let queryItems = components.queryItems else {
            return
        }

        // Extract authorization code
        if let code = queryItems.first(where: { $0.name == "code" })?.value {
            exchangeCodeForToken(code: code)
        }
    }

    private func exchangeCodeForToken(code: String) {
        let tokenEndpoint = "https://oauth2.googleapis.com/token"

        var request = URLRequest(url: URL(string: tokenEndpoint)!)
        request.httpMethod = "POST"
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")

        let params = [
            "code": code,
            "client_id": clientID,
            "client_secret": "YOUR_CLIENT_SECRET", // Replace with your client secret
            "redirect_uri": redirectURI,
            "grant_type": "authorization_code"
        ]

        let bodyString = params.map { "\($0.key)=\($0.value)" }.joined(separator: "&")
        request.httpBody = bodyString.data(using: .utf8)

        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            guard let data = data, error == nil else {
                print("Token exchange error: \(error?.localizedDescription ?? "Unknown error")")
                return
            }

            do {
                if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let accessToken = json["access_token"] as? String {
                    DispatchQueue.main.async {
                        self?.accessToken = accessToken
                        self?.isAuthenticated = true
                        self?.saveToken(accessToken)
                        self?.fetchUserEmail()
                    }
                }
            } catch {
                print("JSON parsing error: \(error)")
            }
        }.resume()
    }

    private func fetchUserEmail() {
        guard let token = accessToken else { return }

        let url = URL(string: "https://gmail.googleapis.com/gmail/v1/users/me/profile")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { [weak self] data, _, error in
            guard let data = data, error == nil else { return }

            do {
                if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let email = json["emailAddress"] as? String {
                    DispatchQueue.main.async {
                        self?.userEmail = email
                        self?.saveUserEmail(email)
                    }
                }
            } catch {
                print("Error fetching user email: \(error)")
            }
        }.resume()
    }

    private func saveToken(_ token: String) {
        UserDefaults.standard.set(token, forKey: "gmail_access_token")
    }

    private func saveUserEmail(_ email: String) {
        UserDefaults.standard.set(email, forKey: "gmail_user_email")
    }

    private func loadStoredToken() {
        if let token = UserDefaults.standard.string(forKey: "gmail_access_token"),
           let email = UserDefaults.standard.string(forKey: "gmail_user_email") {
            accessToken = token
            userEmail = email
            isAuthenticated = true
        }
    }
}

// Helper for presentation context
class ASWebAuthenticationPresentationContextProvider: NSObject, ASWebAuthenticationPresentationContextProviding {
    func presentationAnchor(for session: ASWebAuthenticationSession) -> ASPresentationAnchor {
        return ASPresentationAnchor()
    }
}
