import { ReactNode, useEffect } from 'react';
import { useTheme, colorSchemes } from '@/contexts/ThemeContext';

export function BackgroundWrapper({ children }: { children: ReactNode }) {
  const { backgroundColor } = useTheme();
  
  // Apply background color by adding a dynamic CSS class
  useEffect(() => {
    const scheme = colorSchemes.find(s => s.id === backgroundColor);
    const color = scheme?.preview || '#ffffff';
    
    // Remove any existing custom background class
    document.body.classList.forEach(className => {
      if (className.startsWith('custom-bg-')) {
        document.body.classList.remove(className);
      }
    });
    
    // Create a unique class name for this background
    const className = `custom-bg-${backgroundColor}`;
    
    // Check if style element already exists, if not create it
    let styleElement = document.getElementById('custom-background-styles');
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'custom-background-styles';
      document.head.appendChild(styleElement);
    }
    
    // Add CSS rule with !important to override Tailwind
    styleElement.textContent = `
      .${className},
      .${className} #root,
      .${className} > div {
        background-color: ${color} !important;
      }
    `;
    
    // Add the class to body
    document.body.classList.add(className);
    
    console.log('[THEME] Applied background:', backgroundColor, scheme?.name, color);
    
    // Cleanup function
    return () => {
      document.body.classList.remove(className);
    };
  }, [backgroundColor]);
  
  return <>{children}</>;
}
