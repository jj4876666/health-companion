import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole } from '@/types/emec';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart, BookOpen, HandHeart, User, Users, Shield, Lock, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roleOptions: { role: UserRole; label: string; labelSw: string; icon: typeof User; description: string; pin: string }[] = [
  {
    role: 'child',
    label: 'Child / Patient',
    labelSw: 'Mtoto / Mgonjwa',
    icon: User,
    description: 'Kevin Otieno (Age 9)',
    pin: '1234',
  },
  {
    role: 'parent',
    label: 'Parent / Guardian',
    labelSw: 'Mzazi / Mlezi',
    icon: Users,
    description: 'Grace Achieng',
    pin: '5678',
  },
  {
    role: 'admin',
    label: 'Admin / Health Officer',
    labelSw: 'Msimamizi / Afisa wa Afya',
    icon: Shield,
    description: 'Demo Admin - Mbita Hospital',
    pin: '9999',
  },
];

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async () => {
    if (!selectedRole || !pin) {
      setError('Please select a role and enter PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate encryption animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const success = login(selectedRole, pin);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome! Logged in as ${selectedRole}`,
      });
      navigate('/dashboard');
    } else {
      setError(t('auth.wrongPin'));
      setPin('');
    }
    
    setIsLoading(false);
  };

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setPin('');
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Header */}
      <header className="p-6 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl gradient-emec flex items-center justify-center">
            <Heart className="w-6 h-6 text-white fill-white" />
          </div>
          <span className="text-2xl font-bold text-foreground">EMEC</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-4xl">
          {/* Demo Label */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-warning/20 text-warning-foreground text-sm font-medium border border-warning/30">
              {t('demo.label')}
            </span>
          </div>

          <Card className="shadow-elegant border-0">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl md:text-3xl">{t('auth.login')}</CardTitle>
              <CardDescription className="text-base">
                {t('auth.selectRole')}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Role Selection */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roleOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedRole === option.role;
                  
                  return (
                    <button
                      key={option.role}
                      onClick={() => handleRoleSelect(option.role)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-md scale-[1.02]'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {language === 'sw' ? option.labelSw : option.label}
                          </h3>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <p className="text-xs text-primary mt-2 font-mono">PIN: {option.pin}</p>
                    </button>
                  );
                })}
              </div>

              {/* PIN Entry */}
              {selectedRole && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-2">
                    <Label htmlFor="pin" className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      {t('auth.enterPin')}
                    </Label>
                    <div className="relative">
                      <Input
                        id="pin"
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="Enter 4-digit PIN"
                        maxLength={4}
                        className="text-center text-2xl tracking-[0.5em] font-mono pr-12"
                        onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
                  )}

                  <Button
                    onClick={handleLogin}
                    disabled={!pin || isLoading}
                    className="w-full h-12 text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Lock className="w-5 h-5 animate-pulse" />
                        Encrypting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        Secure Login
                      </span>
                    )}
                  </Button>

                  {/* Simulated Encryption Badge */}
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>256-bit encryption (simulated for demo)</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <p>© 2025 EMEC – All rights reserved</p>
            <p className="mt-1">Developed by Jacob Johnson & Barack Hussein, Mbita High School</p>
          </footer>
        </div>
      </main>
    </div>
  );
}
