import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";
import { PremiumProvider } from "@/contexts/PremiumContext";
import { DemoProvider } from "@/contexts/DemoContext";
import { AccessibilityProvider } from "@/contexts/AccessibilityContext";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { LoginPage } from "@/components/auth/LoginPage";
import { FloatingAIAssistant } from "@/components/chat/FloatingAIAssistant";
import { DemoControls } from "@/components/demo/DemoControls";
import Dashboard from "./pages/Dashboard";
import Education from "./pages/Education";
import Calculators from "./pages/Calculators";
import FirstAid from "./pages/FirstAid";
import Emergency from "./pages/Emergency";
import Quizzes from "./pages/Quizzes";
import Donations from "./pages/Donations";
import Settings from "./pages/Settings";
import Consultation from "./pages/Consultation";
import Medications from "./pages/Medications";
import Games from "./pages/Games";
import Pharmacy from "./pages/Pharmacy";
import AccessibilityPage from "./pages/Accessibility";
import HelpCenter from "./pages/HelpCenter";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route wrapper
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// Public Route wrapper (redirects to dashboard if already logged in)
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/education" element={<ProtectedRoute><Education /></ProtectedRoute>} />
      <Route path="/calculators" element={<ProtectedRoute><Calculators /></ProtectedRoute>} />
      <Route path="/first-aid" element={<ProtectedRoute><FirstAid /></ProtectedRoute>} />
      <Route path="/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
      <Route path="/quizzes" element={<ProtectedRoute><Quizzes /></ProtectedRoute>} />
      <Route path="/donations" element={<ProtectedRoute><Donations /></ProtectedRoute>} />
      <Route path="/consultation" element={<ProtectedRoute><Consultation /></ProtectedRoute>} />
      <Route path="/medications" element={<ProtectedRoute><Medications /></ProtectedRoute>} />
      <Route path="/games" element={<ProtectedRoute><Games /></ProtectedRoute>} />
      <Route path="/pharmacy" element={<ProtectedRoute><Pharmacy /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/accessibility" element={<ProtectedRoute><AccessibilityPage /></ProtectedRoute>} />
      <Route path="/help" element={<ProtectedRoute><HelpCenter /></ProtectedRoute>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <AppProvider>
            <PremiumProvider>
              <DemoProvider>
                <AccessibilityProvider>
                  <TooltipProvider>
                    <Toaster />
                    <Sonner />
                    {showSplash ? (
                      <SplashScreen onComplete={() => setShowSplash(false)} />
                    ) : (
                      <BrowserRouter>
                        <AppRoutes />
                        <DemoControls />
                        <FloatingAIAssistant />
                      </BrowserRouter>
                    )}
                  </TooltipProvider>
                </AccessibilityProvider>
              </DemoProvider>
            </PremiumProvider>
          </AppProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
