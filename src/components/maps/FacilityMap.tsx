import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { demoFacilities } from '@/data/healthFacilities';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Phone, Navigation, Hospital, BadgeCheck, 
  AlertTriangle, Crosshair, Route
} from 'lucide-react';

interface FacilityMapProps {
  onSelectFacility?: (facilityId: string) => void;
}

export function FacilityMap({ onSelectFacility }: FacilityMapProps) {
  const { t } = useLanguage();
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [showDirections, setShowDirections] = useState(false);

  // Simulated user location (Mbita, Kenya)
  const userLocation = { lat: -0.4300, lng: 34.2100 };

  const handleSelectFacility = (facilityId: string) => {
    setSelectedFacility(facilityId);
    onSelectFacility?.(facilityId);
  };

  const selected = demoFacilities.find((f) => f.id === selectedFacility);

  return (
    <div className="space-y-4">
      {/* Simulated Map View */}
      <Card className="border-0 shadow-elegant overflow-hidden">
        <div className="relative h-64 md:h-80 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30">
          {/* Map Background Pattern */}
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full">
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>

          {/* User Location Marker */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse" />
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <Badge className="bg-blue-500 text-xs">Your Location</Badge>
              </div>
            </div>
          </div>

          {/* Facility Markers */}
          {demoFacilities.map((facility, index) => {
            const isSelected = selectedFacility === facility.id;
            // Simulated positions around user
            const positions = [
              { top: '30%', left: '60%' },
              { top: '40%', left: '25%' },
              { top: '70%', left: '70%' },
              { top: '20%', left: '40%' },
            ];
            const pos = positions[index] || positions[0];

            return (
              <button
                key={facility.id}
                onClick={() => handleSelectFacility(facility.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all ${
                  isSelected ? 'scale-125 z-10' : 'hover:scale-110'
                }`}
                style={{ top: pos.top, left: pos.left }}
              >
                <div className={`relative ${isSelected ? 'animate-bounce-soft' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg ${
                    isSelected ? 'bg-primary' : 'bg-red-500'
                  }`}>
                    <Hospital className="w-4 h-4 text-white" />
                  </div>
                  {isSelected && (
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                      <Badge variant="secondary" className="text-xs shadow-md">
                        {facility.distance}
                      </Badge>
                    </div>
                  )}
                </div>
              </button>
            );
          })}

          {/* Direction Line (simulated) */}
          {showDirections && selected && (
            <svg className="absolute inset-0 pointer-events-none">
              <line
                x1="50%"
                y1="50%"
                x2="60%"
                y2="30%"
                stroke="hsl(var(--primary))"
                strokeWidth="3"
                strokeDasharray="8,4"
                className="animate-pulse"
              />
            </svg>
          )}

          {/* GPS Coordinates */}
          <div className="absolute bottom-3 left-3 bg-card/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-xs font-mono">
            <Crosshair className="w-3 h-3 inline mr-1" />
            {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </div>

          {/* Map Controls */}
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            <Button size="icon" variant="secondary" className="w-8 h-8">
              <span className="text-lg font-bold">+</span>
            </Button>
            <Button size="icon" variant="secondary" className="w-8 h-8">
              <span className="text-lg font-bold">−</span>
            </Button>
          </div>
        </div>

        {/* Legend */}
        <CardContent className="p-3 bg-muted/50 flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span>You</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span>Health Facility</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>Selected</span>
          </div>
        </CardContent>
      </Card>

      {/* Selected Facility Details */}
      {selected && (
        <Card className="border-0 shadow-elegant animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                <Hospital className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{selected.name}</h3>
                  {selected.isVerified && (
                    <BadgeCheck className="w-4 h-4 text-success" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-mono">
                  License: {selected.licenseNumber}
                </p>
                <div className="flex items-center gap-4 mt-2 text-sm">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    {selected.distance}
                  </span>
                  <Badge variant="secondary" className="capitalize">
                    {selected.type}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button variant="outline" className="gap-2" asChild>
                <a href={`tel:${selected.phone}`}>
                  <Phone className="w-4 h-4" />
                  Call
                </a>
              </Button>
              <Button 
                className="gap-2"
                onClick={() => setShowDirections(!showDirections)}
              >
                <Navigation className="w-4 h-4" />
                Directions
              </Button>
            </div>

            <div className="mt-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-destructive" />
                <span>Emergency: </span>
                <a href={`tel:${selected.emergencyPhone}`} className="font-bold text-destructive">
                  {selected.emergencyPhone}
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Facility List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-muted-foreground px-1">
          {t('emergency.nearby')}
        </h3>
        {demoFacilities.map((facility) => (
          <button
            key={facility.id}
            onClick={() => handleSelectFacility(facility.id)}
            className={`w-full p-3 rounded-lg text-left transition-all ${
              selectedFacility === facility.id
                ? 'bg-primary/10 border-2 border-primary'
                : 'bg-card border border-border hover:border-primary/50'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                selectedFacility === facility.id ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                <Hospital className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{facility.name}</p>
                <p className="text-sm text-muted-foreground">{facility.distance}</p>
              </div>
              <Badge variant="outline" className="capitalize text-xs">
                {facility.type}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      <p className="text-xs text-center text-muted-foreground">
        Simulated GPS – Demo coordinates for Mbita, Kenya
      </p>
    </div>
  );
}
