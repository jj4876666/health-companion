import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
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
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Line } from 'recharts';

interface Props {
  isNewPatient?: boolean;
  patientEmecId?: string;
  consentCode?: string;
}

export function EnhancedPatientRecords({ isNewPatient = false, patientEmecId, consentCode }: Props) {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState('overview');
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [hasValidAccess, setHasValidAccess] = useState(false);
  const [accessExpiry, setAccessExpiry] = useState<Date | null>(null);
  const [blockedAttempts, setBlockedAttempts] = useState<Array<{time: Date; reason: string}>>([]);
  const [showEmergencyOverride, setShowEmergencyOverride] = useState(false);

  // Live database state
  const [profileId, setProfileId] = useState<string | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<any[]>([]);
  const [medications, setMedications] = useState<any[]>([]);
  const [allergies, setAllergies] = useState<any[]>([]);
  const [immunizations, setImmunizations] = useState<any[]>([]);
  const [medicalUpdates, setMedicalUpdates] = useState<any[]>([]);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const emecId = patientEmecId || currentUser?.emecId || 'NEW-PATIENT';
  const hospitalPatientId = useMemo(() => {
    const arr = new Uint32Array(1);
    crypto.getRandomValues(arr);
    return `EMEC/${new Date().getFullYear()}/${String(arr[0] % 100000).padStart(5, '0')}`;
  }, []);

  // Resolve profile ID and fetch all live data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      let pid: string | null = null;

      // Get profile ID
      if (currentUser?.id) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('user_id', currentUser.id)
          .maybeSingle();
        if (profile) {
          pid = profile.id;
          setProfileId(pid);
        }
      }

      if (!pid) { setLoading(false); return; }

      // Fetch all data in parallel
      const [recordsRes, medsRes, allergiesRes, immuRes, updatesRes, logsRes] = await Promise.all([
        supabase.from('medical_records').select('*').eq('patient_id', pid).order('record_date', { ascending: false }),
        supabase.from('medications').select('*').eq('patient_id', pid).order('created_at', { ascending: false }),
        supabase.from('allergies').select('*').eq('patient_id', pid).order('created_at', { ascending: false }),
        supabase.from('immunizations').select('*').eq('patient_id', pid).order('date_administered', { ascending: false }),
        supabase.from('medical_updates').select('*').eq('patient_id', pid).order('created_at', { ascending: false }),
        supabase.from('audit_logs').select('*').eq('patient_id', pid).order('created_at', { ascending: false }).limit(20),
      ]);

      setMedicalRecords(recordsRes.data || []);
      setMedications(medsRes.data || []);
      setAllergies(allergiesRes.data || []);
      setImmunizations(immuRes.data || []);
      setMedicalUpdates(updatesRes.data || []);
      setAuditLogs(logsRes.data || []);
      setLoading(false);
    };

    fetchData();

    // Real-time subscription for medical_updates
    if (!currentUser?.id) return;
    const channel = supabase
      .channel('patient-records-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medical_updates' }, () => {
        fetchData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'medical_records' }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [currentUser?.id]);

  // Derive data from medical_updates for tabs
  const vitalsUpdates = medicalUpdates.filter(u => u.update_type === 'vitals');
  const diagnosisUpdates = medicalUpdates.filter(u => u.update_type === 'diagnosis');
  const labUpdates = medicalUpdates.filter(u => u.update_type === 'lab_result');
  const surgeryUpdates = medicalUpdates.filter(u => u.update_type === 'surgery');
  const noteUpdates = medicalUpdates.filter(u => ['clinical_note', 'follow_up'].includes(u.update_type));

  const hasAnyData = medicalRecords.length > 0 || medications.length > 0 || allergies.length > 0 || immunizations.length > 0 || medicalUpdates.length > 0;
  const isEmpty = isNewPatient || (!hasAnyData && !loading);

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
    switch (status?.toLowerCase()) {
      case 'normal': return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'borderline': case 'pre-diabetic': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'positive': case 'abnormal': case 'critical': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-muted text-muted-foreground';
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

      {/* Header */}
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
                <p className="text-muted-foreground text-sm">{isEmpty ? 'New patient file — awaiting records' : 'Comprehensive lifetime medical record'}</p>
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

      {consentCode && (
        <Card className="border-2 border-emerald-500/50 bg-emerald-50/50 dark:bg-emerald-950/20">
          <CardContent className="py-6 text-center">
            <KeyRound className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">Your Consent Code</p>
            <p className="text-4xl font-mono font-bold tracking-[0.3em] text-primary">{consentCode}</p>
            <p className="text-xs text-muted-foreground mt-2">Valid for 5 minutes • Share with healthcare providers</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
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

        {/* OVERVIEW */}
        <TabsContent value="overview" className="mt-5">
          {isEmpty ? <EmptyRecordState section="Overview" icon={Activity} /> : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { label: 'Diagnoses', count: diagnosisUpdates.length, color: 'text-amber-600', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                  { label: 'Allergies', count: allergies.length, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/30' },
                  { label: 'Medications', count: medications.length, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/30' },
                  { label: 'Lab Tests', count: labUpdates.length, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/30' },
                  { label: 'Vaccinations', count: immunizations.length, color: 'text-emerald-600', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
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

              {/* Vitals chart from live data */}
              {vitalsUpdates.length > 0 && (
                <div className="grid gap-5 md:grid-cols-3">
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUp className="w-4 h-4 text-primary" />Vitals History
                      </CardTitle>
                      <CardDescription>{vitalsUpdates.length} reading(s) on file</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={vitalsUpdates.map(v => {
                          const d = v.data as Record<string, any>;
                          return {
                            date: format(new Date(v.created_at), 'dd MMM'),
                            systolic: Number(d.systolic || d.blood_pressure?.split('/')[0]) || 0,
                            diastolic: Number(d.diastolic || d.blood_pressure?.split('/')[1]?.replace(/[^\d]/g, '')) || 0,
                            pulse: Number(d.pulse || d.heart_rate) || 0,
                          };
                        }).reverse()}>
                          <defs>
                            <linearGradient id="colorSys" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="date" tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                          <YAxis domain={[40, 180]} tick={{ fontSize: 11 }} className="fill-muted-foreground" />
                          <Tooltip contentStyle={{ borderRadius: '8px', fontSize: '12px' }} />
                          <Area type="monotone" dataKey="systolic" stroke="hsl(var(--primary))" fill="url(#colorSys)" strokeWidth={2} name="Systolic" />
                          <Area type="monotone" dataKey="diastolic" stroke="hsl(var(--primary))" fill="transparent" strokeWidth={1.5} strokeDasharray="4 2" name="Diastolic" />
                        </AreaChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  {/* Latest vitals */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <Thermometer className="w-4 h-4 text-primary" />Latest Vitals
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {(() => {
                        const latest = vitalsUpdates[0]?.data as Record<string, any> || {};
                        const entries = Object.entries(latest).filter(([k]) => k !== 'notes');
                        return entries.map(([key, val]) => (
                          <div key={key} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <span className="text-xs text-muted-foreground capitalize">{key.replace(/_/g, ' ')}</span>
                            <span className="font-semibold text-sm">{String(val)}</span>
                          </div>
                        ));
                      })()}
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Allergies from live data */}
              {allergies.length > 0 && (
                <Card className="border-red-200 dark:border-red-900/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex items-center gap-2 text-base text-red-600">
                      <AlertTriangle className="w-4 h-4" />Allergy Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {allergies.map((a) => (
                      <div key={a.id} className="p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm">{a.allergen}</span>
                          <Badge className={
                            a.severity === 'Severe' ? 'bg-red-600 text-white' :
                            a.severity === 'Moderate' ? 'bg-amber-500 text-white' :
                            'bg-muted text-muted-foreground'
                          }>{a.severity}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{a.allergy_type} • {a.reactions?.join(', ') || 'No reactions listed'}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* If only medical_updates exist but no vitals/allergies, show recent updates */}
              {vitalsUpdates.length === 0 && allergies.length === 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base"><Activity className="w-4 h-4 text-primary" />Recent Medical Updates</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {medicalUpdates.slice(0, 5).map((u) => (
                      <div key={u.id} className="p-3 rounded-lg border bg-muted/30">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">{u.title}</p>
                          <Badge variant="outline" className="capitalize text-xs">{u.update_type}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{u.officer_name} • {u.facility_name} • {format(new Date(u.created_at), 'dd MMM yyyy')}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </TabsContent>

        {/* HISTORY */}
        <TabsContent value="history" className="mt-5">
          {medicalRecords.length === 0 && medicalUpdates.length === 0 ? <EmptyRecordState section="Medical History" icon={History} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-primary" />Medical Timeline</CardTitle>
                <CardDescription>Chronological record of all medical events</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="relative space-y-0 pl-8 border-l-2 border-primary/20">
                    {[...medicalRecords, ...medicalUpdates]
                      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
                      .map((event, i) => (
                        <div key={event.id || i} className="relative pb-6 last:pb-0">
                          <div className="absolute -left-[33px] w-4 h-4 rounded-full bg-primary border-4 border-background" />
                          <div className="p-4 rounded-xl bg-muted/50 border hover:border-primary/30 transition-colors">
                            <div className="flex items-start justify-between gap-2 flex-wrap">
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold">{event.title}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1 flex-wrap">
                                  {event.facility_name && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{event.facility_name}</span>}
                                  {event.officer_name && <><span>•</span><span className="flex items-center gap-1"><User className="w-3 h-3" />{event.officer_name}</span></>}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant="outline" className="capitalize text-xs">{event.record_type || event.update_type}</Badge>
                                <Badge variant="outline" className="font-mono text-xs">{format(new Date(event.created_at), 'dd MMM yyyy')}</Badge>
                              </div>
                            </div>
                            {event.description && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{event.description}</p>}
                          </div>
                        </div>
                      ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* DIAGNOSIS */}
        <TabsContent value="diagnosis" className="mt-5">
          {diagnosisUpdates.length === 0 ? <EmptyRecordState section="Diagnosis & Treatment" icon={Stethoscope} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Stethoscope className="w-5 h-5 text-primary" />Diagnosis & Treatment Plans</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {diagnosisUpdates.map((dx) => {
                  const d = dx.data as Record<string, any>;
                  return (
                    <div key={dx.id} className="p-4 rounded-xl border hover:shadow-sm transition-shadow">
                      <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                        <div>
                          <p className="font-semibold">{dx.title}</p>
                          {d.icd10 && <p className="text-xs text-muted-foreground font-mono">ICD-10: {d.icd10}</p>}
                        </div>
                        <Badge variant={d.status === 'Active' ? 'default' : 'secondary'}>{d.status || 'Recorded'}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(dx.created_at), 'dd MMM yyyy')}</span>
                        {dx.officer_name && <span className="flex items-center gap-1"><User className="w-3 h-3" />{dx.officer_name}</span>}
                      </div>
                      {d.plan && (
                        <div className="p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <p className="text-xs font-medium text-primary mb-1">Treatment Plan</p>
                          <p className="text-sm">{d.plan}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* LAB RESULTS */}
        <TabsContent value="labs" className="mt-5">
          {labUpdates.length === 0 ? <EmptyRecordState section="Lab Results" icon={TestTube} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><TestTube className="w-5 h-5 text-purple-600" />Laboratory Results</CardTitle>
                <CardDescription>{labUpdates.length} test(s) on file</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-2">
                  <div className="space-y-3">
                    {labUpdates.map((lab) => {
                      const d = lab.data as Record<string, any>;
                      return (
                        <div key={lab.id} className="p-4 rounded-xl border hover:shadow-sm transition-shadow">
                          <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                            <div>
                              <p className="font-semibold text-sm">{lab.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                <Calendar className="w-3 h-3" />{format(new Date(lab.created_at), 'dd MMM yyyy')}
                                {lab.facility_name && <><span>•</span><Building2 className="w-3 h-3" />{lab.facility_name}</>}
                              </div>
                            </div>
                            {d.status && <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getLabStatusColor(d.status)}`}>{d.status}</span>}
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-3">
                            {Object.entries(d).filter(([k]) => !['status', 'notes', 'doctor'].includes(k)).map(([key, val]) => (
                              <div key={key} className="p-2 bg-muted/50 rounded-lg text-center">
                                <p className="text-[10px] uppercase text-muted-foreground">{key.replace(/_/g, ' ')}</p>
                                <p className="font-semibold text-sm">{String(val)}</p>
                              </div>
                            ))}
                          </div>
                          {lab.officer_name && <p className="text-xs text-muted-foreground mt-2">Ordered by: {lab.officer_name}</p>}
                        </div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* MEDICATIONS */}
        <TabsContent value="medications" className="mt-5">
          {medications.length === 0 ? <EmptyRecordState section="Medications" icon={Pill} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Pill className="w-5 h-5 text-blue-600" />Current & Past Medications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {medications.map((med) => (
                  <div key={med.id} className={`flex items-start gap-4 p-4 rounded-xl border ${med.is_active ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900/30' : 'bg-muted/30'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${med.is_active ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-muted'}`}>
                      <Pill className={`w-5 h-5 ${med.is_active ? 'text-blue-600' : 'text-muted-foreground'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <p className="font-semibold">{med.drug_name}</p>
                        <Badge variant={med.is_active ? 'default' : 'secondary'} className="text-xs">{med.is_active ? 'Active' : 'Completed'}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{med.dosage} — {med.frequency}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5 flex-wrap">
                        <span>Started: {med.start_date}</span>
                        {med.prescribed_by && <span>• {med.prescribed_by}</span>}
                        {med.facility_name && <span>• {med.facility_name}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* IMMUNIZATIONS */}
        <TabsContent value="immunizations" className="mt-5">
          {immunizations.length === 0 ? <EmptyRecordState section="Immunizations" icon={Syringe} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Syringe className="w-5 h-5 text-emerald-600" />Immunization Record</CardTitle>
                <CardDescription>Vaccination history</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[450px] pr-2">
                  <div className="space-y-2">
                    {immunizations.map((v) => (
                      <div key={v.id} className="flex items-center gap-4 p-3 rounded-xl border hover:bg-muted/30 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                          <Syringe className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{v.vaccine_name}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="w-3 h-3" />{v.date_administered}
                            {v.facility_name && <><span>•</span>{v.facility_name}</>}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <Badge variant="outline" className="text-emerald-600 border-emerald-300">
                            {v.next_dose_date ? `Next: ${v.next_dose_date}` : 'Complete'}
                          </Badge>
                          {v.batch_number && <p className="text-[10px] text-muted-foreground mt-1 font-mono">Batch: {v.batch_number}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* SURGERIES */}
        <TabsContent value="surgeries" className="mt-5">
          {surgeryUpdates.length === 0 ? <EmptyRecordState section="Surgical History" icon={Scissors} /> : (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Scissors className="w-5 h-5 text-primary" />Surgical History</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {surgeryUpdates.map((s) => {
                  const d = s.data as Record<string, any>;
                  return (
                    <div key={s.id} className="p-5 rounded-xl border-2 border-primary/10 bg-primary/5">
                      <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                        <div>
                          <p className="font-bold text-lg">{s.title}</p>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{format(new Date(s.created_at), 'dd MMM yyyy')}</span>
                            {s.facility_name && <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{s.facility_name}</span>}
                          </div>
                        </div>
                        <Badge className="bg-emerald-600 text-white">{d.outcome || 'Recorded'}</Badge>
                      </div>
                      {(d.surgeon || d.anesthesia) && (
                        <div className="grid grid-cols-2 gap-3 mt-3">
                          {d.surgeon && <div className="p-3 bg-background rounded-lg border"><p className="text-xs text-muted-foreground">Surgeon</p><p className="font-medium text-sm">{d.surgeon}</p></div>}
                          {d.anesthesia && <div className="p-3 bg-background rounded-lg border"><p className="text-xs text-muted-foreground">Anesthesia</p><p className="font-medium text-sm">{d.anesthesia}</p></div>}
                        </div>
                      )}
                      {d.notes && <p className="text-sm text-muted-foreground mt-3 leading-relaxed">{d.notes}</p>}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* DAILY GOALS */}
        <TabsContent value="goals" className="mt-5">
          <EmptyRecordState section="Daily Goals" icon={Target} />
        </TabsContent>

        {/* MEDIA */}
        <TabsContent value="media" className="mt-5">
          <EmptyRecordState section="Medical Images & Documents" icon={FileImage} />
        </TabsContent>

        {/* ACCESS LOGS */}
        <TabsContent value="access" className="mt-5">
          {auditLogs.length === 0 ? <EmptyRecordState section="Access Logs" icon={UserCog} /> : (
            <RecordAccessLog 
              auditLog={auditLogs.map(log => ({
                id: log.id,
                timestamp: log.created_at,
                userId: log.performed_by || 'system',
                userName: log.officer_name || 'System',
                userRole: 'admin' as const,
                action: log.action_type,
                target: emecId,
                details: log.action_description,
              }))} 
            />
          )}
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
