import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Heart, User, Users, Shield, Lock, Eye, EyeOff, CreditCard, CheckCircle2, 
  UserCircle, AlertTriangle, Info, Mail, Chrome, Loader2, Database, Sparkles
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEMO_EMEC_IDS, DEMO_PASSWORDS, getUserByEmecId } from '@/data/demoUsers';

// Generate unique EMEC ID - exactly 11 alphanumeric characters
const generateEmecId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export function EnhancedLoginPage() {
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emecId, setEmecId] = useState('');
  const [foundUser, setFoundUser] = useState<{ name: string; role: string; isVerified: boolean } | null>(null);
  
  // Sample data consent
  const [showConsentDialog, setShowConsentDialog] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [newUserEmecId, setNewUserEmecId] = useState('');
  
  const { loginWithEmecId } = useAuth();
  const { language, t } = useLanguage();
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
        setError('EMEC ID not found in demo database');
      }
    } else {
      setFoundUser(null);
    }
  };

  const handleEmailSignup = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedEmecId = generateEmecId();
    setNewUserEmecId(generatedEmecId);
    setShowConsentDialog(true);
    setIsLoading(false);
  };

  const handleEmailLogin = async () => {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Demo: Accept any email/password for demo purposes
    toast({
      title: "✓ Login Successful",
      description: "Welcome to EMEC Demo!",
    });
    
    // Log in as adult by default for email login
    loginWithEmecId(DEMO_EMEC_IDS.adult, DEMO_PASSWORDS.adult);
    navigate('/dashboard');
    setIsLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const generatedEmecId = generateEmecId();
    setNewUserEmecId(generatedEmecId);
    setShowConsentDialog(true);
    setIsLoading(false);
  };

  const handleEmecLogin = async () => {
    if (!emecId || !password) {
      setError('Please enter your EMEC ID and password');
      return;
    }

    if (emecId.length !== 11) {
      setError('EMEC ID must be 11 characters');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    const success = loginWithEmecId(emecId, password);
    
    if (success) {
      toast({
        title: "✓ Verification Successful",
        description: `Welcome back, ${foundUser?.name}!`,
      });
      navigate('/dashboard');
    } else {
      setError('Invalid EMEC ID or password');
      setPassword('');
    }
    
    setIsLoading(false);
  };

  const handleConsentComplete = () => {
    // Store the new EMEC ID
    localStorage.setItem('emec_user_id', newUserEmecId);
    
    if (consentGiven) {
      // Load sample data
      localStorage.setItem('emec_sample_data_loaded', 'true');
      toast({
        title: "🎉 Account Created!",
        description: `Your EMEC ID: ${newUserEmecId}. Sample health data has been loaded.`,
      });
    } else {
      toast({
        title: "🎉 Account Created!",
        description: `Your EMEC ID: ${newUserEmecId}. You can add health data later.`,
      });
    }
    
    setShowConsentDialog(false);
    loginWithEmecId(DEMO_EMEC_IDS.adult, DEMO_PASSWORDS.adult);
    navigate('/dashboard');
  };

  const handleQuickLogin = (account: typeof demoAccounts[0]) => {
    setEmecId(account.emecId);
    setPassword(account.password);
    setFoundUser({ name: account.name, role: account.role, isVerified: true });
  };

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
          {/* Demo Label */}
          <div className="text-center mb-6">
            <span className="inline-block px-4 py-2 rounded-full bg-warning/20 text-warning-foreground text-sm font-medium border border-warning/30">
              {t('demo.label')}
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-6">
            {/* Login/Signup Form */}
            <Card className="shadow-elegant border-0">
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-2xl md:text-3xl flex items-center justify-center gap-2">
                  <Heart className="w-6 h-6 text-primary" />
                  {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
                </CardTitle>
                <CardDescription className="text-base">
                  {authMode === 'login' 
                    ? 'Sign in to access your health records' 
                    : 'Join EMEC to manage your health journey'}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-6">
                <Tabs value={authMode} onValueChange={(v) => setAuthMode(v as 'login' | 'signup')}>
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signup" className="space-y-4 mt-4">
                    {/* Google Sign-In Button */}
                    <Button 
                      variant="outline" 
                      className="w-full h-12 gap-3"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <Chrome className="w-5 h-5" />
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or with email</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email
                      </Label>
                      <Input
                        id="signup-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="signup-password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Create a password"
                          className="pr-12"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm your password"
                      />
                    </div>

                    {error && (
                      <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
                    )}

                    <Button
                      onClick={handleEmailSignup}
                      disabled={isLoading}
                      className="w-full h-12 text-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Creating Account...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-5 h-5" />
                          Create Account
                        </span>
                      )}
                    </Button>
                  </TabsContent>

                  <TabsContent value="login" className="space-y-4 mt-4">
                    {/* Google Sign-In */}
                    <Button 
                      variant="outline" 
                      className="w-full h-12 gap-3"
                      onClick={handleGoogleSignIn}
                      disabled={isLoading}
                    >
                      <Chrome className="w-5 h-5" />
                      Continue with Google
                    </Button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or sign in with</span>
                      </div>
                    </div>

                    <Tabs defaultValue="emec" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="emec">EMEC ID</TabsTrigger>
                        <TabsTrigger value="email">Email</TabsTrigger>
                      </TabsList>

                      <TabsContent value="emec" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="emecId" className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4" />
                            EMEC ID
                          </Label>
                          <Input
                            id="emecId"
                            value={emecId}
                            onChange={(e) => handleEmecIdChange(e.target.value)}
                            placeholder="e.g., KOT2025A001"
                            maxLength={11}
                            className="text-center text-lg tracking-widest font-mono uppercase"
                          />
                          <p className="text-xs text-muted-foreground text-center">{emecId.length}/11 characters</p>
                        </div>

                        {foundUser && (
                          <div className="p-4 rounded-lg bg-success/10 border border-success/30 animate-fade-in">
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-6 h-6 text-success" />
                              <div>
                                <p className="font-semibold text-success">{foundUser.name}</p>
                                <div className="flex items-center gap-2 mt-1">
                                  <Badge variant="outline" className="capitalize">{foundUser.role}</Badge>
                                  {foundUser.isVerified && (
                                    <Badge className="bg-success/20 text-success border-success/30">✓ Verified</Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <Label htmlFor="emec-password" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password
                          </Label>
                          <div className="relative">
                            <Input
                              id="emec-password"
                              type={showPassword ? 'text' : 'password'}
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              placeholder="Enter your password"
                              className="pr-12"
                              onKeyDown={(e) => e.key === 'Enter' && handleEmecLogin()}
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                          </div>
                        </div>

                        <Button
                          onClick={handleEmecLogin}
                          disabled={!emecId || !password || isLoading}
                          className="w-full h-12 text-lg"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Verifying...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Shield className="w-5 h-5" />
                              Secure Login
                            </span>
                          )}
                        </Button>
                      </TabsContent>

                      <TabsContent value="email" className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="login-email" className="flex items-center gap-2">
                            <Mail className="w-4 h-4" />
                            Email
                          </Label>
                          <Input
                            id="login-email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="login-password" className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Password
                          </Label>
                          <Input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            onKeyDown={(e) => e.key === 'Enter' && handleEmailLogin()}
                          />
                        </div>

                        <Button
                          onClick={handleEmailLogin}
                          disabled={!email || !password || isLoading}
                          className="w-full h-12 text-lg"
                        >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <Loader2 className="w-5 h-5 animate-spin" />
                              Signing In...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Mail className="w-5 h-5" />
                              Sign In with Email
                            </span>
                          )}
                        </Button>
                      </TabsContent>
                    </Tabs>

                    {error && (
                      <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
                    )}
                  </TabsContent>
                </Tabs>

                {/* Encryption Badge */}
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Lock className="w-4 h-4" />
                  <span>256-bit encryption (simulated for demo)</span>
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
                <Shield className="w-3 h-3 mr-1" />
                Secure
              </Badge>
              <Badge variant="outline" className="text-xs">
                <Info className="w-3 h-3 mr-1" />
                Demo Mode
              </Badge>
            </div>
          </footer>
        </div>
      </main>

      {/* Consent Dialog for Sample Data */}
      <Dialog open={showConsentDialog} onOpenChange={setShowConsentDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Your EMEC ID is Ready!
            </DialogTitle>
            <DialogDescription>
              Your unique health identifier has been generated
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* EMEC ID Display */}
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
              <p className="text-xs text-muted-foreground mb-1">Your EMEC ID</p>
              <p className="text-2xl font-mono font-bold text-primary tracking-widest">{newUserEmecId}</p>
            </div>

            {/* Explanation */}
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="text-muted-foreground">
                <Info className="w-4 h-4 inline mr-1" />
                This ID helps organize and secure your health information inside the app. It is not a government-issued ID.
              </p>
            </div>

            {/* Sample Data Consent */}
            <div className="flex items-start space-x-3 p-3 rounded-lg border border-border">
              <Checkbox 
                id="consent" 
                checked={consentGiven}
                onCheckedChange={(checked) => setConsentGiven(!!checked)}
              />
              <div className="grid gap-1.5 leading-none">
                <label htmlFor="consent" className="text-sm font-medium cursor-pointer">
                  Load sample health data for demo
                </label>
                <p className="text-xs text-muted-foreground">
                  This will add example health records, medications, and appointments to demonstrate the app's features during presentations.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={handleConsentComplete} className="w-full gap-2">
              <Database className="w-4 h-4" />
              Continue to Dashboard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
