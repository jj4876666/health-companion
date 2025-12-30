import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { usePremium } from './PremiumContext';

interface PointsContextType {
  points: number;
  totalEarned: number;
  addPoints: (amount: number, source: string) => void;
  spendPoints: (amount: number) => boolean;
  canUnlockFeature: (cost: number) => boolean;
  unlockPremiumTrial: (hours: number, cost: number) => boolean;
  premiumTrialExpiry: string | null;
  isPremiumTrial: boolean;
  pointsHistory: PointsTransaction[];
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

const PointsContext = createContext<PointsContextType | undefined>(undefined);

export function PointsProvider({ children }: { children: ReactNode }) {
  const [points, setPoints] = useState(0);
  const [totalEarned, setTotalEarned] = useState(0);
  const [pointsHistory, setPointsHistory] = useState<PointsTransaction[]>([]);
  const [premiumTrialExpiry, setPremiumTrialExpiry] = useState<string | null>(null);
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
    } catch (e) {
      console.error('Failed to load points:', e);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      points,
      totalEarned,
      history: pointsHistory.slice(-50) // Keep last 50 transactions
    }));
  }, [points, totalEarned, pointsHistory]);

  // Save trial expiry
  useEffect(() => {
    if (premiumTrialExpiry) {
      localStorage.setItem(TRIAL_KEY, premiumTrialExpiry);
    }
  }, [premiumTrialExpiry]);

  const addPoints = (amount: number, source: string) => {
    setPoints(prev => prev + amount);
    setTotalEarned(prev => prev + amount);
    setPointsHistory(prev => [...prev, {
      id: Date.now().toString(),
      amount,
      source,
      timestamp: new Date(),
      type: 'earned'
    }]);

    toast({
      title: `+${amount} Points! 🎉`,
      description: `Earned from ${source}`,
    });
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

  const isPremiumTrial = premiumTrialExpiry 
    ? new Date(premiumTrialExpiry) > new Date()
    : false;

  return (
    <PointsContext.Provider
      value={{
        points,
        totalEarned,
        addPoints,
        spendPoints,
        canUnlockFeature,
        unlockPremiumTrial,
        premiumTrialExpiry,
        isPremiumTrial,
        pointsHistory,
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
