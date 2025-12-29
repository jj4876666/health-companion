import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, Navigation, Hospital, Stethoscope, Building2, 
  Phone, Clock, CheckCircle, Wifi, Locate, RefreshCw, Search,
  ZoomIn, ZoomOut, Layers, Car, PersonStanding, Route, X,
  AlertTriangle, ChevronUp, ChevronDown, Star, Clock3
} from 'lucide-react';
import { demoFacilities } from '@/data/healthFacilities';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface GoogleMapsDemoProps {
  showFacilities?: boolean;
  onSelectFacility?: (facilityId: string) => void;
  isEmergency?: boolean;
}

const facilityIcons = {
  hospital: Hospital,
  clinic: Stethoscope,
  dispensary: Building2,
};

// Simulated route points for navigation
const routePoints = [
  { lat: -1.2921, lng: 36.8219 }, // Start
  { lat: -1.2850, lng: 36.8250 },
  { lat: -1.2800, lng: 36.8200 },
  { lat: -1.2750, lng: 36.8150 }, // End
];

export function GoogleMapsDemo({ showFacilities = true, onSelectFacility, isEmergency = false }: GoogleMapsDemoProps) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [selectedFacility, setSelectedFacility] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(15);
  const [showNavigation, setShowNavigation] = useState(false);
  const [navigationStep, setNavigationStep] = useState(0);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking'>('driving');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [mapStyle, setMapStyle] = useState<'default' | 'satellite' | 'terrain'>('default');
  const [showDirectionsPanel, setShowDirectionsPanel] = useState(false);
  const navigationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [locationData, setLocationData] = useState({
    lat: -1.2921,
    lng: 36.8219,
    accuracy: 15,
    address: "Kenyatta Avenue, Nairobi CBD",
    lastUpdated: new Date().toISOString(),
  });

  // Simulated navigation progress
  useEffect(() => {
    if (showNavigation && selectedFacility) {
      navigationIntervalRef.current = setInterval(() => {
        setNavigationStep(prev => {
          if (prev >= routePoints.length - 1) {
            clearInterval(navigationIntervalRef.current!);
            toast({
              title: language === 'sw' ? "🎉 Umefika!" : "🎉 You've arrived!",
              description: language === 'sw' 
                ? "Umefika katika kituo cha afya"
                : "You have reached your destination",
            });
            setShowNavigation(false);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);

      return () => {
        if (navigationIntervalRef.current) {
          clearInterval(navigationIntervalRef.current);
        }
      };
    }
  }, [showNavigation, selectedFacility, language, toast]);

  const handleRefreshLocation = () => {
    setIsLocating(true);
    toast({ 
      title: "📍 " + (language === 'sw' ? "Inasasisha Mahali" : "Updating Location"), 
      description: language === 'sw' ? "Inapata nafasi yako ya sasa..." : "Getting your current position..." 
    });
    
    setTimeout(() => {
      setLocationData(prev => ({
        ...prev,
        lastUpdated: new Date().toISOString(),
        accuracy: Math.floor(Math.random() * 20) + 5,
      }));
      setIsLocating(false);
      toast({ 
        title: "✅ " + (language === 'sw' ? "Mahali Imesasishwa" : "Location Updated"), 
        description: language === 'sw' ? "Nafasi yako imesasishwa" : "Your position has been refreshed" 
      });
    }, 1500);
  };

  const handleSelectFacility = (facilityId: string) => {
    setSelectedFacility(facilityId);
    setShowNavigation(false);
    setNavigationStep(0);
    onSelectFacility?.(facilityId);
  };

  const startNavigation = () => {
    setShowNavigation(true);
    setNavigationStep(0);
    setShowDirectionsPanel(true);
    toast({
      title: "🗺️ " + (language === 'sw' ? "Uelekezaji Umeanza" : "Navigation Started"),
      description: language === 'sw' 
        ? `Inaelekeza kwa ${selectedFacilityData?.name}...`
        : `Navigating to ${selectedFacilityData?.name}...`,
    });
  };

  const stopNavigation = () => {
    setShowNavigation(false);
    setNavigationStep(0);
    setShowDirectionsPanel(false);
    if (navigationIntervalRef.current) {
      clearInterval(navigationIntervalRef.current);
    }
  };

  const handleEmergencyAlert = () => {
    toast({
      title: "🚨 " + (language === 'sw' ? "Arifa ya Dharura Imetumwa!" : "Emergency Alert Sent!"),
      description: language === 'sw' 
        ? "Kituo cha afya kilicho karibu kimearifu kuhusu hali yako ya dharura"
        : "Nearest health facility has been notified of your emergency",
      variant: "destructive",
    });
  };

  const selectedFacilityData = demoFacilities.find(f => f.id === selectedFacility);
  
  const filteredFacilities = searchQuery 
    ? demoFacilities.filter(f => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : demoFacilities;

  const getMapBackground = () => {
    switch (mapStyle) {
      case 'satellite':
        return 'bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900';
      case 'terrain':
        return 'bg-gradient-to-br from-amber-100 via-green-100 to-emerald-100 dark:from-amber-900/30 dark:via-green-900/30 dark:to-emerald-900/30';
      default:
        return 'bg-gradient-to-br from-green-100 via-blue-50 to-cyan-100 dark:from-green-900/30 dark:via-blue-900/20 dark:to-cyan-900/30';
    }
  };

  // Navigation directions
  const directions = [
    { instruction: language === 'sw' ? 'Anza Barabara ya Kenyatta' : 'Start on Kenyatta Avenue', distance: '0 m', icon: '🚗' },
    { instruction: language === 'sw' ? 'Geuka kushoto Barabara ya Kimathi' : 'Turn left onto Kimathi Street', distance: '200 m', icon: '↰' },
    { instruction: language === 'sw' ? 'Endelea moja kwa moja' : 'Continue straight', distance: '350 m', icon: '↑' },
    { instruction: language === 'sw' ? 'Mwisho upande wa kulia' : 'Destination on your right', distance: '500 m', icon: '🏥' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar - Google Maps Style */}
      <div className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder={language === 'sw' ? "Tafuta vituo vya afya..." : "Search health facilities..."}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(e.target.value.length > 0);
              }}
              className="pl-10 h-12 text-base shadow-lg rounded-full border-0"
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => {
                  setSearchQuery('');
                  setShowSearchResults(false);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
          <Button
            variant="secondary"
            size="icon"
            className="w-12 h-12 rounded-full shadow-lg"
            onClick={handleRefreshLocation}
            disabled={isLocating}
          >
            <Locate className={`w-5 h-5 ${isLocating ? 'animate-spin' : ''}`} />
          </Button>
        </div>

        {/* Search Results Dropdown */}
        {showSearchResults && filteredFacilities.length > 0 && (
          <Card className="absolute top-14 left-0 right-0 z-50 shadow-xl max-h-64 overflow-auto">
            <CardContent className="p-2">
              {filteredFacilities.map(facility => {
                const Icon = facilityIcons[facility.type];
                return (
                  <button
                    key={facility.id}
                    onClick={() => {
                      handleSelectFacility(facility.id);
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      facility.type === 'hospital' ? 'bg-red-500' : 'bg-orange-500'
                    }`}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{facility.name}</p>
                      <p className="text-xs text-muted-foreground">{facility.distance} away</p>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Map View */}
      <Card className="border-0 shadow-xl overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <div className={`relative h-[350px] md:h-[450px] ${getMapBackground()} transition-colors duration-300`}>
            {/* Map Grid/Roads */}
            <div className="absolute inset-0">
              {/* Main roads */}
              <div className="absolute top-1/2 left-0 right-0 h-4 bg-gray-400/50 transform -translate-y-1/2 shadow-sm" />
              <div className="absolute top-0 bottom-0 left-1/2 w-4 bg-gray-400/50 transform -translate-x-1/2 shadow-sm" />
              {/* Secondary roads */}
              <div className="absolute top-1/4 left-0 right-0 h-2 bg-gray-400/30" />
              <div className="absolute top-3/4 left-0 right-0 h-2 bg-gray-400/30" />
              <div className="absolute top-0 bottom-0 left-1/4 w-2 bg-gray-400/30" />
              <div className="absolute top-0 bottom-0 right-1/4 w-2 bg-gray-400/30" />
              
              {/* Building blocks simulation */}
              <div className="absolute top-[15%] left-[10%] w-16 h-12 bg-gray-300/40 rounded" />
              <div className="absolute top-[60%] left-[15%] w-20 h-14 bg-gray-300/40 rounded" />
              <div className="absolute top-[20%] right-[15%] w-14 h-10 bg-gray-300/40 rounded" />
              <div className="absolute bottom-[20%] right-[10%] w-18 h-12 bg-gray-300/40 rounded" />
            </div>

            {/* Navigation Route Line */}
            {showNavigation && selectedFacilityData && (
              <svg className="absolute inset-0 w-full h-full z-10" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" />
                    <stop offset="100%" stopColor="hsl(217, 91%, 60%)" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 50% 50% Q 45% 40%, 40% 35% Q 35% 30%, 30% 25%`}
                  stroke="url(#routeGradient)"
                  strokeWidth="6"
                  fill="none"
                  strokeLinecap="round"
                  className="animate-pulse"
                />
                <path
                  d={`M 50% 50% Q 45% 40%, 40% 35% Q 35% 30%, 30% 25%`}
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="8,8"
                  strokeLinecap="round"
                />
              </svg>
            )}

            {/* User Location Marker with Accuracy Circle */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
              style={{ 
                top: showNavigation ? `${50 - navigationStep * 8}%` : '50%',
                left: showNavigation ? `${50 - navigationStep * 5}%` : '50%',
                transition: 'all 1s ease-in-out'
              }}
            >
              <div className="relative">
                {/* Accuracy circle */}
                <div 
                  className="absolute rounded-full border-2 border-primary/30 bg-primary/10 animate-pulse"
                  style={{
                    width: `${Math.max(40, 80 / (zoomLevel / 15))}px`,
                    height: `${Math.max(40, 80 / (zoomLevel / 15))}px`,
                    top: `-${Math.max(20, 40 / (zoomLevel / 15)) - 16}px`,
                    left: `-${Math.max(20, 40 / (zoomLevel / 15)) - 16}px`,
                  }}
                />
                {/* Main location dot - Google Maps style blue dot */}
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg relative z-10 border-4 border-white">
                  {showNavigation ? (
                    <Navigation className="w-4 h-4 text-primary-foreground transform rotate-45" />
                  ) : (
                    <div className="w-3 h-3 rounded-full bg-primary-foreground" />
                  )}
                </div>
                {/* Ping effect */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/50 animate-ping" />
              </div>
            </div>

            {/* Facility Markers */}
            {showFacilities && filteredFacilities.slice(0, 5).map((facility, i) => {
              const positions = [
                { top: '25%', left: '30%' },
                { top: '35%', right: '25%' },
                { top: '60%', left: '35%' },
                { top: '70%', right: '35%' },
                { top: '45%', left: '70%' },
              ];
              const Icon = facilityIcons[facility.type];
              const isSelected = selectedFacility === facility.id;
              
              return (
                <div 
                  key={facility.id}
                  className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-10 group"
                  style={positions[i]}
                  onClick={() => handleSelectFacility(facility.id)}
                >
                  {/* Marker pin shape */}
                  <div className={`relative transition-all duration-200 ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-xl ${
                      isSelected 
                        ? 'bg-primary ring-4 ring-primary/30' 
                        : facility.type === 'hospital' 
                          ? 'bg-red-500' 
                          : 'bg-orange-500'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    {/* Pin tail */}
                    <div className={`absolute left-1/2 -translate-x-1/2 top-8 w-0 h-0 
                      border-l-[8px] border-r-[8px] border-t-[12px] 
                      border-l-transparent border-r-transparent ${
                        isSelected ? 'border-t-primary' : facility.type === 'hospital' ? 'border-t-red-500' : 'border-t-orange-500'
                      }`} 
                    />
                  </div>
                  
                  {/* Facility name popup */}
                  {isSelected && (
                    <div className="absolute -top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap bg-background px-3 py-2 rounded-lg text-xs font-medium shadow-xl border animate-fade-in">
                      <p className="font-semibold">{facility.name}</p>
                      <p className="text-muted-foreground">{facility.distance}</p>
                    </div>
                  )}
                </div>
              );
            })}

            {/* Map Controls - Right Side */}
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-30">
              <Button 
                size="icon" 
                variant="secondary" 
                className="w-10 h-10 rounded-lg shadow-lg"
                onClick={() => setZoomLevel(prev => Math.min(prev + 1, 20))}
              >
                <ZoomIn className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="w-10 h-10 rounded-lg shadow-lg"
                onClick={() => setZoomLevel(prev => Math.max(prev - 1, 10))}
              >
                <ZoomOut className="w-5 h-5" />
              </Button>
              <Button 
                size="icon" 
                variant="secondary" 
                className="w-10 h-10 rounded-lg shadow-lg"
                onClick={() => setMapStyle(prev => 
                  prev === 'default' ? 'satellite' : prev === 'satellite' ? 'terrain' : 'default'
                )}
              >
                <Layers className="w-5 h-5" />
              </Button>
            </div>

            {/* Location Info - Bottom */}
            <div className="absolute bottom-3 left-3 right-16 bg-background/95 backdrop-blur-sm rounded-xl p-3 shadow-xl z-20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{locationData.address}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>±{locationData.accuracy}m</span>
                    <span>•</span>
                    <span>{new Date(locationData.lastUpdated).toLocaleTimeString()}</span>
                  </div>
                </div>
                <Badge className="bg-success text-white border-0 shrink-0">
                  <Wifi className="w-3 h-3 mr-1" />
                  {language === 'sw' ? 'Hai' : 'Live'}
                </Badge>
              </div>
            </div>

            {/* Zoom Level Indicator */}
            <div className="absolute bottom-3 right-3 bg-background/80 backdrop-blur-sm rounded-lg px-2 py-1 text-xs font-mono shadow-md z-20">
              {language === 'sw' ? 'Kiwango' : 'Zoom'}: {zoomLevel}x
            </div>

            {/* Map Style Indicator */}
            <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-xs font-medium shadow-md z-20 capitalize">
              {mapStyle === 'default' ? (language === 'sw' ? 'Kawaida' : 'Default') : 
               mapStyle === 'satellite' ? (language === 'sw' ? 'Setilaiti' : 'Satellite') : 
               (language === 'sw' ? 'Ardhi' : 'Terrain')}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Alert Button */}
      {isEmergency && (
        <Button 
          variant="destructive" 
          className="w-full h-14 text-lg gap-3 animate-pulse"
          onClick={handleEmergencyAlert}
        >
          <AlertTriangle className="w-6 h-6" />
          {language === 'sw' ? 'TUMA ARIFA YA DHARURA' : 'SEND EMERGENCY ALERT'}
        </Button>
      )}

      {/* Directions Panel */}
      {showDirectionsPanel && selectedFacilityData && (
        <Card className="border-2 border-primary shadow-xl animate-fade-in">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Route className="w-5 h-5" />
                {language === 'sw' ? 'Maelekezo' : 'Directions'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setShowDirectionsPanel(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {directions.map((dir, i) => (
              <div 
                key={i}
                className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                  navigationStep === i 
                    ? 'bg-primary/10 border-2 border-primary' 
                    : navigationStep > i 
                    ? 'bg-success/10 border border-success/30' 
                    : 'bg-muted/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                  navigationStep === i ? 'bg-primary text-primary-foreground' : 'bg-muted'
                }`}>
                  {navigationStep > i ? <CheckCircle className="w-4 h-4 text-success" /> : dir.icon}
                </div>
                <div className="flex-1">
                  <p className={`text-sm ${navigationStep === i ? 'font-semibold' : ''}`}>
                    {dir.instruction}
                  </p>
                  <p className="text-xs text-muted-foreground">{dir.distance}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Selected Facility Details */}
      {selectedFacilityData && !showNavigation && (
        <Card className="border-2 border-primary shadow-xl animate-fade-in">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-lg ${
                selectedFacilityData.type === 'hospital' ? 'bg-red-500' : 'bg-orange-500'
              }`}>
                {(() => {
                  const Icon = facilityIcons[selectedFacilityData.type];
                  return <Icon className="w-7 h-7 text-white" />;
                })()}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg">{selectedFacilityData.name}</h3>
                  {selectedFacilityData.isVerified && (
                    <CheckCircle className="w-5 h-5 text-success" />
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <Badge variant="secondary" className="capitalize">
                    {selectedFacilityData.type}
                  </Badge>
                  <Badge className="bg-primary/10 text-primary border-0">
                    <MapPin className="w-3 h-3 mr-1" />
                    {selectedFacilityData.distance}
                  </Badge>
                  <Badge variant="outline">
                    <Star className="w-3 h-3 mr-1 text-yellow-500" />
                    4.5
                  </Badge>
                  <Badge variant="outline">
                    <Clock3 className="w-3 h-3 mr-1" />
                    {language === 'sw' ? 'Wazi' : 'Open'}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Travel Mode Selection */}
            <div className="flex gap-2 mt-4">
              <Button
                variant={travelMode === 'driving' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTravelMode('driving')}
                className="flex-1 gap-2"
              >
                <Car className="w-4 h-4" />
                {language === 'sw' ? '5 dak' : '5 min'}
              </Button>
              <Button
                variant={travelMode === 'walking' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setTravelMode('walking')}
                className="flex-1 gap-2"
              >
                <PersonStanding className="w-4 h-4" />
                {language === 'sw' ? '15 dak' : '15 min'}
              </Button>
            </div>
            
            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-2 mt-4">
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => toast({ 
                  title: `📞 ${language === 'sw' ? 'Inapiga' : 'Calling'} ${selectedFacilityData.name}`, 
                  description: `${language === 'sw' ? 'Inapiga' : 'Dialing'} ${selectedFacilityData.emergencyPhone}...` 
                })}
              >
                <Phone className="w-4 h-4" />
                {language === 'sw' ? 'Piga' : 'Call'}
              </Button>
              <Button 
                className="gap-2"
                onClick={startNavigation}
              >
                <Navigation className="w-4 h-4" />
                {language === 'sw' ? 'Anza' : 'Start'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation Active Card */}
      {showNavigation && selectedFacilityData && (
        <Card className="border-2 border-success shadow-xl animate-fade-in bg-success/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-success flex items-center justify-center animate-pulse">
                  <Navigation className="w-6 h-6 text-white transform rotate-45" />
                </div>
                <div>
                  <p className="font-semibold">{language === 'sw' ? 'Unaelekea' : 'Navigating to'}</p>
                  <p className="text-lg font-bold text-success">{selectedFacilityData.name}</p>
                </div>
              </div>
              <Badge className="bg-success text-white">
                <Clock className="w-3 h-3 mr-1" />
                {travelMode === 'driving' ? '5' : '15'} min
              </Badge>
            </div>
            
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background mb-3">
              <span className="text-2xl">{directions[navigationStep]?.icon}</span>
              <p className="font-medium">{directions[navigationStep]?.instruction}</p>
            </div>

            <Button 
              variant="destructive" 
              className="w-full gap-2"
              onClick={stopNavigation}
            >
              <X className="w-4 h-4" />
              {language === 'sw' ? 'Simamisha Uelekezaji' : 'Stop Navigation'}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Nearby Facilities List */}
      {showFacilities && !showNavigation && (
        <Card className="border-0 shadow-elegant">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Hospital className="w-5 h-5" />
              {language === 'sw' ? 'Vituo vya Afya Vilivyo Karibu' : 'Nearby Health Facilities'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {filteredFacilities.slice(0, 4).map((facility) => {
              const Icon = facilityIcons[facility.type];
              const isSelected = selectedFacility === facility.id;
              
              return (
                <button
                  key={facility.id}
                  className={`w-full flex items-center gap-4 p-3 rounded-xl transition-all ${
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
                  <div className="flex-1 min-w-0 text-left">
                    <p className="font-medium truncate">{facility.name}</p>
                    <p className="text-sm text-muted-foreground">{facility.distance}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      <Star className="w-3 h-3 mr-1 text-yellow-500" />
                      4.5
                    </Badge>
                    {isSelected && <CheckCircle className="w-5 h-5 text-primary" />}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>
      )}

      <p className="text-xs text-center text-muted-foreground">
        {language === 'sw' 
          ? '📍 GPS Iliyoigwa – Nairobi, Kenya (Hali ya Demo)' 
          : '📍 Simulated GPS – Nairobi, Kenya (Demo Mode)'}
      </p>
    </div>
  );
}
