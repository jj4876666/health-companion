import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Bot, 
  Send, 
  User, 
  Wifi, 
  WifiOff, 
  Mic, 
  MicOff,
  X,
  MessageCircle,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Pre-defined responses for offline chatbot simulation
const offlineResponses: Record<string, string> = {
  'hello': 'Hello! I\'m EMEC Assistant. How can I help you with health information today?',
  'hi': 'Hi there! Welcome to EMEC. I can help you with health tips, first aid, and finding nearby facilities.',
  'help': 'I can assist you with:\n• Health education topics\n• First aid tips\n• Finding health facilities\n• Answering health questions\n• Quiz information\n\nWhat would you like to know?',
  'fever': 'For fever management:\n1. Rest and stay hydrated\n2. Take temperature regularly\n3. Use a damp cloth on forehead\n4. Take appropriate fever medicine\n5. Seek medical help if fever exceeds 39°C or lasts more than 3 days',
  'headache': 'For headache relief:\n1. Rest in a quiet, dark room\n2. Stay hydrated\n3. Apply cold compress\n4. Gentle massage on temples\n5. If persistent, consult a doctor',
  'allergy': 'Common allergy management:\n1. Identify and avoid triggers\n2. Keep antihistamines available\n3. Wear medical alert bracelet\n4. Read food labels carefully\n5. Consult doctor for severe allergies',
  'first aid': 'Basic first aid tips:\n• Clean wounds with clean water\n• Apply pressure to stop bleeding\n• Keep calm during emergencies\n• Know emergency numbers\n• Learn CPR basics',
  'hospital': 'Nearby health facilities (Demo):\n1. Mbita Sub-County Hospital - 2.3km\n2. Gembe Health Center - 4.5km\n3. Rusinga Island Clinic - 6.1km\n\nUse the Emergency page for directions.',
  'quiz': 'Our quizzes help you learn about:\n• Personal hygiene\n• Nutrition & diet\n• Disease prevention\n• Mental wellness\n\nComplete quizzes to earn points!',
  'points': 'You can earn points by:\n• Completing health quizzes\n• Daily app usage\n• Learning new topics\n\nPoints unlock premium features temporarily!',
  'puberty': 'Puberty is a natural stage of development. For more detailed information, please ask your parent/guardian to unlock the restricted content section.',
  'emergency': 'In case of emergency:\n• Kenya: 999 or 112\n• Ambulance: 0800 723 253\n• Stay calm and describe the situation clearly',
  'water': 'Staying hydrated:\n• Drink 8+ glasses of water daily\n• More if exercising or hot weather\n• Clean, safe water only\n• Avoid sugary drinks',
  'sleep': 'Good sleep habits:\n• 8-10 hours for children\n• Regular bedtime routine\n• No screens before bed\n• Dark, quiet room',
  'exercise': 'Stay active:\n• At least 60 minutes daily for kids\n• Walking, running, playing sports\n• Reduces stress and improves mood\n• Strengthens bones and muscles',
  'default': 'I understand you\'re asking about health topics. This is a demo version with limited responses. In the full version, I would provide detailed health information. Can I help with:\n• Fever\n• Headache\n• Allergies\n• First Aid\n• Finding hospitals\n• Quiz information',
};

function getOfflineResponse(message: string): string {
  const lowerMessage = message.toLowerCase().trim();
  
  for (const [key, response] of Object.entries(offlineResponses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }
  
  return offlineResponses.default;
}

interface OfflineChatbotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function OfflineChatbot({ isOpen, onClose }: OfflineChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m EMEC Assistant 🤖\n\nI can help you with health information, first aid tips, and more. This is an offline demo - try asking about:\n• Fever, headache, allergies\n• First aid\n• Nearby hospitals\n• Quizzes and points\n\nHow can I help you today?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const { currentUser } = useAuth();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate typing delay
    await new Promise((resolve) => setTimeout(resolve, 800 + Math.random() * 1000));

    const response = getOfflineResponse(input);
    
    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, assistantMessage]);
    setIsTyping(false);
  };

  const handleMicToggle = () => {
    setIsMicActive(!isMicActive);
    if (!isMicActive) {
      // Simulate speech-to-text
      setTimeout(() => {
        setInput('What are the symptoms of fever?');
        setIsMicActive(false);
      }, 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 pointer-events-none">
      <Card className="w-full max-w-md h-[600px] max-h-[80vh] flex flex-col shadow-2xl pointer-events-auto animate-fade-in border-2 border-primary/20">
        <CardHeader className="pb-3 gradient-emec text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-lg">EMEC Assistant</CardTitle>
                <div className="flex items-center gap-1 text-xs opacity-80">
                  <WifiOff className="w-3 h-3" />
                  <span>Offline Demo Mode</span>
                </div>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <ScrollArea className="flex-1 p-4" ref={scrollRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  {message.role === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <Bot className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-br-sm'
                      : 'bg-muted text-foreground rounded-bl-sm'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p className="text-[10px] opacity-60 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2">
                <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <CardContent className="p-3 border-t">
          <div className="flex items-center gap-2">
            <Button
              variant={isMicActive ? 'default' : 'outline'}
              size="icon"
              onClick={handleMicToggle}
              className={isMicActive ? 'animate-pulse' : ''}
            >
              {isMicActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your health question..."
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1"
            />
            <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            <Sparkles className="w-3 h-3 inline mr-1" />
            Offline AI Simulation - Demo Mode
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Floating chat button
export function ChatButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full gradient-emec text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 animate-bounce-soft"
    >
      <MessageCircle className="w-6 h-6" />
    </button>
  );
}
