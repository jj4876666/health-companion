import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Scale, Droplets, Heart, Activity } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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
  const [bmrData, setBmrData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "M",
  });
  const [bmrResult, setBmrResult] = useState<number | null>(null);

  const [bmiData, setBmiData] = useState({
    weight: "",
    height: "",
  });
  const [bmiResult, setBmiResult] = useState<number | null>(null);

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

  const otherCalculators = [
    {
      icon: Droplets,
      title: "Hydration Calculator",
      description: "Find your daily water intake needs",
      status: "Coming Soon",
    },
    {
      icon: Heart,
      title: "Heart Rate Zones",
      description: "Calculate your training heart rate zones",
      status: "Coming Soon",
    },
  ];

  const bmiCategory = bmiResult !== null ? getBMICategory(bmiResult) : null;
  const categoryInfo = bmiCategory ? bmiCategories[bmiCategory] : null;

  // Calculate position on the BMI scale (0-100%)
  const getBMIPosition = (bmi: number): number => {
    if (bmi <= 15) return 0;
    if (bmi >= 40) return 100;
    return ((bmi - 15) / 25) * 100;
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Health Calculators
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate important health metrics to understand your body better
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* BMI Calculator */}
          <Card variant="elevated" className="animate-fade-in">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                  <Scale className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>BMI Calculator</CardTitle>
                  <CardDescription>
                    Body Mass Index - weight status indicator
                  </CardDescription>
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
                    onChange={(e) =>
                      setBmiData({ ...bmiData, weight: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bmi-height">Height (cm)</Label>
                  <Input
                    id="bmi-height"
                    type="number"
                    placeholder="175"
                    value={bmiData.height}
                    onChange={(e) =>
                      setBmiData({ ...bmiData, height: e.target.value })
                    }
                  />
                </div>
              </div>

              <Button onClick={calculateBMI} variant="hero" className="w-full">
                <Calculator className="w-5 h-5" />
                Calculate BMI
              </Button>

              {bmiResult !== null && categoryInfo && (
                <div className="space-y-4 animate-scale-in">
                  <div className="p-6 rounded-xl bg-secondary text-center">
                    <p className="text-sm text-muted-foreground mb-1">
                      Your Body Mass Index
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {bmiResult}
                    </p>
                    <p className={cn("text-lg font-semibold mt-2", categoryInfo.color)}>
                      {categoryInfo.label}
                    </p>
                  </div>

                  {/* Visual BMI Scale */}
                  <div className="space-y-3">
                    <div className="relative h-4 rounded-full overflow-hidden bg-muted">
                      {/* Gradient scale */}
                      <div className="absolute inset-0 flex">
                        <div className="flex-1 bg-blue-500" />
                        <div className="flex-1 bg-success" />
                        <div className="flex-1 bg-warning" />
                        <div className="flex-1 bg-destructive" />
                      </div>
                      {/* Position indicator */}
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

                  {/* Category Legend */}
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

          {/* BMR Calculator */}
          <Card variant="elevated" className="animate-fade-in" style={{ animationDelay: "100ms" }}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
                  <Activity className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle>BMR Calculator</CardTitle>
                  <CardDescription>
                    Basal Metabolic Rate - calories burned at rest
                  </CardDescription>
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
                    onChange={(e) =>
                      setBmrData({ ...bmrData, weight: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="height">Height (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    placeholder="175"
                    value={bmrData.height}
                    onChange={(e) =>
                      setBmrData({ ...bmrData, height: e.target.value })
                    }
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
                    onChange={(e) =>
                      setBmrData({ ...bmrData, age: e.target.value })
                    }
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

              <Button onClick={calculateBMR} variant="hero" className="w-full">
                <Calculator className="w-5 h-5" />
                Calculate BMR
              </Button>

              {bmrResult !== null && (
                <div className="p-6 rounded-xl bg-secondary text-center animate-scale-in">
                  <p className="text-sm text-muted-foreground mb-1">
                    Your Basal Metabolic Rate
                  </p>
                  <p className="text-4xl font-bold text-primary">
                    {bmrResult}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    kcal/day
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Other Calculators */}
        <div className="grid sm:grid-cols-2 gap-4">
          {otherCalculators.map((calc, index) => {
            const Icon = calc.icon;
            return (
              <Card 
                key={calc.title} 
                variant="default"
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground">
                        {calc.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {calc.description}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-medium">
                      {calc.status}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default Calculators;
