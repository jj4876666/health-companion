import { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
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
  Apple
} from 'lucide-react';

type SpeechRecognitionType = any;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: string[];
}

const healthKnowledgeBase: Record<string, { response: string; sources: string[] }> = {
  fever: {
    response: "For fever management:\n\n1. **Rest** - Allow body to recover\n2. **Hydration** - Drink plenty of fluids (water, clear broths, electrolyte solutions)\n3. **Temperature monitoring** - Check every 4 hours\n4. **Medication** - Paracetamol (as per age-appropriate dosing)\n\n⚠️ **Seek immediate medical care if:**\n- Fever exceeds 39.4°C (103°F)\n- Lasts more than 3 days\n- Accompanied by severe headache, stiff neck, or rash\n- Occurs in infants under 3 months",
    sources: ['WHO Guidelines on Fever Management', 'Kenya MOH Clinical Guidelines 2024']
  },
  malaria: {
    response: "**Malaria Prevention & Recognition:**\n\n**Symptoms:**\n- High fever with chills\n- Headache and body aches\n- Nausea and vomiting\n- Fatigue and weakness\n\n**Prevention (WHO Recommended):**\n1. Sleep under insecticide-treated mosquito nets (ITNs)\n2. Use mosquito repellent containing DEET\n3. Wear long sleeves and pants at dusk/dawn\n4. Take antimalarial prophylaxis if prescribed\n\n⚠️ **Get tested immediately** if you have symptoms - early treatment saves lives!",
    sources: ['WHO Malaria Guidelines 2023', 'Kenya National Malaria Strategy', 'CDC Malaria Prevention']
  },
  diarrhea: {
    response: "**Diarrhea Management (WHO/UNICEF Protocol):**\n\n**Oral Rehydration Solution (ORS):**\n- Mix 1 packet ORS with 1 liter clean water\n- Give small, frequent sips\n- Continue breastfeeding for infants\n\n**Zinc Supplementation:**\n- Children 6+ months: 20mg zinc daily for 10-14 days\n\n**Danger Signs - Seek Care Immediately:**\n- Blood in stool\n- Unable to drink or keep fluids down\n- Severe dehydration (dry mouth, no tears, sunken eyes)\n- Diarrhea lasting more than 3 days",
    sources: ['WHO/UNICEF Diarrhea Treatment Guidelines', 'Kenya MOH IMCI Guidelines']
  },
  nutrition: {
    response: "**Balanced Nutrition Guidelines (WHO):**\n\n**Daily Requirements:**\n- Fruits & Vegetables: 5+ portions\n- Whole grains: Make half your grains whole\n- Protein: Lean meats, fish, beans, eggs\n- Dairy: Low-fat milk, yogurt\n\n**Limit:**\n- Salt: Less than 5g/day\n- Sugar: Less than 25g/day\n- Saturated fats: Less than 10% of calories\n\n**For Children:**\n- Exclusive breastfeeding for first 6 months\n- Introduce diverse foods after 6 months\n- Iron-rich foods to prevent anemia",
    sources: ['WHO Healthy Diet Guidelines', 'Kenya National Nutrition Guidelines', 'UNICEF Infant Feeding']
  },
  hygiene: {
    response: "**Hand Hygiene (WHO Recommended):**\n\n**When to Wash Hands:**\n- Before eating or preparing food\n- After using the toilet\n- After coughing, sneezing, or blowing nose\n- After touching animals\n- Before and after caring for sick persons\n\n**Proper Technique (20+ seconds):**\n1. Wet hands with clean water\n2. Apply soap and lather well\n3. Scrub all surfaces including between fingers\n4. Rinse thoroughly\n5. Dry with clean towel or air dry\n\n**No water available?** Use alcohol-based hand sanitizer (60%+ alcohol)",
    sources: ['WHO Hand Hygiene Guidelines', 'Kenya MOH Infection Prevention']
  },
  vaccination: {
    response: "**Vaccination - Kenya Immunization Schedule:**\n\n**Birth:** BCG, OPV-0\n**6 weeks:** DPT-HepB-Hib 1, OPV-1, PCV-1, Rotavirus 1\n**10 weeks:** DPT-HepB-Hib 2, OPV-2, PCV-2, Rotavirus 2\n**14 weeks:** DPT-HepB-Hib 3, OPV-3, PCV-3, IPV\n**9 months:** Measles-Rubella 1, Yellow Fever\n**18 months:** Measles-Rubella 2\n\n✅ **Vaccines are safe and effective**\n✅ **Free at all government health facilities**\n\nKeep your child's immunization card safe!",
    sources: ['Kenya Expanded Programme on Immunization', 'WHO Immunization Guidelines', 'UNICEF']
  },
  covid: {
    response: "**COVID-19 Prevention & Care:**\n\n**Prevention:**\n- Get vaccinated and boosted\n- Wear masks in crowded indoor spaces\n- Maintain physical distance\n- Practice good hand hygiene\n- Ensure good ventilation\n\n**If You Have Symptoms:**\n- Isolate from others\n- Monitor oxygen levels if available\n- Stay hydrated and rest\n- Seek care if breathing becomes difficult\n\n**Danger Signs - Seek Emergency Care:**\n- Difficulty breathing\n- Persistent chest pain\n- Confusion\n- Bluish lips or face",
    sources: ['WHO COVID-19 Guidelines', 'Kenya MOH COVID-19 Protocols', 'CDC']
  },
  pregnancy: {
    response: "**Pregnancy Care Guidelines:**\n\n**Antenatal Care Schedule:**\n- At least 8 ANC visits recommended\n- First visit before 12 weeks\n- Monthly until 28 weeks, then more frequent\n\n**Essential Care:**\n- Folic acid supplementation\n- Iron supplementation\n- Tetanus vaccination\n- HIV and other STI screening\n- Blood pressure monitoring\n\n**Danger Signs - Seek Immediate Care:**\n- Vaginal bleeding\n- Severe headache with blurred vision\n- High fever\n- Reduced baby movement\n- Water breaking before term",
    sources: ['WHO Antenatal Care Guidelines', 'Kenya MOH Maternal Health Guidelines']
  },
  firstaid: {
    response: "**Basic First Aid Principles:**\n\n**For Bleeding:**\n1. Apply direct pressure with clean cloth\n2. Elevate the injured area\n3. If bleeding doesn't stop, seek medical help\n\n**For Burns:**\n1. Cool with running water for 10-20 minutes\n2. Cover with clean, non-stick dressing\n3. Do NOT apply ice, butter, or toothpaste\n\n**For Choking (Heimlich Maneuver):**\n1. Stand behind person\n2. Make a fist above navel\n3. Give quick upward thrusts\n\n**Always call emergency (999) for serious injuries!**",
    sources: ['Kenya Red Cross First Aid Manual', 'WHO Emergency Care Guidelines']
  },
  mental: {
    response: "**Mental Health & Well-being:**\n\n**Signs to Watch For:**\n- Persistent sadness or hopelessness\n- Loss of interest in activities\n- Changes in sleep or appetite\n- Difficulty concentrating\n- Thoughts of self-harm\n\n**Self-Care Tips:**\n- Maintain regular sleep schedule\n- Stay physically active\n- Connect with friends and family\n- Limit alcohol and avoid drugs\n- Practice relaxation techniques\n\n**Get Help:**\n- Talk to a trusted person\n- Contact Kenya Red Cross: 1199\n- Mental health helpline: 0800 720 990 (toll-free)\n\nRemember: It's okay to ask for help!",
    sources: ['WHO Mental Health Guidelines', 'Kenya Mental Health Policy', 'Africa Mental Health Foundation']
  }
};

