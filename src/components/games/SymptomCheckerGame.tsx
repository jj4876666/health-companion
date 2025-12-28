import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { XCircle, Stethoscope } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface SymptomQuestion {
  id: string;
  symptoms: { en: string; sw: string; fr: string };
  condition: { en: string; sw: string; fr: string };
  options: { en: string; sw: string; fr: string }[];
  correctIndex: number;
}

const questions: SymptomQuestion[] = [
  { id: '1', symptoms: { en: 'Fever, cough, runny nose, body aches', sw: 'Homa, kikohozi, kamasi, maumivu ya mwili', fr: 'Fièvre, toux, nez qui coule, courbatures' }, condition: { en: 'Flu', sw: 'Mafua', fr: 'Grippe' }, options: [{ en: 'Flu', sw: 'Mafua', fr: 'Grippe' }, { en: 'Food Poisoning', sw: 'Sumu ya Chakula', fr: 'Intoxication Alimentaire' }, { en: 'Malaria', sw: 'Malaria', fr: 'Paludisme' }, { en: 'Allergy', sw: 'Mzio', fr: 'Allergie' }], correctIndex: 0 },
  { id: '2', symptoms: { en: 'Itchy skin, rash, sneezing, watery eyes', sw: 'Ngozi inayowasha, upele, kupiga chafya, macho yenye machozi', fr: 'Démangeaisons, éruption cutanée, éternuements, yeux larmoyants' }, condition: { en: 'Allergic Reaction', sw: 'Athari ya Mzio', fr: 'Réaction Allergique' }, options: [{ en: 'Cold', sw: 'Baridi', fr: 'Rhume' }, { en: 'Allergic Reaction', sw: 'Athari ya Mzio', fr: 'Réaction Allergique' }, { en: 'Flu', sw: 'Mafua', fr: 'Grippe' }, { en: 'Measles', sw: 'Surua', fr: 'Rougeole' }], correctIndex: 1 },
  { id: '3', symptoms: { en: 'High fever, headache, joint pain, fatigue', sw: 'Homa kali, maumivu ya kichwa, maumivu ya viungo, uchovu', fr: 'Forte fièvre, maux de tête, douleurs articulaires, fatigue' }, condition: { en: 'Malaria', sw: 'Malaria', fr: 'Paludisme' }, options: [{ en: 'Cold', sw: 'Baridi', fr: 'Rhume' }, { en: 'Flu', sw: 'Mafua', fr: 'Grippe' }, { en: 'Malaria', sw: 'Malaria', fr: 'Paludisme' }, { en: 'Typhoid', sw: 'Homa ya Matumbo', fr: 'Typhoïde' }], correctIndex: 2 },
  { id: '4', symptoms: { en: 'Stomach cramps, vomiting, diarrhea after eating', sw: 'Maumivu ya tumbo, kutapika, kuharisha baada ya kula', fr: 'Crampes abdominales, vomissements, diarrhée après manger' }, condition: { en: 'Food Poisoning', sw: 'Sumu ya Chakula', fr: 'Intoxication Alimentaire' }, options: [{ en: 'Appendicitis', sw: 'Kiambatisho', fr: 'Appendicite' }, { en: 'Food Poisoning', sw: 'Sumu ya Chakula', fr: 'Intoxication Alimentaire' }, { en: 'Ulcer', sw: 'Kidonda', fr: 'Ulcère' }, { en: 'Flu', sw: 'Mafua', fr: 'Grippe' }], correctIndex: 1 },
  { id: '5', symptoms: { en: 'Sore throat, difficulty swallowing, swollen tonsils', sw: 'Maumivu ya koo, ugumu wa kumeza, tonsili zilizovimba', fr: 'Mal de gorge, difficulté à avaler, amygdales enflées' }, condition: { en: 'Tonsillitis', sw: 'Tonsili', fr: 'Amygdalite' }, options: [{ en: 'Cold', sw: 'Baridi', fr: 'Rhume' }, { en: 'Asthma', sw: 'Pumu', fr: 'Asthme' }, { en: 'Tonsillitis', sw: 'Tonsili', fr: 'Amygdalite' }, { en: 'Bronchitis', sw: 'Bronkitisi', fr: 'Bronchite' }], correctIndex: 2 },
];

interface SymptomCheckerGameProps {
  onComplete: (points: number) => void;
  onClose: () => void;
}

export function SymptomCheckerGame({ onComplete, onClose }: SymptomCheckerGameProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [gameComplete, setGameComplete] = useState(false);

  const handleAnswer = (index: number) => {
    if (showAnswer) return;
    setSelectedAnswer(index);
    setShowAnswer(true);
    
    if (index === questions[currentIndex].correctIndex) {
      setScore(prev => prev + 20);
      toast({ title: '✅ Correct!', description: '+20 points' });
    } else {
      toast({ title: '❌ Incorrect', description: `The answer was ${questions[currentIndex].condition[language]}`, variant: 'destructive' });
    }
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= questions.length) {
      setGameComplete(true);
      onComplete(score);
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setShowAnswer(false);
    setSelectedAnswer(null);
  };

  const current = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  if (gameComplete) {
    return (
      <Card className="border-0 shadow-elegant">
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-6xl">🏥</div>
          <h2 className="text-2xl font-bold">{language === 'sw' ? 'Umefanya Vizuri!' : language === 'fr' ? 'Bien Joué!' : 'Well Done!'}</h2>
          <p className="text-4xl font-bold text-primary">{score} / {questions.length * 20}</p>
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
            <Stethoscope className="w-5 h-5 text-blue-500" />
            {language === 'sw' ? 'Jaribio la Dalili' : language === 'fr' ? 'Quiz Symptômes' : 'Symptom Checker Quiz'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}><XCircle className="w-5 h-5" /></Button>
        </div>
        <div className="flex gap-4 text-sm">
          <Badge variant="outline" className="bg-success/10">{language === 'sw' ? 'Alama' : 'Score'}: {score}</Badge>
          <Badge variant="outline">{currentIndex + 1}/{questions.length}</Badge>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-2 border-blue-500/30">
          <p className="text-sm text-muted-foreground mb-2">{language === 'sw' ? 'Dalili:' : language === 'fr' ? 'Symptômes:' : 'Symptoms:'}</p>
          <p className="text-lg font-medium">{current.symptoms[language]}</p>
          <p className="text-sm text-muted-foreground mt-4">{language === 'sw' ? 'Hii inaweza kuwa hali gani?' : language === 'fr' ? 'Quelle condition cela pourrait-il être?' : 'What condition could this be?'}</p>
        </div>

        <div className="grid gap-3">
          {current.options.map((option, index) => (
            <Button
              key={index}
              variant={showAnswer ? (index === current.correctIndex ? 'default' : selectedAnswer === index ? 'destructive' : 'outline') : 'outline'}
              className={`h-14 text-left justify-start ${showAnswer && index === current.correctIndex ? 'bg-success hover:bg-success' : ''}`}
              onClick={() => handleAnswer(index)}
              disabled={showAnswer}
            >
              {option[language]}
            </Button>
          ))}
        </div>

        {showAnswer && (
          <Button onClick={nextQuestion} className="w-full">
            {currentIndex + 1 >= questions.length ? (language === 'sw' ? 'Tazama Matokeo' : 'See Results') : (language === 'sw' ? 'Swali Lifuatalo' : 'Next Question')}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
