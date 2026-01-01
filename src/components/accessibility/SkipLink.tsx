import { useAccessibility } from '@/contexts/AccessibilityContext';

export function SkipLink() {
  const { focusMain, announceToScreenReader } = useAccessibility();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    focusMain();
    announceToScreenReader('Skipped to main content');
  };

  return (
    <a
      href="#main-content"
      onClick={handleClick}
      className="skip-link"
      aria-label="Skip to main content"
    >
      Skip to main content
    </a>
  );
}