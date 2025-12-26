import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Droplets, 
  Apple, 
  Dumbbell, 
  Moon, 
  Hand, 
  Heart,
  Brain,
  Sun
} from "lucide-react";

const healthTips = [
  {
    icon: Hand,
    title: "Hand Hygiene",
    description: "Wash your hands regularly with soap and water for at least 20 seconds to prevent the spread of germs and infections.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Apple,
    title: "Balanced Diet",
    description: "Eat a variety of fruits, vegetables, whole grains, and lean proteins. Limit processed foods and added sugars.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Dumbbell,
    title: "Regular Exercise",
    description: "Aim for at least 30 minutes of moderate physical activity daily. This improves cardiovascular health and mood.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Droplets,
    title: "Stay Hydrated",
    description: "Drink at least 8 glasses of clean water daily. Proper hydration supports all bodily functions.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Moon,
    title: "Quality Sleep",
    description: "Get 7-9 hours of sleep each night. Good sleep is essential for physical recovery and mental health.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Heart,
    title: "Heart Health",
    description: "Monitor your blood pressure and cholesterol. Regular check-ups help prevent cardiovascular diseases.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "Mental Wellness",
    description: "Practice stress management techniques like meditation, deep breathing, or mindfulness exercises.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Sun,
    title: "Vitamin D",
    description: "Get safe sun exposure for vitamin D production. It supports bone health and immune function.",
    color: "from-yellow-500 to-orange-500",
  },
];

const Education = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Health Education
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential health tips and practices for a healthier lifestyle
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {healthTips.map((tip, index) => {
            const Icon = tip.icon;
            return (
              <Card 
                key={tip.title} 
                variant="elevated"
                className="animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Facts */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: "400ms" }}>
          <Card variant="default" className="overflow-hidden">
            <div className="gradient-primary p-8 text-primary-foreground">
              <h2 className="text-2xl font-bold mb-2">Did You Know?</h2>
              <p className="opacity-90">
                Regular physical activity can reduce the risk of chronic diseases by up to 50%
              </p>
            </div>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">8+</div>
                  <p className="text-muted-foreground">Glasses of water daily</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">30</div>
                  <p className="text-muted-foreground">Minutes of exercise</p>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">7-9</div>
                  <p className="text-muted-foreground">Hours of sleep</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageLayout>
  );
};

export default Education;
