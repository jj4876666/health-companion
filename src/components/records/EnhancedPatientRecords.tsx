import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useDemo } from '@/contexts/DemoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, Syringe, Pill, AlertTriangle, Activity, Heart, 
  Calendar, User, Building2, Clock, Shield, CheckCircle2, 
  Stethoscope, TestTube, Thermometer, Eye, Target, Image,
  Lock, History, UserCheck, AlertCircle, Fingerprint, KeyRound,
  ClipboardList, FileImage, UserCog, TrendingUp, TrendingDown,
  Droplets, Brain, Bone, Scissors, Baby, Zap, Download, Share2
} from 'lucide-react';
import { SecurityAccessModal } from './SecurityAccessModal';
import { RecordAccessLog } from './RecordAccessLog';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

// ─── Rich Demo Data ────────────────────────────────────────

const demoVitalsHistory = [
  { date: 'Jan 23', systolic: 128, diastolic: 84, pulse: 70, temp: 36.6, weight: 79, bmi: 25.8 },
  { date: 'Jun 23', systolic: 130, diastolic: 85, pulse: 75, temp: 37.0, weight: 80, bmi: 26.1 },
  { date: 'Jan 24', systolic: 125, diastolic: 82, pulse: 72, temp: 36.8, weight: 78, bmi: 25.5 },
  { date: 'Jun 24', systolic: 122, diastolic: 80, pulse: 68, temp: 36.5, weight: 76, bmi: 24.8 },
  { date: 'Jan 25', systolic: 120, diastolic: 78, pulse: 70, temp: 36.7, weight: 75, bmi: 24.5 },
];

const demoLabResults = [
  { id: '1', test: 'Complete Blood Count (CBC)', date: '2025-01-15', facility: 'Nairobi Hospital Lab', status: 'Normal', doctor: 'Dr. Wanjiru', values: { wbc: '6.2', rbc: '4.8', hemoglobin: '14.5', platelets: '250' }, unit: 'x10³/μL' },
  { id: '2', test: 'Lipid Panel', date: '2025-01-15', facility: 'Nairobi Hospital Lab', status: 'Borderline', doctor: 'Dr. Wanjiru', values: { totalChol: '210', ldl: '135', hdl: '52', triglycerides: '160' }, unit: 'mg/dL' },
  { id: '3', test: 'HbA1c (Glycated Hemoglobin)', date: '2025-01-15', facility: 'Nairobi Hospital Lab', status: 'Pre-diabetic', doctor: 'Dr. Ochieng', values: { hba1c: '6.1%' }, unit: '%' },
  { id: '4', test: 'Liver Function Tests (LFT)', date: '2024-06-20', facility: 'Aga Khan Lab', status: 'Normal', doctor: 'Dr. Patel', values: { alt: '28', ast: '25', albumin: '4.2' }, unit: 'U/L' },
  { id: '5', test: 'Kidney Function (RFT)', date: '2024-06-20', facility: 'Aga Khan Lab', status: 'Normal', doctor: 'Dr. Patel', values: { creatinine: '0.9', bun: '15', gfr: '95' }, unit: 'mg/dL' },
  { id: '6', test: 'Thyroid Panel (TSH, T3, T4)', date: '2024-06-20', facility: 'Aga Khan Lab', status: 'Normal', doctor: 'Dr. Patel', values: { tsh: '2.5', t3: '1.2', t4: '8.1' }, unit: 'mIU/L' },
  { id: '7', test: 'Malaria Rapid Diagnostic Test', date: '2023-04-10', facility: 'Kenyatta Hospital', status: 'Positive', doctor: 'Dr. Odhiambo', values: { result: 'P. falciparum detected' }, unit: '' },
  { id: '8', test: 'Urinalysis', date: '2025-01-15', facility: 'Nairobi Hospital Lab', status: 'Normal', doctor: 'Dr. Wanjiru', values: { protein: 'Negative', glucose: 'Trace', ph: '6.5' }, unit: '' },
];

