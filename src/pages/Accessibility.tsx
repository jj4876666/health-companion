import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { PageLayout } from '@/components/layout/PageLayout';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Eye, Type, Volume2, VolumeX, Mic, MousePointer2, RotateCcw, Check, Accessibility, Ear, Hand, Brain } from 'lucide-react';
import { useState } from 'react';

const backgroundColors = [
  { id: 'default', label: 'Default', color: 'bg-background' },
  { id: 'cream', label: 'Cream', color: 'bg-amber-50' },
  { id: 'sepia', label: 'Sepia', color: 'bg-orange-100' },
  { id: 'dark', label: 'Dark', color: 'bg-gray-900' },
  { id: 'blue', label: 'Blue Light', color: 'bg-blue-50' },
];

export default function AccessibilityPage() {
  const { settings, updateSetting, resetSettings, speak, stopSpeaking, isSpeaking } = useAccessibility();
  const { language } = useLanguage();
  const [testText, setTestText] = useState('');

  const getLocalizedText = (en: string, sw: string, fr: string) => {
    return language === 'sw' ? sw : language === 'fr' ? fr : en;
  };

  const handleTestTTS = () => {
    const text = getLocalizedText(
      'This is a test of the text-to-speech feature.',
      'Hii ni jaribio la kipengele cha kusoma maandishi.',
      'Ceci est un test de la fonction de synthèse vocale.'
    );
    speak(text);
  };

  const handleTestSTT = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : 'en-US';
      recognition.onresult = (event: any) => setTestText(event.results[0][0].transcript);
      recognition.start();
    }
  };

  return (
    <PageLayout
      title={getLocalizedText('Accessibility Settings', 'Mipangilio ya Ufikiaji', 'Paramètres d\'accessibilité')}
      description={getLocalizedText('Customize your experience for better accessibility', 'Badilisha uzoefu wako kwa ufikiaji bora', 'Personnalisez votre expérience pour une meilleure accessibilité')}
    >
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Badge variant={settings.textToSpeechEnabled ? 'default' : 'secondary'} className="gap-1"><Volume2 className="w-3 h-3" />TTS {settings.textToSpeechEnabled ? 'ON' : 'OFF'}</Badge>
          <Badge variant={settings.speechToTextEnabled ? 'default' : 'secondary'} className="gap-1"><Mic className="w-3 h-3" />STT {settings.speechToTextEnabled ? 'ON' : 'OFF'}</Badge>
          <Badge variant={settings.highContrast ? 'default' : 'secondary'} className="gap-1"><Eye className="w-3 h-3" />Contrast {settings.highContrast ? 'ON' : 'OFF'}</Badge>
          <Badge variant="outline" className="gap-1"><Type className="w-3 h-3" />Font {Math.round(settings.fontScale * 100)}%</Badge>
        </div>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Volume2 className="w-5 h-5 text-primary" />{getLocalizedText('Text-to-Speech', 'Kusoma Maandishi', 'Synthèse vocale')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="font-medium">{getLocalizedText('Enable TTS', 'Wezesha TTS', 'Activer TTS')}</p></div><Switch checked={settings.textToSpeechEnabled} onCheckedChange={(v) => updateSetting('textToSpeechEnabled', v)} /></div>
            <div className="flex items-center justify-between"><div><p className="font-medium">{getLocalizedText('Auto-read Content', 'Soma Moja kwa Moja', 'Lecture auto')}</p></div><Switch checked={settings.autoReadContent} onCheckedChange={(v) => updateSetting('autoReadContent', v)} /></div>
            <div className="flex gap-2"><Button onClick={handleTestTTS} disabled={!settings.textToSpeechEnabled || isSpeaking} className="flex-1"><Volume2 className="w-4 h-4 mr-2" />Test TTS</Button>{isSpeaking && <Button onClick={stopSpeaking} variant="destructive"><VolumeX className="w-4 h-4" /></Button>}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Mic className="w-5 h-5 text-primary" />{getLocalizedText('Speech-to-Text', 'Sauti hadi Maandishi', 'Reconnaissance vocale')}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between"><div><p className="font-medium">{getLocalizedText('Enable STT', 'Wezesha STT', 'Activer STT')}</p></div><Switch checked={settings.speechToTextEnabled} onCheckedChange={(v) => updateSetting('speechToTextEnabled', v)} /></div>
            <div className="flex items-center justify-between"><div><p className="font-medium">{getLocalizedText('Voice Guidance', 'Mwongozo wa Sauti', 'Guidage vocal')}</p></div><Switch checked={settings.voiceGuidance} onCheckedChange={(v) => updateSetting('voiceGuidance', v)} /></div>
            <Button onClick={handleTestSTT} disabled={!settings.speechToTextEnabled} className="w-full"><Mic className="w-4 h-4 mr-2" />Test Voice</Button>
            {testText && <div className="p-3 bg-muted rounded-lg"><p className="text-primary">{testText}</p></div>}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-primary" />{getLocalizedText('Visual Settings', 'Mipangilio ya Kuona', 'Paramètres visuels')}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3"><p className="font-medium">{getLocalizedText('Font Size', 'Ukubwa wa Maandishi', 'Taille de police')} ({Math.round(settings.fontScale * 100)}%)</p><Slider value={[settings.fontScale]} min={0.75} max={2} step={0.25} onValueChange={([v]) => updateSetting('fontScale', v)} /></div>
            <Separator />
            <div className="space-y-3"><p className="font-medium">{getLocalizedText('Background Color', 'Rangi ya Mandharinyuma', 'Couleur de fond')}</p><div className="flex flex-wrap gap-2">{backgroundColors.map((bg) => (<Button key={bg.id} variant={settings.backgroundColor === bg.id ? 'default' : 'outline'} size="sm" onClick={() => updateSetting('backgroundColor', bg.id)}><div className={`w-4 h-4 rounded-full border mr-2 ${bg.color}`} />{bg.label}</Button>))}</div></div>
            <Separator />
            <div className="flex items-center justify-between"><div><p className="font-medium">{getLocalizedText('High Contrast', 'Tofauti Kubwa', 'Contraste élevé')}</p></div><Switch checked={settings.highContrast} onCheckedChange={(v) => updateSetting('highContrast', v)} /></div>
            <div className="flex items-center justify-between"><div><p className="font-medium">{getLocalizedText('Reduce Motion', 'Punguza Mwendo', 'Réduire mouvements')}</p></div><Switch checked={settings.reducedMotion} onCheckedChange={(v) => updateSetting('reducedMotion', v)} /></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Accessibility className="w-5 h-5 text-primary" />Resources</CardTitle></CardHeader>
          <CardContent><div className="grid gap-3 sm:grid-cols-2">
            <Card className="border-2 p-4"><div className="flex items-center gap-3 mb-2"><div className="p-2 rounded-full bg-blue-100"><Eye className="w-5 h-5 text-blue-600" /></div><h4 className="font-semibold">Visual Impairment</h4></div><p className="text-sm text-muted-foreground">TTS, high contrast, large fonts</p></Card>
            <Card className="border-2 p-4"><div className="flex items-center gap-3 mb-2"><div className="p-2 rounded-full bg-green-100"><Ear className="w-5 h-5 text-green-600" /></div><h4 className="font-semibold">Hearing Impairment</h4></div><p className="text-sm text-muted-foreground">Visual alerts, captions, STT</p></Card>
            <Card className="border-2 p-4"><div className="flex items-center gap-3 mb-2"><div className="p-2 rounded-full bg-purple-100"><Hand className="w-5 h-5 text-purple-600" /></div><h4 className="font-semibold">Motor Impairment</h4></div><p className="text-sm text-muted-foreground">Voice commands, simple nav</p></Card>
            <Card className="border-2 p-4"><div className="flex items-center gap-3 mb-2"><div className="p-2 rounded-full bg-amber-100"><Brain className="w-5 h-5 text-amber-600" /></div><h4 className="font-semibold">Cognitive Support</h4></div><p className="text-sm text-muted-foreground">Simple UI, clear icons</p></Card>
          </div></CardContent>
        </Card>

        <div className="flex justify-center"><Button variant="outline" onClick={resetSettings} className="gap-2"><RotateCcw className="w-4 h-4" />Reset to Defaults</Button></div>

        <Card className="bg-muted/50"><CardHeader><CardTitle className="text-sm flex items-center gap-2"><Check className="w-4 h-4 text-green-500" />Active Settings</CardTitle></CardHeader><CardContent><div className="flex flex-wrap gap-2">{settings.textToSpeechEnabled && <Badge>TTS</Badge>}{settings.speechToTextEnabled && <Badge>STT</Badge>}{settings.highContrast && <Badge>High Contrast</Badge>}{settings.reducedMotion && <Badge>Reduced Motion</Badge>}{settings.fontScale !== 1 && <Badge>Font {Math.round(settings.fontScale * 100)}%</Badge>}{settings.backgroundColor !== 'default' && <Badge>BG: {settings.backgroundColor}</Badge>}</div></CardContent></Card>
      </div>
    </PageLayout>
  );
}