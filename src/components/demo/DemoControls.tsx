import { useState } from 'react';
import { useDemo, AgeCategory } from '@/contexts/DemoContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings2, Baby, PersonStanding, User, Users, Wifi, WifiOff, 
  Eye, Sparkles, AlertCircle 
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

const ageCategories: { value: AgeCategory; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    value: '0-5', 
    label: '0-5 Years', 
    icon: <Baby className="w-5 h-5" />, 
    description: 'Visual, icons, sounds' 
  },
  { 
    value: '6-12', 
    label: '6-12 Years', 
    icon: <PersonStanding className="w-5 h-5" />, 
    description: 'Games, hygiene, nutrition' 
  },
  { 
    value: '13-17', 
    label: '13-17 Years', 
    icon: <User className="w-5 h-5" />, 
    description: 'Puberty, mental health' 
  },
  { 
    value: 'adult', 
    label: 'Adult', 
    icon: <Users className="w-5 h-5" />, 
    description: 'Full access' 
  },
];

export function DemoControls() {
  const { 
    isOfflineMode, 
    setIsOfflineMode, 
    selectedAgeCategory, 
    setSelectedAgeCategory,
    isDemoMode,
    getAgeTheme
  } = useDemo();
  const [open, setOpen] = useState(false);
  const theme = getAgeTheme();

  return (
    <>
      {/* Floating Demo Badge */}
      {isDemoMode && (
        <div className="fixed bottom-4 left-4 z-50">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-yellow-100 border-yellow-400 text-yellow-800 hover:bg-yellow-200 shadow-lg animate-pulse hover:animate-none"
              >
                <Settings2 className="w-4 h-4 mr-2" />
                Demo Mode
                {isOfflineMode && <WifiOff className="w-4 h-4 ml-2 text-orange-500" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-500" />
                  Demo Controls
                </SheetTitle>
                <SheetDescription>
                  Switch ages and modes for presentation
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6 mt-6">
                {/* Demo Mode Notice */}
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <div className="flex items-center gap-2 text-sm">
                    <AlertCircle className="w-4 h-4 text-yellow-600" />
                    <span className="font-medium text-yellow-800 dark:text-yellow-200">
                      Simulation / Demo Only
                    </span>
                  </div>
                  <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                    All data is fictional for demonstration
                  </p>
                </div>

                {/* Age Category Selector */}
                <div className="space-y-3">
                  <Label className="text-sm font-medium flex items-center gap-2">
                    <Eye className="w-4 h-4" />
                    Age Category View
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    {ageCategories.map((category) => (
                      <Button
                        key={category.value}
                        variant={selectedAgeCategory === category.value ? 'default' : 'outline'}
                        size="sm"
                        className="h-auto py-3 flex flex-col items-center gap-1"
                        onClick={() => setSelectedAgeCategory(category.value)}
                      >
                        {category.icon}
                        <span className="text-xs font-medium">{category.label}</span>
                        <span className="text-[10px] opacity-70">{category.description}</span>
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Current Theme Info */}
                <Card className="bg-muted/50">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Current Theme</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span>Content Level:</span>
                      <Badge variant="secondary">{theme.contentLevel}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Font Scale:</span>
                      <Badge variant="secondary">{theme.fontScale}x</Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Use Icons:</span>
                      <Badge variant={theme.useIcons ? 'default' : 'secondary'}>
                        {theme.useIcons ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span>Sound Effects:</span>
                      <Badge variant={theme.useSounds ? 'default' : 'secondary'}>
                        {theme.useSounds ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Offline Mode Toggle */}
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {isOfflineMode ? (
                      <WifiOff className="w-5 h-5 text-orange-500" />
                    ) : (
                      <Wifi className="w-5 h-5 text-green-500" />
                    )}
                    <div>
                      <Label className="text-sm font-medium">Offline Mode</Label>
                      <p className="text-xs text-muted-foreground">
                        Simulate offline usage
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={isOfflineMode}
                    onCheckedChange={setIsOfflineMode}
                  />
                </div>

                {isOfflineMode && (
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <p className="text-xs text-orange-700 dark:text-orange-300">
                      📴 App is running in offline mode. Data will sync when connection is restored.
                    </p>
                  </div>
                )}

                {/* Demo Accounts Quick Switch */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Quick Demo Accounts</Label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-muted rounded border">
                      <p className="font-medium">Child: Kevin</p>
                      <p className="text-muted-foreground">KOT2025A001</p>
                    </div>
                    <div className="p-2 bg-muted rounded border">
                      <p className="font-medium">Adult: James</p>
                      <p className="text-muted-foreground">AJM2025B002</p>
                    </div>
                    <div className="p-2 bg-muted rounded border">
                      <p className="font-medium">Parent: Grace</p>
                      <p className="text-muted-foreground">GAC2025C003</p>
                    </div>
                    <div className="p-2 bg-muted rounded border">
                      <p className="font-medium">Admin: Dr. Omondi</p>
                      <p className="text-muted-foreground">ADM2025D004</p>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
}
