import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole } from '@/types/emec';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Heart, 
  BookOpen, 
  HandHeart, 
  User, 
  Users, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const roleOptions: { 
  role: UserRole; 
  label: string; 
  labelSw: string; 
  icon: typeof User; 
  description: string; 
  pin: string;
  verificationRequired?: boolean;
}[] = [
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
    verificationRequired: true,
  },
];

type LoginStep = 'role-select' | 'pin-entry' | 'admin-verify' | 'complete';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<LoginStep>('role-select');
  const [isLoading, setIsLoading] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  
  const { login, addAuditEntry } = useAuth();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setError('');
    setPin('');
    setStep('pin-entry');
  };

  const handlePinSubmit = async () => {
    if (!selectedRole || !pin) {
      setError('Please enter your PIN');
      return;
    }

    setIsLoading(true);
    setError('');

    // Simulate encryption animation
    await new Promise((resolve) => setTimeout(resolve, 800));

    const roleOption = roleOptions.find(r => r.role === selectedRole);
    
    if (pin !== roleOption?.pin) {
      setError(t('auth.wrongPin'));
      setPin('');
      setIsLoading(false);
      return;
    }

    // If admin, require verification first
    if (selectedRole === 'admin') {
      setStep('admin-verify');
      setIsLoading(false);
      return;
    }

    // For child/parent, complete login
    completeLogin();
  };

  const handleAdminVerification = async () => {
    setIsLoading(true);
    setError('');

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo verification code
    if (verificationCode === 'SHA-001-2025' || verificationCode === 'VERIFY') {
      setIsVerified(true);
      
      addAuditEntry({
        action: 'facility_verified',
        targetUser: 'Demo Admin',
        details: 'Admin facility verification completed: Mbita Sub-County Hospital (SHA-001-2025)',
        facility: 'Mbita Sub-County Hospital',
      });

      toast({
        title: "Facility Verified",
        description: "Mbita Sub-County Hospital has been verified successfully.",
      });

      // Short delay before completing login
      await new Promise((resolve) => setTimeout(resolve, 500));
      completeLogin();
    } else {
      setError('Invalid verification code. Use SHA-001-2025 or VERIFY for demo.');
    }

    setIsLoading(false);
  };

  const completeLogin = () => {
    if (!selectedRole) return;

    const success = login(selectedRole, pin);
    
    if (success) {
      toast({
        title: "Login Successful",
        description: `Welcome! Logged in as ${selectedRole}`,
      });
      navigate('/dashboard');
    } else {
      setError('Login failed. Please try again.');
    }
    
    setIsLoading(false);
  };

  const goBack = () => {
    if (step === 'admin-verify') {
      setStep('pin-entry');
      setVerificationCode('');
    } else if (step === 'pin-entry') {
      setStep('role-select');
      setSelectedRole(null);
      setPin('');
    }
    setError('');
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
                {step === 'role-select' && t('auth.selectRole')}
                {step === 'pin-entry' && 'Enter your secure PIN to continue'}
                {step === 'admin-verify' && 'Verify your health facility credentials'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Step 1: Role Selection */}
              {step === 'role-select' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in">
                  {roleOptions.map((option) => {
                    const Icon = option.icon;
                    
                    return (
                      <button
                        key={option.role}
                        onClick={() => handleRoleSelect(option.role)}
                        className="p-4 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition-all duration-300 text-left"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                            <Icon className="w-5 h-5 text-muted-foreground" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">
                              {language === 'sw' ? option.labelSw : option.label}
                            </h3>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground">{option.description}</p>
                        <p className="text-xs text-primary mt-2 font-mono">PIN: {option.pin}</p>
                        {option.verificationRequired && (
                          <p className="text-xs text-warning mt-1 flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Requires facility verification
                          </p>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Step 2: PIN Entry */}
              {step === 'pin-entry' && selectedRole && (
                <div className="space-y-4 animate-fade-in max-w-md mx-auto">
                  <Button variant="ghost" onClick={goBack} className="mb-2">
                    ← Back to role selection
                  </Button>

                  <div className="p-4 rounded-xl bg-muted/50 border border-border">
                    <p className="text-sm text-muted-foreground">Logging in as:</p>
                    <p className="font-semibold text-foreground">
                      {roleOptions.find(r => r.role === selectedRole)?.description}
                    </p>
                  </div>

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
                        onKeyDown={(e) => e.key === 'Enter' && handlePinSubmit()}
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
                    <p className="text-destructive text-sm text-center animate-fade-in flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}

                  <Button
                    onClick={handlePinSubmit}
                    disabled={!pin || isLoading}
                    className="w-full h-12 text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Encrypting...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Shield className="w-5 h-5" />
                        {selectedRole === 'admin' ? 'Continue to Verification' : 'Secure Login'}
                      </span>
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <Lock className="w-4 h-4" />
                    <span>256-bit encryption (simulated for demo)</span>
                  </div>
                </div>
              )}

              {/* Step 3: Admin Facility Verification */}
              {step === 'admin-verify' && (
                <div className="space-y-4 animate-fade-in max-w-md mx-auto">
                  <Button variant="ghost" onClick={goBack} className="mb-2">
                    ← Back to PIN entry
                  </Button>

                  <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                    <div className="flex items-center gap-2 text-primary mb-2">
                      <Shield className="w-5 h-5" />
                      <span className="font-semibold">Facility Verification Required</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Admin accounts must verify their health institution before accessing patient data.
                    </p>
                  </div>

                  <div className="space-y-4 p-4 rounded-xl border border-border bg-card">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Admin Name</Label>
                      <p className="font-medium">Demo Admin</p>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Facility Name</Label>
                      <p className="font-medium">Mbita Sub-County Hospital</p>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="verification" className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        License/Registration Number
                      </Label>
                      <Input
                        id="verification"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter: SHA-001-2025"
                        className="font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && handleAdminVerification()}
                      />
                      <p className="text-xs text-muted-foreground">
                        Demo code: SHA-001-2025 or VERIFY
                      </p>
                    </div>
                  </div>

                  {error && (
                    <p className="text-destructive text-sm text-center animate-fade-in flex items-center justify-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      {error}
                    </p>
                  )}

                  <Button
                    onClick={handleAdminVerification}
                    disabled={!verificationCode || isLoading}
                    className="w-full h-12 text-lg"
                  >
                    {isLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Verifying Facility...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5" />
                        Verify & Login
                      </span>
                    )}
                  </Button>

                  <p className="text-xs text-center text-muted-foreground">
                    Verification ensures only authorized health officers can access patient records.
                  </p>
                </div>
              )}

              {/* Connection Indicator */}
              <div className="flex items-center justify-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span>Accounts interconnected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Offline mode ready</span>
                </div>
              </div>
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
