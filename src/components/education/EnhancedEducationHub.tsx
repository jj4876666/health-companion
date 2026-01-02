import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import { usePoints } from '@/contexts/PointsContext';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  BookOpen, ChevronRight, ChevronDown, AlertTriangle,
  Sparkles, GraduationCap, Heart, Baby, User, Users,
  CheckCircle, Clock, Star, Bookmark, Play, Trophy, Gift,
  Volume2, VolumeX, Bot, Search, Info, Shield, Brain,
  Flower2, Moon, Sun, Zap, MessageCircle, Lightbulb
} from 'lucide-react';
import { 
  getEducationContent, 
  EducationTopic,
} from '@/data/educationContent';
import { EmbeddedAIChat } from '@/components/chat/EmbeddedAIChat';

const EDUCATION_STORAGE_KEY = 'emec_education_progress';

interface EnhancedEducationHubProps {
  ageCategory?: string;
}

// Animated background particles
const FloatingParticle = ({ delay, size, color }: { delay: number; size: number; color: string }) => (
  <div 
    className={`absolute rounded-full opacity-20 animate-float ${color}`}
    style={{
      width: size,
      height: size,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${delay}s`,
      animationDuration: `${3 + Math.random() * 4}s`
    }}
  />
);

export function EnhancedEducationHub({ ageCategory }: EnhancedEducationHubProps) {
  const { language } = useLanguage();
  const { selectedAgeCategory, getAgeTheme } = useDemo();
  const { addPoints } = usePoints();
  const { settings } = useAccessibility();
  const [selectedTopic, setSelectedTopic] = useState<EducationTopic | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const currentAgeCategory = ageCategory || selectedAgeCategory;
  const ageTheme = getAgeTheme();
  const lang = (language || 'en') as 'en' | 'sw' | 'fr';

  const content = getEducationContent(currentAgeCategory, lang);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(EDUCATION_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCompletedSections(parsed.completedSections || []);
        setBookmarkedTopics(parsed.bookmarkedTopics || []);
      }
    } catch (e) {
      console.error('Failed to load education progress:', e);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify({
      completedSections,
      bookmarkedTopics
    }));
  }, [completedSections, bookmarkedTopics]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      const langMap: Record<string, string> = { en: 'en-US', sw: 'sw-KE', fr: 'fr-FR' };
      utterance.lang = langMap[language] || 'en-US';
      utterance.rate = settings.speechRate || 1;
      utterance.pitch = settings.speechPitch || 1;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const markSectionComplete = (sectionId: string) => {
    if (!completedSections.includes(sectionId)) {
      setCompletedSections(prev => [...prev, sectionId]);
      addPoints(10, 'Education Section Complete');
    }
  };

  const toggleBookmark = (topicId: string) => {
    setBookmarkedTopics(prev => 
      prev.includes(topicId)
        ? prev.filter(id => id !== topicId)
        : [...prev, topicId]
    );
  };

  const getAgeIcon = () => {
    if (currentAgeCategory === '0-5' || currentAgeCategory === '6-12' || currentAgeCategory === 'child' || currentAgeCategory === 'infant') {
      return <Baby className="w-5 h-5" />;
    } else if (currentAgeCategory === '13-17' || currentAgeCategory === 'teen') {
      return <User className="w-5 h-5" />;
    }
    return <Users className="w-5 h-5" />;
  };

  const getAgeLabel = () => {
    const labels: Record<string, { en: string; sw: string; fr: string }> = {
      'infant': { en: 'Early Childhood', sw: 'Utoto wa Mapema', fr: 'Petite enfance' },
      'child': { en: 'Children', sw: 'Watoto', fr: 'Enfants' },
      '0-5': { en: 'Early Childhood', sw: 'Utoto wa Mapema', fr: 'Petite enfance' },
      '6-12': { en: 'Children', sw: 'Watoto', fr: 'Enfants' },
      '13-17': { en: 'Teenagers', sw: 'Vijana', fr: 'Adolescents' },
      'teen': { en: 'Teenagers', sw: 'Vijana', fr: 'Adolescents' },
      'adult': { en: 'Adults', sw: 'Watu Wazima', fr: 'Adultes' }
    };
    return labels[currentAgeCategory]?.[lang] || labels['adult'][lang];
  };

  const filteredContent = searchQuery 
    ? content.filter(topic => 
        topic.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description[lang].toLowerCase().includes(searchQuery.toLowerCase())
      )
    : content;

  const categories = [...new Set(filteredContent.map(topic => topic.category))];

  const categoryFiltered = activeTab === 'all' 
    ? filteredContent 
    : filteredContent.filter(t => t.category === activeTab);

  const getTopicProgress = (topic: EducationTopic) => {
    const totalSections = topic.content.length;
    const completed = topic.content.filter(s => completedSections.includes(s.id)).length;
    return totalSections > 0 ? (completed / totalSections) * 100 : 0;
  };

  const totalProgress = content.length > 0 
    ? content.reduce((acc, topic) => acc + getTopicProgress(topic), 0) / content.length 
    : 0;

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, React.ReactNode> = {
      'hygiene': <Sparkles className="w-4 h-4" />,
      'nutrition': <Sun className="w-4 h-4" />,
      'body': <Heart className="w-4 h-4" />,
      'safety': <Shield className="w-4 h-4" />,
      'puberty': <Flower2 className="w-4 h-4" />,
      'menstruation': <Moon className="w-4 h-4" />,
      'mental-health': <Brain className="w-4 h-4" />,
      'diseases': <AlertTriangle className="w-4 h-4" />,
    };
    return icons[category] || <BookOpen className="w-4 h-4" />;
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, { en: string; sw: string; fr: string }> = {
      'hygiene': { en: 'Hygiene', sw: 'Usafi', fr: 'Hygiène' },
      'nutrition': { en: 'Nutrition', sw: 'Lishe', fr: 'Nutrition' },
      'body': { en: 'Body', sw: 'Mwili', fr: 'Corps' },
      'safety': { en: 'Safety', sw: 'Usalama', fr: 'Sécurité' },
      'puberty': { en: 'Puberty', sw: 'Balehe', fr: 'Puberté' },
      'menstruation': { en: 'Menstruation', sw: 'Hedhi', fr: 'Menstruation' },
      'mental-health': { en: 'Mental Health', sw: 'Afya ya Akili', fr: 'Santé mentale' },
      'diseases': { en: 'Diseases', sw: 'Magonjwa', fr: 'Maladies' },
    };
    return labels[category]?.[lang] || category;
  };

  // Topic Detail View
  if (selectedTopic) {
    const progress = getTopicProgress(selectedTopic);
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedTopic(null)}
            className="gap-2 hover:bg-primary/10"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            {lang === 'sw' ? 'Rudi' : lang === 'fr' ? 'Retour' : 'Back'}
          </Button>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAIChat(!showAIChat)}
              className="gap-2 bg-gradient-to-r from-primary/10 to-accent/10 border-primary/30"
            >
              <Bot className="w-4 h-4" />
              {showAIChat ? 'Hide AI' : 'Ask AI'}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isSpeaking ? stopSpeaking() : speak(selectedTopic.description[lang])}
              className={isSpeaking ? 'text-primary animate-pulse' : ''}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBookmark(selectedTopic.id)}
              className={bookmarkedTopics.includes(selectedTopic.id) ? 'text-amber-500' : ''}
            >
              <Bookmark className={`w-5 h-5 ${bookmarkedTopics.includes(selectedTopic.id) ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* AI Chat Panel */}
        {showAIChat && (
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 overflow-hidden animate-in slide-in-from-top-2">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">AI Health Assistant</p>
                  <p className="text-xs text-muted-foreground">Ask me anything about {selectedTopic.title[lang]}</p>
                </div>
              </div>
              <EmbeddedAIChat 
                context={`Age group: ${currentAgeCategory}. Topic: ${selectedTopic.title[lang]} - ${selectedTopic.description[lang]}. Provide age-appropriate explanations.`}
                maxHeight="250px"
                showHeader={false}
              />
            </CardContent>
          </Card>
        )}

        {/* Topic Header - Vibrant Design */}
        <Card className="border-0 shadow-2xl overflow-hidden relative">
          <div className={`relative bg-gradient-to-br ${selectedTopic.color} p-8 min-h-[200px]`}>
            {/* Animated Background */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <FloatingParticle key={i} delay={i * 0.5} size={20 + i * 10} color="bg-white" />
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            
            <div className="relative flex items-center gap-6 flex-wrap">
              <div className="w-24 h-24 rounded-3xl bg-white/25 backdrop-blur-md flex items-center justify-center text-6xl shadow-2xl transform hover:scale-110 transition-transform animate-bounce-slow">
                {selectedTopic.icon}
              </div>
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-3xl md:text-4xl font-black text-white mb-3 drop-shadow-lg">
                  {selectedTopic.title[lang]}
                </h1>
                <p className="text-white/95 text-lg font-medium">{selectedTopic.description[lang]}</p>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <Badge className="bg-white/25 text-white border-white/40 backdrop-blur-sm px-4 py-1">
                    <Clock className="w-3.5 h-3.5 mr-1.5" />
                    {selectedTopic.content.length * 3} min read
                  </Badge>
                  <Badge className="bg-white/25 text-white border-white/40 backdrop-blur-sm px-4 py-1">
                    <BookOpen className="w-3.5 h-3.5 mr-1.5" />
                    {selectedTopic.content.length} sections
                  </Badge>
                  <Badge className="bg-white/25 text-white border-white/40 backdrop-blur-sm px-4 py-1">
                    <Trophy className="w-3.5 h-3.5 mr-1.5" />
                    {Math.round(progress)}% complete
                  </Badge>
                </div>
              </div>
            </div>
            <div className="relative mt-8">
              <Progress value={progress} className="h-3 bg-white/20 rounded-full" />
            </div>
          </div>
        </Card>

        {/* Educational Disclaimer */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 backdrop-blur-sm">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center shrink-0">
              <Info className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-bold text-blue-700 dark:text-blue-400 mb-1">
                {lang === 'sw' ? 'Kumbusho Muhimu' : lang === 'fr' ? 'Rappel Important' : 'Educational Content'}
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {lang === 'sw' 
                  ? 'Programu hii inatoa elimu na uhamasishaji wa afya, si utambuzi wa kimatibabu. Daima tembelea kituo cha afya kwa ushauri wa kimatibabu.'
                  : lang === 'fr'
                  ? 'Cette application fournit une éducation et sensibilisation à la santé, pas un diagnostic médical.'
                  : 'This app provides health education and awareness, not medical diagnosis. Always consult healthcare professionals for medical advice.'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {selectedTopic.content.map((section, index) => {
            const isExpanded = expandedSections.includes(section.id);
            const isCompleted = completedSections.includes(section.id);
            
            return (
              <Card 
                key={section.id} 
                className={`border-0 shadow-lg transition-all duration-300 overflow-hidden hover:shadow-xl ${
                  section.warningSign ? 'ring-2 ring-orange-500/30 bg-orange-50/50 dark:bg-orange-950/20' : ''
                } ${isCompleted ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30' : ''}`}
              >
                <div 
                  className="p-5 cursor-pointer hover:bg-muted/30 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold transition-all shadow-lg ${
                      isCompleted 
                        ? 'bg-gradient-to-br from-green-500 to-emerald-500 text-white' 
                        : 'bg-gradient-to-br from-muted to-muted/50 text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-6 h-6" /> : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-bold text-lg flex items-center gap-2">
                        {section.warningSign && (
                          <AlertTriangle className="w-5 h-5 text-orange-500 animate-pulse" />
                        )}
                        {section.title[lang]}
                      </h3>
                      {!isExpanded && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {section.content[lang].substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="ml-16 pl-4 border-l-4 border-primary/30">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-base">
                        {section.content[lang]}
                      </p>
                      
                      {section.bulletPoints && (
                        <ul className="space-y-3 mt-5">
                          {section.bulletPoints[lang].map((point, idx) => (
                            <li 
                              key={idx}
                              className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 hover:from-primary/10 hover:to-accent/10 transition-all transform hover:translate-x-1"
                            >
                              <span className="text-2xl flex-shrink-0 animate-bounce-slow" style={{ animationDelay: `${idx * 0.1}s` }}>
                                {point.split(' ')[0]}
                              </span>
                              <span className="text-sm font-medium">{point.split(' ').slice(1).join(' ')}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border/50 flex-wrap gap-3">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              isSpeaking ? stopSpeaking() : speak(section.content[lang]);
                            }}
                            className="gap-2 rounded-xl"
                          >
                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            {isSpeaking ? 'Stop' : 'Read Aloud'}
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant={isCompleted ? "secondary" : "default"}
                          onClick={(e) => {
                            e.stopPropagation();
                            markSectionComplete(section.id);
                          }}
                          disabled={isCompleted}
                          className="gap-2 rounded-xl shadow-lg"
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Completed!
                            </>
                          ) : (
                            <>
                              <Zap className="w-4 h-4" />
                              Mark Complete (+10 pts)
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  // Main Hub View - Completely Redesigned
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-accent to-primary p-8 md:p-12 text-white">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.3} size={15 + i * 8} color="bg-white" />
          ))}
        </div>
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-xl">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <Badge className="bg-white/20 text-white border-white/30 mb-1">
                {getAgeIcon()}
                <span className="ml-1.5">{getAgeLabel()}</span>
              </Badge>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight">
                {lang === 'sw' ? 'Kituo cha Elimu ya Afya' : lang === 'fr' ? 'Centre d\'Éducation Santé' : 'Health Education Hub'}
              </h1>
            </div>
          </div>
          
          <p className="text-white/90 text-lg max-w-2xl mb-6">
            {lang === 'sw' 
              ? 'Jifunze kuhusu afya yako kwa njia ya kufurahisha na rahisi kuelewa!'
              : lang === 'fr'
              ? 'Apprends sur ta santé de manière amusante et facile à comprendre!'
              : 'Learn about your health in a fun and easy-to-understand way!'}
          </p>

          {/* Progress Overview */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-5 max-w-md">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-300" />
                {lang === 'sw' ? 'Maendeleo Yako' : lang === 'fr' ? 'Tes Progrès' : 'Your Progress'}
              </span>
              <span className="text-2xl font-black">{Math.round(totalProgress)}%</span>
            </div>
            <Progress value={totalProgress} className="h-3 bg-white/20 rounded-full" />
            <p className="text-sm text-white/80 mt-2">
              {content.length} {lang === 'sw' ? 'mada zinapatikana' : lang === 'fr' ? 'sujets disponibles' : 'topics available'}
            </p>
          </div>
        </div>
      </div>

      {/* AI Assistant Quick Access */}
      <Card className="border-2 border-dashed border-primary/30 bg-gradient-to-r from-primary/5 via-background to-accent/5 hover:border-primary/50 transition-all cursor-pointer group"
        onClick={() => setShowAIChat(!showAIChat)}
      >
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-xl mb-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                {lang === 'sw' ? 'Msaidizi wa AI' : lang === 'fr' ? 'Assistant IA' : 'AI Health Assistant'}
              </h3>
              <p className="text-muted-foreground">
                {lang === 'sw' 
                  ? 'Uliza swali lolote kuhusu afya - nitakusaidia kuelewa!'
                  : lang === 'fr'
                  ? 'Pose n\'importe quelle question sur la santé - je t\'aiderai à comprendre!'
                  : 'Ask any health question - I\'ll help you understand!'}
              </p>
            </div>
            <MessageCircle className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </CardContent>
      </Card>

      {showAIChat && (
        <Card className="border-primary/20 shadow-xl animate-in slide-in-from-top-2">
          <CardContent className="p-6">
            <EmbeddedAIChat context={`Age group: ${currentAgeCategory}. Provide age-appropriate health education explanations.`} />
          </CardContent>
        </Card>
      )}

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder={lang === 'sw' ? 'Tafuta mada...' : lang === 'fr' ? 'Rechercher un sujet...' : 'Search topics...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 h-14 text-lg rounded-2xl border-2 focus:border-primary shadow-lg"
        />
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="w-full h-auto flex-wrap gap-2 bg-transparent p-0 justify-start">
          <TabsTrigger 
            value="all" 
            className="rounded-xl px-6 py-3 data-[state=active]:bg-primary data-[state=active]:text-white shadow-md"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            {lang === 'sw' ? 'Zote' : lang === 'fr' ? 'Tout' : 'All'}
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category}
              value={category}
              className="rounded-xl px-5 py-3 data-[state=active]:bg-primary data-[state=active]:text-white shadow-md"
            >
              {getCategoryIcon(category)}
              <span className="ml-2">{getCategoryLabel(category)}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {/* Topic Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categoryFiltered.map((topic, index) => {
              const progress = getTopicProgress(topic);
              const isBookmarked = bookmarkedTopics.includes(topic.id);
              
              return (
                <Card 
                  key={topic.id}
                  className="group cursor-pointer border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden hover:-translate-y-2"
                  onClick={() => setSelectedTopic(topic)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className={`relative bg-gradient-to-br ${topic.color} p-6 min-h-[160px]`}>
                    <div className="absolute inset-0 overflow-hidden opacity-30">
                      {[...Array(3)].map((_, i) => (
                        <FloatingParticle key={i} delay={i} size={30} color="bg-white" />
                      ))}
                    </div>
                    <div className="absolute top-4 right-4 flex gap-2">
                      {isBookmarked && (
                        <Badge className="bg-yellow-500/90 text-white border-0">
                          <Star className="w-3 h-3 mr-1 fill-current" />
                          Saved
                        </Badge>
                      )}
                      {progress === 100 && (
                        <Badge className="bg-green-500/90 text-white border-0">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Done
                        </Badge>
                      )}
                    </div>
                    <div className="relative">
                      <div className="text-6xl mb-3 transform group-hover:scale-125 transition-transform duration-300">
                        {topic.icon}
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-5">
                    <h3 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                      {topic.title[lang]}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {topic.description[lang]}
                    </p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {topic.content.length} sections
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {topic.content.length * 3} min
                        </span>
                      </div>
                      <div className="relative">
                        <Progress value={progress} className="h-2 rounded-full" />
                        <span className="absolute right-0 -top-5 text-xs font-bold text-primary">
                          {Math.round(progress)}%
                        </span>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4 group-hover:bg-primary group-hover:text-white transition-all rounded-xl"
                    >
                      {lang === 'sw' ? 'Jifunze Zaidi' : lang === 'fr' ? 'En savoir plus' : 'Learn More'}
                      <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {categoryFiltered.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 rounded-full bg-muted/50 flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold mb-2">
                {lang === 'sw' ? 'Hakuna mada zilizopatikana' : lang === 'fr' ? 'Aucun sujet trouvé' : 'No topics found'}
              </h3>
              <p className="text-muted-foreground">
                {lang === 'sw' ? 'Jaribu kutafuta kwa maneno tofauti' : lang === 'fr' ? 'Essaie avec d\'autres mots' : 'Try searching with different words'}
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
