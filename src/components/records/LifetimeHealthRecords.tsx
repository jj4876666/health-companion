import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, Syringe, Pill, AlertTriangle, Activity, Heart, 
  Calendar, User, Building2, Clock, Download, Share2, 
  Stethoscope, TestTube, Thermometer, Eye, Bone, Brain,
  Shield, CheckCircle2, ChevronRight
} from 'lucide-react';

// Demo lifetime health records
const demoHealthRecords = {
  immunizations: [
    { id: '1', vaccine: 'BCG', date: '1995-03-15', facility: 'Kenyatta Hospital', batch: 'BCG-001', nextDose: null },
    { id: '2', vaccine: 'Polio (OPV)', date: '1995-05-20', facility: 'Kenyatta Hospital', batch: 'POL-102', nextDose: '1995-09-20' },
    { id: '3', vaccine: 'DPT-HepB-Hib', date: '1995-05-20', facility: 'Kenyatta Hospital', batch: 'DPT-203', nextDose: '1995-07-20' },
    { id: '4', vaccine: 'Measles', date: '1996-03-15', facility: 'Nairobi Health Center', batch: 'MEA-304', nextDose: null },
    { id: '5', vaccine: 'Yellow Fever', date: '2010-06-10', facility: 'KEMRI', batch: 'YF-2010-456', nextDose: '2020-06-10' },
    { id: '6', vaccine: 'COVID-19 (Pfizer)', date: '2021-08-15', facility: 'KICC Vaccination Center', batch: 'PFZ-2021-789', nextDose: '2021-09-05' },
    { id: '7', vaccine: 'COVID-19 Booster', date: '2022-02-20', facility: 'KICC Vaccination Center', batch: 'PFZ-2022-123', nextDose: null },
  ],
  labResults: [
    { id: '1', test: 'Complete Blood Count', date: '2024-01-15', facility: 'Nairobi Hospital Lab', status: 'Normal', doctor: 'Dr. Wanjiru' },
    { id: '2', test: 'Lipid Panel', date: '2024-01-15', facility: 'Nairobi Hospital Lab', status: 'Borderline High', doctor: 'Dr. Wanjiru' },
    { id: '3', test: 'HbA1c (Diabetes)', date: '2024-01-15', facility: 'Nairobi Hospital Lab', status: 'Pre-diabetic', doctor: 'Dr. Ochieng' },
    { id: '4', test: 'Thyroid Panel', date: '2023-06-20', facility: 'Aga Khan Lab', status: 'Normal', doctor: 'Dr. Patel' },
    { id: '5', test: 'Kidney Function', date: '2023-06-20', facility: 'Aga Khan Lab', status: 'Normal', doctor: 'Dr. Patel' },
  ],
  hospitalVisits: [
    { id: '1', reason: 'Annual Checkup', date: '2024-01-15', facility: 'Nairobi Hospital', doctor: 'Dr. Wanjiru', type: 'Outpatient' },
    { id: '2', reason: 'Malaria Treatment', date: '2023-04-10', facility: 'Kenyatta Hospital', doctor: 'Dr. Odhiambo', type: 'Outpatient' },
    { id: '3', reason: 'Appendectomy', date: '2019-08-22', facility: 'Aga Khan Hospital', doctor: 'Dr. Kamau', type: 'Surgery' },
    { id: '4', reason: 'Fracture Treatment', date: '2015-11-05', facility: 'Nairobi Hospital', doctor: 'Dr. Mwangi', type: 'Emergency' },
    { id: '5', reason: 'Typhoid Treatment', date: '2012-07-18', facility: 'Kenyatta Hospital', doctor: 'Dr. Otieno', type: 'Inpatient' },
  ],
  medications: [
    { id: '1', drug: 'Metformin 500mg', dosage: '1 tablet twice daily', startDate: '2024-01-20', endDate: null, prescribedBy: 'Dr. Ochieng', facility: 'Nairobi Hospital', isActive: true },
    { id: '2', drug: 'Atorvastatin 20mg', dosage: '1 tablet at bedtime', startDate: '2024-01-20', endDate: null, prescribedBy: 'Dr. Wanjiru', facility: 'Nairobi Hospital', isActive: true },
    { id: '3', drug: 'Coartem', dosage: '4 tablets twice daily', startDate: '2023-04-10', endDate: '2023-04-13', prescribedBy: 'Dr. Odhiambo', facility: 'Kenyatta Hospital', isActive: false },
    { id: '4', drug: 'Ciprofloxacin 500mg', dosage: '1 tablet twice daily', startDate: '2012-07-18', endDate: '2012-07-28', prescribedBy: 'Dr. Otieno', facility: 'Kenyatta Hospital', isActive: false },
  ],
  allergies: [
    { id: '1', allergen: 'Penicillin', type: 'Drug', severity: 'Severe', reactions: ['Anaphylaxis', 'Rash', 'Breathing difficulty'], dateRecorded: '2010-05-15' },
    { id: '2', allergen: 'Peanuts', type: 'Food', severity: 'Moderate', reactions: ['Hives', 'Swelling'], dateRecorded: '2005-09-20' },
    { id: '3', allergen: 'Dust Mites', type: 'Environmental', severity: 'Mild', reactions: ['Sneezing', 'Runny nose'], dateRecorded: '2015-03-10' },
  ],
  vitals: [
    { id: '1', date: '2024-01-15', bp: '125/82', pulse: 72, temp: '36.8°C', weight: '78kg', height: '175cm', bmi: 25.5, facility: 'Nairobi Hospital' },
    { id: '2', date: '2023-06-20', bp: '130/85', pulse: 75, temp: '37.0°C', weight: '80kg', height: '175cm', bmi: 26.1, facility: 'Aga Khan Hospital' },
    { id: '3', date: '2023-01-10', bp: '128/84', pulse: 70, temp: '36.6°C', weight: '79kg', height: '175cm', bmi: 25.8, facility: 'Nairobi Hospital' },
  ],
  surgeries: [
    { id: '1', procedure: 'Appendectomy', date: '2019-08-22', facility: 'Aga Khan Hospital', surgeon: 'Dr. Kamau', anesthesia: 'General', outcome: 'Successful', notes: 'Laparoscopic procedure, no complications' },
  ],
  chronicConditions: [
    { id: '1', condition: 'Pre-diabetes', diagnosedDate: '2024-01-15', status: 'Managing', managedBy: 'Dr. Ochieng' },
    { id: '2', condition: 'Hyperlipidemia', diagnosedDate: '2024-01-15', status: 'Under Treatment', managedBy: 'Dr. Wanjiru' },
  ],
};

