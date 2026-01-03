import { useState } from 'react';
import { useDemo, AgeCategory } from '@/contexts/DemoContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { usePremium } from '@/contexts/PremiumContext';
import { UserRole } from '@/types/emec';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  Settings2, Baby, User, Users, Wifi, WifiOff, 
  Eye, Sparkles, AlertCircle, Shield, X, ChevronDown, ChevronUp,
  RotateCcw, Crown
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';

const ageCategories: { value: AgeCategory; label: string; icon: React.ReactNode; description: string }[] = [
  { 
    value: 'infant', 
    label: 'Infant', 
    icon: <Baby className="w-5 h-5" />, 
    description: '0-2 years' 
  },
  { 
    value: 'child', 
    label: 'Child', 
    icon: <User className="w-5 h-5" />, 
    description: '3-12 years' 
  },
  { 
    value: 'teen', 
    label: 'Teen', 
    icon: <User className="w-5 h-5" />, 
    description: '13-17 years' 
  },
  { 
    value: 'adult', 
    label: 'Adult', 
    icon: <Users className="w-5 h-5" />, 
    description: '18+ years' 
  },
];

const childAccountTypes = [
  { value: 'child', label: 'Kevin (9)', icon: <Baby className="w-4 h-4" />, color: 'bg-blue-500', description: 'Child View' },
  { value: 'teen', label: 'Faith (14)', icon: <User className="w-4 h-4" />, color: 'bg-purple-500', description: 'Teen View' },
];

const adultAccountTypes = [
  { value: 'adultFree', label: 'Mary (Free)', icon: <User className="w-4 h-4" />, color: 'bg-slate-500', description: 'Free Account' },
  { value: 'adultPremium', label: 'John (Premium)', icon: <Crown className="w-4 h-4" />, color: 'bg-amber-500', description: 'Premium Account' },
];

