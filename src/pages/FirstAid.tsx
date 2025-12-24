import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Flame, 
  Droplet, 
  Wind, 
  Heart, 
  Bone, 
  Zap,
  AlertCircle,
  ThermometerSun
} from "lucide-react";

const firstAidGuides = [
  {
    icon: Flame,
    title: "Burns",
    severity: "Common",
    steps: [
      "Cool the burn under cool running water for at least 10 minutes",
      "Remove jewelry or tight clothing near the burn",
      "Cover with a sterile, non-fluffy bandage",
      "Do NOT apply ice, butter, or toothpaste",
      "Seek medical help for severe burns",
    ],
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Droplet,
    title: "Bleeding",
    severity: "Urgent",
    steps: [
      "Apply direct pressure with a clean cloth",
      "Keep the injured area elevated if possible",
      "Maintain pressure for at least 10 minutes",
      "If bleeding continues, add more cloth without removing the first",
      "Call emergency services for severe bleeding",
    ],
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Wind,
    title: "Choking",
    severity: "Emergency",
    steps: [
      "Ask 'Are you choking?' If they can't speak, act fast",
      "Give 5 back blows between shoulder blades",
      "Give 5 abdominal thrusts (Heimlich maneuver)",
      "Repeat back blows and thrusts until object is dislodged",
      "Call emergency if person becomes unconscious",
    ],
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Heart,
    title: "CPR",
    severity: "Emergency",
    steps: [
      "Check responsiveness and call emergency services",
      "Place heel of hand on center of chest",
      "Push hard and fast - 100-120 compressions per minute",
      "Give 2 rescue breaths after every 30 compressions",
      "Continue until help arrives or person recovers",
    ],
    color: "from-pink-500 to-red-500",
  },
  {
    icon: Bone,
    title: "Fractures",
    severity: "Urgent",
    steps: [
      "Keep the injured area still and supported",
      "Apply ice wrapped in cloth to reduce swelling",
      "Do NOT try to realign the bone",
      "Immobilize the limb with a splint if trained",
      "Seek immediate medical attention",
    ],
    color: "from-gray-500 to-slate-600",
  },
  {
    icon: Zap,
    title: "Electric Shock",
    severity: "Emergency",
    steps: [
      "Do NOT touch the person until power is off",
      "Turn off the power source or use a non-conductive object",
      "Check for breathing and pulse",
      "Begin CPR if necessary",
      "Call emergency services immediately",
    ],
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: AlertCircle,
    title: "Allergic Reaction",
    severity: "Emergency",
    steps: [
      "Identify and remove the allergen if possible",
      "Help the person use their epinephrine auto-injector if available",
      "Call emergency services for severe reactions",
      "Keep the person calm and lying down",
      "Monitor breathing and be ready to perform CPR",
    ],
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: ThermometerSun,
    title: "Heat Stroke",
    severity: "Urgent",
    steps: [
      "Move the person to a cool, shaded area",
      "Remove excess clothing",
      "Cool them with water, ice packs, or wet cloths",
      "Fan the person while misting with water",
      "Call emergency services if temperature doesn't drop",
    ],
    color: "from-amber-500 to-orange-500",
  },
];

const FirstAid = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            First Aid Guide
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick reference for common emergency situations. Remember: Always call emergency services for serious injuries.
          </p>
        </div>

        {/* Emergency Reminder */}
        <Card variant="emergency" className="mb-8 animate-fade-in">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">In case of emergency</h3>
              <p className="text-muted-foreground">
                Always prioritize calling emergency services. These guides are for reference only.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {firstAidGuides.map((guide, index) => {
            const Icon = guide.icon;
            return (
              <Card 
                key={guide.title} 
                variant="elevated"
                className="animate-fade-in overflow-hidden"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${guide.color} flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-xl">{guide.title}</CardTitle>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      guide.severity === "Emergency" 
                        ? "bg-destructive/10 text-destructive" 
                        : guide.severity === "Urgent"
                        ? "bg-warning/10 text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {guide.severity}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2">
                    {guide.steps.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex gap-3 text-sm">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs font-medium text-secondary-foreground">
                          {stepIndex + 1}
                        </span>
                        <span className="text-muted-foreground pt-0.5">{step}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </PageLayout>
  );
};

export default FirstAid;
