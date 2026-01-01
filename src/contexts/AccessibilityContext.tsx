import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

export interface AccessibilitySettings {
  largeText: boolean;
  highContrast: boolean;
  reducedMotion: boolean;
  voiceGuidance: boolean;
  simpleNavigation: boolean;
  screenReaderOptimized: boolean;
  textToSpeechEnabled: boolean;
  speechToTextEnabled: boolean;
  fontScale: number;
  backgroundColor: string;
  contrastLevel: 'normal' | 'high' | 'highest';
  cursorSize: 'normal' | 'large' | 'larger';
  lineSpacing: 'normal' | 'wide' | 'wider';
  autoReadContent: boolean;
  // Enhanced accessibility features
  dyslexiaFont: boolean;
  readingGuide: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'monochrome';
  focusIndicator: 'default' | 'enhanced' | 'high-visibility';
  keyboardNavigation: boolean;
  speechRate: number;
  speechPitch: number;
  linkHighlight: boolean;
  imageDescriptions: boolean;
  simplifiedUI: boolean;
  buttonSize: 'normal' | 'large' | 'extra-large';
  wordSpacing: 'normal' | 'wide' | 'wider';
  letterSpacing: 'normal' | 'wide' | 'wider';
  readingMask: boolean;
  saturationLevel: number;
}

interface AccessibilityContextType {
  settings: AccessibilitySettings;
  updateSetting: <K extends keyof AccessibilitySettings>(key: K, value: AccessibilitySettings[K]) => void;
  resetSettings: () => void;
  getFontScale: () => number;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
  speak: (text: string) => void;
  stopSpeaking: () => void;
  isSpeaking: boolean;
  focusMain: () => void;
  enableProfile: (profile: 'visual' | 'motor' | 'cognitive' | 'hearing') => void;
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
  dyslexiaFont: false,
  readingGuide: false,
  colorBlindMode: 'none',
  focusIndicator: 'default',
  keyboardNavigation: true,
  speechRate: 1.0,
  speechPitch: 1.0,
  linkHighlight: false,
  imageDescriptions: true,
  simplifiedUI: false,
  buttonSize: 'normal',
  wordSpacing: 'normal',
  letterSpacing: 'normal',
  readingMask: false,
  saturationLevel: 100,
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

  // Apply accessibility classes and styles to document
  useEffect(() => {
    const html = document.documentElement;
    
    // Font scale
    html.style.fontSize = `${settings.fontScale * 100}%`;

    // Large text (legacy support)
    html.classList.toggle('text-lg', settings.largeText || settings.fontScale > 1);

    // High contrast
    html.classList.toggle('high-contrast', settings.highContrast || settings.contrastLevel !== 'normal');
    html.classList.toggle('highest-contrast', settings.contrastLevel === 'highest');

    // Reduced motion
    html.classList.toggle('reduce-motion', settings.reducedMotion);

    // Dyslexia font
    html.classList.toggle('dyslexia-font', settings.dyslexiaFont);

    // Reading guide
    html.classList.toggle('reading-guide-active', settings.readingGuide);

    // Reading mask
    html.classList.toggle('reading-mask-active', settings.readingMask);

    // Color blind modes
    html.classList.remove('colorblind-protanopia', 'colorblind-deuteranopia', 'colorblind-tritanopia', 'colorblind-monochrome');
    if (settings.colorBlindMode !== 'none') {
      html.classList.add(`colorblind-${settings.colorBlindMode}`);
    }

    // Focus indicator
    html.classList.remove('focus-enhanced', 'focus-high-visibility');
    if (settings.focusIndicator === 'enhanced') {
      html.classList.add('focus-enhanced');
    } else if (settings.focusIndicator === 'high-visibility') {
      html.classList.add('focus-high-visibility');
    }

    // Keyboard navigation indicator
    html.classList.toggle('keyboard-nav', settings.keyboardNavigation);

    // Link highlighting
    html.classList.toggle('highlight-links', settings.linkHighlight);

    // Simplified UI
    html.classList.toggle('simplified-ui', settings.simplifiedUI);

    // Button sizes
    html.classList.remove('btn-large', 'btn-extra-large');
    if (settings.buttonSize === 'large') {
      html.classList.add('btn-large');
    } else if (settings.buttonSize === 'extra-large') {
      html.classList.add('btn-extra-large');
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

    // Word spacing
    html.classList.remove('word-spacing-wide', 'word-spacing-wider');
    if (settings.wordSpacing === 'wide') {
      html.classList.add('word-spacing-wide');
    } else if (settings.wordSpacing === 'wider') {
      html.classList.add('word-spacing-wider');
    }

    // Letter spacing
    html.classList.remove('letter-spacing-wide', 'letter-spacing-wider');
    if (settings.letterSpacing === 'wide') {
      html.classList.add('letter-spacing-wide');
    } else if (settings.letterSpacing === 'wider') {
      html.classList.add('letter-spacing-wider');
    }

    // Cursor size
    html.classList.remove('cursor-large', 'cursor-larger');
    if (settings.cursorSize === 'large') {
      html.classList.add('cursor-large');
    } else if (settings.cursorSize === 'larger') {
      html.classList.add('cursor-larger');
    }

    // Saturation level
    html.style.setProperty('--saturation-level', `${settings.saturationLevel}%`);

    // Screen reader optimization
    if (settings.screenReaderOptimized) {
      html.setAttribute('aria-live', 'polite');
    } else {
      html.removeAttribute('aria-live');
    }
  }, [settings]);

  // Keyboard navigation detection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        document.documentElement.classList.add('keyboard-user');
      }
    };

    const handleMouseDown = () => {
      document.documentElement.classList.remove('keyboard-user');
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('mousedown', handleMouseDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

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

  const getFontScale = () => settings.fontScale;

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
  }, []);

  const speak = useCallback((text: string) => {
    if (!settings.textToSpeechEnabled || !('speechSynthesis' in window)) return;
    
    speechSynthesis.cancel();
    setIsSpeaking(true);
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate;
    utterance.pitch = settings.speechPitch;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    
    speechSynthesis.speak(utterance);
  }, [settings.textToSpeechEnabled, settings.speechRate, settings.speechPitch]);

  const stopSpeaking = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const focusMain = useCallback(() => {
    const main = document.querySelector('main') || document.querySelector('[role="main"]');
    if (main instanceof HTMLElement) {
      main.focus();
      main.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const enableProfile = useCallback((profile: 'visual' | 'motor' | 'cognitive' | 'hearing') => {
    switch (profile) {
      case 'visual':
        setSettings(prev => ({
          ...prev,
          textToSpeechEnabled: true,
          autoReadContent: true,
          highContrast: true,
          fontScale: 1.5,
          focusIndicator: 'high-visibility',
          linkHighlight: true,
          imageDescriptions: true,
        }));
        break;
      case 'motor':
        setSettings(prev => ({
          ...prev,
          keyboardNavigation: true,
          buttonSize: 'extra-large',
          cursorSize: 'larger',
          focusIndicator: 'enhanced',
          simplifiedUI: true,
        }));
        break;
      case 'cognitive':
        setSettings(prev => ({
          ...prev,
          simplifiedUI: true,
          reducedMotion: true,
          dyslexiaFont: true,
          lineSpacing: 'wide',
          wordSpacing: 'wide',
          readingGuide: true,
        }));
        break;
      case 'hearing':
        setSettings(prev => ({
          ...prev,
          screenReaderOptimized: true,
          textToSpeechEnabled: false,
          highContrast: true,
        }));
        break;
    }
  }, []);

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
        focusMain,
        enableProfile,
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