const demoImmunizations = [
  { id: '1', vaccine: 'BCG', date: '1995-03-15', facility: 'Kenyatta Hospital', batch: 'BCG-001', status: 'Complete' },
  { id: '2', vaccine: 'Polio (OPV) — 3 doses', date: '1995-05-20', facility: 'Kenyatta Hospital', batch: 'POL-102', status: 'Complete' },
  { id: '3', vaccine: 'DPT-HepB-Hib — 3 doses', date: '1995-07-20', facility: 'Kenyatta Hospital', batch: 'DPT-203', status: 'Complete' },
  { id: '4', vaccine: 'Measles-Rubella', date: '1996-03-15', facility: 'Nairobi Health Center', batch: 'MEA-304', status: 'Complete' },
  { id: '5', vaccine: 'Yellow Fever', date: '2010-06-10', facility: 'KEMRI', batch: 'YF-2010-456', status: 'Complete' },
  { id: '6', vaccine: 'Hepatitis B Booster', date: '2018-03-22', facility: 'Nairobi Hospital', batch: 'HBV-2018-789', status: 'Complete' },
  { id: '7', vaccine: 'COVID-19 (Pfizer) — 2 doses', date: '2021-08-15', facility: 'KICC Vaccination Center', batch: 'PFZ-2021-789', status: 'Complete' },
  { id: '8', vaccine: 'COVID-19 Booster', date: '2022-02-20', facility: 'KICC Vaccination Center', batch: 'PFZ-2022-123', status: 'Complete' },
  { id: '9', vaccine: 'Influenza (Seasonal)', date: '2024-10-05', facility: 'Nairobi Hospital', batch: 'FLU-2024-567', status: 'Due 2025' },
];

const demoSurgeries = [
  { id: '1', procedure: 'Appendectomy (Laparoscopic)', date: '2019-08-22', facility: 'Aga Khan Hospital', surgeon: 'Dr. Kamau', anesthesia: 'General', outcome: 'Successful', notes: 'No complications. Discharged after 2 days. Full recovery in 3 weeks.' },
  { id: '2', procedure: 'Right Radius Fracture – ORIF', date: '2015-11-05', facility: 'Nairobi Hospital', surgeon: 'Dr. Mwangi', anesthesia: 'Regional Block', outcome: 'Successful', notes: 'Plate and screws fixation. Cast for 6 weeks. Physiotherapy completed.' },
];

const demoMedicalHistory = [
  { date: '2025-01-15', event: 'Annual Health Screening', facility: 'Nairobi Hospital', doctor: 'Dr. Wanjiru', type: 'Checkup', summary: 'Full labs, vitals, and physical exam. Pre-diabetes management ongoing.' },
  { date: '2024-06-20', event: 'Follow-up: Lipid Panel Review', facility: 'Aga Khan Hospital', doctor: 'Dr. Patel', type: 'Follow-up', summary: 'Cholesterol slightly improved with medication. Continue statin therapy.' },
  { date: '2023-04-10', event: 'Acute Malaria (P. falciparum)', facility: 'Kenyatta Hospital', doctor: 'Dr. Odhiambo', type: 'Emergency', summary: 'Positive RDT. Treated with Coartem (3-day course). Full recovery.' },
  { date: '2019-08-22', event: 'Acute Appendicitis', facility: 'Aga Khan Hospital', doctor: 'Dr. Kamau', type: 'Surgery', summary: 'Laparoscopic appendectomy. Uneventful post-op.' },
  { date: '2015-11-05', event: 'Right Forearm Fracture', facility: 'Nairobi Hospital', doctor: 'Dr. Mwangi', type: 'Emergency', summary: 'Closed fracture right radius. Surgical fixation (ORIF).' },
  { date: '2012-07-18', event: 'Typhoid Fever', facility: 'Kenyatta Hospital', doctor: 'Dr. Otieno', type: 'Inpatient', summary: 'Confirmed via Widal test. IV Ciprofloxacin, 10-day course. Discharged stable.' },
];

