import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { useDemo } from '@/contexts/DemoContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  Heart, User, Users, Shield, Lock, Eye, EyeOff, CheckCircle2,
  UserCircle, AlertTriangle, Loader2, FileText, Building2, Copy,
  Phone, Mail, CalendarIcon, Ruler, Weight, UserPlus, ArrowLeft, ArrowRight
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type AccountType = 'adult' | 'child' | 'admin';

interface AdultFormData {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  height: string;
  weight: string;
}

interface ChildFormData {
  childFullName: string;
  dateOfBirth: string;
  gender: string;
  parentPhone: string;
  parentEmail: string;
  parentPassword: string;
  confirmPassword: string;
}

interface OfficerFormData {
  fullName: string;
  facilityName: string;
  licenseNumber: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function ProductionSignupForm({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<'type' | 'form' | 'success'>('type');
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [createdEmecId, setCreatedEmecId] = useState('');
  const { setIsDemoMode } = useDemo();
  const { loadSessionUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [adultForm, setAdultForm] = useState<AdultFormData>({
    fullName: '', dateOfBirth: '', gender: '', phone: '', email: '',
    password: '', confirmPassword: '',
    emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelation: '',
    height: '', weight: '',
  });

  const [childForm, setChildForm] = useState<ChildFormData>({
    childFullName: '', dateOfBirth: '', gender: '',
    parentPhone: '', parentEmail: '', parentPassword: '', confirmPassword: '',
  });

  const [officerForm, setOfficerForm] = useState<OfficerFormData>({
    fullName: '', facilityName: '', licenseNumber: '',
    phone: '', email: '', password: '', confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const validateAndSubmit = async () => {
    setError('');

    if (accountType === 'adult') {
      const f = adultForm;
      if (!f.fullName || !f.dateOfBirth || !f.gender || !f.phone || !f.email || !f.password) {
        setError('Please fill in all required fields'); return;
      }
      if (f.password !== f.confirmPassword) { setError('Passwords do not match'); return; }
      if (f.password.length < 6) { setError('Password must be at least 6 characters'); return; }
      if (!f.emergencyContactName || !f.emergencyContactPhone) {
        setError('Emergency contact is required'); return;
      }
      if (!f.height || !f.weight) { setError('Height and weight are required'); return; }

      await signUp(f.email, f.password, {
        full_name: f.fullName,
        account_type: 'adult',
        date_of_birth: f.dateOfBirth,
        gender: f.gender,
        phone: f.phone,
        emergency_contact: JSON.stringify({
          name: f.emergencyContactName,
          phone: f.emergencyContactPhone,
          relationship: f.emergencyContactRelation,
        }),
        height: f.height,
        weight: f.weight,
      });

    } else if (accountType === 'child') {
      const f = childForm;
      if (!f.childFullName || !f.dateOfBirth || !f.gender || !f.parentPhone || !f.parentEmail || !f.parentPassword) {
        setError('Please fill in all required fields'); return;
      }
      if (f.parentPassword !== f.confirmPassword) { setError('Passwords do not match'); return; }
      if (f.parentPassword.length < 6) { setError('Password must be at least 6 characters'); return; }

      await signUp(f.parentEmail, f.parentPassword, {
        full_name: f.childFullName,
        account_type: 'child',
        date_of_birth: f.dateOfBirth,
        gender: f.gender,
        parent_phone: f.parentPhone,
        parent_email: f.parentEmail,
      });

    } else if (accountType === 'admin') {
      const f = officerForm;
      if (!f.fullName || !f.facilityName || !f.licenseNumber || !f.phone || !f.email || !f.password) {
        setError('Please fill in all required fields'); return;
      }
      if (f.password !== f.confirmPassword) { setError('Passwords do not match'); return; }
      if (f.password.length < 6) { setError('Password must be at least 6 characters'); return; }

      await signUp(f.email, f.password, {
        full_name: f.fullName,
        account_type: 'admin',
        facility_name: f.facilityName,
        license_number: f.licenseNumber,
        phone: f.phone,
      });
    }
  };

  const signUp = async (email: string, password: string, metadata: Record<string, string>) => {
    setIsLoading(true);
    setError('');
    try {
      // Set flag to prevent AuthContext from auto-navigating
      sessionStorage.setItem('signup_in_progress', 'true');

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: window.location.origin,
        },
      });

      if (signUpError) {
        sessionStorage.removeItem('signup_in_progress');
        setError(signUpError.message);
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // OPTIMIZED: Reduced retry delay from 800ms to 200ms for faster signup
        // Progressive delay for profile creation
        let profile: { emec_id: string } | null = null;
        for (let attempt = 0; attempt < 3; attempt++) {
          const { data: p } = await supabase
            .from('profiles')
            .select('emec_id')
            .eq('user_id', data.user.id)
            .maybeSingle();
          if (p?.emec_id) { profile = p; break; }
          await new Promise(r => setTimeout(r, 50 + (attempt * 50)));
        }

        // Fire-and-forget profile update — don't block the UI
        const profileUpdates: Record<string, string | null> = {
          full_name: metadata.full_name,
          date_of_birth: metadata.date_of_birth || null,
          gender: metadata.gender || null,
          phone: metadata.phone || null,
          account_type: metadata.account_type,
        };

        if (metadata.emergency_contact) {
          profileUpdates.emergency_contact = JSON.parse(metadata.emergency_contact);
        }
        if (metadata.height) profileUpdates.height = metadata.height;
        if (metadata.weight) profileUpdates.weight = metadata.weight;
        if (metadata.license_number) profileUpdates.license_number = metadata.license_number;
        if (metadata.parent_phone) profileUpdates.parent_phone = metadata.parent_phone;
        if (metadata.parent_email) profileUpdates.parent_email = metadata.parent_email;

        // Fire updates in background
        supabase.from('profiles').update(profileUpdates).eq('user_id', data.user.id).then(({ error: updateError }) => {
          if (updateError) console.error('Profile update error:', updateError);
        });

        if (metadata.facility_name) {
          supabase.from('user_roles').update({ facility_name: metadata.facility_name }).eq('user_id', data.user.id).then(({ error }) => {
            if (error) console.error('Role update error:', error);
          });
        }

        setCreatedEmecId(profile?.emec_id || 'EMEC-' + data.user.id.slice(0, 8).toUpperCase());
        setIsDemoMode(false);
        setStep('success');
        setIsLoading(false);

        toast({
          title: '🎉 Account Created!',
          description: 'Your EMEC account is ready.',
        });
      }
    } catch (err) {
      console.error('Signup error:', err);
      sessionStorage.removeItem('signup_in_progress');
      const errorMessage = err instanceof Error ? err.message : 'Registration failed. Please try again.';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: 'Copied!', description: 'EMEC ID copied to clipboard' });
  };

  // Account Type Selection
  if (step === 'type') {
    return (
      <Card className="shadow-elegant border-0">
        <CardHeader className="text-center border-b bg-primary/5">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onBack} className="gap-1">
              <ArrowLeft className="w-4 h-4" /> Back
            </Button>
            <Badge className="bg-primary text-primary-foreground">Live Account</Badge>
          </div>
          <CardTitle className="text-2xl flex items-center justify-center gap-2 mt-3">
            <UserPlus className="w-6 h-6" />
            Select Account Type
          </CardTitle>
          <CardDescription>Choose the type of account to create</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {[
            { type: 'adult' as AccountType, icon: UserCircle, label: 'Adult', desc: 'Personal health records & management', color: 'text-blue-500' },
            { type: 'child' as AccountType, icon: User, label: 'Child', desc: 'Managed by parent/guardian', color: 'text-green-500' },
            { type: 'admin' as AccountType, icon: Shield, label: 'Health Officer', desc: 'Medical professional account', color: 'text-amber-500' },
          ].map(({ type, icon: Icon, label, desc, color }) => (
            <button
              key={type}
              onClick={() => { setAccountType(type); setStep('form'); }}
              className="w-full p-5 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-muted/50 transition-all text-left flex items-center gap-4"
            >
              <div className={`w-14 h-14 rounded-xl bg-muted flex items-center justify-center ${color}`}>
                <Icon className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-foreground">{label}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground" />
            </button>
          ))}
        </CardContent>
      </Card>
    );
  }

