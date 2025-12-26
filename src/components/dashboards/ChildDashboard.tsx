import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ChildUser } from '@/types/emec';
import { demoChild } from '@/data/demoUsers';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Star, Trophy, BookOpen, Heart, AlertTriangle, Gamepad2, 
  Lock, Sparkles, Gift, Droplets, Apple, Activity
} from 'lucide-react';

export function ChildDashboard() {
  const { currentUser, getChildUser } = useAuth();
  const { t } = useLanguage();
  
  const child = (currentUser as ChildUser) || demoChild;
  const totalPoints = child.points || 250;
  const nextReward = 500;
  const progress = (totalPoints / nextReward) * 100;

  const quickActions = [
    { icon: Gamepad2, label: 'Quizzes', path: '/quizzes', color: 'bg-purple-500', description: 'Play & Learn!' },
    { icon: BookOpen, label: 'Education', path: '/education', color: 'bg-blue-500', description: 'Health Tips' },
    { icon: Heart, label: 'First Aid', path: '/first-aid', color: 'bg-pink-500', description: 'Stay Safe' },
    { icon: AlertTriangle, label: 'Emergency', path: '/emergency', color: 'bg-red-500', description: 'Get Help' },
  ];

  const achievements = [
    { icon: Star, label: 'Quiz Master', earned: true },
    { icon: Droplets, label: 'Hydration Hero', earned: true },
    { icon: Apple, label: 'Nutrition Ninja', earned: false },
    { icon: Activity, label: 'Exercise Expert', earned: false },
  ];

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Welcome Section */}
      <div className="relative overflow-hidden rounded-2xl p-6 gradient-child text-white">
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-3xl">👋</span>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {t('dashboard.welcome')}, {child.name.split(' ')[0]}!
              </h1>
              <p className="text-white/80">Ready to learn and play today?</p>
            </div>
          </div>

          {/* Points Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm">
            <Trophy className="w-5 h-5 text-yellow-300" />
            <span className="font-bold text-lg">{totalPoints}</span>
            <span className="text-white/80">points</span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-white/10 animate-float" />
        <div className="absolute bottom-4 right-16 w-12 h-12 rounded-full bg-white/10 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Points Progress */}
      <Card className="border-0 shadow-elegant">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-primary" />
              <span className="font-medium">Next Reward</span>
            </div>
            <span className="text-sm text-muted-foreground">{totalPoints} / {nextReward} points</span>
          </div>
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-muted-foreground mt-2">
            <Sparkles className="w-4 h-4 inline mr-1" />
            {nextReward - totalPoints} more points to unlock premium features!
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.path} to={action.path}>
              <Card className="border-0 shadow-elegant hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer h-full">
                <CardContent className="p-4 flex flex-col items-center text-center">
                  <div className={`w-14 h-14 rounded-2xl ${action.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="font-semibold">{action.label}</h3>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Health Profile */}
      <Card className="border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-primary" />
            My Health Profile
          </CardTitle>
          <CardDescription>Demo Data – Editable for Presentation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Age</p>
              <p className="font-semibold">{child.age} years</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50">
              <p className="text-sm text-muted-foreground">Blood Group</p>
              <p className="font-semibold">{child.bloodGroup}</p>
            </div>
          </div>
          
          {/* Allergies */}
          <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <p className="text-sm text-muted-foreground mb-2">Allergies</p>
            <div className="flex flex-wrap gap-2">
              {child.allergies.map((allergy) => (
                <Badge key={allergy} variant="destructive" className="text-sm">
                  {allergy}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card className="border-0 shadow-elegant">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            {t('dashboard.achievements')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-3">
            {achievements.map((achievement, i) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={i}
                  className={`flex flex-col items-center p-3 rounded-xl transition-all ${
                    achievement.earned
                      ? 'bg-primary/10 text-primary'
                      : 'bg-muted/50 text-muted-foreground opacity-50'
                  }`}
                >
                  <div className="relative">
                    <Icon className="w-8 h-8" />
                    {!achievement.earned && (
                      <Lock className="w-4 h-4 absolute -bottom-1 -right-1 bg-muted rounded-full p-0.5" />
                    )}
                  </div>
                  <span className="text-xs mt-2 text-center font-medium">{achievement.label}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Restricted Content Notice */}
      <Card className="border-2 border-dashed border-muted-foreground/30">
        <CardContent className="p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
            <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-muted-foreground">Some content is restricted</p>
            <p className="text-sm text-muted-foreground">Ask your parent to unlock more features!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
