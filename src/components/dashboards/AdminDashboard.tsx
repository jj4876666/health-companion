import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminUser } from '@/types/emec';
import { demoAdmin, demoChild, demoAdult, getUserByEmecId, DEMO_EMEC_IDS } from '@/data/demoUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, FileText, CheckCircle, AlertTriangle, Search, Edit, 
  Clock, User, Hospital, BadgeCheck, CreditCard, Lock, 
  Pill, Activity, Heart, Droplets, Syringe, FileHeart, 
  Stethoscope, ClipboardList, Calendar, Weight, Ruler, Eye,
  Brain, Bone, Thermometer, FlaskConical, Save, X
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Hospital record categories
const recordCategories = [
  { id: 'vitals', name: 'Vital Signs', icon: Activity, color: 'from-red-500 to-pink-500' },
  { id: 'allergies', name: 'Allergies', icon: AlertTriangle, color: 'from-orange-500 to-yellow-500' },
  { id: 'medications', name: 'Current Medications', icon: Pill, color: 'from-blue-500 to-cyan-500' },
  { id: 'conditions', name: 'Medical Conditions', icon: Heart, color: 'from-purple-500 to-pink-500' },
  { id: 'immunizations', name: 'Immunizations', icon: Syringe, color: 'from-green-500 to-emerald-500' },
  { id: 'labResults', name: 'Lab Results', icon: FlaskConical, color: 'from-indigo-500 to-violet-500' },
  { id: 'procedures', name: 'Procedures History', icon: Stethoscope, color: 'from-teal-500 to-cyan-500' },
  { id: 'notes', name: 'Clinical Notes', icon: ClipboardList, color: 'from-gray-500 to-slate-500' },
];

// Demo patient records
const demoPatientRecords = {
  vitals: {
    bloodPressure: '120/80 mmHg',
    heartRate: '72 bpm',
    temperature: '36.8°C',
    respiratoryRate: '16/min',
    oxygenSaturation: '98%',
    weight: '65 kg',
    height: '170 cm',
    bmi: '22.5',
    lastUpdated: '2025-01-15',
  },
  allergies: ['Penicillin', 'Peanuts', 'Dust mites'],
  medications: [
    { name: 'Metformin', dose: '500mg', frequency: 'Twice daily', startDate: '2024-06-01' },
    { name: 'Lisinopril', dose: '10mg', frequency: 'Once daily', startDate: '2024-08-15' },
  ],
  conditions: [
    { name: 'Type 2 Diabetes', status: 'Active', diagnosedDate: '2024-06-01' },
    { name: 'Hypertension', status: 'Controlled', diagnosedDate: '2024-08-15' },
  ],
  immunizations: [
    { name: 'COVID-19 (Pfizer)', date: '2024-03-15', nextDue: '2025-03-15' },
    { name: 'Influenza', date: '2024-10-01', nextDue: '2025-10-01' },
    { name: 'Tetanus', date: '2023-05-20', nextDue: '2033-05-20' },
  ],
  labResults: [
    { test: 'HbA1c', result: '6.8%', date: '2025-01-10', status: 'Normal' },
    { test: 'Cholesterol (Total)', result: '195 mg/dL', date: '2025-01-10', status: 'Normal' },
    { test: 'Creatinine', result: '0.9 mg/dL', date: '2025-01-10', status: 'Normal' },
  ],
  procedures: [
    { name: 'Annual Physical Exam', date: '2025-01-15', provider: 'Dr. Wanjiku' },
    { name: 'Eye Examination', date: '2024-11-20', provider: 'Dr. Ochieng' },
  ],
  notes: [
    { date: '2025-01-15', author: 'Dr. Wanjiku', note: 'Patient presents in good health. Continue current medications. Schedule follow-up in 3 months.' },
  ],
};

