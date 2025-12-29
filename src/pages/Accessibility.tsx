import { PageLayout } from '@/components/layout/PageLayout';
import { useAccessibility } from '@/contexts/AccessibilityContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Eye, Type, Zap, Volume2, Layout, RotateCcw,
  Accessibility, Monitor, Hand, Ear, Brain, Heart
} from 'lucide-react';

export default function AccessibilityPage() {
  const { settings, updateSetting, resetSettings } = useAccessibility();
  const { t } = useLanguage();

  const accessibilityOptions = [
    {
      key: 'largeText' as const,
      icon: Type,
      title: {
        en: 'Large Text',
        sw: 'Maandishi Makubwa',
        fr: 'Grand texte'
      },
      description: {
        en: 'Increase font size by 25% for better readability',
        sw: 'Ongeza ukubwa wa fonti kwa 25% kwa kusoma bora',
        fr: 'Augmenter la taille de la police de 25% pour une meilleure lisibilité'
      },
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      key: 'highContrast' as const,
      icon: Monitor,
      title: {
        en: 'High Contrast',
        sw: 'Tofauti Kubwa',
        fr: 'Contraste élevé'
      },
      description: {
        en: 'Enhanced color contrast for better visibility',
        sw: 'Tofauti ya rangi iliyoboreshwa kwa kuonekana bora',
        fr: 'Contraste des couleurs amélioré pour une meilleure visibilité'
      },
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      key: 'reducedMotion' as const,
      icon: Zap,
      title: {
        en: 'Reduced Motion',
        sw: 'Mwendo Uliopunguzwa',
        fr: 'Mouvement réduit'
      },
      description: {
        en: 'Minimize animations and transitions',
        sw: 'Punguza uhuishaji na mabadiliko',
        fr: 'Minimiser les animations et les transitions'
      },
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    },
    {
      key: 'voiceGuidance' as const,
      icon: Volume2,
      title: {
        en: 'Voice Guidance',
        sw: 'Mwongozo wa Sauti',
        fr: 'Guidage vocal'
      },
      description: {
        en: 'Audio feedback for key actions and navigation',
        sw: 'Maoni ya sauti kwa vitendo muhimu na urambazaji',
        fr: 'Retour audio pour les actions clés et la navigation'
      },
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      key: 'simpleNavigation' as const,
      icon: Layout,
      title: {
        en: 'Simple Navigation',
        sw: 'Urambazaji Rahisi',
        fr: 'Navigation simple'
      },
      description: {
        en: 'Simplified menus with larger buttons',
        sw: 'Menyu zilizorahisishwa na vitufe vikubwa',
        fr: 'Menus simplifiés avec des boutons plus grands'
      },
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10'
    },
    {
      key: 'screenReaderOptimized' as const,
      icon: Ear,
      title: {
        en: 'Screen Reader Optimized',
        sw: 'Iliyoboreshwa kwa Kisomaji cha Skrini',
        fr: 'Optimisé pour lecteur d\'écran'
      },
      description: {
        en: 'Enhanced ARIA labels and live announcements',
        sw: 'Lebo za ARIA zilizoimarishwa na matangazo ya moja kwa moja',
        fr: 'Étiquettes ARIA améliorées et annonces en direct'
      },
      color: 'text-pink-500',
      bgColor: 'bg-pink-500/10'
    }
  ];

  const getLocalizedText = (obj: { en: string; sw: string; fr: string }) => {
    const lang = localStorage.getItem('emec-language') || 'en';
    return obj[lang as keyof typeof obj] || obj.en;
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center mx-auto mb-4">
            <Accessibility className="w-10 h-10 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {getLocalizedText({
              en: 'Accessibility Settings',
              sw: 'Mipangilio ya Ufikiaji',
              fr: 'Paramètres d\'accessibilité'
            })}
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            {getLocalizedText({
              en: 'Customize your experience to match your needs. EMEC is designed to be accessible for everyone.',
              sw: 'Binafsisha uzoefu wako kulingana na mahitaji yako. EMEC imeundwa kuwa inapatikana kwa kila mtu.',
              fr: 'Personnalisez votre expérience selon vos besoins. EMEC est conçu pour être accessible à tous.'
            })}
          </p>
        </div>

        {/* Settings Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          {accessibilityOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Card 
                key={option.key} 
                className={`border-0 shadow-elegant transition-all ${
                  settings[option.key] ? 'ring-2 ring-primary' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl ${option.bgColor} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${option.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="font-semibold">{getLocalizedText(option.title)}</h3>
                        <Switch
                          checked={settings[option.key]}
                          onCheckedChange={(checked) => updateSetting(option.key, checked)}
                          aria-label={getLocalizedText(option.title)}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {getLocalizedText(option.description)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Reset Button */}
        <div className="text-center mb-8">
          <Button 
            variant="outline" 
            onClick={resetSettings}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {getLocalizedText({
              en: 'Reset to Default',
              sw: 'Rudisha kwa Chaguomsingi',
              fr: 'Réinitialiser par défaut'
            })}
          </Button>
        </div>

        {/* Disability Resources */}
        <Card className="border-0 shadow-elegant overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-purple-500/10 to-indigo-500/10">
            <CardTitle className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-primary" />
              {getLocalizedText({
                en: 'Resources for Differently-Abled Users',
                sw: 'Rasilimali kwa Watumiaji Wenye Ulemavu Tofauti',
                fr: 'Ressources pour utilisateurs handicapés'
              })}
            </CardTitle>
            <CardDescription>
              {getLocalizedText({
                en: 'Additional support and information',
                sw: 'Msaada na habari za ziada',
                fr: 'Soutien et informations supplémentaires'
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="p-4 rounded-xl bg-muted/50">
                <Eye className="w-8 h-8 text-blue-500 mb-2" />
                <h4 className="font-semibold mb-1">
                  {getLocalizedText({
                    en: 'Visual Impairment',
                    sw: 'Ulemavu wa Kuona',
                    fr: 'Déficience visuelle'
                  })}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getLocalizedText({
                    en: 'Screen reader support, high contrast mode, and large text options',
                    sw: 'Msaada wa kisomaji cha skrini, hali ya tofauti kubwa, na chaguzi za maandishi makubwa',
                    fr: 'Support lecteur d\'écran, mode contraste élevé et options de grand texte'
                  })}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <Ear className="w-8 h-8 text-green-500 mb-2" />
                <h4 className="font-semibold mb-1">
                  {getLocalizedText({
                    en: 'Hearing Impairment',
                    sw: 'Ulemavu wa Kusikia',
                    fr: 'Déficience auditive'
                  })}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getLocalizedText({
                    en: 'Visual notifications and text-based communication',
                    sw: 'Arifa za kuona na mawasiliano ya maandishi',
                    fr: 'Notifications visuelles et communication textuelle'
                  })}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-muted/50">
                <Hand className="w-8 h-8 text-orange-500 mb-2" />
                <h4 className="font-semibold mb-1">
                  {getLocalizedText({
                    en: 'Motor Impairment',
                    sw: 'Ulemavu wa Mwendo',
                    fr: 'Déficience motrice'
                  })}
                </h4>
                <p className="text-sm text-muted-foreground">
                  {getLocalizedText({
                    en: 'Keyboard navigation, large touch targets, and voice commands',
                    sw: 'Urambazaji wa kibodi, malengo makubwa ya kugusa, na amri za sauti',
                    fr: 'Navigation au clavier, grandes cibles tactiles et commandes vocales'
                  })}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border-2 border-dashed border-primary/30 text-center">
              <Brain className="w-8 h-8 text-primary mx-auto mb-2" />
              <p className="text-sm">
                {getLocalizedText({
                  en: 'EMEC is committed to making healthcare accessible to everyone. If you need additional accommodations, please contact our support team.',
                  sw: 'EMEC imejitolea kufanya huduma za afya zipatikane kwa kila mtu. Ikiwa unahitaji makao ya ziada, tafadhali wasiliana na timu yetu ya msaada.',
                  fr: 'EMEC s\'engage à rendre les soins de santé accessibles à tous. Si vous avez besoin d\'aménagements supplémentaires, veuillez contacter notre équipe d\'assistance.'
                })}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Settings Summary */}
        <Card className="border-0 shadow-elegant mt-8">
          <CardHeader>
            <CardTitle className="text-lg">
              {getLocalizedText({
                en: 'Active Settings',
                sw: 'Mipangilio Inayotumika',
                fr: 'Paramètres actifs'
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(settings).filter(([_, value]) => value).length === 0 ? (
                <Badge variant="outline">
                  {getLocalizedText({
                    en: 'Using default settings',
                    sw: 'Inatumia mipangilio ya chaguomsingi',
                    fr: 'Utilisation des paramètres par défaut'
                  })}
                </Badge>
              ) : (
                Object.entries(settings)
                  .filter(([_, value]) => value)
                  .map(([key]) => {
                    const option = accessibilityOptions.find(o => o.key === key);
                    return option ? (
                      <Badge key={key} className="gap-1 bg-primary/10 text-primary border-primary/20">
                        <option.icon className="w-3 h-3" />
                        {getLocalizedText(option.title)}
                      </Badge>
                    ) : null;
                  })
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
