import SwiftUI

struct EmailInboxView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @EnvironmentObject var viewModel: EmailViewModel
    @State private var showingCategories = true

    var body: some View {
        ZStack {
            VStack(spacing: 0) {
                // Header
                HStack {
                    if let email = authManager.userEmail {
                        VStack(alignment: .leading) {
                            Text("Inbox")
                                .font(.title)
                                .fontWeight(.bold)
                            Text(email)
                                .font(.caption)
                                .foregroundColor(.secondary)
                        }
                    }

                    Spacer()

                    Button(action: {
                        withAnimation {
                            showingCategories.toggle()
                        }
                    }) {
                        Image(systemName: showingCategories ? "sidebar.left" : "sidebar.right")
                            .font(.title3)
                    }

                    Button(action: {
                        viewModel.refreshEmails()
                    }) {
                        Image(systemName: "arrow.clockwise")
                            .font(.title3)
                    }
                    .disabled(viewModel.isLoading)

                    Button(action: {
                        authManager.signOut()
                    }) {
                        Image(systemName: "rectangle.portrait.and.arrow.right")
                            .font(.title3)
                    }
                }
                .padding()

                Divider()

                HStack(spacing: 0) {
                    // Category Sidebar
                    if showingCategories {
                        CategoryListView()
                            .frame(width: 250)
                            .transition(.move(edge: .leading))

                        Divider()
                    }

                    // Email List
                    EmailListView()
                }
            }

            if viewModel.isLoading {
                Color.black.opacity(0.3)
                    .ignoresSafeArea()

                VStack {
                    ProgressView()
                        .scaleEffect(1.5)
                        .padding()
                    Text("Loading and categorizing emails...")
                        .font(.headline)
                }
                .padding(30)
                .background(Color(.systemBackground))
                .cornerRadius(15)
                .shadow(radius: 10)
            }
        }
        .navigationBarHidden(true)
        .onAppear {
            if viewModel.emails.isEmpty {
                viewModel.loadEmails()
            }
        }
    }
}

struct CategoryListView: View {
    @EnvironmentObject var viewModel: EmailViewModel

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            Text("Categories")
                .font(.headline)
                .padding()

            ScrollView {
                VStack(spacing: 2) {
                    CategoryRowView(
                        category: nil,
                        title: "All Emails",
                        icon: "tray.fill",
                        color: .blue,
                        count: viewModel.emails.count,
                        isSelected: viewModel.selectedCategory == nil
                    )

                    ForEach(EmailCategory.allCases, id: \.self) { category in
                        if let count = viewModel.categoryCount[category], count > 0 {
                            CategoryRowView(
                                category: category,
                                title: category.rawValue,
                                icon: category.icon,
                                color: category.color,
                                count: count,
                                isSelected: viewModel.selectedCategory == category
                            )
                        }
                    }
                }
            }
        }
        .background(Color(.systemGroupedBackground))
    }
}

struct CategoryRowView: View {
    @EnvironmentObject var viewModel: EmailViewModel
    let category: EmailCategory?
    let title: String
    let icon: String
    let color: Color
    let count: Int
    let isSelected: Bool

    var body: some View {
        Button(action: {
            viewModel.selectCategory(category)
        }) {
            HStack {
                Image(systemName: icon)
                    .foregroundColor(color)
                    .frame(width: 24)

                Text(title)
                    .font(.subheadline)

                Spacer()

                Text("\(count)")
                    .font(.caption)
                    .foregroundColor(.secondary)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 2)
                    .background(Color(.systemGray5))
                    .cornerRadius(10)
            }
            .padding(.horizontal)
            .padding(.vertical, 12)
            .background(isSelected ? Color.blue.opacity(0.1) : Color.clear)
        }
        .buttonStyle(PlainButtonStyle())
    }
}

struct EmailListView: View {
    @EnvironmentObject var viewModel: EmailViewModel

    var body: some View {
        Group {
            if viewModel.filteredEmails.isEmpty && !viewModel.isLoading {
                VStack {
                    Image(systemName: "tray")
                        .font(.system(size: 60))
                        .foregroundColor(.gray)
                    Text("No emails in this category")
                        .font(.headline)
                        .foregroundColor(.secondary)
                        .padding()
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity)
            } else {
                List {
                    ForEach(viewModel.filteredEmails) { email in
                        EmailRowView(email: email)
                    }
                }
                .listStyle(PlainListStyle())
            }
        }
    }
}

struct EmailRowView: View {
    let email: Email

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                HStack {
                    Image(systemName: email.category.icon)
                        .foregroundColor(email.category.color)
                        .font(.caption)

                    Text(email.category.rawValue)
                        .font(.caption2)
                        .foregroundColor(email.category.color)
                }
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(email.category.color.opacity(0.1))
                .cornerRadius(8)

                Spacer()

                Text(email.formattedDate)
                    .font(.caption)
                    .foregroundColor(.secondary)
            }

            HStack(alignment: .top) {
                VStack(alignment: .leading, spacing: 4) {
                    Text(email.senderName)
                        .font(.subheadline)
                        .fontWeight(email.isRead ? .regular : .bold)
                        .lineLimit(1)

                    Text(email.subject)
                        .font(.headline)
                        .fontWeight(email.isRead ? .regular : .semibold)
                        .lineLimit(2)

                    Text(email.snippet)
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                        .lineLimit(2)
                }

                if !email.isRead {
                    Circle()
                        .fill(Color.blue)
                        .frame(width: 10, height: 10)
                }
            }
        }
        .padding(.vertical, 8)
    }
}

#Preview {
    NavigationView {
        EmailInboxView()
            .environmentObject(AuthenticationManager.shared)
            .environmentObject({
                let vm = EmailViewModel()
                vm.emails = Email.sampleEmails
                return vm
            }())
    }
}
