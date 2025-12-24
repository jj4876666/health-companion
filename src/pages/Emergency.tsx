import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Ambulance, 
  Shield, 
  Flame,
  Heart,
  AlertTriangle,
  MapPin,
  Clock
} from "lucide-react";

const emergencyContacts = [
  {
    icon: Phone,
    title: "Emergency Services",
    number: "911",
    description: "For all emergencies - police, fire, medical",
    color: "gradient-emergency",
    primary: true,
  },
  {
    icon: Ambulance,
    title: "Medical Emergency",
    number: "911",
    description: "Ambulance and paramedic services",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Police",
    number: "911",
    description: "Law enforcement emergency line",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Flame,
    title: "Fire Department",
    number: "911",
    description: "Fire and rescue services",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Heart,
    title: "Poison Control",
    number: "1-800-222-1222",
    description: "24/7 poison emergency hotline",
    color: "from-purple-500 to-violet-500",
  },
];

const emergencyTips = [
  {
    icon: Clock,
    title: "Stay Calm",
    description: "Take deep breaths and speak clearly when calling emergency services.",
  },
  {
    icon: MapPin,
    title: "Know Your Location",
    description: "Be ready to provide your exact address or landmarks.",
  },
  {
    icon: AlertTriangle,
    title: "Describe the Situation",
    description: "Explain what happened, how many people are involved, and their condition.",
  },
];

const Emergency = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-emergency flex items-center justify-center animate-pulse-soft">
            <AlertTriangle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Emergency Contacts
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to important emergency numbers. Save these contacts and share with your family.
          </p>
        </div>

        {/* Main Emergency Contact */}
        <Card 
          className="mb-8 overflow-hidden animate-fade-in border-destructive/30"
        >
          <div className="gradient-emergency p-8 text-center text-primary-foreground">
            <Phone className="w-12 h-12 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-2">Emergency: 911</h2>
            <p className="opacity-90 mb-6">
              Call immediately for police, fire, or medical emergencies
            </p>
            <a href="tel:911">
              <Button 
                size="lg" 
                className="bg-primary-foreground text-destructive hover:bg-primary-foreground/90"
              >
                <Phone className="w-5 h-5" />
                Call 911 Now
              </Button>
            </a>
          </div>
        </Card>

        {/* Other Emergency Contacts */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {emergencyContacts.slice(1).map((contact, index) => {
            const Icon = contact.icon;
            return (
              <Card 
                key={contact.title}
                variant="interactive"
                className="animate-fade-in"
                style={{ animationDelay: `${(index + 1) * 100}ms` }}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-1">
                    {contact.title}
                  </h3>
                  <a 
                    href={`tel:${contact.number.replace(/-/g, '')}`}
                    className="text-2xl font-bold text-primary hover:underline"
                  >
                    {contact.number}
                  </a>
                  <p className="text-sm text-muted-foreground mt-2">
                    {contact.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Emergency Tips */}
        <div className="animate-fade-in" style={{ animationDelay: "500ms" }}>
          <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
            When Calling Emergency Services
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {emergencyTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card key={tip.title} variant="default">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 mx-auto rounded-xl bg-secondary flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-secondary-foreground" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {tip.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Disclaimer */}
        <Card variant="flat" className="mt-12 bg-muted/50 animate-fade-in" style={{ animationDelay: "600ms" }}>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> Emergency numbers may vary by country and region. 
              Please verify the correct emergency numbers for your location.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Emergency;
