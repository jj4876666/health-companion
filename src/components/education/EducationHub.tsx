import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useDemo } from '@/contexts/DemoContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  BookOpen, ChevronRight, ChevronDown, AlertTriangle,
  Sparkles, GraduationCap, Heart, Baby, User, Users
} from 'lucide-react';
import { 
  getEducationContent, 
  getTopicById,
  EducationTopic,
  EducationSection,
  childrenEducation,
  teenEducation,
  adultEducation,
  disabilityEducation
} from '@/data/educationContent';

interface EducationHubProps {
  ageCategory?: string;
}

export function EducationHub({ ageCategory }: EducationHubProps) {
  const { language } = useLanguage();
  const { selectedAgeCategory, getAgeTheme } = useDemo();
  const [selectedTopic, setSelectedTopic] = useState<EducationTopic | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const currentAgeCategory = ageCategory || selectedAgeCategory;
  const ageTheme = getAgeTheme();
  const lang = (language || 'en') as 'en' | 'sw' | 'fr';

  const content = getEducationContent(currentAgeCategory, lang);

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
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

  if (selectedTopic) {
    return (
      <div className="space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => setSelectedTopic(null)}
          className="gap-2"
        >
          <ChevronRight className="w-4 h-4 rotate-180" />
          {lang === 'sw' ? 'Rudi' : lang === 'fr' ? 'Retour' : 'Back'}
        </Button>

        {/* Topic Header */}
        <Card className="border-0 shadow-elegant overflow-hidden">
          <div className={`bg-gradient-to-br ${selectedTopic.color} p-6 text-primary-foreground`}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedTopic.icon}</span>
              <div>
                <h1 className="text-2xl font-bold">{selectedTopic.title[lang]}</h1>
                <p className="opacity-90">{selectedTopic.description[lang]}</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Sections */}
        <div className="space-y-4">
          {selectedTopic.content.map((section) => {
            const isExpanded = expandedSections.includes(section.id);
            
            return (
              <Card 
                key={section.id} 
                className={`border-0 shadow-elegant transition-all ${
                  section.warningSign ? 'border-l-4 border-l-destructive' : ''
                }`}
              >
                <CardHeader 
                  className="cursor-pointer hover:bg-muted/50 transition-colors"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {section.warningSign && (
                        <AlertTriangle className="w-5 h-5 text-destructive" />
                      )}
                      {section.title[lang]}
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                
                {isExpanded && (
                  <CardContent className="pt-0 space-y-4">
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content[lang]}
                    </p>
                    
                    {section.bulletPoints && (
                      <ul className="space-y-2">
                        {section.bulletPoints[lang].map((point, idx) => (
                          <li 
                            key={idx}
                            className="flex items-start gap-2 p-2 rounded-lg bg-muted/50"
                          >
                            <span className="text-lg">{point.split(' ')[0]}</span>
                            <span>{point.split(' ').slice(1).join(' ')}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${ageTheme.colors.primary} flex items-center justify-center`}>
          <GraduationCap className="w-7 h-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            {lang === 'sw' ? 'Elimu ya Afya' : lang === 'fr' ? 'Éducation à la santé' : 'Health Education'}
          </h1>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              {getAgeIcon()}
              {getAgeLabel()}
            </Badge>
            <Badge variant="outline">
              {content.length} {lang === 'sw' ? 'mada' : lang === 'fr' ? 'sujets' : 'topics'}
            </Badge>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs defaultValue={categories[0]} className="w-full">
        <ScrollArea className="w-full">
          <TabsList className="w-full justify-start">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="capitalize">
                {category.replace('-', ' ')}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        {categories.map(category => (
          <TabsContent key={category} value={category} className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {content.filter(topic => topic.category === category).map(topic => (
                <Card 
                  key={topic.id}
                  className="border-0 shadow-elegant cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
                  onClick={() => {
                    setSelectedTopic(topic);
                    setExpandedSections([topic.content[0]?.id]);
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${topic.color} flex items-center justify-center text-3xl flex-shrink-0`}>
                        {topic.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">{topic.title[lang]}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {topic.description[lang]}
                        </p>
                        <div className="flex items-center gap-2 mt-3">
                          <Badge variant="outline" className="text-xs">
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
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Empty State */}
      {content.length === 0 && (
        <Card className="border-0 shadow-elegant">
          <CardContent className="p-12 text-center">
            <Sparkles className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {lang === 'sw' ? 'Hakuna maudhui yanayopatikana' : lang === 'fr' ? 'Aucun contenu disponible' : 'No content available'}
            </h3>
            <p className="text-muted-foreground">
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
