import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Mic, Volume2, VolumeX, Home, BookOpen, 
  Phone, Heart, HelpCircle, Settings as SettingsIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

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
  const [isSpeaking, setIsSpeaking] = useState(false);

  const commands: VoiceCommand[] = [
    {
      phrases: ['home', 'nyumbani', 'dashboard'],
      action: () => navigate('/dashboard'),
      icon: Home,
      label: 'Go Home',
      labelSwahili: 'Nyumbani',
    },
    {
      phrases: ['education', 'elimu', 'learn', 'jifunze'],
      action: () => navigate('/education'),
      icon: BookOpen,
      label: 'Education',
      labelSwahili: 'Elimu',
    },
    {
      phrases: ['emergency', 'dharura', 'help', 'msaada', 'call'],
      action: () => navigate('/emergency'),
      icon: Phone,
      label: 'Emergency',
      labelSwahili: 'Dharura',
    },
    {
      phrases: ['first aid', 'huduma ya kwanza', 'injury', 'jeraha'],
      action: () => navigate('/first-aid'),
      icon: Heart,
      label: 'First Aid',
      labelSwahili: 'Huduma ya Kwanza',
    },
    {
      phrases: ['quiz', 'mchezo', 'game', 'play'],
      action: () => navigate('/quizzes'),
      icon: HelpCircle,
      label: 'Quizzes',
      labelSwahili: 'Michezo',
    },
    {
      phrases: ['settings', 'mipangilio'],
      action: () => navigate('/settings'),
      icon: SettingsIcon,
      label: 'Settings',
      labelSwahili: 'Mipangilio',
    },
  ];

  const speak = (text: string, lang: string = 'en-US') => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const processCommand = (spokenText: string) => {
    const normalized = spokenText.toLowerCase().trim();
    
    for (const command of commands) {
      for (const phrase of command.phrases) {
        if (normalized.includes(phrase)) {
          toast({
            title: "Command recognized",
            description: `Going to ${command.label}`,
          });
          speak(`Going to ${command.label}`);
          command.action();
          onClose();
          return;
        }
      }
    }

    toast({
      title: "Command not recognized",
      description: "Please try again or tap a button",
      variant: "destructive",
    });
    speak("Sorry, I did not understand. Please try again.");
  };

  const startListening = () => {
    setIsListening(true);
    setTranscript('');
    
    // Demo: Simulate voice recognition
    speak("Listening. What would you like to do?");
    
    setTimeout(() => {
      // Demo: simulate a recognized command
      const demoTranscript = "Go to emergency";
      setTranscript(demoTranscript);
      setIsListening(false);
      processCommand(demoTranscript);
    }, 3000);
  };

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
        </div>

        {/* Voice Button */}
        <div className="flex justify-center mb-8">
          <Button
            size="lg"
            className={`w-32 h-32 rounded-full ${
              isListening 
                ? 'bg-destructive animate-pulse' 
                : isSpeaking 
                  ? 'bg-primary'
                  : 'bg-primary hover:bg-primary/90'
            }`}
            onClick={startListening}
          >
            {isListening ? (
              <Mic className="w-12 h-12" />
            ) : isSpeaking ? (
              <Volume2 className="w-12 h-12" />
            ) : (
              <Mic className="w-12 h-12" />
            )}
          </Button>
        </div>

        {/* Status */}
        {(isListening || transcript) && (
          <div className="text-center mb-6">
            <p className="text-lg font-medium">
              {isListening ? '🎤 Listening...' : transcript ? `"${transcript}"` : ''}
            </p>
          </div>
        )}

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
          Demo Mode – Simulated voice recognition
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
