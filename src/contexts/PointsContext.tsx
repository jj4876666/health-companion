import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PointsContextType {
  points: number;
  totalEarned: number;
  streak: number;
  lastActivityDate: string | null;
  addPoints: (amount: number, source: string) => void;
  spendPoints: (amount: number) => boolean;
  canUnlockFeature: (cost: number) => boolean;
  unlockPremiumTrial: (hours: number, cost: number) => boolean;
  premiumTrialExpiry: string | null;
  isPremiumTrial: boolean;
  pointsHistory: PointsTransaction[];
  getStreakBonus: () => number;
  resetPoints: () => void;
}

interface PointsTransaction {
  id: string;
  amount: number;
  source: string;
  timestamp: Date;
  type: 'earned' | 'spent';
}

const STORAGE_KEY = 'emec_points';
const TRIAL_KEY = 'emec_premium_trial';
const STREAK_KEY = 'emec_streak';

const PointsContext = createContext<PointsContextType | undefined>(undefined);

// Streak bonus multipliers
const getStreakMultiplier = (streak: number): number => {
  if (streak >= 30) return 2.0;  // 100% bonus for 30+ days
  if (streak >= 14) return 1.5;  // 50% bonus for 14+ days
  if (streak >= 7) return 1.3;   // 30% bonus for 7+ days
  if (streak >= 3) return 1.15;  // 15% bonus for 3+ days
  return 1.0;
};

const getDateString = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export function PointsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);
  const [premiumTrialExpiry, setPremiumTrialExpiry] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [lastActivityDate, setLastActivityDate] = useState<string | null>(null);
  const { toast } = useToast();

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setPoints(parsed.points || 0);
        setTotalEarned(parsed.totalEarned || 0);
        setPointsHistory((parsed.history || []).map((h: any) => ({
          ...h,
          timestamp: new Date(h.timestamp)
        })));
      }

      const trialSaved = localStorage.getItem(TRIAL_KEY);
      if (trialSaved) {
        const trialExpiry = new Date(trialSaved);
        if (trialExpiry > new Date()) {
          setPremiumTrialExpiry(trialSaved);
        } else {
          localStorage.removeItem(TRIAL_KEY);
        }
      }

      const streakSaved = localStorage.getItem(STREAK_KEY);
      if (streakSaved) {
        const parsed = JSON.parse(streakSaved);
        const today = getDateString(new Date());
        const yesterday = getDateString(new Date(Date.now() - 86400000));
        
        // Check if streak is still valid (activity today or yesterday)
        if (parsed.lastActivityDate === today || parsed.lastActivityDate === yesterday) {
          setStreak(parsed.streak || 0);
          setLastActivityDate(parsed.lastActivityDate);
        } else {
          // Streak broken - reset
          setStreak(0);
          setLastActivityDate(null);
        }
      }
    } catch (e) {
      console.error('Failed to load points:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      points,
      totalEarned,
      history: pointsHistory.slice(-50)
    }));
  }, [points, totalEarned, pointsHistory]);

  // Save streak data
  useEffect(() => {
    localStorage.setItem(STREAK_KEY, JSON.stringify({
      streak,
      lastActivityDate
    }));
  }, [streak, lastActivityDate]);

  // Save trial expiry
  useEffect(() => {
    if (premiumTrialExpiry) {
      localStorage.setItem(TRIAL_KEY, premiumTrialExpiry);
    }
  }, [premiumTrialExpiry]);

  const getStreakBonus = (): number => {
    return Math.round((getStreakMultiplier(streak) - 1) * 100);
  };

  const addPoints = (amount: number, source: string) => {
    const today = getDateString(new Date());
    const yesterday = getDateString(new Date(Date.now() - 86400000));
    
    let newStreak = streak;
    let streakBonusAwarded = 0;
    
    // Update streak logic
    if (lastActivityDate !== today) {
      if (lastActivityDate === yesterday) {
        // Consecutive day - increase streak
        newStreak = streak + 1;
      } else if (lastActivityDate === null || lastActivityDate !== today) {
        // First activity or streak broken - start new streak
        newStreak = 1;
      }
      
      setStreak(newStreak);
      setLastActivityDate(today);
      
      // Award streak bonus on new day
      if (newStreak > 1) {
        const multiplier = getStreakMultiplier(newStreak);
        streakBonusAwarded = Math.round(amount * (multiplier - 1));
      }
    }
    
    const totalPoints = amount + streakBonusAwarded;
    
    setPoints(prev => prev + totalPoints);
    setTotalEarned(prev => prev + totalPoints);
    setPointsHistory(prev => [...prev, {
      id: Date.now().toString(),
      amount: totalPoints,
      source: streakBonusAwarded > 0 
        ? `${source} (+${streakBonusAwarded} streak bonus)` 
        : source,
      timestamp: new Date(),
      type: 'earned'
    }]);

    if (streakBonusAwarded > 0) {
      toast({
        title: `+${totalPoints} Points! 🔥 ${newStreak}-Day Streak!`,
        description: `${amount} base + ${streakBonusAwarded} streak bonus from ${source}`,
      });
    } else if (newStreak === 1 && lastActivityDate !== today) {
      toast({
        title: `+${amount} Points! 🎉`,
        description: `Streak started! Come back tomorrow for bonus points!`,
      });
    } else {
      toast({
        title: `+${amount} Points! 🎉`,
        description: `Earned from ${source}`,
      });
    }
  };

  const spendPoints = (amount: number): boolean => {
    if (points >= amount) {
      setPoints(prev => prev - amount);
      setPointsHistory(prev => [...prev, {
        id: Date.now().toString(),
        amount: -amount,
        source: 'Premium Feature Unlock',
        timestamp: new Date(),
        type: 'spent'
      }]);
      return true;
    }
    return false;
  };

  const canUnlockFeature = (cost: number): boolean => {
    return points >= cost;
  };

  const unlockPremiumTrial = (hours: number, cost: number): boolean => {
    if (spendPoints(cost)) {
      const expiry = new Date();
      expiry.setHours(expiry.getHours() + hours);
      setPremiumTrialExpiry(expiry.toISOString());
      
      toast({
        title: '🌟 Premium Trial Activated!',
        description: `You have ${hours} hours of premium access!`,
      });
      return true;
    }
    
    toast({
      title: 'Not enough points',
      description: `You need ${cost} points to unlock this trial.`,
      variant: 'destructive'
    });
    return false;
  };

  const resetPoints = () => {
    setPoints(0);
    setTotalEarned(0);
    setPointsHistory([]);
    setStreak(0);
    setLastActivityDate(null);
    setPremiumTrialExpiry(null);
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(TRIAL_KEY);
    localStorage.removeItem(STREAK_KEY);
    
    toast({
      title: '🔄 Demo Reset Complete',
      description: 'All points, streaks, and trials have been cleared.',
    });
  };

  const isPremiumTrial = premiumTrialExpiry 
    ? new Date(premiumTrialExpiry) > new Date()
    : false;

  return (
    <PointsContext.Provider
      value={{
        points,
        totalEarned,
        streak,
        lastActivityDate,
        addPoints,
        spendPoints,
        canUnlockFeature,
        unlockPremiumTrial,
        premiumTrialExpiry,
        isPremiumTrial,
        pointsHistory,
        getStreakBonus,
        resetPoints,
      }}
    >
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  const context = useContext(PointsContext);
  if (context === undefined) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
}
