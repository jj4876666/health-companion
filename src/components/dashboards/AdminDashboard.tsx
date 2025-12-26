import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { AdminUser } from '@/types/emec';
import { demoAdmin, demoChild, demoParent } from '@/data/demoUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Shield, Building2, Users, FileText, CheckCircle, 
  AlertTriangle, Search, Edit, Eye, Clock, User,
  Hospital, BadgeCheck, Activity
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdminDashboard() {
  const { currentUser, auditLog, addAuditEntry } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const admin = (currentUser as AdminUser) || demoAdmin;
  const [searchQuery, setSearchQuery] = useState('');
  const [isVerified] = useState(admin.isVerified);

  const patients = [demoChild];
  const recentAudit = auditLog.slice(0, 10);

  const handleEditPatient = () => {
    addAuditEntry({
      userId: admin.id,
      userName: admin.name,
      userRole: 'admin',
      action: 'VIEW_RECORD',
      target: demoChild.name,
      details: 'Viewed patient record for editing',
      facilityName: admin.facilityName,
    });
    toast({
      title: "Edit Mode",
      description: "Changes require parent approval before visible to patient.",
    });
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
            Demo Data – Editable for Presentation
          </p>
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
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search patients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Patient Cards */}
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
                        <Badge variant="outline" className="text-xs">Patient</Badge>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        Age {patient.age} • Blood Group {patient.bloodGroup}
                      </p>
                      
                      {/* Allergies Alert */}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        {patient.allergies.map((allergy) => (
                          <Badge key={allergy} variant="destructive" className="text-xs">
                            {allergy}
                          </Badge>
                        ))}
                      </div>

                      {/* Linked Parent */}
                      <p className="text-sm text-muted-foreground mt-2">
                        <Users className="w-4 h-4 inline mr-1" />
                        Guardian: {demoParent.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button variant="outline" className="flex-1 gap-2">
                      <Eye className="w-4 h-4" />
                      View Full Record
                    </Button>
                    <Button 
                      className="flex-1 gap-2"
                      onClick={handleEditPatient}
                    >
                      <Edit className="w-4 h-4" />
                      Edit Record
                    </Button>
                  </div>

                  <p className="text-xs text-muted-foreground mt-3 text-center">
                    ⚠️ Edits require parent approval before visible to patient
                  </p>
                </CardContent>
              </Card>
            ))}
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
                      entry.userRole === 'parent' ? 'bg-blue-500/20 text-blue-500' :
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
