import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePoints } from '@/contexts/PointsContext';
import { ChildUser } from '@/types/emec';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChildHealthRecords } from '@/components/records/ChildHealthRecords';
import { EmbeddedAIChat } from '@/components/chat/EmbeddedAIChat';
import { PeriodTracker } from '@/components/wellness/PeriodTracker';
import { 
  Star, Trophy, BookOpen, Heart, Gamepad2, 
  Lock, Sparkles, Brain, FileText, MessageCircle,
  Activity, Target, TrendingUp, Zap, Shield, Users
} from 'lucide-react';

export function TeenDashboard() {
  const { currentUser } = useAuth();
  const { t } = useLanguage();
  const { points, streak } = usePoints();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  
  const teenDefaults: Partial<ChildUser> = {
    age: 15,
    bloodGroup: 'Unknown',
    allergies: [],
    parentId: '',
    points: 480,
    completedQuizzes: [],
    restrictions: { sensitiveContent: false, requiresParentApproval: true },
  };
  const merged = { ...teenDefaults, ...(currentUser || {}) };
  const teen: ChildUser = {
    ...merged,
    allergies: merged.allergies ?? [],
    completedQuizzes: merged.completedQuizzes ?? [],
  } as ChildUser;
  const totalPoints = points || teen.points || 480;
  const nextReward = 1000;
  const progress = (totalPoints / nextReward) * 100;

  const quickActions = [
    { icon: BookOpen, label: 'Education', path: '/education', color: 'bg-indigo-600 hover:bg-indigo-700', description: 'Learn about health topics' },
    { icon: Brain, label: 'Quizzes', path: '/quizzes', color: 'bg-violet-600 hover:bg-violet-700', description: 'Test your knowledge' },
    { icon: Gamepad2, label: 'Games', path: '/games', color: 'bg-purple-600 hover:bg-purple-700', description: 'Play health games' },
    { icon: Heart, label: 'First Aid', path: '/first-aid', color: 'bg-rose-600 hover:bg-rose-700', description: 'Emergency guides' },
  ];

  const healthTopics = [
    { label: 'Puberty & Growth', icon: TrendingUp, unlocked: true, color: 'text-purple-500' },
    { label: 'Mental Health', icon: Brain, unlocked: true, color: 'text-indigo-500' },
    { label: 'Nutrition', icon: Activity, unlocked: true, color: 'text-green-500' },
    { label: 'Reproductive Health', icon: Shield, unlocked: teen.age >= 15, color: 'text-rose-500' },
  ];

  const moods = [
    { emoji: '😊', label: 'Good', value: 'good' },
    { emoji: '😐', label: 'Okay', value: 'okay' },
    { emoji: '😔', label: 'Down', value: 'down' },
    { emoji: '😰', label: 'Anxious', value: 'anxious' },
    { emoji: '😤', label: 'Stressed', value: 'stressed' },
  ];

  const achievements = [
    { icon: Star, label: 'Quiz Pro', earned: true },
    { icon: Trophy, label: 'Health Champion', earned: true },
    { icon: Brain, label: 'Mental Wellness', earned: false },
    { icon: Activity, label: 'Fitness Star', earned: false },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-indigo-50/30 to-purple-50/30 dark:from-slate-950 dark:via-indigo-950/20 dark:to-purple-950/20">
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        {/* Tab Navigation */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 rounded-xl h-12 p-1 mb-6 bg-slate-100 dark:bg-slate-800">
            <TabsTrigger value="home" className="rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <span className="hidden sm:inline">Home</span>
              🏠
            </TabsTrigger>
            <TabsTrigger value="records" className="rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Records</span>
            </TabsTrigger>
            <TabsTrigger value="wellness" className="rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Wellness</span>
            </TabsTrigger>
            <TabsTrigger value="chat" className="rounded-lg gap-2 data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700">
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">AI Chat</span>
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home" className="space-y-6 mt-0">
            {/* Welcome Header - Clean, Modern */}
            <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 text-white shadow-xl">
              <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-white/10 to-transparent"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      Hey, {teen.name.split(' ')[0]}
                    </h1>
                    <p className="text-white/80 mt-1">Welcome back to your health hub</p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-sm">
                    <Zap className="w-5 h-5 text-yellow-300" />
                    <div>
                      <span className="font-bold text-xl">{totalPoints}</span>
                      <span className="text-white/80 text-sm ml-1">pts</span>
                    </div>
                  </div>
                </div>

                {/* Streak Display */}
                {streak > 0 && (
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <span className="text-orange-300">🔥</span>
                    <span>{streak} day streak</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-indigo-600">{teen.age}</div>
                  <div className="text-xs text-muted-foreground">Years Old</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-rose-600">{teen.bloodGroup}</div>
                  <div className="text-xs text-muted-foreground">Blood Type</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">3</div>
                  <div className="text-xs text-muted-foreground">Quizzes Done</div>
                </CardContent>
              </Card>
              <Card className="border-0 shadow-md bg-white dark:bg-slate-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">{achievements.filter(a => a.earned).length}</div>
                  <div className="text-xs text-muted-foreground">Badges Earned</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action) => (
                <Link key={action.path} to={action.path}>
                  <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
                    <CardContent className={`p-4 ${action.color} text-white`}>
                      <div className="flex items-center gap-3">
                        <action.icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        <div>
                          <h3 className="font-semibold">{action.label}</h3>
                          <p className="text-xs text-white/70">{action.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Health Topics Access */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-indigo-500" />
                  Your Health Topics
                </CardTitle>
                <CardDescription>Content unlocked based on your age</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {healthTopics.map((topic, i) => (
                  <div
                    key={i}
                    className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                      topic.unlocked 
                        ? 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer' 
                        : 'bg-slate-100 dark:bg-slate-900 opacity-50'
                    }`}
                  >
                    <topic.icon className={`w-5 h-5 ${topic.color}`} />
                    <span className="font-medium text-sm">{topic.label}</span>
                    {!topic.unlocked && <Lock className="w-4 h-4 ml-auto text-muted-foreground" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Points Progress */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="w-5 h-5 text-purple-500" />
                    <span className="font-semibold">Progress to Next Reward</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{totalPoints}/{nextReward}</span>
                </div>
                <Progress value={progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  {nextReward - totalPoints} more points to unlock premium features
                </p>
              </CardContent>
            </Card>

            {/* Achievements */}
            <Card className="border-0 shadow-md">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around">
                  {achievements.map((achievement, i) => (
                    <div
                      key={i}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                        achievement.earned
                          ? 'text-yellow-600'
                          : 'text-muted-foreground opacity-40'
                      }`}
                    >
                      <div className={`p-3 rounded-full ${achievement.earned ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-muted'}`}>
                        <achievement.icon className="w-6 h-6" />
                      </div>
                      <span className="text-xs mt-2 font-medium text-center">{achievement.label}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Allergies Notice */}
            {teen.allergies && teen.allergies.length > 0 && (
              <Card className="border-0 shadow-md border-l-4 border-l-orange-500">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-orange-500" />
                    <div>
                      <p className="font-semibold text-sm">Known Allergies</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {teen.allergies.map((allergy) => (
                          <Badge key={allergy} variant="outline" className="text-xs bg-orange-50 border-orange-200 text-orange-700">
                            {allergy}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Records Tab */}
          <TabsContent value="records" className="mt-0">
            <ChildHealthRecords />
          </TabsContent>

          {/* Wellness Tab */}
          <TabsContent value="wellness" className="space-y-6 mt-0">
            {/* Mood Check-in */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-500" />
                  How are you feeling today?
                </CardTitle>
                <CardDescription>Check in with yourself - it's important</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex justify-around">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                        selectedMood === mood.value 
                          ? 'bg-indigo-100 dark:bg-indigo-900/30 ring-2 ring-indigo-500' 
                          : 'hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="text-2xl">{mood.emoji}</span>
                      <span className="text-xs mt-1 font-medium">{mood.label}</span>
                    </button>
                  ))}
                </div>
                {selectedMood && (
                  <div className="mt-4 p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="text-sm text-center">
                      {selectedMood === 'good' && "That's great! Keep up the positive energy."}
                      {selectedMood === 'okay' && "It's okay to have neutral days. Take it easy."}
                      {selectedMood === 'down' && "It's normal to feel down sometimes. Consider talking to someone you trust."}
                      {selectedMood === 'anxious' && "Deep breaths can help. Check out our mental health resources."}
                      {selectedMood === 'stressed' && "Stress is common at your age. Try some relaxation techniques."}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Period Tracker - Private */}
            <PeriodTracker />

            {/* Mental Health Resources */}
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-500" />
                  Mental Wellness Resources
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link to="/education">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                    <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
                      <Brain className="w-4 h-4 text-purple-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Mental Health Education</p>
                      <p className="text-xs text-muted-foreground">Learn about anxiety, stress, and coping</p>
                    </div>
                  </Button>
                </Link>
                <Link to="/consultation">
                  <Button variant="outline" className="w-full justify-start gap-3 h-auto py-3">
                    <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30">
                      <Users className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">Talk to Someone</p>
                      <p className="text-xs text-muted-foreground">Connect with a counselor</p>
                    </div>
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Chat Tab */}
          <TabsContent value="chat" className="mt-0">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-indigo-500" />
                  AI Health Assistant
                </CardTitle>
                <CardDescription>Ask questions about health, puberty, mental wellness, and more</CardDescription>
              </CardHeader>
              <CardContent>
                <EmbeddedAIChat />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
