import Foundation

struct Email: Identifiable, Codable {
    let id: String
    let threadId: String
    let subject: String
    let from: String
    let snippet: String
    let date: Date
    let isRead: Bool
    var category: EmailCategory
    let labels: [String]

    init(id: String, threadId: String, subject: String, from: String, snippet: String, date: Date, isRead: Bool, category: EmailCategory = .uncategorized, labels: [String] = []) {
        self.id = id
        self.threadId = threadId
        self.subject = subject
        self.from = from
        self.snippet = snippet
        self.date = date
        self.isRead = isRead
        self.category = category
        self.labels = labels
    }

    var formattedDate: String {
        let formatter = RelativeDateTimeFormatter()
        formatter.unitsStyle = .abbreviated
        return formatter.localizedString(for: date, relativeTo: Date())
    }

    var senderName: String {
        // Extract name from email format "Name <email@example.com>"
        if let nameRange = from.range(of: "^[^<]+", options: .regularExpression) {
            return String(from[nameRange]).trimmingCharacters(in: .whitespaces)
        }
        return from
    }

    var senderEmail: String {
        // Extract email from format "Name <email@example.com>"
        if let emailRange = from.range(of: "<(.+)>", options: .regularExpression) {
            let email = from[emailRange]
            return String(email.dropFirst().dropLast())
        }
        return from
    }
}

// Sample data for preview
extension Email {
    static let sampleEmails: [Email] = [
        Email(
            id: "1",
            threadId: "t1",
            subject: "Your Verification Code",
            from: "Amazon <no-reply@amazon.com>",
            snippet: "Your verification code is 123456. Do not share this code with anyone.",
            date: Date().addingTimeInterval(-3600),
            isRead: false,
            category: .otp
        ),
        Email(
            id: "2",
            threadId: "t2",
            subject: "Big Win Bonus Inside!",
            from: "Lucky Casino <promotions@luckycasino.com>",
            snippet: "Claim your 200% welcome bonus now! Start playing today...",
            date: Date().addingTimeInterval(-7200),
            isRead: true,
            category: .casino
        ),
        Email(
            id: "3",
            threadId: "t3",
            subject: "Meeting Tomorrow at 2 PM",
            from: "John Doe <john@company.com>",
            snippet: "Hi, just confirming our meeting tomorrow at 2 PM to discuss the project...",
            date: Date().addingTimeInterval(-86400),
            isRead: false,
            category: .work
        ),
        Email(
            id: "4",
            threadId: "t4",
            subject: "New friend request from Sarah",
            from: "Facebook <notification@facebook.com>",
            snippet: "Sarah Johnson sent you a friend request on Facebook...",
            date: Date().addingTimeInterval(-172800),
            isRead: true,
            category: .socialMedia
        )
    ]
}
