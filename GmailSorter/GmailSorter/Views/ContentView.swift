import SwiftUI

struct ContentView: View {
    @EnvironmentObject var authManager: AuthenticationManager
    @StateObject private var viewModel = EmailViewModel()

    var body: some View {
        NavigationView {
            if authManager.isAuthenticated {
                EmailInboxView()
                    .environmentObject(viewModel)
            } else {
                LoginView()
            }
        }
    }
}

struct LoginView: View {
    @EnvironmentObject var authManager: AuthenticationManager

    var body: some View {
        VStack(spacing: 30) {
            Image(systemName: "envelope.fill")
                .font(.system(size: 80))
                .foregroundColor(.blue)

            Text("Gmail Sorter")
                .font(.largeTitle)
                .fontWeight(.bold)

            Text("Organize your emails intelligently with Gemini AI")
                .font(.subheadline)
                .foregroundColor(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal)

            Button(action: {
                authManager.signIn()
            }) {
                HStack {
                    Image(systemName: "person.circle.fill")
                    Text("Sign in with Google")
                }
                .font(.headline)
                .foregroundColor(.white)
                .padding()
                .frame(maxWidth: .infinity)
                .background(Color.blue)
                .cornerRadius(10)
            }
            .padding(.horizontal, 40)
            .padding(.top, 20)
        }
        .padding()
    }
}

#Preview {
    ContentView()
        .environmentObject(AuthenticationManager.shared)
}
