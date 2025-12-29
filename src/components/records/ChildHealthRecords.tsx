import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Syringe, Pill, AlertTriangle, Heart, Star, Sparkles,
  Shield, Trophy, Stethoscope
} from 'lucide-react';

// Simplified child-friendly health data
const childHealthData = {
  vaccineHeroes: [
    { id: '1', name: 'Polio Shield', emoji: '🛡️', date: 'When you were a baby', color: 'from-blue-400 to-cyan-400', completed: true },
    { id: '2', name: 'Measles Fighter', emoji: '⚔️', date: '2 years old', color: 'from-red-400 to-pink-400', completed: true },
    { id: '3', name: 'Flu Defender', emoji: '🦸', date: 'Last year', color: 'from-purple-400 to-violet-400', completed: true },
    { id: '4', name: 'Super Booster', emoji: '🚀', date: 'Coming soon!', color: 'from-yellow-400 to-orange-400', completed: false },
  ],
  bodyCheck: {
    height: '125 cm',
    weight: '28 kg',
    heartbeat: '❤️ Strong!',
    smile: '😁 Healthy teeth!',
    eyes: '👀 Perfect vision!',
    ears: '👂 Great hearing!',
  },
  allergies: [
    { item: 'Peanuts', emoji: '🥜', color: 'bg-red-500' },
    { item: 'Dust', emoji: '💨', color: 'bg-gray-500' },
  ],
  medicines: [
    { name: 'Vitamin Gummies', emoji: '🍬', when: 'Every morning', color: 'from-orange-400 to-yellow-400' },
    { name: 'Allergy Helper', emoji: '💊', when: 'When sneezy', color: 'from-purple-400 to-pink-400' },
  ],
  doctorVisits: [
    { reason: 'Yearly Checkup', emoji: '👨‍⚕️', date: 'January', outcome: '⭐ Super healthy!' },
    { reason: 'Cold Visit', emoji: '🤧', date: 'March', outcome: '💪 All better now!' },
  ],
  achievements: [
    { badge: '🏅 Brave Shot Champion', earned: true },
    { badge: '⭐ Healthy Eater', earned: true },
    { badge: '🎖️ Exercise Hero', earned: true },
    { badge: '🏆 Checkup Star', earned: false },
  ],
};

