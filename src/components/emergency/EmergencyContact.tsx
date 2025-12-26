import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Phone, MapPin, Clock, Shield, Ambulance, 
  AlertTriangle, CheckCircle2, Loader2, Navigation,
  HeartPulse, Droplets, Thermometer
} from 'lucide-react';
import { demoFacilities } from '@/data/healthFacilities';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { HealthFacility } from '@/types/emec';

interface EmergencyContactProps {
  userLocation?: { lat: number; lng: number };
  onFacilitySelect?: (facility: HealthFacility) => void;
}

const emergencyTypes = [
  { id: 'accident', label: 'Accident / Injury', icon: AlertTriangle },
  { id: 'breathing', label: 'Difficulty Breathing', icon: HeartPulse },
  { id: 'bleeding', label: 'Severe Bleeding', icon: Droplets },
  { id: 'fever', label: 'High Fever', icon: Thermometer },
  { id: 'other', label: 'Other Emergency', icon: AlertTriangle },
];

export function EmergencyContact({ userLocation, onFacilitySelect }: EmergencyContactProps) {
  const { currentUser, addAuditEntry, getChildUser } = useAuth();
  const child = getChildUser();
  const { toast } = useToast();
  
  const [selectedFacility, setSelectedFacility] = useState<HealthFacility | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [emergencyType, setEmergencyType] = useState<string>('');
  const [description, setDescription] = useState('');
  const [isContacting, setIsContacting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);
  const [liabilityAccepted, setLiabilityAccepted] = useState(false);

  // Demo user location (Mbita, Kenya)
  const demoLocation = userLocation || { lat: -0.4272, lng: 34.2061 };

  const handleSelectFacility = (facility: HealthFacility) => {
    setSelectedFacility(facility);
    setShowContactModal(true);
    onFacilitySelect?.(facility);
  };

  const handleContactFacility = async () => {
    if (!liabilityAccepted) {
      toast({
        title: "Liability Agreement Required",
        description: "Please acknowledge the liability notice to proceed.",
        variant: "destructive",
      });
      return;
    }

    setIsContacting(true);

    // Simulate contact process
    await new Promise((resolve) => setTimeout(resolve, 2500));

    addAuditEntry({
      userId: currentUser?.id || 'unknown',
      userName: currentUser?.name || 'Guest',
      userRole: currentUser?.role || 'child',
      action: 'EMERGENCY_CONTACT',
      target: selectedFacility?.name || 'Facility',
      details: `Emergency type: ${emergencyType}. Description: ${description}`,
    });

    setIsContacting(false);
    setContactSuccess(true);
  };

  const resetModal = () => {
    setShowContactModal(false);
    setEmergencyType('');
    setDescription('');
    setContactSuccess(false);
    setLiabilityAccepted(false);
  };

  return (
    <div className="space-y-4">
      {/* User Location Demo */}
      <Card className="border-0 shadow-elegant overflow-hidden">
        <div className="gradient-primary p-4 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Navigation className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Your Location</h3>
              <p className="text-sm text-white/80">
                Mbita, Homa Bay County ({demoLocation.lat.toFixed(4)}, {demoLocation.lng.toFixed(4)})
              </p>
            </div>
            <Badge className="ml-auto bg-white/20">Demo</Badge>
          </div>
        </div>
      </Card>

      {/* Nearby Facilities */}
      <Card className="border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Nearby Facilities
          </CardTitle>
          <CardDescription>
            Select a facility to contact for emergency assistance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {demoFacilities.map((facility, index) => (
            <div
              key={facility.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                selectedFacility?.id === facility.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}
              onClick={() => handleSelectFacility(facility)}
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  index === 0 ? 'bg-green-500' : 'bg-primary'
                } text-white`}>
                  {index === 0 ? <CheckCircle2 className="w-5 h-5" /> : <MapPin className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold truncate">{facility.name}</h4>
                    {facility.isVerified && (
                      <Badge variant="secondary" className="shrink-0">
                        <Shield className="w-3 h-3 mr-1" />
                        Verified
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground capitalize">{facility.type}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="flex items-center gap-1 text-primary font-medium">
                      <MapPin className="w-3 h-3" />
                      {facility.distance}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Phone className="w-3 h-3" />
                      {facility.phone}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Contact Modal */}
      <Dialog open={showContactModal} onOpenChange={resetModal}>
        <DialogContent className="sm:max-w-lg">
          {!contactSuccess ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Ambulance className="w-5 h-5 text-destructive" />
                  Contact {selectedFacility?.name}
                </DialogTitle>
                <DialogDescription>
                  Describe your emergency so the facility knows what to expect
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                {/* Emergency Type */}
                <div className="space-y-2">
                  <Label>Type of Emergency</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {emergencyTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <Button
                          key={type.id}
                          variant={emergencyType === type.id ? 'default' : 'outline'}
                          className="justify-start h-auto py-3"
                          onClick={() => setEmergencyType(type.id)}
                        >
                          <Icon className="w-4 h-4 mr-2" />
                          {type.label}
                        </Button>
                      );
                    })}
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Describe the Situation</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What happened? Any specific symptoms or conditions?"
                    rows={3}
                  />
                </div>

                {/* Patient Info */}
                {child && (
                  <div className="p-3 rounded-lg bg-muted/50">
                    <p className="text-sm font-medium mb-2">Patient Information:</p>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Name: <strong>{child.name}</strong></div>
                      <div>Age: <strong>{child.age} years</strong></div>
                      <div>Blood: <strong>{child.bloodGroup}</strong></div>
                      <div className="col-span-2">
                        Allergies: <strong className="text-destructive">{child.allergies.join(', ')}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* Liability Notice */}
                <Alert className="border-warning bg-warning/10">
                  <AlertTriangle className="w-4 h-4 text-warning" />
                  <AlertTitle>Liability Notice</AlertTitle>
                  <AlertDescription className="text-sm">
                    You are responsible for the accuracy of the information you provide. 
                    EMEC facilitates communication but is not liable for medical outcomes.
                  </AlertDescription>
                </Alert>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="liability" 
                    checked={liabilityAccepted}
                    onCheckedChange={(checked) => setLiabilityAccepted(checked as boolean)}
                  />
                  <Label htmlFor="liability" className="text-sm">
                    I understand and accept the liability terms
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={resetModal}>Cancel</Button>
                <Button 
                  onClick={handleContactFacility}
                  disabled={!emergencyType || !liabilityAccepted || isContacting}
                  className="bg-destructive hover:bg-destructive/90"
                >
                  {isContacting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Contacting...
                    </>
                  ) : (
                    <>
                      <Phone className="w-4 h-4 mr-2" />
                      Contact Facility
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-xl font-bold mb-2">Facility Contacted!</h3>
              <p className="text-muted-foreground mb-4">
                {selectedFacility?.name} has been notified and is preparing for your arrival.
              </p>
              <div className="p-4 rounded-lg bg-muted/50 mb-4">
                <p className="text-sm"><strong>Expected wait:</strong> 5-10 minutes</p>
                <p className="text-sm"><strong>Reference:</strong> EMEC-{Date.now().toString(36).toUpperCase()}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={resetModal} className="flex-1">
                  Close
                </Button>
                <a href={`tel:${selectedFacility?.emergencyPhone}`} className="flex-1">
                  <Button className="w-full bg-destructive hover:bg-destructive/90">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </Button>
                </a>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Demo Mode – No actual contact made
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
