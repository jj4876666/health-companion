import { useState } from 'react';
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/contexts/LanguageContext";
import { GoogleMapsDemo } from "@/components/maps/GoogleMapsDemo";
import { demoFacilities } from "@/data/healthFacilities";
import { 
  Phone, 
  Ambulance, 
  Shield, 
  Flame,
  Heart,
  AlertTriangle,
  MapPin,
  Clock,
  Navigation,
  Hospital,
  Building2,
  Stethoscope,
  PhoneCall,
  Delete,
  CheckCircle,
  Wifi,
  WifiOff,
  ExternalLink,
  Locate
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const emergencyContacts = [
  {
    icon: Ambulance,
    title: "Ambulance",
    number: "999",
    description: "Medical emergency response",
    color: "from-red-500 to-rose-500",
  },
  {
    icon: Shield,
    title: "Police",
    number: "999 / 112",
    description: "Law enforcement",
    color: "from-blue-500 to-indigo-500",
  },
  {
    icon: Flame,
    title: "Fire & Rescue",
    number: "999",
    description: "Fire department",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Heart,
    title: "Red Cross Kenya",
    number: "1199",
    description: "Emergency assistance",
    color: "from-red-600 to-red-700",
  },
];

const facilityIcons = {
  hospital: Hospital,
  clinic: Stethoscope,
  dispensary: Building2,
};

const Emergency = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [dialedNumber, setDialedNumber] = useState('');
  const [isOnline] = useState(true); // Simulated online status
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);

  const handleDial = (digit: string) => {
    if (dialedNumber.length < 15) {
      setDialedNumber(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    if (dialedNumber.length >= 3) {
      toast({
        title: "📞 Demo Call Initiated",
        description: `Calling ${dialedNumber}... (Simulated for demo)`,
      });
    } else {
      toast({
        title: "Enter a number",
        description: "Please enter at least 3 digits",
        variant: "destructive",
      });
    }
  };

  const handleQuickCall = (number: string, name: string) => {
    toast({
      title: `📞 Calling ${name}`,
      description: `Dialing ${number}... (Simulated for demo)`,
    });
  };

  const handleNavigate = (facilityName: string) => {
    toast({
      title: "🗺️ Opening Navigation",
      description: `Getting directions to ${facilityName}... (Simulated for demo)`,
    });
    setSelectedFacility(facilityName);
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-emergency flex items-center justify-center animate-pulse-soft">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{t('emergency.title')}</h1>
              <p className="text-muted-foreground">Quick access to emergency help</p>
            </div>
          </div>
          <Badge variant="outline" className={`gap-1 ${isOnline ? 'bg-success/10 text-success border-success/30' : 'bg-muted text-muted-foreground'}`}>
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            {isOnline ? 'Online' : 'Offline Mode'}
          </Badge>
        </div>

        {/* Main Emergency Card */}
        <Card className="overflow-hidden border-destructive/30">
          <div className="gradient-emergency p-6 md:p-8 text-center text-white">
            <Phone className="w-12 h-12 mx-auto mb-4 animate-bounce-soft" />
            <h2 className="text-3xl font-bold mb-2">Emergency: 999</h2>
            <p className="opacity-90 mb-4">
              Police, Ambulance, Fire & Rescue
            </p>
            <Button 
              size="lg" 
              className="bg-white text-destructive hover:bg-white/90 font-bold"
              onClick={() => handleQuickCall('999', 'Emergency Services')}
            >
              <PhoneCall className="w-5 h-5 mr-2" />
              Call 999 Now
            </Button>
          </div>
        </Card>

        <Tabs defaultValue="location" className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="location" className="flex flex-col gap-1 py-3">
              <Locate className="w-4 h-4" />
              <span className="text-xs">Location</span>
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex flex-col gap-1 py-3">
              <Phone className="w-4 h-4" />
              <span className="text-xs">Contacts</span>
            </TabsTrigger>
            <TabsTrigger value="facilities" className="flex flex-col gap-1 py-3">
              <MapPin className="w-4 h-4" />
              <span className="text-xs">Nearby</span>
            </TabsTrigger>
            <TabsTrigger value="dialpad" className="flex flex-col gap-1 py-3">
              <PhoneCall className="w-4 h-4" />
              <span className="text-xs">Dial Pad</span>
            </TabsTrigger>
          </TabsList>

          {/* Live Location Tab */}
          <TabsContent value="location" className="space-y-4">
            <GoogleMapsDemo 
              showFacilities={true} 
              isEmergency={true}
              onSelectFacility={(id) => setSelectedFacility(demoFacilities.find(f => f.id === id)?.name || null)} 
            />
          </TabsContent>

          {/* Emergency Contacts */}
          <TabsContent value="contacts" className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {emergencyContacts.map((contact) => {
                const Icon = contact.icon;
                return (
                  <Card 
                    key={contact.title}
                    className="border-0 shadow-elegant hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => handleQuickCall(contact.number, contact.title)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${contact.color} flex items-center justify-center`}>
                          <Icon className="w-7 h-7 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{contact.title}</h3>
                          <p className="text-2xl font-bold text-primary">{contact.number}</p>
                          <p className="text-xs text-muted-foreground">{contact.description}</p>
                        </div>
                        <PhoneCall className="w-5 h-5 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Tips */}
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  When Calling Emergency Services
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { icon: MapPin, text: "State your exact location or landmarks" },
                  { icon: AlertTriangle, text: "Describe the emergency clearly" },
                  { icon: Heart, text: "Stay calm and follow instructions" },
                ].map((tip, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <tip.icon className="w-5 h-5 text-primary" />
                    <span className="text-sm">{tip.text}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Nearby Facilities with Simulated Map */}
          <TabsContent value="facilities" className="space-y-4">
            {/* Simulated Map */}
            <Card className="border-0 shadow-elegant overflow-hidden">
              <div className="relative h-48 md:h-64 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30">
                {/* Simulated Map Grid */}
                <div className="absolute inset-0 opacity-20">
                  <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>
                </div>

                {/* Simulated Roads */}
                <div className="absolute inset-0">
                  <div className="absolute top-1/2 left-0 right-0 h-2 bg-gray-400/40 transform -translate-y-1/2" />
                  <div className="absolute top-0 bottom-0 left-1/3 w-2 bg-gray-400/40" />
                  <div className="absolute top-0 bottom-0 right-1/4 w-1 bg-gray-400/30" />
                </div>

                {/* User Location */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-pulse-soft">
                      <Navigation className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div className="absolute -inset-4 rounded-full border-2 border-primary/30 animate-ping" />
                  </div>
                </div>

                {/* Facility Markers */}
                {demoFacilities.slice(0, 3).map((facility, i) => {
                  const positions = [
                    { top: '25%', left: '30%' },
                    { top: '35%', right: '25%' },
                    { top: '70%', left: '45%' },
                  ];
                  const Icon = facilityIcons[facility.type];
                  const isSelected = selectedFacility === facility.name;
                  
                  return (
                    <div 
                      key={facility.id}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                      style={positions[i]}
                      onClick={() => handleNavigate(facility.name)}
                    >
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                        isSelected 
                          ? 'bg-destructive scale-125' 
                          : facility.type === 'hospital' 
                            ? 'bg-red-500' 
                            : 'bg-orange-500'
                      }`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {isSelected && (
                        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background px-2 py-1 rounded text-xs font-medium shadow-md">
                          {facility.name}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Map Legend */}
                <div className="absolute bottom-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 text-xs shadow-md">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-primary" />
                    <span>You</span>
                  </div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Hospital</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Clinic</span>
                  </div>
                </div>

                {/* Offline Badge */}
                <div className="absolute top-2 right-2">
                  <Badge className="bg-success/90 text-white border-0">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Demo Map
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Facilities List */}
            <div className="space-y-3">
              {demoFacilities.map((facility) => {
                const Icon = facilityIcons[facility.type];
                const isSelected = selectedFacility === facility.name;

                return (
                  <Card 
                    key={facility.id}
                    className={`border-0 shadow-elegant transition-all ${
                      isSelected ? 'ring-2 ring-primary' : ''
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          facility.type === 'hospital' 
                            ? 'bg-red-500' 
                            : facility.type === 'clinic'
                              ? 'bg-orange-500'
                              : 'bg-blue-500'
                        }`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-foreground">{facility.name}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs capitalize">
                                  {facility.type}
                                </Badge>
                                {facility.isVerified && (
                                  <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/30">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-primary">{facility.distance}</p>
                              <p className="text-xs text-muted-foreground">away</p>
                            </div>
                          </div>
                          
                          <div className="flex gap-2 mt-3">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => handleQuickCall(facility.emergencyPhone, facility.name)}
                            >
                              <Phone className="w-4 h-4 mr-1" />
                              Call
                            </Button>
                            <Button 
                              size="sm" 
                              className="flex-1"
                              onClick={() => handleNavigate(facility.name)}
                            >
                              <Navigation className="w-4 h-4 mr-1" />
                              Directions
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Emergency Dial Pad */}
          <TabsContent value="dialpad">
            <Card className="border-0 shadow-elegant">
              <CardContent className="p-6">
                {/* Display */}
                <div className="text-center mb-6">
                  <div className="h-16 flex items-center justify-center bg-muted rounded-xl mb-2">
                    <span className="text-3xl font-mono font-bold tracking-wider">
                      {dialedNumber || '---'}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Demo Mode – Calls are simulated
                  </p>
                </div>

                {/* Dial Pad */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((digit) => (
                    <Button
                      key={digit}
                      variant="outline"
                      className="h-16 text-2xl font-semibold hover:bg-primary hover:text-primary-foreground transition-all"
                      onClick={() => handleDial(digit)}
                    >
                      {digit}
                      {digit === '2' && <span className="block text-[10px] font-normal text-muted-foreground">ABC</span>}
                      {digit === '3' && <span className="block text-[10px] font-normal text-muted-foreground">DEF</span>}
                      {digit === '4' && <span className="block text-[10px] font-normal text-muted-foreground">GHI</span>}
                      {digit === '5' && <span className="block text-[10px] font-normal text-muted-foreground">JKL</span>}
                      {digit === '6' && <span className="block text-[10px] font-normal text-muted-foreground">MNO</span>}
                      {digit === '7' && <span className="block text-[10px] font-normal text-muted-foreground">PQRS</span>}
                      {digit === '8' && <span className="block text-[10px] font-normal text-muted-foreground">TUV</span>}
                      {digit === '9' && <span className="block text-[10px] font-normal text-muted-foreground">WXYZ</span>}
                    </Button>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 h-14"
                    onClick={handleDelete}
                    disabled={!dialedNumber}
                  >
                    <Delete className="w-6 h-6" />
                  </Button>
                  <Button
                    className="flex-[2] h-14 bg-success hover:bg-success/90"
                    onClick={handleCall}
                  >
                    <PhoneCall className="w-6 h-6 mr-2" />
                    Call
                  </Button>
                </div>

                {/* Quick Dial */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm font-medium mb-3">Quick Dial</p>
                  <div className="flex gap-2">
                    {[
                      { number: '999', label: 'Emergency' },
                      { number: '1199', label: 'Red Cross' },
                      { number: '112', label: 'Universal' },
                    ].map((quick) => (
                      <Button
                        key={quick.number}
                        variant="secondary"
                        className="flex-1 flex-col h-auto py-3"
                        onClick={() => {
                          setDialedNumber(quick.number);
                          handleQuickCall(quick.number, quick.label);
                        }}
                      >
                        <span className="font-bold">{quick.number}</span>
                        <span className="text-xs text-muted-foreground">{quick.label}</span>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Disclaimer */}
        <Card className="bg-muted/50 border-0">
          <CardContent className="p-4 text-center">
            <p className="text-xs text-muted-foreground">
              <strong>Demo Mode:</strong> All calls and navigation are simulated. 
              In a real emergency, dial your local emergency number.
              Kenya Emergency: 999 | Universal: 112
            </p>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Emergency;