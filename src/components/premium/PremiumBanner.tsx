import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Crown, Star, Sparkles, Check, X, 
  Clock, Shield, Zap, HeartPulse, MapPin
} from 'lucide-react';

interface PremiumBannerProps {
  onUpgrade?: () => void;
}

const FREE_FEATURES = [
  'Basic health education',
  'Emergency contacts',
  'Limited quizzes (3/day)',
  'Basic first aid guides',
];

const PREMIUM_FEATURES = [
  { icon: HeartPulse, label: 'Unlimited health quizzes' },
  { icon: MapPin, label: 'Real-time facility locator' },
  { icon: Shield, label: 'Advanced allergy checker' },
  { icon: Zap, label: 'Priority emergency response' },
  { icon: Star, label: 'Detailed health analytics' },
  { icon: Crown, label: 'No ads experience' },
];

export function PremiumBanner({ onUpgrade }: PremiumBannerProps) {
  const [showModal, setShowModal] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);
  const [isPremium, setIsPremium] = useState(false);

  // Demo: Check trial status from localStorage
  useEffect(() => {
    const trialStart = localStorage.getItem('emec_trial_start');
    if (trialStart) {
      const start = new Date(trialStart);
      const now = new Date();
      const diffDays = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      setTrialDaysLeft(Math.max(0, 7 - diffDays));
    }
    
    const premium = localStorage.getItem('emec_premium');
    setIsPremium(premium === 'true');
  }, []);

  const startTrial = () => {
    localStorage.setItem('emec_trial_start', new Date().toISOString());
    setTrialDaysLeft(7);
    setShowModal(false);
  };

  const activatePremium = () => {
    localStorage.setItem('emec_premium', 'true');
    setIsPremium(true);
    setShowModal(false);
    onUpgrade?.();
  };

  if (isPremium) {
    return (
      <Card className="border-0 overflow-hidden">
        <div className="p-4 bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 text-white">
          <div className="flex items-center gap-2">
            <Crown className="w-5 h-5" />
            <span className="font-bold">Premium Active</span>
            <Badge className="ml-auto bg-white/20 hover:bg-white/30">All Features Unlocked</Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        className="border-2 border-dashed border-amber-400/50 cursor-pointer hover:border-amber-400 transition-all"
        onClick={() => setShowModal(true)}
      >
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold flex items-center gap-2">
                Upgrade to Premium
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-sm text-muted-foreground">
                {trialDaysLeft > 0 
                  ? `Try free for ${trialDaysLeft} days!`
                  : 'Unlock all features'
                }
              </p>
            </div>
            <Badge variant="secondary" className="bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
              <Clock className="w-3 h-3 mr-1" />
              {trialDaysLeft > 0 ? '7-Day Trial' : 'Upgrade Now'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <DialogTitle className="text-2xl">EMEC Premium</DialogTitle>
            <DialogDescription>
              Unlock the full potential of your health companion
            </DialogDescription>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Free Plan */}
            <Card className="border-2">
              <CardContent className="p-4">
                <h3 className="font-semibold mb-3">Free Plan</h3>
                <p className="text-2xl font-bold mb-4">KES 0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-2">
                  {FREE_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary" />
                      {feature}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <X className="w-4 h-4" />
                    Premium features
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="border-2 border-amber-400 bg-amber-50/50 dark:bg-amber-950/20">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-semibold">Premium Plan</h3>
                  <Badge className="bg-amber-500">Popular</Badge>
                </div>
                <p className="text-2xl font-bold mb-4">
                  KES 99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <ul className="space-y-2">
                  {PREMIUM_FEATURES.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-amber-600" />
                      {label}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Button 
              onClick={startTrial}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start 7-Day Free Trial
            </Button>
            <Button variant="outline" onClick={activatePremium} className="w-full">
              Activate Demo Premium
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo Mode – No actual charges apply
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
