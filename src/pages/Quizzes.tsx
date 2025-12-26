import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { demoQuizzes, getQuizById } from '@/data/demoQuizzes';
import { Quiz, QuizQuestion } from '@/types/emec';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Gamepad2, Star, Trophy, Lock, CheckCircle, XCircle, 
  ArrowRight, ArrowLeft, Sparkles, Brain, Heart, Shield, Apple
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { ChildUser } from '@/types/emec';
import { demoChild } from '@/data/demoUsers';

const categoryIcons: Record<string, typeof Brain> = {
  health: Heart,
  nutrition: Apple,
  safety: Shield,
  hygiene: Sparkles,
};

export default function Quizzes() {
  const { currentUser, isAuthenticated, updateChildPoints } = useAuth();
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const child = (currentUser as ChildUser) || demoChild;
  const userAge = child.age || 9;

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
  };

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
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
      // Quiz complete
      setShowResult(true);
      const pointsEarned = Math.round((score + (isCorrect ? 1 : 0)) / activeQuiz.questions.length * activeQuiz.points);
      updateChildPoints(pointsEarned);
      toast({
        title: "Quiz Complete! 🎉",
        description: `You earned ${pointsEarned} points!`,
      });
    }
  };

  const exitQuiz = () => {
    setActiveQuiz(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
    setAnswers([]);
  };

  // Quiz in progress
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
          {/* Progress */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <Button variant="ghost" size="sm" onClick={exitQuiz}>
                <ArrowLeft className="w-4 h-4 mr-1" /> Exit
              </Button>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {activeQuiz.questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
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
            <h1 className="text-2xl md:text-3xl font-bold">Health Quizzes</h1>
            <p className="text-muted-foreground">Learn while you play!</p>
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Available Quizzes</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {availableQuizzes.map((quiz) => {
              const Icon = categoryIcons[quiz.category] || Brain;
              return (
                <Card key={quiz.id} className="border-0 shadow-elegant hover:shadow-lg transition-all">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        quiz.category === 'hygiene' ? 'bg-blue-500' :
                        quiz.category === 'nutrition' ? 'bg-green-500' :
                        quiz.category === 'safety' ? 'bg-orange-500' :
                        'bg-pink-500'
                      }`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {language === 'sw' ? quiz.titleSw : quiz.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === 'sw' ? quiz.descriptionSw : quiz.description}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className="text-xs">
                            {quiz.questions.length} questions
                          </Badge>
                          <Badge className="text-xs bg-warning/20 text-warning-foreground border-0">
                            <Star className="w-3 h-3 mr-1" />
                            {quiz.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button
                      onClick={() => startQuiz(quiz)}
                      className="w-full mt-4"
                      variant="outline"
                    >
                      Start Quiz
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Restricted Quizzes */}
        {restrictedQuizzes.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lock className="w-5 h-5 text-muted-foreground" />
              Restricted Content
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
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
                        <h3 className="font-semibold">
                          {language === 'sw' ? quiz.titleSw : quiz.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {language === 'sw' ? quiz.descriptionSw : quiz.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
