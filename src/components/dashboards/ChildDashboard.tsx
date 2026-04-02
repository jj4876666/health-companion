import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChildUser } from '@/types/emec';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ConsentCodeModal } from '@/components/modals/ConsentCodeModal';
import { ChildHealthRecords } from '@/components/records/ChildHealthRecords';
import { 
  Star, Trophy, BookOpen, Heart, AlertTriangle, Gamepad2, 
  Lock, Sparkles, Gift, Droplets, Apple, Activity, Rocket,
  Smile, Brain, Music, Palette, Sun, Moon, CloudSun, Zap, FileText
} from 'lucide-react';

export function ChildDashboard() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [restrictedAccess, setRestrictedAccess] = useState(false);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('home');
  
  const childDefaults: Partial<ChildUser> = {
    age: 8,
    bloodGroup: 'Unknown',
    allergies: [],
    parentId: '',
    points: 250,
    completedQuizzes: [],
    restrictions: { sensitiveContent: true, requiresParentApproval: true },
  };
  const merged = { ...childDefaults, ...(currentUser || {}) };
  const child: ChildUser = {
    ...merged,
    allergies: merged.allergies ?? [],
    completedQuizzes: merged.completedQuizzes ?? [],
  } as ChildUser;
  const totalPoints = child.points || 250;
  const nextReward = 500;
  const progress = (totalPoints / nextReward) * 100;

  const quickActions = [
    { icon: Gamepad2, label: '🎮 Games', path: '/games', color: 'from-purple-400 to-pink-400', description: 'Play & Win!', emoji: '🎯' },
    { icon: BookOpen, label: '📚 Learn', path: '/education', color: 'from-blue-400 to-cyan-400', description: 'Fun Facts!', emoji: '🌟' },
    { icon: Brain, label: '🧠 Quizzes', path: '/quizzes', color: 'from-green-400 to-emerald-400', description: 'Test Yourself!', emoji: '💡' },
    { icon: Heart, label: '🏥 First Aid', path: '/first-aid', color: 'from-red-400 to-orange-400', description: 'Stay Safe!', emoji: '❤️' },
  ];

  const achievements = [
    { icon: '⭐', label: 'Quiz Master', earned: true, color: 'from-yellow-400 to-orange-400' },
    { icon: '💧', label: 'Hydration Hero', earned: true, color: 'from-blue-400 to-cyan-400' },
    { icon: '🍎', label: 'Nutrition Ninja', earned: false, color: 'from-green-400 to-emerald-400' },
    { icon: '🏃', label: 'Exercise Expert', earned: false, color: 'from-purple-400 to-pink-400' },
    { icon: '😴', label: 'Sleep Champion', earned: true, color: 'from-indigo-400 to-violet-400' },
    { icon: '🧼', label: 'Clean Hands Pro', earned: false, color: 'from-teal-400 to-cyan-400' },
  ];

  const moods = [
    { emoji: '😊', label: 'Happy', color: 'bg-yellow-400' },
    { emoji: '😴', label: 'Tired', color: 'bg-blue-400' },
    { emoji: '😐', label: 'Okay', color: 'bg-gray-400' },
    { emoji: '🤒', label: 'Sick', color: 'bg-red-400' },
    { emoji: '🤩', label: 'Excited', color: 'bg-pink-400' },
  ];

  const dailyTasks = [
    { task: 'Drink 6 glasses of water', done: true, points: 10, emoji: '💧' },
    { task: 'Eat fruits and vegetables', done: true, points: 15, emoji: '🥗' },
    { task: 'Complete a health quiz', done: false, points: 20, emoji: '🧠' },
    { task: 'Do 30 minutes of exercise', done: false, points: 25, emoji: '🏃' },
  ];

  const completedTasks = dailyTasks.filter(t => t.done).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20">
      <div className="p-4 md:p-6">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl h-auto p-1 mb-6">
            <TabsTrigger value="home" className="rounded-xl py-3 gap-2 text-base">
              <span className="text-xl">🏠</span>
              Home
            </TabsTrigger>
            <TabsTrigger value="records" className="rounded-xl py-3 gap-2 text-base">
              <FileText className="w-5 h-5" />
              My Health
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6 mt-0">
            {/* Animated Welcome Section */}
            <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white shadow-2xl">
          {/* Floating Decorations */}
          <div className="absolute top-2 right-8 text-4xl animate-bounce" style={{ animationDelay: '0s' }}>⭐</div>
          <div className="absolute top-12 right-20 text-3xl animate-bounce" style={{ animationDelay: '0.2s' }}>🌟</div>
          <div className="absolute bottom-4 right-4 text-5xl animate-bounce" style={{ animationDelay: '0.4s' }}>🚀</div>
          <div className="absolute top-4 left-1/2 text-2xl animate-pulse">✨</div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-20 h-20 rounded-full bg-white/30 flex items-center justify-center text-5xl animate-pulse border-4 border-white/50">
                👋
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold drop-shadow-lg">
                  Hey, {child.name.split(' ')[0]}! 🎉
                </h1>
                <p className="text-white/90 text-lg">Ready for an awesome day?</p>
              </div>
            </div>

            {/* Points Display with Animation */}
            <div className="inline-flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/25 backdrop-blur-sm border-2 border-white/30">
              <div className="text-3xl animate-bounce">🏆</div>
              <div>
                <span className="font-bold text-2xl">{totalPoints}</span>
                <span className="text-white/80 ml-1">points</span>
              </div>
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
          </div>

          {/* Wave decoration */}
          <div className="absolute bottom-0 left-0 right-0 h-8 opacity-30">
            <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-full">
              <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V95.8C57.63,118.92,150.68,73.53,321.39,56.44Z" fill="white"></path>
            </svg>
          </div>
        </div>

        {/* Mood Checker */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">🌈</span>
              <h3 className="font-bold text-lg">How are you feeling today?</h3>
            </div>
            <div className="flex gap-3 justify-center">
              {moods.map((mood) => (
                <button
                  key={mood.label}
                  onClick={() => setSelectedMood(mood.label)}
                  className={`flex flex-col items-center p-3 rounded-2xl transition-all duration-300 hover:scale-110 ${
                    selectedMood === mood.label 
                      ? `${mood.color} text-white scale-110 shadow-lg` 
                      : 'bg-muted/50 hover:bg-muted'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium mt-1">{mood.label}</span>
                </button>
              ))}
            </div>
            {selectedMood && (
              <p className="text-center mt-4 text-sm text-muted-foreground animate-fade-in">
                {selectedMood === 'Happy' && "That's wonderful! Keep smiling! 😊"}
                {selectedMood === 'Tired' && "Get some rest, superhero! 💤"}
                {selectedMood === 'Okay' && "Every day is a new adventure! 🌟"}
                {selectedMood === 'Sick' && "Feel better soon! Remember to tell a grown-up 🤗"}
                {selectedMood === 'Excited' && "Woohoo! Let's do something fun! 🎉"}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Points Progress with Fun Animation */}
        <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-4xl animate-bounce">🎁</div>
                <div>
                  <span className="font-bold text-lg">Next Reward</span>
                  <p className="text-sm text-muted-foreground">Keep going, you're almost there!</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-orange-500">{totalPoints}/{nextReward}</span>
            </div>
            <div className="relative">
              <Progress value={progress} className="h-6 rounded-full bg-orange-200" />
              <div 
                className="absolute top-0 h-6 flex items-center justify-end pr-2 transition-all duration-500"
                style={{ width: `${progress}%` }}
              >
                <span className="text-xl">🏃</span>
              </div>
            </div>
            <p className="text-center mt-3 font-medium text-orange-600 dark:text-orange-400">
              ⭐ {nextReward - totalPoints} more points to unlock a surprise! ⭐
            </p>
          </CardContent>
        </Card>

        {/* Daily Tasks */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-2xl">📋</span>
              Today's Health Missions
              <Badge className="bg-green-500 text-white ml-auto">
                {completedTasks}/{dailyTasks.length} Done!
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dailyTasks.map((task, i) => (
              <div 
                key={i}
                className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${
                  task.done 
                    ? 'bg-green-100 dark:bg-green-900/30 border-2 border-green-300' 
                    : 'bg-muted/50 hover:bg-muted'
                }`}
              >
                <span className="text-3xl">{task.emoji}</span>
                <div className="flex-1">
                  <p className={`font-medium ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                    {task.task}
                  </p>
                  <p className="text-xs text-muted-foreground">+{task.points} points</p>
                </div>
                {task.done ? (
                  <div className="text-3xl animate-bounce">✅</div>
                ) : (
                  <Button size="sm" className="rounded-full bg-primary hover:bg-primary/80">
                    Do it!
                  </Button>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions - Fun Grid */}
        <div className="grid grid-cols-2 gap-4">
          {quickActions.map((action) => (
            <Link key={action.path} to={action.path}>
              <Card className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer h-full overflow-hidden rounded-3xl group">
                <CardContent className={`p-0 bg-gradient-to-br ${action.color}`}>
                  <div className="p-5 text-white relative overflow-hidden">
                    {/* Background decoration */}
                    <div className="absolute -right-4 -top-4 text-6xl opacity-30 group-hover:opacity-50 transition-opacity">
                      {action.emoji}
                    </div>
                    
                    <div className="relative z-10">
                      <h3 className="font-bold text-xl mb-1">{action.label}</h3>
                      <p className="text-white/80 text-sm">{action.description}</p>
                    </div>
                    
                    {/* Animated arrow */}
                    <div className="mt-4 flex items-center gap-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="text-sm font-medium">Let's go!</span>
                      <span className="group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Health Profile */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-2xl">🏥</span>
              My Health Card
            </CardTitle>
            <CardDescription>Your personal health information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30">
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-bold text-2xl">{child.age} <span className="text-sm font-normal">years old</span></p>
                <span className="text-xl">👶</span>
              </div>
              <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
                <p className="text-sm text-muted-foreground">Blood Type</p>
                <p className="font-bold text-2xl">{child.bloodGroup}</p>
                <span className="text-xl">🩸</span>
              </div>
            </div>
            
            {/* Allergies with fun styling */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-900/30 dark:to-red-900/30 border-2 border-orange-300/50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">⚠️</span>
                <p className="font-bold">Things I'm Allergic To</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {child.allergies.map((allergy) => (
                  <Badge key={allergy} className="text-sm py-1.5 px-3 bg-red-500 text-white rounded-full">
                    🚫 {allergy}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements with Fun Animation */}
        <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <span className="text-2xl">🏅</span>
              My Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((achievement, i) => (
                <div
                  key={i}
                  className={`flex flex-col items-center p-4 rounded-2xl transition-all ${
                    achievement.earned
                      ? `bg-gradient-to-br ${achievement.color} text-white shadow-lg hover:scale-105`
                      : 'bg-muted/50 text-muted-foreground opacity-60'
                  }`}
                >
                  <div className="relative">
                    <span className={`text-4xl ${achievement.earned ? 'animate-bounce' : ''}`}>
                      {achievement.icon}
                    </span>
                    {!achievement.earned && (
                      <Lock className="w-4 h-4 absolute -bottom-1 -right-1 bg-muted rounded-full p-0.5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center font-bold">{achievement.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Restricted Content Notice with Fun Styling */}
        <Card 
          className="border-4 border-dashed border-purple-300 dark:border-purple-700 cursor-pointer hover:border-yellow-400 transition-all rounded-3xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20"
          onClick={() => setShowConsentModal(true)}
        >
          <CardContent className="p-5 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-3xl">
              🔒
            </div>
            <div className="flex-1">
              <p className="font-bold text-lg">Secret Section! 🤫</p>
              <p className="text-sm text-muted-foreground">Ask your parent for the magic code!</p>
            </div>
            <div className="text-4xl animate-pulse">✨</div>
          </CardContent>
        </Card>

        {/* Fun Footer */}
        <div className="text-center py-4">
          <p className="text-muted-foreground text-sm">
            🌟 Keep being awesome, {child.name.split(' ')[0]}! 🌟
          </p>
        </div>
          </TabsContent>

          {/* Health Records Tab */}
          <TabsContent value="records" className="mt-0">
            <ChildHealthRecords />
          </TabsContent>
        </Tabs>

        {/* Consent Code Modal */}
        <ConsentCodeModal
          isOpen={showConsentModal}
          onClose={() => setShowConsentModal(false)}
          onSuccess={() => {
            setShowConsentModal(false);
            setRestrictedAccess(true);
          }}
        />
      </div>
    </div>
  );
}
