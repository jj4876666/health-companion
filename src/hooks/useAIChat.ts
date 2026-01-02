import { useState, useCallback, useRef, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import { useToast } from '@/hooks/use-toast';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/health-ai-chat`;

// Offline demo responses based on age and topic
const getDemoResponse = (message: string, ageCategory: string, lang: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Child responses
  if (ageCategory === 'child' || ageCategory === 'infant') {
    if (lowerMessage.includes('fever') || lowerMessage.includes('sick')) {
      return lang === 'sw' 
        ? '🤒 Pole sana! Ukijisikia homa, mwambie mama au baba wako. Pata mapumziko mengi na kunywa maji. 💕'
        : '🤒 Oh no! If you feel sick, tell mommy or daddy right away. Get lots of rest and drink water! 💕';
    }
    if (lowerMessage.includes('eat') || lowerMessage.includes('food')) {
      return '🌈 Eating rainbow foods makes you super strong! Red tomatoes, orange carrots, yellow bananas, green spinach - each color has special powers! 💪';
    }
    return '👋 Hi little friend! I\'m your health helper. Ask me anything about staying healthy! 🌟';
  }
  
  // Teen responses
  if (ageCategory === 'teen') {
    if (lowerMessage.includes('puberty') || lowerMessage.includes('changes')) {
      return '🌱 Puberty is a normal time of changes. Your body is growing - this is part of becoming an adult. If you have questions, talk to a trusted adult! 💙';
    }
    if (lowerMessage.includes('period') || lowerMessage.includes('menstruation')) {
      return '🌸 Menstruation is a natural process showing your body is maturing. Track your cycle, use proper hygiene products, and talk to a trusted adult if you have concerns. 💕';
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('anxiety')) {
      return '🧘 Stress and anxiety are normal. Try deep breathing, exercise, or talking to someone you trust. Taking care of your mental health is important! 💙';
    }
    return '👋 Hey! I\'m your AI health assistant. Ask me about nutrition, exercise, mental health, and more! 🌟';
  }
  
  // Adult responses
  if (lowerMessage.includes('diabetes')) {
    return '🏥 Diabetes affects how your body processes blood sugar. Prevention: balanced diet, exercise, healthy weight. If concerned, visit a health facility for screening. 💙';
  }
  if (lowerMessage.includes('hypertension') || lowerMessage.includes('blood pressure')) {
    return '❤️ High blood pressure increases heart and stroke risk. Reduce salt, exercise, avoid excess alcohol, manage stress. Check regularly and consult a doctor if elevated. 🏥';
  }
  if (lowerMessage.includes('cancer')) {
    return '🩺 Cancer prevention: avoid tobacco, maintain healthy weight, eat well, exercise, limit alcohol, get vaccinated, and have regular screenings. Early detection saves lives! 💙';
  }
  if (lowerMessage.includes('hiv') || lowerMessage.includes('aids')) {
    return '🔬 HIV/AIDS: Prevention includes safe practices, regular testing, and PrEP if at risk. Treatment with antiretrovirals allows people to live healthy lives. Get tested! 💪';
  }
  
  return '👋 Welcome! I\'m your AI health assistant. I can help with questions about diseases, nutrition, medications, and more. Remember: This is educational only - visit a doctor for professional advice. 💙';
};

export function useAIChat() {
  const { language } = useLanguage();
  const { selectedAgeCategory, isDemoMode, isOfflineMode } = useDemo();
  const { toast } = useToast();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Get user age from category
  const getUserAge = useCallback(() => {
    switch (selectedAgeCategory) {
      case 'infant': return 3;
      case 'child': return 8;
      case 'teen': return 15;
      case 'adult': return 30;
      default: return 25;
    }
  }, [selectedAgeCategory]);

  // Clear messages
  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  // Cancel ongoing request
  const cancelRequest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
      setIsLoading(false);
    }
  }, []);

  // Send message
  const sendMessage = useCallback(async (input: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { 
      role: 'user', 
      content: input.trim(),
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    // Demo/offline mode - use local responses
    if (isDemoMode || isOfflineMode) {
      await new Promise(resolve => setTimeout(resolve, 800));
      const response = getDemoResponse(input, selectedAgeCategory, language);
      const assistantMessage: Message = {
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
      return response;
    }

    // Online mode - call AI edge function with streaming
    let assistantContent = '';
    abortControllerRef.current = new AbortController();

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
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        if (response.status === 402) {
          throw new Error('AI service temporarily unavailable.');
        }
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
              setMessages(prev => {
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

      // Flush remaining buffer
      if (textBuffer.trim()) {
        for (let raw of textBuffer.split('\n')) {
          if (!raw || raw.startsWith(':') || raw.trim() === '') continue;
          if (!raw.startsWith('data: ')) continue;
          const jsonStr = raw.slice(6).trim();
          if (jsonStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              assistantContent += content;
              setMessages(prev => {
                const last = prev[prev.length - 1];
                if (last?.role === 'assistant') {
                  return prev.map((m, i) =>
                    i === prev.length - 1 ? { ...m, content: assistantContent } : m
                  );
                }
                return [...prev, { role: 'assistant', content: assistantContent, timestamp: new Date() }];
              });
            }
          } catch { /* ignore */ }
        }
      }

      setIsLoading(false);
      return assistantContent;

    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        // Request was cancelled
        setIsLoading(false);
        return null;
      }
      
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setIsLoading(false);
      
      toast({
        title: 'AI Error',
        description: errorMessage,
        variant: 'destructive',
      });
      
      // Fallback to demo response
      const fallbackResponse = getDemoResponse(input, selectedAgeCategory, language);
      const assistantMessage: Message = {
        role: 'assistant',
        content: fallbackResponse + '\n\n⚠️ (Offline mode - AI temporarily unavailable)',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
      return fallbackResponse;
    }
  }, [messages, isLoading, isDemoMode, isOfflineMode, selectedAgeCategory, language, getUserAge, toast]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
    cancelRequest,
    setMessages,
  };
}
