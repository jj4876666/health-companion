import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle, RefreshCcw, Heart } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface BodyPart {
  id: string;
  name: { en: string; sw: string; fr: string };
  emoji: string;
  function: { en: string; sw: string; fr: string };
  category: 'head' | 'torso' | 'limbs' | 'organs';
}

const bodyParts: BodyPart[] = [
  { id: 'brain', name: { en: 'Brain', sw: 'Ubongo', fr: 'Cerveau' }, emoji: '🧠', function: { en: 'Controls thinking and body functions', sw: 'Inadhibiti mawazo na kazi za mwili', fr: 'Contrôle la pensée et les fonctions corporelles' }, category: 'organs' },
  { id: 'heart', name: { en: 'Heart', sw: 'Moyo', fr: 'Cœur' }, emoji: '❤️', function: { en: 'Pumps blood throughout the body', sw: 'Inasukuma damu mwili mzima', fr: 'Pompe le sang dans tout le corps' }, category: 'organs' },
  { id: 'lungs', name: { en: 'Lungs', sw: 'Mapafu', fr: 'Poumons' }, emoji: '🫁', function: { en: 'Help you breathe and get oxygen', sw: 'Zinakusaidia kupumua na kupata oksijeni', fr: 'Vous aident à respirer et obtenir de l\'oxygène' }, category: 'organs' },
  { id: 'stomach', name: { en: 'Stomach', sw: 'Tumbo', fr: 'Estomac' }, emoji: '🫃', function: { en: 'Digests food you eat', sw: 'Inayeyusha chakula unachokula', fr: 'Digère les aliments que vous mangez' }, category: 'organs' },
  { id: 'eyes', name: { en: 'Eyes', sw: 'Macho', fr: 'Yeux' }, emoji: '👁️', function: { en: 'Allow you to see', sw: 'Zinakuruhusu kuona', fr: 'Vous permettent de voir' }, category: 'head' },
  { id: 'ears', name: { en: 'Ears', sw: 'Masikio', fr: 'Oreilles' }, emoji: '👂', function: { en: 'Allow you to hear sounds', sw: 'Zinakuruhusu kusikia sauti', fr: 'Vous permettent d\'entendre les sons' }, category: 'head' },
  { id: 'nose', name: { en: 'Nose', sw: 'Pua', fr: 'Nez' }, emoji: '👃', function: { en: 'Helps you smell and breathe', sw: 'Inakusaidia kunusa na kupumua', fr: 'Vous aide à sentir et respirer' }, category: 'head' },
  { id: 'teeth', name: { en: 'Teeth', sw: 'Meno', fr: 'Dents' }, emoji: '🦷', function: { en: 'Help you chew food', sw: 'Zinakusaidia kutafuna chakula', fr: 'Vous aident à mâcher les aliments' }, category: 'head' },
  { id: 'bones', name: { en: 'Bones', sw: 'Mifupa', fr: 'Os' }, emoji: '🦴', function: { en: 'Support and protect your body', sw: 'Zinaunga mkono na kulinda mwili wako', fr: 'Soutiennent et protègent votre corps' }, category: 'torso' },
  { id: 'muscles', name: { en: 'Muscles', sw: 'Misuli', fr: 'Muscles' }, emoji: '💪', function: { en: 'Help you move and stay strong', sw: 'Zinakusaidia kusonga na kubaki imara', fr: 'Vous aident à bouger et rester fort' }, category: 'limbs' },
];

interface BodyPartsGameProps {
  onComplete: (points: number) => void;
  onClose: () => void;
}

export function BodyPartsGame({ onComplete, onClose }: BodyPartsGameProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [options, setOptions] = useState<BodyPart[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const generateOptions = (correctPart: BodyPart) => {
    const otherParts = bodyParts.filter(p => p.id !== correctPart.id);
    const shuffled = otherParts.sort(() => Math.random() - 0.5).slice(0, 3);
    const allOptions = [...shuffled, correctPart].sort(() => Math.random() - 0.5);
    setOptions(allOptions);
  };

  useState(() => {
    generateOptions(bodyParts[0]);
  });

  const handleAnswer = (partId: string) => {
    if (showAnswer) return;
    setSelectedAnswer(partId);
    setShowAnswer(true);
    
    const currentPart = bodyParts[currentIndex];
    if (partId === currentPart.id) {
      setScore(prev => prev + 10);
      toast({ title: '✅ Correct!', description: '+10 points' });
    } else {
      toast({ title: '❌ Incorrect', description: `The answer was ${currentPart.name[language]}`, variant: 'destructive' });
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= bodyParts.length) {
      setGameComplete(true);
      onComplete(score);
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setShowAnswer(false);
    setSelectedAnswer(null);
    generateOptions(bodyParts[currentIndex + 1]);
  };

  const currentPart = bodyParts[currentIndex];
  const progress = ((currentIndex + 1) / bodyParts.length) * 100;

  if (gameComplete) {
    return (
      <Card className="border-0 shadow-elegant">
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-6xl">🎉</div>
          <h2 className="text-2xl font-bold">{language === 'sw' ? 'Umefanya Vizuri!' : language === 'fr' ? 'Bien Joué!' : 'Well Done!'}</h2>
          <p className="text-4xl font-bold text-primary">{score} / {bodyParts.length * 10}</p>
          <Button onClick={onClose} className="w-full">{language === 'sw' ? 'Funga' : language === 'fr' ? 'Fermer' : 'Close'}</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-elegant">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500" />
            {language === 'sw' ? 'Mgunduzi wa Sehemu za Mwili' : language === 'fr' ? 'Explorateur du Corps' : 'Body Part Explorer'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}><XCircle className="w-5 h-5" /></Button>
        </div>
        <div className="flex gap-4 text-sm">
          <Badge variant="outline" className="bg-success/10">{language === 'sw' ? 'Alama' : 'Score'}: {score}</Badge>
          <Badge variant="outline">{currentIndex + 1}/{bodyParts.length}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-pink-500/10 to-red-500/10 border-2 border-pink-500/30">
          <div className="text-5xl mb-4">{currentPart.emoji}</div>
          <p className="text-lg font-medium">{currentPart.function[language]}</p>
          <p className="text-sm text-muted-foreground mt-2">{language === 'sw' ? 'Hii ni sehemu gani ya mwili?' : language === 'fr' ? 'Quelle partie du corps est-ce?' : 'Which body part is this?'}</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {options.map((part) => (
            <Button
              key={part.id}
              variant={showAnswer ? (part.id === currentPart.id ? 'default' : selectedAnswer === part.id ? 'destructive' : 'outline') : 'outline'}
              className={`h-16 text-lg ${showAnswer && part.id === currentPart.id ? 'bg-success hover:bg-success' : ''}`}
              onClick={() => handleAnswer(part.id)}
              disabled={showAnswer}
            >
              {part.emoji} {part.name[language]}
            </Button>
          ))}
        </div>

        {showAnswer && (
          <Button onClick={nextQuestion} className="w-full">
            {currentIndex + 1 >= bodyParts.length ? (language === 'sw' ? 'Tazama Matokeo' : 'See Results') : (language === 'sw' ? 'Swali Lifuatalo' : 'Next Question')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
