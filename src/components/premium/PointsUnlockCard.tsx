import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { usePoints } from '@/contexts/PointsContext';
import { usePremium } from '@/contexts/PremiumContext';
import { 
  Star, 
  Zap, 
  Clock, 
  Trophy, 
  Gift, 
  Sparkles,
  Lock,
  Unlock,
  Timer,
  TrendingUp
} from 'lucide-react';

interface UnlockOption {
  id: string;
  name: string;
  description: string;
  hours: number;
  cost: number;
  icon: string;
  popular?: boolean;
}

const unlockOptions: UnlockOption[] = [
  {
    id: 'trial-1h',
    name: '1 Hour Trial',
    description: 'Quick taste of premium features',
    hours: 1,
    cost: 50,
    icon: '⚡'
  },
  {
    id: 'trial-6h',
    name: '6 Hour Trial',
    description: 'Half-day premium access',
    hours: 6,
    cost: 200,
    icon: '🌟',
    popular: true
  },
  {
    id: 'trial-24h',
    name: '24 Hour Trial',
    description: 'Full day of premium features',
    hours: 24,
    cost: 500,
    icon: '👑'
  },
  {
    id: 'trial-72h',
    name: '3 Day Trial',
    description: 'Extended premium experience',
    hours: 72,
    cost: 1000,
    icon: '💎'
  }
];

export function PointsUnlockCard() {
  const { points, totalEarned, unlockPremiumTrial, isPremiumTrial, premiumTrialExpiry, pointsHistory } = usePoints();
  const { isPremium } = usePremium();
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const getTimeRemaining = () => {
    if (!premiumTrialExpiry) return null;
    const expiry = new Date(premiumTrialExpiry);
    const now = new Date();
    const diff = expiry.getTime() - now.getTime();
    
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`;
    }
    return `${minutes}m remaining`;
  };

  const recentEarnings = pointsHistory
    .filter(t => t.type === 'earned')
    .slice(-5)
    .reverse();

  if (isPremium) {
    return (
      <Card className="border-0 shadow-elegant bg-gradient-to-br from-amber-500/10 to-orange-500/10">
        <CardContent className="p-6 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Trophy className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-lg font-bold mb-2">You're Premium!</h3>
          <p className="text-sm text-muted-foreground">
            Enjoy unlimited access to all features
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-elegant overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">Unlock Premium with Points</CardTitle>
              <p className="text-sm text-muted-foreground">Earn points from games & quizzes</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">{points}</div>
            <div className="text-xs text-muted-foreground">points</div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-6">
        {/* Active Trial Status */}
        {isPremiumTrial && (
          <div className="p-4 rounded-xl bg-gradient-to-r from-success/10 to-emerald-500/10 border border-success/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center">
                <Unlock className="w-5 h-5 text-success" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-success">Premium Trial Active!</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Timer className="w-3 h-3" />
                  {getTimeRemaining()}
                </p>
              </div>
              <Badge className="bg-success text-white">
                <Sparkles className="w-3 h-3 mr-1" />
                Active
              </Badge>
            </div>
          </div>
        )}

        {/* Progress to next unlock */}
        {!isPremiumTrial && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to 1-Hour Trial</span>
              <span className="font-medium">{points}/50 points</span>
            </div>
            <Progress value={Math.min((points / 50) * 100, 100)} className="h-2" />
            {points < 50 && (
              <p className="text-xs text-muted-foreground">
                Play games or complete quizzes to earn {50 - points} more points!
              </p>
            )}
          </div>
        )}

        {/* Unlock Options */}
        <div className="space-y-3">
          <h4 className="font-semibold flex items-center gap-2">
            <Gift className="w-4 h-4 text-primary" />
            Redeem Points for Premium
          </h4>
          
          <div className="grid gap-3">
            {unlockOptions.map((option) => {
              const canAfford = points >= option.cost;
              
              return (
                <button
                  key={option.id}
                  onClick={() => {
                    if (canAfford) {
                      unlockPremiumTrial(option.hours, option.cost);
                    } else {
                      setSelectedOption(option.id);
                    }
                  }}
                  disabled={isPremiumTrial}
                  className={`relative p-4 rounded-xl border-2 transition-all text-left ${
                    canAfford 
                      ? 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 cursor-pointer' 
                      : 'border-muted bg-muted/30 cursor-not-allowed opacity-60'
                  } ${option.popular ? 'ring-2 ring-amber-500/50' : ''}`}
                >
                  {option.popular && (
                    <Badge className="absolute -top-2 right-3 bg-amber-500 text-white text-[10px]">
                      Popular
                    </Badge>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className="text-3xl">{option.icon}</div>
                    <div className="flex-1">
                      <div className="font-semibold flex items-center gap-2">
                        {option.name}
                        {canAfford ? (
                          <Unlock className="w-4 h-4 text-success" />
                        ) : (
                          <Lock className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${canAfford ? 'text-primary' : 'text-muted-foreground'}`}>
                        {option.cost}
                      </div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* How to earn points */}
        <div className="p-4 rounded-xl bg-muted/50 space-y-3">
          <h4 className="font-semibold flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-success" />
            How to Earn Points
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
              <span className="text-lg">🎮</span>
              <div>
                <p className="font-medium">Health Games</p>
                <p className="text-muted-foreground">10-50 pts/game</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
              <span className="text-lg">📝</span>
              <div>
                <p className="font-medium">Daily Quizzes</p>
                <p className="text-muted-foreground">20-100 pts/quiz</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
              <span className="text-lg">🔥</span>
              <div>
                <p className="font-medium">Streak Bonus</p>
                <p className="text-muted-foreground">+10 pts/day</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-2 rounded-lg bg-background">
              <span className="text-lg">📚</span>
              <div>
                <p className="font-medium">Complete Lessons</p>
                <p className="text-muted-foreground">5-15 pts/section</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Earnings */}
        {recentEarnings.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-muted-foreground">Recent Earnings</h4>
            <div className="space-y-1">
              {recentEarnings.map((t) => (
                <div key={t.id} className="flex items-center justify-between text-sm p-2 rounded-lg bg-success/5">
                  <span className="text-muted-foreground">{t.source}</span>
                  <span className="font-medium text-success">+{t.amount}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total earned */}
        <div className="text-center text-sm text-muted-foreground pt-2 border-t">
          Total earned: <span className="font-semibold text-foreground">{totalEarned} points</span>
        </div>
      </CardContent>
    </Card>
  );
}