  // Success Screen
  if (step === 'success') {
    return (
      <Card className="shadow-elegant border-0">
        <CardContent className="p-8 space-y-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Account Created!</h2>
            <p className="text-muted-foreground mt-1">Your EMEC health profile is now active</p>
          </div>
          <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
            <p className="text-xs text-muted-foreground mb-1">Your EMEC ID</p>
            <div className="flex items-center justify-center gap-2">
              <p className="text-2xl font-mono font-bold text-primary tracking-widest">{createdEmecId}</p>
              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(createdEmecId)}>
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <Alert className="text-left">
            <Mail className="h-4 w-4" />
            <AlertDescription>
              A verification email has been sent. Please verify your email to activate your account fully.
              {accountType === 'child' && ' Parent approval is required before the account becomes active.'}
            </AlertDescription>
          </Alert>
          <Button onClick={async () => {
            sessionStorage.removeItem('signup_in_progress');
            await loadSessionUser();
            navigate('/dashboard');
          }} className="w-full h-12 text-lg gap-2">
            <Heart className="w-5 h-5" />
            Go to Dashboard
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Registration Form
  return (
    <Card className="shadow-elegant border-0">
      <CardHeader className="border-b bg-primary/5">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => setStep('type')} className="gap-1">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
          <Badge className="bg-primary text-primary-foreground capitalize">
            {accountType === 'admin' ? 'Health Officer' : accountType}
          </Badge>
        </div>
        <CardTitle className="text-xl flex items-center gap-2 mt-2">
          <FileText className="w-5 h-5" />
          {accountType === 'adult' ? 'Adult Registration' : accountType === 'child' ? 'Child Registration' : 'Health Officer Registration'}
        </CardTitle>
        <CardDescription>All fields marked * are required</CardDescription>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        {/* ADULT FORM */}
        {accountType === 'adult' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-full space-y-1.5">
                <Label className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Full Name *</Label>
                <Input value={adultForm.fullName} onChange={e => setAdultForm({...adultForm, fullName: e.target.value})} placeholder="Enter full name" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !adultForm.dateOfBirth && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {adultForm.dateOfBirth ? format(new Date(adultForm.dateOfBirth), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={adultForm.dateOfBirth ? new Date(adultForm.dateOfBirth) : undefined}
                      onSelect={(date) => setAdultForm({...adultForm, dateOfBirth: date ? format(date, 'yyyy-MM-dd') : ''})}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label>Gender *</Label>
                <Select value={adultForm.gender} onValueChange={v => setAdultForm({...adultForm, gender: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone Number *</Label>
                <Input value={adultForm.phone} onChange={e => setAdultForm({...adultForm, phone: e.target.value})} placeholder="+254 7XX XXX XXX" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email *</Label>
                <Input type="email" value={adultForm.email} onChange={e => setAdultForm({...adultForm, email: e.target.value})} placeholder="you@email.com" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Ruler className="w-3.5 h-3.5" /> Height (cm) *</Label>
                <Input type="number" value={adultForm.height} onChange={e => setAdultForm({...adultForm, height: e.target.value})} placeholder="170" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Weight className="w-3.5 h-3.5" /> Weight (kg) *</Label>
                <Input type="number" value={adultForm.weight} onChange={e => setAdultForm({...adultForm, weight: e.target.value})} placeholder="65" />
              </div>
            </div>

            <div className="border-t pt-3 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Emergency Contact *</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label>Name *</Label>
                  <Input value={adultForm.emergencyContactName} onChange={e => setAdultForm({...adultForm, emergencyContactName: e.target.value})} placeholder="Contact name" />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone *</Label>
                  <Input value={adultForm.emergencyContactPhone} onChange={e => setAdultForm({...adultForm, emergencyContactPhone: e.target.value})} placeholder="+254..." />
                </div>
                <div className="space-y-1.5">
                  <Label>Relationship</Label>
                  <Input value={adultForm.emergencyContactRelation} onChange={e => setAdultForm({...adultForm, emergencyContactRelation: e.target.value})} placeholder="e.g. Spouse" />
                </div>
              </div>
            </div>

            <div className="border-t pt-3 space-y-3">
              <h4 className="font-semibold text-sm flex items-center gap-1"><Lock className="w-3.5 h-3.5" /> Security</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Password *</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} value={adultForm.password} onChange={e => setAdultForm({...adultForm, password: e.target.value})} placeholder="Min 6 chars" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm Password *</Label>
                  <Input type="password" value={adultForm.confirmPassword} onChange={e => setAdultForm({...adultForm, confirmPassword: e.target.value})} placeholder="Re-enter" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* CHILD FORM */}
        {accountType === 'child' && (
          <>
            <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-950/30">
              <Users className="h-4 w-4" />
              <AlertDescription>
                Child accounts require parent/guardian details. The parent email will be used for login and approval.
              </AlertDescription>
            </Alert>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-full space-y-1.5">
                <Label className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Child's Full Name *</Label>
                <Input value={childForm.childFullName} onChange={e => setChildForm({...childForm, childFullName: e.target.value})} placeholder="Child's name" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><CalendarIcon className="w-3.5 h-3.5" /> Date of Birth *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !childForm.dateOfBirth && "text-muted-foreground")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {childForm.dateOfBirth ? format(new Date(childForm.dateOfBirth), "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={childForm.dateOfBirth ? new Date(childForm.dateOfBirth) : undefined}
                      onSelect={(date) => setChildForm({...childForm, dateOfBirth: date ? format(date, 'yyyy-MM-dd') : ''})}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-1.5">
                <Label>Gender *</Label>
                <Select value={childForm.gender} onValueChange={v => setChildForm({...childForm, gender: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Parent Phone *</Label>
                <Input value={childForm.parentPhone} onChange={e => setChildForm({...childForm, parentPhone: e.target.value})} placeholder="+254 7XX XXX XXX" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Parent Email *</Label>
                <Input type="email" value={childForm.parentEmail} onChange={e => setChildForm({...childForm, parentEmail: e.target.value})} placeholder="parent@email.com" />
              </div>
            </div>
            <div className="border-t pt-3 space-y-3">
              <h4 className="font-semibold text-sm"><Lock className="w-3.5 h-3.5 inline mr-1" />Parent Account Security</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Password *</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} value={childForm.parentPassword} onChange={e => setChildForm({...childForm, parentPassword: e.target.value})} placeholder="Min 6 chars" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm Password *</Label>
                  <Input type="password" value={childForm.confirmPassword} onChange={e => setChildForm({...childForm, confirmPassword: e.target.value})} placeholder="Re-enter" />
                </div>
              </div>
            </div>
          </>
        )}

        {/* HEALTH OFFICER FORM */}
        {accountType === 'admin' && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="col-span-full space-y-1.5">
                <Label className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Full Name *</Label>
                <Input value={officerForm.fullName} onChange={e => setOfficerForm({...officerForm, fullName: e.target.value})} placeholder="Dr. Full Name" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> Facility Name *</Label>
                <Input value={officerForm.facilityName} onChange={e => setOfficerForm({...officerForm, facilityName: e.target.value})} placeholder="Hospital/Clinic name" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><FileText className="w-3.5 h-3.5" /> License Number *</Label>
                <Input value={officerForm.licenseNumber} onChange={e => setOfficerForm({...officerForm, licenseNumber: e.target.value})} placeholder="KE-MED-XXXX-XXX" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone *</Label>
                <Input value={officerForm.phone} onChange={e => setOfficerForm({...officerForm, phone: e.target.value})} placeholder="+254 7XX XXX XXX" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email *</Label>
                <Input type="email" value={officerForm.email} onChange={e => setOfficerForm({...officerForm, email: e.target.value})} placeholder="doctor@facility.com" />
              </div>
            </div>
            <div className="border-t pt-3 space-y-3">
              <h4 className="font-semibold text-sm"><Lock className="w-3.5 h-3.5 inline mr-1" />Security</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label>Password *</Label>
                  <div className="relative">
                    <Input type={showPassword ? 'text' : 'password'} value={officerForm.password} onChange={e => setOfficerForm({...officerForm, password: e.target.value})} placeholder="Min 6 chars" className="pr-10" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label>Confirm Password *</Label>
                  <Input type="password" value={officerForm.confirmPassword} onChange={e => setOfficerForm({...officerForm, confirmPassword: e.target.value})} placeholder="Re-enter" />
                </div>
              </div>
            </div>
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/30">
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Health Officer accounts start with zero patient access. Access is granted only through proper consent workflows.
              </AlertDescription>
            </Alert>
          </>
        )}

        {error && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Button onClick={validateAndSubmit} disabled={isLoading} className="w-full h-12 text-lg">
          {isLoading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-5 h-5 animate-spin" />
              Creating Account...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <UserPlus className="w-5 h-5" />
              Create Account
            </span>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
