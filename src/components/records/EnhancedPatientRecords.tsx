import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Syringe, Pill, AlertTriangle, Activity, Heart, 
  Calendar, User, Building2, Clock, Shield, CheckCircle2, 
  Stethoscope, TestTube, Thermometer, Eye, Target, Image,
  Lock, History, UserCheck, AlertCircle, Fingerprint, KeyRound,
  ClipboardList, FileImage, UserCog
} from 'lucide-react';
import { SecurityAccessModal } from './SecurityAccessModal';
import { RecordAccessLog } from './RecordAccessLog';
import { format } from 'date-fns';

interface PatientRecord {
  id: string;
  patientId: string;
  emecId: string;
  createdAt: string;
  lastUpdated: string;
  lastEditor: string;
  facilityName: string;
  hasData: boolean;
}

interface Props {
  isNewPatient?: boolean;
  patientEmecId?: string;
  consentCode?: string;
}

export function EnhancedPatientRecords({ isNewPatient = false, patientEmecId, consentCode }: Props) {
  const { currentUser, auditLog } = useAuth();
  const { isDemoMode } = useDemo();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [hasValidAccess, setHasValidAccess] = useState(false);
  const [accessExpiry, setAccessExpiry] = useState<Date | null>(null);
  const [blockedAttempts, setBlockedAttempts] = useState<Array<{time: Date; reason: string}>>([]);
  const [showEmergencyOverride, setShowEmergencyOverride] = useState(false);

  // Demo patient record data
  const [patientRecord, setPatientRecord] = useState<PatientRecord>({
    id: `PAT-${Date.now()}`,
    patientId: currentUser?.id || '',
    emecId: patientEmecId || currentUser?.emecId || 'NEW-PATIENT',
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
    lastEditor: 'System',
    facilityName: 'Registration Desk',
    hasData: !isNewPatient,
  });

  // Generate hospital-style patient ID
  const hospitalPatientId = `EMEC/${new Date().getFullYear()}/${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;

  // Demo record sections with empty state for new patients
  const recordSections = {
    overview: isNewPatient ? null : {
      vitals: { bp: '120/80', pulse: 72, temp: '36.5°C', weight: '70kg', height: '170cm', bmi: 24.2 },
      lastVisit: '2025-01-15',
      conditions: ['Type 2 Diabetes', 'Hypertension'],
      allergies: ['Penicillin', 'Peanuts'],
    },
    medicalHistory: isNewPatient ? [] : [
      { date: '2024-01-15', event: 'Annual Checkup', facility: 'Kenyatta Hospital', doctor: 'Dr. Wanjiru' },
      { date: '2023-06-20', event: 'Malaria Treatment', facility: 'Mbita Health Center', doctor: 'Dr. Omondi' },
    ],
    diagnosis: isNewPatient ? [] : [
      { date: '2024-01-15', diagnosis: 'Pre-diabetes', icd10: 'R73.03', status: 'Active', treatingDoctor: 'Dr. Ochieng' },
      { date: '2023-06-20', diagnosis: 'Malaria (P. falciparum)', icd10: 'B50.9', status: 'Resolved', treatingDoctor: 'Dr. Omondi' },
    ],
    medications: isNewPatient ? [] : [
      { drug: 'Metformin 500mg', dosage: 'Twice daily', startDate: '2024-01-20', prescribedBy: 'Dr. Ochieng', status: 'Active' },
      { drug: 'Lisinopril 10mg', dosage: 'Once daily', startDate: '2024-01-20', prescribedBy: 'Dr. Wanjiru', status: 'Active' },
    ],
    dailyGoals: isNewPatient ? null : {
      water: { target: 8, current: 5, unit: 'glasses' },
      steps: { target: 10000, current: 6500, unit: 'steps' },
      sleep: { target: 8, current: 7, unit: 'hours' },
      medication: { target: 2, current: 2, unit: 'doses' },
    },
    media: isNewPatient ? [] : [
      { id: '1', type: 'xray', name: 'Chest X-Ray', date: '2024-01-15', facility: 'Nairobi Hospital' },
      { id: '2', type: 'scan', name: 'Abdominal Ultrasound', date: '2023-12-10', facility: 'Aga Khan Hospital' },
    ],
  };

  // Handle blocked access attempts
  const handleBlockedAttempt = (reason: string) => {
    const attempt = { time: new Date(), reason };
    setBlockedAttempts(prev => [...prev, attempt]);
    
    toast({
      variant: 'destructive',
      title: '🚫 Access Blocked',
      description: reason,
    });
  };

  // Security access verification
  const handleSecurityVerification = (success: boolean, isEmergency: boolean = false) => {
    if (success) {
      setHasValidAccess(true);
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + (isEmergency ? 15 : 30));
      setAccessExpiry(expiry);
      
      if (isEmergency) {
        toast({
          title: '⚠️ Emergency Override Active',
          description: 'Limited access granted for 15 minutes. All actions are logged.',
        });
        setShowEmergencyOverride(true);
      } else {
        toast({
          title: '✅ Access Granted',
          description: 'You have 30 minutes to view/edit records.',
        });
      }
    } else {
      handleBlockedAttempt('Invalid consent code or PIN');
    }
    setIsSecurityModalOpen(false);
  };

  // Check access expiry
  useEffect(() => {
    if (accessExpiry) {
      const timer = setInterval(() => {
        if (new Date() > accessExpiry) {
          setHasValidAccess(false);
          setAccessExpiry(null);
          toast({
            title: 'Access Expired',
            description: 'Your session has expired. Please re-authenticate.',
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [accessExpiry, toast]);

  const getAccessTimeRemaining = () => {
    if (!accessExpiry) return null;
    const remaining = Math.max(0, accessExpiry.getTime() - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Demo Mode Badge */}
      {isDemoMode && (
        <div className="fixed top-4 right-4 z-50">
          <Badge className="bg-amber-500 text-white px-3 py-1.5 text-sm font-semibold animate-pulse">
            🧪 DEMO MODE
          </Badge>
        </div>
      )}

      {/* Emergency Override Warning */}
      {showEmergencyOverride && (
        <Alert variant="destructive" className="border-2 border-orange-500 bg-orange-50 dark:bg-orange-950">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-orange-700 dark:text-orange-300">Emergency Override Active</AlertTitle>
          <AlertDescription className="text-orange-600 dark:text-orange-400">
            Time-limited access granted. All actions are logged and will be reviewed. 
            Patient will be notified of this emergency access.
          </AlertDescription>
        </Alert>
      )}

      {/* Blocked Attempts Alert */}
      {blockedAttempts.length > 0 && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>
            {blockedAttempts.length} unauthorized access attempt(s) detected and logged.
          </AlertDescription>
        </Alert>
      )}

      {/* Header with Patient ID */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-xl border-2 border-primary/20 shadow-elegant">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                Patient Health Records
                {hasValidAccess && (
                  <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                    <Lock className="w-3 h-3 mr-1" />
                    Verified Access
                  </Badge>
                )}
              </h1>
              <p className="text-muted-foreground">
                {isNewPatient ? 'New patient file created' : 'Complete medical history'}
              </p>
            </div>
          </div>
          
          {/* Hospital-style Patient ID */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-xs text-muted-foreground">EMEC ID</p>
              <p className="font-mono font-bold text-primary">{patientRecord.emecId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Hospital File No.</p>
              <p className="font-mono font-semibold">{hospitalPatientId}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created</p>
              <p className="text-sm">{format(new Date(patientRecord.createdAt), 'dd/MM/yyyy HH:mm')}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Updated</p>
              <p className="text-sm">{format(new Date(patientRecord.lastUpdated), 'dd/MM/yyyy HH:mm')}</p>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="flex flex-col gap-2">
          {hasValidAccess && accessExpiry && (
            <Badge variant="outline" className="text-sm py-1.5">
              <Clock className="w-3 h-3 mr-1" />
              Access expires: {getAccessTimeRemaining()}
            </Badge>
          )}
          {!hasValidAccess && currentUser?.role === 'admin' && (
            <Button onClick={() => setIsSecurityModalOpen(true)} className="gap-2">
              <Fingerprint className="w-4 h-4" />
              Request Access
            </Button>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <Card className="border-primary/30 bg-gradient-to-r from-primary/5 to-primary/10">
        <CardContent className="py-4 flex items-center gap-4">
          <Shield className="w-8 h-8 text-primary" />
          <div className="flex-1">
            <p className="font-medium">HIPAA & Kenya Data Protection Compliant</p>
            <p className="text-sm text-muted-foreground">
              All access is logged, encrypted, and requires consent verification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success">Secured</span>
          </div>
        </CardContent>
      </Card>

      {/* Consent Code Display for New Patients */}
      {isNewPatient && consentCode && (
        <Card className="border-2 border-success/50 bg-success/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <KeyRound className="w-5 h-5" />
              Your Consent Code
            </CardTitle>
            <CardDescription>
              Share this code with healthcare providers to grant access to your records
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-4xl font-mono font-bold tracking-widest text-primary">
                {consentCode}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Valid for 5 minutes • Keep this secure
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Records Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 h-auto">
          <TabsTrigger value="overview" className="gap-1 text-xs py-2 flex-col h-auto">
            <Activity className="w-4 h-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1 text-xs py-2 flex-col h-auto">
            <History className="w-4 h-4" />
            <span className="hidden sm:inline">History</span>
          </TabsTrigger>
          <TabsTrigger value="diagnosis" className="gap-1 text-xs py-2 flex-col h-auto">
            <Stethoscope className="w-4 h-4" />
            <span className="hidden sm:inline">Diagnosis</span>
          </TabsTrigger>
          <TabsTrigger value="medications" className="gap-1 text-xs py-2 flex-col h-auto">
            <Pill className="w-4 h-4" />
            <span className="hidden sm:inline">Meds</span>
          </TabsTrigger>
          <TabsTrigger value="goals" className="gap-1 text-xs py-2 flex-col h-auto">
            <Target className="w-4 h-4" />
            <span className="hidden sm:inline">Goals</span>
          </TabsTrigger>
          <TabsTrigger value="media" className="gap-1 text-xs py-2 flex-col h-auto">
            <FileImage className="w-4 h-4" />
            <span className="hidden sm:inline">Media</span>
          </TabsTrigger>
          <TabsTrigger value="access" className="gap-1 text-xs py-2 flex-col h-auto">
            <UserCog className="w-4 h-4" />
            <span className="hidden sm:inline">Access</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-6">
          {isNewPatient || !recordSections.overview ? (
            <EmptyRecordState section="Overview" icon={Activity} />
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {/* Latest Vitals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Thermometer className="w-5 h-5 text-primary" />
                    Latest Vitals
                  </CardTitle>
                  <CardDescription>
                    Recorded: {recordSections.overview.lastVisit}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-3">
                    {Object.entries(recordSections.overview.vitals).map(([key, value]) => (
                      <div key={key} className="text-center p-3 bg-muted/50 rounded-lg">
                        <p className="text-xs text-muted-foreground capitalize">{key}</p>
                        <p className="font-bold text-lg">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Conditions & Allergies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlertTriangle className="w-5 h-5 text-destructive" />
                    Alerts
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-2">Active Conditions</p>
                    <div className="flex flex-wrap gap-2">
                      {recordSections.overview.conditions.map((c, i) => (
                        <Badge key={i} variant="secondary">{c}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium mb-2 text-destructive">Allergies</p>
                    <div className="flex flex-wrap gap-2">
                      {recordSections.overview.allergies.map((a, i) => (
                        <Badge key={i} variant="destructive">{a}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* Medical History Tab */}
        <TabsContent value="history" className="mt-6">
          {recordSections.medicalHistory.length === 0 ? (
            <EmptyRecordState section="Medical History" icon={History} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5 text-primary" />
                  Medical History
                </CardTitle>
                <CardDescription>
                  Chronological record of all medical events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="relative space-y-4 pl-6 border-l-2 border-primary/20">
                    {recordSections.medicalHistory.map((event, i) => (
                      <div key={i} className="relative">
                        <div className="absolute -left-[29px] w-4 h-4 rounded-full bg-primary border-4 border-background" />
                        <div className="p-4 rounded-lg bg-muted/50">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{event.event}</p>
                              <p className="text-sm text-muted-foreground">{event.facility}</p>
                            </div>
                            <Badge variant="outline">{event.date}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2">
                            Attended by: {event.doctor}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Diagnosis Tab */}
        <TabsContent value="diagnosis" className="mt-6">
          {recordSections.diagnosis.length === 0 ? (
            <EmptyRecordState section="Diagnosis & Treatment" icon={Stethoscope} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-primary" />
                  Diagnosis & Treatment
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordSections.diagnosis.map((dx, i) => (
                    <div key={i} className="p-4 rounded-lg border">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-semibold text-lg">{dx.diagnosis}</p>
                          <p className="text-sm text-muted-foreground font-mono">ICD-10: {dx.icd10}</p>
                        </div>
                        <Badge variant={dx.status === 'Active' ? 'default' : 'secondary'}>
                          {dx.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {dx.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {dx.treatingDoctor}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="mt-6">
          {recordSections.medications.length === 0 ? (
            <EmptyRecordState section="Medications" icon={Pill} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Pill className="w-5 h-5 text-orange-500" />
                  Current Medications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recordSections.medications.map((med, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900">
                      <Pill className="w-8 h-8 text-orange-500" />
                      <div className="flex-1">
                        <p className="font-semibold">{med.drug}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Started: {med.startDate} • Prescribed by: {med.prescribedBy}
                        </p>
                      </div>
                      <Badge variant={med.status === 'Active' ? 'default' : 'secondary'}>
                        {med.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Daily Goals Tab */}
        <TabsContent value="goals" className="mt-6">
          {!recordSections.dailyGoals ? (
            <EmptyRecordState section="Daily Goals" icon={Target} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-success" />
                  Daily Health Goals
                </CardTitle>
                <CardDescription>Track your daily wellness targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(recordSections.dailyGoals).map(([key, goal]) => (
                    <div key={key} className="p-4 rounded-lg bg-muted/50">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium capitalize">{key}</span>
                        <span className="text-sm text-muted-foreground">
                          {goal.current}/{goal.target} {goal.unit}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-success rounded-full transition-all"
                          style={{ width: `${Math.min(100, (goal.current / goal.target) * 100)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Media Tab */}
        <TabsContent value="media" className="mt-6">
          {recordSections.media.length === 0 ? (
            <EmptyRecordState section="Medical Images & Documents" icon={FileImage} />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileImage className="w-5 h-5 text-primary" />
                  Medical Images & Documents
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {recordSections.media.map((item) => (
                    <div key={item.id} className="p-4 rounded-lg border hover:border-primary/50 transition-colors cursor-pointer">
                      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-3">
                        <Image className="w-12 h-12 text-muted-foreground" />
                      </div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-muted-foreground">{item.facility}</p>
                      <p className="text-xs text-muted-foreground">{item.date}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Access Logs Tab */}
        <TabsContent value="access" className="mt-6">
          <RecordAccessLog 
            auditLog={auditLog.filter(log => 
              log.action.includes('VIEW') || 
              log.action.includes('EDIT') || 
              log.action.includes('ACCESS') ||
              log.action.includes('CONSENT')
            ).slice(0, 20)} 
          />
        </TabsContent>
      </Tabs>

      {/* Security Access Modal */}
      <SecurityAccessModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={handleSecurityVerification}
        patientEmecId={patientRecord.emecId}
      />
    </div>
  );
}

// Empty state component for new patients
function EmptyRecordState({ section, icon: Icon }: { section: string; icon: React.ElementType }) {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No {section} Data Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          This section will be populated as your healthcare providers add records.
          Your data is secure and protected.
        </p>
      </CardContent>
    </Card>
  );
}
