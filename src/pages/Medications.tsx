import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Pill, Clock, Calendar, Bell, Plus, Check, X, AlertTriangle,
  Trash2, Edit2, Repeat, Volume2, VolumeX, History
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: string;
  endDate?: string;
  instructions: string;
  remainingPills?: number;
  totalPills?: number;
  taken: { date: string; time: string; taken: boolean }[];
  notificationsEnabled: boolean;
}

const demoMedications: Medication[] = [
  {
    id: 'med-001',
    name: 'Metformin',
    dosage: '500mg',
    frequency: 'Twice daily',
    times: ['08:00', '20:00'],
    startDate: '2025-01-01',
    instructions: 'Take with meals',
    remainingPills: 45,
    totalPills: 60,
    taken: [
      { date: '2025-01-28', time: '08:00', taken: true },
      { date: '2025-01-28', time: '20:00', taken: false },
    ],
    notificationsEnabled: true,
  },
  {
    id: 'med-002',
    name: 'Lisinopril',
    dosage: '10mg',
    frequency: 'Once daily',
    times: ['09:00'],
    startDate: '2025-01-15',
    instructions: 'Take in the morning',
    remainingPills: 28,
    totalPills: 30,
    taken: [
      { date: '2025-01-28', time: '09:00', taken: true },
    ],
    notificationsEnabled: true,
  },
  {
    id: 'med-003',
    name: 'Vitamin D3',
    dosage: '1000 IU',
    frequency: 'Once daily',
    times: ['08:00'],
    startDate: '2025-01-01',
    instructions: 'Take with breakfast',
    remainingPills: 20,
    totalPills: 30,
    taken: [
      { date: '2025-01-28', time: '08:00', taken: true },
    ],
    notificationsEnabled: false,
  },
];

const demoHistory = [
  { date: '2025-01-27', medication: 'Metformin 500mg', time: '08:00', status: 'taken' },
  { date: '2025-01-27', medication: 'Metformin 500mg', time: '20:00', status: 'taken' },
  { date: '2025-01-27', medication: 'Lisinopril 10mg', time: '09:00', status: 'taken' },
  { date: '2025-01-26', medication: 'Metformin 500mg', time: '08:00', status: 'taken' },
  { date: '2025-01-26', medication: 'Metformin 500mg', time: '20:00', status: 'missed' },
  { date: '2025-01-26', medication: 'Lisinopril 10mg', time: '09:00', status: 'taken' },
];

