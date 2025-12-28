import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Pill, Clock, CheckCircle, AlertTriangle, Bell, 
  Calendar, Info, X, Volume2
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface Medication {
  id: string;
  drugName: string;
  dosage: string;
  frequency: string;
  schedule: string[];
  prescribedBy: string;
  facilityName: string;
  startDate: string;
  endDate?: string;
  sideEffects: string[];
  warnings: string[];
  isActive: boolean;
  takenToday: boolean[];
}

export function MedicationReminders() {
  const { toast } = useToast();
  const [medications, setMedications] = useState<Medication[]>([
    {
      id: 'med-001',
      drugName: 'Amlodipine',
      dosage: '5mg',
      frequency: 'Once daily',
      schedule: ['08:00'],
      prescribedBy: 'Dr. Omondi Wekesa',
      facilityName: 'Mbita Sub-County Hospital',
      startDate: '2025-01-01',
      sideEffects: ['Dizziness', 'Swelling of ankles', 'Flushing'],
      warnings: ['Do not take with grapefruit'],
      isActive: true,
      takenToday: [true],
    },
    {
      id: 'med-002',
      drugName: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      schedule: ['08:00', '20:00'],
      prescribedBy: 'Dr. Omondi Wekesa',
      facilityName: 'Mbita Sub-County Hospital',
      startDate: '2025-01-15',
      sideEffects: ['Nausea', 'Stomach upset', 'Loss of appetite'],
      warnings: ['Take with food', 'Avoid alcohol'],
      isActive: true,
      takenToday: [true, false],
    },
    {
      id: 'med-003',
      drugName: 'Omeprazole',
      dosage: '20mg',
      frequency: 'Once daily (before breakfast)',
      schedule: ['07:30'],
      prescribedBy: 'Dr. Omondi Wekesa',
      facilityName: 'Mbita Sub-County Hospital',
      startDate: '2025-01-10',
      sideEffects: ['Headache', 'Diarrhea'],
      warnings: ['Take 30 minutes before eating'],
      isActive: true,
      takenToday: [false],
    },
  ]);
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const markAsTaken = (medId: string, scheduleIndex: number) => {
    setMedications((prev) =>
      prev.map((med) => {
        if (med.id === medId) {
          const newTakenToday = [...med.takenToday];
          newTakenToday[scheduleIndex] = true;
          return { ...med, takenToday: newTakenToday };
        }
        return med;
      })
    );
    toast({
      title: 'Medication Logged',
      description: 'Great job taking your medication on time!',
    });
  };

  const getTodayProgress = () => {
    const totalDoses = medications.reduce((acc, med) => acc + med.schedule.length, 0);
    const takenDoses = medications.reduce(
      (acc, med) => acc + med.takenToday.filter(Boolean).length,
      0
    );
    return (takenDoses / totalDoses) * 100;
  };

  const getNextDose = () => {
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    let nextMed: Medication | null = null;
    let nextTime = '23:59';
    let nextIndex = 0;

    medications.forEach((med) => {
      med.schedule.forEach((time, index) => {
        if (time > currentTime && time < nextTime && !med.takenToday[index]) {
          nextTime = time;
          nextMed = med;
          nextIndex = index;
        }
      });
    });

    return nextMed ? { medication: nextMed, time: nextTime, index: nextIndex } : null;
  };

  const nextDose = getNextDose();

  return (
    <div className="space-y-4">
      {/* Daily Progress */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-green-600" />
              <span className="font-medium">Today's Progress</span>
            </div>
            <Badge variant="outline" className="bg-white">
              {medications.reduce((acc, med) => acc + med.takenToday.filter(Boolean).length, 0)}/
              {medications.reduce((acc, med) => acc + med.schedule.length, 0)} doses
            </Badge>
          </div>
          <Progress value={getTodayProgress()} className="h-3" />
        </CardContent>
      </Card>

      {/* Next Dose Alert */}
      {nextDose && (
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-900/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center">
                <Bell className="w-6 h-6 text-amber-700 animate-pulse" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Next Dose</p>
                <p className="text-sm text-muted-foreground">
                  {nextDose.medication.drugName} {nextDose.medication.dosage} at {nextDose.time}
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => markAsTaken(nextDose.medication.id, nextDose.index)}
              >
                <CheckCircle className="w-4 h-4 mr-1" />
                Mark Taken
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reminders Toggle */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Medication Reminders</p>
                <p className="text-sm text-muted-foreground">Get notified when it's time</p>
              </div>
            </div>
            <Switch
              checked={remindersEnabled}
              onCheckedChange={setRemindersEnabled}
            />
          </div>
        </CardContent>
      </Card>

      {/* Medications List */}
      <Card>
        <CardHeader>
          <CardTitle>Current Medications</CardTitle>
          <CardDescription>Your active prescriptions and schedules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {medications.map((med) => (
            <div
              key={med.id}
              className="p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => {
                setSelectedMed(med);
                setShowDetails(true);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{med.drugName} {med.dosage}</h4>
                    <p className="text-sm text-muted-foreground">{med.frequency}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {med.schedule.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {med.warnings.length > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Warning
                    </Badge>
                  )}
                  <div className="flex gap-1">
                    {med.takenToday.map((taken, i) => (
                      <div
                        key={i}
                        className={`w-6 h-6 rounded-full flex items-center justify-center ${
                          taken ? 'bg-green-500 text-white' : 'bg-muted'
                        }`}
                      >
                        {taken ? <CheckCircle className="w-4 h-4" /> : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Medication Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="w-5 h-5" />
              {selectedMed?.drugName} {selectedMed?.dosage}
            </DialogTitle>
            <DialogDescription>{selectedMed?.frequency}</DialogDescription>
          </DialogHeader>
          {selectedMed && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Prescribed by</p>
                  <p className="font-medium">{selectedMed.prescribedBy}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Facility</p>
                  <p className="font-medium">{selectedMed.facilityName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Start Date</p>
                  <p className="font-medium">{selectedMed.startDate}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Schedule</p>
                  <p className="font-medium">{selectedMed.schedule.join(', ')}</p>
                </div>
              </div>

              {selectedMed.sideEffects.length > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Info className="w-4 h-4" />
                    <span className="font-medium text-sm">Possible Side Effects</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {selectedMed.sideEffects.map((effect, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {selectedMed.warnings.length > 0 && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    <span className="font-medium text-sm text-red-800 dark:text-red-200">
                      Important Warnings
                    </span>
                  </div>
                  <ul className="text-sm space-y-1 text-red-700 dark:text-red-300">
                    {selectedMed.warnings.map((warning, i) => (
                      <li key={i}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-2">
                {selectedMed.schedule.map((time, index) => (
                  <Button
                    key={index}
                    variant={selectedMed.takenToday[index] ? 'secondary' : 'default'}
                    className="flex-1"
                    disabled={selectedMed.takenToday[index]}
                    onClick={() => {
                      markAsTaken(selectedMed.id, index);
                      setShowDetails(false);
                    }}
                  >
                    {selectedMed.takenToday[index] ? (
                      <>
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Taken ({time})
                      </>
                    ) : (
                      <>
                        <Pill className="w-4 h-4 mr-1" />
                        Mark Taken ({time})
                      </>
                    )}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
