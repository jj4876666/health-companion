import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import { usePoints } from '@/contexts/PointsContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, ChevronRight, ChevronDown, AlertTriangle,
  Sparkles, GraduationCap, Heart, Baby, User, Users,
  CheckCircle, Clock, Star, Bookmark, Play, Trophy, Gift
} from 'lucide-react';
import { 
  getEducationContent, 
  EducationTopic,
} from '@/data/educationContent';

const EDUCATION_STORAGE_KEY = 'emec_education_progress';

interface EducationHubProps {
  ageCategory?: string;
}

export function EducationHub({ ageCategory }: EducationHubProps) {
  const { language } = useLanguage();
  const { selectedAgeCategory, getAgeTheme } = useDemo();
  const { addPoints } = usePoints();
  const [selectedTopic, setSelectedTopic] = useState<EducationTopic | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [completedSections, setCompletedSections] = useState<string[]>([]);
  const [bookmarkedTopics, setBookmarkedTopics] = useState<string[]>([]);

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
      // Award points for completing a section
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
    if (currentAgeCategory === '0-5' || currentAgeCategory === '6-12') {
      return <Baby className="w-5 h-5" />;
    } else if (currentAgeCategory === '13-17') {
      return <User className="w-5 h-5" />;
    }
    return <Users className="w-5 h-5" />;
  };

  const getAgeLabel = () => {
    const labels: Record<string, { en: string; sw: string; fr: string }> = {
      '0-5': { en: 'Early Childhood', sw: 'Utoto wa Mapema', fr: 'Petite enfance' },
      '6-12': { en: 'Children', sw: 'Watoto', fr: 'Enfants' },
      '13-17': { en: 'Teenagers', sw: 'Vijana', fr: 'Adolescents' },
      'adult': { en: 'Adults', sw: 'Watu Wazima', fr: 'Adultes' }
    };
    return labels[currentAgeCategory]?.[lang] || labels['adult'][lang];
  };

  const categories = [...new Set(content.map(topic => topic.category))];

  const getTopicProgress = (topic: EducationTopic) => {
    const totalSections = topic.content.length;
    const completed = topic.content.filter(s => completedSections.includes(s.id)).length;
    return totalSections > 0 ? (completed / totalSections) * 100 : 0;
  };

  if (selectedTopic) {
    const progress = getTopicProgress(selectedTopic);
    
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
        {/* Back Button & Progress */}
        <div className="flex items-center justify-between">
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
            <div className="relative flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-5xl shadow-lg">
                {selectedTopic.icon}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{selectedTopic.title[lang]}</h1>
                <p className="text-white/90 text-lg">{selectedTopic.description[lang]}</p>
                <div className="flex items-center gap-3 mt-4">
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
            {/* Progress Bar */}
            <div className="mt-6">
              <Progress value={progress} className="h-2 bg-white/20" />
            </div>
          </div>
        </Card>

        {/* Content Sections */}
        <div className="space-y-4">
          {selectedTopic.content.map((section, index) => {
            const isExpanded = expandedSections.includes(section.id);
            const isCompleted = completedSections.includes(section.id);
            
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
                    {/* Step Number */}
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
                      
                      {/* Mark Complete Button */}
                      <div className="flex items-center justify-end mt-4 pt-4 border-t border-border/50">
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
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${ageTheme.colors.primary} flex items-center justify-center shadow-lg`}>
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {lang === 'sw' ? 'Elimu ya Afya' : lang === 'fr' ? 'Éducation à la santé' : 'Health Education'}
            </h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="gap-1">
                {getAgeIcon()}
                {getAgeLabel()}
              </Badge>
              <Badge variant="outline" className="bg-primary/5">
                <BookOpen className="w-3 h-3 mr-1" />
                {content.length} {lang === 'sw' ? 'mada' : lang === 'fr' ? 'sujets' : 'topics'}
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
              {content.filter(topic => topic.category === category).map((topic, index) => {
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
                    {/* Progress indicator */}
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
                          <div className="flex items-center gap-2 mt-3">
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
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Empty State */}
      {content.length === 0 && (
        <Card className="border-0 shadow-elegant">
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-6 flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">
              {lang === 'sw' ? 'Hakuna maudhui yanayopatikana' : lang === 'fr' ? 'Aucun contenu disponible' : 'No content available'}
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              {lang === 'sw' 
                ? 'Maudhui ya elimu ya afya kwa umri wako yatakuja hivi karibuni.'
                : lang === 'fr'
                ? 'Le contenu éducatif de santé pour votre âge sera bientôt disponible.'
                : 'Health education content for your age group will be available soon.'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}