const otherAccountTypes = [
  { value: 'parent', label: 'Parent', icon: <Users className="w-4 h-4" />, color: 'bg-green-500', description: 'Grace Achieng' },
  { value: 'admin', label: 'Health Officer', icon: <Shield className="w-4 h-4" />, color: 'bg-red-500', description: 'Dr. Wekesa' },
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
  const { currentUser, switchAccountType, viewingAsChild, setViewingAsChild } = useAuth();
  const { resetPoints, points, streak } = usePoints();
  const { resetPremium, isPremium, setIsPremiumUser } = usePremium();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const theme = getAgeTheme();

  // Handle account switching with premium state
  const handleAccountSwitch = (accountType: string) => {
    switchAccountType(accountType as any);
    // Set premium status based on account type
    if (accountType === 'adultPremium') {
      setIsPremiumUser(true);
    } else {
      setIsPremiumUser(false);
    }
  };

  const handleDemoReset = () => {
    resetPoints();
    resetPremium();
    toast({
      title: '🔄 Demo Reset Complete!',
      description: 'All points, streaks, and premium trials have been cleared for a fresh presentation.',
    });
  };

  if (!isDemoMode) return null;

  return (
    <>
      {/* Floating Demo Badge */}
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
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Demo Controls
              </SheetTitle>
              <SheetDescription>
                Switch ages, accounts, and modes for presentation
              </SheetDescription>
            </SheetHeader>

            <div className="space-y-6 mt-6">
              {/* Demo Mode Notice */}
              <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-yellow-600" />
                  <span className="font-medium text-yellow-800 dark:text-yellow-200">
                    For Judges: Demo Controls
                  </span>
                </div>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  All data is fictional for demonstration
                </p>
              </div>

              {/* Current Status */}
              <div className="p-3 rounded-lg bg-muted/50 space-y-2">
                <p className="text-xs font-medium text-muted-foreground">Current Status</p>
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="text-xs capitalize">
                    {currentUser?.role || 'Not logged in'}
                  </Badge>
                  <Badge variant="outline" className="text-xs capitalize">
                    {selectedAgeCategory}
                  </Badge>
                  <Badge variant={isOfflineMode ? 'destructive' : 'default'} className="text-xs">
                    {isOfflineMode ? 'Offline' : 'Online'}
                  </Badge>
                </div>
              </div>

              {/* Children/Teen Account Selector */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Baby className="w-4 h-4" />
                  Children Accounts
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {childAccountTypes.map((account) => (
                    <Button
                      key={account.value}
                      variant={currentUser?.name?.includes(account.label.split(' ')[0]) ? 'default' : 'outline'}
                      size="sm"
                      className="h-auto py-2 flex flex-col items-center gap-1"
                      onClick={() => handleAccountSwitch(account.value)}
                    >
                      <div className={`p-1.5 rounded ${account.color} text-white`}>
                        {account.icon}
                      </div>
                      <span className="text-xs font-medium">{account.label}</span>
                      <span className="text-[10px] text-muted-foreground">{account.description}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Free vs Premium Adult Accounts */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Free vs Premium Comparison
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {adultAccountTypes.map((account) => (
                    <Button
                      key={account.value}
                      variant={currentUser?.name?.includes(account.label.split(' ')[0]) ? 'default' : 'outline'}
                      size="sm"
                      className={`h-auto py-3 flex flex-col items-center gap-1 ${account.value === 'adultPremium' ? 'ring-2 ring-amber-500/50' : ''}`}
                      onClick={() => handleAccountSwitch(account.value)}
                    >
                      <div className={`p-1.5 rounded ${account.color} text-white`}>
                        {account.icon}
                      </div>
                      <span className="text-xs font-medium">{account.label}</span>
                      <span className="text-[10px] text-muted-foreground">{account.description}</span>
                    </Button>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground text-center">
                  Compare features between free and premium accounts
                </p>
              </div>

              {/* Other Account Types */}
              <div className="space-y-3">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  Other Roles
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {otherAccountTypes.map((account) => (
                    <Button
                      key={account.value}
                      variant={currentUser?.role === account.value ? 'default' : 'outline'}
                      size="sm"
                      className="h-auto py-2 flex flex-col items-center gap-1"
                      onClick={() => handleAccountSwitch(account.value)}
                    >
                      <div className={`p-1.5 rounded ${account.color} text-white`}>
                        {account.icon}
                      </div>
                      <span className="text-xs font-medium">{account.label}</span>
                      <span className="text-[10px] text-muted-foreground">{account.description}</span>
                    </Button>
                  ))}
                </div>
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

              {/* Parent View Toggle */}
              {currentUser?.role === 'parent' && (
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-primary" />
                    <div>
                      <Label className="text-sm font-medium">View as Child</Label>
                      <p className="text-xs text-muted-foreground">
                        See child's perspective
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={viewingAsChild}
                    onCheckedChange={setViewingAsChild}
                  />
                </div>
              )}

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

              {/* Demo Accounts Quick Reference */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Demo Account Reference</Label>
                
                {/* Children Section */}
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Children</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
                      <p className="font-medium text-blue-700 dark:text-blue-300">👦 Kevin Otieno</p>
                      <p className="text-muted-foreground">Age 9 • Child</p>
                      <p className="text-[10px] text-muted-foreground">Fun games, simple content</p>
                    </div>
                    <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-800">
                      <p className="font-medium text-purple-700 dark:text-purple-300">👧 Faith Achieng</p>
                      <p className="text-muted-foreground">Age 14 • Teen</p>
                      <p className="text-[10px] text-muted-foreground">Puberty, mental health access</p>
                    </div>
                  </div>
                </div>

                {/* Free vs Premium Section */}
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Free vs Premium Adults</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-slate-50 dark:bg-slate-900/20 rounded border border-slate-200 dark:border-slate-800">
                      <p className="font-medium text-slate-700 dark:text-slate-300">👩 Mary Wanjiku</p>
                      <p className="text-muted-foreground">Age 28 • FREE</p>
                      <p className="text-[10px] text-muted-foreground">Basic features only</p>
                    </div>
                    <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded border-2 border-amber-400 dark:border-amber-600">
                      <p className="font-medium text-amber-700 dark:text-amber-300">👨 John Kamau ⭐</p>
                      <p className="text-muted-foreground">Age 35 • PREMIUM</p>
                      <p className="text-[10px] text-muted-foreground">All features unlocked</p>
                    </div>
                  </div>
                </div>

                {/* Other Roles */}
                <div className="space-y-1">
                  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">Other Roles</p>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
                      <p className="font-medium text-green-700 dark:text-green-300">👩‍👧‍👦 Grace Achieng</p>
                      <p className="text-muted-foreground">Parent</p>
                      <p className="text-[10px] text-muted-foreground">Manages Kevin, Faith, Brian</p>
                    </div>
                    <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                      <p className="font-medium text-red-700 dark:text-red-300">🏥 Dr. Wekesa</p>
                      <p className="text-muted-foreground">Health Officer</p>
                      <p className="text-[10px] text-muted-foreground">Edit patient records</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Demo Reset Button */}
              <div className="space-y-3 border-t pt-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Reset Demo Data
                </Label>
                <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Current Points:</span>
                    <Badge variant="secondary">{points}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Current Streak:</span>
                    <Badge variant="secondary">{streak} days</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Premium Status:</span>
                    <Badge variant={isPremium ? 'default' : 'secondary'}>
                      {isPremium ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  className="w-full gap-2"
                  onClick={handleDemoReset}
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset All Demo Data
                </Button>
                <p className="text-[10px] text-muted-foreground text-center">
                  Clears points, streaks, and premium trials for fresh presentations
                </p>
              </div>

              {/* Judge Tip */}
              <p className="text-[10px] text-center text-muted-foreground border-t pt-4">
                🎯 For judges: Use these controls to test different user experiences instantly
              </p>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
