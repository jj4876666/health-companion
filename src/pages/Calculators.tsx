import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, Scale, Droplets, Heart, Activity, Flame, Target } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";

type BMICategory = {
  label: string;
  color: string;
  range: string;
  bgColor: string;
};

const bmiCategories: Record<string, BMICategory> = {
  underweight: { label: "Underweight", color: "text-blue-600", range: "< 18.5", bgColor: "bg-blue-500" },
  normal: { label: "Normal", color: "text-success", range: "18.5 - 24.9", bgColor: "bg-success" },
  overweight: { label: "Overweight", color: "text-warning", range: "25 - 29.9", bgColor: "bg-warning" },
  obese: { label: "Obese", color: "text-destructive", range: "≥ 30", bgColor: "bg-destructive" },
};

const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return "underweight";
  if (bmi < 25) return "normal";
  if (bmi < 30) return "overweight";
  return "obese";
};

const Calculators = () => {
  const { t } = useLanguage();
  
  // BMR State
  const [bmrData, setBmrData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "M",
  });
  const [bmrResult, setBmrResult] = useState<number | null>(null);

  // BMI State
  const [bmiData, setBmiData] = useState({
    weight: "",
    height: "",
  });
  const [bmiResult, setBmiResult] = useState<number | null>(null);

  // Hydration State
  const [hydrationData, setHydrationData] = useState({
    weight: "",
    activityLevel: "moderate",
    climate: "normal",
  });
  const [hydrationResult, setHydrationResult] = useState<number | null>(null);

  // Heart Rate State
  const [heartRateData, setHeartRateData] = useState({
    age: "",
    restingHR: "",
  });
  const [heartRateZones, setHeartRateZones] = useState<{ zone: string; min: number; max: number; description: string }[] | null>(null);

  const calculateBMR = () => {
    const w = parseFloat(bmrData.weight);
    const h = parseFloat(bmrData.height);
    const a = parseInt(bmrData.age);

    if (isNaN(w) || isNaN(h) || isNaN(a) || w <= 0 || h <= 0 || a <= 0) {
      toast.error("Please enter valid positive numbers for all fields");
      return;
    }

    let bmr: number;
    if (bmrData.gender === "M") {
      bmr = 88.36 + 13.4 * w + 4.8 * h - 5.7 * a;
    } else {
      bmr = 447.6 + 9.2 * w + 3.1 * h - 4.3 * a;
    }

    setBmrResult(Math.round(bmr * 100) / 100);
    toast.success("BMR calculated successfully!");
  };

  const calculateBMI = () => {
    const w = parseFloat(bmiData.weight);
    const h = parseFloat(bmiData.height);

    if (isNaN(w) || isNaN(h) || w <= 0 || h <= 0) {
      toast.error("Please enter valid positive numbers for weight and height");
      return;
    }

    const heightInMeters = h / 100;
    const bmi = w / (heightInMeters * heightInMeters);
    setBmiResult(Math.round(bmi * 10) / 10);
    toast.success("BMI calculated successfully!");
  };

  const calculateHydration = () => {
    const w = parseFloat(hydrationData.weight);

    if (isNaN(w) || w <= 0) {
      toast.error("Please enter a valid weight");
      return;
    }

    // Base: 30-35ml per kg of body weight
    const baseWater = w * 33;

    // Activity level multiplier
    const activityMultipliers: Record<string, number> = {
      sedentary: 0.9,
      light: 1.0,
      moderate: 1.1,
      active: 1.25,
      veryActive: 1.4,
    };

    // Climate multiplier
    const climateMultipliers: Record<string, number> = {
      cold: 0.9,
      normal: 1.0,
      hot: 1.2,
      veryHot: 1.4,
    };

    const result = baseWater * activityMultipliers[hydrationData.activityLevel] * climateMultipliers[hydrationData.climate];
    setHydrationResult(Math.round(result / 10) * 10); // Round to nearest 10ml
    toast.success("Hydration needs calculated!");
  };

  const calculateHeartRateZones = () => {
    const age = parseInt(heartRateData.age);
    const restingHR = parseInt(heartRateData.restingHR);

    if (isNaN(age) || age <= 0 || age > 120) {
      toast.error("Please enter a valid age (1-120)");
      return;
    }

    if (isNaN(restingHR) || restingHR < 40 || restingHR > 120) {
      toast.error("Please enter a valid resting heart rate (40-120 bpm)");
      return;
    }

    // Karvonen Formula: Max HR = 220 - age
    const maxHR = 220 - age;
    const heartRateReserve = maxHR - restingHR;

    const zones = [
      { zone: "Zone 1", min: Math.round(restingHR + heartRateReserve * 0.5), max: Math.round(restingHR + heartRateReserve * 0.6), description: "Recovery / Warm-up" },
      { zone: "Zone 2", min: Math.round(restingHR + heartRateReserve * 0.6), max: Math.round(restingHR + heartRateReserve * 0.7), description: "Fat Burning" },
      { zone: "Zone 3", min: Math.round(restingHR + heartRateReserve * 0.7), max: Math.round(restingHR + heartRateReserve * 0.8), description: "Aerobic / Cardio" },
      { zone: "Zone 4", min: Math.round(restingHR + heartRateReserve * 0.8), max: Math.round(restingHR + heartRateReserve * 0.9), description: "Anaerobic / Performance" },
      { zone: "Zone 5", min: Math.round(restingHR + heartRateReserve * 0.9), max: maxHR, description: "Maximum Effort" },
    ];

    setHeartRateZones(zones);
    toast.success("Heart rate zones calculated!");
  };

  const bmiCategory = bmiResult !== null ? getBMICategory(bmiResult) : null;
  const categoryInfo = bmiCategory ? bmiCategories[bmiCategory] : null;

  const getBMIPosition = (bmi: number): number => {
    if (bmi <= 15) return 0;
    if (bmi >= 40) return 100;
    return ((bmi - 15) / 25) * 100;
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center">
            <Calculator className="w-7 h-7 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t('nav.calculators')}</h1>
            <p className="text-muted-foreground">Calculate important health metrics</p>
          </div>
        </div>

        <Tabs defaultValue="bmi" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="bmi" className="flex flex-col gap-1 py-3">
              <Scale className="w-4 h-4" />
              <span className="text-xs">BMI</span>
            </TabsTrigger>
            <TabsTrigger value="bmr" className="flex flex-col gap-1 py-3">
              <Flame className="w-4 h-4" />
              <span className="text-xs">BMR</span>
            </TabsTrigger>
            <TabsTrigger value="hydration" className="flex flex-col gap-1 py-3">
              <Droplets className="w-4 h-4" />
              <span className="text-xs">Hydration</span>
            </TabsTrigger>
            <TabsTrigger value="heartrate" className="flex flex-col gap-1 py-3">
              <Heart className="w-4 h-4" />
              <span className="text-xs">HR Zones</span>
            </TabsTrigger>
          </TabsList>

          {/* BMI Calculator */}
          <TabsContent value="bmi">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <Scale className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{t('health.bmi')}</CardTitle>
                    <CardDescription>Body Mass Index - weight status indicator</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="bmi-weight">Weight (kg)</Label>
                    <Input
                      id="bmi-weight"
                      type="number"
                      placeholder="70"
                      value={bmiData.weight}
                      onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bmi-height">Height (cm)</Label>
                    <Input
                      id="bmi-height"
                      type="number"
                      placeholder="175"
                      value={bmiData.height}
                      onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={calculateBMI} className="w-full" size="lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate BMI
                </Button>

                {bmiResult !== null && categoryInfo && (
                  <div className="space-y-4 animate-scale-in">
                    <div className="p-6 rounded-xl bg-secondary text-center">
                      <p className="text-sm text-muted-foreground mb-1">Your Body Mass Index</p>
                      <p className="text-4xl font-bold text-primary">{bmiResult}</p>
                      <p className={cn("text-lg font-semibold mt-2", categoryInfo.color)}>{categoryInfo.label}</p>
                    </div>

                    <div className="space-y-3">
                      <div className="relative h-4 rounded-full overflow-hidden bg-muted">
                        <div className="absolute inset-0 flex">
                          <div className="flex-1 bg-blue-500" />
                          <div className="flex-1 bg-success" />
                          <div className="flex-1 bg-warning" />
                          <div className="flex-1 bg-destructive" />
                        </div>
                        <div 
                          className="absolute top-0 w-1 h-full bg-foreground shadow-lg transition-all duration-500"
                          style={{ left: `${getBMIPosition(bmiResult)}%`, transform: 'translateX(-50%)' }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>15</span>
                        <span>18.5</span>
                        <span>25</span>
                        <span>30</span>
                        <span>40</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(bmiCategories).map(([key, cat]) => (
                        <div 
                          key={key}
                          className={cn(
                            "flex items-center gap-2 p-2 rounded-lg transition-all",
                            bmiCategory === key ? "bg-secondary ring-2 ring-primary" : "bg-muted/50"
                          )}
                        >
                          <div className={cn("w-3 h-3 rounded-full", cat.bgColor)} />
                          <div className="text-xs">
                            <span className="font-medium text-foreground">{cat.label}</span>
                            <span className="text-muted-foreground ml-1">({cat.range})</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* BMR Calculator */}
          <TabsContent value="bmr">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                    <Flame className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{t('health.bmr')}</CardTitle>
                    <CardDescription>Basal Metabolic Rate - calories burned at rest</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      placeholder="70"
                      value={bmrData.weight}
                      onChange={(e) => setBmrData({ ...bmrData, weight: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      placeholder="175"
                      value={bmrData.height}
                      onChange={(e) => setBmrData({ ...bmrData, height: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="age">Age</Label>
                    <Input
                      id="age"
                      type="number"
                      placeholder="30"
                      value={bmrData.age}
                      onChange={(e) => setBmrData({ ...bmrData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Gender</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={bmrData.gender === "M" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setBmrData({ ...bmrData, gender: "M" })}
                      >
                        Male
                      </Button>
                      <Button
                        type="button"
                        variant={bmrData.gender === "F" ? "default" : "outline"}
                        className="flex-1"
                        onClick={() => setBmrData({ ...bmrData, gender: "F" })}
                      >
                        Female
                      </Button>
                    </div>
                  </div>
                </div>

                <Button onClick={calculateBMR} className="w-full" size="lg">
                  <Calculator className="w-5 h-5 mr-2" />
                  Calculate BMR
                </Button>

                {bmrResult !== null && (
                  <div className="p-6 rounded-xl bg-secondary text-center animate-scale-in">
                    <p className="text-sm text-muted-foreground mb-1">Your Basal Metabolic Rate</p>
                    <p className="text-4xl font-bold text-primary">{bmrResult}</p>
                    <p className="text-sm text-muted-foreground mt-1">kcal/day</p>
                    <div className="mt-4 grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-background">
                        <p className="font-semibold">{Math.round(bmrResult * 1.2)}</p>
                        <p className="text-muted-foreground">Sedentary</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background">
                        <p className="font-semibold">{Math.round(bmrResult * 1.55)}</p>
                        <p className="text-muted-foreground">Moderate</p>
                      </div>
                      <div className="p-2 rounded-lg bg-background">
                        <p className="font-semibold">{Math.round(bmrResult * 1.9)}</p>
                        <p className="text-muted-foreground">Very Active</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Hydration Calculator */}
          <TabsContent value="hydration">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Droplets className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{t('health.hydration')}</CardTitle>
                    <CardDescription>Calculate your daily water intake needs</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="hydration-weight">Weight (kg)</Label>
                  <Input
                    id="hydration-weight"
                    type="number"
                    placeholder="70"
                    value={hydrationData.weight}
                    onChange={(e) => setHydrationData({ ...hydrationData, weight: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Activity Level</Label>
                  <div className="grid grid-cols-5 gap-1">
                    {[
                      { value: 'sedentary', label: 'Low' },
                      { value: 'light', label: 'Light' },
                      { value: 'moderate', label: 'Medium' },
                      { value: 'active', label: 'High' },
                      { value: 'veryActive', label: 'Intense' },
                    ].map((level) => (
                      <Button
                        key={level.value}
                        type="button"
                        variant={hydrationData.activityLevel === level.value ? "default" : "outline"}
                        className="text-xs px-2"
                        onClick={() => setHydrationData({ ...hydrationData, activityLevel: level.value })}
                      >
                        {level.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Climate</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { value: 'cold', label: '❄️ Cold' },
                      { value: 'normal', label: '🌤️ Normal' },
                      { value: 'hot', label: '☀️ Hot' },
                      { value: 'veryHot', label: '🔥 Very Hot' },
                    ].map((climate) => (
                      <Button
                        key={climate.value}
                        type="button"
                        variant={hydrationData.climate === climate.value ? "default" : "outline"}
                        className="text-xs"
                        onClick={() => setHydrationData({ ...hydrationData, climate: climate.value })}
                      >
                        {climate.label}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={calculateHydration} className="w-full" size="lg">
                  <Droplets className="w-5 h-5 mr-2" />
                  Calculate Hydration
                </Button>

                {hydrationResult !== null && (
                  <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 text-center animate-scale-in">
                    <Droplets className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                    <p className="text-sm text-muted-foreground mb-1">Daily Water Intake</p>
                    <p className="text-4xl font-bold text-blue-600">{hydrationResult} ml</p>
                    <p className="text-lg text-muted-foreground mt-1">
                      ≈ {Math.round(hydrationResult / 250)} glasses
                    </p>
                    <div className="mt-4 flex justify-center gap-2">
                      {Array.from({ length: Math.min(8, Math.round(hydrationResult / 250)) }).map((_, i) => (
                        <div key={i} className="w-6 h-8 rounded bg-blue-500/30 flex items-end overflow-hidden">
                          <div className="w-full bg-blue-500 animate-pulse-soft" style={{ height: '100%' }} />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Heart Rate Zones */}
          <TabsContent value="heartrate">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-500 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <CardTitle>{t('health.heartRate')}</CardTitle>
                    <CardDescription>Calculate your training heart rate zones</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="hr-age">Age</Label>
                    <Input
                      id="hr-age"
                      type="number"
                      placeholder="30"
                      value={heartRateData.age}
                      onChange={(e) => setHeartRateData({ ...heartRateData, age: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="resting-hr">Resting Heart Rate (bpm)</Label>
                    <Input
                      id="resting-hr"
                      type="number"
                      placeholder="60"
                      value={heartRateData.restingHR}
                      onChange={(e) => setHeartRateData({ ...heartRateData, restingHR: e.target.value })}
                    />
                  </div>
                </div>

                <Button onClick={calculateHeartRateZones} className="w-full" size="lg">
                  <Heart className="w-5 h-5 mr-2" />
                  Calculate Zones
                </Button>

                {heartRateZones && (
                  <div className="space-y-3 animate-scale-in">
                    <div className="text-center mb-4">
                      <p className="text-sm text-muted-foreground">Max Heart Rate</p>
                      <p className="text-2xl font-bold text-destructive">{220 - parseInt(heartRateData.age)} bpm</p>
                    </div>
                    {heartRateZones.map((zone, index) => {
                      const colors = [
                        'from-gray-400 to-gray-500',
                        'from-blue-400 to-blue-500',
                        'from-green-400 to-green-500',
                        'from-orange-400 to-orange-500',
                        'from-red-400 to-red-500',
                      ];
                      return (
                        <div 
                          key={zone.zone}
                          className={cn(
                            "p-4 rounded-xl bg-gradient-to-r text-white",
                            colors[index]
                          )}
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-bold">{zone.zone}</p>
                              <p className="text-sm opacity-90">{zone.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold">{zone.min}-{zone.max}</p>
                              <p className="text-xs opacity-80">bpm</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Calculators;