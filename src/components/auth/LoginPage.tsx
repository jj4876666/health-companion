import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Heart, User, Users, Shield, Lock, Eye, EyeOff, CreditCard, 
  CheckCircle2, UserCircle, AlertTriangle, Info, UserPlus,
  KeyRound, FileText, Building2, Copy
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { DEMO_EMEC_IDS, DEMO_PASSWORDS, allDemoUsers, getUserByEmecId } from '@/data/demoUsers';
import { AccountRecovery } from './AccountRecovery';

// Generate hospital-style patient ID
const generatePatientId = () => {
  const year = new Date().getFullYear();
  const random = String(Math.floor(Math.random() * 99999)).padStart(5, '0');
  return `EMEC/${year}/${random}`;
};

// Generate EMEC ID
const generateEmecId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 11; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Generate consent code
const generateConsentCode = () => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

export function LoginPage() {
  const [emecId, setEmecId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundUser, setFoundUser] = useState<{ name: string; role: string; isVerified: boolean } | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
  const [activeTab, setActiveTab] = useState('login');
  
  // Signup state
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    accountType: 'adult' as 'adult' | 'parent' | 'admin',
  });
  const [signupStep, setSignupStep] = useState<'form' | 'success'>('form');
  const [newPatientData, setNewPatientData] = useState<{
    emecId: string;
    patientId: string;
    consentCode: string;
    accountType: string;
  } | null>(null);
  
  const { loginWithEmecId, registerUser } = useAuth();
  const { isDemoMode } = useDemo();
  const { language, t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();

  const demoAccounts = [
    {
      role: 'child',
      label: 'Child Patient',
      labelSw: 'Mtoto Mgonjwa',
      icon: User,
      name: 'Kevin Otieno (Age 9)',
      emecId: DEMO_EMEC_IDS.child,
      password: DEMO_PASSWORDS.child,
    },
    {
      role: 'adult',
      label: 'Adult Patient',
      labelSw: 'Mtu Mzima Mgonjwa',
      icon: UserCircle,
      name: 'James Mwangi (Age 32)',
      emecId: DEMO_EMEC_IDS.adult,
      password: DEMO_PASSWORDS.adult,
    },
    {
      role: 'parent',
      label: 'Parent / Guardian',
      labelSw: 'Mzazi / Mlezi',
      icon: Users,
      name: 'Grace Achieng',
      emecId: DEMO_EMEC_IDS.parent,
      password: DEMO_PASSWORDS.parent,
    },
    {
      role: 'admin',
      label: 'Health Officer',
      labelSw: 'Afisa wa Afya',
      icon: Shield,
      name: 'Dr. Omondi Wekesa',
      emecId: DEMO_EMEC_IDS.admin,
      password: DEMO_PASSWORDS.admin,
    },
  ];

  const handleEmecIdChange = (value: string) => {
    const formatted = value.toUpperCase().slice(0, 11);
    setEmecId(formatted);
    setError('');
    
    if (formatted.length === 11) {
      const user = getUserByEmecId(formatted);
      if (user) {
        setFoundUser({
          name: user.name,
          role: user.role,
          isVerified: user.isVerified,
        });
      } else {
        setFoundUser(null);
        setError('EMEC ID not found in demo database');
      }
    } else {
      setFoundUser(null);
    }
  };

  const handleLogin = async () => {
    if (!emecId || !password) {
      setError('Please enter your EMEC ID and password');
      return;
    }

    if (emecId.length !== 11) {
      setError('EMEC ID must be 11 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    await new Promise((resolve) => setTimeout(resolve, 1000));

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

  const handleQuickLogin = (account: typeof demoAccounts[0]) => {
    setEmecId(account.emecId);
    setPassword(account.password);
    setFoundUser({
      name: account.name,
      role: account.role,
      isVerified: true,
    });
    setActiveTab('login');
  };

  const handleSignup = async () => {
    const { fullName, email, password, confirmPassword, phone } = signupData;

    if (!fullName || !email || !password || !phone) {
      setError('Please fill in all required fields');
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
    setError('');

    // Simulate registration
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Generate patient credentials
    const newEmecId = generateEmecId();
    const newPatientId = generatePatientId();
    const newConsentCode = generateConsentCode();

    // Register in context and localStorage with selected account type
    const newUser = registerUser({
      name: fullName,
      email,
      phone,
      password,
      role: signupData.accountType,
    });

    // Store additional new user data in localStorage for the dashboard
    localStorage.setItem(`new_user_${newUser.id}`, JSON.stringify({
      isNewUser: true,
      patientId: newPatientId,
      consentCode: newConsentCode,
      accountType: signupData.accountType,
      createdAt: new Date().toISOString(),
    }));

    setNewPatientData({
      emecId: newUser.emecId,
      patientId: newPatientId,
      consentCode: newConsentCode,
      accountType: signupData.accountType,
    });

    setSignupStep('success');
    setIsLoading(false);

    toast({
      title: '🎉 Registration Successful!',
      description: `Your ${signupData.accountType === 'admin' ? 'Health Officer' : signupData.accountType === 'parent' ? 'Parent/Guardian' : 'Patient'} account has been created.`,
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const handleContinueToLogin = () => {
    // User is already logged in via registerUser, just navigate to dashboard
    toast({
      title: '✓ Account Ready',
      description: 'Redirecting to your dashboard...',
    });
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      {/* Demo Mode Badge */}
      {isDemoMode && (
        <div className="fixed top-4 right-4 z-50">
          <Badge className="bg-amber-500 text-white px-3 py-1.5 text-sm font-semibold animate-pulse">
            🧪 DEMO MODE
          </Badge>
        </div>
      )}

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
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <CardHeader className="text-center pb-2">
                  <TabsList className="grid w-full grid-cols-2 mb-4">
                    <TabsTrigger value="login" className="gap-2">
                      <CreditCard className="w-4 h-4" />
                      Login
                    </TabsTrigger>
                    <TabsTrigger value="signup" className="gap-2">
                      <UserPlus className="w-4 h-4" />
                      New Patient
                    </TabsTrigger>
                  </TabsList>
                </CardHeader>

                {/* Login Tab */}
                <TabsContent value="login">
                  <CardContent className="space-y-6">
                    <div className="text-center mb-4">
                      <CardTitle className="text-2xl flex items-center justify-center gap-2">
                        <CreditCard className="w-6 h-6" />
                        {language === 'sw' ? 'Ingia na EMEC ID' : 'Login with EMEC ID'}
                      </CardTitle>
                      <CardDescription className="text-base mt-2">
                        {language === 'sw' 
                          ? 'Ingiza nambari yako ya EMEC na nenosiri' 
                          : 'Enter your 11-character EMEC ID and password'}
                      </CardDescription>
                    </div>

                    {/* EMEC ID Input */}
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
                      <p className="text-xs text-muted-foreground text-center">
                        {emecId.length}/11 characters
                      </p>
                    </div>

                    {/* Found User Display */}
                    {foundUser && (
                      <div className="p-4 rounded-lg bg-success/10 border border-success/30 animate-fade-in">
                        <div className="flex items-center gap-3">
                          <CheckCircle2 className="w-6 h-6 text-success" />
                          <div>
                            <p className="font-semibold text-success">{foundUser.name}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="outline" className="capitalize">{foundUser.role}</Badge>
                              {foundUser.isVerified && (
                                <Badge className="bg-success/20 text-success border-success/30">
                                  ✓ Verified
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Password Input */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="flex items-center gap-2">
                        <Lock className="w-4 h-4" />
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          className="pr-12"
                          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
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

                    {error && (
                      <p className="text-destructive text-sm text-center animate-fade-in">{error}</p>
                    )}

                    <Button
                      onClick={handleLogin}
                      disabled={!emecId || !password || isLoading}
                      className="w-full h-12 text-lg"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <Lock className="w-5 h-5 animate-pulse" />
                          Verifying...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Shield className="w-5 h-5" />
                          Secure Login
                        </span>
                      )}
                    </Button>

                    {/* Forgot Password */}
                    <button
                      onClick={() => setShowRecovery(true)}
                      className="w-full text-center text-sm text-primary hover:underline flex items-center justify-center gap-2"
                    >
                      <KeyRound className="w-4 h-4" />
                      Forgot password?
                    </button>

                    {/* Encryption Badge */}
                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Lock className="w-4 h-4" />
                      <span>256-bit encryption (simulated for demo)</span>
                    </div>
                  </CardContent>
                </TabsContent>

                {/* Signup Tab */}
                <TabsContent value="signup">
                  <CardContent className="space-y-4">
                    {signupStep === 'form' ? (
                      <>
                        <div className="text-center mb-4">
                          <CardTitle className="text-xl flex items-center justify-center gap-2">
                            <FileText className="w-5 h-5" />
                            Create New Account
                          </CardTitle>
                          <CardDescription className="mt-2">
                            Choose your account type and register
                          </CardDescription>
                        </div>

                        {/* Account Type Selection */}
                        <div className="space-y-2">
                          <Label className="flex items-center gap-2">
                            <Shield className="w-4 h-4" />
                            Account Type *
                          </Label>
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() => setSignupData({...signupData, accountType: 'adult'})}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                signupData.accountType === 'adult'
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <UserCircle className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-xs font-medium">Normal Adult</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSignupData({...signupData, accountType: 'parent'})}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                signupData.accountType === 'parent'
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <Users className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-xs font-medium">Parent</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => setSignupData({...signupData, accountType: 'admin'})}
                              className={`p-3 rounded-lg border-2 transition-all text-center ${
                                signupData.accountType === 'admin'
                                  ? 'border-primary bg-primary/10'
                                  : 'border-border hover:border-primary/50'
                              }`}
                            >
                              <Shield className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-xs font-medium">Admin</span>
                            </button>
                          </div>
                          {signupData.accountType === 'admin' && (
                            <p className="text-xs text-muted-foreground mt-1 p-2 rounded bg-muted/50">
                              ⚕️ Admin accounts require facility verification before editing patient records
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="col-span-2 space-y-2">
                            <Label>Full Name *</Label>
                            <Input
                              value={signupData.fullName}
                              onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                              placeholder="Enter your full name"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Email *</Label>
                            <Input
                              type="email"
                              value={signupData.email}
                              onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                              placeholder="you@email.com"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Phone *</Label>
                            <Input
                              value={signupData.phone}
                              onChange={(e) => setSignupData({...signupData, phone: e.target.value})}
                              placeholder="+254..."
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Date of Birth</Label>
                            <Input
                              type="date"
                              value={signupData.dateOfBirth}
                              onChange={(e) => setSignupData({...signupData, dateOfBirth: e.target.value})}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Gender</Label>
                            <Select value={signupData.gender} onValueChange={(v) => setSignupData({...signupData, gender: v})}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label>Password *</Label>
                            <Input
                              type="password"
                              value={signupData.password}
                              onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                              placeholder="Min 6 characters"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Confirm Password *</Label>
                            <Input
                              type="password"
                              value={signupData.confirmPassword}
                              onChange={(e) => setSignupData({...signupData, confirmPassword: e.target.value})}
                              placeholder="Confirm password"
                            />
                          </div>
                        </div>

                        {error && (
                          <Alert variant="destructive">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                          </Alert>
                        )}

                        <Button onClick={handleSignup} disabled={isLoading} className="w-full h-11">
                          {isLoading ? 'Creating Patient File...' : 'Create Patient File'}
                        </Button>
                      </>
                    ) : (
                      /* Success State - New Patient Created */
                      <div className="space-y-4 py-4">
                        <div className="text-center">
                          <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mb-4">
                            <CheckCircle2 className="w-8 h-8 text-success" />
                          </div>
                          <h3 className="text-xl font-bold">Patient File Created!</h3>
                          <p className="text-muted-foreground mt-1">Your medical record is now active</p>
                        </div>

                        <Card className="border-2 border-primary/30 bg-primary/5">
                          <CardContent className="pt-4 space-y-3">
                            {/* EMEC ID */}
                            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground">Your EMEC ID</p>
                                <p className="font-mono font-bold text-lg text-primary">{newPatientData?.emecId}</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(newPatientData?.emecId || '', 'EMEC ID')}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Hospital File No */}
                            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                              <div>
                                <p className="text-xs text-muted-foreground">Hospital File Number</p>
                                <p className="font-mono font-semibold">{newPatientData?.patientId}</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(newPatientData?.patientId || '', 'File Number')}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>

                            {/* Consent Code */}
                            <div className="flex items-center justify-between p-3 bg-success/10 rounded-lg border border-success/30">
                              <div>
                                <p className="text-xs text-muted-foreground">Consent Code (5 min)</p>
                                <p className="font-mono font-bold text-xl tracking-widest text-success">{newPatientData?.consentCode}</p>
                              </div>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(newPatientData?.consentCode || '', 'Consent Code')}>
                                <Copy className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>

                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Your medical records show "No data yet" until healthcare providers add information.
                            Share your consent code with authorized personnel only.
                          </AlertDescription>
                        </Alert>

                        <Button onClick={handleContinueToLogin} className="w-full">
                          Continue to Login
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>

            {/* Demo Accounts */}
            <Card className="shadow-elegant border-0">
              <CardHeader className="pb-2">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Demo Accounts
                </CardTitle>
                <CardDescription>
                  Click to auto-fill credentials for testing
                </CardDescription>
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
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">
                            {language === 'sw' ? account.labelSw : account.label}
                          </h3>
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
                <p className="font-semibold text-warning-foreground mb-1">
                  {language === 'sw' ? 'Onyo Muhimu' : 'Important Disclaimer'}
                </p>
                <p className="text-muted-foreground text-xs leading-relaxed">
                  {language === 'sw'
                    ? 'EMEC ni kwa elimu na uhamasishaji wa afya pekee. Programu hii haitoi utambuzi wa kimatibabu wala matibabu. Daima tembelea kituo cha afya kilicho karibu nawe kwa ushauri wa kimatibabu.'
                    : 'EMEC is for health education and awareness only. This app does not provide medical diagnosis or treatment. Always visit your nearest health facility for medical advice.'}
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

      {/* Account Recovery Modal */}
      <AccountRecovery 
        isOpen={showRecovery} 
        onClose={() => setShowRecovery(false)} 
      />
    </div>
  );
}
