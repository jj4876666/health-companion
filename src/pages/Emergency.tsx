import { useState } from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FacilityMap } from "@/components/maps/FacilityMap";
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Phone, 
  Ambulance, 
  Shield, 
  Flame,
  Heart,
  AlertTriangle,
  MapPin,
  Clock,
  Map,
  Keyboard,
  Navigation
} from "lucide-react";

const emergencyContacts = [
  {
    icon: Phone,
    title: "Emergency Services (Kenya)",
    number: "999",
    description: "National emergency line",
    color: "from-red-500 to-rose-500",
    primary: true,
  },
  {
    icon: Ambulance,
    title: "Ambulance (AMREF)",
    number: "0800 723 253",
    description: "Air and ground ambulance",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Police",
    number: "999 / 112",
    description: "Kenya Police Service",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Flame,
    title: "Fire Department",
    number: "999",
    description: "Fire and rescue services",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Heart,
    title: "Kenya Red Cross",
    number: "1199",
    description: "24/7 emergency response",
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
    description: "Be ready to provide your exact address or landmarks nearby.",
  },
  {
    icon: AlertTriangle,
    title: "Describe the Situation",
    description: "Explain what happened, how many people are involved, and their condition.",
  },
];

const Emergency = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [dialPadNumber, setDialPadNumber] = useState('');
  const { t } = useLanguage();

  const handleDialPadPress = (digit: string) => {
    if (dialPadNumber.length < 15) {
      setDialPadNumber(prev => prev + digit);
    }
  };

  const handleDialPadClear = () => {
    setDialPadNumber('');
  };

  const handleDialPadCall = () => {
    if (dialPadNumber) {
      // Simulate call - in real app would trigger actual call
      alert(`Simulating call to: ${dialPadNumber}\n\nThis is a demo - no actual call is made.`);
    }
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full gradient-emergency flex items-center justify-center animate-pulse-soft">
            <AlertTriangle className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Emergency Center
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Quick access to emergency contacts, nearby facilities, and emergency dial pad
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
            <TabsTrigger value="contacts" className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Contacts
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="w-4 h-4" />
              Facilities
            </TabsTrigger>
            <TabsTrigger value="dialpad" className="flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Dial Pad
            </TabsTrigger>
          </TabsList>

          {/* Emergency Contacts Tab */}
          <TabsContent value="contacts" className="space-y-6 animate-fade-in">
            {/* Main Emergency Contact */}
            <Card className="overflow-hidden border-destructive/30">
              <div className="gradient-emergency p-8 text-center text-primary-foreground">
                <Phone className="w-12 h-12 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Emergency: 999</h2>
                <p className="opacity-90 mb-6">
                  Call immediately for police, fire, or medical emergencies
                </p>
                <a href="tel:999">
                  <Button 
                    size="lg" 
                    className="bg-primary-foreground text-destructive hover:bg-primary-foreground/90"
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call 999 Now
                  </Button>
                </a>
              </div>
            </Card>

            {/* Other Emergency Contacts */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {emergencyContacts.slice(1).map((contact, index) => {
                const Icon = contact.icon;
                return (
                  <Card 
                    key={contact.title}
                    className="hover:shadow-lg transition-shadow animate-fade-in"
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
                        href={`tel:${contact.number.replace(/\s/g, '')}`}
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
                    <Card key={tip.title}>
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
          </TabsContent>

          {/* Facility Map Tab */}
          <TabsContent value="map" className="animate-fade-in">
            <Card className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-primary" />
                  Nearby Health Facilities
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Simulated GPS location showing verified health facilities near Mbita, Kenya
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <FacilityMap />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dial Pad Tab */}
          <TabsContent value="dialpad" className="animate-fade-in">
            <Card className="max-w-sm mx-auto">
              <CardHeader className="text-center pb-2">
                <CardTitle className="flex items-center justify-center gap-2">
                  <Keyboard className="w-5 h-5 text-primary" />
                  Offline Emergency Dial Pad
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Quick access dial pad for emergencies
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Display */}
                <div className="bg-muted rounded-xl p-4 text-center min-h-[60px] flex items-center justify-center">
                  <span className="text-3xl font-mono tracking-wider">
                    {dialPadNumber || 'Enter number'}
                  </span>
                </div>

                {/* Dial Pad Grid */}
                <div className="grid grid-cols-3 gap-3">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <Button
                      key={digit}
                      variant="outline"
                      size="lg"
                      className="h-16 text-2xl font-semibold hover:bg-primary hover:text-primary-foreground transition-colors"
                      onClick={() => handleDialPadPress(digit)}
                    >
                      {digit}
                    </Button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={handleDialPadClear}
                  >
                    Clear
                  </Button>
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={handleDialPadCall}
                    disabled={!dialPadNumber}
                  >
                    <Phone className="w-5 h-5 mr-2" />
                    Call
                  </Button>
                </div>

                {/* Quick Dial */}
                <div className="pt-4 border-t">
                  <p className="text-sm text-muted-foreground mb-3 text-center">Quick Dial</p>
                  <div className="flex gap-2 justify-center">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => setDialPadNumber('999')}
                    >
                      999
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialPadNumber('112')}
                    >
                      112
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDialPadNumber('1199')}
                    >
                      1199
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-muted-foreground text-center">
                  Demo mode - calls are simulated
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="mt-8 bg-muted/50 animate-fade-in">
          <CardContent className="p-6 text-center">
            <p className="text-sm text-muted-foreground">
              <strong>Demo Note:</strong> This is a demonstration version. Emergency numbers shown are for Kenya. 
              Always verify emergency numbers for your specific location. GPS location is simulated.
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Emergency;
