import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { 
  Bot, Send, Mic, MicOff, X, Minimize2, Maximize2,
  Volume2, VolumeX, Sparkles, AlertCircle, Loader2, MessageCircle
} from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Age-appropriate demo responses for offline mode
const getAgeAppropriateResponse = (
  message: string, 
  ageCategory: string,
  language: string
): string => {
  const lowerMessage = message.toLowerCase();
  
  // Child responses (< 13)
  if (ageCategory === 'child' || ageCategory === 'infant') {
    if (lowerMessage.includes('fever') || lowerMessage.includes('sick')) {
      return language === 'sw' 
        ? '🤒 Pole sana! Ukijisikia homa, mwambie mama au baba wako. Pata mapumziko mengi na kunywa maji. Wazazi wako watakupeleka hospitali ikiwa ni lazima. Jisikie vizuri hivi karibuni! 💕'
        : language === 'fr'
        ? '🤒 Oh non! Si tu as de la fièvre, dis-le à maman ou papa. Repose-toi bien et bois beaucoup d\'eau. Tes parents t\'emmèneront chez le médecin si nécessaire. Guéris vite! 💕'
        : '🤒 Oh no! If you feel hot and sick, tell mommy or daddy right away. Get lots of rest and drink water. Your parents will take you to the doctor if needed. Feel better soon! 💕';
    }
    if (lowerMessage.includes('eat') || lowerMessage.includes('food') || lowerMessage.includes('kula')) {
      return language === 'sw'
        ? '🌈 Kula vyakula vya rangi nyingi hukufanya kuwa na nguvu! Nyanya nyekundu, karoti za machungwa, ndizi za njano, mchicha wa kijani - kila rangi ina nguvu za ajabu! Kumbuka kunywa maji pia! 💪'
        : language === 'fr'
        ? '🌈 Manger des aliments colorés te rend fort! Tomates rouges, carottes orange, bananes jaunes, épinards verts - chaque couleur a des super pouvoirs! N\'oublie pas de boire de l\'eau aussi! 💪'
        : '🌈 Eating rainbow foods makes you super strong! Red tomatoes, orange carrots, yellow bananas, green spinach - each color has special powers! Remember to drink water too! 💪';
    }
    if (lowerMessage.includes('wash') || lowerMessage.includes('hands') || lowerMessage.includes('nawa')) {
      return language === 'sw'
        ? '🧼 Kunawa mikono ni kama ngao ya kishujaa! Tumia sabuni na kusugua kwa sekunde 20 - imba "Happy Birthday" mara mbili. Kumbuka kunawa kabla ya kula na baada ya kutumia choo! 🦸'
        : language === 'fr'
        ? '🧼 Se laver les mains c\'est comme un bouclier de super-héros! Utilise du savon et frotte pendant 20 secondes - chante "Joyeux Anniversaire" deux fois. N\'oublie pas avant de manger et après les toilettes! 🦸'
        : '🧼 Washing hands is like a superhero shield! Use soap and scrub for 20 seconds - sing "Happy Birthday" twice. Remember before eating and after using the bathroom! 🦸';
    }
    return language === 'sw'
      ? '👋 Habari rafiki mdogo! Mimi ni msaidizi wako wa afya. Ninaweza kukusaidia kujifunza kuhusu kula vizuri, kunawa mikono, na kubaki salama. Uliza chochote unachotaka kujua! 🌟'
      : language === 'fr'
      ? '👋 Salut petit ami! Je suis ton assistant santé. Je peux t\'aider à apprendre à bien manger, te laver les mains et rester en sécurité. Demande-moi ce que tu veux savoir! 🌟'
      : '👋 Hi little friend! I\'m your health helper. I can help you learn about eating healthy, washing hands, and staying safe. Ask me anything you want to know! 🌟';
  }
  
  // Teen responses (13-17)
  if (ageCategory === 'teen') {
    if (lowerMessage.includes('puberty') || lowerMessage.includes('balehe') || lowerMessage.includes('changes')) {
      return language === 'sw'
        ? '🌱 Balehe ni wakati wa kawaida wa mabadiliko. Mwili wako unakua na kubadilika - hii ni sehemu ya kuwa mkubwa. Mabadiliko ya hisia pia ni ya kawaida. Ikiwa una maswali, zungumza na mzazi, mwalimu, au daktari unayemwamini. Sisi sote tulipitia hili! 💙'
        : language === 'fr'
        ? '🌱 La puberté est une période normale de changements. Ton corps grandit et change - c\'est une partie de devenir adulte. Les changements d\'humeur sont aussi normaux. Si tu as des questions, parle à un parent, professeur ou médecin de confiance. On est tous passés par là! 💙'
        : '🌱 Puberty is a normal time of changes. Your body is growing and changing - this is part of becoming an adult. Mood swings are also normal. If you have questions, talk to a trusted parent, teacher, or doctor. We all went through this! 💙';
    }
    if (lowerMessage.includes('period') || lowerMessage.includes('menstruation') || lowerMessage.includes('hedhi')) {
      return language === 'sw'
        ? '🌸 Hedhi ni mchakato wa asili unaoonyesha mwili wako unakomaa. Kawaida huanza kati ya miaka 10-16. Mzunguko wa kawaida ni siku 21-35. Weka rekodi ya mzunguko wako, tumia bidhaa za usafi, na zungumza na mtu mzima unayemwamini ikiwa una wasiwasi. 💕'
        : language === 'fr'
        ? '🌸 Les menstruations sont un processus naturel montrant que ton corps mûrit. Elles commencent généralement entre 10-16 ans. Un cycle normal dure 21-35 jours. Suis ton cycle, utilise des produits d\'hygiène appropriés et parle à un adulte de confiance si tu as des inquiétudes. 💕'
        : '🌸 Menstruation is a natural process showing your body is maturing. It typically starts between ages 10-16. A normal cycle is 21-35 days. Track your cycle, use proper hygiene products, and talk to a trusted adult if you have concerns. 💕';
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety') || lowerMessage.includes('wasiwasi')) {
      return language === 'sw'
        ? '🧘 Wasiwasi na msongo wa mawazo ni kawaida, hasa wakati wa ujana. Jaribu kupumua polepole, kufanya mazoezi, au kuzungumza na mtu unayemwamini. Ikiwa hisia hizi zinaendelea, tafadhali zungumza na mzazi au daktari. Kujitunza kiakili ni muhimu! 💙'
        : language === 'fr'
        ? '🧘 L\'anxiété et le stress sont normaux, surtout à l\'adolescence. Essaie la respiration profonde, l\'exercice ou parler à quelqu\'un de confiance. Si ces sentiments persistent, parle à un parent ou médecin. Prendre soin de ta santé mentale est important! 💙'
        : '🧘 Anxiety and stress are normal, especially during teen years. Try deep breathing, exercise, or talking to someone you trust. If these feelings persist, please talk to a parent or doctor. Taking care of your mental health is important! 💙';
    }
    return language === 'sw'
      ? '👋 Habari! Mimi ni msaidizi wako wa afya wa AI. Ninaweza kukusaidia na maswali kuhusu balehe, lishe, mazoezi, afya ya akili, na zaidi. Swali lako liko siri na salama. Uliza chochote! 🌟'
      : language === 'fr'
      ? '👋 Salut! Je suis ton assistant santé IA. Je peux t\'aider avec des questions sur la puberté, la nutrition, l\'exercice, la santé mentale et plus. Ta question est confidentielle. Demande-moi n\'importe quoi! 🌟'
      : '👋 Hey! I\'m your AI health assistant. I can help you with questions about puberty, nutrition, exercise, mental health, and more. Your questions are confidential and safe. Ask me anything! 🌟';
  }
  
  // Adult responses
  if (lowerMessage.includes('diabetes') || lowerMessage.includes('kisukari')) {
    return language === 'sw'
      ? '🏥 Kisukari ni hali sugu inayoathiri jinsi mwili wako unavyosindika sukari ya damu. Kuzuia: Kula lishe bora, fanya mazoezi mara kwa mara, weka uzito wa afya. Dalili: kiu sana, mkojo wa mara kwa mara, uchovu. Ikiwa una wasiwasi, tembelea kituo cha afya kwa uchunguzi. Dhibiti kupitia dawa na mabadiliko ya mtindo wa maisha. 💙'
      : language === 'fr'
      ? '🏥 Le diabète est une condition chronique affectant la façon dont ton corps traite le sucre sanguin. Prévention: alimentation équilibrée, exercice régulier, poids santé. Symptômes: soif excessive, miction fréquente, fatigue. Si inquiet, visite un centre de santé pour un dépistage. Gérer avec médicaments et changements de style de vie. 💙'
      : '🏥 Diabetes is a chronic condition affecting how your body processes blood sugar. Prevention: balanced diet, regular exercise, healthy weight. Symptoms: excessive thirst, frequent urination, fatigue. If concerned, visit a health facility for screening. Manage through medication and lifestyle changes. 💙';
  }
  if (lowerMessage.includes('hypertension') || lowerMessage.includes('blood pressure') || lowerMessage.includes('shinikizo')) {
    return language === 'sw'
      ? '❤️ Shinikizo la damu (hypertension) ni hali ya kawaida inayoongeza hatari ya moyo na kiharusi. Punguza chumvi, fanya mazoezi, epuka pombe kupita kiasi, dhibiti mfadhaiko. Angalia shinikizo la damu mara kwa mara. Ikiwa liko juu, tembelea daktari kwa ushauri na dawa. 🏥'
      : language === 'fr'
      ? '❤️ L\'hypertension artérielle est une condition courante augmentant les risques cardiaques et d\'AVC. Réduisez le sel, faites de l\'exercice, évitez l\'alcool excessif, gérez le stress. Contrôlez régulièrement la pression. Si élevée, consultez un médecin pour conseils et médicaments. 🏥'
      : '❤️ High blood pressure (hypertension) is a common condition increasing heart and stroke risk. Reduce salt, exercise regularly, avoid excess alcohol, manage stress. Check blood pressure regularly. If elevated, visit a doctor for guidance and medication. 🏥';
  }
  if (lowerMessage.includes('malaria')) {
    return language === 'sw'
      ? '🦟 Malaria inasababishwa na mbu. Dalili: homa, baridi, jasho, maumivu ya kichwa. Kinga: tumia chandarua, dawa ya kupulizia, vaa nguo ndefu. Ikiwa una dalili, tembelea hospitali mara moja - matibabu ya mapema ni muhimu sana! Malaria inaweza kuponywa na dawa sahihi. 🏥'
      : language === 'fr'
      ? '🦟 Le paludisme est causé par les moustiques. Symptômes: fièvre, frissons, sueurs, maux de tête. Prévention: moustiquaires, insecticides, vêtements longs. Si vous avez des symptômes, allez à l\'hôpital immédiatement - traitement précoce crucial! Le paludisme est guérissable avec les bons médicaments. 🏥'
      : '🦟 Malaria is caused by mosquitoes. Symptoms: fever, chills, sweating, headache. Prevention: use bed nets, insecticides, wear long clothes. If you have symptoms, visit a hospital immediately - early treatment is crucial! Malaria is curable with proper medication. 🏥';
  }
  
  return language === 'sw'
    ? '👋 Karibu! Mimi ni msaidizi wako wa afya wa AI. Ninaweza kukusaidia na maswali kuhusu magonjwa, lishe, dawa, vituo vya afya, na zaidi. Kumbuka: Hii ni elimu tu - tembelea daktari kwa ushauri wa kitaalamu. Ninaweza kukusaidia na nini leo? 💙'
    : language === 'fr'
    ? '👋 Bienvenue! Je suis ton assistant santé IA. Je peux t\'aider avec des questions sur les maladies, la nutrition, les médicaments, les centres de santé et plus. Rappel: C\'est éducatif seulement - consulte un médecin pour des conseils professionnels. Comment puis-je t\'aider aujourd\'hui? 💙'
    : '👋 Welcome! I\'m your AI health assistant. I can help you with questions about diseases, nutrition, medications, health facilities, and more. Remember: This is educational only - visit a doctor for professional advice. How can I help you today? 💙';
};

