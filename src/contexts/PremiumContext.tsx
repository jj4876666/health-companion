import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PremiumContextType {
  isPremium: boolean;
  premiumExpiry: string | null;
  planType: 'monthly' | 'yearly' | null;
  activatePremium: (plan: 'monthly' | 'yearly') => void;
  deactivatePremium: () => void;
  daysRemaining: number;
  features: PremiumFeature[];
}

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const premiumFeatures: PremiumFeature[] = [
  { id: 'ai-chat', name: 'AI Health Consultant', description: 'Unlimited AI-powered health consultations', icon: '🤖' },
  { id: 'drug-delivery', name: 'Drug Delivery', description: 'Order medications from partner pharmacies', icon: '💊' },
  { id: 'priority-support', name: 'Priority Support', description: '24/7 priority customer support', icon: '⚡' },
  { id: 'advanced-analytics', name: 'Health Analytics', description: 'Detailed health insights and reports', icon: '📊' },
  { id: 'family-accounts', name: 'Family Management', description: 'Manage up to 5 family members', icon: '👨‍👩‍👧‍👦' },
  { id: 'offline-access', name: 'Offline Access', description: 'Access records without internet', icon: '📶' },
  { id: 'export-data', name: 'Data Export', description: 'Export your health records anytime', icon: '📁' },
  { id: 'no-ads', name: 'Ad-Free Experience', description: 'Enjoy EMEC without advertisements', icon: '🚫' },
];

const STORAGE_KEY = 'emec_premium';

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [isPremium, setIsPremium] = useState(false);
  const [premiumExpiry, setPremiumExpiry] = useState<string | null>(null);
  const [planType, setPlanType] = useState<'monthly' | 'yearly' | null>(null);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const expiry = new Date(parsed.premiumExpiry);
        
        if (expiry > new Date()) {
          setIsPremium(true);
          setPremiumExpiry(parsed.premiumExpiry);
          setPlanType(parsed.planType);
        } else {
          // Expired
          localStorage.removeItem(STORAGE_KEY);
        }
      } catch (e) {
        console.error('Failed to parse premium data:', e);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isPremium && premiumExpiry) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        isPremium,
        premiumExpiry,
        planType,
      }));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isPremium, premiumExpiry, planType]);

  const activatePremium = (plan: 'monthly' | 'yearly') => {
    const now = new Date();
    const expiry = new Date(now);
    
    if (plan === 'monthly') {
      expiry.setMonth(expiry.getMonth() + 1);
    } else {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }

    setIsPremium(true);
    setPremiumExpiry(expiry.toISOString());
    setPlanType(plan);

    toast({
      title: "🎉 Premium Activated!",
      description: `You now have access to all premium features until ${expiry.toLocaleDateString()}`,
    });
  };

  const deactivatePremium = () => {
    setIsPremium(false);
    setPremiumExpiry(null);
    setPlanType(null);
    localStorage.removeItem(STORAGE_KEY);

    toast({
      title: "Premium Deactivated",
      description: "Your premium subscription has ended",
    });
  };

  const daysRemaining = premiumExpiry 
    ? Math.max(0, Math.ceil((new Date(premiumExpiry).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)))
    : 0;

  return (
    <PremiumContext.Provider
      value={{
        isPremium,
        premiumExpiry,
        planType,
        activatePremium,
        deactivatePremium,
        daysRemaining,
        features: premiumFeatures,
      }}
    >
      {children}
    </PremiumContext.Provider>
  );
}

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}
