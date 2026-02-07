import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, Heart, Shield, FileText, Activity, Clock,
  CreditCard, Building2, AlertTriangle, Info, Copy,
  CheckCircle, Phone, BookOpen, Stethoscope, MapPin,
  Search, Edit, Lock, Users
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { AdminVerificationModal } from '@/components/auth/AdminVerificationModal';
import { AdminRecordEditor } from '@/components/records/AdminRecordEditor';

interface NewUserData {
  isNewUser: boolean;
  patientId: string;
  consentCode: string;
  accountType?: string;
  createdAt: string;
}

interface LocalPatient {
  id: string;
  name: string;
  emecId: string;
  accountType: string;
}

export function NewUserDashboard() {
  const { currentUser } = useAuth();
  const { isDemoMode } = useDemo();
  const { toast } = useToast();
  const [newUserData, setNewUserData] = useState<NewUserData | null>(null);
  const [consentExpired, setConsentExpired] = useState(false);
  
  // Admin states
  const [showAdminVerification, setShowAdminVerification] = useState(false);
  const [isAdminVerified, setIsAdminVerified] = useState(false);
  const [searchEmecId, setSearchEmecId] = useState('');
  const [localPatients, setLocalPatients] = useState<LocalPatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<LocalPatient | null>(null);
  const [showRecordEditor, setShowRecordEditor] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      const storedData = localStorage.getItem(`new_user_${currentUser.id}`);
      if (storedData) {
        const data = JSON.parse(storedData);
        setNewUserData(data);
        
        // Check if consent code expired (5 min)
        const createdAt = new Date(data.createdAt);
        const now = new Date();
        const diffMinutes = (now.getTime() - createdAt.getTime()) / 1000 / 60;
        if (diffMinutes > 5) {
          setConsentExpired(true);
        }
      }
      
      // Load all local patients for admin search
      loadLocalPatients();
    }
  }, [currentUser]);

  const loadLocalPatients = () => {
    const patients: LocalPatient[] = [];
    // Scan localStorage for new_user entries
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('new_user_local-')) {
        try {
          const userId = key.replace('new_user_', '');
          const userData = localStorage.getItem(`emec_auth_v1`);
          // Also check saved user data
          const newUserInfo = JSON.parse(localStorage.getItem(key) || '{}');
          
          // Get user from auth storage
          const savedAuth = localStorage.getItem('emec_auth_v1');
          if (savedAuth) {
            const authUser = JSON.parse(savedAuth);
            if (authUser.id === userId) {
              patients.push({
                id: userId,
                name: authUser.name,
                emecId: authUser.emecId,
                accountType: newUserInfo.accountType || 'adult',
              });
            }
          }
        } catch (e) {
          // Skip invalid entries
        }
      }
    }

    if (!profile) {
  return (
    <div>
      <h2>Welcome!</h2>
      <p>Profile setup is only available after authentication.</p>
    </div>
  );
}

    
    // Add current user if they're a patient
    if (currentUser && newUserData?.accountType !== 'admin') {
      const exists = patients.find(p => p.id === currentUser.id);
      if (!exists) {
        patients.push({
          id: currentUser.id,
          name: currentUser.name,
          emecId: currentUser.emecId,
          accountType: newUserData?.accountType || 'adult',
        });
      }
    }
    
    setLocalPatients(patients);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied!',
      description: `${label} copied to clipboard`,
    });
  };

  const generateNewConsentCode = () => {
    const newCode = String(Math.floor(100000 + Math.random() * 900000));
    if (currentUser?.id && newUserData) {
      const updatedData = {
        ...newUserData,
        consentCode: newCode,
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem(`new_user_${currentUser.id}`, JSON.stringify(updatedData));
      setNewUserData(updatedData);
      setConsentExpired(false);
      toast({
        title: 'New Consent Code Generated',
        description: 'Your new code is valid for 5 minutes.',
      });
    }
  };

  const handleAdminAccessRequest = () => {
    setShowAdminVerification(true);
  };

  const handleAdminVerified = () => {
    setIsAdminVerified(true);
    toast({
      title: '✓ Admin Access Granted',
      description: 'You can now edit patient records',
    });
  };

  const handleSearchPatient = () => {
    const found = localPatients.find(p => 
      p.emecId.toLowerCase() === searchEmecId.toLowerCase()
    );
    if (found) {
      setSelectedPatient(found);
      toast({
        title: 'Patient Found',
        description: `Found ${found.name}`,
      });
    } else {
      toast({
        title: 'Patient Not Found',
        description: 'No patient with that EMEC ID exists in the system',
        variant: 'destructive',
      });
    }
  };

  const handleEditPatientRecords = (patient: LocalPatient) => {
    setSelectedPatient(patient);
    setShowRecordEditor(true);
  };

  if (!currentUser) return null;

  const isAdmin = newUserData?.accountType === 'admin' || currentUser.role === 'admin';
  const isParent = newUserData?.accountType === 'parent' || currentUser.role === 'parent';

  // If admin is editing records, show the editor
  if (showRecordEditor && selectedPatient && isAdminVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
        <div className="p-4 md:p-6 max-w-5xl mx-auto">
          {isDemoMode && (
            <div className="fixed top-4 right-4 z-50">
              <Badge className="bg-amber-500 text-white px-3 py-1.5 text-sm font-semibold animate-pulse">
                🧪 New Patient
              </Badge>
            </div>
          )}
          <AdminRecordEditor
            patientId={selectedPatient.id}
            patientName={selectedPatient.name}
            patientEmecId={selectedPatient.emecId}
            onClose={() => {
              setShowRecordEditor(false);
              setSelectedPatient(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
        {/* Demo Mode Badge */}
        {isDemoMode && (
          <div className="fixed top-4 right-4 z-50">
            <Badge className="bg-amber-500 text-white px-3 py-1.5 text-sm font-semibold animate-pulse">
              🧪 DEMO MODE
            </Badge>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg ${
              isAdmin ? 'bg-gradient-to-br from-purple-500 to-indigo-500' :
              isParent ? 'bg-gradient-to-br from-green-500 to-teal-500' :
              'bg-gradient-to-br from-blue-500 to-cyan-500'
            }`}>
              {isAdmin ? <Shield className="w-8 h-8 text-white" /> :
               isParent ? <Users className="w-8 h-8 text-white" /> :
               <User className="w-8 h-8 text-white" />}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{currentUser.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="font-mono text-xs">
                  <CreditCard className="w-3 h-3 mr-1" />
                  {currentUser.emecId}
                </Badge>
                <Badge className={`border ${
                  isAdmin ? 'bg-purple-500/20 text-purple-600 border-purple-500/30' :
                  isParent ? 'bg-green-500/20 text-green-600 border-green-500/30' :
                  'bg-amber-500/20 text-amber-600 border-amber-500/30'
                }`}>
                  {isAdmin ? 'Health Officer' : isParent ? 'Parent/Guardian' : 'New Patient'}
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/emergency">
                <Phone className="w-4 h-4 mr-2" />
                Emergency
              </Link>
            </Button>
            <Button asChild>
              <Link to="/education">
                <BookOpen className="w-4 h-4 mr-2" />
                Education
              </Link>
            </Button>
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <Card className="border-2 border-purple-500/30 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/20 dark:to-indigo-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-purple-600" />
                Health Officer Panel
              </CardTitle>
              <CardDescription>
                {isAdminVerified 
                  ? 'Access granted - You can now search and edit patient records'
                  : 'Verify your credentials to access patient records'
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isAdminVerified ? (
                <div className="text-center py-4">
                  <Lock className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground mb-4">
                    Admin verification required to access patient records
                  </p>
                  <Button onClick={handleAdminAccessRequest}>
                    <Shield className="w-4 h-4 mr-2" />
                    Verify Admin Access
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Patient Search */}
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <Label className="sr-only">Search Patient EMEC ID</Label>
                      <Input
                        value={searchEmecId}
                        onChange={(e) => setSearchEmecId(e.target.value.toUpperCase())}
                        placeholder="Enter patient EMEC ID..."
                        className="font-mono"
                        onKeyDown={(e) => e.key === 'Enter' && handleSearchPatient()}
                      />
                    </div>
                    <Button onClick={handleSearchPatient}>
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>

                  {/* Selected Patient */}
                  {selectedPatient && (
                    <div className="p-4 rounded-lg border bg-card">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <User className="w-8 h-8 text-primary" />
                          <div>
                            <p className="font-semibold">{selectedPatient.name}</p>
                            <p className="text-sm text-muted-foreground font-mono">{selectedPatient.emecId}</p>
                          </div>
                        </div>
                        <Button onClick={() => handleEditPatientRecords(selectedPatient)}>
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Records
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Available Patients List */}
                  <div className="space-y-2">
                    <Label className="text-sm text-muted-foreground">Available Patients ({localPatients.filter(p => p.accountType !== 'admin').length})</Label>
                    <div className="grid gap-2 max-h-48 overflow-y-auto">
                      {localPatients.filter(p => p.accountType !== 'admin').map((patient) => (
                        <button
                          key={patient.id}
                          onClick={() => setSelectedPatient(patient)}
                          className={`p-3 rounded-lg border text-left transition-all ${
                            selectedPatient?.id === patient.id
                              ? 'border-primary bg-primary/10'
                              : 'border-border hover:border-primary/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{patient.name}</span>
                            <Badge variant="outline" className="font-mono text-xs">{patient.emecId}</Badge>
                          </div>
                        </button>
                      ))}
                      {localPatients.filter(p => p.accountType !== 'admin').length === 0 && (
                        <p className="text-sm text-muted-foreground text-center py-4">
                          No patients registered yet. Create a new patient account to test.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Patient ID Card - Show for non-admins or always show credentials */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Credentials
            </CardTitle>
            <CardDescription>
              {isAdmin ? 'Your admin credentials' : 'Keep these safe - needed for all health facility visits'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              {/* EMEC ID */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">EMEC ID</p>
                    <p className="font-mono font-bold text-xl tracking-wider">{currentUser.emecId}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(currentUser.emecId, 'EMEC ID')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Hospital File Number */}
              <div className="p-4 rounded-xl bg-muted border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">Hospital File Number</p>
                    <p className="font-mono font-semibold text-lg">{newUserData?.patientId || 'EMEC/2025/00001'}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(newUserData?.patientId || '', 'File Number')}>
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Consent Code */}
              <div className={`p-4 rounded-xl border ${consentExpired ? 'bg-destructive/10 border-destructive/30' : 'bg-success/10 border-success/30'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Consent Code {consentExpired ? '(Expired)' : '(5 min)'}
                    </p>
                    <p className={`font-mono font-bold text-xl tracking-widest ${consentExpired ? 'text-destructive line-through' : 'text-success'}`}>
                      {newUserData?.consentCode || '------'}
                    </p>
                  </div>
                  {consentExpired ? (
                    <Button size="sm" variant="outline" onClick={generateNewConsentCode}>
                      Regenerate
                    </Button>
                  ) : (
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(newUserData?.consentCode || '', 'Consent Code')}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                {isAdmin 
                  ? 'Use your credentials to access the admin panel and manage patient records.'
                  : 'Share your consent code only with authorized healthcare personnel at verified facilities.'
                }
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Empty Records Notice - Only for non-admins */}
        {!isAdmin && (
          <Card className="border-2 border-dashed border-muted-foreground/30">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No Medical Records Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto mb-6">
                Your health records are empty. Visit your nearest health facility to have a healthcare provider update your information with your consent code.
              </p>
              <Button variant="outline" asChild>
                <Link to="/emergency">
                  <MapPin className="w-4 h-4 mr-2" />
                  Find Nearby Facilities
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Health Records Tabs (Empty State) - Only for non-admins */}
        {!isAdmin && (
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="diagnosis">Diagnosis</TabsTrigger>
              <TabsTrigger value="medications">Medications</TabsTrigger>
              <TabsTrigger value="goals">Goals</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="access">Access Logs</TabsTrigger>
            </TabsList>

            {/* All tabs show empty state */}
            {['overview', 'history', 'diagnosis', 'medications', 'goals', 'media', 'access'].map((tab) => (
              <TabsContent key={tab} value={tab} className="mt-4">
                <Card>
                  <CardContent className="p-8 text-center">
                    <div className="w-12 h-12 mx-auto rounded-full bg-muted flex items-center justify-center mb-3">
                      {tab === 'overview' && <Activity className="w-6 h-6 text-muted-foreground" />}
                      {tab === 'history' && <Clock className="w-6 h-6 text-muted-foreground" />}
                      {tab === 'diagnosis' && <Stethoscope className="w-6 h-6 text-muted-foreground" />}
                      {tab === 'medications' && <Heart className="w-6 h-6 text-muted-foreground" />}
                      {tab === 'goals' && <CheckCircle className="w-6 h-6 text-muted-foreground" />}
                      {tab === 'media' && <FileText className="w-6 h-6 text-muted-foreground" />}
                      {tab === 'access' && <Shield className="w-6 h-6 text-muted-foreground" />}
                    </div>
                    <h4 className="font-medium text-muted-foreground capitalize">{tab === 'access' ? 'Access Logs' : tab}</h4>
                    <p className="text-sm text-muted-foreground mt-1">No data yet</p>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Next Steps - Only for non-admins */}
        {!isAdmin && (
          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 border-0">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-background/80 border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <h4 className="font-medium">Visit Health Facility</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Go to your nearest verified health facility with your EMEC ID
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-background/80 border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <h4 className="font-medium">Share Consent Code</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Provide your consent code to authorize record updates
                  </p>
                </div>
                
                <div className="p-4 rounded-lg bg-background/80 border">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <h4 className="font-medium">Records Updated</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Healthcare provider adds your medical information securely
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Important Notice */}
        <Alert className="border-warning bg-warning/10">
          <AlertTriangle className="h-4 w-4 text-warning" />
          <AlertTitle className="text-warning-foreground">Important</AlertTitle>
          <AlertDescription className="text-muted-foreground">
            This is a demo application. In production, your data would be stored securely in a centralized Kenyan health records system. 
            Always visit official healthcare facilities for actual medical services.
          </AlertDescription>
        </Alert>
      </div>

      {/* Admin Verification Modal */}
      <AdminVerificationModal
        isOpen={showAdminVerification}
        onClose={() => setShowAdminVerification(false)}
        targetPatientEmecId={currentUser.emecId}
        targetPatientName={currentUser.name}
        onVerified={handleAdminVerified}
      />
    </div>
  );
}
