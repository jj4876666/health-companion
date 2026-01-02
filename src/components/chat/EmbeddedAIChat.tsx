import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useAIChat } from '@/hooks/useAIChat';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Bot, Send, Mic, MicOff, Volume2, VolumeX, 
  Sparkles, AlertCircle, Loader2, Trash2, X
} from 'lucide-react';

interface EmbeddedAIChatProps {
  title?: string;
  placeholder?: string;
  showHeader?: boolean;
  maxHeight?: string;
  onClose?: () => void;
  context?: string; // Additional context for the AI
}

export function EmbeddedAIChat({
  title = 'AI Health Assistant',
  placeholder = 'Ask me anything about health...',
  showHeader = true,
  maxHeight = '400px',
  onClose,
  context
}: EmbeddedAIChatProps) {
  const { messages, isLoading, error, sendMessage, clearMessages } = useAIChat();
  const { settings } = useAccessibility();
  const { language } = useLanguage();
  
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(settings.voiceGuidance);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize speech recognition
  useEffect(() => {
    const windowWithSpeech = window as any;
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionClass = windowWithSpeech.SpeechRecognition || windowWithSpeech.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
  }, [language]);

  // Text-to-speech
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { en: 'en-US', sw: 'sw-KE', fr: 'fr-FR' };
      utterance.lang = langMap[language] || 'en-US';
      utterance.rate = settings.speechRate || 1;
      utterance.pitch = settings.speechPitch || 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleListening = () => {
    if (!recognitionRef.current) return;
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const messageWithContext = context ? `[Context: ${context}] ${input}` : input;
    setInput('');
    const response = await sendMessage(messageWithContext);
    if (response && autoSpeak) {
      speak(response);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="border-0 shadow-elegant">
      {showHeader && (
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <span>{title}</span>
              <Badge className="bg-success/20 text-success text-xs">AI Powered</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setAutoSpeak(!autoSpeak)}
              >
                {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={clearMessages}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
              {onClose && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="p-4">
        {/* Messages */}
        <ScrollArea className="pr-4 mb-4" style={{ height: maxHeight }}>
          <div ref={scrollRef} className="space-y-3">
            {messages.length === 0 && (
              <div className="text-center py-8">
                <Sparkles className="w-12 h-12 mx-auto text-primary/50 mb-3" />
                <p className="text-muted-foreground text-sm">
                  Ask me anything about health, nutrition, or wellness!
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ⚠️ For educational purposes only - consult a doctor for medical advice
                </p>
              </div>
            )}
            
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  {msg.role === 'assistant' && (
                    <div className="flex items-center gap-2 mt-2 pt-2 border-t border-border/30">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => speak(msg.content)}
                      >
                        <Volume2 className="w-3 h-3 mr-1" />
                        Listen
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Thinking...</span>
              </div>
            )}
            
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="flex gap-2">
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={toggleListening}
            className="shrink-0"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="shrink-0 gap-2"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {isSpeaking && (
          <div className="flex items-center justify-center gap-2 mt-2">
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="w-1 h-4 bg-primary rounded-full animate-pulse"
                  style={{ animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={stopSpeaking}>
              Stop
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
