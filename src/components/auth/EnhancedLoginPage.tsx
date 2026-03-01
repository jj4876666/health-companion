import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, User, Users, Shield, Lock, Eye, EyeOff, CreditCard, CheckCircle2, 
  UserCircle, AlertTriangle, Info, Mail, Loader2, KeyRound
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEMO_EMEC_IDS, DEMO_PASSWORDS, getUserByEmecId } from '@/data/demoUsers';
import { AccountRecovery } from './AccountRecovery';
import { ProductionSignupForm } from './ProductionSignupForm';

export function EnhancedLoginPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emecId, setEmecId] = useState('');
  const [foundUser, setFoundUser] = useState<{ name: string; role: string; isVerified: boolean } | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  
  const { loginWithEmecId } = useAuth();
  const { language, t } = useLanguage();
  const { isDemoMode, setIsDemoMode } = useDemo();
  const navigate = useNavigate();
  const { toast } = useToast();

  const demoAccounts = [
    { role: 'child', label: 'Child Patient', icon: User, name: 'Kevin Otieno (Age 9)', emecId: DEMO_EMEC_IDS.child, password: DEMO_PASSWORDS.child },
    { role: 'adult', label: 'Adult Patient', icon: UserCircle, name: 'James Mwangi (Age 32)', emecId: DEMO_EMEC_IDS.adult, password: DEMO_PASSWORDS.adult },
    { role: 'parent', label: 'Parent / Guardian', icon: Users, name: 'Grace Achieng', emecId: DEMO_EMEC_IDS.parent, password: DEMO_PASSWORDS.parent },
    { role: 'admin', label: 'Health Officer', icon: Shield, name: 'Dr. Omondi Wekesa', emecId: DEMO_EMEC_IDS.admin, password: DEMO_PASSWORDS.admin },
  ];

  const handleEmecIdChange = (value: string) => {
    const formatted = value.toUpperCase().slice(0, 11);
    setEmecId(formatted);
    setError('');
    
    if (formatted.length === 11) {
      const user = getUserByEmecId(formatted);
      if (user) {
        setFoundUser({ name: user.name, role: user.role, isVerified: user.isVerified });
      } else {
        setFoundUser(null);
      }
    } else {
      setFoundUser(null);
    }
  };

  // Real Supabase email login
  const handleEmailLogin = async () => {
    if (!email || !password) { setError('Please enter email and password'); return; }
    setIsLoading(true);
    setError('');
    
    const { data, error: loginError } = await supabase.auth.signInWithPassword({ email, password });
    
    if (loginError) {
      setError(loginError.message);
      setIsLoading(false);
      return;
    }

    if (data.user) {
      // Fetch profile to get user info
      const { data: profile } = await supabase.from('profiles').select('*').eq('user_id', data.user.id).single();
      
      setIsDemoMode(false);
      toast({
        title: "✓ Login Successful",
        description: `Welcome back${profile?.full_name ? ', ' + profile.full_name : ''}!`,
      });
      navigate('/dashboard');
    }
    setIsLoading(false);
  };

  // Demo EMEC ID login (keeps existing demo flow)
  const handleEmecLogin = async () => {
    if (!emecId || !password) { setError('Please enter your EMEC ID and password'); return; }
    if (emecId.length !== 11) { setError('EMEC ID must be 11 characters'); return; }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const success = loginWithEmecId(emecId, password);
    
    if (success) {
      setIsDemoMode(true);
      toast({ title: "✓ Verification Successful", description: `Welcome back, ${foundUser?.name}!` });
      navigate('/dashboard');
    } else {
      // Try Supabase login with EMEC ID lookup
      const { data: profile } = await supabase.from('profiles').select('user_id, full_name').eq('emec_id', emecId).single();
      if (profile) {
        setError('Please use "Email" login for live accounts, or use a demo EMEC ID.');
      } else {
        setError('Invalid EMEC ID or password');
      }
      setPassword('');
    }
    
    setIsLoading(false);
  };

  const handleQuickLogin = (account: typeof demoAccounts[0]) => {
    setEmecId(account.emecId);
    setPassword(account.password);
    setFoundUser({ name: account.name, role: account.role, isVerified: true });
  };

  // Show production signup form
  if (authMode === 'signup') {
    return (
      <div className="min-h-screen gradient-hero flex flex-col">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <header className="relative p-6 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-xl gradient-emec flex items-center justify-center shadow-lg">
              <Heart className="w-7 h-7 text-white fill-white" />
            </div>
            <div>
              <span className="text-3xl font-bold text-foreground">EMEC</span>
              <p className="text-xs text-muted-foreground">Electronic Medical & Education Companion</p>
            </div>
          </div>
        </header>
        <main className="relative flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <ProductionSignupForm onBack={() => setAuthMode('login')} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative p-6 flex items-center justify-center">
        <div className="flex items-center gap-3 animate-fade-in">
          <div className="w-14 h-14 rounded-xl gradient-emec flex items-center justify-center shadow-lg animate-bounce-soft">
            <Heart className="w-7 h-7 text-white fill-white" />
          </div>
          <div>
            <span className="text-3xl font-bold text-foreground">EMEC</span>
            <p className="text-xs text-muted-foreground">Electronic Medical & Education Companion</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-5xl">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Login Form */}
            <Card className="shadow-elegant border-0">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl md:text-3xl flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  Welcome Back
                </CardTitle>
                <CardDescription className="text-base">
                  Sign in to access your health records
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Login Methods */}
                <Tabs defaultValue="email" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email Login</TabsTrigger>
                    <TabsTrigger value="emec">Demo (EMEC ID)</TabsTrigger>
                  </TabsList>

                  {/* Real Email Login */}
                  <TabsContent value="email" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" /> Email
                      </Label>
                      <Input
                        id="login-email" type="email" value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="login-password" type={showPassword ? 'text' : 'password'}
                          value={password} onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password" className="pr-12"
                          onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>
                    <Button onClick={handleEmailLogin} disabled={!email || !password || isLoading} className="w-full h-12 text-lg">
                      {isLoading ? (
                        <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Signing In...</span>
                      ) : (
                        <span className="flex items-center gap-2"><Mail className="w-5 h-5" />Sign In</span>
                      )}
                    </Button>
                  </TabsContent>

                  {/* Demo EMEC Login */}
                  <TabsContent value="emec" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="emecId" className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" /> EMEC ID
                      </Label>
                      <Input
                        id="emecId" value={emecId}
                        onChange={(e) => handleEmecIdChange(e.target.value)}
                        placeholder="e.g., KOT2025A001" maxLength={11}
                        className="text-center text-lg tracking-widest font-mono uppercase"
                      />
                      <p className="text-xs text-muted-foreground text-center">{emecId.length}/11 characters</p>
                    </div>
                    {foundUser && (
                      <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 animate-fade-in">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-green-600" />
                          <div>
                            <p className="font-semibold text-green-700 dark:text-green-400">{foundUser.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize">{foundUser.role}</Badge>
                              {foundUser.isVerified && <Badge className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400 border-green-300">✓ Verified</Badge>}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      <Label htmlFor="emec-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" /> Password
                      </Label>
                      <Input
                        id="emec-password" type={showPassword ? 'text' : 'password'}
                        value={password} onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password" className="pr-12"
                        onKeyDown={(e) => e.key === 'Enter' && handleEmecLogin()}
                      />
                    </div>
                    <Button onClick={handleEmecLogin} disabled={!emecId || !password || isLoading} className="w-full h-12 text-lg">
                      {isLoading ? (
                        <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" />Verifying...</span>
                      ) : (
                        <span className="flex items-center gap-2"><Shield className="w-5 h-5" />Demo Login</span>
                      )}
                    </Button>
                  </TabsContent>
                </Tabs>

                {error && <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>}

                {/* Sign Up Button */}
                <div className="border-t pt-4">
                  <Button variant="outline" onClick={() => setAuthMode('signup')} className="w-full h-11 gap-2">
                    <User className="w-4 h-4" />
                    Create New Account
                  </Button>
                </div>

                {/* Forgot Password */}
                <button onClick={() => setShowRecovery(true)}
                  className="w-full text-center text-sm text-primary hover:underline flex items-center justify-center gap-2">
                  <KeyRound className="w-4 h-4" /> Forgot password?
                </button>

                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>256-bit encrypted & RLS protected</span>
                </div>
              </CardContent>
            </Card>

            {/* Demo Accounts */}
            <Card className="shadow-elegant border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Demo Accounts</CardTitle>
                <CardDescription>Click to auto-fill credentials for testing</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {demoAccounts.map((account) => {
                  const Icon = account.icon;
                  const isSelected = emecId === account.emecId;
                  
                  return (
                    <button
                      key={account.role}
                      onClick={() => handleQuickLogin(account)}
                      className={`w-full p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                        isSelected
                          ? 'border-primary bg-primary/10 shadow-md'
                          : 'border-border hover:border-primary/50 hover:bg-muted/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{account.label}</h3>
                          <p className="text-sm text-muted-foreground">{account.name}</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-border/50 grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">EMEC ID:</span>
                          <p className="font-mono text-primary">{account.emecId}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Password:</span>
                          <p className="font-mono text-primary">{account.password}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Legal Disclaimer */}
          <div className="mt-6 p-4 rounded-xl bg-warning/10 border border-warning/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-warning-foreground mb-1">Important Disclaimer</p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  EMEC is for health education and awareness only. This app does not provide medical diagnosis or treatment. Always visit your nearest health facility for medical advice.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 text-center text-sm text-muted-foreground space-y-2">
            <p className="font-medium">© 2025 EMEC – All rights reserved</p>
            <p>Developed by Jacob Johnson & Barack Hussein, Mbita High School</p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <Badge variant="outline" className="text-xs">
                <Shield className="w-3 h-3 mr-1" /> Secure
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Info className="w-3 h-3 mr-1" /> Production Ready
              </Badge>
            </div>
          </footer>
        </div>
      </main>

      {/* Account Recovery Modal */}
      <AccountRecovery isOpen={showRecovery} onClose={() => setShowRecovery(false)} />
    </div>
  );
}
