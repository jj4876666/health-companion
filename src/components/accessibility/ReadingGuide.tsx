import { useEffect, useState } from 'react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

export function ReadingGuide() {
  const { settings } = useAccessibility();
  const [position, setPosition] = useState({ y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!settings.readingGuide) {
      setIsVisible(false);
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.body.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [settings.readingGuide]);

  if (!settings.readingGuide || !isVisible) return null;

  return (
    <>
      {/* Horizontal reading line */}
      <div
        className="fixed left-0 right-0 h-1 bg-primary/60 pointer-events-none z-[9997] transition-transform duration-75"
        style={{ top: position.y - 2 }}
        aria-hidden="true"
      />
      {/* Highlight band around the line */}
      <div
        className="fixed left-0 right-0 h-8 bg-primary/10 pointer-events-none z-[9996] transition-transform duration-75"
        style={{ top: position.y - 16 }}
        aria-hidden="true"
      />
    </>
  );
}