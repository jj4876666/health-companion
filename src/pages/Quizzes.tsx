import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePoints } from '@/contexts/PointsContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { demoQuizzes, getDailyQuiz, getEndlessQuestions, getQuizzesByDifficulty } from '@/data/demoQuizzes';
import { Quiz, QuizQuestion, ChildUser } from '@/types/emec';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gamepad2, Star, Trophy, Lock, CheckCircle, XCircle, 
  ArrowRight, ArrowLeft, Sparkles, Brain, Heart, Shield, Apple,
  Calendar, Infinity, Zap, Target, Clock, Award
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { demoChild } from '@/data/demoUsers';

const categoryIcons: Record<string, typeof Brain> = {
  health: Heart,
  nutrition: Apple,
  safety: Shield,
  hygiene: Sparkles,
};

const difficultyColors = {
  easy: 'bg-success text-success-foreground',
  medium: 'bg-warning text-warning-foreground',
  hard: 'bg-destructive text-destructive-foreground',
};

const difficultyPoints = {
  easy: 50,
  medium: 75,
  hard: 100,
};

export default function Quizzes() {
  const { currentUser, isAuthenticated } = useAuth();
  const { language, t } = useLanguage();
  const { toast } = useToast();
  const { addPoints } = usePoints();
  
  const [activeTab, setActiveTab] = useState('daily');
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [dailyCompleted, setDailyCompleted] = useState(false);
  
  // Endless mode state
  const [isEndlessMode, setIsEndlessMode] = useState(false);
  const [endlessQuestions, setEndlessQuestions] = useState<any[]>([]);
  const [endlessScore, setEndlessScore] = useState(0);
  const [endlessStreak, setEndlessStreak] = useState(0);
  const [showAnswerFeedback, setShowAnswerFeedback] = useState(false);
  const [wasCorrect, setWasCorrect] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const child = (currentUser as ChildUser) || demoChild;
  const userAge = child.age || 9;
  const dailyQuiz = getDailyQuiz();

  const availableQuizzes = demoQuizzes.filter(
    (quiz) => !quiz.isAgeRestricted || (quiz.minAge && userAge >= quiz.minAge)
  );

  const restrictedQuizzes = demoQuizzes.filter(
    (quiz) => quiz.isAgeRestricted && quiz.minAge && userAge < quiz.minAge
  );

  const startQuiz = (quiz: Quiz) => {
    setActiveQuiz(quiz);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setIsEndlessMode(false);
  };

  const startEndlessMode = () => {
    setIsEndlessMode(true);
    setEndlessQuestions(getEndlessQuestions(20));
    setCurrentQuestionIndex(0);
    setEndlessScore(0);
    setEndlessStreak(0);
    setSelectedAnswer(null);
    setShowAnswerFeedback(false);
  };

  const handleAnswer = (answerIndex: number) => {
    if (showAnswerFeedback) return;
    setSelectedAnswer(answerIndex);
  };

  const handleEndlessAnswer = async () => {
    if (selectedAnswer === null) return;
    
    const question = endlessQuestions[currentQuestionIndex];
    const isCorrect = selectedAnswer === question.correctIndex;
    
    setWasCorrect(isCorrect);
    setShowAnswerFeedback(true);
    
    if (isCorrect) {
      setEndlessScore(prev => prev + 10 + endlessStreak * 2);
      setEndlessStreak(prev => prev + 1);
    } else {
      setEndlessStreak(0);
    }

    // Wait for feedback animation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setShowAnswerFeedback(false);
    setSelectedAnswer(null);
    
    if (currentQuestionIndex < endlessQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Add more questions
      setEndlessQuestions(prev => [...prev, ...getEndlessQuestions(10)]);
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (selectedAnswer === null || !activeQuiz) return;

    const isCorrect = selectedAnswer === activeQuiz.questions[currentQuestionIndex].correctIndex;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
    setAnswers([...answers, selectedAnswer]);

    if (currentQuestionIndex < activeQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
      const finalScore = score + (isCorrect ? 1 : 0);
      const pointsEarned = Math.round(finalScore / activeQuiz.questions.length * activeQuiz.points);
      // Use points context instead
      
      // Add points to the global Points system for premium unlocks
      addPoints(pointsEarned, `Quiz completed: ${activeQuiz.title}`);
      
      if (activeQuiz.id === dailyQuiz.id) {
        setDailyCompleted(true);
      }
      
      toast({
        title: "Quiz Complete! 🎉",
        description: `You earned ${pointsEarned} points toward premium features!`,
      });
    }
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
    setIsEndlessMode(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
    setEndlessScore(0);
    setEndlessStreak(0);
  };

  // Endless Mode UI
  if (isEndlessMode) {
    const question = endlessQuestions[currentQuestionIndex];
    
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button variant="ghost" size="sm" onClick={exitQuiz}>
              <ArrowLeft className="w-4 h-4 mr-1" /> Exit
            </Button>
            <div className="flex items-center gap-4">
              <Badge className="bg-purple-500 text-white">
                <Infinity className="w-3 h-3 mr-1" />
                Endless
              </Badge>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-warning" />
                <span className="font-bold">{endlessStreak}</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-warning" />
                <span className="font-bold">{endlessScore}</span>
              </div>
            </div>
          </div>

          <Card className={`border-0 shadow-elegant transition-all ${
            showAnswerFeedback 
              ? wasCorrect 
                ? 'ring-4 ring-success' 
                : 'ring-4 ring-destructive'
              : ''
          }`}>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-xs capitalize">
                  {question?.category}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Q{currentQuestionIndex + 1}
                </Badge>
              </div>
              <CardTitle className="text-xl">
                {language === 'sw' ? question?.questionSw : question?.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(language === 'sw' ? question?.optionsSw : question?.options)?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  disabled={showAnswerFeedback}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    showAnswerFeedback
                      ? index === question.correctIndex
                        ? 'border-success bg-success/10'
                        : selectedAnswer === index
                          ? 'border-destructive bg-destructive/10'
                          : 'border-border bg-card opacity-50'
                      : selectedAnswer === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      showAnswerFeedback
                        ? index === question.correctIndex
                          ? 'bg-success text-success-foreground'
                          : selectedAnswer === index
                            ? 'bg-destructive text-destructive-foreground'
                            : 'bg-muted'
                        : selectedAnswer === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                    }`}>
                      {showAnswerFeedback && index === question.correctIndex ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : showAnswerFeedback && selectedAnswer === index && index !== question.correctIndex ? (
                        <XCircle className="w-4 h-4" />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}

              {showAnswerFeedback ? (
                <div className={`p-4 rounded-xl ${wasCorrect ? 'bg-success/10' : 'bg-destructive/10'}`}>
                  <p className={`font-semibold ${wasCorrect ? 'text-success' : 'text-destructive'}`}>
                    {wasCorrect ? '✓ Correct!' : '✗ Incorrect'}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {language === 'sw' ? question?.explanationSw : question?.explanation}
                  </p>
                </div>
              ) : (
                <Button
                  onClick={handleEndlessAnswer}
                  disabled={selectedAnswer === null}
                  className="w-full mt-4"
                  size="lg"
                >
                  Submit Answer
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Regular Quiz in progress
  if (activeQuiz) {
    const question = activeQuiz.questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / activeQuiz.questions.length) * 100;

    if (showResult) {
      const pointsEarned = Math.round(score / activeQuiz.questions.length * activeQuiz.points);
      
      return (
        <DashboardLayout>
          <div className="p-4 md:p-6 max-w-2xl mx-auto">
            <Card className="border-0 shadow-elegant overflow-hidden">
              <div className="gradient-child p-8 text-white text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4" />
                <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
                <p className="text-white/80">
                  {language === 'sw' ? activeQuiz.titleSw : activeQuiz.title}
                </p>
              </div>
              <CardContent className="p-6 space-y-6">
                <div className="text-center">
                  <div className="text-5xl font-bold text-primary mb-2">
                    {score}/{activeQuiz.questions.length}
                  </div>
                  <p className="text-muted-foreground">Correct Answers</p>
                </div>

                <div className="flex items-center justify-center gap-4">
                  <div className="text-center p-4 rounded-xl bg-warning/10">
                    <Star className="w-8 h-8 text-warning mx-auto mb-1" />
                    <p className="font-bold text-lg">{pointsEarned}</p>
                    <p className="text-xs text-muted-foreground">Points Earned</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-success/10">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-1" />
                    <p className="font-bold text-lg">{Math.round(score / activeQuiz.questions.length * 100)}%</p>
                    <p className="text-xs text-muted-foreground">Score</p>
                  </div>
                  <div className="text-center p-4 rounded-xl bg-primary/10">
                    <Award className="w-8 h-8 text-primary mx-auto mb-1" />
                    <p className="font-bold text-lg capitalize">{activeQuiz.difficulty}</p>
                    <p className="text-xs text-muted-foreground">Difficulty</p>
                  </div>
                </div>

                <Button onClick={exitQuiz} className="w-full" size="lg">
                  Back to Quizzes
                </Button>
              </CardContent>
            </Card>
          </div>
        </DashboardLayout>
      );
    }

    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 max-w-2xl mx-auto">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="sm" onClick={exitQuiz}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Exit
              </Button>
              <div className="flex items-center gap-2">
                <Badge className={difficultyColors[activeQuiz.difficulty]}>
                  {t(`quiz.${activeQuiz.difficulty}`)}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
                </span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="border-0 shadow-elegant">
            <CardHeader>
              <CardTitle className="text-xl">
                {language === 'sw' ? question.questionSw : question.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(language === 'sw' ? question.optionsSw : question.options).map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    selectedAnswer === index
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 bg-card'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      selectedAnswer === index
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}

              <Button
                onClick={nextQuestion}
                disabled={selectedAnswer === null}
                className="w-full mt-4"
                size="lg"
              >
                {currentQuestionIndex < activeQuiz.questions.length - 1 ? (
                  <>Next <ArrowRight className="w-4 h-4 ml-1" /></>
                ) : (
                  <>Finish Quiz <CheckCircle className="w-4 h-4 ml-1" /></>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Quiz list
  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center">
            <Gamepad2 className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t('nav.quizzes')}</h1>
            <p className="text-muted-foreground">Learn while you play!</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 h-auto">
            <TabsTrigger value="daily" className="flex flex-col gap-1 py-3">
              <Calendar className="w-4 h-4" />
              <span className="text-xs">Daily</span>
            </TabsTrigger>
            <TabsTrigger value="easy" className="flex flex-col gap-1 py-3">
              <Target className="w-4 h-4" />
              <span className="text-xs">{t('quiz.easy')}</span>
            </TabsTrigger>
            <TabsTrigger value="medium" className="flex flex-col gap-1 py-3">
              <Zap className="w-4 h-4" />
              <span className="text-xs">{t('quiz.intermediate')}</span>
            </TabsTrigger>
            <TabsTrigger value="endless" className="flex flex-col gap-1 py-3">
              <Infinity className="w-4 h-4" />
              <span className="text-xs">{t('quiz.endless')}</span>
            </TabsTrigger>
          </TabsList>

          {/* Daily Quiz */}
          <TabsContent value="daily" className="space-y-4">
            <Card className="border-0 shadow-elegant overflow-hidden">
              <div className="gradient-emec p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Calendar className="w-8 h-8" />
                  <div>
                    <h3 className="text-xl font-bold">Daily Challenge</h3>
                    <p className="text-white/80 text-sm">New quiz every day!</p>
                  </div>
                </div>
                <h4 className="text-lg font-semibold">
                  {language === 'sw' ? dailyQuiz.titleSw : dailyQuiz.title}
                </h4>
                <p className="text-white/80 text-sm mt-1">
                  {language === 'sw' ? dailyQuiz.descriptionSw : dailyQuiz.description}
                </p>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Badge className={difficultyColors[dailyQuiz.difficulty]}>
                      {dailyQuiz.difficulty}
                    </Badge>
                    <Badge variant="secondary">
                      {dailyQuiz.questions.length} questions
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold">{dailyQuiz.points} pts</span>
                  </div>
                </div>
                {dailyCompleted ? (
                  <div className="text-center p-4 bg-success/10 rounded-xl">
                    <CheckCircle className="w-8 h-8 text-success mx-auto mb-2" />
                    <p className="font-semibold text-success">Completed Today!</p>
                    <p className="text-sm text-muted-foreground">Come back tomorrow for a new quiz</p>
                  </div>
                ) : (
                  <Button onClick={() => startQuiz(dailyQuiz)} className="w-full" size="lg">
                    Start Daily Quiz
                  </Button>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Easy Quizzes */}
          <TabsContent value="easy" className="space-y-4">
            {getQuizzesByDifficulty('easy').filter(q => !q.isAgeRestricted || (q.minAge && userAge >= q.minAge)).map((quiz) => {
              const Icon = categoryIcons[quiz.category] || Brain;
              return (
                <Card key={quiz.id} className="border-0 shadow-elegant">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-success flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{language === 'sw' ? quiz.titleSw : quiz.title}</h3>
                        <p className="text-sm text-muted-foreground">{language === 'sw' ? quiz.descriptionSw : quiz.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">{quiz.questions.length} Q</Badge>
                          <Badge className="text-xs bg-warning/20 text-warning-foreground border-0">
                            <Star className="w-3 h-3 mr-1" />{quiz.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button onClick={() => startQuiz(quiz)} className="w-full mt-4" variant="outline">
                      {t('quiz.start')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Medium/Hard Quizzes */}
          <TabsContent value="medium" className="space-y-4">
            {[...getQuizzesByDifficulty('medium'), ...getQuizzesByDifficulty('hard')]
              .filter(q => !q.isAgeRestricted || (q.minAge && userAge >= q.minAge))
              .map((quiz) => {
                const Icon = categoryIcons[quiz.category] || Brain;
                return (
                  <Card key={quiz.id} className="border-0 shadow-elegant">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl ${quiz.difficulty === 'hard' ? 'bg-destructive' : 'bg-warning'} flex items-center justify-center`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold">{language === 'sw' ? quiz.titleSw : quiz.title}</h3>
                          <p className="text-sm text-muted-foreground">{language === 'sw' ? quiz.descriptionSw : quiz.description}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge className={difficultyColors[quiz.difficulty]}>{quiz.difficulty}</Badge>
                            <Badge variant="secondary" className="text-xs">{quiz.questions.length} Q</Badge>
                            <Badge className="text-xs bg-warning/20 text-warning-foreground border-0">
                              <Star className="w-3 h-3 mr-1" />{quiz.points} pts
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <Button onClick={() => startQuiz(quiz)} className="w-full mt-4" variant="outline">
                        {t('quiz.start')}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            
            {/* Restricted quizzes */}
            {restrictedQuizzes.map((quiz) => (
              <Card key={quiz.id} className="border-0 shadow-elegant opacity-60">
                <CardContent className="p-4 relative">
                  <div className="absolute inset-0 bg-muted/50 backdrop-blur-[2px] rounded-lg flex items-center justify-center">
                    <div className="text-center p-4">
                      <Lock className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">Parent approval required</p>
                      <p className="text-xs text-muted-foreground">Age {quiz.minAge}+</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                      <Heart className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{language === 'sw' ? quiz.titleSw : quiz.title}</h3>
                      <p className="text-sm text-muted-foreground">{language === 'sw' ? quiz.descriptionSw : quiz.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Endless Mode */}
          <TabsContent value="endless" className="space-y-4">
            <Card className="border-0 shadow-elegant overflow-hidden">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <Infinity className="w-10 h-10" />
                  <div>
                    <h3 className="text-2xl font-bold">{t('quiz.endless')}</h3>
                    <p className="text-white/80">No points, just learning!</p>
                  </div>
                </div>
                <p className="text-white/90">
                  Answer unlimited questions to practice. Build streaks for bonus satisfaction! 
                  No time limit, no pressure.
                </p>
              </div>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 rounded-xl bg-muted">
                    <Zap className="w-6 h-6 mx-auto text-warning mb-1" />
                    <p className="text-xs text-muted-foreground">Build Streaks</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted">
                    <Clock className="w-6 h-6 mx-auto text-primary mb-1" />
                    <p className="text-xs text-muted-foreground">No Time Limit</p>
                  </div>
                  <div className="p-3 rounded-xl bg-muted">
                    <Brain className="w-6 h-6 mx-auto text-purple-500 mb-1" />
                    <p className="text-xs text-muted-foreground">All Categories</p>
                  </div>
                </div>
                <Button onClick={startEndlessMode} className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600" size="lg">
                  <Infinity className="w-5 h-5 mr-2" />
                  Start Endless Mode
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  No points earned in endless mode – just for practice!
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}