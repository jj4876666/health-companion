import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { XCircle, Apple, Check } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

interface FoodItem {
  emoji: string;
  name: { en: string; sw: string; fr: string };
  category: 'protein' | 'carbs' | 'vegetable' | 'fruit' | 'dairy' | 'unhealthy';
  points: number;
}

const foods: FoodItem[] = [
  { emoji: '🍗', name: { en: 'Chicken', sw: 'Kuku', fr: 'Poulet' }, category: 'protein', points: 10 },
  { emoji: '🥚', name: { en: 'Egg', sw: 'Yai', fr: 'Œuf' }, category: 'protein', points: 10 },
  { emoji: '🍚', name: { en: 'Rice', sw: 'Wali', fr: 'Riz' }, category: 'carbs', points: 10 },
  { emoji: '🍞', name: { en: 'Bread', sw: 'Mkate', fr: 'Pain' }, category: 'carbs', points: 10 },
  { emoji: '🥦', name: { en: 'Broccoli', sw: 'Broccoli', fr: 'Brocoli' }, category: 'vegetable', points: 15 },
  { emoji: '🥕', name: { en: 'Carrot', sw: 'Karoti', fr: 'Carotte' }, category: 'vegetable', points: 15 },
  { emoji: '🍎', name: { en: 'Apple', sw: 'Tofaa', fr: 'Pomme' }, category: 'fruit', points: 15 },
  { emoji: '🍌', name: { en: 'Banana', sw: 'Ndizi', fr: 'Banane' }, category: 'fruit', points: 15 },
  { emoji: '🥛', name: { en: 'Milk', sw: 'Maziwa', fr: 'Lait' }, category: 'dairy', points: 10 },
  { emoji: '🍔', name: { en: 'Burger', sw: 'Baga', fr: 'Burger' }, category: 'unhealthy', points: -5 },
  { emoji: '🍟', name: { en: 'Fries', sw: 'Chipsi', fr: 'Frites' }, category: 'unhealthy', points: -5 },
  { emoji: '🍩', name: { en: 'Donut', sw: 'Donati', fr: 'Beignet' }, category: 'unhealthy', points: -5 },
];

interface HealthyEatingGameProps {
  onComplete: (points: number) => void;
  onClose: () => void;
}

export function HealthyEatingGame({ onComplete, onClose }: HealthyEatingGameProps) {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [plate, setPlate] = useState<FoodItem[]>([]);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [availableFoods] = useState(() => foods.sort(() => Math.random() - 0.5));

  const addToPlate = (food: FoodItem) => {
    if (plate.length >= 5) {
      toast({ title: language === 'sw' ? 'Sahani imejaa!' : 'Plate is full!', variant: 'destructive' });
      return;
    }
    if (plate.find(f => f.emoji === food.emoji)) {
      toast({ title: language === 'sw' ? 'Tayari umeongeza!' : 'Already added!', variant: 'destructive' });
      return;
    }
    setPlate([...plate, food]);
    setScore(prev => prev + food.points);
    toast({ 
      title: food.points > 0 ? '✅ ' + (language === 'sw' ? 'Chaguo zuri!' : 'Good choice!') : '⚠️ ' + (language === 'sw' ? 'Sio afya sana' : 'Not very healthy'),
      description: `${food.points > 0 ? '+' : ''}${food.points} points`
    });
  };

  const removeFromPlate = (index: number) => {
    const removed = plate[index];
    setPlate(plate.filter((_, i) => i !== index));
    setScore(prev => prev - removed.points);
  };

  const finishMeal = () => {
    const hasProtein = plate.some(f => f.category === 'protein');
    const hasVegetable = plate.some(f => f.category === 'vegetable');
    const hasFruit = plate.some(f => f.category === 'fruit');
    
    let bonusPoints = 0;
    if (hasProtein && hasVegetable && hasFruit) {
      bonusPoints = 30;
      toast({ title: '🌟 ' + (language === 'sw' ? 'Mlo Kamili!' : 'Balanced Meal!'), description: `+${bonusPoints} bonus!` });
    }
    
    setScore(prev => prev + bonusPoints);
    setGameComplete(true);
    onComplete(score + bonusPoints);
  };

  const categoryLabels = {
    protein: { en: 'Protein', sw: 'Protini', fr: 'Protéine' },
    carbs: { en: 'Carbs', sw: 'Wanga', fr: 'Glucides' },
    vegetable: { en: 'Vegetable', sw: 'Mboga', fr: 'Légume' },
    fruit: { en: 'Fruit', sw: 'Tunda', fr: 'Fruit' },
    dairy: { en: 'Dairy', sw: 'Maziwa', fr: 'Laitier' },
    unhealthy: { en: 'Junk Food', sw: 'Chakula Kibaya', fr: 'Malbouffe' },
  };

  if (gameComplete) {
    return (
      <Card className="border-0 shadow-elegant">
        <CardContent className="p-8 text-center space-y-4">
          <div className="text-6xl">🍽️</div>
          <h2 className="text-2xl font-bold">{language === 'sw' ? 'Mlo Wako!' : language === 'fr' ? 'Votre Repas!' : 'Your Meal!'}</h2>
          <div className="flex justify-center gap-2 text-3xl">{plate.map((f, i) => <span key={i}>{f.emoji}</span>)}</div>
          <p className="text-4xl font-bold text-primary">{score} {language === 'sw' ? 'pointi' : 'points'}</p>
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
            <Apple className="w-5 h-5 text-green-500" />
            {language === 'sw' ? 'Changamoto ya Kula kwa Afya' : language === 'fr' ? 'Défi Alimentation Saine' : 'Healthy Eating Challenge'}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}><XCircle className="w-5 h-5" /></Button>
        </div>
        <Badge variant="outline" className="bg-success/10 w-fit">{language === 'sw' ? 'Alama' : 'Score'}: {score}</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-2 border-green-500/30">
          <p className="text-sm text-muted-foreground mb-2">{language === 'sw' ? 'Sahani Yako' : language === 'fr' ? 'Votre Assiette' : 'Your Plate'} ({plate.length}/5)</p>
          <div className="flex gap-2 min-h-[60px] flex-wrap">
            {plate.map((food, index) => (
              <button key={index} onClick={() => removeFromPlate(index)} className="text-3xl p-2 bg-background rounded-lg hover:bg-destructive/20 transition-colors">
                {food.emoji}
              </button>
            ))}
            {plate.length === 0 && <p className="text-muted-foreground text-sm">{language === 'sw' ? 'Bonyeza vyakula kuongeza' : 'Click foods to add'}</p>}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {availableFoods.map((food, index) => (
            <button
              key={index}
              onClick={() => addToPlate(food)}
              disabled={plate.some(f => f.emoji === food.emoji)}
              className={`p-3 rounded-xl text-center transition-all ${plate.some(f => f.emoji === food.emoji) ? 'opacity-30' : 'hover:scale-105 hover:bg-accent'} ${food.category === 'unhealthy' ? 'bg-destructive/10' : 'bg-success/10'}`}
            >
              <span className="text-2xl">{food.emoji}</span>
              <p className="text-xs mt-1">{food.name[language]}</p>
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground text-center">
          💡 {language === 'sw' ? 'Ongeza protini, mboga, na matunda kwa bonus!' : 'Add protein, vegetables, and fruits for a bonus!'}
        </div>

        {plate.length > 0 && (
          <Button onClick={finishMeal} className="w-full">
            <Check className="w-4 h-4 mr-2" />
            {language === 'sw' ? 'Maliza Mlo' : language === 'fr' ? 'Terminer le Repas' : 'Complete Meal'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
