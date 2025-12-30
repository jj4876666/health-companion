import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import {
  Bot,
  Send,
  Loader2,
  Shield,
  AlertTriangle,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  CheckCircle2,
  Sparkles,
  Heart,
  Brain,
  Pill,
  Stethoscope,
  Apple,
  Trash2
} from 'lucide-react';

type SpeechRecognitionType = any;

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-ai-chat`;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const quickTopics = [
  { icon: Heart, label: 'Fever', color: 'text-red-500', query: 'What should I do if I have a fever?' },
  { icon: Brain, label: 'Mental Health', color: 'text-purple-500', query: 'How can I manage stress and anxiety?' },
  { icon: Pill, label: 'Medication', color: 'text-blue-500', query: 'What are general medication safety tips?' },
  { icon: Apple, label: 'Nutrition', color: 'text-green-500', query: 'What makes a balanced healthy diet?' },
  { icon: Stethoscope, label: 'First Aid', color: 'text-orange-500', query: 'What are basic first aid steps for cuts and burns?' },
];

const CHAT_STORAGE_KEY = 'emec_chat_history';

const getInitialMessage = (): Message => ({
  id: '1',
  role: 'assistant',
  content: "Hello! I'm EMEC Health Assistant, powered by AI with WHO and Kenya Ministry of Health guidelines. 🏥\n\nI can help you with:\n• Symptom information and first aid\n• Disease prevention advice\n• Nutrition and wellness tips\n• Vaccination schedules\n• Mental health support\n\nHow can I assist you today?",
  timestamp: new Date()
});

const loadMessages = (): Message[] => {
  try {
    const saved = localStorage.getItem(CHAT_STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      }));
    }
  } catch (e) {
    console.error('Failed to load chat history:', e);
  }
  return [getInitialMessage()];
};

export function HealthAIChatbot() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>(loadMessages);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const clearChat = () => {
    setMessages([getInitialMessage()]);
    localStorage.removeItem(CHAT_STORAGE_KEY);
    toast({
      title: 'Chat cleared',
      description: 'Your conversation history has been cleared.'
    });
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : 'en-US';

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
        setIsListening(false);
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  const handleSendMessage = async (customMessage?: string) => {
    const messageToSend = customMessage || inputMessage;
    if (!messageToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsTyping(true);

    // Prepare messages for API (exclude timestamps)
    const apiMessages = updatedMessages.map(m => ({ role: m.role, content: m.content }));

    const assistantId = (Date.now() + 1).toString();

    try {
      const resp = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ 
          messages: apiMessages,
          language
        }),
      });

      if (!resp.ok) {
        if (resp.status === 429) {
          throw new Error('Rate limit exceeded. Please try again in a moment.');
        }
        if (resp.status === 402) {
          throw new Error('AI service temporarily unavailable.');
        }
        throw new Error('Failed to get response');
      }

      if (!resp.body) throw new Error('No response body');

      // Create initial assistant message
      setMessages(prev => [...prev, {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date()
      }]);

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';
      let assistantContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        textBuffer += decoder.decode(value, { stream: true });

        let newlineIndex: number;
        while ((newlineIndex = textBuffer.indexOf('\n')) !== -1) {
          let line = textBuffer.slice(0, newlineIndex);
          textBuffer = textBuffer.slice(newlineIndex + 1);

          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (line.startsWith(':') || line.trim() === '') continue;
          if (!line.startsWith('data: ')) continue;

          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;

          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Process any remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw) continue;
          if (raw.endsWith('\r')) raw = raw.slice(0, -1);
          if (raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content as string | undefined;
            if (content) {
              assistantContent += content;
              setMessages(prev => 
                prev.map(m => m.id === assistantId ? { ...m, content: assistantContent } : m)
              );
            }
          } catch { /* ignore */ }
        }
      }

    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to get response',
        variant: 'destructive'
      });
      // Remove the empty assistant message if there was an error
      setMessages(prev => prev.filter(m => m.id !== assistantId));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSpeech = (text: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    } else {
      const utterance = new SpeechSynthesisUtterance(text.replace(/[*#]/g, ''));
      utterance.lang = language === 'sw' ? 'sw-KE' : language === 'fr' ? 'fr-FR' : 'en-US';
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
    }
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

  return (
    <Card className="border-0 shadow-elegant h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="relative p-4 border-b bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-success border-2 border-background flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-lg flex items-center gap-2">
              EMEC Health Assistant
              <Badge className="bg-success/20 text-success border-success/30 text-xs font-normal">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                AI Powered
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">Powered by AI with WHO & Kenya MOH Guidelines</p>
          </div>
          {messages.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearChat}
              className="h-8 w-8 text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
          <Badge variant="outline" className="hidden sm:flex bg-background/80 backdrop-blur-sm">
            <Shield className="w-3 h-3 mr-1" />
            Secure
          </Badge>
        </div>
      </div>

      {/* Quick Topics */}
      {messages.length <= 1 && (
        <div className="p-4 border-b bg-muted/30">
          <p className="text-xs text-muted-foreground mb-3">Quick Topics</p>
          <div className="flex flex-wrap gap-2">
            {quickTopics.map((topic) => (
              <Button
                key={topic.label}
                variant="outline"
                size="sm"
                className="gap-2 bg-background hover:bg-primary/10 hover:border-primary/30 transition-colors"
                onClick={() => handleSendMessage(topic.query)}
              >
                <topic.icon className={`w-4 h-4 ${topic.color}`} />
                {topic.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={`max-w-[85%] ${message.role === 'user' ? 'order-2' : ''}`}>
                <div className="flex items-start gap-3">
                  {message.role === 'assistant' && (
                    <Avatar className="w-9 h-9 shadow-sm">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`rounded-2xl p-4 ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-primary to-primary/90 text-white rounded-br-md shadow-lg'
                        : 'bg-muted/80 rounded-bl-md shadow-sm'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                    
                    {message.role === 'assistant' && message.content && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Shield className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          <Badge variant="outline" className="text-[10px] bg-background/50">
                            WHO Guidelines
                          </Badge>
                          <Badge variant="outline" className="text-[10px] bg-background/50">
                            Kenya MOH
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'assistant' && message.content && (
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-9 w-9 rounded-full hover:bg-primary/10"
                      onClick={() => toggleSpeech(message.content)}
                    >
                      {isSpeaking ? (
                        <VolumeX className="w-4 h-4" />
                      ) : (
                        <Volume2 className="w-4 h-4" />
                      )}
                    </Button>
                  )}
                </div>
                <p className={`text-[10px] mt-2 ${message.role === 'user' ? 'text-right' : 'ml-12'} text-muted-foreground`}>
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start animate-in fade-in duration-200">
              <div className="flex items-start gap-3">
                <Avatar className="w-9 h-9 shadow-sm">
                  <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted/80 rounded-2xl rounded-bl-md p-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-sm text-muted-foreground">AI is thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Warning Banner */}
      <div className="px-4 py-2 bg-amber-500/10 border-y border-amber-500/20">
        <div className="flex items-center gap-2 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>For emergencies, call 999. This AI provides information only, not medical diagnosis.</span>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-muted/30">
        <div className="flex gap-2 items-center">
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={toggleListening}
            className={`rounded-full flex-shrink-0 ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <div className="relative flex-1">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your health question..."
              className="pr-12 rounded-full border-muted-foreground/20 bg-background"
              disabled={isTyping}
            />
          </div>
          <Button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || isTyping}
            size="icon"
            className="rounded-full flex-shrink-0 bg-primary hover:bg-primary/90"
          >
            {isTyping ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
