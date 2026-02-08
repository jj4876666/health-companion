import { ReactNode, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { AccountSwitcher } from '@/components/auth/AccountSwitcher';
import { VoiceAssistant, VoiceAssistantButton } from '@/components/accessibility/VoiceAssistant';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart, Home, BookOpen, Gamepad2, AlertTriangle, 
  HandHeart, Settings, LogOut, Menu, X, WifiOff, Wifi
} from 'lucide-react';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { currentUser, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { isOnline, showOfflineAlert, dismissOfflineAlert } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [voiceAssistantOpen, setVoiceAssistantOpen] = useState(false);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', labelSw: 'Dashibodi', icon: Home },
    { path: '/quizzes', label: 'Quizzes', labelSw: 'Maswali', icon: Gamepad2 },
    { path: '/education', label: 'Education', labelSw: 'Elimu', icon: BookOpen },
    { path: '/first-aid', label: 'First Aid', labelSw: 'Msaada wa Kwanza', icon: Heart },
    { path: '/emergency', label: 'Emergency', labelSw: 'Dharura', icon: AlertTriangle },
    { path: '/donations', label: 'Donations', labelSw: 'Michango', icon: HandHeart },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Offline Alert */}
      {showOfflineAlert && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-warning text-warning-foreground p-3 flex items-center justify-center gap-2 animate-slide-down">
          <WifiOff className="w-4 h-4" />
          <span className="text-sm font-medium">{t('offline.detected')}</span>
          <button onClick={dismissOfflineAlert} className="ml-4 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Navigation */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur-sm border-b shadow-sm">
        <div className="flex items-center justify-between px-4 h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-emec flex items-center justify-center">
              <Heart className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-bold text-xl hidden sm:block">EMEC</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    size="sm"
                    className="gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden xl:inline">
                      {language === 'sw' ? item.labelSw : item.label}
                    </span>
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Online Status */}
            <Badge variant="outline" className="hidden sm:flex gap-1">
              {isOnline ? (
                <><Wifi className="w-3 h-3 text-success" /> Online</>
              ) : (
                <><WifiOff className="w-3 h-3 text-warning" /> Offline</>
              )}
            </Badge>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'en' ? 'sw' : 'en')}
              className="font-medium"
            >
              {language === 'en' ? 'SW' : 'EN'}
            </Button>

            {/* Account Switcher */}
            <AccountSwitcher />

            {/* Settings */}
            <Button variant="ghost" size="icon" asChild>
              <Link to="/settings">
                <Settings className="w-5 h-5" />
              </Link>
            </Button>

            {/* Logout */}
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-destructive">
              <LogOut className="w-5 h-5" />
            </Button>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden border-t bg-card p-4 animate-slide-down">
            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      className="w-full flex-col h-auto py-3 gap-1"
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs">
                        {language === 'sw' ? item.labelSw : item.label}
                      </span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="pb-20 lg:pb-6">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t z-40">
        <div className="grid grid-cols-5 h-16">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  isActive ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[10px]">
                  {language === 'sw' ? item.labelSw.split(' ')[0] : item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Voice Assistant Button */}
      <VoiceAssistantButton onClick={() => setVoiceAssistantOpen(true)} />

      {/* Voice Assistant Modal */}
      <VoiceAssistant 
        isOpen={voiceAssistantOpen} 
        onClose={() => setVoiceAssistantOpen(false)} 
      />

      {/* Footer (visible on desktop) */}
      <footer className="hidden lg:block text-center py-4 text-sm text-muted-foreground border-t">
        <p>© 2026 EMEC – All rights reserved</p>
        <p>Developed by Jacob Johnson & Barack Hussein, Mbita High School</p>
      </footer>
    </div>
  );
}