export function FloatingAIAssistant() {
  const { toast } = useToast();
  const { language, t } = useLanguage();
  const { selectedAgeCategory, isDemoMode, isOfflineMode } = useDemo();
  const { settings } = useAccessibility();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(settings.voiceGuidance);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-ai-chat`;

  // Get user age from category
  const getUserAge = () => {
    switch (selectedAgeCategory) {
      case 'infant': return 3;
      case 'child': return 8;
      case 'teen': return 15;
      case 'adult': return 30;
      default: return 25;
    }
  };

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

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, [language]);

  // Text-to-speech function
  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { en: 'en-US', sw: 'sw-KE', fr: 'fr-FR' };
      utterance.lang = langMap[language] || 'en-US';
      utterance.rate = 0.9;
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
    if (!recognitionRef.current) {
      toast({
        title: 'Not Supported',
        description: 'Voice input is not supported in this browser.',
        variant: 'destructive',
      });
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
      toast({
        title: '🎤 Listening...',
        description: 'Speak your question now.',
      });
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // If demo/offline mode, use local responses
    if (isDemoMode || isOfflineMode) {
      setTimeout(() => {
        const response = getAgeAppropriateResponse(userMessage.content, selectedAgeCategory, language);
        const assistantMessage: Message = {
          role: 'assistant',
          content: response,
          timestamp: new Date()
        };
        setMessages((prev) => [...prev, assistantMessage]);
        setIsLoading(false);
        if (autoSpeak) {
          speak(response);
        }
      }, 1000);
      return;
    }

    let assistantContent = '';

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({ role: m.role, content: m.content })),
          userAge: getUserAge(),
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      if (!response.body) throw new Error('No response body');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let textBuffer = '';

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
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent, timestamp: new Date() }];
              });
            }
          } catch {
            textBuffer = line + '\n' + textBuffer;
            break;
          }
        }
      }

      // Auto-speak the response
      if (autoSpeak && assistantContent) {
        speak(assistantContent);
      }
    } catch (error) {
      console.error('Chat error:', error);
      // Fallback to demo response
      const response = getAgeAppropriateResponse(userMessage.content, selectedAgeCategory, language);
      setMessages((prev) => [...prev, { role: 'assistant', content: response, timestamp: new Date() }]);
      if (autoSpeak) {
        speak(response);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = selectedAgeCategory === 'child' || selectedAgeCategory === 'infant'
    ? [
        { label: '🧼 Hand washing', query: 'How do I wash my hands properly?' },
        { label: '🌈 Healthy food', query: 'What healthy foods should I eat?' },
        { label: '😴 Good sleep', query: 'Why is sleep important?' },
      ]
    : selectedAgeCategory === 'teen'
    ? [
        { label: '🌱 Puberty', query: 'What happens during puberty?' },
        { label: '🧘 Stress help', query: 'How can I manage stress?' },
        { label: '🏃 Exercise', query: 'How much exercise do I need?' },
      ]
    : [
        { label: '🏥 Diabetes', query: 'What are the symptoms of diabetes?' },
        { label: '❤️ Blood pressure', query: 'How can I control high blood pressure?' },
        { label: '🦟 Malaria', query: 'What are malaria symptoms and treatment?' },
      ];

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg z-40 bg-gradient-to-br from-primary to-primary/80 hover:scale-110 transition-transform"
        aria-label="Open AI Health Assistant"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  if (isMinimized) {
    return (
      <Button
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-24 right-4 px-4 py-2 rounded-full shadow-lg z-40 bg-gradient-to-br from-primary to-primary/80"
      >
        <Bot className="w-5 h-5 mr-2" />
        AI Assistant
        <Maximize2 className="w-4 h-4 ml-2" />
      </Button>
    );
  }

  return (
    <Card className="fixed bottom-24 right-4 w-[360px] md:w-[400px] h-[500px] shadow-2xl z-50 flex flex-col overflow-hidden border-2 border-primary/20">
      {/* Header */}
      <CardHeader className="py-3 px-4 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <CardTitle className="text-sm flex items-center gap-1">
                Health AI <Sparkles className="w-3 h-3" />
              </CardTitle>
              <p className="text-xs text-primary-foreground/80">
                {selectedAgeCategory === 'child' || selectedAgeCategory === 'infant'
                  ? '🧒 Kid-friendly mode'
                  : selectedAgeCategory === 'teen'
                  ? '🎓 Teen mode'
                  : '👨‍⚕️ Adult mode'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setAutoSpeak(!autoSpeak)}
            >
              {autoSpeak ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsMinimized(true)}
            >
              <Minimize2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={() => setIsOpen(false)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-3 overflow-hidden">
        {/* Messages */}
        <ScrollArea className="flex-1 pr-2" ref={scrollRef}>
          {messages.length === 0 ? (
            <div className="space-y-3">
              <div className="text-center py-4">
                <Bot className="w-10 h-10 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {t('askHealthQuestion', 'Ask me any health question!')}
                </p>
              </div>

              {/* Quick Questions */}
              <div className="grid gap-2">
                {quickQuestions.map((q, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="h-auto py-2 text-left justify-start text-xs"
                    onClick={() => setInput(q.query)}
                  >
                    {q.label}
                  </Button>
                ))}
              </div>

              {/* Disclaimer */}
              <div className="p-2 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-xs text-amber-800 dark:text-amber-200">
                <AlertCircle className="w-3 h-3 inline mr-1" />
                {language === 'sw'
                  ? 'Hii ni elimu tu - tembelea daktari kwa ushauri wa kitaalamu.'
                  : language === 'fr'
                  ? 'C\'est éducatif seulement - consultez un médecin pour des conseils professionnels.'
                  : 'This is for education only - visit a doctor for professional advice.'}
              </div>
            </div>
          ) : (
            <div className="space-y-3 py-2">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.role === 'assistant' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 mt-1 text-xs"
                        onClick={() => isSpeaking ? stopSpeaking() : speak(message.content)}
                      >
                        {isSpeaking ? <VolumeX className="w-3 h-3 mr-1" /> : <Volume2 className="w-3 h-3 mr-1" />}
                        {isSpeaking ? 'Stop' : 'Listen'}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl px-3 py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2 pt-3 border-t">
          <Button
            variant={isListening ? 'destructive' : 'outline'}
            size="icon"
            onClick={toggleListening}
            className={`flex-shrink-0 ${isListening ? 'animate-pulse' : ''}`}
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </Button>
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            placeholder={t('typeOrSpeak', 'Type or speak...')}
            disabled={isLoading}
            className="flex-1 text-sm"
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            size="icon"
            className="flex-shrink-0"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </Button>
        </div>

        {(isDemoMode || isOfflineMode) && (
          <Badge variant="secondary" className="mt-2 text-xs justify-center">
            {isOfflineMode ? '📴 Offline Mode' : '🎭 Demo Mode'}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
