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
  Volume2, VolumeX, Bot, Search, Info, Shield
} from 'lucide-react';
import { 
  getEducationContent, 
  EducationTopic,
} from '@/data/educationContent';

const EDUCATION_STORAGE_KEY = 'emec_education_progress';

interface EnhancedEducationHubProps {
  ageCategory?: string;
}

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
  const [showAIExplanation, setShowAIExplanation] = useState<string | null>(null);

  const currentAgeCategory = ageCategory || selectedAgeCategory;
  const ageTheme = getAgeTheme();
  const lang = (language || 'en') as 'en' | 'sw' | 'fr';

  const content = getEducationContent(currentAgeCategory, lang);

  // Load progress from localStorage
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

  // Save progress to localStorage
  useEffect(() => {
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify({
      completedSections,
      bookmarkedTopics
    }));
  }, [completedSections, bookmarkedTopics]);

  // Text-to-speech function
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

  // Filter content based on search
  const filteredContent = searchQuery 
    ? content.filter(topic => 
        topic.title[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
        topic.description[lang].toLowerCase().includes(searchQuery.toLowerCase())
      )
    : content;

  const categories = [...new Set(filteredContent.map(topic => topic.category))];

  const getTopicProgress = (topic: EducationTopic) => {
    const totalSections = topic.content.length;
    const completed = topic.content.filter(s => completedSections.includes(s.id)).length;
    return totalSections > 0 ? (completed / totalSections) * 100 : 0;
  };

  // AI Explanation generator (simple local version)
  const getAIExplanation = (text: string, sectionTitle: string) => {
    const explanations: Record<string, Record<string, string>> = {
      en: {
        default: `Let me explain "${sectionTitle}" in simpler terms:\n\n${text}\n\nThis information is important for your health awareness. Remember, always consult a healthcare professional for medical advice.`
      },
      sw: {
        default: `Wacha nikusaidie kuelewa "${sectionTitle}":\n\n${text}\n\nMaarifa haya ni muhimu kwa ufahamu wako wa afya. Kumbuka, daima shauriana na mtaalamu wa afya kwa ushauri wa kimatibabu.`
      },
      fr: {
        default: `Laisse-moi t'expliquer "${sectionTitle}" plus simplement:\n\n${text}\n\nCette information est importante pour ta sensibilisation à la santé. N'oublie pas de toujours consulter un professionnel de santé pour des conseils médicaux.`
      }
    };
    return explanations[lang]?.default || explanations.en.default;
  };

  if (selectedTopic) {
    const progress = getTopicProgress(selectedTopic);
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Back Button & Progress */}
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Trophy className="w-4 h-4 text-amber-500" />
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => isSpeaking ? stopSpeaking() : speak(selectedTopic.description[lang])}
              className={isSpeaking ? 'text-primary' : ''}
              title={isSpeaking ? 'Stop reading' : 'Read aloud'}
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

        {/* Topic Header */}
        <Card className="border-0 shadow-elegant overflow-hidden">
          <div className={`relative bg-gradient-to-br ${selectedTopic.color} p-8`}>
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center gap-6 flex-wrap">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">
                {selectedTopic.icon}
              </div>
              <div className="flex-1 min-w-[200px]">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedTopic.title[lang]}</h1>
                <p className="text-white/90 text-lg">{selectedTopic.description[lang]}</p>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <Badge className="bg-white/20 text-white border-white/30">
                    <Clock className="w-3 h-3 mr-1" />
                    {selectedTopic.content.length * 3} min read
                  </Badge>
                  <Badge className="bg-white/20 text-white border-white/30">
                    {selectedTopic.content.length} sections
                  </Badge>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          </div>
        </Card>

        {/* Educational Disclaimer */}
        <div className="p-4 rounded-xl bg-info/10 border border-info/30">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-info shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-semibold text-info mb-1">
                {lang === 'sw' ? 'Kumbusho Muhimu' : lang === 'fr' ? 'Rappel Important' : 'Important Reminder'}
              </p>
              <p className="text-muted-foreground text-xs leading-relaxed">
                {lang === 'sw' 
                  ? 'Programu hii inatoa elimu na uhamasishaji wa afya, si utambuzi wa kimatibabu. Daima tembelea kituo cha afya kwa ushauri wa kimatibabu.'
                  : lang === 'fr'
                  ? 'Cette application fournit une éducation et sensibilisation à la santé, pas un diagnostic médical. Consultez toujours un établissement de santé pour des conseils médicaux.'
                  : 'This app provides health education and awareness, not medical diagnosis. Always visit a health facility for medical advice.'}
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-4">
          {selectedTopic.content.map((section, index) => {
            const isExpanded = expandedSections.includes(section.id);
            const isCompleted = completedSections.includes(section.id);
            const isExplaining = showAIExplanation === section.id;
            
            return (
              <Card 
                key={section.id} 
                className={`border-0 shadow-elegant transition-all duration-300 overflow-hidden ${
                  section.warningSign ? 'ring-2 ring-destructive/30' : ''
                } ${isCompleted ? 'bg-success/5' : ''}`}
              >
                <div 
                  className="p-5 cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      isCompleted 
                        ? 'bg-success text-white' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {isCompleted ? <CheckCircle className="w-5 h-5" /> : index + 1}
                    </div>
                    
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg flex items-center gap-2">
                        {section.warningSign && (
                          <AlertTriangle className="w-5 h-5 text-destructive" />
                        )}
                        {section.title[lang]}
                      </h3>
                      {!isExpanded && (
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {section.content[lang].substring(0, 100)}...
                        </p>
                      )}
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full bg-muted flex items-center justify-center transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
                
                {isExpanded && (
                  <div className="px-5 pb-5 pt-0 space-y-4 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="ml-14 pl-4 border-l-2 border-primary/20">
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                        {section.content[lang]}
                      </p>
                      
                      {section.bulletPoints && (
                        <ul className="space-y-2 mt-4">
                          {section.bulletPoints[lang].map((point, idx) => (
                            <li 
                              key={idx}
                              className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-colors"
                            >
                              <span className="text-xl flex-shrink-0">{point.split(' ')[0]}</span>
                              <span className="text-sm">{point.split(' ').slice(1).join(' ')}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* AI Explanation */}
                      {isExplaining && (
                        <div className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 animate-in fade-in">
                          <div className="flex items-center gap-2 mb-2">
                            <Bot className="w-5 h-5 text-primary" />
                            <span className="font-semibold text-primary">AI Explanation</span>
                          </div>
                          <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {getAIExplanation(section.content[lang], section.title[lang])}
                          </p>
                        </div>
                      )}
                      
                      {/* Action Buttons */}
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border/50 flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              isSpeaking ? stopSpeaking() : speak(section.content[lang]);
                            }}
                            className="gap-2"
                          >
                            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                            {isSpeaking ? 'Stop' : 'Read Aloud'}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowAIExplanation(isExplaining ? null : section.id);
                            }}
                            className="gap-2"
                          >
                            <Bot className="w-4 h-4" />
                            {isExplaining ? 'Hide AI' : 'AI Explain'}
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
                          className="gap-2"
                        >
                          {isCompleted ? (
                            <>
                              <CheckCircle className="w-4 h-4" />
                              Completed
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4" />
                              Mark Complete
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ageTheme.colors.primary} flex items-center justify-center shadow-lg`}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {lang === 'sw' ? 'Elimu ya Afya' : lang === 'fr' ? 'Éducation à la santé' : 'Health Education'}
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <Badge variant="secondary" className="gap-1">
                {getAgeIcon()}
                {getAgeLabel()}
              </Badge>
              <Badge variant="outline" className="bg-primary/5">
                <BookOpen className="w-3 h-3 mr-1" />
                {filteredContent.length} {lang === 'sw' ? 'mada' : lang === 'fr' ? 'sujets' : 'topics'}
              </Badge>
            </div>
          </div>
        </div>
        
        {/* Stats Card */}
        <Card className="hidden md:block border-0 shadow-elegant bg-gradient-to-br from-amber-500/10 to-orange-500/10">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
              <Star className="w-6 h-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Learning Progress</p>
              <p className="text-xl font-bold text-amber-600">{completedSections.length} sections</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Educational Disclaimer Banner */}
      <div className="p-4 rounded-xl bg-primary/5 border border-primary/20">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-primary mb-1">
              {lang === 'sw' ? 'Elimu ya Afya - Sio Utambuzi' : lang === 'fr' ? 'Éducation Santé - Pas un Diagnostic' : 'Health Education - Not Diagnosis'}
            </p>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {lang === 'sw' 
                ? 'Programu hii inatoa elimu na uhamasishaji wa afya pekee. Haibadilishi ushauri wa kimatibabu kutoka kwa mtaalamu. Daima tembelea kituo cha afya kwa matatizo ya kiafya.'
                : lang === 'fr'
                ? 'Cette application fournit uniquement une éducation et sensibilisation à la santé. Elle ne remplace pas les conseils médicaux professionnels. Consultez toujours un établissement de santé pour les problèmes de santé.'
                : 'This app provides health education and awareness only. It does not replace professional medical advice. Always visit a health facility for health concerns.'}
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          placeholder={lang === 'sw' ? 'Tafuta mada...' : lang === 'fr' ? 'Rechercher des sujets...' : 'Search topics...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <ScrollArea className="w-full pb-2">
          <TabsList className="w-full justify-start bg-muted/50 p-1">
            {categories.map(category => (
              <TabsTrigger 
                key={category} 
                value={category} 
                className="capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {category.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid gap-4 md:grid-cols-2">
              {filteredContent.filter(topic => topic.category === category).map((topic, index) => {
                const progress = getTopicProgress(topic);
                const isBookmarked = bookmarkedTopics.includes(topic.id);
                
                return (
                  <Card 
                    key={topic.id}
                    className="group border-0 shadow-elegant cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => {
                      setSelectedTopic(topic);
                      setExpandedSections([topic.content[0]?.id]);
                    }}
                  >
                    {progress > 0 && (
                      <div className="h-1 bg-muted">
                        <div 
                          className="h-full bg-success transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-4xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          {topic.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                              {topic.title[lang]}
                            </h3>
                            {isBookmarked && (
                              <Bookmark className="w-4 h-4 text-amber-500 fill-amber-500 flex-shrink-0" />
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                            {topic.description[lang]}
                          </p>
                          <div className="flex items-center gap-2 mt-3 flex-wrap">
                            <Badge variant="outline" className="text-xs bg-background">
                              <Clock className="w-3 h-3 mr-1" />
                              {topic.content.length * 3} min
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-background">
                              {topic.content.length} {lang === 'sw' ? 'sehemu' : lang === 'fr' ? 'sections' : 'sections'}
                            </Badge>
                            {topic.gender && topic.gender !== 'all' && (
                              <Badge variant="secondary" className="text-xs capitalize">
                                {topic.gender === 'male' 
                                  ? (lang === 'sw' ? 'Wavulana' : lang === 'fr' ? 'Garçons' : 'Boys')
                                  : (lang === 'sw' ? 'Wasichana' : lang === 'fr' ? 'Filles' : 'Girls')
                                }
                              </Badge>
                            )}
                          </div>
                          {progress > 0 && (
                            <div className="flex items-center gap-2 mt-3">
                              <CheckCircle className="w-4 h-4 text-success" />
                              <span className="text-xs text-success font-medium">{Math.round(progress)}% complete</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Floating AI Helper Hint */}
      <div className="fixed bottom-24 right-6 z-40">
        <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 shadow-lg animate-bounce-soft max-w-[200px]">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary" />
            <p className="text-xs text-primary font-medium">
              {lang === 'sw' ? 'Uliza AI msaada!' : lang === 'fr' ? 'Demandez l\'aide de l\'IA!' : 'Ask AI for help!'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
