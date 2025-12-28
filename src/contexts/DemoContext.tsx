import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AgeCategory = '0-5' | '6-12' | '13-17' | 'adult';

interface DemoContextType {
  isOfflineMode: boolean;
  setIsOfflineMode: (value: boolean) => void;
  selectedAgeCategory: AgeCategory;
  setSelectedAgeCategory: (category: AgeCategory) => void;
  isDemoMode: boolean;
  setIsDemoMode: (value: boolean) => void;
  getAgeTheme: () => AgeTheme;
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
  restrictions: string[];
}

const ageThemes: Record<AgeCategory, AgeTheme> = {
  '0-5': {
    colors: {
      primary: 'from-pink-400 to-purple-400',
      secondary: 'from-yellow-400 to-orange-400',
      background: 'from-pink-100 via-purple-100 to-blue-100',
    },
    fontScale: 1.3,
    useIcons: true,
    useSounds: true,
    contentLevel: 'basic',
    restrictions: ['no-text-heavy', 'visual-only', 'simple-games'],
  },
  '6-12': {
    colors: {
      primary: 'from-blue-400 to-cyan-400',
      secondary: 'from-green-400 to-emerald-400',
      background: 'from-blue-100 via-green-100 to-yellow-100',
    },
    fontScale: 1.1,
    useIcons: true,
    useSounds: false,
    contentLevel: 'intermediate',
    restrictions: ['hygiene', 'nutrition', 'games', 'basic-anatomy'],
  },
  '13-17': {
    colors: {
      primary: 'from-purple-500 to-indigo-500',
      secondary: 'from-pink-500 to-rose-500',
      background: 'from-purple-100 via-indigo-100 to-pink-100',
    },
    fontScale: 1.0,
    useIcons: false,
    useSounds: false,
    contentLevel: 'advanced',
    restrictions: ['puberty', 'menstruation', 'mental-health', 'sexual-education'],
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
    restrictions: [],
  },
};

const DemoContext = createContext<DemoContextType | undefined>(undefined);

export function DemoProvider({ children }: { children: ReactNode }) {
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [selectedAgeCategory, setSelectedAgeCategory] = useState<AgeCategory>('adult');
  const [isDemoMode, setIsDemoMode] = useState(true);

  const getAgeTheme = () => ageThemes[selectedAgeCategory];

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
