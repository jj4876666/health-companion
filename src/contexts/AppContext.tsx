import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AppContextType {
  isOnline: boolean;
  showOfflineAlert: boolean;
  dismissOfflineAlert: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(true);
  const [showOfflineAlert, setShowOfflineAlert] = useState(false);

  // Simulate offline detection
  useEffect(() => {
    // For demo: simulate going offline randomly or based on a toggle
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineAlert(false);
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineAlert(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const dismissOfflineAlert = () => {
    setShowOfflineAlert(false);
  };

  const resetDemoData = () => {
    // Clear all EMEC-related localStorage
    const keysToRemove = [
      'emec_auth',
      'emec_audit_log',
      'emec_language',
      'emec_theme',
      'emec_settings',
      'emec_child_data',
      'emec_quiz_results',
    ];
    
    keysToRemove.forEach((key) => localStorage.removeItem(key));
    
    // Reload to reset state
    window.location.reload();
  };

  return (
    <AppContext.Provider
      value={{
        isOnline,
        showOfflineAlert,
        dismissOfflineAlert,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
