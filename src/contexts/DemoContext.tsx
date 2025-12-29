import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AgeCategory = 'infant' | 'child' | 'teen' | 'adult';

interface ContentAccess {
  basicHygiene: boolean;
  bodyAwareness: boolean;
  nutrition: boolean;
  safety: boolean;
  puberty: boolean;
  menstruation: boolean;
  mentalHealth: boolean;
  reproductiveHealth: boolean;
  chronicDisease: boolean;
}

interface DemoContextType {
  isOfflineMode: boolean;
  setIsOfflineMode: (value: boolean) => void;
  selectedAgeCategory: AgeCategory;
  setSelectedAgeCategory: (category: AgeCategory) => void;
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  getAgeTheme: () => AgeTheme;
  getContentAccess: (age: number) => ContentAccess;
}

interface AgeTheme {
  colors: {
    primary: string;
    secondary: string;
    background: string;
  };
  fontScale: number;
  useIcons: boolean;
  useSounds: boolean;
  contentLevel: 'basic' | 'intermediate' | 'advanced';
  fontFamily: string;
  restrictions: string[];
}

const ageThemes: Record<AgeCategory, AgeTheme> = {
  'infant': {
    colors: {
      primary: 'from-pink-400 to-purple-400',
      secondary: 'from-yellow-400 to-orange-400',
      background: 'from-pink-100 via-purple-100 to-blue-100',
    },
    fontScale: 1.4,
    useIcons: true,
    useSounds: true,
    contentLevel: 'basic',
    fontFamily: 'rounded',
    restrictions: ['no-text-heavy', 'visual-only', 'simple-games'],
  },
  'child': {
    colors: {
      primary: 'from-blue-400 to-cyan-400',
      secondary: 'from-green-400 to-emerald-400',
      background: 'from-blue-100 via-green-100 to-yellow-100',
    },
    fontScale: 1.2,
    useIcons: true,
    useSounds: true,
    contentLevel: 'basic',
    fontFamily: 'rounded',
    restrictions: ['hygiene', 'nutrition', 'games', 'basic-anatomy'],
  },
  'teen': {
    colors: {
      primary: 'from-purple-500 to-indigo-500',
      secondary: 'from-pink-500 to-rose-500',
      background: 'from-purple-100 via-indigo-100 to-pink-100',
    },
    fontScale: 1.0,
    useIcons: true,
    useSounds: false,
    contentLevel: 'intermediate',
    fontFamily: 'modern',
    restrictions: ['puberty', 'menstruation', 'mental-health'],
  },
  'adult': {
    colors: {
      primary: 'from-primary to-primary/80',
      secondary: 'from-secondary to-secondary/80',
      background: 'from-background to-muted',
    },
    fontScale: 1.0,
    useIcons: false,
    useSounds: false,
    contentLevel: 'advanced',
    fontFamily: 'professional',
    restrictions: [],
  },
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<AgeCategory>('adult');
  const [isDemoMode, setIsDemoMode] = useState(true);

  const getAgeTheme = () => ageThemes[selectedAgeCategory];

  const getContentAccess = (age: number): ContentAccess => ({
    basicHygiene: age >= 0,
    bodyAwareness: age >= 5,
    nutrition: age >= 3,
    safety: age >= 3,
    puberty: age >= 10,
    menstruation: age >= 11,
    mentalHealth: age >= 12,
    reproductiveHealth: age >= 15,
    chronicDisease: age >= 18,
  });

  return (
    <DemoContext.Provider
      value={{
        isOfflineMode,
        setIsOfflineMode,
        selectedAgeCategory,
        setSelectedAgeCategory,
        isDemoMode,
        setIsDemoMode,
        getAgeTheme,
        getContentAccess,
      }}
    >
      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const context = useContext(DemoContext);
  if (context === undefined) {
    throw new Error('useDemo must be used within a DemoProvider');
  }
  return context;
}
