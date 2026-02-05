import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import {
  Shield, FileText, Activity, Heart, Stethoscope, Clock,
  Plus, Save, Trash2, CheckCircle, AlertTriangle, User,
  Pill, Target, Image as ImageIcon, History
} from 'lucide-react';

interface MedicalRecord {
  id: string;
  type: 'diagnosis' | 'medication' | 'vitals' | 'note' | 'lab_result';
  title: string;
  description: string;
  date: string;
  addedBy: string;
  facilityName: string;
}

interface PatientData {
  bloodGroup: string;
  allergies: string[];
  conditions: string[];
  notes: string;
}

interface AdminRecordEditorProps {
  patientId: string;
  patientName: string;
  patientEmecId: string;
  onClose: () => void;
}

export function AdminRecordEditor({
  patientId,
  patientName,
  patientEmecId,
  onClose,
}: AdminRecordEditorProps) {
  const { toast } = useToast();
  const { currentUser, addAuditEntry } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patientData, setPatientData] = useState<PatientData>({
    bloodGroup: '',
    allergies: [],
    conditions: [],
    notes: '',
  });
  const [newAllergy, setNewAllergy] = useState('');
  const [newCondition, setNewCondition] = useState('');
  
  // New record form
  const [showNewRecordForm, setShowNewRecordForm] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'note' as MedicalRecord['type'],
    title: '',
    description: '',
  });

  // Load records from localStorage
  useEffect(() => {
    const recordsKey = `records_${patientId}`;
    const patientDataKey = `patient_data_${patientId}`;
    
    const savedRecords = localStorage.getItem(recordsKey);
    const savedPatientData = localStorage.getItem(patientDataKey);
    
    if (savedRecords) {
      try {
        setRecords(JSON.parse(savedRecords));
      } catch (e) {
        setRecords([]);
      }
    }
    
    if (savedPatientData) {
      try {
        setPatientData(JSON.parse(savedPatientData));
      } catch (e) {
        // Keep defaults
      }
    }
  }, [patientId]);

  // Save records to localStorage
  const saveRecords = (updatedRecords: MedicalRecord[]) => {
    const recordsKey = `records_${patientId}`;
    localStorage.setItem(recordsKey, JSON.stringify(updatedRecords));
    setRecords(updatedRecords);
  };

  // Save patient data to localStorage
  const savePatientData = (data: PatientData) => {
    const patientDataKey = `patient_data_${patientId}`;
    localStorage.setItem(patientDataKey, JSON.stringify(data));
    setPatientData(data);
  };

  const handleAddRecord = () => {
    if (!newRecord.title || !newRecord.description) {
      toast({
        title: 'Missing Fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    const record: MedicalRecord = {
      id: `record-${Date.now()}`,
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description,
      date: new Date().toISOString(),
      addedBy: currentUser?.name || 'Health Officer',
      facilityName: 'EMEC Demo Facility',
    };

    const updatedRecords = [record, ...records];
    saveRecords(updatedRecords);

    // Log audit entry
    addAuditEntry({
      userId: currentUser?.id || '',
      userName: currentUser?.name || 'Admin',
      userRole: 'admin',
      action: 'ADD_RECORD',
      target: patientName,
      details: `Added ${newRecord.type}: ${newRecord.title}`,
      facilityName: 'EMEC Demo Facility',
    });

    setNewRecord({ type: 'note', title: '', description: '' });
    setShowNewRecordForm(false);

    toast({
      title: '✓ Record Added',
      description: `${newRecord.title} has been added to patient records`,
    });
  };

  const handleDeleteRecord = (recordId: string) => {
    const record = records.find(r => r.id === recordId);
    const updatedRecords = records.filter(r => r.id !== recordId);
    saveRecords(updatedRecords);

    addAuditEntry({
      userId: currentUser?.id || '',
      userName: currentUser?.name || 'Admin',
      userRole: 'admin',
      action: 'DELETE_RECORD',
      target: patientName,
      details: `Deleted record: ${record?.title}`,
      facilityName: 'EMEC Demo Facility',
    });

    toast({
      title: 'Record Deleted',
      description: 'The record has been removed',
    });
  };

  const handleSavePatientData = () => {
    savePatientData(patientData);

    addAuditEntry({
      userId: currentUser?.id || '',
      userName: currentUser?.name || 'Admin',
      userRole: 'admin',
      action: 'UPDATE_PATIENT_DATA',
      target: patientName,
      details: 'Updated patient basic information',
      facilityName: 'EMEC Demo Facility',
    });

    toast({
      title: '✓ Patient Data Saved',
      description: 'Basic information has been updated',
    });
  };

  const addAllergy = () => {
    if (newAllergy && !patientData.allergies.includes(newAllergy)) {
      const updated = { ...patientData, allergies: [...patientData.allergies, newAllergy] };
      savePatientData(updated);
      setNewAllergy('');
    }
  };

  const removeAllergy = (allergy: string) => {
    const updated = { ...patientData, allergies: patientData.allergies.filter(a => a !== allergy) };
    savePatientData(updated);
  };

  const addCondition = () => {
    if (newCondition && !patientData.conditions.includes(newCondition)) {
      const updated = { ...patientData, conditions: [...patientData.conditions, newCondition] };
      savePatientData(updated);
      setNewCondition('');
    }
  };

  const removeCondition = (condition: string) => {
    const updated = { ...patientData, conditions: patientData.conditions.filter(c => c !== condition) };
    savePatientData(updated);
  };

  const getRecordIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'diagnosis': return <Stethoscope className="w-4 h-4" />;
      case 'medication': return <Pill className="w-4 h-4" />;
      case 'vitals': return <Activity className="w-4 h-4" />;
      case 'lab_result': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getRecordColor = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'diagnosis': return 'bg-red-500/10 text-red-600 border-red-500/30';
      case 'medication': return 'bg-blue-500/10 text-blue-600 border-blue-500/30';
      case 'vitals': return 'bg-green-500/10 text-green-600 border-green-500/30';
      case 'lab_result': return 'bg-purple-500/10 text-purple-600 border-purple-500/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-2 border-primary/20 bg-gradient-to-r from-primary/5 to-cyan-500/5">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  {patientName}
                  <Badge className="bg-success/20 text-success border-success/30">
                    <Shield className="w-3 h-3 mr-1" />
                    Admin Access
                  </Badge>
                </CardTitle>
                <CardDescription className="font-mono">{patientEmecId}</CardDescription>
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close Editor
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Admin Actions Alert */}
      <Alert className="border-amber-500/30 bg-amber-500/10">
        <Shield className="h-4 w-4 text-amber-600" />
        <AlertTitle className="text-amber-600">Admin Mode Active</AlertTitle>
        <AlertDescription className="text-muted-foreground">
          All changes are logged in the audit trail. Updates apply only to this patient's records.
        </AlertDescription>
      </Alert>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="gap-2">
            <Activity className="w-4 h-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="records" className="gap-2">
            <FileText className="w-4 h-4" />
            Records
          </TabsTrigger>
          <TabsTrigger value="medications" className="gap-2">
            <Pill className="w-4 h-4" />
            Medications
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Basic Patient Information</CardTitle>
              <CardDescription>Update patient's core health data</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Blood Group</Label>
                  <Select 
                    value={patientData.bloodGroup} 
                    onValueChange={(v) => setPatientData({ ...patientData, bloodGroup: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A+">A+</SelectItem>
                      <SelectItem value="A-">A-</SelectItem>
                      <SelectItem value="B+">B+</SelectItem>
                      <SelectItem value="B-">B-</SelectItem>
                      <SelectItem value="AB+">AB+</SelectItem>
                      <SelectItem value="AB-">AB-</SelectItem>
                      <SelectItem value="O+">O+</SelectItem>
                      <SelectItem value="O-">O-</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Clinical Notes</Label>
                  <Textarea
                    value={patientData.notes}
                    onChange={(e) => setPatientData({ ...patientData, notes: e.target.value })}
                    placeholder="General notes about the patient..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Allergies */}
              <div className="space-y-2">
                <Label>Known Allergies</Label>
                <div className="flex gap-2">
                  <Input
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add allergy (e.g., Penicillin)"
                    onKeyDown={(e) => e.key === 'Enter' && addAllergy()}
                  />
                  <Button variant="outline" onClick={addAllergy}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patientData.allergies.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No allergies recorded</span>
                  ) : (
                    patientData.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive" className="gap-1">
                        {allergy}
                        <button onClick={() => removeAllergy(allergy)} className="ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              {/* Conditions */}
              <div className="space-y-2">
                <Label>Medical Conditions</Label>
                <div className="flex gap-2">
                  <Input
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add condition (e.g., Hypertension)"
                    onKeyDown={(e) => e.key === 'Enter' && addCondition()}
                  />
                  <Button variant="outline" onClick={addCondition}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {patientData.conditions.length === 0 ? (
                    <span className="text-sm text-muted-foreground">No conditions recorded</span>
                  ) : (
                    patientData.conditions.map((condition) => (
                      <Badge key={condition} variant="secondary" className="gap-1">
                        {condition}
                        <button onClick={() => removeCondition(condition)} className="ml-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))
                  )}
                </div>
              </div>

              <Button onClick={handleSavePatientData} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                Save Patient Information
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Records Tab */}
        <TabsContent value="records" className="mt-4 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Medical Records</CardTitle>
                <CardDescription>Add diagnoses, notes, lab results</CardDescription>
              </div>
              <Button onClick={() => setShowNewRecordForm(!showNewRecordForm)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Record
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* New Record Form */}
              {showNewRecordForm && (
                <Card className="border-2 border-dashed border-primary/30 bg-primary/5">
                  <CardContent className="pt-4 space-y-3">
                    <div className="grid md:grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label>Record Type</Label>
                        <Select
                          value={newRecord.type}
                          onValueChange={(v) => setNewRecord({ ...newRecord, type: v as MedicalRecord['type'] })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="diagnosis">Diagnosis</SelectItem>
                            <SelectItem value="medication">Medication</SelectItem>
                            <SelectItem value="vitals">Vitals</SelectItem>
                            <SelectItem value="lab_result">Lab Result</SelectItem>
                            <SelectItem value="note">Clinical Note</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={newRecord.title}
                          onChange={(e) => setNewRecord({ ...newRecord, title: e.target.value })}
                          placeholder="e.g., Blood Pressure Reading"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Description</Label>
                      <Textarea
                        value={newRecord.description}
                        onChange={(e) => setNewRecord({ ...newRecord, description: e.target.value })}
                        placeholder="Detailed notes about the record..."
                        rows={3}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={() => setShowNewRecordForm(false)} className="flex-1">
                        Cancel
                      </Button>
                      <Button onClick={handleAddRecord} className="flex-1">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Add Record
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Records List */}
              {records.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No records yet</p>
                  <p className="text-sm text-muted-foreground">Click "Add Record" to create the first entry</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {records.map((record) => (
                    <div
                      key={record.id}
                      className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${getRecordColor(record.type)}`}>
                            {getRecordIcon(record.type)}
                          </div>
                          <div>
                            <h4 className="font-medium">{record.title}</h4>
                            <p className="text-sm text-muted-foreground mt-1">{record.description}</p>
                            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {new Date(record.date).toLocaleString()}
                              <span>•</span>
                              <span>{record.addedBy}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRecord(record.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Pill className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-muted-foreground">Medication tracking coming soon</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Use the Records tab to add medication entries for now
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Record History</CardTitle>
              <CardDescription>Timeline of all entries for this patient</CardDescription>
            </CardHeader>
            <CardContent>
              {records.length === 0 ? (
                <div className="text-center py-8">
                  <History className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                  <p className="text-muted-foreground">No history yet</p>
                </div>
              ) : (
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-border" />
                  <div className="space-y-4">
                    {records.map((record) => (
                      <div key={record.id} className="flex gap-4 ml-2">
                        <div className={`w-4 h-4 rounded-full border-2 bg-background z-10 ${
                          record.type === 'diagnosis' ? 'border-red-500' :
                          record.type === 'medication' ? 'border-blue-500' :
                          record.type === 'vitals' ? 'border-green-500' :
                          'border-muted-foreground'
                        }`} />
                        <div className="flex-1 pb-4">
                          <p className="font-medium">{record.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(record.date).toLocaleDateString()} • {record.addedBy}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
