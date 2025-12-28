import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, Navigation, Hospital, Stethoscope, Building2, 
  Phone, Clock, CheckCircle, Wifi, Locate, RefreshCw
} from 'lucide-react';
import { demoFacilities } from '@/data/healthFacilities';
import { useToast } from '@/hooks/use-toast';

interface LiveLocationMapProps {
  showFacilities?: boolean;
  onSelectFacility?: (facilityId: string) => void;
}

const facilityIcons = {
  hospital: Hospital,
  clinic: Stethoscope,
  dispensary: Building2,
};

// Simulated user location (Nairobi)
const userLocation = {
  lat: -1.2921,
  lng: 36.8219,
  accuracy: 15,
  address: "Kenyatta Avenue, Nairobi CBD",
  lastUpdated: new Date().toISOString(),
};

export function LiveLocationMap({ showFacilities = true, onSelectFacility }: LiveLocationMapProps) {
  const { toast } = useToast();
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationData, setLocationData] = useState(userLocation);

  const handleRefreshLocation = () => {
    setIsLocating(true);
    toast({ title: "📍 Updating Location", description: "Getting your current position..." });
    
    // Simulate GPS update
    setTimeout(() => {
      setLocationData(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        accuracy: Math.floor(Math.random() * 20) + 5,
      }));
      setIsLocating(false);
      toast({ title: "✅ Location Updated", description: "Your position has been refreshed" });
    }, 1500);
  };

  const handleSelectFacility = (facilityId: string) => {
    setSelectedFacility(facilityId);
    onSelectFacility?.(facilityId);
  };

  const handleNavigate = (facilityName: string) => {
    toast({
      title: "🗺️ Opening Navigation",
      description: `Getting directions to ${facilityName}...`,
    });
  };

  const selectedFacilityData = demoFacilities.find(f => f.id === selectedFacility);

  return (
    <div className="space-y-4">
      {/* Live Map */}
      <Card className="border-0 shadow-elegant overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Live Location
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleRefreshLocation}
              disabled={isLocating}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Simulated Map View */}
          <div className="relative h-64 md:h-80 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30">
            {/* Map Grid */}
            <div className="absolute inset-0 opacity-20">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#mapGrid)" />
              </svg>
            </div>

            {/* Simulated Roads */}
            <div className="absolute inset-0">
              <div className="absolute top-1/2 left-0 right-0 h-3 bg-gray-400/40 transform -translate-y-1/2" />
              <div className="absolute top-0 bottom-0 left-1/3 w-3 bg-gray-400/40" />
              <div className="absolute top-0 bottom-0 right-1/4 w-2 bg-gray-400/30" />
              <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400/30" />
            </div>

            {/* User Location Marker */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="relative">
                {/* Accuracy Circle */}
                <div 
                  className="absolute rounded-full border-2 border-primary/30 bg-primary/10 animate-pulse"
                  style={{
                    width: `${locationData.accuracy * 3}px`,
                    height: `${locationData.accuracy * 3}px`,
                    top: `${-locationData.accuracy * 1.5 + 16}px`,
                    left: `${-locationData.accuracy * 1.5 + 16}px`,
                  }}
                />
                {/* Main Marker */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg animate-pulse-soft relative z-10">
                  <Navigation className="w-4 h-4 text-primary-foreground" />
                </div>
                {/* Ping Effect */}
                <div className="absolute -inset-4 rounded-full border-2 border-primary/50 animate-ping" />
              </div>
            </div>

            {/* Facility Markers */}
            {showFacilities && demoFacilities.slice(0, 4).map((facility, i) => {
              const positions = [
                { top: '20%', left: '25%' },
                { top: '30%', right: '20%' },
                { top: '65%', left: '40%' },
                { top: '75%', right: '30%' },
              ];
              const Icon = facilityIcons[facility.type];
              const isSelected = selectedFacility === facility.id;
              
              return (
                <div 
                  key={facility.id}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                  style={positions[i]}
                  onClick={() => handleSelectFacility(facility.id)}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${
                    isSelected 
                      ? 'bg-destructive scale-125 ring-4 ring-destructive/30' 
                      : facility.type === 'hospital' 
                        ? 'bg-red-500 hover:scale-110' 
                        : 'bg-orange-500 hover:scale-110'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg border">
                      {facility.name}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Distance Lines to selected facility */}
            {selectedFacility && (
              <svg className="absolute inset-0 w-full h-full z-5">
                <line 
                  x1="50%" y1="50%" 
                  x2={selectedFacility === demoFacilities[0]?.id ? "25%" : "75%"} 
                  y2={selectedFacility === demoFacilities[0]?.id ? "20%" : "30%"}
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeDasharray="8,4"
                  className="animate-pulse"
                />
              </svg>
            )}

            {/* Location Info Overlay */}
            <div className="absolute bottom-2 left-2 right-2 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Locate className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{locationData.address}</p>
                  <p className="text-xs text-muted-foreground">
                    Accuracy: ±{locationData.accuracy}m • Updated: {new Date(locationData.lastUpdated).toLocaleTimeString()}
                  </p>
                </div>
                <Badge className="bg-success/90 text-white border-0 shrink-0">
                  <Wifi className="w-3 h-3 mr-1" />
                  Live
                </Badge>
              </div>
            </div>

            {/* Map Legend */}
            <div className="absolute top-2 left-2 bg-background/90 backdrop-blur-sm rounded-lg p-2 text-xs shadow-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
                <span>Your Location</span>
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

            {/* GPS Coordinates */}
            <div className="absolute top-2 right-2 bg-background/90 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-mono shadow-md">
              {locationData.lat.toFixed(4)}, {locationData.lng.toFixed(4)}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Facility Details */}
      {selectedFacilityData && (
        <Card className="border-2 border-primary animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                selectedFacilityData.type === 'hospital' 
                  ? 'bg-red-500' 
                  : 'bg-orange-500'
              }`}>
                {(() => {
                  const Icon = facilityIcons[selectedFacilityData.type];
                  return <Icon className="w-7 h-7 text-white" />;
                })()}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{selectedFacilityData.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="capitalize">
                    {selectedFacilityData.type}
                  </Badge>
                  {selectedFacilityData.isVerified && (
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                  <Badge className="bg-primary/10 text-primary">
                    {selectedFacilityData.distance}
                  </Badge>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => toast({ title: `📞 Calling ${selectedFacilityData.name}`, description: `Dialing ${selectedFacilityData.emergencyPhone}...` })}
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </Button>
                  <Button 
                    className="flex-1"
                    onClick={() => handleNavigate(selectedFacilityData.name)}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    Navigate
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Nearby Facilities List */}
      {showFacilities && (
        <Card className="border-0 shadow-elegant">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Hospital className="w-5 h-5" />
              Nearest Health Facilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {demoFacilities.slice(0, 4).map((facility) => {
              const Icon = facilityIcons[facility.type];
              const isSelected = selectedFacility === facility.id;
              
              return (
                <div 
                  key={facility.id}
                  className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-primary/10 ring-2 ring-primary' 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                  onClick={() => handleSelectFacility(facility.id)}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    facility.type === 'hospital' ? 'bg-red-500' : 'bg-orange-500'
                  }`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{facility.name}</p>
                    <p className="text-sm text-muted-foreground">{facility.distance} away</p>
                  </div>
                  {isSelected && (
                    <CheckCircle className="w-5 h-5 text-primary" />
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
