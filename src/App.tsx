import { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { AppProvider } from "@/contexts/AppContext";
import { SplashScreen } from "@/components/splash/SplashScreen";
import { LoginPage } from "@/components/auth/LoginPage";
import { OfflineChatbot, ChatButton } from "@/components/chat/OfflineChatbot";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Education from "./pages/Education";
import Calculators from "./pages/Calculators";
import FirstAid from "./pages/FirstAid";
import Emergency from "./pages/Emergency";
import Quizzes from "./pages/Quizzes";
import Donations from "./pages/Donations";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showChatbot, setShowChatbot] = useState(false);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <AppProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              {showSplash && (
                <SplashScreen onComplete={() => setShowSplash(false)} />
              )}
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/education" element={<Education />} />
                  <Route path="/calculators" element={<Calculators />} />
                  <Route path="/first-aid" element={<FirstAid />} />
                  <Route path="/emergency" element={<Emergency />} />
                  <Route path="/quizzes" element={<Quizzes />} />
                  <Route path="/donations" element={<Donations />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
              
              {/* Offline Chatbot */}
              <ChatButton onClick={() => setShowChatbot(true)} />
              <OfflineChatbot isOpen={showChatbot} onClose={() => setShowChatbot(false)} />
            </TooltipProvider>
          </AppProvider>
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