export function AdminDashboard() {
  const { currentUser, addAuditEntry } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const admin = (currentUser as AdminUser) || demoAdmin;
  const [isVerified] = useState(admin.isVerified);
  
  // Patient lookup state
  const [patientEmecId, setPatientEmecId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<User | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeCategory, setActiveCategory] = useState('vitals');
  
  // Edit state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState('');
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [patientRecords, setPatientRecords] = useState(demoPatientRecords);

  const handlePatientLookup = async () => {
    if (!patientEmecId || patientEmecId.length !== 11) {
      toast({ title: "Invalid EMEC ID", description: "Please enter a valid 11-character EMEC ID", variant: "destructive" });
      return;
    }

    if (!adminPassword) {
      toast({ title: "Password Required", description: "Please enter your admin password to verify", variant: "destructive" });
      return;
    }

    if (adminPassword !== admin.password) {
      toast({ title: "Authentication Failed", description: "Incorrect admin password", variant: "destructive" });
      return;
    }

    setIsVerifying(true);
    // OPTIMIZED: Reduced delay from 800ms to 200ms for faster verification
    await new Promise(resolve => setTimeout(resolve, 200));

    const patient = getUserByEmecId(patientEmecId);
    if (patient) {
      setSelectedPatient(patient);
      setPatientRecords(demoPatientRecords);
      addAuditEntry({
        userId: admin.id,
        userName: admin.name,
        userRole: 'admin',
        action: 'VIEW_RECORD',
        target: patient.name,
        details: `Accessed patient record: ${patient.emecId}`,
        facilityName: admin.facilityName,
      });
      toast({ title: "Patient Found", description: `Viewing complete medical record for ${patient.name}` });
    } else {
      toast({ title: "Patient Not Found", description: "No patient found with this EMEC ID", variant: "destructive" });
    }
    setIsVerifying(false);
  };

  const handleUpdateRecord = (category: string, field: string, newValue: string) => {
    if (!selectedPatient) return;

    // Demo: update local state
    addAuditEntry({
      userId: admin.id,
      userName: admin.name,
      userRole: 'admin',
      action: 'UPDATE_RECORD',
      target: selectedPatient.name,
      details: `Updated ${category} - ${field}: ${newValue}`,
      facilityName: admin.facilityName,
    });

    toast({ title: "Update Requested", description: `Change request sent to patient for approval` });
    setEditModalOpen(false);
    setEditField('');
    setEditValue('');
  };

  const renderRecordContent = () => {
    switch (activeCategory) {
      case 'vitals':
        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(patientRecords.vitals).filter(([key]) => key !== 'lastUpdated').map(([key, value]) => (
              <Card key={key} className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</p>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
                      onClick={() => { setEditCategory('vitals'); setEditField(key); setEditValue(value); setEditModalOpen(true); }}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                  <p className="font-bold text-lg">{value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        );

      case 'allergies':
        return (
          <div className="space-y-3">
            {patientRecords.allergies.map((allergy, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-destructive/10 border border-destructive/30">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-destructive" />
                  <span className="font-medium">{allergy}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={() => { setEditCategory('allergies'); setEditField(String(i)); setEditValue(allergy); setEditModalOpen(true); }}>
                  <Edit className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4" onClick={() => { setEditCategory('allergies'); setEditField('new'); setEditValue(''); setEditModalOpen(true); }}>
              + Add Allergy
            </Button>
          </div>
        );

      case 'medications':
        return (
          <div className="space-y-3">
            {patientRecords.medications.map((med, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{med.name}</p>
                      <p className="text-sm text-muted-foreground">{med.dose} - {med.frequency}</p>
                      <p className="text-xs text-muted-foreground">Started: {med.startDate}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setEditCategory('medications'); setEditField(String(i)); setEditValue(JSON.stringify(med)); setEditModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => { setEditCategory('medications'); setEditField('new'); setEditValue(''); setEditModalOpen(true); }}>
              + Add Medication
            </Button>
          </div>
        );

      case 'conditions':
        return (
          <div className="space-y-3">
            {patientRecords.conditions.map((condition, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{condition.name}</p>
                        <Badge variant={condition.status === 'Active' ? 'destructive' : 'secondary'}>
                          {condition.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">Diagnosed: {condition.diagnosedDate}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setEditCategory('conditions'); setEditField(String(i)); setEditValue(JSON.stringify(condition)); setEditModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => { setEditCategory('conditions'); setEditField('new'); setEditValue(''); setEditModalOpen(true); }}>
              + Add Condition
            </Button>
          </div>
        );

      case 'immunizations':
        return (
          <div className="space-y-3">
            {patientRecords.immunizations.map((imm, i) => (
              <Card key={i} className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{imm.name}</p>
                      <p className="text-sm text-muted-foreground">Given: {imm.date}</p>
                      <p className="text-xs text-success">Next due: {imm.nextDue}</p>
                    </div>
                    <Syringe className="w-5 h-5 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => { setEditCategory('immunizations'); setEditField('new'); setEditValue(''); setEditModalOpen(true); }}>
              + Add Immunization
            </Button>
          </div>
        );

      case 'labResults':
        return (
          <div className="space-y-3">
            {patientRecords.labResults.map((lab, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{lab.test}</p>
                      <p className="text-sm text-muted-foreground">{lab.date}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-lg">{lab.result}</p>
                      <Badge variant={lab.status === 'Normal' ? 'default' : 'destructive'}>{lab.status}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => { setEditCategory('labResults'); setEditField('new'); setEditValue(''); setEditModalOpen(true); }}>
              + Add Lab Result
            </Button>
          </div>
        );

      case 'procedures':
        return (
          <div className="space-y-3">
            {patientRecords.procedures.map((proc, i) => (
              <Card key={i} className="border-0 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{proc.name}</p>
                      <p className="text-sm text-muted-foreground">{proc.date}</p>
                      <p className="text-xs text-muted-foreground">Provider: {proc.provider}</p>
                    </div>
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => { setEditCategory('procedures'); setEditField('new'); setEditValue(''); setEditModalOpen(true); }}>
              + Add Procedure
            </Button>
          </div>
        );

      case 'notes':
        return (
          <div className="space-y-3">
            {patientRecords.notes.map((note, i) => (
              <Card key={i} className="border-0 shadow-sm bg-muted/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{note.author}</Badge>
                      <span className="text-xs text-muted-foreground">{note.date}</span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => { setEditCategory('notes'); setEditField(String(i)); setEditValue(note.note); setEditModalOpen(true); }}>
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm">{note.note}</p>
                </CardContent>
              </Card>
            ))}
            <Button variant="outline" className="w-full" onClick={() => { setEditCategory('notes'); setEditField('new'); setEditValue(''); setEditModalOpen(true); }}>
              + Add Clinical Note
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-lg">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Patient Records Management</h1>
              <p className="text-muted-foreground">{admin.facilityName}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isVerified && (
              <Badge className="bg-success text-white gap-1">
                <BadgeCheck className="w-4 h-4" />
                Verified Health Officer
              </Badge>
            )}
          </div>
        </div>

        {/* Officer Info Card */}
        <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500/10 to-cyan-500/10">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <User className="w-6 h-6 text-primary-foreground" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">{admin.name}</p>
              <p className="text-sm text-muted-foreground font-mono">{admin.emecId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">License</p>
              <p className="font-mono text-sm">{admin.facilityLicense}</p>
            </div>
          </CardContent>
        </Card>

        {/* Patient Lookup */}
        <Card className="border-2 border-primary/30 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Patient Lookup
            </CardTitle>
            <CardDescription>Enter patient's EMEC ID and verify with your password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Patient EMEC ID</Label>
                <Input
                  value={patientEmecId}
                  onChange={(e) => setPatientEmecId(e.target.value.toUpperCase())}
                  placeholder="e.g., AJM2025B002"
                  maxLength={11}
                  className="font-mono uppercase"
                />
              </div>
              <div className="space-y-2">
                <Label>Your Password</Label>
                <Input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              <div className="flex items-end">
                <Button onClick={handlePatientLookup} disabled={isVerifying} className="w-full gap-2">
                  {isVerifying ? (
                    <><Lock className="w-4 h-4 animate-pulse" /> Verifying...</>
                  ) : (
                    <><Search className="w-4 h-4" /> Search Patient</>
                  )}
                </Button>
              </div>
            </div>
            <div className="flex gap-2 text-xs text-muted-foreground items-center">
              <span>Demo IDs:</span>
              <Badge variant="outline" className="font-mono cursor-pointer hover:bg-primary/10" onClick={() => setPatientEmecId(DEMO_EMEC_IDS.adult)}>
                {DEMO_EMEC_IDS.adult}
              </Badge>
              <Badge variant="outline" className="font-mono cursor-pointer hover:bg-primary/10" onClick={() => setPatientEmecId(DEMO_EMEC_IDS.child)}>
                {DEMO_EMEC_IDS.child}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Patient Records View */}
        {selectedPatient && (
          <div className="space-y-6 animate-fade-in">
            {/* Patient Header */}
            <Card className="border-0 shadow-lg overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-6 text-white">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center">
                    <User className="w-10 h-10" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{selectedPatient.name}</h2>
                    <p className="font-mono text-white/80">{selectedPatient.emecId}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge className="bg-white/20 border-0">Age {selectedPatient.age}</Badge>
                      <Badge className="bg-white/20 border-0">{selectedPatient.bloodGroup}</Badge>
                      <Badge className="bg-white/20 border-0 capitalize">{selectedPatient.role}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-white/70">Last Updated</p>
                    <p className="font-medium">{patientRecords.vitals.lastUpdated}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Records Categories */}
            <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
              {recordCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`p-3 rounded-xl transition-all flex flex-col items-center gap-1 ${
                      activeCategory === category.id
                        ? `bg-gradient-to-br ${category.color} text-white shadow-lg scale-105`
                        : 'bg-muted/50 hover:bg-muted text-muted-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-xs font-medium text-center">{category.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Category Content */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {(() => {
                    const cat = recordCategories.find(c => c.id === activeCategory);
                    const Icon = cat?.icon || FileText;
                    return (
                      <>
                        <Icon className="w-5 h-5" />
                        {cat?.name || 'Records'}
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {renderRecordContent()}
              </CardContent>
            </Card>

            {/* Audit Trail - Using local state since auditLog not in context */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-40">
                  <div className="space-y-2">
                    <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Clock className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">Session Started</p>
                        <p className="text-xs text-muted-foreground">Current admin session active</p>
                        <p className="text-xs text-muted-foreground">{new Date().toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Edit Modal */}
        <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Record</DialogTitle>
              <DialogDescription>
                Changes require patient approval before being applied
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Category: {editCategory}</Label>
                <Label>Field: {editField}</Label>
              </div>
              <div className="space-y-2">
                <Label>New Value</Label>
                <Textarea
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  placeholder="Enter new value..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={() => handleUpdateRecord(editCategory, editField, editValue)}>
                <Save className="w-4 h-4 mr-2" />
                Submit for Approval
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Footer */}
        <Card className="border-0 shadow-sm bg-muted/50">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <Shield className="w-4 h-4 inline mr-1" />
              All changes are logged and require patient consent. Demo Mode – Patient data is simulated.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