export default function Medications() {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>(demoMedications);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMed, setNewMed] = useState({ name: '', dosage: '', frequency: 'Once daily', time: '08:00', instructions: '' });
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleTakeMedication = (medId: string, time: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === medId) {
        const updatedTaken = med.taken.map(t => 
          t.time === time ? { ...t, taken: true } : t
        );
        return { 
          ...med, 
          taken: updatedTaken,
          remainingPills: med.remainingPills ? med.remainingPills - 1 : undefined
        };
      }
      return med;
    }));
    toast({
      title: "✅ Medication Taken",
      description: `Recorded at ${new Date().toLocaleTimeString()}`,
    });
  };

  const handleAddMedication = () => {
    if (!newMed.name || !newMed.dosage) {
      toast({ title: "Error", description: "Please fill in medication name and dosage", variant: "destructive" });
      return;
    }
    
    const medication: Medication = {
      id: `med-${Date.now()}`,
      name: newMed.name,
      dosage: newMed.dosage,
      frequency: newMed.frequency,
      times: [newMed.time],
      startDate: new Date().toISOString().split('T')[0],
      instructions: newMed.instructions,
      taken: [],
      notificationsEnabled: true,
    };
    
    setMedications(prev => [...prev, medication]);
    setNewMed({ name: '', dosage: '', frequency: 'Once daily', time: '08:00', instructions: '' });
    setShowAddForm(false);
    toast({ title: "💊 Medication Added", description: `${medication.name} has been added to your schedule` });
  };

  const handleToggleNotification = (medId: string) => {
    setMedications(prev => prev.map(med => 
      med.id === medId ? { ...med, notificationsEnabled: !med.notificationsEnabled } : med
    ));
    toast({ title: "🔔 Notifications Updated", description: "Reminder settings changed" });
  };

  const handleDeleteMedication = (medId: string) => {
    setMedications(prev => prev.filter(med => med.id !== medId));
    toast({ title: "🗑️ Medication Removed", description: "Medication deleted from schedule" });
  };

  const upcomingDoses = medications.flatMap(med => 
    med.taken.filter(t => !t.taken).map(t => ({ ...med, doseTime: t.time }))
  ).sort((a, b) => a.doseTime.localeCompare(b.doseTime));

  const adherenceRate = Math.round(
    (demoHistory.filter(h => h.status === 'taken').length / demoHistory.length) * 100
  );

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-emec flex items-center justify-center">
              <Pill className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Medication Reminders</h1>
              <p className="text-muted-foreground">Track dosages and never miss a dose</p>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} className="gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Demo Badge */}
        <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
          Demo Mode – Notifications are simulated
        </Badge>

        {/* Adherence Stats */}
        <Card className="border-0 shadow-elegant overflow-hidden">
          <div className="gradient-emec p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/80 text-sm">Weekly Adherence</p>
                <p className="text-3xl font-bold">{adherenceRate}%</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-white/30 flex items-center justify-center">
                <Check className="w-8 h-8" />
              </div>
            </div>
            <Progress value={adherenceRate} className="h-2 mt-3 bg-white/20" />
          </div>
        </Card>

        {/* Add Medication Form */}
        {showAddForm && (
          <Card className="border-2 border-primary animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Add New Medication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <Input 
                  placeholder="Medication name" 
                  value={newMed.name}
                  onChange={(e) => setNewMed(prev => ({ ...prev, name: e.target.value }))}
                />
                <Input 
                  placeholder="Dosage (e.g., 500mg)" 
                  value={newMed.dosage}
                  onChange={(e) => setNewMed(prev => ({ ...prev, dosage: e.target.value }))}
                />
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={newMed.frequency}
                  onChange={(e) => setNewMed(prev => ({ ...prev, frequency: e.target.value }))}
                >
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
                <Input 
                  type="time" 
                  value={newMed.time}
                  onChange={(e) => setNewMed(prev => ({ ...prev, time: e.target.value }))}
                />
              </div>
              <Input 
                placeholder="Instructions (e.g., Take with food)" 
                value={newMed.instructions}
                onChange={(e) => setNewMed(prev => ({ ...prev, instructions: e.target.value }))}
              />
              <div className="flex gap-2">
                <Button onClick={handleAddMedication} className="flex-1">
                  <Check className="w-4 h-4 mr-2" />
                  Save Medication
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="today" className="gap-2">
              <Clock className="w-4 h-4" />
              Today
            </TabsTrigger>
            <TabsTrigger value="all" className="gap-2">
              <Pill className="w-4 h-4" />
              All Meds
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="w-4 h-4" />
              History
            </TabsTrigger>
          </TabsList>

          {/* Today's Schedule */}
          <TabsContent value="today" className="space-y-4">
            {upcomingDoses.length > 0 ? (
              upcomingDoses.map((dose) => (
                <Card key={`${dose.id}-${dose.doseTime}`} className="border-0 shadow-elegant">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Pill className="w-7 h-7 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{dose.name} {dose.dosage}</h3>
                        <p className="text-sm text-muted-foreground">{dose.instructions}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-muted-foreground" />
                          <span className="text-sm font-medium">{dose.doseTime}</span>
                          {dose.notificationsEnabled && (
                            <Badge variant="secondary" className="text-xs">
                              <Bell className="w-3 h-3 mr-1" />
                              Reminder on
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleTakeMedication(dose.id, dose.doseTime)}
                        className="bg-success hover:bg-success/90"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Take
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="border-0 shadow-elegant">
                <CardContent className="p-8 text-center">
                  <Check className="w-12 h-12 mx-auto text-success mb-4" />
                  <h3 className="font-semibold text-lg">All doses taken for today!</h3>
                  <p className="text-muted-foreground">Great job staying on track</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* All Medications */}
          <TabsContent value="all" className="space-y-4">
            {medications.map((med) => (
              <Card key={med.id} className="border-0 shadow-elegant">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <Pill className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold">{med.name} {med.dosage}</h3>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Repeat className="w-3 h-3" />
                            {med.frequency} at {med.times.join(', ')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleToggleNotification(med.id)}
                          >
                            {med.notificationsEnabled ? (
                              <Volume2 className="w-4 h-4 text-success" />
                            ) : (
                              <VolumeX className="w-4 h-4 text-muted-foreground" />
                            )}
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => handleDeleteMedication(med.id)}
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                      
                      {med.remainingPills !== undefined && med.totalPills && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Pills remaining</span>
                            <span className={med.remainingPills < 10 ? 'text-destructive font-medium' : ''}>
                              {med.remainingPills} / {med.totalPills}
                            </span>
                          </div>
                          <Progress 
                            value={(med.remainingPills / med.totalPills) * 100} 
                            className={`h-2 ${med.remainingPills < 10 ? '[&>div]:bg-destructive' : ''}`}
                          />
                          {med.remainingPills < 10 && (
                            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Low supply - refill soon
                            </p>
                          )}
                        </div>
                      )}
                      
                      {med.instructions && (
                        <p className="text-xs text-muted-foreground mt-2 p-2 bg-muted/50 rounded">
                          📝 {med.instructions}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* History */}
          <TabsContent value="history" className="space-y-4">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Medication History
                </CardTitle>
                <CardDescription>Track your adherence over time</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {demoHistory.map((entry, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-4 p-3 rounded-lg ${
                      entry.status === 'taken' ? 'bg-success/10' : 'bg-destructive/10'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      entry.status === 'taken' ? 'bg-success text-success-foreground' : 'bg-destructive text-destructive-foreground'
                    }`}>
                      {entry.status === 'taken' ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{entry.medication}</p>
                      <p className="text-sm text-muted-foreground">{entry.date} at {entry.time}</p>
                    </div>
                    <Badge variant={entry.status === 'taken' ? 'default' : 'destructive'}>
                      {entry.status === 'taken' ? 'Taken' : 'Missed'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
