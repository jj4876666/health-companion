import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminUser } from '@/types/emec';
import { demoAdmin } from '@/data/demoUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConsentWorkflow } from '@/components/consent/ConsentWorkflow';
import { useToast } from '@/hooks/use-toast';
import { 
  Stethoscope, Search, User, FileText, Syringe, Pill, 
  TestTube, AlertTriangle, ClipboardList, Clock, Building2,
  ShieldCheck, Plus, Save, History
} from 'lucide-react';

const recordCategories = [
  { id: 'vitals', label: 'Vitals', icon: Activity },
  { id: 'allergies', label: 'Allergies', icon: AlertTriangle },
  { id: 'medications', label: 'Medications', icon: Pill },
  { id: 'conditions', label: 'Conditions', icon: Stethoscope },
  { id: 'immunizations', label: 'Immunizations', icon: Syringe },
  { id: 'lab_results', label: 'Lab Results', icon: TestTube },
  { id: 'procedures', label: 'Procedures', icon: ClipboardList },
  { id: 'notes', label: 'Clinical Notes', icon: FileText },
];

import { Activity } from 'lucide-react';

export function HealthOfficerDashboard() {
  const { currentUser, addAuditEntry } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const admin = (currentUser as AdminUser) || demoAdmin;
  const [patientEmecId, setPatientEmecId] = useState('');
  const [patientFound, setPatientFound] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState('vitals');
  const [hasConsent, setHasConsent] = useState(false);
  const [consentTimer, setConsentTimer] = useState(0);

  // Demo patient data
  const demoPatientData = {
    name: 'Kevin Otieno',
    emecId: 'KOT2025A001',
    age: 9,
    gender: 'Male',
    bloodGroup: 'O+',
    vitals: {
      lastRecorded: '2025-01-15',
      temperature: '36.8°C',
      bloodPressure: '100/65 mmHg',
      heartRate: '88 bpm',
      weight: '28 kg',
      height: '132 cm',
    },
    allergies: ['Penicillin', 'Peanuts'],
    medications: [
      { name: 'Vitamin D3', dosage: '400 IU', frequency: 'Daily' },
    ],
    conditions: ['Mild Asthma'],
    immunizations: [
      { vaccine: 'BCG', date: '2016-03-15', status: 'Complete' },
      { vaccine: 'OPV', date: '2016-05-20', status: 'Complete' },
      { vaccine: 'DPT', date: '2016-07-10', status: 'Complete' },
      { vaccine: 'Measles', date: '2017-03-15', status: 'Complete' },
    ],
    labResults: [
      { test: 'Complete Blood Count', date: '2025-01-10', result: 'Normal', facility: 'Mbita Hospital' },
      { test: 'Malaria RDT', date: '2025-01-10', result: 'Negative', facility: 'Mbita Hospital' },
    ],
    procedures: [],
    notes: [
      { date: '2025-01-15', note: 'Routine checkup. Patient in good health.', officer: 'Dr. Omondi' },
    ],
  };

  const searchPatient = () => {
    if (patientEmecId.toUpperCase() === 'KOT2025A001') {
      setPatientData(demoPatientData);
      setPatientFound(true);
      toast({
        title: 'Patient Found',
        description: `Found record for ${demoPatientData.name}`,
      });
    } else if (patientEmecId.length === 11) {
      toast({
        title: 'Patient Not Found',
        description: 'No patient found with this EMEC ID',
        variant: 'destructive',
      });
    }
  };

  const handleConsentApproved = () => {
    setHasConsent(true);
    setConsentTimer(300); // 5 minutes
    toast({
      title: 'Access Granted',
      description: 'You now have 5 minutes to update patient records',
    });
  };

  const handleAddRecord = (category: string, data: any) => {
    toast({
      title: 'Update Requested',
      description: 'A consent request has been sent to the patient/guardian',
    });
    addAuditEntry({
      userId: admin.id,
      userName: admin.name,
      userRole: 'admin',
      action: 'REQUEST_UPDATE',
      target: patientEmecId,
      details: `Requested update to ${category}`,
      facilityName: admin.facilityName,
    });
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
                <h2 className="text-2xl font-bold">{admin.name}</h2>
                <div className="flex items-center gap-2 text-white/80">
                  <Building2 className="w-4 h-4" />
                  <span>{admin.facilityName}</span>
                </div>
                <Badge className="mt-2 bg-white/20 text-white border-white/30">
                  <ShieldCheck className="w-3 h-3 mr-1" />
                  License: {admin.facilityLicense}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-white/70">EMEC ID</p>
              <p className="font-mono font-bold">{admin.emecId}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Patient Search */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="w-5 h-5" />
            Patient Lookup
          </CardTitle>
          <CardDescription>
            Enter patient's EMEC ID to access their medical records
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={patientEmecId}
              onChange={(e) => setPatientEmecId(e.target.value.toUpperCase())}
              placeholder="Enter EMEC ID (e.g., KOT2025A001)"
              className="font-mono"
            />
            <Button onClick={searchPatient}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Demo: Try EMEC ID "KOT2025A001" for Kevin Otieno's records
          </p>
        </CardContent>
      </Card>

      {/* Patient Found - Show Consent & Records */}
      {patientFound && patientData && (
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
                    <h3 className="font-bold text-lg">{patientData.name}</h3>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{patientData.age} years old</span>
                      <span>•</span>
                      <span>{patientData.gender}</span>
                      <span>•</span>
                      <Badge variant="secondary">{patientData.bloodGroup}</Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">EMEC ID</p>
                  <p className="font-mono font-bold">{patientData.emecId}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Consent Request */}
          {!hasConsent && (
            <ConsentWorkflow
              mode="admin"
              patientEmecId={patientEmecId}
              onCodeGenerated={(code) => {
                // In a real app, this would verify the code
                setTimeout(() => handleConsentApproved(), 2000);
              }}
            />
          )}

          {/* Medical Records Tabs */}
          {hasConsent && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Medical Records
                  </CardTitle>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-300">
                    <Clock className="w-3 h-3 mr-1" />
                    Access expires in 5:00
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                  <TabsList className="flex flex-wrap h-auto gap-1 bg-muted/50 p-1">
                    {recordCategories.map((cat) => (
                      <TabsTrigger key={cat.id} value={cat.id} className="text-xs">
                        <cat.icon className="w-3 h-3 mr-1" />
                        {cat.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  <TabsContent value="vitals" className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(patientData.vitals).map(([key, value]) => (
                        key !== 'lastRecorded' && (
                          <div key={key} className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1')}
                            </p>
                            <p className="font-bold">{value as string}</p>
                          </div>
                        )
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add New Vitals
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="allergies" className="space-y-4 mt-4">
                    <div className="flex flex-wrap gap-2">
                      {patientData.allergies.map((allergy: string, i: number) => (
                        <Badge key={i} variant="destructive" className="text-sm py-1.5 px-3">
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          {allergy}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Add new allergy..." className="max-w-xs" />
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="medications" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {patientData.medications.map((med: any, i: number) => (
                        <div key={i} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {med.dosage} - {med.frequency}
                            </p>
                          </div>
                          <Badge variant="secondary">Active</Badge>
                        </div>
                      ))}
                    </div>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Prescribe Medication
                    </Button>
                  </TabsContent>

                  <TabsContent value="conditions" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {patientData.conditions.map((condition: string, i: number) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          <p className="font-medium">{condition}</p>
                        </div>
                      ))}
                    </div>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Diagnosis
                    </Button>
                  </TabsContent>

                  <TabsContent value="immunizations" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {patientData.immunizations.map((imm: any, i: number) => (
                        <div key={i} className="p-3 bg-muted rounded-lg flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Syringe className="w-5 h-5 text-primary" />
                            <div>
                              <p className="font-medium">{imm.vaccine}</p>
                              <p className="text-sm text-muted-foreground">{imm.date}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500">{imm.status}</Badge>
                        </div>
                      ))}
                    </div>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Record Vaccination
                    </Button>
                  </TabsContent>

                  <TabsContent value="lab_results" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {patientData.labResults.map((lab: any, i: number) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{lab.test}</p>
                            <Badge variant={lab.result === 'Normal' || lab.result === 'Negative' ? 'secondary' : 'destructive'}>
                              {lab.result}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {lab.date} • {lab.facility}
                          </p>
                        </div>
                      ))}
                    </div>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Add Lab Result
                    </Button>
                  </TabsContent>

                  <TabsContent value="procedures" className="space-y-4 mt-4">
                    <div className="text-center py-8 text-muted-foreground">
                      <ClipboardList className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No procedures recorded</p>
                    </div>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-1" />
                      Record Procedure
                    </Button>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      {patientData.notes.map((note: any, i: number) => (
                        <div key={i} className="p-3 bg-muted rounded-lg">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-sm text-muted-foreground">{note.date}</p>
                            <p className="text-sm font-medium">{note.officer}</p>
                          </div>
                          <p>{note.note}</p>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <Textarea placeholder="Add clinical notes..." rows={3} />
                      <Button size="sm">
                        <Save className="w-4 h-4 mr-1" />
                        Save Note
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </>
      )}

      {/* Recent Activity / Audit Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="p-2 text-sm border-b last:border-0">
              <div className="flex items-center justify-between">
                <span className="font-medium">Session Started</span>
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleString()}
                </span>
              </div>
              <p className="text-muted-foreground text-xs">Health officer session active</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
