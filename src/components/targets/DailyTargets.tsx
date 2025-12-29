import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Droplets, Footprints, Pill, Apple, Moon, 
  CheckCircle, Circle, Trophy, Sparkles, Bell
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DailyTarget {
  id: string;
  icon: typeof Droplets;
  label: string;
  labelSw: string;
  target: number;
  current: number;
  unit: string;
  unitSw: string;
  color: string;
  category: 'health' | 'medication';
}

const defaultTargets: DailyTarget[] = [
  {
    id: 'water',
    icon: Droplets,
    label: 'Drink Water',
    labelSw: 'Kunywa Maji',
    target: 8,
    current: 0,
    unit: 'glasses',
    unitSw: 'glasi',
    color: 'bg-blue-500',
    category: 'health',
  },
  {
    id: 'steps',
    icon: Footprints,
    label: 'Daily Steps',
    labelSw: 'Hatua za Siku',
    target: 5000,
    current: 0,
    unit: 'steps',
    unitSw: 'hatua',
    color: 'bg-green-500',
    category: 'health',
  },
  {
    id: 'fruits',
    icon: Apple,
    label: 'Eat Fruits',
    labelSw: 'Kula Matunda',
    target: 3,
    current: 0,
    unit: 'servings',
    unitSw: 'sehemu',
    color: 'bg-orange-500',
    category: 'health',
  },
  {
    id: 'sleep',
    icon: Moon,
    label: 'Sleep Hours',
    labelSw: 'Masaa ya Usingizi',
    target: 8,
    current: 0,
    unit: 'hours',
    unitSw: 'masaa',
    color: 'bg-purple-500',
    category: 'health',
  },
];

interface MedicationReminder {
  id: string;
  name: string;
  time: string;
  taken: boolean;
}

const demoMedications: MedicationReminder[] = [
  { id: 'med-1', name: 'Vitamin D', time: '08:00 AM', taken: false },
  { id: 'med-2', name: 'Iron Supplement', time: '12:00 PM', taken: false },
  { id: 'med-3', name: 'Multivitamin', time: '06:00 PM', taken: false },
];

