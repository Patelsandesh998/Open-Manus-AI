import { SignIn } from "@clerk/clerk-react";
import { ShiningStars } from "./ShiningStars";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* ---------------- BACKGROUND ANIMATION ---------------- */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/60 via-black/40 to-blue-900/60 z-10" />
        <div className="absolute inset-0 z-0">
          <div
            className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "4s" }}
          />
          <div
            className="absolute top-40 right-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "6s", animationDelay: "2s" }}
          />
          <div
            className="absolute bottom-32 left-32 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "5s", animationDelay: "1s" }}
          />
          <div
            className="absolute bottom-20 right-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDuration: "7s", animationDelay: "3s" }}
          />
        </div>
      </div>

      {/* ---------------- NAVA AI LOGO ---------------- */}
      <div className="absolute top-6 left-6 z-20 flex items-center space-x-3">
        <ShiningStars size="small" count={15} />
        <span className="text-white font-medium text-lg">Nava AI</span>
      </div>

      {/* ---------------- LOGIN CARD ---------------- */}
      <div className="flex items-center justify-center min-h-screen p-4 relative z-20">
        <div className="w-full max-w-sm">
          <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 shadow-2xl">
            {/* Sparkle Header */}
            <div className="flex justify-center mb-2">
              <ShiningStars size="medium" count={20} />
            </div>

            {/* Header Text */}
            <div className="text-center mb-3">
              <h1 className="text-white text-xl mb-1">Sign in to Nava AI</h1>
              <p className="text-gray-300 text-sm">
                No waitlist — start creating now
              </p>
            </div>

            {/* ---------------- CLERK SIGN-IN FORM ---------------- */}
            <div className="flex justify-center mt-4">
              <SignIn
                path="/sign-in"
                routing="path"
                signUpUrl="/sign-up"
                appearance={{
                  elements: {
                    rootBox:
                      "bg-transparent w-full flex justify-center items-center",
                    card:
                      "bg-transparent shadow-none border-none w-full text-white",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton:
                      "bg-white/10 hover:bg-white/20 text-white rounded-xl py-2 text-sm transition-all duration-200 backdrop-blur-sm",
                    formFieldInput:
                      "bg-white/10 border-white/20 text-white placeholder:text-gray-400 rounded-xl focus:border-white/40",
                    formButtonPrimary:
                      "bg-white text-black hover:bg-gray-100 rounded-xl py-2 text-sm transition-all duration-200",
                    footerActionText: "text-gray-400 text-sm",
                    footerActionLink:
                      "text-white hover:underline hover:text-white",
                  },
                }}
              />
            </div>

            {/* ---------------- FOOTER ---------------- */}
            <div className="mt-6 text-center space-y-3">
              <div className="flex justify-center space-x-3 text-xs text-gray-500">
                <button className="hover:text-gray-300 transition-colors">
                  Terms of Service
                </button>
                <span>|</span>
                <button className="hover:text-gray-300 transition-colors">
                  Privacy Policy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
