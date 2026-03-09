import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import { AdultUser } from '@/types/emec';
import { demoAdult } from '@/data/demoUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AllergyChecker } from '@/components/allergy/AllergyChecker';
import { DailyTargets } from '@/components/targets/DailyTargets';
import { EnhancedPatientRecords } from '@/components/records/EnhancedPatientRecords';
import { EmbeddedAIChat } from '@/components/chat/EmbeddedAIChat';
import { LiveMedicalUpdates } from '@/components/records/LiveMedicalUpdates';
import { supabase } from '@/integrations/supabase/client';
import { 
  User, Heart, Shield, AlertTriangle, Activity, BookOpen, 
  Phone, FileText, Check, X, Clock, Pill, Utensils, CreditCard, Stethoscope, Target, Bot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdultDashboard() {
  const { isDemoMode } = useDemo();
  const { currentUser, isLiveUser, addAuditEntry } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [profileId, setProfileId] = useState<string | null>(null);
  
  // Resolve profile.id for live users (needed for medical_updates)
  useEffect(() => {
    if (isLiveUser && currentUser?.id) {
      supabase
        .from('profiles')
        .select('id')
        .eq('user_id', currentUser.id)
        .maybeSingle()
        .then(({ data }) => {
          if (data) setProfileId(data.id);
        });
    }
  }, [isLiveUser, currentUser?.id]);

  // For live users, show completely empty records. Only use demo data in demo mode.
  const emptyDefaults: Partial<AdultUser> = {
    age: 0,
    bloodGroup: '',
    medicalConditions: [],
    medications: [],
    allergies: [],
    emergencyContact: { name: '', phone: '', relationship: '' },
    mealPlan: undefined,
    pendingChanges: [],
  };
  const baseUser = isLiveUser ? { ...emptyDefaults, ...(currentUser || {}) } : { ...emptyDefaults, ...(currentUser || demoAdult) };
  const adult: AdultUser = {
    ...baseUser,
    medicalConditions: baseUser.medicalConditions ?? [],
    medications: baseUser.medications ?? [],
    allergies: baseUser.allergies ?? [],
    emergencyContact: baseUser.emergencyContact ?? { name: '', phone: '', relationship: '' },
    pendingChanges: baseUser.pendingChanges ?? [],
  } as AdultUser;
  const myPendingChanges: any[] = [];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{adult.name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="font-mono text-xs">
                <CreditCard className="w-3 h-3 mr-1" />
                {adult.emecId}
              </Badge>
              {adult.isVerified && (
                <Badge className="bg-success/20 text-success border-success/30">
                  ✓ Verified
                </Badge>
              )}
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
          <Button variant="outline" asChild>
            <Link to="/consultation">
              <Stethoscope className="w-4 h-4 mr-2" />
              Consult
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

      {/* Status Label */}
      {isLiveUser && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 text-center">
          <p className="text-sm text-primary font-medium">
            🏥 Live Patient Account — Your medical records are managed by your Health Officer
          </p>
        </div>
      )}
      {!isLiveUser && (
        <div className="p-3 rounded-lg bg-muted/50 border border-border text-center">
          <p className="text-sm text-muted-foreground font-medium">
            Demo Data – Editable for Presentation
          </p>
        </div>
      )}

      {/* Info about pending changes - demo placeholder */}
      {myPendingChanges.length > 0 && (
        <Card className="border-2 border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Pending Changes ({myPendingChanges.length})
            </CardTitle>
            <CardDescription>
              Demo: No pending changes in this session
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Main Content */}
      <Tabs defaultValue="records" className="w-full">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="records" className="gap-2">
            <FileText className="w-4 h-4" />
            Records
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Bot className="w-4 h-4" />
            AI Chat
          </TabsTrigger>
          <TabsTrigger value="targets" className="gap-2">
            <Target className="w-4 h-4" />
            Goals
          </TabsTrigger>
          <TabsTrigger value="profile" className="gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="health" className="gap-2">
            <Heart className="w-4 h-4" />
            Health
          </TabsTrigger>
          <TabsTrigger value="medications" className="gap-2">
            <Pill className="w-4 h-4" />
            Meds
          </TabsTrigger>
          <TabsTrigger value="allergies" className="gap-2">
            <AlertTriangle className="w-4 h-4" />
            Allergies
          </TabsTrigger>
        </TabsList>

        {/* Enhanced Patient Records Tab */}
        <TabsContent value="records" className="space-y-4 mt-4">
          {/* Live medical updates from health officers (realtime) */}
          {isLiveUser && profileId && (
            <LiveMedicalUpdates profileId={profileId} />
          )}
          <EnhancedPatientRecords patientEmecId={adult.emecId} />
        </TabsContent>

        {/* AI Chat Tab */}
        <TabsContent value="ai" className="space-y-4 mt-4">
          <EmbeddedAIChat 
            title="AI Health Consultant"
            placeholder="Ask about diabetes, hypertension, cancer, HIV/AIDS, nutrition..."
            maxHeight="500px"
            context="Adult patient dashboard - focus on chronic diseases, preventive care, and detailed medical information"
          />
        </TabsContent>

        {/* Daily Targets Tab */}
        <TabsContent value="targets" className="space-y-4 mt-4">
          <DailyTargets />
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4 mt-4">
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">EMEC ID</p>
                  <p className="font-mono font-bold text-lg">{adult.emecId}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Age</p>
                  <p className="font-bold text-lg">{adult.age} years</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Blood Group</p>
                  <p className="font-bold text-lg text-destructive">{adult.bloodGroup}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Verification</p>
                  <p className="font-medium text-success">✓ Verified</p>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Phone className="w-4 h-4 text-destructive" />
                  Emergency Contact
                </h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Name</p>
                    <p className="font-medium">{adult.emergencyContact.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Relationship</p>
                    <p className="font-medium">{adult.emergencyContact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{adult.emergencyContact.phone}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Premium section disabled for demo focus */}
        </TabsContent>

        {/* Health Tab */}
        <TabsContent value="health" className="space-y-4 mt-4">
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Medical Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {adult.medicalConditions.length > 0 ? adult.medicalConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="text-base py-1 px-3">
                    {condition}
                  </Badge>
                )) : (
                  <p className="text-muted-foreground text-sm">No medical conditions recorded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Meal Plan */}
          {adult.mealPlan && (
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Utensils className="w-5 h-5" />
                  Meal Plan
                </CardTitle>
                <CardDescription>
                  Created by {adult.mealPlan.createdBy} • {adult.mealPlan.facilityName}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{adult.mealPlan.notes}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="space-y-4 mt-4">
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adult.medications.length > 0 ? adult.medications.map((med, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{med}</p>
                      <p className="text-sm text-muted-foreground">Prescribed medication</p>
                    </div>
                  </div>
                )) : (
                  <p className="text-muted-foreground text-sm">No medications prescribed yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allergies Tab */}
        <TabsContent value="allergies" className="space-y-4 mt-4">
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Known Allergies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                {adult.allergies.length > 0 ? adult.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="text-base py-1 px-3">
                    {allergy}
                  </Badge>
                )) : (
                  <p className="text-muted-foreground text-sm">No allergies recorded yet.</p>
                )}
              </div>
            </CardContent>
          </Card>

          <AllergyChecker userAllergies={adult.allergies} />
        </TabsContent>
      </Tabs>
    </div>
  );
}