const demoDiagnoses = [
  { diagnosis: 'Pre-diabetes (Impaired Glucose Tolerance)', icd10: 'R73.03', date: '2024-01-15', status: 'Active', doctor: 'Dr. Ochieng', plan: 'Metformin 500mg BD, dietary modification, 30 min daily exercise' },
  { diagnosis: 'Hyperlipidemia (Mixed)', icd10: 'E78.2', date: '2024-01-15', status: 'Active', doctor: 'Dr. Wanjiru', plan: 'Atorvastatin 20mg HS, low-fat diet, lipid panel review in 3 months' },
  { diagnosis: 'Malaria — P. falciparum', icd10: 'B50.9', date: '2023-04-10', status: 'Resolved', doctor: 'Dr. Odhiambo', plan: 'Completed Coartem course. Repeat smear negative.' },
  { diagnosis: 'Acute Appendicitis', icd10: 'K35.80', date: '2019-08-22', status: 'Resolved', doctor: 'Dr. Kamau', plan: 'Surgical management. Histology confirmed uncomplicated appendicitis.' },
  { diagnosis: 'Allergic Rhinitis (Dust Mites)', icd10: 'J30.1', date: '2015-03-10', status: 'Active', doctor: 'Dr. Njoroge', plan: 'Cetirizine PRN. Avoid known triggers.' },
];

const demoMedications = [
  { drug: 'Metformin 500mg', dosage: '1 tablet twice daily (with meals)', startDate: '2024-01-20', prescribedBy: 'Dr. Ochieng', facility: 'Nairobi Hospital', status: 'Active', refillDate: '2025-02-20' },
  { drug: 'Atorvastatin 20mg', dosage: '1 tablet at bedtime', startDate: '2024-01-20', prescribedBy: 'Dr. Wanjiru', facility: 'Nairobi Hospital', status: 'Active', refillDate: '2025-02-20' },
  { drug: 'Cetirizine 10mg', dosage: '1 tablet as needed', startDate: '2015-03-10', prescribedBy: 'Dr. Njoroge', facility: 'Nairobi Hospital', status: 'Active (PRN)', refillDate: null },
  { drug: 'Coartem (AL)', dosage: '4 tablets twice daily x3 days', startDate: '2023-04-10', prescribedBy: 'Dr. Odhiambo', facility: 'Kenyatta Hospital', status: 'Completed', refillDate: null },
  { drug: 'Ciprofloxacin 500mg', dosage: '1 tablet twice daily x10 days', startDate: '2012-07-18', prescribedBy: 'Dr. Otieno', facility: 'Kenyatta Hospital', status: 'Completed', refillDate: null },
];

const demoAllergies = [
  { allergen: 'Penicillin', type: 'Drug', severity: 'Severe', reactions: ['Anaphylaxis', 'Urticaria', 'Dyspnea'], dateRecorded: '2010-05-15', verifiedBy: 'Dr. Wanjiku' },
  { allergen: 'Peanuts', type: 'Food', severity: 'Moderate', reactions: ['Hives', 'Angioedema'], dateRecorded: '2005-09-20', verifiedBy: 'Dr. Kimani' },
  { allergen: 'Dust Mites', type: 'Environmental', severity: 'Mild', reactions: ['Sneezing', 'Rhinorrhea', 'Watery eyes'], dateRecorded: '2015-03-10', verifiedBy: 'Dr. Njoroge' },
];

const demoMedia = [
  { id: '1', type: 'xray', name: 'Chest X-Ray (PA View)', date: '2025-01-15', facility: 'Nairobi Hospital', finding: 'Clear lung fields, normal cardiac silhouette' },
  { id: '2', type: 'ultrasound', name: 'Abdominal Ultrasound', date: '2024-06-20', facility: 'Aga Khan Hospital', finding: 'No abnormalities detected. Post-appendectomy changes noted.' },
  { id: '3', type: 'xray', name: 'Right Forearm X-Ray', date: '2015-11-05', facility: 'Nairobi Hospital', finding: 'Healed fracture with hardware in situ.' },
  { id: '4', type: 'ecg', name: 'Electrocardiogram (ECG)', date: '2025-01-15', facility: 'Nairobi Hospital', finding: 'Normal sinus rhythm. No ST changes.' },
  { id: '5', type: 'eye', name: 'Eye Exam Report', date: '2024-08-10', facility: 'Lions Eye Hospital', finding: 'Visual acuity 6/6 both eyes. Fundoscopy normal.' },
];

