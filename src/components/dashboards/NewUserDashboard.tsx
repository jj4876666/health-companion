import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  User, Heart, Shield, FileText, Activity, Clock,
  CreditCard, Building2, AlertTriangle, Info, Copy,
  CheckCircle, Phone, BookOpen, Stethoscope, MapPin
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NewUserData {
  isNewUser: boolean;
  patientId: string;
  consentCode: string;
  createdAt: string;
}

export function NewUserDashboard() {
  const { currentUser } = useAuth();
  const { isDemoMode } = useDemo();
  const { toast } = useToast();
  const [newUserData, setNewUserData] = useState<NewUserData | null>(null);
  const [consentExpired, setConsentExpired] = useState(false);

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
    }
  }, [currentUser]);

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

  if (!currentUser) return null;

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{currentUser.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="font-mono text-xs">
                  <CreditCard className="w-3 h-3 mr-1" />
                  {currentUser.emecId}
                </Badge>
                <Badge className="bg-amber-500/20 text-amber-600 border-amber-500/30">
                  New Patient
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

        {/* Patient ID Card */}
        <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Patient Credentials
            </CardTitle>
            <CardDescription>
              Keep these safe - needed for all health facility visits
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
                Share your consent code only with authorized healthcare personnel at verified facilities.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Empty Records Notice */}
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

        {/* Health Records Tabs (Empty State) */}
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

        {/* Next Steps */}
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
    </div>
  );
}
