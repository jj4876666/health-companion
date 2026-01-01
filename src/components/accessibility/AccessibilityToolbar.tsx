import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { 
  Accessibility, ZoomIn, ZoomOut, Volume2, VolumeX, 
  Eye, Palette, X, ChevronUp, ChevronDown
} from 'lucide-react';
import { useAccessibility } from '@/contexts/AccessibilityContext';

interface AccessibilityToolbarProps {
  position?: 'left' | 'right';
}

export function AccessibilityToolbar({ position = 'right' }: AccessibilityToolbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings, updateSetting, speak, stopSpeaking, isSpeaking } = useAccessibility();

  const increaseFontSize = () => {
    const newScale = Math.min(settings.fontScale + 0.25, 2.5);
    updateSetting('fontScale', newScale);
  };

  const decreaseFontSize = () => {
    const newScale = Math.max(settings.fontScale - 0.25, 0.75);
    updateSetting('fontScale', newScale);
  };

  const toggleHighContrast = () => {
    updateSetting('highContrast', !settings.highContrast);
  };

  const toggleTTS = () => {
    if (isSpeaking) {
      stopSpeaking();
    } else {
      updateSetting('textToSpeechEnabled', !settings.textToSpeechEnabled);
    }
  };

  const readPageContent = () => {
    const main = document.querySelector('main');
    if (main) {
      const text = main.textContent || '';
      speak(text.substring(0, 2000)); // Limit to prevent very long readings
    }
  };

  const positionClass = position === 'left' ? 'left-4' : 'right-4';

  return (
    <div className={`fixed bottom-24 ${positionClass} z-50`}>
      {isOpen && (
        <Card className="mb-2 shadow-lg animate-slide-up">
          <CardContent className="p-3 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Accessibility</span>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6"
                onClick={() => setIsOpen(false)}
                aria-label="Close accessibility toolbar"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Font Size Controls */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Font Size</span>
                <span className="text-xs font-medium">{Math.round(settings.fontScale * 100)}%</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={decreaseFontSize}
                  disabled={settings.fontScale <= 0.75}
                  aria-label="Decrease font size"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <Slider
                  value={[settings.fontScale]}
                  min={0.75}
                  max={2.5}
                  step={0.25}
                  onValueChange={([v]) => updateSetting('fontScale', v)}
                  className="flex-1"
                  aria-label="Font size slider"
                />
                <Button
                  size="icon"
                  variant="outline"
                  className="h-8 w-8"
                  onClick={increaseFontSize}
                  disabled={settings.fontScale >= 2.5}
                  aria-label="Increase font size"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Toggles */}
            <div className="grid grid-cols-2 gap-2">
              <Button
                size="sm"
                variant={settings.highContrast ? 'default' : 'outline'}
                className="gap-1 text-xs"
                onClick={toggleHighContrast}
                aria-pressed={settings.highContrast}
              >
                <Eye className="h-3 w-3" />
                Contrast
              </Button>
              <Button
                size="sm"
                variant={settings.textToSpeechEnabled ? 'default' : 'outline'}
                className="gap-1 text-xs"
                onClick={toggleTTS}
                aria-pressed={settings.textToSpeechEnabled}
              >
                {settings.textToSpeechEnabled ? <Volume2 className="h-3 w-3" /> : <VolumeX className="h-3 w-3" />}
                TTS
              </Button>
            </div>

            {/* Expand for more options */}
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs gap-1"
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
            >
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              {isExpanded ? 'Less options' : 'More options'}
            </Button>

            {isExpanded && (
              <div className="space-y-2 pt-2 border-t">
                <Button
                  size="sm"
                  variant={settings.dyslexiaFont ? 'default' : 'outline'}
                  className="w-full text-xs"
                  onClick={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                  aria-pressed={settings.dyslexiaFont}
                >
                  Dyslexia Font
                </Button>
                <Button
                  size="sm"
                  variant={settings.reducedMotion ? 'default' : 'outline'}
                  className="w-full text-xs"
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  aria-pressed={settings.reducedMotion}
                >
                  Reduce Motion
                </Button>
                <Button
                  size="sm"
                  variant={settings.readingGuide ? 'default' : 'outline'}
                  className="w-full text-xs"
                  onClick={() => updateSetting('readingGuide', !settings.readingGuide)}
                  aria-pressed={settings.readingGuide}
                >
                  Reading Guide
                </Button>
                {settings.textToSpeechEnabled && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={readPageContent}
                    disabled={isSpeaking}
                  >
                    <Volume2 className="h-3 w-3 mr-1" />
                    {isSpeaking ? 'Speaking...' : 'Read Page'}
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Button
        size="icon"
        className="h-12 w-12 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle accessibility toolbar"
        aria-expanded={isOpen}
      >
        <Accessibility className="h-5 w-5" />
      </Button>
    </div>
  );
}