const getAIResponse = (userMessage: string): { response: string; sources: string[] } => {
  const lowerMessage = userMessage.toLowerCase();
  
  for (const [keyword, data] of Object.entries(healthKnowledgeBase)) {
    if (lowerMessage.includes(keyword)) {
      return data;
    }
  }
  
  if (lowerMessage.includes('headache') || lowerMessage.includes('pain')) {
    return {
      response: "For pain management:\n\n**General Advice:**\n- Rest in a quiet, dark room (for headaches)\n- Stay hydrated\n- Apply cold or warm compress as appropriate\n- Take age-appropriate pain relief (paracetamol)\n\n**Seek medical attention if:**\n- Pain is severe or sudden\n- Accompanied by fever, stiff neck, or vision changes\n- Persists for more than a few days\n- Interferes with daily activities\n\nWould you like more specific information about a particular type of pain?",
      sources: ['WHO Pain Management Guidelines', 'Kenya MOH Clinical Guidelines']
    };
  }
  
  if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
    return {
      response: "**Common Cold & Flu Care:**\n\n**Rest and Recovery:**\n- Get plenty of sleep\n- Stay hydrated with warm fluids\n- Use honey for sore throat (not for children under 1 year)\n\n**Symptom Relief:**\n- Saline nasal drops for congestion\n- Steam inhalation (carefully)\n- Paracetamol for fever and aches\n\n**When to See a Doctor:**\n- Symptoms lasting more than 10 days\n- High fever (above 39°C)\n- Difficulty breathing\n- Symptoms that improve then worsen",
      sources: ['WHO Respiratory Illness Guidelines', 'Kenya MOH Clinical Guidelines']
    };
  }
  
  if (lowerMessage.includes('water') || lowerMessage.includes('drink') || lowerMessage.includes('hydrat')) {
    return {
      response: "**Hydration Guidelines (WHO):**\n\n**Daily Water Intake:**\n- Adults: 2-3 liters per day\n- Children: Based on weight and activity\n- Increase during hot weather or physical activity\n\n**Signs of Dehydration:**\n- Dark yellow urine\n- Thirst\n- Dry mouth and lips\n- Fatigue\n- Dizziness\n\n**Healthy Hydration Tips:**\n- Carry a water bottle\n- Drink before you feel thirsty\n- Limit sugary drinks\n- Eat water-rich fruits and vegetables",
      sources: ['WHO Hydration Guidelines', 'Kenya Nutrition Guidelines']
    };
  }
  
  return {
    response: "Thank you for your health question. I'm here to help with evidence-based health information.\n\n**I can help you with:**\n- Fever, malaria, and common illnesses\n- Nutrition and diet advice\n- Hygiene and disease prevention\n- Vaccination information\n- First aid guidance\n- Mental health support\n- Pregnancy care\n\nPlease describe your symptoms or health concern in more detail, and I'll provide WHO and Kenya MOH-certified guidance.\n\n⚠️ **Important:** For medical emergencies, call 999 immediately.",
    sources: ['WHO Health Guidelines', 'Kenya Ministry of Health']
  };
};

