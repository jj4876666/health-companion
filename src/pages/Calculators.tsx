import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Scale, Droplets, Heart, Activity } from "lucide-react";
import { toast } from "sonner";

const Calculators = () => {
  const [bmrData, setBmrData] = useState({
    weight: "",
    height: "",
    age: "",
    gender: "M",
  });
  const [bmrResult, setBmrResult] = useState<number | null>(null);

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

  const otherCalculators = [
    {
      icon: Scale,
      title: "BMI Calculator",
      description: "Calculate your Body Mass Index",
      status: "Coming Soon",
    },
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* BMR Calculator */}
          <Card variant="elevated" className="animate-fade-in">
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

          {/* Other Calculators */}
          <div className="space-y-4">
            {otherCalculators.map((calc, index) => {
              const Icon = calc.icon;
              return (
                <Card 
                  key={calc.title} 
                  variant="default"
                  className="animate-fade-in"
                  style={{ animationDelay: `${(index + 1) * 100}ms` }}
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
      </div>
    </PageLayout>
  );
};

export default Calculators;
