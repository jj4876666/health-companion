import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { SpeechRecognitionType, SpeechRecognitionEvent, WindowWithSpeechRecognition } from '@/types/speech';
import { 
  Eye, Type, Volume2, VolumeX, Mic, MousePointer2, RotateCcw, Check, 
  Accessibility, Ear, Hand, Brain, Palette, Focus, Keyboard, 
  ZoomIn, AlignJustify, LetterText, BookOpen, Sparkles,
  User, Settings2, MonitorSmartphone
} from 'lucide-react';
import { useState } from 'react';

const backgroundColors = [
  { id: 'default', label: 'Default', color: 'bg-background' },
  { id: 'cream', label: 'Cream', color: 'bg-amber-50' },
  { id: 'sepia', label: 'Sepia', color: 'bg-orange-100' },
  { id: 'dark', label: 'Dark', color: 'bg-gray-900' },
  { id: 'blue', label: 'Blue Light', color: 'bg-blue-50' },
];

const colorBlindModes = [
  { id: 'none', label: 'None' },
  { id: 'protanopia', label: 'Protanopia (Red-blind)' },
  { id: 'deuteranopia', label: 'Deuteranopia (Green-blind)' },
  { id: 'tritanopia', label: 'Tritanopia (Blue-blind)' },
  { id: 'monochrome', label: 'Monochrome' },
];

