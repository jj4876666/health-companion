import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, Heart, Apple, Droplets, Activity, Brain, 
  Trophy, Star, Timer, RefreshCcw, CheckCircle, XCircle,
  Zap, Target, Sparkles, Crown
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

// Memory Match Game Data
const healthCards = [
  { id: 1, emoji: '🍎', name: 'Apple' },
  { id: 2, emoji: '🥦', name: 'Broccoli' },
  { id: 3, emoji: '🥕', name: 'Carrot' },
  { id: 4, emoji: '💧', name: 'Water' },
  { id: 5, emoji: '🏃', name: 'Exercise' },
  { id: 6, emoji: '😴', name: 'Sleep' },
  { id: 7, emoji: '🧘', name: 'Yoga' },
  { id: 8, emoji: '🍊', name: 'Orange' },
];

// Reaction Game Health Facts
const healthFacts = [
  { text: 'Drinking 8 glasses of water daily keeps you hydrated', isTrue: true },
  { text: 'Eating vegetables is bad for your health', isTrue: false },
  { text: 'Exercise helps strengthen your heart', isTrue: true },
  { text: 'Sleeping less than 4 hours is good for children', isTrue: false },
  { text: 'Washing hands prevents disease spread', isTrue: true },
  { text: 'Brushing teeth once a month is enough', isTrue: false },
  { text: 'Fruits contain vitamins and minerals', isTrue: true },
  { text: 'Sugary drinks are healthier than water', isTrue: false },
];

// Nutrition Catch Game
interface FallingItem {
  id: number;
  emoji: string;
  isHealthy: boolean;
  x: number;
  y: number;
}

const healthyFoods = ['🍎', '🥦', '🥕', '🍊', '🥬', '🍇', '🥒', '🍓'];
const unhealthyFoods = ['🍔', '🍟', '🍩', '🍭', '🧁', '🍪', '🥤', '🍫'];

