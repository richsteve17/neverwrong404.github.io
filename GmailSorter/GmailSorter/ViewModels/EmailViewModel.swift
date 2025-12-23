import Foundation
import Combine

class EmailViewModel: ObservableObject {
    @Published var emails: [Email] = []
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var selectedCategory: EmailCategory?

    private var cancellables = Set<AnyCancellable>()

    var categorizedEmails: [EmailCategory: [Email]] {
        Dictionary(grouping: emails, by: { $0.category })
    }

    var filteredEmails: [Email] {
        if let category = selectedCategory {
            return emails.filter { $0.category == category }
        }
        return emails
    }

    var categoryCount: [EmailCategory: Int] {
        Dictionary(
            EmailCategory.allCases.map { category in
                (category, emails.filter { $0.category == category }.count)
            },
            uniquingKeysWith: { first, _ in first }
        )
    }

    func loadEmails() {
        isLoading = true
        errorMessage = nil

        GmailService.shared.fetchEmails(maxResults: 100) { [weak self] result in
            switch result {
            case .success(let fetchedEmails):
                self?.categorizeEmails(fetchedEmails)
            case .failure(let error):
                DispatchQueue.main.async {
                    self?.isLoading = false
                    self?.errorMessage = error.localizedDescription
                }
            }
        }
    }

    private func categorizeEmails(_ emails: [Email]) {
        GeminiService.shared.categorizeEmails(emails) { [weak self] categorizedEmails in
            DispatchQueue.main.async {
                self?.emails = categorizedEmails
                self?.isLoading = false
            }
        }
    }

    func refreshEmails() {
        emails = []
        loadEmails()
    }

    func selectCategory(_ category: EmailCategory?) {
        selectedCategory = category
    }
}
