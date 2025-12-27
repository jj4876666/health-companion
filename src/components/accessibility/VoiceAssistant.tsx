import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Mic, Volume2, VolumeX, Home, BookOpen, 
  Phone, Heart, HelpCircle, Settings as SettingsIcon,
  Wifi, WifiOff, MicOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// TypeScript declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event & { error: string }) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface VoiceCommand {
  phrases: string[];
  action: () => void;
  icon: React.ElementType;
  label: string;
  labelSwahili: string;
}

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
}

export function VoiceAssistant({ isOpen, onClose }: VoiceAssistantProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const commands: VoiceCommand[] = [
    {
      phrases: ['home', 'nyumbani', 'dashboard', 'dashibodi'],
      action: () => navigate('/dashboard'),
      icon: Home,
      label: 'Go Home',
      labelSwahili: 'Nyumbani',
    },
    {
      phrases: ['education', 'elimu', 'learn', 'jifunze', 'soma'],
      action: () => navigate('/education'),
      icon: BookOpen,
      label: 'Education',
      labelSwahili: 'Elimu',
    },
    {
      phrases: ['emergency', 'dharura', 'help', 'msaada', 'call', 'piga simu'],
      action: () => navigate('/emergency'),
      icon: Phone,
      label: 'Emergency',
      labelSwahili: 'Dharura',
    },
    {
      phrases: ['first aid', 'huduma ya kwanza', 'injury', 'jeraha', 'wound', 'kidonda'],
      action: () => navigate('/first-aid'),
      icon: Heart,
      label: 'First Aid',
      labelSwahili: 'Huduma ya Kwanza',
    },
    {
      phrases: ['quiz', 'mchezo', 'game', 'play', 'cheza', 'maswali'],
      action: () => navigate('/quizzes'),
      icon: HelpCircle,
      label: 'Quizzes',
      labelSwahili: 'Michezo',
    },
    {
      phrases: ['settings', 'mipangilio', 'options'],
      action: () => navigate('/settings'),
      icon: SettingsIcon,
      label: 'Settings',
      labelSwahili: 'Mipangilio',
    },
  ];

  // Check for Web Speech API support and online status
  useEffect(() => {
    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognitionAPI);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return;

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionAPI) return;

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US'; // Supports English, can add Swahili

    recognition.onstart = () => {
      setIsListening(true);
      console.log('Voice recognition started');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      setInterimTranscript(interim);
      
      if (final) {
        setTranscript(final);
        processCommand(final);
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      
      let errorMessage = 'Voice recognition error';
      if (event.error === 'no-speech') {
        errorMessage = 'No speech detected. Please try again.';
      } else if (event.error === 'audio-capture') {
        errorMessage = 'Microphone not available';
      } else if (event.error === 'not-allowed') {
        errorMessage = 'Microphone permission denied';
      } else if (event.error === 'network') {
        errorMessage = 'Network error - check internet connection';
      }

      toast({
        title: "Voice Error",
        description: errorMessage,
        variant: "destructive",
      });
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
      console.log('Voice recognition ended');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [isSupported]);

  const speak = useCallback((text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      speechSynthesis.cancel();
      
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  }, []);

  const processCommand = useCallback((spokenText: string) => {
    const normalized = spokenText.toLowerCase().trim();
    console.log('Processing command:', normalized);
    
    for (const command of commands) {
      for (const phrase of command.phrases) {
        if (normalized.includes(phrase)) {
          toast({
            title: "✓ Command recognized",
            description: `Navigating to ${command.label}`,
          });
          speak(`Going to ${command.label}`);
          setTimeout(() => {
            command.action();
            onClose();
          }, 500);
          return;
        }
      }
    }

    toast({
      title: "Command not recognized",
      description: `You said: "${spokenText}". Try again or tap a button.`,
      variant: "destructive",
    });
    speak("Sorry, I did not understand. Please try again or tap a button.");
  }, [commands, toast, speak, onClose]);

  const startListening = useCallback(() => {
    if (!isOnline) {
      toast({
        title: "Offline",
        description: "Voice recognition requires internet connection",
        variant: "destructive",
      });
      return;
    }

    if (!isSupported) {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support voice recognition. Try Chrome or Edge.",
        variant: "destructive",
      });
      return;
    }

    setTranscript('');
    setInterimTranscript('');

    try {
      recognitionRef.current?.start();
      speak("Listening. Say a command like 'go to emergency' or 'education'.");
    } catch (error) {
      console.error('Failed to start recognition:', error);
      toast({
        title: "Error",
        description: "Could not start voice recognition. Please try again.",
        variant: "destructive",
      });
    }
  }, [isOnline, isSupported, toast, speak]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-8 h-full flex flex-col">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Voice Assistant</h1>
          <p className="text-muted-foreground">
            Say a command or tap a button / Sema amri au gusa kifungo
          </p>
          
          {/* Connection Status */}
          <div className="flex justify-center gap-2 mt-4">
            <Badge variant={isOnline ? 'default' : 'destructive'} className="gap-1">
              {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
              {isOnline ? 'Online' : 'Offline'}
            </Badge>
            <Badge variant={isSupported ? 'default' : 'destructive'} className="gap-1">
              {isSupported ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
              {isSupported ? 'Voice Ready' : 'Not Supported'}
            </Badge>
          </div>
        </div>

        {/* Voice Button */}
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            disabled={!isOnline || !isSupported}
            className={`w-32 h-32 rounded-full transition-all ${
              isListening 
                ? 'bg-destructive animate-pulse scale-110' 
                : isSpeaking 
                  ? 'bg-primary'
                  : 'bg-primary hover:bg-primary/90 hover:scale-105'
            }`}
            onClick={isListening ? stopListening : startListening}
          >
            {isListening ? (
              <div className="relative">
                <Mic className="w-12 h-12" />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs whitespace-nowrap">
                  Tap to stop
                </span>
              </div>
            ) : isSpeaking ? (
              <Volume2 className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </Button>
        </div>

        {/* Status */}
        <div className="text-center mb-6 min-h-[60px]">
          {isListening && (
            <div className="space-y-2">
              <p className="text-lg font-medium text-primary animate-pulse">
                🎤 Listening...
              </p>
              {interimTranscript && (
                <p className="text-muted-foreground italic">"{interimTranscript}"</p>
              )}
            </div>
          )}
          {!isListening && transcript && (
            <p className="text-lg font-medium text-success">
              ✓ Heard: "{transcript}"
            </p>
          )}
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 flex-1">
          {commands.map((command) => {
            const Icon = command.icon;
            return (
              <Card
                key={command.label}
                className="border-2 border-border hover:border-primary cursor-pointer transition-all hover:scale-[1.02]"
                onClick={() => {
                  speak(command.label);
                  command.action();
                  onClose();
                }}
              >
                <CardContent className="p-6 flex flex-col items-center justify-center text-center h-full">
                  <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-3">
                    <Icon className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg">{command.label}</h3>
                  <p className="text-sm text-muted-foreground">{command.labelSwahili}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Close Button */}
        <div className="mt-6 text-center">
          <Button variant="outline" size="lg" onClick={onClose}>
            <VolumeX className="w-5 h-5 mr-2" />
            Close / Funga
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          {isOnline && isSupported 
            ? '🌐 Live Voice Recognition – Powered by Web Speech API'
            : !isOnline 
              ? '📡 Requires internet connection for voice recognition'
              : '⚠️ Use Chrome or Edge for voice features'
          }
        </p>
      </div>
    </div>
  );
}

// Simple button to trigger the voice assistant
export function VoiceAssistantButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      size="lg"
      className="fixed bottom-20 right-4 w-14 h-14 rounded-full shadow-lg z-40"
    >
      <Mic className="w-6 h-6" />
    </Button>
  );
}
