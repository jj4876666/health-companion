import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePremium } from '@/contexts/PremiumContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HelpCircle, Search, MessageCircle, Phone, Mail, BookOpen, 
  Shield, Heart, Pill, Gamepad2, Crown, Baby, User, Users,
  Volume2, Eye, Accessibility, Globe, ChevronRight, Sparkles
} from 'lucide-react';
import { Navigate } from 'react-router-dom';

// Age-appropriate help content
const helpTopics = {
  child: [
    { 
      icon: '🎮', 
      title: 'How to Play Games', 
      description: 'Learn how to play health games and earn points!',
      content: 'Click on the Games button to play fun health games. Complete games to earn points and badges! 🏆'
    },
    { 
      icon: '📚', 
      title: 'Learning Health', 
      description: 'Fun facts about staying healthy!',
      content: 'Go to Education to learn about eating healthy, exercise, and taking care of your body! 🥦💪'
    },
    { 
      icon: '🆘', 
      title: 'Need Help?', 
      description: 'What to do when you need a grown-up',
      content: 'If you feel sick or need help, always tell a parent or teacher. They can help you! 🤗'
    },
    { 
      icon: '⭐', 
      title: 'Earning Points', 
      description: 'How to get more stars and badges',
      content: 'Complete daily tasks, play games, and do quizzes to earn points. More points = more rewards! 🌟'
    },
  ],
  teen: [
    { 
      icon: '💊', 
      title: 'Medication Reminders', 
      description: 'Set up reminders for your medicines',
      content: 'Go to Medications to set reminders. The app will notify you when it\'s time to take your medicine.'
    },
    { 
      icon: '📱', 
      title: 'Using the AI Assistant', 
      description: 'Get health answers from our AI',
      content: 'Click the chat bubble to ask health questions. The AI gives age-appropriate answers and can even speak to you!'
    },
    { 
      icon: '🔒', 
      title: 'Privacy & Safety', 
      description: 'How we protect your information',
      content: 'Your health data is encrypted and only shared with your consent. Parents can see your records for safety.'
    },
    { 
      icon: '🏃', 
      title: 'Health Goals', 
      description: 'Track your fitness and wellness',
      content: 'Set daily targets for water, exercise, and sleep. Complete them to earn achievements!'
    },
  ],
  adult: [
    { 
      icon: '👶', 
      title: 'Managing Child Accounts', 
      description: 'How to manage your children\'s profiles',
      content: 'Go to Dashboard and switch to your child\'s account. You can approve record updates, view their health data, and control what content they can access.'
    },
    { 
      icon: '📋', 
      title: 'Health Records', 
      description: 'Access lifetime health records',
      content: 'View your complete medical history in the Records tab. You can export, share with doctors, and track all visits, vaccinations, and treatments.'
    },
    { 
      icon: '👨‍⚕️', 
      title: 'Consent System', 
      description: 'How medical consent codes work',
      content: 'Health officers need your approval to update records. You\'ll receive a 5-minute consent code that must be shared for any changes.'
    },
    { 
      icon: '💳', 
      title: 'Premium Features', 
      description: 'Get more with Premium',
      content: 'Premium unlocks AI consultations, drug delivery, record exports, and priority support. Your subscription helps local charities too!'
    },
    { 
      icon: '📲', 
      title: 'Pharmacy Orders', 
      description: 'Order medicines for delivery',
      content: 'Premium users can order medications. Upload your prescription, select medicines, and get them delivered to your location.'
    },
    { 
      icon: '🔐', 
      title: 'Data Security', 
      description: 'How we protect your data',
      content: 'All data is encrypted with 256-bit SSL. We follow HIPAA guidelines. Only you and consented parties can access your records.'
    },
  ],
};

const faqItems = [
  { 
    question: 'How do I create a child account?', 
    answer: 'Go to Settings → Family → Add Child. Enter their details and they\'ll get their own EMEC ID linked to your account.',
    category: 'account'
  },
  { 
    question: 'What is the consent code system?', 
    answer: 'When a health officer needs to update your records, you\'ll receive a 5-digit code via the app. Share this code with the officer to approve the update. Codes expire in 5 minutes for security.',
    category: 'security'
  },
  { 
    question: 'How do I upgrade to Premium?', 
    answer: 'Go to Donations → Premium tab. Choose monthly (KES 299) or yearly (KES 2,499). Your subscription helps support children\'s charities!',
    category: 'premium'
  },
  { 
    question: 'Can I use the app offline?', 
    answer: 'Yes! Basic features work offline. Education content, games, and your cached records are available. Data syncs when you\'re back online.',
    category: 'features'
  },
  { 
    question: 'How do I export my health records?', 
    answer: 'Premium users can go to Records → Export PDF. You can also share records directly with healthcare providers using secure links.',
    category: 'premium'
  },
  { 
    question: 'Is my health data safe?', 
    answer: 'Absolutely! We use end-to-end encryption, follow HIPAA guidelines, and never share your data without explicit consent.',
    category: 'security'
  },
];

