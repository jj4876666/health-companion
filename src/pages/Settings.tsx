import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useApp } from '@/contexts/AppContext';
import { useTheme, colorSchemes } from '@/contexts/ThemeContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Settings as SettingsIcon, Moon, Sun, Globe, Mic, MicOff, 
  Bell, RefreshCcw, LogOut, User, Shield, Palette, Volume2, Scale, Check
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { LegalNotices } from '@/components/legal/LegalNotices';

export default function Settings() {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const { resetDemoData } = useApp();
  const { backgroundColor, setBackgroundColor, resetBackgroundColor } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [micEnabled, setMicEnabled] = useState(false);
  const [notifications, setNotifications] = useState(true);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
    toast({
      title: `${newTheme === 'dark' ? 'Dark' : 'Light'} Mode Enabled`,
      description: "Theme preference saved",
    });
  };

  const toggleMic = () => {
    setMicEnabled(!micEnabled);
    toast({
      title: micEnabled ? "Microphone Disabled" : "Microphone Enabled",
      description: micEnabled 
        ? "Speech-to-text is now off" 
        : "You can now use voice input (simulated)",
    });
  };

  const handleResetDemo = () => {
    if (window.confirm('Are you sure you want to reset all demo data? This will log you out.')) {
      resetDemoData();
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center">
            <SettingsIcon className="w-7 h-7 text-muted-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t('settings.title')}</h1>
            <p className="text-muted-foreground">Customize your experience</p>
          </div>
        </div>

        {/* Profile Card */}
        <Card className="border-0 shadow-elegant">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center">
                <User className="w-8 h-8 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{currentUser?.name}</h3>
                <p className="text-muted-foreground capitalize">{currentUser?.role}</p>
              </div>
              <Shield className="w-6 h-6 text-success" />
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="border-0 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {theme === 'light' ? (
                  <Sun className="w-5 h-5 text-warning" />
                ) : (
                  <Moon className="w-5 h-5 text-primary" />
                )}
                <div>
                  <p className="font-medium">{t('settings.theme')}</p>
                  <p className="text-sm text-muted-foreground">
                    {theme === 'light' ? t('settings.light') : t('settings.dark')}
                  </p>
                </div>
              </div>
              <Switch checked={theme === 'dark'} onCheckedChange={toggleTheme} />
            </div>

            {/* Background Color Picker */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-base font-medium">Background Color</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    resetBackgroundColor();
                    toast({
                      title: "Reset to Default",
                      description: "Background color has been reset",
                    });
                  }}
                >
                  Reset
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Choose a background color that suits your preference. All colors maintain text clarity.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colorSchemes.map((scheme) => (
                  <button
                    key={scheme.id}
                    onClick={() => {
                      console.log('[SETTINGS] Changing background to:', scheme.id, scheme.name);
                      setBackgroundColor(scheme.id);
                      toast({
                        title: "Background Updated",
                        description: `Changed to ${scheme.name}`,
                      });
                    }}
                    className={`relative p-4 rounded-lg border-2 transition-all hover:scale-105 ${
                      backgroundColor === scheme.id
                        ? 'border-primary ring-2 ring-primary/20'
                        : 'border-border hover:border-primary/50'
                    }`}
                    style={{ backgroundColor: scheme.preview }}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div
                        className="w-12 h-12 rounded-full border-2 border-border"
                        style={{ backgroundColor: scheme.preview }}
                      />
                      <span className="text-xs font-medium text-foreground">
                        {scheme.name}
                      </span>
                      {backgroundColor === scheme.id && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language */}
        <Card className="border-0 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5" />
              {t('settings.language')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={language === 'en' ? 'default' : 'outline'}
                className="h-auto py-4 flex-col gap-2"
                onClick={() => setLanguage('en')}
              >
                <span className="text-2xl">🇬🇧</span>
                <span>English</span>
              </Button>
              <Button
                variant={language === 'sw' ? 'default' : 'outline'}
                className="h-auto py-4 flex-col gap-2"
                onClick={() => setLanguage('sw')}
              >
                <span className="text-2xl">🇰🇪</span>
                <span>Kiswahili</span>
              </Button>
              <Button
                variant={language === 'fr' ? 'default' : 'outline'}
                className="h-auto py-4 flex-col gap-2"
                onClick={() => setLanguage('fr')}
              >
                <span className="text-2xl">🇫🇷</span>
                <span>Français</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Accessibility */}
        <Card className="border-0 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Volume2 className="w-5 h-5" />
              Accessibility
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Microphone Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                {micEnabled ? (
                  <Mic className="w-5 h-5 text-success" />
                ) : (
                  <MicOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium">{t('settings.microphone')}</p>
                  <p className="text-sm text-muted-foreground">
                    Speech-to-text input (simulated)
                  </p>
                </div>
              </div>
              <Switch checked={micEnabled} onCheckedChange={toggleMic} />
            </div>

            {/* Notifications Toggle */}
            <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
              <div className="flex items-center gap-3">
                <Bell className={`w-5 h-5 ${notifications ? 'text-primary' : 'text-muted-foreground'}`} />
                <div>
                  <p className="font-medium">{t('settings.notifications')}</p>
                  <p className="text-sm text-muted-foreground">
                    Push notifications
                  </p>
                </div>
              </div>
              <Switch checked={notifications} onCheckedChange={setNotifications} />
            </div>
          </CardContent>
        </Card>

        {/* Demo Actions */}
        <Card className="border-0 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcw className="w-5 h-5" />
              Demo Actions
            </CardTitle>
            <CardDescription>Reset demo data for presentation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={handleResetDemo}
            >
              <RefreshCcw className="w-4 h-4" />
              {t('settings.resetDemo')}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              This will reset all demo data and log you out
            </p>
          </CardContent>
        </Card>

        {/* Legal Notices */}
        <LegalNotices />

        {/* Logout */}
        <Button
          variant="destructive"
          className="w-full h-12 gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5" />
          {t('auth.logout')}
        </Button>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>© 2025 EMEC – All rights reserved</p>
          <p className="mt-1">Developed by Jacob Johnson & Barack Hussein</p>
          <p className="mt-1">Mbita High School</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
