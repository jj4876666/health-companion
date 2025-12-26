import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminUser } from '@/types/emec';
import { demoAdmin, demoChild, demoParent, demoAdult, getUserByEmecId, DEMO_EMEC_IDS } from '@/data/demoUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { 
  Shield, Building2, Users, FileText, CheckCircle, 
  AlertTriangle, Search, Edit, Eye, Clock, User,
  Hospital, BadgeCheck, Activity, CreditCard, Lock, Utensils, Pill
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminDashboard() {
  const { currentUser, auditLog, addAuditEntry, requestPatientEdit } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const admin = (currentUser as AdminUser) || demoAdmin;
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerified] = useState(admin.isVerified);
  
  // Edit patient modal state
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [patientEmecId, setPatientEmecId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<any>(null);
  const [editField, setEditField] = useState('');
  const [editValue, setEditValue] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Meal plan modal state
  const [mealPlanModalOpen, setMealPlanModalOpen] = useState(false);
  const [mealPlanNotes, setMealPlanNotes] = useState('');

  const patients = [demoChild, demoAdult];
  const recentAudit = auditLog.slice(0, 10);

  const handlePatientLookup = async () => {
    if (!patientEmecId || patientEmecId.length !== 11) {
      toast({
        title: "Invalid EMEC ID",
        description: "Please enter a valid 11-character EMEC ID",
        variant: "destructive",
      });
      return;
    }

    if (!adminPassword) {
      toast({
        title: "Password Required",
        description: "Please enter your admin password to verify",
        variant: "destructive",
      });
      return;
    }

    // Verify admin password
    if (adminPassword !== admin.password) {
      toast({
        title: "Authentication Failed",
        description: "Incorrect admin password",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    const patient = getUserByEmecId(patientEmecId);
    if (patient) {
      setSelectedPatient(patient);
      addAuditEntry({
        userId: admin.id,
        userName: admin.name,
        userRole: 'admin',
        action: 'VIEW_RECORD',
        target: patient.name,
        details: `Accessed patient record: ${patient.emecId}`,
        facilityName: admin.facilityName,
      });
      toast({
        title: "Patient Found",
        description: `Viewing record for ${patient.name}`,
      });
    } else {
      toast({
        title: "Patient Not Found",
        description: "No patient found with this EMEC ID",
        variant: "destructive",
      });
    }
    setIsVerifying(false);
  };

  const handleRequestEdit = () => {
    if (!selectedPatient || !editField || !editValue) {
      toast({
        title: "Missing Information",
        description: "Please select a field and enter a new value",
        variant: "destructive",
      });
      return;
    }

    const oldValue = selectedPatient[editField] || 'Not set';
    requestPatientEdit(selectedPatient.emecId, editField, String(oldValue), editValue);
    
    setEditField('');
    setEditValue('');
    setEditModalOpen(false);
  };

  const handleCreateMealPlan = () => {
    if (!selectedPatient) return;

    addAuditEntry({
      userId: admin.id,
      userName: admin.name,
      userRole: 'admin',
      action: 'CREATE_MEAL_PLAN',
      target: selectedPatient.name,
      details: `Created meal plan: ${mealPlanNotes.slice(0, 50)}...`,
      facilityName: admin.facilityName,
    });

    toast({
      title: "Meal Plan Created",
      description: `Meal plan sent to ${selectedPatient.name} for review`,
    });

    setMealPlanNotes('');
    setMealPlanModalOpen(false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar Navigation */}
      <aside className="hidden lg:flex w-64 flex-col bg-card border-r p-4 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="font-semibold text-sm">{admin.name}</p>
            <p className="text-xs text-muted-foreground">Health Officer</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-muted/50">
          <p className="text-xs text-muted-foreground mb-1">Your EMEC ID</p>
          <p className="font-mono text-sm font-bold">{admin.emecId}</p>
        </div>

        <nav className="space-y-1">
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Users className="w-4 h-4" />
            Patients
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <FileText className="w-4 h-4" />
            Audit Log
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <Building2 className="w-4 h-4" />
            Facility Info
          </Button>
          <Button variant="ghost" className="w-full justify-start gap-2" asChild>
            <Link to="/emergency">
              <AlertTriangle className="w-4 h-4" />
              Emergency
            </Link>
          </Button>
        </nav>

        {/* Facility Verification Status */}
        <Card className="mt-auto">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              {isVerified ? (
                <BadgeCheck className="w-5 h-5 text-success" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-warning" />
              )}
              <span className="font-medium text-sm">
                {isVerified ? 'Verified' : 'Pending Verification'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">{admin.facilityName}</p>
            <p className="text-xs text-muted-foreground font-mono">{admin.facilityLicense}</p>
          </CardContent>
        </Card>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 space-y-6 overflow-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              {admin.facilityName} • License: {admin.facilityLicense}
            </p>
          </div>
          <Badge className="w-fit" variant={isVerified ? "default" : "secondary"}>
            {isVerified ? (
              <><BadgeCheck className="w-4 h-4 mr-1" /> Verified Facility</>
            ) : (
              <><Clock className="w-4 h-4 mr-1" /> Pending Verification</>
            )}
          </Badge>
        </div>

        {/* Demo Label */}
        <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-center">
          <p className="text-sm text-warning-foreground font-medium">
            Demo Data – Admin can audit, update records, create meal plans & prescriptions
          </p>
        </div>

        {/* Admin Capabilities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Edit className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="font-semibold">Edit Records</p>
                <p className="text-xs text-muted-foreground">Requires patient approval</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Utensils className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="font-semibold">Meal Plans</p>
                <p className="text-xs text-muted-foreground">Create diet recommendations</p>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Pill className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="font-semibold">Medications</p>
                <p className="text-xs text-muted-foreground">Prescribe treatments</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="patients" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="patients" className="gap-2">
              <Users className="w-4 h-4" />
              Patients
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-2">
              <FileText className="w-4 h-4" />
              Audit Log
            </TabsTrigger>
            <TabsTrigger value="facility" className="gap-2">
              <Building2 className="w-4 h-4" />
              Facility
            </TabsTrigger>
          </TabsList>

          {/* Patients Tab */}
          <TabsContent value="patients" className="space-y-4 mt-4">
            {/* Patient Lookup by EMEC ID */}
            <Card className="border-2 border-primary/30 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Patient Lookup (EMEC ID)
                </CardTitle>
                <CardDescription>
                  Enter patient's EMEC ID and your password to access their records
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    <Label>Your Admin Password</Label>
                    <Input
                      type="password"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="Enter your password"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handlePatientLookup} disabled={isVerifying} className="gap-2">
                    {isVerifying ? (
                      <>
                        <Lock className="w-4 h-4 animate-pulse" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        Lookup Patient
                      </>
                    )}
                  </Button>
                  <div className="flex gap-2 text-xs text-muted-foreground items-center">
                    <span>Demo IDs:</span>
                    <Badge variant="outline" className="font-mono cursor-pointer" onClick={() => setPatientEmecId(DEMO_EMEC_IDS.adult)}>
                      {DEMO_EMEC_IDS.adult}
                    </Badge>
                    <Badge variant="outline" className="font-mono cursor-pointer" onClick={() => setPatientEmecId(DEMO_EMEC_IDS.child)}>
                      {DEMO_EMEC_IDS.child}
                    </Badge>
                  </div>
                </div>

                {/* Selected Patient Display */}
                {selectedPatient && (
                  <div className="mt-4 p-4 rounded-lg bg-background border animate-fade-in">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <User className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{selectedPatient.name}</h3>
                          <p className="text-sm text-muted-foreground font-mono">{selectedPatient.emecId}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="capitalize">{selectedPatient.role}</Badge>
                            <Badge variant="secondary">Age {selectedPatient.age}</Badge>
                            <Badge variant="destructive">{selectedPatient.bloodGroup}</Badge>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Allergies */}
                    <div className="mt-4 p-3 rounded bg-destructive/10 border border-destructive/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="font-medium text-sm">Allergies</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedPatient.allergies?.map((allergy: string) => (
                          <Badge key={allergy} variant="destructive">{allergy}</Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-4">
                      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
                        <DialogTrigger asChild>
                          <Button className="flex-1 gap-2">
                            <Edit className="w-4 h-4" />
                            Edit Record
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Request Record Edit</DialogTitle>
                            <DialogDescription>
                              Changes require patient approval before being applied
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Field to Edit</Label>
                              <Select value={editField} onValueChange={setEditField}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select field" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bloodGroup">Blood Group</SelectItem>
                                  <SelectItem value="allergies">Allergies</SelectItem>
                                  <SelectItem value="medicalConditions">Medical Conditions</SelectItem>
                                  <SelectItem value="medications">Medications</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>New Value</Label>
                              <Input
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                placeholder="Enter new value"
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleRequestEdit}>
                              Submit Request
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

                      <Dialog open={mealPlanModalOpen} onOpenChange={setMealPlanModalOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" className="flex-1 gap-2">
                            <Utensils className="w-4 h-4" />
                            Meal Plan
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Create Meal Plan</DialogTitle>
                            <DialogDescription>
                              Create a dietary recommendation for {selectedPatient.name}
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Dietary Notes & Recommendations</Label>
                              <Textarea
                                value={mealPlanNotes}
                                onChange={(e) => setMealPlanNotes(e.target.value)}
                                placeholder="Enter meal plan details, restrictions, and recommendations..."
                                rows={6}
                              />
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setMealPlanModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleCreateMealPlan}>
                              Create Plan
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <p className="text-xs text-muted-foreground mt-3 text-center">
                      ⚠️ All edits require patient approval before they are applied
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Patient Cards */}
            <div className="grid gap-4">
              {patients.map((patient) => (
                <Card key={patient.id} className="border-0 shadow-elegant">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <User className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg">{patient.name}</h3>
                          <Badge variant="outline" className="text-xs capitalize">{patient.role}</Badge>
                        </div>
                        <p className="text-muted-foreground text-sm font-mono">
                          {patient.emecId}
                        </p>
                        <p className="text-muted-foreground text-sm">
                          Age {patient.age} • Blood Group {patient.bloodGroup}
                        </p>
                      </div>
                      <Button 
                        size="sm"
                        onClick={() => {
                          setPatientEmecId(patient.emecId);
                        }}
                      >
                        Select
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Audit Log Tab */}
          <TabsContent value="audit" className="space-y-4 mt-4">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg">{t('dashboard.auditLog')}</CardTitle>
                <CardDescription>Complete activity log for all accounts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {recentAudit.map((entry) => (
                  <div key={entry.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      entry.userRole === 'child' ? 'bg-purple-500/20 text-purple-500' :
                      entry.userRole === 'adult' ? 'bg-blue-500/20 text-blue-500' :
                      entry.userRole === 'parent' ? 'bg-green-500/20 text-green-500' :
                      'bg-orange-500/20 text-orange-500'
                    }`}>
                      {entry.userRole[0].toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{entry.userName}</span>
                        <Badge variant="outline" className="text-xs">{entry.action}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{entry.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {new Date(entry.timestamp).toLocaleString()}
                        {entry.facilityName && ` • ${entry.facilityName}`}
                      </p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Facility Tab */}
          <TabsContent value="facility" className="space-y-4 mt-4">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hospital className="w-5 h-5" />
                  {t('dashboard.facilityInfo')}
                </CardTitle>
                <CardDescription>Your verified health facility details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label>Facility Name</Label>
                    <Input value={admin.facilityName} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>License Number</Label>
                    <Input value={admin.facilityLicense} readOnly className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Admin Name</Label>
                    <Input value={admin.name} readOnly className="bg-muted" />
                  </div>
                  <div className="space-y-2">
                    <Label>Admin EMEC ID</Label>
                    <Input value={admin.emecId} readOnly className="bg-muted font-mono" />
                  </div>
                  <div className="space-y-2">
                    <Label>Verification Status</Label>
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 border border-success/30">
                      <BadgeCheck className="w-5 h-5 text-success" />
                      <span className="text-success font-medium">Verified on {new Date(admin.verificationDate || '').toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}