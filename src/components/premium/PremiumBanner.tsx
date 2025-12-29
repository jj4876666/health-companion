import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { 
  Crown, Star, Sparkles, Check, X, Heart,
  Clock, Shield, Zap, HeartPulse, MapPin, Gift, Users
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
  { icon: Star, label: 'Export health records' },
  { icon: Crown, label: 'Ad-free experience' },
];

const CHARITY_IMPACT = [
  'Feeds 5 children for a week',
  'Provides medical supplies',
  'Supports developer education',
];

export function PremiumBanner({ onUpgrade }: PremiumBannerProps) {
  const [showModal, setShowModal] = useState(false);
  const [trialDaysLeft, setTrialDaysLeft] = useState(7);
  const [isPremium, setIsPremium] = useState(false);

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
      <Card variant="premium" className="overflow-hidden shimmer">
        <div className="p-5 gradient-premium text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Crown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <span className="font-bold text-lg">Premium Active</span>
              <p className="text-white/80 text-sm">Thank you for supporting our mission</p>
            </div>
            <Badge className="bg-white/20 hover:bg-white/30 border-0">
              <Heart className="w-3 h-3 mr-1 fill-current" />
              Making a Difference
            </Badge>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <>
      <Card 
        variant="interactive"
        className="group cursor-pointer border-2 border-dashed border-amber-400/40 hover:border-amber-400 bg-gradient-to-br from-amber-50/50 to-orange-50/50 dark:from-amber-950/20 dark:to-orange-950/20"
        onClick={() => setShowModal(true)}
      >
        <CardContent className="p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl gradient-premium flex items-center justify-center shadow-premium group-hover:scale-110 transition-transform duration-300">
              <Crown className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                Support Our Mission
                <Sparkles className="w-4 h-4 text-amber-500 animate-pulse-soft" />
              </h3>
              <p className="text-sm text-muted-foreground">
                {trialDaysLeft > 0 
                  ? `Free ${trialDaysLeft}-day trial • Your support helps children`
                  : 'Unlock features & support local charities'
                }
              </p>
            </div>
            <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300 border-0">
              <Gift className="w-3 h-3 mr-1" />
              Try Free
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto w-20 h-20 rounded-2xl gradient-premium flex items-center justify-center mb-4 shadow-premium animate-scale-in">
              <Crown className="w-10 h-10 text-white" />
            </div>
            <DialogTitle className="text-2xl">Join Our Mission</DialogTitle>
            <DialogDescription className="text-base">
              Premium unlocks powerful features while supporting children's health initiatives
            </DialogDescription>
          </DialogHeader>

          {/* Impact Statement */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 border border-emerald-200/50 dark:border-emerald-800/30 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-emerald-600" />
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">Your Impact</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Every subscription directly supports children's health programs and our developers' education. We believe in transparent, purpose-driven technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {/* Free Plan */}
            <Card variant="flat" className="border-muted">
              <CardContent className="p-5">
                <h3 className="font-semibold mb-2">Free Plan</h3>
                <p className="text-2xl font-bold mb-4">KES 0<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                <ul className="space-y-2.5">
                  {FREE_FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      {feature}
                    </li>
                  ))}
                  <li className="flex items-center gap-2 text-sm text-muted-foreground">
                    <X className="w-4 h-4 shrink-0" />
                    Premium features
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card variant="premium" className="relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 gradient-premium opacity-10 rounded-bl-full" />
              <CardContent className="p-5 relative">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold">Premium</h3>
                  <Badge className="bg-amber-500 border-0 text-xs">Best Value</Badge>
                </div>
                <p className="text-2xl font-bold mb-4">
                  KES 99<span className="text-sm font-normal text-muted-foreground">/month</span>
                </p>
                <ul className="space-y-2.5">
                  {PREMIUM_FEATURES.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-2 text-sm">
                      <Icon className="w-4 h-4 text-amber-600 shrink-0" />
                      {label}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Charity Impact */}
          <div className="flex items-center justify-center gap-4 py-3 text-xs text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span>Each subscription helps: </span>
            {CHARITY_IMPACT.map((impact, i) => (
              <span key={i} className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                {impact}
              </span>
            ))}
          </div>

          <div className="space-y-3">
            <Button 
              onClick={startTrial}
              className="w-full h-12 text-base gradient-premium hover:opacity-90 shadow-premium"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Start 7-Day Free Trial
            </Button>
            <Button variant="outline" onClick={activatePremium} className="w-full">
              Activate Demo Premium
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Demo Mode – No actual charges • Cancel anytime
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