export default function Games() {
  const { currentUser, isAuthenticated, updateChildPoints } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  // Memory Match State
  const [memoryCards, setMemoryCards] = useState<Array<{ id: number; emoji: string; name: string; isFlipped: boolean; isMatched: boolean }>>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [memoryMatches, setMemoryMatches] = useState(0);

  // Reaction Game State
  const [reactionScore, setReactionScore] = useState(0);
  const [reactionLives, setReactionLives] = useState(3);
  const [currentFact, setCurrentFact] = useState<typeof healthFacts[0] | null>(null);
  const [factIndex, setFactIndex] = useState(0);
  const [reactionTime, setReactionTime] = useState(10);

  // Catch Game State
  const [catchScore, setCatchScore] = useState(0);
  const [catchLives, setCatchLives] = useState(3);
  const [basketPosition, setBasketPosition] = useState(50);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [catchGameActive, setCatchGameActive] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Initialize Memory Game
  const startMemoryGame = () => {
    const shuffledCards = [...healthCards, ...healthCards]
      .sort(() => Math.random() - 0.5)
      .map((card, index) => ({
        ...card,
        id: index,
        isFlipped: false,
        isMatched: false,
      }));
    setMemoryCards(shuffledCards);
    setSelectedCards([]);
    setMemoryMoves(0);
    setMemoryMatches(0);
    setActiveGame('memory');
  };

  // Handle Memory Card Click
  const handleCardClick = (index: number) => {
    if (selectedCards.length === 2) return;
    if (memoryCards[index].isFlipped || memoryCards[index].isMatched) return;

    const newCards = [...memoryCards];
    newCards[index].isFlipped = true;
    setMemoryCards(newCards);
    setSelectedCards([...selectedCards, index]);

    if (selectedCards.length === 1) {
      setMemoryMoves(prev => prev + 1);
      const firstCard = memoryCards[selectedCards[0]];
      const secondCard = newCards[index];

      if (firstCard.emoji === secondCard.emoji) {
        setTimeout(() => {
          const matchedCards = [...newCards];
          matchedCards[selectedCards[0]].isMatched = true;
          matchedCards[index].isMatched = true;
          setMemoryCards(matchedCards);
          setSelectedCards([]);
          setMemoryMatches(prev => prev + 1);

          if (memoryMatches + 1 === healthCards.length) {
            const points = Math.max(100 - memoryMoves * 2, 20);
            setTotalPoints(prev => prev + points);
            updateChildPoints(points);
            toast({
              title: "🎉 You Won!",
              description: `+${points} points! Completed in ${memoryMoves + 1} moves`,
            });
          }
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...newCards];
          resetCards[selectedCards[0]].isFlipped = false;
          resetCards[index].isFlipped = false;
          setMemoryCards(resetCards);
          setSelectedCards([]);
        }, 1000);
      }
    }
  };

  // Start Reaction Game
  const startReactionGame = () => {
    setReactionScore(0);
    setReactionLives(3);
    setFactIndex(0);
    setCurrentFact(healthFacts[0]);
    setReactionTime(10);
    setActiveGame('reaction');
  };

  // Handle Reaction Answer
  const handleReactionAnswer = (answer: boolean) => {
    if (!currentFact) return;

    if (answer === currentFact.isTrue) {
      setReactionScore(prev => prev + 10);
      toast({ title: "✅ Correct!", description: "+10 points" });
    } else {
      setReactionLives(prev => prev - 1);
      toast({ title: "❌ Wrong!", description: "Lost a life", variant: "destructive" });
    }

    if (factIndex + 1 < healthFacts.length && reactionLives > 1) {
      setFactIndex(prev => prev + 1);
      setCurrentFact(healthFacts[factIndex + 1]);
      setReactionTime(10);
    } else {
      const points = reactionScore + (answer === currentFact.isTrue ? 10 : 0);
      setTotalPoints(prev => prev + points);
      updateChildPoints(points);
      toast({
        title: reactionLives <= 1 && answer !== currentFact.isTrue ? "Game Over!" : "🎉 Well Done!",
        description: `Total: +${points} points`,
      });
      setActiveGame(null);
    }
  };

  // Start Catch Game
  const startCatchGame = () => {
    setCatchScore(0);
    setCatchLives(3);
    setBasketPosition(50);
    setFallingItems([]);
    setCatchGameActive(true);
    setActiveGame('catch');
  };

  // Catch Game Loop
  useEffect(() => {
    if (!catchGameActive || activeGame !== 'catch') return;

    const spawnInterval = setInterval(() => {
      const isHealthy = Math.random() > 0.4;
      const foods = isHealthy ? healthyFoods : unhealthyFoods;
      const newItem: FallingItem = {
        id: Date.now(),
        emoji: foods[Math.floor(Math.random() * foods.length)],
        isHealthy,
        x: Math.random() * 80 + 10,
        y: 0,
      };
      setFallingItems(prev => [...prev, newItem]);
    }, 1500);

    const moveInterval = setInterval(() => {
      setFallingItems(prev => {
        const updated = prev.map(item => ({ ...item, y: item.y + 5 }));
        
        // Check catches and misses
        updated.forEach(item => {
          if (item.y >= 85 && item.y < 90) {
            const caught = Math.abs(item.x - basketPosition) < 15;
            if (caught) {
              if (item.isHealthy) {
                setCatchScore(s => s + 10);
              } else {
                setCatchLives(l => l - 1);
              }
            } else if (item.isHealthy) {
              // Missed healthy food
            }
          }
        });

        return updated.filter(item => item.y < 100);
      });
    }, 100);

    return () => {
      clearInterval(spawnInterval);
      clearInterval(moveInterval);
    };
  }, [catchGameActive, activeGame, basketPosition]);

  // End catch game when lives run out
  useEffect(() => {
    if (catchLives <= 0 && activeGame === 'catch') {
      setCatchGameActive(false);
      setTotalPoints(prev => prev + catchScore);
      updateChildPoints(catchScore);
      toast({
        title: "Game Over!",
        description: `Total: +${catchScore} points`,
      });
      setTimeout(() => setActiveGame(null), 2000);
    }
  }, [catchLives]);

  // Keyboard controls for catch game
  useEffect(() => {
    if (activeGame !== 'catch') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setBasketPosition(prev => Math.max(10, prev - 10));
      } else if (e.key === 'ArrowRight') {
        setBasketPosition(prev => Math.min(90, prev + 10));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGame]);

  const games = [
    {
      id: 'memory',
      title: 'Health Memory Match',
      description: 'Match healthy food and activity cards!',
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Easy',
    },
    {
      id: 'reaction',
      title: 'Health Fact or Fiction',
      description: 'Quick! Is this health fact true or false?',
      icon: Zap,
      color: 'from-yellow-500 to-orange-500',
      difficulty: 'Medium',
    },
    {
      id: 'catch',
      title: 'Nutrition Catch',
      description: 'Catch healthy foods, avoid junk food!',
      icon: Target,
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Hard',
    },
  ];

  // Render game based on active game
  const renderGame = () => {
    switch (activeGame) {
      case 'memory':
        return (
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Health Memory Match
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveGame(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex gap-4 text-sm">
                <Badge variant="outline">Moves: {memoryMoves}</Badge>
                <Badge variant="outline">Matches: {memoryMatches}/{healthCards.length}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-3">
                {memoryCards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all duration-300 ${
                      card.isFlipped || card.isMatched
                        ? 'bg-primary/20 scale-100'
                        : 'bg-gradient-to-br from-purple-500 to-pink-500 hover:scale-105'
                    } ${card.isMatched ? 'opacity-50' : ''}`}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                  </button>
                ))}
              </div>
              <Button onClick={startMemoryGame} variant="outline" className="w-full mt-4">
                <RefreshCcw className="w-4 h-4 mr-2" />
                Restart Game
              </Button>
            </CardContent>
          </Card>
        );

      case 'reaction':
        return (
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Health Fact or Fiction
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setActiveGame(null)}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="bg-success/10">Score: {reactionScore}</Badge>
                <Badge variant="outline" className="bg-destructive/10">
                  Lives: {'❤️'.repeat(reactionLives)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentFact && (
                <>
                  <div className="p-6 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-2 border-yellow-500/30 text-center">
                    <p className="text-xl font-medium">{currentFact.text}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      size="lg" 
                      className="h-16 bg-success hover:bg-success/90"
                      onClick={() => handleReactionAnswer(true)}
                    >
                      <CheckCircle className="w-6 h-6 mr-2" />
                      TRUE
                    </Button>
                    <Button 
                      size="lg" 
                      className="h-16 bg-destructive hover:bg-destructive/90"
                      onClick={() => handleReactionAnswer(false)}
                    >
                      <XCircle className="w-6 h-6 mr-2" />
                      FALSE
                    </Button>
                  </div>
                  <Progress value={(factIndex / healthFacts.length) * 100} className="h-2" />
                  <p className="text-center text-sm text-muted-foreground">
                    Question {factIndex + 1} of {healthFacts.length}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        );

      case 'catch':
        return (
          <Card className="border-0 shadow-elegant overflow-hidden">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-500" />
                  Nutrition Catch
                </CardTitle>
                <Button variant="ghost" size="sm" onClick={() => { setActiveGame(null); setCatchGameActive(false); }}>
                  <XCircle className="w-5 h-5" />
                </Button>
              </div>
              <div className="flex gap-4 text-sm">
                <Badge variant="outline" className="bg-success/10">Score: {catchScore}</Badge>
                <Badge variant="outline" className="bg-destructive/10">
                  Lives: {'❤️'.repeat(Math.max(0, catchLives))}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="relative h-80 bg-gradient-to-b from-sky-200 to-green-200 dark:from-sky-900 dark:to-green-900 overflow-hidden">
                {/* Falling Items */}
                {fallingItems.map(item => (
                  <div
                    key={item.id}
                    className="absolute text-3xl transition-all duration-100"
                    style={{
                      left: `${item.x}%`,
                      top: `${item.y}%`,
                      transform: 'translateX(-50%)',
                    }}
                  >
                    {item.emoji}
                  </div>
                ))}
                
                {/* Basket */}
                <div
                  className="absolute bottom-4 text-4xl transition-all duration-100"
                  style={{ left: `${basketPosition}%`, transform: 'translateX(-50%)' }}
                >
                  🧺
                </div>

                {/* Instructions */}
                <div className="absolute bottom-2 left-2 right-2 text-center text-xs text-muted-foreground bg-background/80 rounded p-1">
                  Use ← → arrows or tap sides to move basket
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="grid grid-cols-2 gap-2 p-4">
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => setBasketPosition(prev => Math.max(10, prev - 10))}
                >
                  ← Left
                </Button>
                <Button 
                  variant="outline" 
                  className="h-12"
                  onClick={() => setBasketPosition(prev => Math.min(90, prev + 10))}
                >
                  Right →
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Health Games</h1>
            <p className="text-muted-foreground">Play, learn, and earn points!</p>
          </div>
        </div>

        {/* Points Display */}
        <Card className="border-0 shadow-elegant bg-gradient-to-br from-yellow-500/10 to-orange-500/10">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Session Points</p>
                <p className="text-2xl font-bold">{totalPoints}</p>
              </div>
            </div>
            <Badge className="bg-yellow-500 text-white">
              <Crown className="w-4 h-4 mr-1" />
              Gamer
            </Badge>
          </CardContent>
        </Card>

        {/* Active Game or Game Selection */}
        {activeGame ? (
          renderGame()
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {games.map((game) => {
              const Icon = game.icon;
              return (
                <Card 
                  key={game.id}
                  className="border-0 shadow-elegant hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
                  onClick={() => {
                    if (game.id === 'memory') startMemoryGame();
                    else if (game.id === 'reaction') startReactionGame();
                    else if (game.id === 'catch') startCatchGame();
                  }}
                >
                  <CardContent className="p-6">
                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.color} flex items-center justify-center mb-4`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-lg mb-1">{game.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{game.description}</p>
                    <Badge variant="outline">{game.difficulty}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Tips */}
        {!activeGame && (
          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                How to Earn More Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  Complete Memory Match with fewer moves for bonus points
                </li>
                <li className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-red-500" />
                  Keep all your lives in Fact or Fiction
                </li>
                <li className="flex items-center gap-2">
                  <Apple className="w-4 h-4 text-green-500" />
                  Catch only healthy foods for maximum score
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
