import Foundation
import SwiftUI

enum EmailCategory: String, CaseIterable, Codable {
    case casino = "Casinos"
    case otp = "OTP"
    case generalCorrespondence = "General Correspondence"
    case socialMedia = "Social Media"
    case shopping = "Shopping"
    case promotions = "Promotions"
    case finance = "Finance"
    case work = "Work"
    case personal = "Personal"
    case newsletters = "Newsletters"
    case uncategorized = "Uncategorized"

    var color: Color {
        switch self {
        case .casino:
            return .purple
        case .otp:
            return .orange
        case .generalCorrespondence:
            return .blue
        case .socialMedia:
            return .pink
        case .shopping:
            return .green
        case .promotions:
            return .yellow
        case .finance:
            return .red
        case .work:
            return .indigo
        case .personal:
            return .teal
        case .newsletters:
            return .cyan
        case .uncategorized:
            return .gray
        }
    }

    var icon: String {
        switch self {
        case .casino:
            return "suit.spade.fill"
        case .otp:
            return "key.fill"
        case .generalCorrespondence:
            return "envelope.fill"
        case .socialMedia:
            return "person.2.fill"
        case .shopping:
            return "cart.fill"
        case .promotions:
            return "megaphone.fill"
        case .finance:
            return "dollarsign.circle.fill"
        case .work:
            return "briefcase.fill"
        case .personal:
            return "heart.fill"
        case .newsletters:
            return "newspaper.fill"
        case .uncategorized:
            return "questionmark.circle.fill"
        }
    }
}
