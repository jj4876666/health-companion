import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceGuidance: boolean;
  simpleNavigation: boolean;
  screenReaderOptimized: boolean;
  textToSpeechEnabled: boolean;
  speechToTextEnabled: boolean;
  fontScale: number; // 1.0 = normal, 1.25, 1.5, 1.75, 2.0
  backgroundColor: string; // 'default' | 'cream' | 'sepia' | 'dark' | 'blue'
  contrastLevel: 'normal' | 'high' | 'highest';
  cursorSize: 'normal' | 'large' | 'larger';
  lineSpacing: 'normal' | 'wide' | 'wider';
  autoReadContent: boolean;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  getFontScale: () => number;
  announceToScreenReader: (message: string) => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
}

const defaultSettings: AccessibilitySettings = {
  largeText: false,
  highContrast: false,
  reducedMotion: false,
  voiceGuidance: false,
  simpleNavigation: false,
  screenReaderOptimized: false,
  textToSpeechEnabled: true,
  speechToTextEnabled: true,
  fontScale: 1.0,
  backgroundColor: 'default',
  contrastLevel: 'normal',
  cursorSize: 'normal',
  lineSpacing: 'normal',
  autoReadContent: false,
};

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AccessibilitySettings>(() => {
    const saved = localStorage.getItem('emec-accessibility-settings');
    if (saved) {
      try {
        return { ...defaultSettings, ...JSON.parse(saved) };
      } catch {
        return defaultSettings;
      }
    }
    return defaultSettings;
  });
  
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Persist settings to localStorage
  useEffect(() => {
    localStorage.setItem('emec-accessibility-settings', JSON.stringify(settings));
  }, [settings]);

  // Apply accessibility classes to document
  useEffect(() => {
    const html = document.documentElement;
    
    // Font scale
    html.style.fontSize = `${settings.fontScale * 100}%`;

    // Large text (legacy support)
    if (settings.largeText || settings.fontScale > 1) {
      html.classList.add('text-lg');
    } else {
      html.classList.remove('text-lg');
    }

    // High contrast
    if (settings.highContrast || settings.contrastLevel !== 'normal') {
      html.classList.add('high-contrast');
      if (settings.contrastLevel === 'highest') {
        html.classList.add('highest-contrast');
      } else {
        html.classList.remove('highest-contrast');
      }
    } else {
      html.classList.remove('high-contrast', 'highest-contrast');
    }

    // Reduced motion
    if (settings.reducedMotion) {
      html.classList.add('reduce-motion');
    } else {
      html.classList.remove('reduce-motion');
    }

    // Background color themes
    html.classList.remove('bg-cream', 'bg-sepia', 'bg-dark-mode', 'bg-blue-light');
    switch (settings.backgroundColor) {
      case 'cream':
        html.classList.add('bg-cream');
        break;
      case 'sepia':
        html.classList.add('bg-sepia');
        break;
      case 'dark':
        html.classList.add('bg-dark-mode');
        break;
      case 'blue':
        html.classList.add('bg-blue-light');
        break;
    }

    // Line spacing
    html.classList.remove('line-spacing-wide', 'line-spacing-wider');
    if (settings.lineSpacing === 'wide') {
      html.classList.add('line-spacing-wide');
    } else if (settings.lineSpacing === 'wider') {
      html.classList.add('line-spacing-wider');
    }

    // Cursor size
    html.classList.remove('cursor-large', 'cursor-larger');
    if (settings.cursorSize === 'large') {
      html.classList.add('cursor-large');
    } else if (settings.cursorSize === 'larger') {
      html.classList.add('cursor-larger');
    }

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      html.setAttribute('aria-live', 'polite');
    } else {
      html.removeAttribute('aria-live');
    }
  }, [settings]);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K, 
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    localStorage.removeItem('emec-accessibility-settings');
  };

  const getFontScale = () => {
    return settings.fontScale;
  };

  const announceToScreenReader = (message: string) => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  };

  const speak = (text: string) => {
    if (!settings.textToSpeechEnabled || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  return (
    <AccessibilityContext.Provider
      value={{
        settings,
        updateSetting,
        resetSettings,
        getFontScale,
        announceToScreenReader,
        speak,
        stopSpeaking,
        isSpeaking,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}