export default function AccessibilityPage() {
  const { 
    settings, 
    updateSetting, 
    resetSettings, 
    speak, 
    stopSpeaking, 
    isSpeaking,
    enableProfile,
    announceToScreenReader 
  } = useAccessibility();
  const { language } = useLanguage();
  const [testText, setTestText] = useState('');

  const getLocalizedText = (en: string, sw: string, fr: string) => {
    return language === 'sw' ? sw : language === 'fr' ? fr : en;
  };

  const handleTestTTS = () => {
    const text = getLocalizedText(
      'This is a test of the text-to-speech feature. Your accessibility settings are working correctly.',
      'Hii ni jaribio la kipengele cha kusoma maandishi. Mipangilio yako ya ufikio inafanya kazi vizuri.',
      'Ceci est un test de la fonction de synthèse vocale. Vos paramètres d\'accessibilité fonctionnent correctement.'
    );
    speak(text);
    announceToScreenReader('Testing text-to-speech');
  };

  const handleTestSTT = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const win = window as unknown as WindowWithSpeechRecognition;
      const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition: SpeechRecognitionType = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : 'en-US';
        recognition.onresult = (event: SpeechRecognitionEvent) => {
          setTestText(event.results[0][0].transcript);
          announceToScreenReader(`You said: ${event.results[0][0].transcript}`);
        };
        recognition.start();
        announceToScreenReader('Listening for speech input');
      }
    }
  };

  const handleEnableProfile = (profile: 'visual' | 'motor' | 'cognitive' | 'hearing') => {
    enableProfile(profile);
    announceToScreenReader(`${profile} accessibility profile enabled`);
  };

  return (
    <PageLayout>
      {/* Skip Link for keyboard navigation */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="space-y-6" id="main-content" tabIndex={-1}>
        {/* Active Settings Status Bar */}
        <div className="flex flex-wrap gap-2" role="status" aria-label="Active accessibility settings">
          <Badge variant={settings.textToSpeechEnabled ? 'default' : 'secondary'} className="gap-1">
            <Volume2 className="w-3 h-3" aria-hidden="true" />TTS {settings.textToSpeechEnabled ? 'ON' : 'OFF'}
          </Badge>
          <Badge variant={settings.speechToTextEnabled ? 'default' : 'secondary'} className="gap-1">
            <Mic className="w-3 h-3" aria-hidden="true" />STT {settings.speechToTextEnabled ? 'ON' : 'OFF'}
          </Badge>
          <Badge variant={settings.highContrast ? 'default' : 'secondary'} className="gap-1">
            <Eye className="w-3 h-3" aria-hidden="true" />Contrast {settings.highContrast ? 'HIGH' : 'NORMAL'}
          </Badge>
          <Badge variant="outline" className="gap-1">
            <Type className="w-3 h-3" aria-hidden="true" />Font {Math.round(settings.fontScale * 100)}%
          </Badge>
          {settings.dyslexiaFont && (
            <Badge variant="default" className="gap-1">
              <BookOpen className="w-3 h-3" aria-hidden="true" />Dyslexia Font
            </Badge>
          )}
          {settings.keyboardNavigation && (
            <Badge variant="default" className="gap-1">
              <Keyboard className="w-3 h-3" aria-hidden="true" />Keyboard Nav
            </Badge>
          )}
        </div>

        {/* Quick Accessibility Profiles */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" aria-hidden="true" />
              {getLocalizedText('Quick Accessibility Profiles', 'Profaili za Haraka za Ufikiaji', 'Profils d\'accessibilité rapides')}
            </CardTitle>
            <CardDescription>
              {getLocalizedText(
                'Enable pre-configured settings for different accessibility needs',
                'Wezesha mipangilio iliyowekwa tayari kwa mahitaji tofauti ya ufikiaji',
                'Activer les paramètres préconfigurés pour différents besoins d\'accessibilité'
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 border-2 hover:border-primary"
                onClick={() => handleEnableProfile('visual')}
                aria-describedby="visual-desc"
              >
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <Eye className="w-6 h-6 text-blue-600 dark:text-blue-300" aria-hidden="true" />
                </div>
                <span className="font-semibold">Visual Impairment</span>
                <span id="visual-desc" className="text-xs text-muted-foreground text-center">TTS, high contrast, large fonts, focus indicators</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 border-2 hover:border-primary"
                onClick={() => handleEnableProfile('hearing')}
                aria-describedby="hearing-desc"
              >
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <Ear className="w-6 h-6 text-green-600 dark:text-green-300" aria-hidden="true" />
                </div>
                <span className="font-semibold">Hearing Impairment</span>
                <span id="hearing-desc" className="text-xs text-muted-foreground text-center">Visual alerts, captions, screen reader optimized</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 border-2 hover:border-primary"
                onClick={() => handleEnableProfile('motor')}
                aria-describedby="motor-desc"
              >
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Hand className="w-6 h-6 text-purple-600 dark:text-purple-300" aria-hidden="true" />
                </div>
                <span className="font-semibold">Motor Impairment</span>
                <span id="motor-desc" className="text-xs text-muted-foreground text-center">Large buttons, keyboard nav, simplified UI</span>
              </Button>

              <Button
                variant="outline"
                className="h-auto flex-col gap-2 p-4 border-2 hover:border-primary"
                onClick={() => handleEnableProfile('cognitive')}
                aria-describedby="cognitive-desc"
              >
                <div className="p-3 rounded-full bg-amber-100 dark:bg-amber-900">
                  <Brain className="w-6 h-6 text-amber-600 dark:text-amber-300" aria-hidden="true" />
                </div>
                <span className="font-semibold">Cognitive Support</span>
                <span id="cognitive-desc" className="text-xs text-muted-foreground text-center">Dyslexia font, reading guide, reduced motion</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabbed Settings Interface */}
        <Tabs defaultValue="speech" className="space-y-4">
          <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full" aria-label="Accessibility settings categories">
            <TabsTrigger value="speech" className="gap-2">
              <Volume2 className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Speech</span>
            </TabsTrigger>
            <TabsTrigger value="visual" className="gap-2">
              <Eye className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Visual</span>
            </TabsTrigger>
            <TabsTrigger value="reading" className="gap-2">
              <Type className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Reading</span>
            </TabsTrigger>
            <TabsTrigger value="interaction" className="gap-2">
              <MousePointer2 className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Interaction</span>
            </TabsTrigger>
          </TabsList>

          {/* Speech Settings */}
          <TabsContent value="speech">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Volume2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    {getLocalizedText('Text-to-Speech', 'Kusoma Maandishi', 'Synthèse vocale')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="tts-toggle" className="font-medium cursor-pointer">
                      {getLocalizedText('Enable TTS', 'Wezesha TTS', 'Activer TTS')}
                    </label>
                    <Switch 
                      id="tts-toggle"
                      checked={settings.textToSpeechEnabled} 
                      onCheckedChange={(v) => updateSetting('textToSpeechEnabled', v)} 
                      aria-describedby="tts-desc"
                    />
                  </div>
                  <p id="tts-desc" className="text-sm text-muted-foreground">
                    Read page content aloud using speech synthesis
                  </p>

                  <Separator />

                  <div className="space-y-3">
                    <label className="font-medium">Speech Rate: {settings.speechRate.toFixed(1)}x</label>
                    <Slider
                      value={[settings.speechRate]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={([v]) => updateSetting('speechRate', v)}
                      aria-label="Speech rate"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-medium">Speech Pitch: {settings.speechPitch.toFixed(1)}</label>
                    <Slider
                      value={[settings.speechPitch]}
                      min={0.5}
                      max={2}
                      step={0.1}
                      onValueChange={([v]) => updateSetting('speechPitch', v)}
                      aria-label="Speech pitch"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="auto-read" className="font-medium cursor-pointer">
                      {getLocalizedText('Auto-read Content', 'Soma Moja kwa Moja', 'Lecture auto')}
                    </label>
                    <Switch 
                      id="auto-read"
                      checked={settings.autoReadContent} 
                      onCheckedChange={(v) => updateSetting('autoReadContent', v)} 
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={handleTestTTS} 
                      disabled={!settings.textToSpeechEnabled || isSpeaking} 
                      className="flex-1"
                      aria-label="Test text to speech"
                    >
                      <Volume2 className="w-4 h-4 mr-2" aria-hidden="true" />
                      Test TTS
                    </Button>
                    {isSpeaking && (
                      <Button onClick={stopSpeaking} variant="destructive" aria-label="Stop speaking">
                        <VolumeX className="w-4 h-4" aria-hidden="true" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Mic className="w-5 h-5 text-primary" aria-hidden="true" />
                    {getLocalizedText('Speech-to-Text', 'Sauti hadi Maandishi', 'Reconnaissance vocale')}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="stt-toggle" className="font-medium cursor-pointer">
                      {getLocalizedText('Enable STT', 'Wezesha STT', 'Activer STT')}
                    </label>
                    <Switch 
                      id="stt-toggle"
                      checked={settings.speechToTextEnabled} 
                      onCheckedChange={(v) => updateSetting('speechToTextEnabled', v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="voice-guidance" className="font-medium cursor-pointer">
                      {getLocalizedText('Voice Guidance', 'Mwongozo wa Sauti', 'Guidage vocal')}
                    </label>
                    <Switch 
                      id="voice-guidance"
                      checked={settings.voiceGuidance} 
                      onCheckedChange={(v) => updateSetting('voiceGuidance', v)} 
                    />
                  </div>

                  <Button 
                    onClick={handleTestSTT} 
                    disabled={!settings.speechToTextEnabled} 
                    className="w-full"
                    aria-label="Test voice input"
                  >
                    <Mic className="w-4 h-4 mr-2" aria-hidden="true" />
                    Test Voice Input
                  </Button>

                  {testText && (
                    <div className="p-3 bg-muted rounded-lg" role="status" aria-live="polite">
                      <p className="text-sm text-muted-foreground">You said:</p>
                      <p className="text-primary font-medium">{testText}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Visual Settings */}
          <TabsContent value="visual">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Palette className="w-5 h-5 text-primary" aria-hidden="true" />
                    Colors & Contrast
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="high-contrast" className="font-medium cursor-pointer">
                      {getLocalizedText('High Contrast', 'Tofauti Kubwa', 'Contraste élevé')}
                    </label>
                    <Switch 
                      id="high-contrast"
                      checked={settings.highContrast} 
                      onCheckedChange={(v) => updateSetting('highContrast', v)} 
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="font-medium">Contrast Level</label>
                    <div className="flex gap-2">
                      {(['normal', 'high', 'highest'] as const).map((level) => (
                        <Button
                          key={level}
                          variant={settings.contrastLevel === level ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('contrastLevel', level)}
                          className="flex-1 capitalize"
                        >
                          {level}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <label className="font-medium">Background Color</label>
                    <div className="flex flex-wrap gap-2">
                      {backgroundColors.map((bg) => (
                        <Button
                          key={bg.id}
                          variant={settings.backgroundColor === bg.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('backgroundColor', bg.id)}
                          aria-pressed={settings.backgroundColor === bg.id}
                        >
                          <div className={`w-4 h-4 rounded-full border mr-2 ${bg.color}`} aria-hidden="true" />
                          {bg.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <label className="font-medium">Saturation: {settings.saturationLevel}%</label>
                    <Slider
                      value={[settings.saturationLevel]}
                      min={0}
                      max={150}
                      step={10}
                      onValueChange={([v]) => updateSetting('saturationLevel', v)}
                      aria-label="Color saturation level"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
                    Color Vision
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="font-medium">Color Blind Mode</label>
                    <div className="grid grid-cols-1 gap-2">
                      {colorBlindModes.map((mode) => (
                        <Button
                          key={mode.id}
                          variant={settings.colorBlindMode === mode.id ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('colorBlindMode', mode.id as 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia')}
                          className="justify-start"
                          aria-pressed={settings.colorBlindMode === mode.id}
                        >
                          {mode.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <label htmlFor="reduce-motion" className="font-medium cursor-pointer">
                      {getLocalizedText('Reduce Motion', 'Punguza Mwendo', 'Réduire mouvements')}
                    </label>
                    <Switch 
                      id="reduce-motion"
                      checked={settings.reducedMotion} 
                      onCheckedChange={(v) => updateSetting('reducedMotion', v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label htmlFor="simplified-ui" className="font-medium cursor-pointer">
                      Simplified UI
                    </label>
                    <Switch 
                      id="simplified-ui"
                      checked={settings.simplifiedUI} 
                      onCheckedChange={(v) => updateSetting('simplifiedUI', v)} 
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reading Settings */}
          <TabsContent value="reading">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ZoomIn className="w-5 h-5 text-primary" aria-hidden="true" />
                    Text Size & Font
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="font-medium">
                      Font Size: {Math.round(settings.fontScale * 100)}%
                    </label>
                    <Slider
                      value={[settings.fontScale]}
                      min={0.75}
                      max={2.5}
                      step={0.25}
                      onValueChange={([v]) => updateSetting('fontScale', v)}
                      aria-label="Font size"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>75%</span>
                      <span>100%</span>
                      <span>150%</span>
                      <span>200%</span>
                      <span>250%</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <label htmlFor="dyslexia-font" className="font-medium cursor-pointer">
                      Dyslexia-Friendly Font
                    </label>
                    <Switch 
                      id="dyslexia-font"
                      checked={settings.dyslexiaFont} 
                      onCheckedChange={(v) => updateSetting('dyslexiaFont', v)} 
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use OpenDyslexic font designed for readers with dyslexia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <AlignJustify className="w-5 h-5 text-primary" aria-hidden="true" />
                    Spacing
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="font-medium">Line Spacing</label>
                    <div className="flex gap-2">
                      {(['normal', 'wide', 'wider'] as const).map((spacing) => (
                        <Button
                          key={spacing}
                          variant={settings.lineSpacing === spacing ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('lineSpacing', spacing)}
                          className="flex-1 capitalize"
                        >
                          {spacing}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-medium">Word Spacing</label>
                    <div className="flex gap-2">
                      {(['normal', 'wide', 'wider'] as const).map((spacing) => (
                        <Button
                          key={spacing}
                          variant={settings.wordSpacing === spacing ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('wordSpacing', spacing)}
                          className="flex-1 capitalize"
                        >
                          {spacing}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="font-medium">Letter Spacing</label>
                    <div className="flex gap-2">
                      {(['normal', 'wide', 'wider'] as const).map((spacing) => (
                        <Button
                          key={spacing}
                          variant={settings.letterSpacing === spacing ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('letterSpacing', spacing)}
                          className="flex-1 capitalize"
                        >
                          {spacing}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
                    Reading Aids
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <label htmlFor="reading-guide" className="font-medium cursor-pointer">
                        Reading Guide
                      </label>
                      <Switch 
                        id="reading-guide"
                        checked={settings.readingGuide} 
                        onCheckedChange={(v) => updateSetting('readingGuide', v)} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <label htmlFor="reading-mask" className="font-medium cursor-pointer">
                        Reading Mask
                      </label>
                      <Switch 
                        id="reading-mask"
                        checked={settings.readingMask} 
                        onCheckedChange={(v) => updateSetting('readingMask', v)} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <label htmlFor="link-highlight" className="font-medium cursor-pointer">
                        Highlight Links
                      </label>
                      <Switch 
                        id="link-highlight"
                        checked={settings.linkHighlight} 
                        onCheckedChange={(v) => updateSetting('linkHighlight', v)} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Interaction Settings */}
          <TabsContent value="interaction">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Keyboard className="w-5 h-5 text-primary" aria-hidden="true" />
                    Keyboard & Focus
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label htmlFor="keyboard-nav" className="font-medium cursor-pointer">
                      Keyboard Navigation
                    </label>
                    <Switch 
                      id="keyboard-nav"
                      checked={settings.keyboardNavigation} 
                      onCheckedChange={(v) => updateSetting('keyboardNavigation', v)} 
                    />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <label className="font-medium">Focus Indicator Style</label>
                    <div className="grid gap-2">
                      {(['default', 'enhanced', 'high-visibility'] as const).map((style) => (
                        <Button
                          key={style}
                          variant={settings.focusIndicator === style ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('focusIndicator', style)}
                          className="justify-start capitalize"
                        >
                          <Focus className="w-4 h-4 mr-2" aria-hidden="true" />
                          {style.replace('-', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <MousePointer2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    Cursor & Buttons
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <label className="font-medium">Cursor Size</label>
                    <div className="flex gap-2">
                      {(['normal', 'large', 'larger'] as const).map((size) => (
                        <Button
                          key={size}
                          variant={settings.cursorSize === size ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('cursorSize', size)}
                          className="flex-1 capitalize"
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <label className="font-medium">Button Size</label>
                    <div className="flex gap-2">
                      {(['normal', 'large', 'extra-large'] as const).map((size) => (
                        <Button
                          key={size}
                          variant={settings.buttonSize === size ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateSetting('buttonSize', size)}
                          className="flex-1 capitalize"
                        >
                          {size.replace('-', ' ')}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Settings2 className="w-5 h-5 text-primary" aria-hidden="true" />
                    Additional Options
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <label htmlFor="screen-reader" className="font-medium cursor-pointer">
                        Screen Reader Optimized
                      </label>
                      <Switch 
                        id="screen-reader"
                        checked={settings.screenReaderOptimized} 
                        onCheckedChange={(v) => updateSetting('screenReaderOptimized', v)} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <label htmlFor="image-desc" className="font-medium cursor-pointer">
                        Image Descriptions
                      </label>
                      <Switch 
                        id="image-desc"
                        checked={settings.imageDescriptions} 
                        onCheckedChange={(v) => updateSetting('imageDescriptions', v)} 
                      />
                    </div>

                    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                      <label htmlFor="simple-nav" className="font-medium cursor-pointer">
                        Simple Navigation
                      </label>
                      <Switch 
                        id="simple-nav"
                        checked={settings.simpleNavigation} 
                        onCheckedChange={(v) => updateSetting('simpleNavigation', v)} 
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Active Settings Summary */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Check className="w-4 h-4 text-success" aria-hidden="true" />
              Active Settings Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2" role="list" aria-label="Currently active accessibility settings">
              {settings.textToSpeechEnabled && <Badge role="listitem">Text-to-Speech</Badge>}
              {settings.speechToTextEnabled && <Badge role="listitem">Speech-to-Text</Badge>}
              {settings.highContrast && <Badge role="listitem">High Contrast</Badge>}
              {settings.reducedMotion && <Badge role="listitem">Reduced Motion</Badge>}
              {settings.dyslexiaFont && <Badge role="listitem">Dyslexia Font</Badge>}
              {settings.readingGuide && <Badge role="listitem">Reading Guide</Badge>}
              {settings.keyboardNavigation && <Badge role="listitem">Keyboard Navigation</Badge>}
              {settings.linkHighlight && <Badge role="listitem">Link Highlighting</Badge>}
              {settings.simplifiedUI && <Badge role="listitem">Simplified UI</Badge>}
              {settings.fontScale !== 1 && <Badge role="listitem">Font {Math.round(settings.fontScale * 100)}%</Badge>}
              {settings.backgroundColor !== 'default' && <Badge role="listitem">Background: {settings.backgroundColor}</Badge>}
              {settings.colorBlindMode !== 'none' && <Badge role="listitem">Color Filter: {settings.colorBlindMode}</Badge>}
              {settings.cursorSize !== 'normal' && <Badge role="listitem">Large Cursor</Badge>}
              {settings.buttonSize !== 'normal' && <Badge role="listitem">Large Buttons</Badge>}
            </div>
          </CardContent>
        </Card>

        {/* Reset Button */}
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={resetSettings} 
            className="gap-2"
            aria-label="Reset all accessibility settings to defaults"
          >
            <RotateCcw className="w-4 h-4" aria-hidden="true" />
            Reset All Settings to Defaults
          </Button>
        </div>
      </div>

      {/* Color blind filter SVGs (hidden) */}
      <svg style={{ position: 'absolute', height: 0 }}>
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0,     0, 0
                                                  0.558, 0.442, 0,     0, 0
                                                  0,     0.242, 0.758, 0, 0
                                                  0,     0,     0,     1, 0"/>
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0,   0, 0
                                                  0.7,   0.3,   0,   0, 0
                                                  0,     0.3,   0.7, 0, 0
                                                  0,     0,     0,   1, 0"/>
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95, 0.05,  0,     0, 0
                                                  0,    0.433, 0.567, 0, 0
                                                  0,    0.475, 0.525, 0, 0
                                                  0,    0,     0,     1, 0"/>
          </filter>
        </defs>
      </svg>
    </PageLayout>
  );
}