export function ChildHealthRecords() {
  const [selectedTab, setSelectedTab] = useState('heroes');
  const totalVaccines = childHealthData.vaccineHeroes.length;
  const completedVaccines = childHealthData.vaccineHeroes.filter(v => v.completed).length;
  const vaccineProgress = (completedVaccines / totalVaccines) * 100;

  return (
    <div className="space-y-6">
      {/* Fun Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 text-white shadow-2xl">
        <div className="absolute top-2 right-8 text-4xl animate-bounce">🏥</div>
        <div className="absolute top-12 right-20 text-3xl animate-pulse">💚</div>
        <div className="absolute bottom-4 right-4 text-5xl animate-bounce" style={{ animationDelay: '0.2s' }}>🩺</div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-4xl border-4 border-white/50 animate-pulse">
              🦸
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
                My Health Adventure! 🌟
              </h2>
              <p className="text-white/90">Your amazing health story!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Vaccine Shield Progress */}
      <Card className="border-0 shadow-xl bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🛡️</div>
              <div>
                <span className="font-bold text-lg">My Vaccine Shield</span>
                <p className="text-sm text-muted-foreground">Protections collected!</p>
              </div>
            </div>
            <span className="text-2xl font-bold text-blue-600">{completedVaccines}/{totalVaccines}</span>
          </div>
          <div className="relative">
            <Progress value={vaccineProgress} className="h-6 rounded-full bg-blue-200" />
            <div 
              className="absolute top-0 h-6 flex items-center justify-end pr-2 transition-all duration-500"
              style={{ width: `${vaccineProgress}%` }}
            >
              <span className="text-xl">⚡</span>
            </div>
          </div>
          <p className="text-center mt-3 font-medium text-blue-600 dark:text-blue-400">
            {completedVaccines === totalVaccines ? '🎉 All shields collected! You\'re protected!' : `✨ ${totalVaccines - completedVaccines} more shield to unlock!`}
          </p>
        </CardContent>
      </Card>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 rounded-2xl h-auto p-1">
          <TabsTrigger value="heroes" className="rounded-xl py-3 gap-1 flex-col text-xs">
            <span className="text-2xl">🛡️</span>
            Vaccines
          </TabsTrigger>
          <TabsTrigger value="body" className="rounded-xl py-3 gap-1 flex-col text-xs">
            <span className="text-2xl">💪</span>
            My Body
          </TabsTrigger>
          <TabsTrigger value="safety" className="rounded-xl py-3 gap-1 flex-col text-xs">
            <span className="text-2xl">⚠️</span>
            Allergies
          </TabsTrigger>
          <TabsTrigger value="visits" className="rounded-xl py-3 gap-1 flex-col text-xs">
            <span className="text-2xl">🏥</span>
            Visits
          </TabsTrigger>
        </TabsList>

        {/* Vaccine Heroes */}
        <TabsContent value="heroes" className="mt-4 space-y-4">
          <div className="grid gap-4">
            {childHealthData.vaccineHeroes.map((vaccine) => (
              <Card 
                key={vaccine.id} 
                className={`border-0 shadow-lg overflow-hidden rounded-3xl transition-all hover:scale-[1.02] ${
                  vaccine.completed ? '' : 'opacity-60'
                }`}
              >
                <CardContent className={`p-0 bg-gradient-to-r ${vaccine.color}`}>
                  <div className="p-5 text-white flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/30 flex items-center justify-center text-4xl">
                      {vaccine.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl">{vaccine.name}</h3>
                      <p className="text-white/80 text-sm">{vaccine.date}</p>
                    </div>
                    {vaccine.completed ? (
                      <div className="text-4xl animate-bounce">✅</div>
                    ) : (
                      <div className="text-4xl animate-pulse">🔒</div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* My Body */}
        <TabsContent value="body" className="mt-4 space-y-4">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">📏</span>
                How I'm Growing!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 text-center">
                  <span className="text-3xl">📏</span>
                  <p className="text-sm text-muted-foreground mt-2">Height</p>
                  <p className="font-bold text-xl">{childHealthData.bodyCheck.height}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-center">
                  <span className="text-3xl">⚖️</span>
                  <p className="text-sm text-muted-foreground mt-2">Weight</p>
                  <p className="font-bold text-xl">{childHealthData.bodyCheck.weight}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30 text-center">
                  <span className="text-3xl">❤️</span>
                  <p className="text-sm text-muted-foreground mt-2">Heart</p>
                  <p className="font-bold text-lg">{childHealthData.bodyCheck.heartbeat}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-center">
                  <span className="text-3xl">😁</span>
                  <p className="text-sm text-muted-foreground mt-2">Smile</p>
                  <p className="font-bold text-lg">{childHealthData.bodyCheck.smile}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-900/30 dark:to-violet-900/30 text-center">
                  <span className="text-3xl">👀</span>
                  <p className="text-sm text-muted-foreground mt-2">Eyes</p>
                  <p className="font-bold text-lg">{childHealthData.bodyCheck.eyes}</p>
                </div>
                <div className="p-4 rounded-2xl bg-gradient-to-br from-teal-100 to-cyan-100 dark:from-teal-900/30 dark:to-cyan-900/30 text-center">
                  <span className="text-3xl">👂</span>
                  <p className="text-sm text-muted-foreground mt-2">Ears</p>
                  <p className="font-bold text-lg">{childHealthData.bodyCheck.ears}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* My Medicines */}
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">💊</span>
                My Helper Medicines
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {childHealthData.medicines.map((med, i) => (
                <div 
                  key={i}
                  className={`p-4 rounded-2xl bg-gradient-to-r ${med.color} text-white flex items-center gap-4`}
                >
                  <span className="text-4xl">{med.emoji}</span>
                  <div>
                    <p className="font-bold text-lg">{med.name}</p>
                    <p className="text-white/80 text-sm">🕐 {med.when}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Allergies */}
        <TabsContent value="safety" className="mt-4 space-y-4">
          <Card className="border-0 shadow-xl bg-gradient-to-br from-red-100 to-orange-100 dark:from-red-900/20 dark:to-orange-900/20 rounded-3xl border-4 border-dashed border-red-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl text-red-600">
                <span className="text-2xl">⚠️</span>
                Things That Make Me Feel Bad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground text-sm">
                These things can make me sick. I need to stay away from them! 🚫
              </p>
              <div className="grid gap-4">
                {childHealthData.allergies.map((allergy, i) => (
                  <div 
                    key={i}
                    className="p-5 rounded-2xl bg-white dark:bg-card shadow-lg flex items-center gap-4"
                  >
                    <div className={`w-16 h-16 rounded-2xl ${allergy.color} flex items-center justify-center text-4xl`}>
                      {allergy.emoji}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-xl">{allergy.item}</p>
                      <p className="text-sm text-red-500 font-medium">🚫 Stay away!</p>
                    </div>
                    <span className="text-4xl">❌</span>
                  </div>
                ))}
              </div>
              <div className="p-4 rounded-2xl bg-yellow-100 dark:bg-yellow-900/30 text-center">
                <p className="text-sm font-medium">
                  💡 Always tell a grown-up if you feel funny after eating or touching something!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Doctor Visits */}
        <TabsContent value="visits" className="mt-4 space-y-4">
          <Card className="border-0 shadow-xl bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">🏥</span>
                My Doctor Adventures!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {childHealthData.doctorVisits.map((visit, i) => (
                <div 
                  key={i}
                  className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 flex items-center gap-4"
                >
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-card shadow flex items-center justify-center text-3xl">
                    {visit.emoji}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg">{visit.reason}</p>
                    <p className="text-sm text-muted-foreground">📅 {visit.date}</p>
                  </div>
                  <Badge className="bg-green-500 text-white text-sm py-1 px-3">
                    {visit.outcome}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Health Achievements */}
          <Card className="border-0 shadow-xl bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <span className="text-2xl">🏆</span>
                My Health Badges!
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {childHealthData.achievements.map((achievement, i) => (
                  <div 
                    key={i}
                    className={`p-4 rounded-2xl text-center transition-all ${
                      achievement.earned 
                        ? 'bg-gradient-to-br from-yellow-400 to-orange-400 text-white shadow-lg hover:scale-105' 
                        : 'bg-muted/50 opacity-60'
                    }`}
                  >
                    <p className="font-bold text-sm">{achievement.badge}</p>
                    {achievement.earned && (
                      <p className="text-xs mt-1 text-white/80">✨ Earned!</p>
                    )}
                    {!achievement.earned && (
                      <p className="text-xs mt-1">🔒 Keep going!</p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Fun Footer */}
      <div className="text-center py-4">
        <p className="text-muted-foreground text-sm flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-500" />
          You're doing great staying healthy!
          <Sparkles className="w-4 h-4 text-yellow-500" />
        </p>
      </div>
    </div>
  );
}
