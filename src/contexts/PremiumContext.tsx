import React, { createContext, useContext } from 'react';

interface PremiumPlan {
  name: string;
  duration: number;
  price?: number;
}

interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

type PremiumContextType = {
  isPremium: boolean;
  premiumExpiry: string | null;
  planType: string | null;
  activatePremium: (plan?: PremiumPlan) => void;
  deactivatePremium: () => void;
  daysRemaining: number;
  features: PremiumFeature[];
  resetPremium: () => void;
  setIsPremiumUser?: (val: boolean) => void;
  isDemo?: boolean;
};
const defaultValue: PremiumContextType = {
  isPremium: true, // Premium features are enabled by default (paid gating removed)
  premiumExpiry: null,
  planType: null,
  activatePremium: () => {},
  deactivatePremium: () => {},
  daysRemaining: 4500,
  features: [],
  resetPremium: () => {},
  setIsPremiumUser: () => {},
  isDemo: false,
};

const PremiumContext = createContext<PremiumContextType | undefined>(undefined);

export const PremiumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Provider no longer manages storage or trials — premium gating removed
  return (
    <PremiumContext.Provider value={defaultValue}>
      {children}
    </PremiumContext.Provider>
  );
};

export function usePremium() {
  const context = useContext(PremiumContext);
  if (context === undefined) {
    throw new Error('usePremium must be used within a PremiumProvider');
  }
  return context;
}