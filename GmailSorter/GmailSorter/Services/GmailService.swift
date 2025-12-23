import Foundation

class GmailService {
    static let shared = GmailService()

    private let baseURL = "https://gmail.googleapis.com/gmail/v1/users/me"

    private init() {}

    func fetchEmails(maxResults: Int = 50, completion: @escaping (Result<[Email], Error>) -> Void) {
        guard let token = AuthenticationManager.shared.accessToken else {
            completion(.failure(NSError(domain: "GmailService", code: 401, userInfo: [NSLocalizedDescriptionKey: "Not authenticated"])))
            return
        }

        let url = URL(string: "\(baseURL)/messages?maxResults=\(maxResults)")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { [weak self] data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "GmailService", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }

            do {
                if let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
                   let messages = json["messages"] as? [[String: String]] {
                    self?.fetchEmailDetails(messageIds: messages.compactMap { $0["id"] }, completion: completion)
                } else {
                    completion(.success([]))
                }
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    private func fetchEmailDetails(messageIds: [String], completion: @escaping (Result<[Email], Error>) -> Void) {
        let group = DispatchGroup()
        var emails: [Email] = []
        var fetchError: Error?

        for messageId in messageIds {
            group.enter()
            fetchEmailDetail(messageId: messageId) { result in
                switch result {
                case .success(let email):
                    emails.append(email)
                case .failure(let error):
                    fetchError = error
                }
                group.leave()
            }
        }

        group.notify(queue: .main) {
            if let error = fetchError {
                completion(.failure(error))
            } else {
                // Sort by date, newest first
                let sortedEmails = emails.sorted { $0.date > $1.date }
                completion(.success(sortedEmails))
            }
        }
    }

    private func fetchEmailDetail(messageId: String, completion: @escaping (Result<Email, Error>) -> Void) {
        guard let token = AuthenticationManager.shared.accessToken else {
            completion(.failure(NSError(domain: "GmailService", code: 401, userInfo: [NSLocalizedDescriptionKey: "Not authenticated"])))
            return
        }

        let url = URL(string: "\(baseURL)/messages/\(messageId)")!
        var request = URLRequest(url: url)
        request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")

        URLSession.shared.dataTask(with: request) { data, response, error in
            if let error = error {
                completion(.failure(error))
                return
            }

            guard let data = data else {
                completion(.failure(NSError(domain: "GmailService", code: -1, userInfo: [NSLocalizedDescriptionKey: "No data received"])))
                return
            }

            do {
                let email = try self.parseEmailFromJSON(data)
                completion(.success(email))
            } catch {
                completion(.failure(error))
            }
        }.resume()
    }

    private func parseEmailFromJSON(_ data: Data) throws -> Email {
        guard let json = try JSONSerialization.jsonObject(with: data) as? [String: Any],
              let id = json["id"] as? String,
              let threadId = json["threadId"] as? String,
              let payload = json["payload"] as? [String: Any],
              let headers = payload["headers"] as? [[String: String]],
              let snippet = json["snippet"] as? String else {
            throw NSError(domain: "GmailService", code: -1, userInfo: [NSLocalizedDescriptionKey: "Invalid email format"])
        }

        // Extract headers
        let subject = headers.first(where: { $0["name"]?.lowercased() == "subject" })?["value"] ?? "(No Subject)"
        let from = headers.first(where: { $0["name"]?.lowercased() == "from" })?["value"] ?? "Unknown Sender"
        let dateString = headers.first(where: { $0["name"]?.lowercased() == "date" })?["value"] ?? ""

        // Parse date
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "EEE, dd MMM yyyy HH:mm:ss Z"
        let date = dateFormatter.date(from: dateString) ?? Date()

        // Check if read
        let labelIds = json["labelIds"] as? [String] ?? []
        let isRead = !labelIds.contains("UNREAD")

        return Email(
            id: id,
            threadId: threadId,
            subject: subject,
            from: from,
            snippet: snippet,
            date: date,
            isRead: isRead,
            category: .uncategorized,
            labels: labelIds
        )
    }
}