export default function HelpCenter() {
  const { currentUser, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { isPremium } = usePremium();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('topics');

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Determine user's age category
  const userType = currentUser?.role === 'child' 
    ? 'child' 
    : currentUser?.role === 'parent' 
      ? 'adult' 
      : 'adult';

  const isChildUser = userType === 'child';
  const topics = helpTopics[userType] || helpTopics.adult;

  const filteredFaqs = faqItems.filter(faq => 
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className={`p-4 md:p-6 space-y-6 ${isChildUser ? 'bg-gradient-to-b from-purple-100 via-pink-50 to-blue-100 dark:from-purple-900/20 dark:via-pink-900/10 dark:to-blue-900/20 min-h-screen' : ''}`}>
        {/* Header */}
        <div className={`relative overflow-hidden rounded-3xl p-6 ${
          isChildUser 
            ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400' 
            : 'gradient-emec'
        } text-white shadow-xl`}>
          {isChildUser && (
            <>
              <div className="absolute top-2 right-8 text-4xl animate-bounce">❓</div>
              <div className="absolute bottom-4 right-4 text-5xl animate-pulse">💡</div>
            </>
          )}
          
          <div className="relative z-10 flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl ${isChildUser ? 'bg-white/30' : 'bg-white/20'} flex items-center justify-center`}>
              {isChildUser ? (
                <span className="text-4xl">🆘</span>
              ) : (
                <HelpCircle className="w-7 h-7" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">
                {isChildUser ? 'Need Help? 🤔' : 'Help Center'}
              </h1>
              <p className="text-white/80">
                {isChildUser ? 'Find answers to your questions!' : 'Find answers and get support'}
              </p>
            </div>
          </div>
        </div>

        {/* Search */}
        <Card className={`border-0 shadow-elegant ${isChildUser ? 'rounded-3xl' : ''}`}>
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder={isChildUser ? "🔍 What do you need help with?" : "Search for help..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${isChildUser ? 'h-12 text-lg rounded-2xl' : ''}`}
              />
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className={`grid w-full grid-cols-3 ${isChildUser ? 'rounded-2xl h-auto p-1' : ''}`}>
            <TabsTrigger value="topics" className={isChildUser ? 'rounded-xl py-3 gap-1' : ''}>
              {isChildUser ? <span className="text-xl mr-1">📚</span> : <BookOpen className="w-4 h-4 mr-2" />}
              Topics
            </TabsTrigger>
            <TabsTrigger value="faq" className={isChildUser ? 'rounded-xl py-3 gap-1' : ''}>
              {isChildUser ? <span className="text-xl mr-1">❓</span> : <HelpCircle className="w-4 h-4 mr-2" />}
              FAQ
            </TabsTrigger>
            <TabsTrigger value="contact" className={isChildUser ? 'rounded-xl py-3 gap-1' : ''}>
              {isChildUser ? <span className="text-xl mr-1">📞</span> : <MessageCircle className="w-4 h-4 mr-2" />}
              Contact
            </TabsTrigger>
          </TabsList>

          {/* Topics */}
          <TabsContent value="topics" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {topics.map((topic, i) => (
                <Card 
                  key={i} 
                  className={`cursor-pointer hover:shadow-lg transition-all ${
                    isChildUser 
                      ? 'border-0 rounded-3xl hover:scale-[1.02]' 
                      : ''
                  }`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${
                        isChildUser 
                          ? 'bg-gradient-to-br from-purple-400 to-pink-400' 
                          : 'bg-primary/10'
                      } flex items-center justify-center`}>
                        <span className="text-2xl">{topic.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{topic.title}</h3>
                        <p className="text-sm text-muted-foreground mb-2">{topic.description}</p>
                        <p className="text-sm">{topic.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Accessibility Help */}
            <Card className={`${isChildUser ? 'rounded-3xl border-0' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="w-5 h-5" />
                  {isChildUser ? '🎨 Make It Easier to Use!' : 'Accessibility Features'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                  <div className={`p-4 rounded-xl ${isChildUser ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-muted/50'} flex items-center gap-3`}>
                    <Volume2 className="w-6 h-6 text-blue-600" />
                    <div>
                      <p className="font-medium">{isChildUser ? 'Listen Instead!' : 'Text-to-Speech'}</p>
                      <p className="text-sm text-muted-foreground">The app can read to you</p>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isChildUser ? 'bg-green-100 dark:bg-green-900/30' : 'bg-muted/50'} flex items-center gap-3`}>
                    <Eye className="w-6 h-6 text-green-600" />
                    <div>
                      <p className="font-medium">{isChildUser ? 'Bigger Text!' : 'Font Scaling'}</p>
                      <p className="text-sm text-muted-foreground">Make text larger or smaller</p>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isChildUser ? 'bg-purple-100 dark:bg-purple-900/30' : 'bg-muted/50'} flex items-center gap-3`}>
                    <Globe className="w-6 h-6 text-purple-600" />
                    <div>
                      <p className="font-medium">{isChildUser ? 'Different Languages!' : 'Multi-Language'}</p>
                      <p className="text-sm text-muted-foreground">English, Swahili, and more</p>
                    </div>
                  </div>
                  <div className={`p-4 rounded-xl ${isChildUser ? 'bg-orange-100 dark:bg-orange-900/30' : 'bg-muted/50'} flex items-center gap-3`}>
                    <MessageCircle className="w-6 h-6 text-orange-600" />
                    <div>
                      <p className="font-medium">{isChildUser ? 'Talk to AI!' : 'Voice Input'}</p>
                      <p className="text-sm text-muted-foreground">Speak instead of typing</p>
                    </div>
                  </div>
                </div>
                <Button 
                  onClick={() => navigate('/accessibility')} 
                  className={`w-full ${isChildUser ? 'h-12 text-lg rounded-2xl' : ''}`}
                >
                  {isChildUser ? '⚙️ Change Settings' : 'Go to Accessibility Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ */}
          <TabsContent value="faq" className="mt-4">
            <Card className={`border-0 shadow-elegant ${isChildUser ? 'rounded-3xl' : ''}`}>
              <CardHeader>
                <CardTitle>{isChildUser ? '❓ Common Questions' : 'Frequently Asked Questions'}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  {filteredFaqs.map((faq, i) => (
                    <AccordionItem 
                      key={i} 
                      value={`faq-${i}`}
                      className={`border rounded-xl px-4 ${isChildUser ? 'rounded-2xl' : ''}`}
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <span className={isChildUser ? 'text-left text-base' : ''}>
                          {faq.question}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact */}
          <TabsContent value="contact" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card className={`${isChildUser ? 'rounded-3xl border-0' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isChildUser 
                      ? 'bg-gradient-to-br from-green-400 to-emerald-400' 
                      : 'bg-green-100 dark:bg-green-900/30'
                  }`}>
                    {isChildUser ? (
                      <span className="text-4xl">📞</span>
                    ) : (
                      <Phone className="w-8 h-8 text-green-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {isChildUser ? 'Call for Help' : 'Phone Support'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isChildUser ? 'Ask a grown-up to call' : 'Talk to our support team'}
                  </p>
                  <Button variant="outline" className="w-full">
                    +254 700 EMEC-HELP
                  </Button>
                </CardContent>
              </Card>

              <Card className={`${isChildUser ? 'rounded-3xl border-0' : ''}`}>
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${
                    isChildUser 
                      ? 'bg-gradient-to-br from-blue-400 to-cyan-400' 
                      : 'bg-blue-100 dark:bg-blue-900/30'
                  }`}>
                    {isChildUser ? (
                      <span className="text-4xl">✉️</span>
                    ) : (
                      <Mail className="w-8 h-8 text-blue-600" />
                    )}
                  </div>
                  <h3 className="font-semibold text-lg mb-2">
                    {isChildUser ? 'Send a Message' : 'Email Support'}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {isChildUser ? 'We\'ll reply soon!' : 'Get help via email'}
                  </p>
                  <Button variant="outline" className="w-full">
                    help@emec.co.ke
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* AI Assistant Promo */}
            <Card className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white ${isChildUser ? 'rounded-3xl border-0' : ''}`}>
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                    <span className="text-4xl">🤖</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-xl mb-1">
                      {isChildUser ? 'Talk to Our AI Friend!' : 'AI Health Assistant'}
                    </h3>
                    <p className="text-white/80">
                      {isChildUser 
                        ? 'Click the chat bubble to ask questions anytime!' 
                        : 'Get instant answers to health questions 24/7'}
                    </p>
                  </div>
                  <Sparkles className="w-8 h-8 animate-pulse" />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
