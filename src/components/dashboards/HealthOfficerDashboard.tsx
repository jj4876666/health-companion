import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser } from '@/types/emec';
// DATABASE ROUTING: Import database router for demo/production separation
import { getDatabaseClient, getDemoStorageKey } from '@/integrations/supabase/databaseRouter';
import { medicalUpdateEmitter } from '@/utils/medicalUpdateEvents';
// AUDIT LOG: Import audit logger for tracking all actions
import { auditLogger, getActionFromUpdateType, type AuditLogEntry } from '@/utils/healthOfficerAuditLog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Stethoscope, User, FileText, Syringe, Pill, 
  AlertTriangle, ClipboardList, Building2,
  ShieldCheck, Plus, Save, History, Activity, Users, RefreshCw, FileCheck
} from 'lucide-react';

interface LocalStorageUser {
  id?: string;
  emecId: string;
  name?: string;
  role?: string;
  bloodGroup?: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  createdAt?: string;
}

interface LivePatient {
  id: string;
  user_id: string;
  full_name: string;
  emec_id: string;
  account_type: string | null;
  blood_group: string | null;
  gender: string | null;
  date_of_birth: string | null;
  phone: string | null;
  created_at: string;
}

interface MedicalUpdateData {
  [key: string]: string | number | boolean;
}

interface MedicalUpdate {
  id: string;
  update_type: string;
  title: string;
  data: MedicalUpdateData;
  officer_name: string | null;
  facility_name: string | null;
  created_at: string;
}

