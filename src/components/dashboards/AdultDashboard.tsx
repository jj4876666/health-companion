import { useState } from 'react';
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
import { 
  User, Heart, Shield, AlertTriangle, Activity, BookOpen, 
  Phone, FileText, Check, X, Clock, Pill, Utensils, CreditCard, Stethoscope, Target, Bot
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function AdultDashboard() {
  const { isDemoMode } = useDemo();
  const { currentUser, pendingChanges, approveChange, rejectChange, addAuditEntry } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  
  const adult = (currentUser as AdultUser) || demoAdult;
  const myPendingChanges = pendingChanges.filter(c => c.status === 'pending');

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

      {/* Demo Label */}
      <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 text-center">
        <p className="text-sm text-warning-foreground font-medium">
          Demo Data – Editable for Presentation
        </p>
      </div>

      {/* Pending Changes Alert */}
      {myPendingChanges.length > 0 && (
        <Card className="border-2 border-warning bg-warning/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Pending Changes ({myPendingChanges.length})
            </CardTitle>
            <CardDescription>
              A health officer has requested to update your records
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {myPendingChanges.map((change) => (
              <div key={change.id} className="p-4 rounded-lg bg-background border">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="w-4 h-4 text-primary" />
                      <span className="font-medium">{change.adminName}</span>
                      <Badge variant="outline" className="text-xs">{change.facilityName}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Requested on {new Date(change.createdAt).toLocaleDateString()}
                    </p>
                    <div className="p-3 rounded bg-muted/50">
                      <p className="text-sm font-medium">{change.fieldChanged}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-destructive line-through">{change.oldValue}</span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-sm text-success font-medium">{change.newValue}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button size="sm" onClick={() => approveChange(change.id)} className="gap-1">
                      <Check className="w-4 h-4" />
                      Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => rejectChange(change.id)} className="gap-1">
                      <X className="w-4 h-4" />
                      Reject
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
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
                {adult.medicalConditions.map((condition) => (
                  <Badge key={condition} variant="secondary" className="text-base py-1 px-3">
                    {condition}
                  </Badge>
                ))}
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
                {adult.medications.map((med, index) => (
                  <div key={index} className="p-3 rounded-lg bg-muted/50 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                      <Pill className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{med}</p>
                      <p className="text-sm text-muted-foreground">Prescribed medication</p>
                    </div>
                  </div>
                ))}
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
                {adult.allergies.map((allergy) => (
                  <Badge key={allergy} variant="destructive" className="text-base py-1 px-3">
                    {allergy}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <AllergyChecker userAllergies={adult.allergies} />
        </TabsContent>
      </Tabs>
    </div>
  );
}