export function DailyTargets() {
  const { currentUser } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [targets, setTargets] = useState<DailyTarget[]>(() => {
    const saved = localStorage.getItem('emec_daily_targets');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return defaultTargets.map(t => ({
          ...t,
          current: parsed[t.id] || 0
        }));
      } catch {
        return defaultTargets;
      }
    }
    return defaultTargets;
  });
  
  const [medications, setMedications] = useState<MedicationReminder[]>(() => {
    const saved = localStorage.getItem('emec_medication_status');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return demoMedications.map(m => ({
          ...m,
          taken: parsed[m.id] || false
        }));
      } catch {
        return demoMedications;
      }
    }
    return demoMedications;
  });

  // Save progress to localStorage
  useEffect(() => {
    const targetProgress = targets.reduce((acc, t) => ({ ...acc, [t.id]: t.current }), {});
    localStorage.setItem('emec_daily_targets', JSON.stringify(targetProgress));
  }, [targets]);

  useEffect(() => {
    const medStatus = medications.reduce((acc, m) => ({ ...acc, [m.id]: m.taken }), {});
    localStorage.setItem('emec_medication_status', JSON.stringify(medStatus));
  }, [medications]);

  const updateTarget = (id: string, increment: number) => {
    setTargets(prev => prev.map(t => {
      if (t.id === id) {
        const newValue = Math.max(0, Math.min(t.current + increment, t.target * 2));
        if (newValue >= t.target && t.current < t.target) {
          toast({
            title: "🎉 Target Achieved!",
            description: `You've completed your ${language === 'sw' ? t.labelSw : t.label} goal!`,
          });
        }
        return { ...t, current: newValue };
      }
      return t;
    }));
  };

  const toggleMedication = (id: string) => {
    setMedications(prev => prev.map(m => {
      if (m.id === id) {
        const newTaken = !m.taken;
        if (newTaken) {
          toast({
            title: "💊 Medication Taken",
            description: `${m.name} marked as taken at ${new Date().toLocaleTimeString()}`,
          });
        }
        return { ...m, taken: newTaken };
      }
      return m;
    }));
  };

  const completedTargets = targets.filter(t => t.current >= t.target).length;
  const completedMeds = medications.filter(m => m.taken).length;
  const overallProgress = Math.round(((completedTargets + completedMeds) / (targets.length + medications.length)) * 100);

  return (
    <div className="space-y-4">
      {/* Overall Progress */}
      <Card className="border-0 shadow-elegant overflow-hidden">
        <div className="gradient-primary p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                {language === 'sw' ? 'Malengo ya Leo' : 'Today\'s Goals'}
              </h3>
              <p className="text-white/80 text-sm">
                {completedTargets + completedMeds}/{targets.length + medications.length} {language === 'sw' ? 'imekamilika' : 'completed'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-6 h-6" />
              <span className="text-2xl font-bold">{overallProgress}%</span>
            </div>
          </div>
          <Progress value={overallProgress} className="h-2 mt-3 bg-white/20" />
        </div>
      </Card>

      {/* Health Targets */}
      <Card className="border-0 shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            {language === 'sw' ? 'Malengo ya Afya' : 'Health Targets'}
          </CardTitle>
          <CardDescription>
            {language === 'sw' ? 'Bonyeza + kuongeza maendeleo' : 'Tap + to log progress'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {targets.map(target => {
            const Icon = target.icon;
            const progress = Math.min((target.current / target.target) * 100, 100);
            const isComplete = target.current >= target.target;
            
            return (
              <div key={target.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${target.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {language === 'sw' ? target.labelSw : target.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {target.current}/{target.target} {language === 'sw' ? target.unitSw : target.unit}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isComplete && (
                      <Badge className="bg-success text-success-foreground">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {language === 'sw' ? 'Imekamilika' : 'Done'}
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateTarget(target.id, -1)}
                      className="w-8 h-8 p-0"
                    >
                      -
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => updateTarget(target.id, 1)}
                      className="w-8 h-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Medication Reminders */}
      <Card className="border-0 shadow-elegant">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Pill className="w-5 h-5 text-primary" />
            {language === 'sw' ? 'Vikumbusho vya Dawa' : 'Medication Reminders'}
          </CardTitle>
          <CardDescription>
            {language === 'sw' ? 'Bonyeza kuashiria kama umemeza' : 'Tap to mark as taken'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {medications.map(med => (
            <button
              key={med.id}
              onClick={() => toggleMedication(med.id)}
              className={`w-full p-3 rounded-xl flex items-center justify-between transition-all ${
                med.taken 
                  ? 'bg-success/10 border-2 border-success' 
                  : 'bg-muted/50 border-2 border-transparent hover:border-primary/50'
              }`}
            >
              <div className="flex items-center gap-3">
                {med.taken ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Circle className="w-5 h-5 text-muted-foreground" />
                )}
                <div className="text-left">
                  <p className={`font-medium ${med.taken ? 'line-through text-muted-foreground' : ''}`}>
                    {med.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {language === 'sw' ? 'Ratiba' : 'Scheduled'}: {med.time}
                  </p>
                </div>
              </div>
              <Badge variant={med.taken ? 'default' : 'secondary'} className={med.taken ? 'bg-success' : ''}>
                {med.taken 
                  ? (language === 'sw' ? 'Imemezwa' : 'Taken')
                  : (language === 'sw' ? 'Inasubiriwa' : 'Pending')
                }
              </Badge>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Parent Sync Notice */}
      {currentUser?.role === 'child' && (
        <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 flex items-center gap-3">
          <Bell className="w-5 h-5 text-primary" />
          <p className="text-sm text-muted-foreground">
            {language === 'sw' 
              ? 'Mzazi wako ataona maendeleo yako' 
              : 'Your parent will see your progress'}
          </p>
        </div>
      )}

      <p className="text-xs text-center text-muted-foreground">
        {language === 'sw' 
          ? 'Maendeleo yanawekwa ndani ya simu - Hali ya Demo' 
          : 'Progress saved locally – Demo Mode'}
      </p>
    </div>
  );
}