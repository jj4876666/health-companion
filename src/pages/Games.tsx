import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePoints } from '@/contexts/PointsContext';
import { useDemo } from '@/contexts/DemoContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PointsUnlockCard } from '@/components/premium/PointsUnlockCard';
import { 
  Gamepad2, Heart, Brain, 
  Trophy, Star, RefreshCcw, CheckCircle, XCircle,
  Zap, Target, Sparkles, Crown, ArrowLeft, Timer,
  Flame, Medal, Gift
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
  const { currentUser, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { points, addPoints } = usePoints();
  const { isDemoMode } = useDemo();

  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [streak, setStreak] = useState(0);

  // Demo points function for presentations
  const addDemoPoints = (amount: number) => {
    addPoints(amount, 'Demo Points for Presentation');
    setTotalPoints(prev => prev + amount);
    toast({
      title: "🎁 Demo Points Added!",
      description: `+${amount} points added for testing premium unlock features`,
    });
  };

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

  // Catch Game State
  const [catchScore, setCatchScore] = useState(0);
  const [catchLives, setCatchLives] = useState(3);
  const [basketPosition, setBasketPosition] = useState(50);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [catchGameActive, setCatchGameActive] = useState(false);

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
        
        updated.forEach(item => {
          if (item.y >= 85 && item.y < 90) {
            const caught = Math.abs(item.x - basketPosition) < 15;
            if (caught) {
              if (item.isHealthy) {
                setCatchScore(s => s + 10);
              } else {
                setCatchLives(l => l - 1);
              }
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
      addPoints(catchScore, 'Nutrition Catch Game');
      setTimeout(() => setActiveGame(null), 2000);
    }
  }, [catchLives, activeGame, catchScore, addPoints]);

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
          setStreak(prev => prev + 1);

          if (memoryMatches + 1 === healthCards.length) {
            const gamePoints = Math.max(100 - memoryMoves * 2, 20);
            setTotalPoints(prev => prev + gamePoints);
            addPoints(gamePoints, 'Memory Match Game');
          }
        }, 500);
      } else {
        setStreak(0);
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
    setActiveGame('reaction');
    setStreak(0);
  };

  // Handle Reaction Answer
  const handleReactionAnswer = (answer: boolean) => {
    if (!currentFact) return;

    if (answer === currentFact.isTrue) {
      setReactionScore(prev => prev + 10);
      setStreak(prev => prev + 1);
      toast({ title: "✅ Correct!", description: `+10 points • Streak: ${streak + 1}` });
    } else {
      setReactionLives(prev => prev - 1);
      setStreak(0);
      toast({ title: "❌ Wrong!", description: "Lost a life", variant: "destructive" });
    }

    if (factIndex + 1 < healthFacts.length && reactionLives > 1) {
      setFactIndex(prev => prev + 1);
      setCurrentFact(healthFacts[factIndex + 1]);
    } else {
      const gamePoints = reactionScore + (answer === currentFact.isTrue ? 10 : 0);
      setTotalPoints(prev => prev + gamePoints);
      addPoints(gamePoints, 'Fact or Fiction Quiz');
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

  const games = [
    {
      id: 'memory',
      title: 'Health Memory Match',
      description: 'Match healthy food and activity cards!',
      icon: Brain,
      gradient: 'from-violet-500 to-purple-600',
      bgGradient: 'from-violet-500/10 to-purple-600/10',
      difficulty: 'Easy',
      points: '50-100',
    },
    {
      id: 'reaction',
      title: 'Health Fact or Fiction',
      description: 'Quick! Is this health fact true or false?',
      icon: Zap,
      gradient: 'from-amber-500 to-orange-600',
      bgGradient: 'from-amber-500/10 to-orange-600/10',
      difficulty: 'Medium',
      points: '10-80',
    },
    {
      id: 'catch',
      title: 'Nutrition Catch',
      description: 'Catch healthy foods, avoid junk food!',
      icon: Target,
      gradient: 'from-emerald-500 to-green-600',
      bgGradient: 'from-emerald-500/10 to-green-600/10',
      difficulty: 'Hard',
      points: '100+',
    },
  ];

  // Render game based on active game
  const renderGame = () => {
    switch (activeGame) {
      case 'memory':
        return (
          <Card className="border-0 shadow-elegant overflow-hidden">
            <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setActiveGame(null)} className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Memory Match</span>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-white/20 text-white border-0">Moves: {memoryMoves}</Badge>
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="font-medium">{memoryMatches}/{healthCards.length} Matches</span>
                </div>
                {streak > 1 && (
                  <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white animate-pulse">
                    <Flame className="w-3 h-3 mr-1" />
                    {streak} Streak!
                  </Badge>
                )}
              </div>
              <Progress value={(memoryMatches / healthCards.length) * 100} className="h-2 mb-6" />
              
              <div className="grid grid-cols-4 gap-3">
                {memoryCards.map((card, index) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(index)}
                    className={`aspect-square rounded-2xl text-3xl md:text-4xl flex items-center justify-center transition-all duration-300 transform ${
                      card.isFlipped || card.isMatched
                        ? 'bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-900/30 dark:to-purple-900/30 scale-100 rotate-0'
                        : 'bg-gradient-to-br from-violet-500 to-purple-600 hover:scale-105 hover:shadow-lg cursor-pointer'
                    } ${card.isMatched ? 'opacity-60 ring-2 ring-success' : ''}`}
                    style={{ 
                      transform: card.isFlipped || card.isMatched ? 'rotateY(0deg)' : 'rotateY(0deg)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {card.isFlipped || card.isMatched ? card.emoji : '❓'}
                  </button>
                ))}
              </div>
              <Button onClick={startMemoryGame} variant="outline" className="w-full mt-6 gap-2">
                <RefreshCcw className="w-4 h-4" />
                Restart Game
              </Button>
            </CardContent>
          </Card>
        );

      case 'reaction':
        return (
          <Card className="border-0 shadow-elegant overflow-hidden">
            <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-4">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="icon" onClick={() => setActiveGame(null)} className="text-white hover:bg-white/20">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Fact or Fiction</span>
                </div>
                <Badge className="bg-white/20 text-white border-0">
                  Q{factIndex + 1}/{healthFacts.length}
                </Badge>
              </div>
            </div>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-xl">{reactionScore}</span>
                  <span className="text-muted-foreground">pts</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-6 h-6 transition-all ${i < reactionLives ? 'text-red-500 fill-red-500' : 'text-muted-foreground/30'}`}
                    />
                  ))}
                </div>
              </div>
              
              <Progress value={(factIndex / healthFacts.length) * 100} className="h-2" />

              {currentFact && (
                <>
                  <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-2 border-amber-500/30 text-center min-h-[120px] flex items-center justify-center">
                    <p className="text-lg md:text-xl font-medium">{currentFact.text}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Button 
                      size="lg" 
                      className="h-16 text-lg bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 shadow-lg"
                      onClick={() => handleReactionAnswer(true)}
                    >
                      <CheckCircle className="w-6 h-6 mr-2" />
                      TRUE
                    </Button>
                    <Button 
                      size="lg" 
                      className="h-16 text-lg bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-lg"
                      onClick={() => handleReactionAnswer(false)}
                    >
                      <XCircle className="w-6 h-6 mr-2" />
                      FALSE
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        );

      case 'catch':
        return (
          <Card className="border-0 shadow-elegant overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 p-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => { setActiveGame(null); setCatchGameActive(false); }} 
                  className="text-white hover:bg-white/20"
                >
                  <ArrowLeft className="w-5 h-5" />
                </Button>
                <div className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-white" />
                  <span className="font-bold text-white">Nutrition Catch</span>
                </div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-5 h-5 transition-all ${i < catchLives ? 'text-white fill-white' : 'text-white/30'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <CardContent className="p-0">
              <div className="p-4 flex items-center justify-between border-b">
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-xl">{catchScore}</span>
                  <span className="text-muted-foreground">pts</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>🍎 = +10</span>
                  <span className="text-muted-foreground/50">|</span>
                  <span>🍔 = -❤️</span>
                </div>
              </div>
              
              <div className="relative h-72 md:h-80 bg-gradient-to-b from-sky-200 via-sky-100 to-green-200 dark:from-sky-900 dark:via-sky-800 dark:to-green-900 overflow-hidden">
                {/* Falling Items */}
                {fallingItems.map(item => (
                  <div
                    key={item.id}
                    className="absolute text-3xl md:text-4xl transition-all duration-100 drop-shadow-lg"
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
                  className="absolute bottom-6 text-5xl transition-all duration-100"
                  style={{ left: `${basketPosition}%`, transform: 'translateX(-50%)' }}
                >
                  🧺
                </div>
              </div>

              {/* Mobile Controls */}
              <div className="grid grid-cols-2 gap-2 p-4 bg-muted/30">
                <Button 
                  variant="outline" 
                  className="h-14 text-lg font-medium"
                  onClick={() => setBasketPosition(prev => Math.max(10, prev - 10))}
                >
                  ← Move Left
                </Button>
                <Button 
                  variant="outline" 
                  className="h-14 text-lg font-medium"
                  onClick={() => setBasketPosition(prev => Math.min(90, prev + 10))}
                >
                  Move Right →
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Health Games</h1>
              <p className="text-muted-foreground">Learn while having fun!</p>
            </div>
          </div>
          
          {/* Stats Cards */}
          <div className="flex flex-wrap gap-3">
            <Card className="border-0 shadow-elegant bg-gradient-to-br from-amber-500/10 to-orange-500/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Points</p>
                  <p className="text-xl font-bold">{totalPoints}</p>
                </div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-elegant bg-gradient-to-br from-violet-500/10 to-purple-500/10">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                  <Medal className="w-5 h-5 text-violet-500" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Best Streak</p>
                  <p className="text-xl font-bold">{streak}</p>
                </div>
              </CardContent>
            </Card>
            
            {/* Demo Points Button - Only visible in demo mode */}
            {isDemoMode && (
              <Card className="border-2 border-dashed border-emerald-500/50 shadow-elegant bg-gradient-to-br from-emerald-500/10 to-green-500/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-emerald-500" />
                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">Demo Mode</span>
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="h-8 text-xs border-emerald-500/50 hover:bg-emerald-500/20"
                      onClick={() => addDemoPoints(100)}
                    >
                      +100 pts
                    </Button>
                    <Button 
                      size="sm" 
                      className="h-8 text-xs bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
                      onClick={() => addDemoPoints(500)}
                    >
                      +500 pts
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Active Game or Game Selection */}
        {activeGame ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
            {renderGame()}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {games.map((game, index) => (
              <Card 
                key={game.id}
                className="group border-0 shadow-elegant cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  if (game.id === 'memory') startMemoryGame();
                  else if (game.id === 'reaction') startReactionGame();
                  else if (game.id === 'catch') startCatchGame();
                }}
              >
                <div className={`h-2 bg-gradient-to-r ${game.gradient}`} />
                <CardContent className="p-6">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${game.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <game.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{game.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{game.description}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {game.difficulty}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Star className="w-3 h-3 mr-1" />
                      {game.points} pts
                    </Badge>
                  </div>
                </CardContent>
                <div className={`p-4 bg-gradient-to-r ${game.bgGradient} flex items-center justify-center gap-2 group-hover:bg-opacity-100 transition-all`}>
                  <Sparkles className="w-4 h-4" />
                  <span className="font-medium">Play Now</span>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Points Unlock Card & How to Earn Points */}
        {!activeGame && (
          <div className="grid lg:grid-cols-2 gap-6">
            <PointsUnlockCard />
            
            <Card className="border-0 shadow-elegant bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Crown className="w-6 h-6 text-amber-500" />
                  <h3 className="font-bold text-lg">How to Earn Points</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-background/80">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                      <Brain className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <p className="font-medium">Memory Match</p>
                      <p className="text-sm text-muted-foreground">Fewer moves = More points (20-100 pts)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-background/80">
                    <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <p className="font-medium">Fact or Fiction</p>
                      <p className="text-sm text-muted-foreground">10 points per correct answer (up to 80 pts)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-background/80">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Target className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="font-medium">Nutrition Catch</p>
                      <p className="text-sm text-muted-foreground">10 points per healthy food caught</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <p className="text-sm text-center">
                    <span className="font-semibold">💡 Tip:</span> Complete quizzes and education modules to earn even more points!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}