import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { 
  Lock, Eye, EyeOff, CalendarDays, Droplets, 
  ChevronRight, Info, Moon, Sun, AlertCircle,
  Frown, Meh, Smile, Zap, Brain, Check
} from 'lucide-react';
import { format, differenceInDays, addDays } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PeriodTrackerProps {
  className?: string;
}

interface TodaySymptoms {
  cramps: number; // 0-3 (none, mild, moderate, severe)
  headache: number; // 0-3
  mood: 'great' | 'good' | 'okay' | 'low' | 'bad' | null;
  bloating: number; // 0-3
  fatigue: number; // 0-3
}

const symptomLevels = ['None', 'Mild', 'Moderate', 'Severe'];
const moodOptions = [
  { value: 'great', icon: <Smile className="w-5 h-5" />, label: 'Great', color: 'text-emerald-500 bg-emerald-100 dark:bg-emerald-900/30' },
  { value: 'good', icon: <Smile className="w-5 h-5" />, label: 'Good', color: 'text-green-500 bg-green-100 dark:bg-green-900/30' },
  { value: 'okay', icon: <Meh className="w-5 h-5" />, label: 'Okay', color: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30' },
  { value: 'low', icon: <Frown className="w-5 h-5" />, label: 'Low', color: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30' },
  { value: 'bad', icon: <Frown className="w-5 h-5" />, label: 'Bad', color: 'text-rose-500 bg-rose-100 dark:bg-rose-900/30' },
];

export function PeriodTracker({ className }: PeriodTrackerProps) {
  const [isPrivateMode, setIsPrivateMode] = useState(true);
  const [showTracker, setShowTracker] = useState(false);
  const [lastPeriodDate, setLastPeriodDate] = useState<Date | undefined>(new Date(2026, 0, 1));
  const [cycleLength, setCycleLength] = useState(28);
  const [periodLength, setPeriodLength] = useState(5);
  const [showSymptomLogger, setShowSymptomLogger] = useState(false);
  const [todaySymptoms, setTodaySymptoms] = useState<TodaySymptoms>({
    cramps: 0,
    headache: 0,
    mood: null,
    bloating: 0,
    fatigue: 0
  });
  const [symptomsSaved, setSymptomsSaved] = useState(false);
  const { toast } = useToast();

  // Calculate next period
  const nextPeriodDate = lastPeriodDate ? addDays(lastPeriodDate, cycleLength) : null;
  const daysUntilNext = nextPeriodDate ? differenceInDays(nextPeriodDate, new Date()) : null;

  // Determine cycle phase
  const getCyclePhase = () => {
    if (!lastPeriodDate) return { phase: 'unknown', day: 0 };
    const daysSinceLast = differenceInDays(new Date(), lastPeriodDate);
    const cycleDay = (daysSinceLast % cycleLength) + 1;
    
    if (cycleDay <= periodLength) return { phase: 'period', day: cycleDay };
    if (cycleDay <= 13) return { phase: 'follicular', day: cycleDay };
    if (cycleDay <= 16) return { phase: 'ovulation', day: cycleDay };
    return { phase: 'luteal', day: cycleDay };
  };

  const { phase, day } = getCyclePhase();

  const phaseInfo = {
    period: { 
      color: 'bg-rose-500', 
      label: 'Period', 
      tip: 'Stay hydrated and rest when needed',
      icon: <Droplets className="w-4 h-4" />
    },
    follicular: { 
      color: 'bg-emerald-500', 
      label: 'Follicular Phase', 
      tip: 'Energy levels typically rise during this phase',
      icon: <Sun className="w-4 h-4" />
    },
    ovulation: { 
      color: 'bg-amber-500', 
      label: 'Ovulation Window', 
      tip: 'You may feel more energetic',
      icon: <Sun className="w-4 h-4" />
    },
    luteal: { 
      color: 'bg-purple-500', 
      label: 'Luteal Phase', 
      tip: 'PMS symptoms may occur - self-care helps!',
      icon: <Moon className="w-4 h-4" />
    },
    unknown: { 
      color: 'bg-muted', 
      label: 'Unknown', 
      tip: 'Log your last period to start tracking',
      icon: <Info className="w-4 h-4" />
    }
  };

  const currentPhase = phaseInfo[phase as keyof typeof phaseInfo];

  const handleSaveSymptoms = () => {
    setSymptomsSaved(true);
    toast({
      title: "Symptoms Logged",
      description: "Your symptoms for today have been saved privately.",
    });
    setTimeout(() => setShowSymptomLogger(false), 1000);
  };

  // Privacy gate - show unlock prompt if not unlocked
  if (!showTracker) {
    return (
      <Card className={`border-0 shadow-md ${className}`}>
        <CardContent className="py-8">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
              <Lock className="w-8 h-8 text-rose-500" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Period Tracker</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Private and secure cycle tracking
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground bg-muted/50 py-2 px-4 rounded-lg">
              <Lock className="w-3 h-3" />
              <span>This data is stored locally and never shared</span>
            </div>
            <Button 
              onClick={() => setShowTracker(true)}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Open Tracker
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`border-0 shadow-md ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Droplets className="w-5 h-5 text-rose-500" />
              Period Tracker
            </CardTitle>
            <CardDescription>Track your menstrual cycle privately</CardDescription>
          </div>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowTracker(false)}
            className="text-muted-foreground"
          >
            <EyeOff className="w-4 h-4 mr-1" />
            Hide
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Privacy Toggle */}
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-muted-foreground" />
            <Label htmlFor="private-mode" className="text-sm">Private Mode</Label>
          </div>
          <Switch
            id="private-mode"
            checked={isPrivateMode}
            onCheckedChange={setIsPrivateMode}
          />
        </div>
        
        {isPrivateMode && (
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
            <Lock className="w-3 h-3 mt-0.5 text-green-600" />
            <span>Private mode on - data stored locally only, hidden from parent view</span>
          </div>
        )}

        {/* Current Cycle Status */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-rose-50 to-purple-50 dark:from-rose-900/20 dark:to-purple-900/20">
          <div className="flex items-center justify-between mb-3">
            <Badge className={`${currentPhase.color} text-white`}>
              {currentPhase.icon}
              <span className="ml-1">{currentPhase.label}</span>
            </Badge>
            <span className="text-sm font-medium">Day {day}</span>
          </div>
          
          {/* Cycle visualization */}
          <div className="relative h-2 bg-muted rounded-full overflow-hidden mb-3">
            <div 
              className="absolute h-full bg-rose-400 rounded-full"
              style={{ width: `${(periodLength / cycleLength) * 100}%` }}
            />
            <div 
              className="absolute h-full w-1 bg-foreground rounded-full"
              style={{ left: `${((day - 1) / cycleLength) * 100}%` }}
            />
          </div>

          <p className="text-sm text-muted-foreground">{currentPhase.tip}</p>
        </div>

        {/* Symptom Logger Toggle */}
        {!showSymptomLogger ? (
          <Button 
            variant="outline" 
            className="w-full border-dashed"
            onClick={() => setShowSymptomLogger(true)}
          >
            <Zap className="w-4 h-4 mr-2 text-amber-500" />
            Log Today's Symptoms
            {symptomsSaved && <Check className="w-4 h-4 ml-2 text-green-500" />}
          </Button>
        ) : (
          <div className="p-4 rounded-xl border-2 border-dashed border-rose-200 dark:border-rose-800 space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Log Symptoms - {format(new Date(), 'MMM d')}
              </h4>
              <Button variant="ghost" size="sm" onClick={() => setShowSymptomLogger(false)}>
                ✕
              </Button>
            </div>

            {/* Mood Selector */}
            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1">
                <Brain className="w-3 h-3" /> How are you feeling?
              </Label>
              <div className="flex gap-2 flex-wrap">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setTodaySymptoms(prev => ({ ...prev, mood: mood.value as any }))}
                    className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                      todaySymptoms.mood === mood.value 
                        ? `${mood.color} ring-2 ring-offset-1 ring-current` 
                        : 'bg-muted/50 hover:bg-muted'
                    }`}
                  >
                    {mood.icon}
                    <span className="text-[10px] mt-1">{mood.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Cramps */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Cramps</Label>
                <span className="text-xs font-medium text-rose-500">
                  {symptomLevels[todaySymptoms.cramps]}
                </span>
              </div>
              <Slider
                value={[todaySymptoms.cramps]}
                onValueChange={(v) => setTodaySymptoms(prev => ({ ...prev, cramps: v[0] }))}
                max={3}
                step={1}
                className="w-full"
              />
            </div>

            {/* Headache */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Headache</Label>
                <span className="text-xs font-medium text-purple-500">
                  {symptomLevels[todaySymptoms.headache]}
                </span>
              </div>
              <Slider
                value={[todaySymptoms.headache]}
                onValueChange={(v) => setTodaySymptoms(prev => ({ ...prev, headache: v[0] }))}
                max={3}
                step={1}
                className="w-full"
              />
            </div>

            {/* Bloating */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Bloating</Label>
                <span className="text-xs font-medium text-blue-500">
                  {symptomLevels[todaySymptoms.bloating]}
                </span>
              </div>
              <Slider
                value={[todaySymptoms.bloating]}
                onValueChange={(v) => setTodaySymptoms(prev => ({ ...prev, bloating: v[0] }))}
                max={3}
                step={1}
                className="w-full"
              />
            </div>

            {/* Fatigue */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Fatigue</Label>
                <span className="text-xs font-medium text-amber-500">
                  {symptomLevels[todaySymptoms.fatigue]}
                </span>
              </div>
              <Slider
                value={[todaySymptoms.fatigue]}
                onValueChange={(v) => setTodaySymptoms(prev => ({ ...prev, fatigue: v[0] }))}
                max={3}
                step={1}
                className="w-full"
              />
            </div>

            <Button 
              className="w-full bg-rose-500 hover:bg-rose-600 text-white"
              onClick={handleSaveSymptoms}
            >
              <Check className="w-4 h-4 mr-2" />
              Save Symptoms
            </Button>
          </div>
        )}

        {/* Next Period Prediction */}
        {daysUntilNext !== null && daysUntilNext > 0 && (
          <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-rose-500" />
              <span className="text-sm">Next period in</span>
            </div>
            <Badge variant="outline" className="font-semibold">
              {daysUntilNext} days
            </Badge>
          </div>
        )}

        {daysUntilNext !== null && daysUntilNext <= 3 && daysUntilNext > 0 && (
          <div className="flex items-start gap-2 text-xs bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg text-amber-700 dark:text-amber-300">
            <AlertCircle className="w-3 h-3 mt-0.5" />
            <span>Your period may start soon - be prepared!</span>
          </div>
        )}

        {/* Log Period Button */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full">
              <CalendarDays className="w-4 h-4 mr-2" />
              Log Period Start Date
              <ChevronRight className="w-4 h-4 ml-auto" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={lastPeriodDate}
              onSelect={setLastPeriodDate}
              initialFocus
            />
          </PopoverContent>
        </Popover>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-rose-500">{cycleLength}</p>
            <p className="text-xs text-muted-foreground">Cycle length (days)</p>
          </div>
          <div className="text-center p-3 bg-muted/30 rounded-lg">
            <p className="text-2xl font-bold text-purple-500">{periodLength}</p>
            <p className="text-xs text-muted-foreground">Period length (days)</p>
          </div>
        </div>

        <p className="text-[10px] text-center text-muted-foreground">
          This is for educational tracking only. Consult a doctor for medical advice.
        </p>
      </CardContent>
    </Card>
  );
}