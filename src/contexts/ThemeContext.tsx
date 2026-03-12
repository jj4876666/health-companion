import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ThemeContextType {
  backgroundColor: string;
  setBackgroundColor: (color: string) => void;
  resetBackgroundColor: () => void;
  getBackgroundClass: () => string;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'emec_background_color';
const DEFAULT_COLOR = 'default';

// Predefined color schemes that maintain text clarity
export const colorSchemes = [
  { id: 'default', name: 'Default', bg: 'bg-background', preview: '#ffffff', darkPreview: '#0a0a0a' },
  { id: 'warm', name: 'Warm Beige', bg: 'bg-amber-50 dark:bg-amber-950/20', preview: '#fffbeb', darkPreview: '#451a03' },
  { id: 'cool', name: 'Cool Blue', bg: 'bg-blue-50 dark:bg-blue-950/20', preview: '#eff6ff', darkPreview: '#172554' },
  { id: 'mint', name: 'Fresh Mint', bg: 'bg-emerald-50 dark:bg-emerald-950/20', preview: '#ecfdf5', darkPreview: '#022c22' },
  { id: 'lavender', name: 'Soft Lavender', bg: 'bg-purple-50 dark:bg-purple-950/20', preview: '#faf5ff', darkPreview: '#3b0764' },
  { id: 'peach', name: 'Gentle Peach', bg: 'bg-orange-50 dark:bg-orange-950/20', preview: '#fff7ed', darkPreview: '#431407' },
  { id: 'rose', name: 'Light Rose', bg: 'bg-pink-50 dark:bg-pink-950/20', preview: '#fdf2f8', darkPreview: '#500724' },
  { id: 'sage', name: 'Calm Sage', bg: 'bg-green-50 dark:bg-green-950/20', preview: '#f0fdf4', darkPreview: '#052e16' },
  { id: 'sky', name: 'Clear Sky', bg: 'bg-cyan-50 dark:bg-cyan-950/20', preview: '#ecfeff', darkPreview: '#083344' },
  { id: 'cream', name: 'Soft Cream', bg: 'bg-yellow-50 dark:bg-yellow-950/20', preview: '#fefce8', darkPreview: '#422006' },
];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [backgroundColor, setBackgroundColorState] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved || DEFAULT_COLOR;
  });

  const setBackgroundColor = (color: string) => {
    setBackgroundColorState(color);
    localStorage.setItem(STORAGE_KEY, color);
  };

  const resetBackgroundColor = () => {
    setBackgroundColor(DEFAULT_COLOR);
  };

  const getBackgroundClass = () => {
    const scheme = colorSchemes.find(s => s.id === backgroundColor);
    return scheme ? scheme.bg : colorSchemes[0].bg;
  };

  return (
    <ThemeContext.Provider value={{ backgroundColor, setBackgroundColor, resetBackgroundColor, getBackgroundClass }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
