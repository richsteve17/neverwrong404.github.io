import Foundation

class GeminiService {
    static let shared = GeminiService()

    private let apiKey = "YOUR_GEMINI_API_KEY" // Replace with your Gemini API key
    private let baseURL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"

    private init() {}

    func categorizeEmail(_ email: Email, completion: @escaping (EmailCategory) -> Void) {
        let prompt = buildCategorizationPrompt(email: email)

        guard let url = URL(string: "\(baseURL)?key=\(apiKey)") else {
            completion(.uncategorized)
            return
        }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let requestBody: [String: Any] = [
            "contents": [
                [
                    "parts": [
                        ["text": prompt]
                    ]
                ]
            ],
            "generationConfig": [
                "temperature": 0.1,
                "maxOutputTokens": 50
            ]
        ]

        do {
            request.httpBody = try JSONSerialization.data(withJSONObject: requestBody)
        } catch {
            print("Error creating request body: \(error)")
            completion(.uncategorized)
            return
        }

        URLSession.shared.dataTask(with: request) { data, response, error in
            guard let data = data, error == nil else {
                print("Error calling Gemini API: \(error?.localizedDescription ?? "Unknown error")")
                completion(.uncategorized)
                return
            }

            do {
                let category = try self.parseCategoryResponse(data)
                DispatchQueue.main.async {
                    completion(category)
                }
            } catch {
                print("Error parsing response: \(error)")
                completion(.uncategorized)
            }
        }.resume()
    }

    func categorizeEmails(_ emails: [Email], completion: @escaping ([Email]) -> Void) {
        let group = DispatchGroup()
        var categorizedEmails: [Email] = []

        for var email in emails {
            group.enter()
            categorizeEmail(email) { category in
                email.category = category
                categorizedEmails.append(email)
                group.leave()
            }
        }

        group.notify(queue: .main) {
            // Sort to maintain original order
            let sortedEmails = categorizedEmails.sorted { emails.firstIndex(where: { $0.id == $0.id })! < emails.firstIndex(where: { $0.id == $1.id })! }
            completion(sortedEmails)
        }
    }

    private func buildCategorizationPrompt(email: Email) -> String {
        let categories = EmailCategory.allCases.map { $0.rawValue }.joined(separator: ", ")

        return """
        Categorize the following email into one of these categories: \(categories)

        Email Details:
        From: \(email.from)
        Subject: \(email.subject)
        Preview: \(email.snippet)

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
        - "General Correspondence" for general communication that doesn't fit other categories
        - "Uncategorized" only if none of the above apply

        Respond with ONLY the category name, nothing else. Be strict and accurate.
        """
    }

    private func parseCategoryResponse(_ data: Data) throws -> EmailCategory {
        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let candidates = json["candidates"] as? [[String: Any]],
              let firstCandidate = candidates.first,
              let content = firstCandidate["content"] as? [String: Any],
              let parts = content["parts"] as? [[String: Any]],
              let firstPart = parts.first,
              let text = firstPart["text"] as? String else {
            throw NSError(domain: "GeminiService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid response format"])
        }

        // Clean up the response text
        let cleanedText = text.trimmingCharacters(in: .whitespacesAndNewlines)

        // Try to match to a category
        for category in EmailCategory.allCases {
            if cleanedText.lowercased().contains(category.rawValue.lowercased()) {
                return category
            }
        }

        return .uncategorized
    }
}