const demoDailyGoals = {
  water: { target: 8, current: 6, unit: 'glasses', icon: Droplets },
  steps: { target: 10000, current: 7200, unit: 'steps', icon: Activity },
  sleep: { target: 8, current: 7.5, unit: 'hours', icon: Clock },
  medication: { target: 3, current: 3, unit: 'doses', icon: Pill },
  exercise: { target: 30, current: 20, unit: 'mins', icon: Zap },
};

// ─── Component ─────────────────────────────────────────────

interface Props {
  isNewPatient?: boolean;
  patientEmecId?: string;
  consentCode?: string;
}

export function EnhancedPatientRecords({ isNewPatient = false, patientEmecId, consentCode }: Props) {
  const { currentUser, addAuditEntry } = useAuth();
  const { isDemoMode } = useDemo();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [hasValidAccess, setHasValidAccess] = useState(false);
  const [accessExpiry, setAccessExpiry] = useState<Date | null>(null);
  const [blockedAttempts, setBlockedAttempts] = useState<Array<{time: Date; reason: string}>>([]);
  const [showEmergencyOverride, setShowEmergencyOverride] = useState(false);

  const emecId = patientEmecId || currentUser?.emecId || 'NEW-PATIENT';
  const hospitalPatientId = useMemo(() => {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return `EMEC/${new Date().getFullYear()}/${String(arr[0] % 100000).padStart(5, '0')}`;
  }, []);

  const handleBlockedAttempt = (reason: string) => {
    setBlockedAttempts(prev => [...prev, { time: new Date(), reason }]);
    toast({ variant: 'destructive', title: '🚫 Access Blocked', description: reason });
  };

  const handleSecurityVerification = (success: boolean, isEmergency = false) => {
    if (success) {
      setHasValidAccess(true);
      const expiry = new Date();
      expiry.setMinutes(expiry.getMinutes() + (isEmergency ? 15 : 30));
      setAccessExpiry(expiry);
      if (isEmergency) {
        toast({ title: '⚠️ Emergency Override Active', description: 'Limited access granted for 15 minutes.' });
        setShowEmergencyOverride(true);
      } else {
        toast({ title: '✅ Access Granted', description: 'You have 30 minutes to view/edit records.' });
      }
    } else {
      handleBlockedAttempt('Invalid consent code or PIN');
    }
    setIsSecurityModalOpen(false);
  };

  useEffect(() => {
    if (accessExpiry) {
      const timer = setInterval(() => {
        if (new Date() > accessExpiry) {
          setHasValidAccess(false);
          setAccessExpiry(null);
          toast({ title: 'Access Expired', description: 'Your session has expired. Please re-authenticate.' });
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

  const getLabStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'borderline': case 'pre-diabetic': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'positive': case 'abnormal': case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'Emergency': return 'destructive';
      case 'Surgery': return 'default';
      case 'Inpatient': return 'secondary';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-5">

      {/* Emergency Override Warning */}
      {showEmergencyOverride && (
        <Alert variant="destructive" className="border-2 border-orange-500 bg-orange-50 dark:bg-orange-950">
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="text-orange-700 dark:text-orange-300">Emergency Override Active</AlertTitle>
          <AlertDescription className="text-orange-600 dark:text-orange-400">
            Time-limited access. All actions logged. Patient will be notified.
          </AlertDescription>
        </Alert>
      )}

      {blockedAttempts.length > 0 && (
        <Alert variant="destructive">
          <Lock className="h-4 w-4" />
          <AlertTitle>Security Alert</AlertTitle>
          <AlertDescription>{blockedAttempts.length} unauthorized attempt(s) detected and logged.</AlertDescription>
        </Alert>
      )}

      {/* ─── Header ────────────────────────────────── */}
      <div className="bg-card rounded-xl border-2 border-primary/20 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center">
                <FileText className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  Patient Health Records
                  {hasValidAccess && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300 dark:bg-emerald-900/30 dark:text-emerald-300">
                      <Lock className="w-3 h-3 mr-1" />Verified
                    </Badge>
                  )}
                </h1>
                <p className="text-muted-foreground text-sm">{isNewPatient ? 'New patient file created' : 'Comprehensive lifetime medical record'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {hasValidAccess && accessExpiry && (
                <Badge variant="outline" className="text-sm py-1.5">
                  <Clock className="w-3 h-3 mr-1" />Expires: {getAccessTimeRemaining()}
                </Badge>
              )}
              {!hasValidAccess && currentUser?.role === 'admin' && (
                <Button onClick={() => setIsSecurityModalOpen(true)} className="gap-2">
                  <Fingerprint className="w-4 h-4" />Request Access
                </Button>
              )}
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="w-4 h-4" />Export
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Share2 className="w-4 h-4" />Share
              </Button>
            </div>
          </div>
        </div>
        {/* Patient identifiers strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border">
          {[
            { label: 'EMEC ID', value: emecId, mono: true, accent: true },
            { label: 'Hospital File No.', value: hospitalPatientId, mono: true },
            { label: 'Created', value: format(new Date(), 'dd MMM yyyy, HH:mm') },
            { label: 'Last Updated', value: format(new Date(), 'dd MMM yyyy, HH:mm') },
          ].map((item) => (
            <div key={item.label} className="bg-card p-3">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{item.label}</p>
              <p className={`text-sm font-semibold ${item.mono ? 'font-mono' : ''} ${item.accent ? 'text-primary' : ''}`}>{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Notice */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-transparent">
        <CardContent className="py-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0" />
          <p className="text-sm"><span className="font-semibold">HIPAA & Kenya DPA Compliant</span> — All access is logged, encrypted, and consent-verified</p>
          <CheckCircle2 className="w-5 h-5 text-emerald-500 ml-auto shrink-0" />
        </CardContent>
      </Card>

      {/* Consent Code */}
      {isNewPatient && consentCode && (
        <Card className="border-2 border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="py-6 text-center">
            <KeyRound className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Your Consent Code</p>
            <p className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">{consentCode}</p>
            <p className="text-xs text-muted-foreground mt-2">Valid for 5 minutes • Share with healthcare providers</p>
          </CardContent>
        </Card>
      )}

      {/* ─── Tabs ──────────────────────────────────── */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 h-auto gap-0.5 bg-muted/80 p-1 rounded-xl">
          {[
            { value: 'overview', icon: Activity, label: 'Overview' },
            { value: 'history', icon: History, label: 'History' },
            { value: 'diagnosis', icon: Stethoscope, label: 'Diagnosis' },
            { value: 'labs', icon: TestTube, label: 'Labs' },
            { value: 'medications', icon: Pill, label: 'Meds' },
            { value: 'immunizations', icon: Syringe, label: 'Vaccines' },
            { value: 'surgeries', icon: Scissors, label: 'Surgeries' },
            { value: 'goals', icon: Target, label: 'Goals' },
            { value: 'media', icon: FileImage, label: 'Media' },
            { value: 'access', icon: UserCog, label: 'Access' },
          ].map(({ value, icon: Icon, label }) => (
            <TabsTrigger key={value} value={value} className="flex-col gap-0.5 text-[10px] sm:text-xs py-2 h-auto rounded-lg data-[state=active]:shadow-md">
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {/* ═══ OVERVIEW ═══ */}
        <TabsContent value="overview" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Overview" icon={Activity} /> : (
            <div className="space-y-5">
              {/* Quick stats row */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: 'Active Conditions', count: demoDiagnoses.filter(d => d.status === 'Active').length, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                  { label: 'Allergies', count: demoAllergies.length, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
                  { label: 'Current Meds', count: demoMedications.filter(m => m.status.includes('Active')).length, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                  { label: 'Lab Tests', count: demoLabResults.length, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                  { label: 'Vaccinations', count: demoImmunizations.length, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                ].map((stat) => (
                  <Card key={stat.label} className="border-0 shadow-sm">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                        <span className={`text-lg font-bold ${stat.color}`}>{stat.count}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-tight">{stat.label}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Vitals chart + Allergies */}
              <div className="grid gap-5 md:grid-cols-3">
                <Card className="md:col-span-2">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base">
                      <TrendingUp className="w-4 h-4 text-primary" />Blood Pressure Trend
                    </CardTitle>
                    <CardDescription>Last 5 readings (mmHg)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={demoVitalsHistory}>
                        <defs>
                          <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                        <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                        <YAxis domain={[60, 150]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                        <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                        <Area type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" fill="url(#colorSys)" strokeWidth={2} name="Systolic" />
                        <Area type="monotone" dataKey="diastolic" stroke="hsl(var(--primary))" fill="transparent" strokeWidth={1.5} strokeDasharray="4 2" name="Diastolic" />
                        <Line type="monotone" dataKey="pulse" stroke="#f97316" strokeWidth={1.5} dot={false} name="Pulse" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-red-600">
                      <AlertTriangle className="w-4 h-4" />Allergy Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {demoAllergies.map((a, i) => (
                      <div key={i} className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{a.allergen}</span>
                          <Badge className={
                            a.severity === 'Severe' ? 'bg-red-600 text-white' :
                            a.severity === 'Moderate' ? 'bg-amber-500 text-white' :
                            'bg-muted text-muted-foreground'
                          }>{a.severity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.type} • {a.reactions.join(', ')}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Latest vitals grid */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Thermometer className="w-4 h-4 text-primary" />Latest Vitals
                  </CardTitle>
                  <CardDescription>Recorded: {demoVitalsHistory[demoVitalsHistory.length - 1].date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {(() => {
                      const v = demoVitalsHistory[demoVitalsHistory.length - 1];
                      return [
                        { label: 'Blood Pressure', value: `${v.systolic}/${v.diastolic}`, unit: 'mmHg' },
                        { label: 'Pulse', value: v.pulse, unit: 'bpm' },
                        { label: 'Temperature', value: `${v.temp}°C`, unit: '' },
                        { label: 'Weight', value: `${v.weight}`, unit: 'kg' },
                        { label: 'BMI', value: v.bmi, unit: '' },
                        { label: 'SpO2', value: '98', unit: '%' },
                      ].map((item) => (
                        <div key={item.label} className="text-center p-3 bg-muted/50 rounded-xl border">
                          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{item.label}</p>
                          <p className="font-bold text-xl mt-1">{item.value}</p>
                          {item.unit && <p className="text-[10px] text-muted-foreground">{item.unit}</p>}
                        </div>
                      ));
                    })()}
                  </div>
                </CardContent>
              </Card>

              {/* Active conditions */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base"><Brain className="w-4 h-4" />Active Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {demoDiagnoses.filter(d => d.status === 'Active').map((d, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/50 border">
                        <div>
                          <p className="font-medium text-sm">{d.diagnosis}</p>
                          <p className="text-xs text-muted-foreground">Since {d.date} • {d.doctor}</p>
                        </div>
                        <Badge variant="outline" className="text-xs font-mono">{d.icd10}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ═══ HISTORY ═══ */}
        <TabsContent value="history" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Medical History" icon={History} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-primary" />Medical Timeline</CardTitle>
                <CardDescription>Chronological record of all medical events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="relative space-y-0 pl-8 border-l-2 border-primary/20">
                    {demoMedicalHistory.map((event, i) => (
                      <div key={i} className="relative pb-6 last:pb-0">
                        <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-primary border-4 border-background" />
                        <div className="p-4 rounded-xl bg-muted/50 border hover:border-primary/30 transition-colors">
                          <div className="flex items-start justify-between gap-2 flex-wrap">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold">{event.event}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                                <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{event.facility}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1"><User className="w-3 h-3" />{event.doctor}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant={getEventTypeColor(event.type) as "default" | "secondary" | "destructive" | "outline"}>{event.type}</Badge>
                              <Badge variant="outline" className="font-mono text-xs">{event.date}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{event.summary}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ DIAGNOSIS ═══ */}
        <TabsContent value="diagnosis" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Diagnosis & Treatment" icon={Stethoscope} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5 text-primary" />Diagnosis & Treatment Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoDiagnoses.map((dx, i) => (
                  <div key={i} className="p-4 rounded-xl border hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                      <div>
                        <p className="font-semibold">{dx.diagnosis}</p>
                        <p className="text-xs text-muted-foreground font-mono">ICD-10: {dx.icd10}</p>
                      </div>
                      <Badge variant={dx.status === 'Active' ? 'default' : 'secondary'}>{dx.status}</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{dx.date}</span>
                      <span className="flex items-center gap-1"><User className="w-3 h-3" />{dx.doctor}</span>
                    </div>
                    <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                      <p className="text-xs font-medium text-primary mb-1">Treatment Plan</p>
                      <p className="text-sm">{dx.plan}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ LAB RESULTS ═══ */}
        <TabsContent value="labs" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Lab Results" icon={TestTube} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TestTube className="w-5 h-5 text-purple-600" />Laboratory Results</CardTitle>
                <CardDescription>{demoLabResults.length} tests on file</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-2">
                  <div className="space-y-3">
                    {demoLabResults.map((lab) => (
                      <div key={lab.id} className="p-4 rounded-xl border hover:shadow-sm transition-shadow">
                        <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                          <div>
                            <p className="font-semibold text-sm">{lab.test}</p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                              <Calendar className="w-3 h-3" />{lab.date}
                              <span>•</span>
                              <Building2 className="w-3 h-3" />{lab.facility}
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getLabStatusColor(lab.status)}`}>{lab.status}</span>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                          {Object.entries(lab.values).map(([key, val]) => (
                            <div key={key} className="p-2 bg-muted/50 rounded-lg text-center">
                              <p className="text-[10px] uppercase text-muted-foreground">{key}</p>
                              <p className="font-semibold text-sm">{val}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">Ordered by: {lab.doctor}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ MEDICATIONS ═══ */}
        <TabsContent value="medications" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Medications" icon={Pill} /> : (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Pill className="w-5 h-5 text-blue-600" />Current & Past Medications</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {demoMedications.map((med, i) => (
                    <div key={i} className={`flex items-start gap-4 p-4 rounded-xl border ${med.status.includes('Active') ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30' : 'bg-muted/30'}`}>
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${med.status.includes('Active') ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-muted'}`}>
                        <Pill className={`w-5 h-5 ${med.status.includes('Active') ? 'text-blue-600' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <p className="font-semibold">{med.drug}</p>
                          <Badge variant={med.status.includes('Active') ? 'default' : 'secondary'} className="text-xs">{med.status}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5 flex-wrap">
                          <span>Started: {med.startDate}</span>
                          <span>• {med.prescribedBy}</span>
                          <span>• {med.facility}</span>
                        </div>
                        {med.refillDate && (
                          <p className="text-xs text-primary mt-1.5 font-medium">📋 Next refill: {med.refillDate}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ═══ IMMUNIZATIONS ═══ */}
        <TabsContent value="immunizations" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Immunizations" icon={Syringe} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Syringe className="w-5 h-5 text-emerald-600" />Immunization Record</CardTitle>
                <CardDescription>Complete vaccination history from birth</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px] pr-2">
                  <div className="space-y-2">
                    {demoImmunizations.map((v) => (
                      <div key={v.id} className="flex items-center gap-4 p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <Syringe className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{v.vaccine}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />{v.date}
                            <span>•</span>{v.facility}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant={v.status === 'Complete' ? 'outline' : 'default'} className={v.status === 'Complete' ? 'text-emerald-600 border-emerald-300' : ''}>
                            {v.status}
                          </Badge>
                          <p className="text-[10px] text-muted-foreground mt-1 font-mono">Batch: {v.batch}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ SURGERIES ═══ */}
        <TabsContent value="surgeries" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Surgical History" icon={Scissors} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scissors className="w-5 h-5 text-primary" />Surgical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {demoSurgeries.map((s) => (
                  <div key={s.id} className="p-5 rounded-xl border-2 border-primary/10 bg-primary/5">
                    <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                      <div>
                        <p className="font-bold text-lg">{s.procedure}</p>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{s.date}</span>
                          <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{s.facility}</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-600 text-white">{s.outcome}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <div className="p-3 bg-background rounded-lg border">
                        <p className="text-xs text-muted-foreground">Surgeon</p>
                        <p className="font-medium text-sm">{s.surgeon}</p>
                      </div>
                      <div className="p-3 bg-background rounded-lg border">
                        <p className="text-xs text-muted-foreground">Anesthesia</p>
                        <p className="font-medium text-sm">{s.anesthesia}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{s.notes}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ DAILY GOALS ═══ */}
        <TabsContent value="goals" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Daily Goals" icon={Target} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-emerald-600" />Daily Health Goals</CardTitle>
                <CardDescription>Track today's wellness targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {Object.entries(demoDailyGoals).map(([key, goal]) => {
                    const pct = Math.min(100, (goal.current / goal.target) * 100);
                    const GoalIcon = goal.icon;
                    return (
                      <div key={key} className="p-4 rounded-xl bg-muted/50 border">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <GoalIcon className="w-4 h-4 text-primary" />
                            <span className="font-medium capitalize text-sm">{key}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{goal.current}/{goal.target} {goal.unit}</span>
                        </div>
                        <Progress value={pct} className="h-2.5" />
                        <p className={`text-xs mt-1.5 font-medium ${pct >= 100 ? 'text-emerald-600' : pct >= 70 ? 'text-amber-600' : 'text-muted-foreground'}`}>
                          {pct >= 100 ? '✅ Goal achieved!' : `${Math.round(pct)}% complete`}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ MEDIA ═══ */}
        <TabsContent value="media" className="mt-5">
          {isNewPatient ? <EmptyRecordState section="Medical Images & Documents" icon={FileImage} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileImage className="w-5 h-5 text-primary" />Medical Images & Documents</CardTitle>
                <CardDescription>{demoMedia.length} files on record</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {demoMedia.map((item) => (
                    <div key={item.id} className="p-4 rounded-xl border hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer group">
                      <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 rounded-lg flex items-center justify-center mb-3 group-hover:from-primary/10 group-hover:to-primary/5 transition-colors">
                        {item.type === 'xray' ? <Bone className="w-10 h-10 text-muted-foreground/50" /> :
                         item.type === 'ecg' ? <Activity className="w-10 h-10 text-muted-foreground/50" /> :
                         item.type === 'eye' ? <Eye className="w-10 h-10 text-muted-foreground/50" /> :
                         <Image className="w-10 h-10 text-muted-foreground/50" />}
                      </div>
                      <p className="font-medium text-sm">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.facility} • {item.date}</p>
                      <p className="text-xs text-primary mt-1.5">{item.finding}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ═══ ACCESS LOGS ═══ */}
        <TabsContent value="access" className="mt-5">
          <RecordAccessLog 
            auditLog={[
              { id: 'demo-1', timestamp: new Date().toISOString(), userId: 'system', userName: 'System', userRole: 'admin' as const, action: 'VIEW_RECORD', target: emecId, details: 'Record accessed via dashboard' },
              { id: 'demo-2', timestamp: new Date(Date.now() - 86400000).toISOString(), userId: 'dr-wanjiru', userName: 'Dr. Wanjiru', userRole: 'admin' as const, action: 'UPDATE_RECORD', target: emecId, details: 'Updated vitals and lab results' },
              { id: 'demo-3', timestamp: new Date(Date.now() - 172800000).toISOString(), userId: 'dr-ochieng', userName: 'Dr. Ochieng', userRole: 'admin' as const, action: 'UPDATE_RECORD', target: emecId, details: 'Added Metformin prescription' },
            ]} 
          />
        </TabsContent>
      </Tabs>

      <SecurityAccessModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        onSuccess={handleSecurityVerification}
        patientEmecId={emecId}
      />
    </div>
  );
}

function EmptyRecordState({ section, icon: Icon }: { section: string; icon: React.ElementType }) {
  return (
    <Card className="border-dashed border-2 border-muted-foreground/30">
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Icon className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-muted-foreground mb-2">No {section} Data Yet</h3>
        <p className="text-sm text-muted-foreground max-w-sm">
          This section will be populated as healthcare providers add records. Your data is secure and protected.
        </p>
      </CardContent>
    </Card>
  );
}
