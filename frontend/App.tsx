import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { LandingPage } from "./components/LandingPage";
import { LoginPage } from "./components/LoginPage";
import { SignUpPage } from "./components/SignUpPage";
import { DashboardLayout } from "./components/DashboardLayout";
import { HomePage } from "./components/HomePage";
import { SandboxPage } from "./components/SandboxPage";
import { HistoryPage } from "./components/HistoryPage";
import { SettingsPage } from "./components/SettingsPage";
import Pricing from "./components/Pricing";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export interface ChatMessage {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  lastUpdated: Date;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [sandboxAutoRun, setSandboxAutoRun] = useState(false);
  const [continueSession, setContinueSession] = useState<ChatSession | null>(null);

  useEffect(() => {
    document.title = "Nava AI";
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    if (page !== "sandbox") setSandboxAutoRun(false);
  };

  const handleNavigateToSandboxWithAutoRun = () => {
    setSandboxAutoRun(true);
    setCurrentPage("sandbox");
  };

  const handleContinueChat = (session: ChatSession) => {
    setContinueSession(session);
    setCurrentPage("home");
  };

  const handleNavigateToLogin = () => {
    window.location.href = "/sign-in";
  };

  return (
    <ClerkProvider publishableKey={clerkPubKey}>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/sign-in/*" element={<LoginPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />

            <Route
              path="/"
              element={
                <>
                  <SignedIn>
                    <DashboardLayout
                      currentPage={currentPage}
                      onNavigate={handleNavigate}
                      onLogout={() => {}}
                    >
                      {currentPage === "home" && (
                        <HomePage
                          onNavigateToSandbox={handleNavigateToSandboxWithAutoRun}
                          continueSession={continueSession}
                        />
                      )}
                      {currentPage === "sandbox" && <SandboxPage autoRun={sandboxAutoRun} />}
                      {currentPage === "history" && (
                        <HistoryPage onContinueChat={handleContinueChat} />
                      )}
                      {currentPage === "settings" && <SettingsPage />}
                      {currentPage === "pricing" && <Pricing />}
                    </DashboardLayout>
                  </SignedIn>

                  <SignedOut>
                    {/* ✅ Pass onNavigateToLogin here */}
                    <LandingPage onNavigateToLogin={handleNavigateToLogin} />
                  </SignedOut>
                </>
              }
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </ClerkProvider>
  );
}