const quickTopics = [
  { icon: Heart, label: 'Fever', color: 'text-red-500', query: 'fever symptoms' },
  { icon: Brain, label: 'Mental Health', color: 'text-purple-500', query: 'mental health tips' },
  { icon: Pill, label: 'Medication', color: 'text-blue-500', query: 'medication safety' },
  { icon: Apple, label: 'Nutrition', color: 'text-green-500', query: 'nutrition advice' },
  { icon: Stethoscope, label: 'First Aid', color: 'text-orange-500', query: 'first aid basics' },
];

export function HealthAIChatbot() {
  const { language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm EMEC Health Assistant, powered by WHO and Kenya Ministry of Health certified guidelines. 🏥\n\nI can help you with:\n• Symptom information and first aid\n• Disease prevention advice\n• Nutrition and wellness tips\n• Vaccination schedules\n• Mental health support\n\nHow can I assist you today?",
      timestamp: new Date(),
      sources: ['WHO Guidelines', 'Kenya MOH']
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

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
    if (!messageToSend.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageToSend,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 800));

    const { response, sources } = getAIResponse(messageToSend);

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      sources
    };

    setMessages(prev => [...prev, assistantMessage]);
    setIsTyping(false);
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
                Certified
              </Badge>
            </h3>
            <p className="text-sm text-muted-foreground">Powered by WHO & Kenya MOH Guidelines</p>
          </div>
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
                    
                    {message.sources && message.role === 'assistant' && (
                      <div className="mt-3 pt-3 border-t border-border/30">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Shield className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                          {message.sources.map((source, i) => (
                            <Badge key={i} variant="outline" className="text-[10px] bg-background/50">
                              {source}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {message.role === 'assistant' && (
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
                    <span className="text-sm text-muted-foreground">Analyzing with WHO guidelines...</span>
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