export function LifetimeHealthRecords() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState('overview');

  const getStatusBadgeVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case 'normal': return 'default';
      case 'borderline high': case 'pre-diabetic': return 'secondary';
      case 'abnormal': case 'critical': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Lifetime Health Records
          </h2>
          <p className="text-muted-foreground">Complete medical history from birth to present</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Security Notice */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="py-3 flex items-center gap-3">
          <Shield className="w-5 h-5 text-primary" />
          <p className="text-sm">
            <span className="font-medium">Encrypted & HIPAA Compliant</span> — Your records are securely stored and only accessible with your consent
          </p>
          <CheckCircle2 className="w-4 h-4 text-green-500 ml-auto" />
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="overview" className="gap-1 text-xs">
            <Activity className="w-3 h-3" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="immunizations" className="gap-1 text-xs">
            <Syringe className="w-3 h-3" />
            Vaccines
          </TabsTrigger>
          <TabsTrigger value="labs" className="gap-1 text-xs">
            <TestTube className="w-3 h-3" />
            Labs
          </TabsTrigger>
          <TabsTrigger value="visits" className="gap-1 text-xs">
            <Building2 className="w-3 h-3" />
            Visits
          </TabsTrigger>
          <TabsTrigger value="medications" className="gap-1 text-xs">
            <Pill className="w-3 h-3" />
            Meds
          </TabsTrigger>
          <TabsTrigger value="allergies" className="gap-1 text-xs">
            <AlertTriangle className="w-3 h-3" />
            Allergies
          </TabsTrigger>
          <TabsTrigger value="vitals" className="gap-1 text-xs">
            <Heart className="w-3 h-3" />
            Vitals
          </TabsTrigger>
          <TabsTrigger value="surgeries" className="gap-1 text-xs">
            <Stethoscope className="w-3 h-3" />
            Surgeries
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="mt-4 space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('immunizations')}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                    <Syringe className="w-5 h-5 text-green-600" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mt-3">{demoHealthRecords.immunizations.length} Immunizations</h3>
                <p className="text-sm text-muted-foreground">Complete vaccination history</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('labs')}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                    <TestTube className="w-5 h-5 text-blue-600" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mt-3">{demoHealthRecords.labResults.length} Lab Results</h3>
                <p className="text-sm text-muted-foreground">Blood tests & diagnostics</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('visits')}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                    <Building2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mt-3">{demoHealthRecords.hospitalVisits.length} Hospital Visits</h3>
                <p className="text-sm text-muted-foreground">Consultations & admissions</p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedTab('allergies')}>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <h3 className="font-semibold mt-3">{demoHealthRecords.allergies.length} Allergies</h3>
                <p className="text-sm text-muted-foreground">Known allergies & reactions</p>
              </CardContent>
            </Card>
          </div>

          {/* Chronic Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Chronic Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {demoHealthRecords.chronicConditions.map((condition) => (
                  <div key={condition.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <div>
                      <p className="font-medium">{condition.condition}</p>
                      <p className="text-sm text-muted-foreground">Diagnosed: {condition.diagnosedDate}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{condition.status}</Badge>
                      <p className="text-xs text-muted-foreground mt-1">By {condition.managedBy}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest Vitals */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Latest Vitals
              </CardTitle>
              <CardDescription>Recorded on {demoHealthRecords.vitals[0].date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Blood Pressure</p>
                  <p className="font-bold text-lg">{demoHealthRecords.vitals[0].bp}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Pulse</p>
                  <p className="font-bold text-lg">{demoHealthRecords.vitals[0].pulse} bpm</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Temperature</p>
                  <p className="font-bold text-lg">{demoHealthRecords.vitals[0].temp}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Weight</p>
                  <p className="font-bold text-lg">{demoHealthRecords.vitals[0].weight}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">Height</p>
                  <p className="font-bold text-lg">{demoHealthRecords.vitals[0].height}</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-muted/50">
                  <p className="text-sm text-muted-foreground">BMI</p>
                  <p className="font-bold text-lg">{demoHealthRecords.vitals[0].bmi}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Immunizations Tab */}
        <TabsContent value="immunizations" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Syringe className="w-5 h-5 text-green-600" />
                Immunization History
              </CardTitle>
              <CardDescription>Complete vaccination record from birth</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {demoHealthRecords.immunizations.map((vaccine) => (
                    <div key={vaccine.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <Syringe className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{vaccine.vaccine}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {vaccine.date}
                          <span className="mx-1">•</span>
                          <Building2 className="w-3 h-3" />
                          {vaccine.facility}
                        </div>
                        <p className="text-xs text-muted-foreground">Batch: {vaccine.batch}</p>
                      </div>
                      {vaccine.nextDose && (
                        <Badge variant="outline" className="text-xs">
                          Next: {vaccine.nextDose}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Labs Tab */}
        <TabsContent value="labs" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="w-5 h-5 text-blue-600" />
                Laboratory Results
              </CardTitle>
              <CardDescription>Blood tests, imaging, and diagnostics</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {demoHealthRecords.labResults.map((lab) => (
                    <div key={lab.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <TestTube className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{lab.test}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {lab.date}
                          <span className="mx-1">•</span>
                          <Building2 className="w-3 h-3" />
                          {lab.facility}
                        </div>
                        <p className="text-xs text-muted-foreground">Ordered by: {lab.doctor}</p>
                      </div>
                      <Badge variant={getStatusBadgeVariant(lab.status)}>
                        {lab.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Hospital Visits Tab */}
        <TabsContent value="visits" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-purple-600" />
                Hospital Visits
              </CardTitle>
              <CardDescription>Consultations, admissions, and emergency visits</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {demoHealthRecords.hospitalVisits.map((visit) => (
                    <div key={visit.id} className="flex items-center gap-4 p-4 rounded-lg border">
                      <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{visit.reason}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          {visit.date}
                          <span className="mx-1">•</span>
                          {visit.facility}
                        </div>
                        <p className="text-xs text-muted-foreground">Attended by: {visit.doctor}</p>
                      </div>
                      <Badge variant={visit.type === 'Emergency' ? 'destructive' : visit.type === 'Surgery' ? 'secondary' : 'outline'}>
                        {visit.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Medications Tab */}
        <TabsContent value="medications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pill className="w-5 h-5 text-orange-600" />
                Medication History
              </CardTitle>
              <CardDescription>Current and past prescriptions</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {demoHealthRecords.medications.map((med) => (
                    <div key={med.id} className={`flex items-center gap-4 p-4 rounded-lg border ${med.isActive ? 'border-primary/30 bg-primary/5' : ''}`}>
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${med.isActive ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-muted'}`}>
                        <Pill className={`w-6 h-6 ${med.isActive ? 'text-orange-600' : 'text-muted-foreground'}`} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{med.drug}</p>
                        <p className="text-sm text-muted-foreground">{med.dosage}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {med.startDate} — {med.endDate || 'Ongoing'}
                          <span className="mx-1">•</span>
                          {med.facility}
                        </div>
                      </div>
                      <Badge variant={med.isActive ? 'default' : 'secondary'}>
                        {med.isActive ? 'Active' : 'Completed'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allergies Tab */}
        <TabsContent value="allergies" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Known Allergies
              </CardTitle>
              <CardDescription>Documented allergic reactions and sensitivities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoHealthRecords.allergies.map((allergy) => (
                  <div key={allergy.id} className="p-4 rounded-lg border border-destructive/30 bg-destructive/5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                        <p className="font-bold text-lg">{allergy.allergen}</p>
                      </div>
                      <Badge variant={allergy.severity === 'Severe' ? 'destructive' : allergy.severity === 'Moderate' ? 'secondary' : 'outline'}>
                        {allergy.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">Type: {allergy.type}</p>
                    <div className="flex flex-wrap gap-1">
                      {allergy.reactions.map((reaction, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{reaction}</Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">Recorded: {allergy.dateRecorded}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vitals Tab */}
        <TabsContent value="vitals" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600" />
                Vital Signs History
              </CardTitle>
              <CardDescription>Blood pressure, pulse, temperature, and measurements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoHealthRecords.vitals.map((vital) => (
                  <div key={vital.id} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="font-medium">{vital.date}</span>
                      </div>
                      <Badge variant="outline">{vital.facility}</Badge>
                    </div>
                    <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                      <div className="text-center p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">BP</p>
                        <p className="font-semibold">{vital.bp}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Pulse</p>
                        <p className="font-semibold">{vital.pulse}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Temp</p>
                        <p className="font-semibold">{vital.temp}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="font-semibold">{vital.weight}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">Height</p>
                        <p className="font-semibold">{vital.height}</p>
                      </div>
                      <div className="text-center p-2 rounded bg-muted/50">
                        <p className="text-xs text-muted-foreground">BMI</p>
                        <p className="font-semibold">{vital.bmi}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Surgeries Tab */}
        <TabsContent value="surgeries" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-teal-600" />
                Surgical History
              </CardTitle>
              <CardDescription>Past surgical procedures and operations</CardDescription>
            </CardHeader>
            <CardContent>
              {demoHealthRecords.surgeries.length > 0 ? (
                <div className="space-y-4">
                  {demoHealthRecords.surgeries.map((surgery) => (
                    <div key={surgery.id} className="p-4 rounded-lg border">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-lg">{surgery.procedure}</p>
                        <Badge variant="outline">{surgery.outcome}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Date</p>
                          <p className="font-medium">{surgery.date}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Facility</p>
                          <p className="font-medium">{surgery.facility}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Surgeon</p>
                          <p className="font-medium">{surgery.surgeon}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Anesthesia</p>
                          <p className="font-medium">{surgery.anesthesia}</p>
                        </div>
                      </div>
                      {surgery.notes && (
                        <p className="text-sm text-muted-foreground mt-3 p-2 bg-muted/50 rounded">{surgery.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">No surgical history recorded</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