export function HealthOfficerDashboard() {
  const { currentUser } = useAuth();
  const { toast } = useToast();
  
  const [patients, setPatients] = useState<LivePatient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<LivePatient | null>(null);
  const [patientUpdates, setPatientUpdates] = useState<MedicalUpdate[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false); // OPTIMIZED: Start with false for instant demo load
  const [tab, setTab] = useState('patients');

  // Form states
  const [updateType, setUpdateType] = useState('vitals');
  const [formTitle, setFormTitle] = useState('');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  const officerName = currentUser?.name || 'Health Officer';
  const facilityName = (currentUser as AdminUser)?.facilityName || 'EMEC Facility';

  // DATABASE ROUTING: Fetch all patients
  // Demo Health Officer: Load ALL accounts (demo + newly created from localStorage + production from Supabase)
  // Production Health Officer: Load from Supabase only
  const fetchPatients = async () => {
    const dbClient = getDatabaseClient(currentUser);
    
    if (!dbClient) {
      // DEMO HEALTH OFFICER: Load ALL accounts
      const allPatients: LivePatient[] = [];
      
      // 1. Add hardcoded demo patients
      const demoPatients: LivePatient[] = [
        {
          id: 'demo-patient-1',
          user_id: 'demo-user-1',
          full_name: 'Kevin Otieno (Demo Child)',
          emec_id: 'KOT2025A001',
          account_type: 'child',
          blood_group: 'O+',
          gender: 'Male',
          date_of_birth: '2015-01-01',
          phone: '+254700000001',
          created_at: '2025-01-01T00:00:00Z'
        },
        {
          id: 'demo-patient-2',
          user_id: 'demo-user-2',
          full_name: 'James Mwangi (Demo Adult)',
          emec_id: 'AJM2025B002',
          account_type: 'adult',
          blood_group: 'A+',
          gender: 'Male',
          date_of_birth: '1990-01-01',
          phone: '+254700000002',
          created_at: '2025-01-01T00:00:00Z'
        }
      ];
      allPatients.push(...demoPatients);
      
      // 2. Load newly created accounts from localStorage
      const authKey = localStorage.getItem('emec_auth_v1');
      if (authKey) {
        try {
          const users = JSON.parse(authKey);
          // If it's an array, add all; if single user, add it
          const userArray: LocalStorageUser[] = Array.isArray(users) ? users : [users];
          
          userArray.forEach((user: LocalStorageUser) => {
            // Skip if already in demo patients
            if (!allPatients.find(p => p.emec_id === user.emecId)) {
              allPatients.push({
                id: user.id || `local-${user.emecId}`,
                user_id: user.id || `local-${user.emecId}`,
                full_name: user.name || 'Unknown',
                emec_id: user.emecId || 'UNKNOWN',
                account_type: user.role || 'adult',
                blood_group: user.bloodGroup || 'Unknown',
                gender: user.gender || 'Unknown',
                date_of_birth: user.dateOfBirth || user.createdAt || new Date().toISOString(),
                phone: user.phone || user.email || 'N/A',
                created_at: user.createdAt || new Date().toISOString()
              });
            }
          });
        } catch (e) {
          console.error('Error parsing localStorage users:', e);
        }
      }
      
      // 3. Scan all localStorage keys for additional users
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('user_') || key.startsWith('new_user_') || key.startsWith('records_'))) {
          try {
            const data = localStorage.getItem(key);
            if (data) {
              const userData = JSON.parse(data);
              if (userData.emecId && !allPatients.find(p => p.emec_id === userData.emecId)) {
                allPatients.push({
                  id: userData.id || key,
                  user_id: userData.id || key,
                  full_name: userData.name || userData.full_name || 'Unknown User',
                  emec_id: userData.emecId || 'UNKNOWN',
                  account_type: userData.role || userData.account_type || 'adult',
                  blood_group: userData.bloodGroup || userData.blood_group || 'Unknown',
                  gender: userData.gender || 'Unknown',
                  date_of_birth: userData.dateOfBirth || userData.date_of_birth || new Date().toISOString(),
                  phone: userData.phone || userData.email || 'N/A',
                  created_at: userData.createdAt || userData.created_at || new Date().toISOString()
                });
              }
            }
          } catch (e) {
            // Skip invalid entries
          }
        }
      }
      
      setPatients(allPatients);
      setLoading(false);
      console.log(`[DB ROUTER] Loaded ${allPatients.length} patients (demo + localStorage)`);
      return;
    }
    
    // PRODUCTION DATABASE: Load from Supabase
    setLoading(true);
    const { data, error } = await dbClient
      .from('profiles')
      .select('id, user_id, full_name, emec_id, account_type, blood_group, gender, date_of_birth, phone, created_at')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching patients:', error);
      toast({ title: 'Error', description: 'Failed to load patients', variant: 'destructive' });
    } else {
      setPatients(data || []);
      console.log('[DB ROUTER] Loaded production patients from Supabase');
    }
    setLoading(false);
  };

  // DATABASE ROUTING: Fetch updates for selected patient
  // Demo users: Load from localStorage (instant)
  // Production users: Load from Supabase
  const fetchPatientUpdates = async (patientId: string) => {
    const dbClient = getDatabaseClient(currentUser);
    
    if (!dbClient) {
      // DEMO DATABASE: Load demo updates instantly
      const storageKey = getDemoStorageKey(currentUser!, `patient_updates_${patientId}`);
      const savedUpdates = localStorage.getItem(storageKey);
      if (savedUpdates) {
        setPatientUpdates(JSON.parse(savedUpdates));
      } else {
        setPatientUpdates([]);
      }
      console.log('[DB ROUTER] Loaded demo patient updates instantly');
      return;
    }
    
    // PRODUCTION DATABASE: Load from Supabase
    const { data, error } = await dbClient
      .from('medical_updates')
      .select('*')
      .eq('patient_id', patientId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching updates:', error);
    } else {
      setPatientUpdates(data as MedicalUpdate[] || []);
      console.log('[DB ROUTER] Loaded production patient updates from Supabase');
    }
  };

  useEffect(() => {
    fetchPatients();
    // Load audit logs
    loadAuditLogs();
  }, []);

  // When patient selected, fetch their updates
  useEffect(() => {
    if (selectedPatient) {
      fetchPatientUpdates(selectedPatient.id);
    }
  }, [selectedPatient]);

  // Load audit logs
  const loadAuditLogs = () => {
    const logs = auditLogger.getAllLogs();
    setAuditLogs(logs);
    console.log('[AUDIT LOG] Loaded', logs.length, 'audit entries');
  };

  // Filter patients
  const filteredPatients = patients.filter(p => 
    p.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.emec_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const updateTypeOptions = [
    { value: 'vitals', label: 'Vital Signs', icon: Activity },
    { value: 'blood_sugar', label: 'Blood Sugar', icon: Activity },
    { value: 'medication', label: 'Medication', icon: Pill },
    { value: 'clinical_note', label: 'Clinical Note', icon: ClipboardList },
    { value: 'lab_result', label: 'Lab Result', icon: FileText },
    { value: 'allergy', label: 'Allergy', icon: AlertTriangle },
    { value: 'condition', label: 'Condition/Diagnosis', icon: Stethoscope },
    { value: 'immunization', label: 'Immunization', icon: Syringe },
  ];

  const getFormFields = (type: string): { key: string; label: string; placeholder: string }[] => {
    switch (type) {
      case 'vitals':
        return [
          { key: 'blood_pressure', label: 'Blood Pressure', placeholder: '120/80 mmHg' },
          { key: 'heart_rate', label: 'Heart Rate', placeholder: '72 bpm' },
          { key: 'temperature', label: 'Temperature', placeholder: '36.8°C' },
          { key: 'weight', label: 'Weight', placeholder: '65 kg' },
          { key: 'oxygen_saturation', label: 'SpO2', placeholder: '98%' },
        ];
      case 'blood_sugar':
        return [
          { key: 'level', label: 'Blood Sugar Level', placeholder: '5.6 mmol/L' },
          { key: 'measurement_time', label: 'Measurement Time', placeholder: 'Fasting / Post-meal' },
          { key: 'notes', label: 'Notes', placeholder: 'Additional notes...' },
        ];
      case 'medication':
        return [
          { key: 'drug_name', label: 'Drug Name', placeholder: 'Metformin' },
          { key: 'dosage', label: 'Dosage', placeholder: '500mg' },
          { key: 'frequency', label: 'Frequency', placeholder: 'Twice daily' },
          { key: 'instructions', label: 'Instructions', placeholder: 'Take with food' },
        ];
      case 'clinical_note':
        return [
          { key: 'note', label: 'Clinical Note', placeholder: 'Patient presents with...' },
          { key: 'assessment', label: 'Assessment', placeholder: 'Stable condition...' },
          { key: 'plan', label: 'Plan', placeholder: 'Follow-up in 2 weeks...' },
        ];
      case 'lab_result':
        return [
          { key: 'test_name', label: 'Test Name', placeholder: 'CBC, HbA1c, etc.' },
          { key: 'result', label: 'Result', placeholder: '6.8%' },
          { key: 'reference_range', label: 'Reference Range', placeholder: '4.0-5.6%' },
          { key: 'status', label: 'Status', placeholder: 'Normal / Abnormal' },
        ];
      case 'allergy':
        return [
          { key: 'allergen', label: 'Allergen', placeholder: 'Penicillin' },
          { key: 'severity', label: 'Severity', placeholder: 'Mild / Moderate / Severe' },
          { key: 'reaction', label: 'Reaction', placeholder: 'Skin rash, swelling...' },
        ];
      case 'condition':
        return [
          { key: 'diagnosis', label: 'Diagnosis', placeholder: 'Type 2 Diabetes' },
          { key: 'status', label: 'Status', placeholder: 'Active / Controlled / Resolved' },
          { key: 'notes', label: 'Notes', placeholder: 'Additional clinical notes...' },
        ];
      case 'immunization':
        return [
          { key: 'vaccine_name', label: 'Vaccine', placeholder: 'COVID-19 (Pfizer)' },
          { key: 'batch_number', label: 'Batch Number', placeholder: 'AB1234' },
          { key: 'next_dose_date', label: 'Next Dose Date', placeholder: '2025-06-15' },
        ];
      default:
        return [{ key: 'notes', label: 'Notes', placeholder: 'Enter details...' }];
    }
  };

  // DATABASE ROUTING: Save medical update
  // Demo users: Save to localStorage
  // Production users: Save to Supabase
  const handleSaveUpdate = async () => {
    if (!selectedPatient) return;
    if (!formTitle.trim()) {
      toast({ title: 'Title required', description: 'Please enter a title for this update', variant: 'destructive' });
      return;
    }

    setSaving(true);
    const dbClient = getDatabaseClient(currentUser);
    
    if (!dbClient) {
      // DEMO DATABASE: Save to localStorage
      const newUpdate: MedicalUpdate = {
        id: `demo-update-${Date.now()}`,
        update_type: updateType,
        title: formTitle,
        data: formData,
        officer_name: officerName,
        facility_name: facilityName,
        created_at: new Date().toISOString(),
      };
      
      const storageKey = getDemoStorageKey(currentUser!, `patient_updates_${selectedPatient.id}`);
      const existingUpdates = localStorage.getItem(storageKey);
      const updates = existingUpdates ? JSON.parse(existingUpdates) : [];
      updates.unshift(newUpdate);
      localStorage.setItem(storageKey, JSON.stringify(updates));
      
      // AUDIT LOG: Log the action
      auditLogger.log({
        officerId: currentUser?.id || 'demo-officer',
        officerName: officerName,
        facilityName: facilityName,
        action: getActionFromUpdateType(updateType),
        patientId: selectedPatient.id,
        patientName: selectedPatient.full_name,
        updateType: updateType,
        updateTitle: formTitle,
        updateData: formData,
      });
      
      // REAL-TIME SYNC: Emit event for demo accounts so patient sees update immediately
      medicalUpdateEmitter.emit(selectedPatient.id, newUpdate);
      console.log('[MEDICAL UPDATE] Emitted real-time update for demo patient:', selectedPatient.id);
      
      toast({ title: 'Update Saved', description: `${formTitle} has been added to ${selectedPatient.full_name}'s records (demo)` });
      setFormTitle('');
      setFormData({});
      fetchPatientUpdates(selectedPatient.id);
      loadAuditLogs(); // Reload audit logs
      console.log('[DB ROUTER] Saved medical update to demo database (localStorage)');
    } else {
      // PRODUCTION DATABASE: Save to Supabase
      const { error } = await dbClient.from('medical_updates').insert({
        patient_id: selectedPatient.id,
        update_type: updateType,
        title: formTitle,
        data: formData,
        officer_name: officerName,
        facility_name: facilityName,
      });

      if (error) {
        console.error('Error saving update:', error);
        toast({ title: 'Error', description: 'Failed to save update. Make sure you are logged in as a health officer.', variant: 'destructive' });
      } else {
        toast({ title: 'Update Saved', description: `${formTitle} has been added to ${selectedPatient.full_name}'s records` });
        setFormTitle('');
        setFormData({});
        fetchPatientUpdates(selectedPatient.id);
        console.log('[DB ROUTER] Saved medical update to production database (Supabase)');
      }
    }
    setSaving(false);
  };

  const getUpdateIcon = (type: string) => {
    const opt = updateTypeOptions.find(o => o.value === type);
    return opt ? opt.icon : FileText;
  };

  const getUpdateColor = (type: string) => {
    const colors: Record<string, string> = {
      vitals: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      blood_sugar: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medication: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      clinical_note: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      lab_result: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      allergy: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      condition: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      immunization: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  return (
    <div className="space-y-6">
      {/* Officer Info Header */}
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Stethoscope className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">{officerName}</h2>
                <div className="flex items-center gap-2 text-white/80">
                  <Building2 className="w-4 h-4" />
                  <span>{facilityName}</span>
                </div>
                <Badge className="mt-2 bg-white/20 text-white border-white/30">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  Health Officer
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">EMEC ID</p>
              <p className="font-mono font-bold">{currentUser?.emecId || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="patients" className="gap-2">
            <Users className="w-4 h-4" />
            All Patients ({patients.length})
          </TabsTrigger>
          <TabsTrigger value="selected" className="gap-2" disabled={!selectedPatient}>
            <FileText className="w-4 h-4" />
            {selectedPatient ? selectedPatient.full_name : 'Select Patient'}
          </TabsTrigger>
          <TabsTrigger value="audit" className="gap-2">
            <FileCheck className="w-4 h-4" />
            Audit Log ({auditLogs.length})
          </TabsTrigger>
        </TabsList>

        {/* Patients List Tab */}
        <TabsContent value="patients" className="space-y-4 mt-4">
          <div className="flex gap-2">
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by name or EMEC ID..."
              className="flex-1"
            />
            <Button variant="outline" onClick={fetchPatients}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading patients...</div>
          ) : filteredPatients.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No patients found</p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {filteredPatients.map((patient) => (
                  <Card 
                    key={patient.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${selectedPatient?.id === patient.id ? 'border-primary ring-2 ring-primary/20' : ''}`}
                    onClick={() => { setSelectedPatient(patient); setTab('selected'); }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{patient.full_name}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span className="font-mono">{patient.emec_id}</span>
                              <span>•</span>
                              <span>{patient.account_type || 'adult'}</span>
                              {patient.blood_group && (
                                <>
                                  <span>•</span>
                                  <Badge variant="outline" className="text-xs">{patient.blood_group}</Badge>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="text-right text-xs text-muted-foreground">
                          <p>Registered</p>
                          <p>{new Date(patient.created_at).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </TabsContent>

        {/* Selected Patient Tab */}
        <TabsContent value="selected" className="space-y-4 mt-4">
          {selectedPatient && (
            <>
              {/* Patient Info Card */}
              <Card className="border-2 border-primary/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{selectedPatient.full_name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          {selectedPatient.gender && <span>{selectedPatient.gender}</span>}
                          {selectedPatient.blood_group && (
                            <>
                              <span>•</span>
                              <Badge variant="secondary">{selectedPatient.blood_group}</Badge>
                            </>
                          )}
                          {selectedPatient.phone && (
                            <>
                              <span>•</span>
                              <span>{selectedPatient.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">EMEC ID</p>
                      <p className="font-mono font-bold">{selectedPatient.emec_id}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add New Update Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Add Medical Update
                  </CardTitle>
                  <CardDescription>
                    Each update creates a new record — never overwrites previous entries
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Update Type</Label>
                      <Select value={updateType} onValueChange={(v) => { setUpdateType(v); setFormData({}); }}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {updateTypeOptions.map(opt => (
                            <SelectItem key={opt.value} value={opt.value}>
                              <span className="flex items-center gap-2">
                                <opt.icon className="w-4 h-4" />
                                {opt.label}
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Routine checkup vitals"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {getFormFields(updateType).map((field) => (
                      <div key={field.key}>
                        <Label>{field.label}</Label>
                        {field.key === 'note' || field.key === 'assessment' || field.key === 'plan' ? (
                          <Textarea
                            value={formData[field.key] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                            rows={3}
                          />
                        ) : (
                          <Input
                            value={formData[field.key] || ''}
                            onChange={(e) => setFormData(prev => ({ ...prev, [field.key]: e.target.value }))}
                            placeholder={field.placeholder}
                          />
                        )}
                      </div>
                    ))}
                  </div>

                  <Button onClick={handleSaveUpdate} disabled={saving} className="w-full md:w-auto">
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Update to Patient Record'}
                  </Button>
                </CardContent>
              </Card>

              {/* Update History */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <History className="w-5 h-5" />
                    Update History ({patientUpdates.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {patientUpdates.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No medical updates yet — empty health record ready for entries</p>
                    </div>
                  ) : (
                    <ScrollArea className="h-[400px]">
                      <div className="space-y-3">
                        {patientUpdates.map((update) => {
                          const Icon = getUpdateIcon(update.update_type);
                          return (
                            <div key={update.id} className="p-4 rounded-lg border">
                              <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-md ${getUpdateColor(update.update_type)}`}>
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <p className="font-semibold">{update.title}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {update.update_type.replace('_', ' ')} • {update.officer_name} • {update.facility_name}
                                    </p>
                                  </div>
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(update.created_at).toLocaleString()}
                                </span>
                              </div>
                              <div className="grid grid-cols-2 gap-2 mt-2">
                                {Object.entries(update.data as Record<string, string>).map(([key, value]) => (
                                  value && (
                                    <div key={key} className="p-2 bg-muted/50 rounded text-sm">
                                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}: </span>
                                      <span className="font-medium">{value}</span>
                                    </div>
                                  )
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="space-y-4 mt-4">
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCheck className="w-5 h-5" />
                Audit Log
                <Badge variant="secondary" className="ml-auto">{auditLogs.length} entries</Badge>
              </CardTitle>
              <CardDescription>
                Complete immutable record of all Health Officer actions. Records are append-only and cannot be edited or deleted.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {auditLogs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <FileCheck className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p className="font-medium">No audit entries yet</p>
                  <p className="text-sm">All actions will be logged here automatically</p>
                </div>
              ) : (
                <ScrollArea className="h-[600px]">
                  <div className="space-y-3">
                    {auditLogs.map((log) => (
                      <div key={log.id} className="p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-md bg-primary/10 text-primary">
                              <Activity className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-semibold">{log.updateTitle}</p>
                              <p className="text-xs text-muted-foreground">
                                {log.action.replace(/_/g, ' ')} • {log.patientName}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {new Date(log.timestamp).toLocaleString()}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div className="p-2 bg-muted/50 rounded">
                            <span className="text-muted-foreground">Officer: </span>
                            <span className="font-medium">{log.officerName}</span>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <span className="text-muted-foreground">Facility: </span>
                            <span className="font-medium">{log.facilityName}</span>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <span className="text-muted-foreground">Patient ID: </span>
                            <span className="font-medium font-mono text-xs">{log.patientId}</span>
                          </div>
                          <div className="p-2 bg-muted/50 rounded">
                            <span className="text-muted-foreground">Update Type: </span>
                            <span className="font-medium capitalize">{log.updateType.replace(/_/g, ' ')}</span>
                          </div>
                        </div>

                        {Object.keys(log.updateData).length > 0 && (
                          <div className="mt-3 p-3 bg-muted/30 rounded border">
                            <p className="text-xs font-semibold text-muted-foreground mb-2">Update Data:</p>
                            <div className="grid grid-cols-2 gap-2">
                              {Object.entries(log.updateData).map(([key, value]) => (
                                value && (
                                  <div key={key} className="text-xs">
                                    <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}: </span>
                                    <span className="font-medium">{String(value)}</span>
                                  </div>
                                )
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <ShieldCheck className="w-3 h-3" />
                          <span>Audit ID: {log.id}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-primary mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-sm">Audit Trail Integrity</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      All entries are immutable and timestamped. Health Officers can only ADD records, never edit or delete existing ones. 
                      This ensures complete accountability and compliance with medical record-keeping standards.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
