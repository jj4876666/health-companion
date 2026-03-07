import React, { createContext, useContext } from 'react';

type PremiumContextType = {
  isPremium: boolean;
  premiumExpiry: string | null;
  planType: string | null;
  activatePremium: (plan?: any) => void;
  deactivatePremium: () => void;
  daysRemaining: number;
  features: any[];
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
  daysRemaining: unlimited,
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