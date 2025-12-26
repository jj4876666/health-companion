import { useState } from 'react';
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ConsentModal } from "@/components/common/ConsentModal";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { 
  Droplets, 
  Apple, 
  Dumbbell, 
  Moon, 
  Hand, 
  Heart,
  Brain,
  Sun,
  Lock,
  Unlock,
  Search,
  AlertTriangle,
  ExternalLink,
  BookOpen,
  Baby,
  Shield,
  Pill,
  Utensils
} from "lucide-react";

const healthTips = [
  {
    icon: Hand,
    title: "Hand Hygiene",
    titleSw: "Usafi wa Mikono",
    description: "Wash your hands regularly with soap and water for at least 20 seconds to prevent the spread of germs and infections.",
    descriptionSw: "Nawa mikono yako mara kwa mara na sabuni na maji kwa sekunde 20 au zaidi kuzuia kuenea kwa vijidudu.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Apple,
    title: "Balanced Diet",
    titleSw: "Chakula Bora",
    description: "Eat a variety of fruits, vegetables, whole grains, and lean proteins. Limit processed foods and added sugars.",
    descriptionSw: "Kula matunda, mboga, nafaka nzima, na protini. Epuka vyakula vilivyosindikwa na sukari nyingi.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Dumbbell,
    title: "Regular Exercise",
    titleSw: "Mazoezi ya Mwili",
    description: "Aim for at least 30 minutes of moderate physical activity daily. This improves cardiovascular health and mood.",
    descriptionSw: "Fanya mazoezi ya mwili kwa dakika 30 kila siku. Hii inaboresha afya ya moyo na hali ya akili.",
    color: "from-orange-500 to-red-500",
  },
  {
    icon: Droplets,
    title: "Stay Hydrated",
    titleSw: "Kunywa Maji",
    description: "Drink at least 8 glasses of clean water daily. Proper hydration supports all bodily functions.",
    descriptionSw: "Kunywa angalau glasi 8 za maji safi kila siku. Maji yanasaidia kazi zote za mwili.",
    color: "from-cyan-500 to-blue-500",
  },
  {
    icon: Moon,
    title: "Quality Sleep",
    titleSw: "Usingizi Bora",
    description: "Get 7-9 hours of sleep each night. Good sleep is essential for physical recovery and mental health.",
    descriptionSw: "Pata usingizi wa masaa 7-9 kila usiku. Usingizi mzuri ni muhimu kwa afya ya mwili na akili.",
    color: "from-indigo-500 to-purple-500",
  },
  {
    icon: Heart,
    title: "Heart Health",
    titleSw: "Afya ya Moyo",
    description: "Monitor your blood pressure and cholesterol. Regular check-ups help prevent cardiovascular diseases.",
    descriptionSw: "Fuatilia shinikizo la damu na cholesterol. Uchunguzi wa mara kwa mara unasaidia kuzuia magonjwa ya moyo.",
    color: "from-red-500 to-pink-500",
  },
  {
    icon: Brain,
    title: "Mental Wellness",
    titleSw: "Afya ya Akili",
    description: "Practice stress management techniques like meditation, deep breathing, or mindfulness exercises.",
    descriptionSw: "Fanya mazoezi ya kupunguza msongo wa mawazo kama kutafakari na kupumua kwa kina.",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Sun,
    title: "Vitamin D",
    titleSw: "Vitamini D",
    description: "Get safe sun exposure for vitamin D production. It supports bone health and immune function.",
    descriptionSw: "Pata jua salama kwa uzalishaji wa vitamini D. Inasaidia afya ya mifupa na kinga ya mwili.",
    color: "from-yellow-500 to-orange-500",
  },
];

// Age-restricted content (for 13+)
const restrictedTopics = [
  {
    id: 'puberty',
    icon: Baby,
    title: "Puberty & Development",
    titleSw: "Balehe na Maendeleo",
    description: "Understanding the physical and emotional changes during adolescence",
    content: `
**Puberty** is a natural stage of development when a child's body matures into an adult body capable of reproduction.

### Physical Changes
- Growth spurts and height increase
- Voice changes (especially in boys)
- Development of body hair
- Skin changes (acne may occur)

### Emotional Changes
- Mood swings are normal
- Increased interest in relationships
- Need for more independence
- Developing personal identity

### Important Tips
1. These changes are completely normal
2. Everyone develops at their own pace
3. Talk to a trusted adult if you have questions
4. Maintain good hygiene habits
5. Eat healthy and exercise regularly

*For more information, consult with a healthcare provider or school counselor.*
    `,
    ageRestricted: true,
  },
  {
    id: 'menstruation',
    icon: Heart,
    title: "Menstruation Education",
    titleSw: "Elimu ya Hedhi",
    description: "Information about the menstrual cycle and health",
    content: `
**Menstruation** (period) is a normal biological process that typically begins between ages 9-16.

### What to Expect
- Occurs approximately every 28 days (can vary 21-35 days)
- Lasts 3-7 days typically
- May include mild cramping
- Flow varies from light to heavy

### Hygiene Tips
1. Change pads/tampons every 4-6 hours
2. Maintain regular bathing
3. Track your cycle for health awareness
4. Stay active - exercise can help with cramps

### When to Seek Help
- Extremely painful periods
- Very heavy bleeding
- Irregular cycles after age 16
- Periods lasting more than 7 days

*Always consult a healthcare provider with concerns.*
    `,
    ageRestricted: true,
  },
  {
    id: 'secondary',
    icon: Shield,
    title: "Secondary Characteristics",
    titleSw: "Sifa za Sekondari",
    description: "Understanding secondary sexual characteristics",
    content: `
**Secondary sexual characteristics** are features that appear during puberty but are not directly part of the reproductive system.

### In Males
- Facial hair growth
- Deeper voice
- Broader shoulders
- Increased muscle mass
- Adam's apple development

### In Females
- Breast development
- Wider hips
- Body shape changes
- Changes in body fat distribution

### Important Notes
- Development timing varies greatly
- All bodies are unique and normal
- Focus on overall health, not comparison
- Seek medical advice for concerns

*This is educational content for health awareness.*
    `,
    ageRestricted: true,
  },
];

// Disease information database
const diseases = [
  {
    name: "Malaria",
    symptoms: "Fever, chills, headache, muscle pain, fatigue, nausea",
    prevention: "Use mosquito nets, repellents, eliminate standing water, take preventive medication",
    link: "https://www.who.int/health-topics/malaria",
  },
  {
    name: "Typhoid",
    symptoms: "High fever, weakness, stomach pain, headache, loss of appetite",
    prevention: "Drink clean water, wash hands, avoid raw foods, get vaccinated",
    link: "https://www.who.int/immunization/diseases/typhoid",
  },
  {
    name: "Cholera",
    symptoms: "Severe watery diarrhea, vomiting, leg cramps, dehydration",
    prevention: "Safe drinking water, proper sanitation, handwashing, oral rehydration",
    link: "https://www.who.int/health-topics/cholera",
  },
  {
    name: "Diarrhea",
    symptoms: "Loose/watery stools, cramping, nausea, bloating",
    prevention: "Clean water, handwashing, food safety, oral rehydration solution",
    link: "https://www.who.int/health-topics/diarrhoea",
  },
  {
    name: "Common Cold",
    symptoms: "Runny nose, sneezing, sore throat, cough, mild fever",
    prevention: "Handwashing, avoid touching face, stay away from sick people, rest well",
    link: "https://www.cdc.gov/common-cold",
  },
];

// Allergy database
const allergyData = [
  { name: "Penicillin", type: "Medication", symptoms: "Rash, hives, swelling, difficulty breathing", severity: "high" },
  { name: "Peanuts", type: "Food", symptoms: "Hives, swelling, anaphylaxis, stomach pain", severity: "high" },
  { name: "Milk", type: "Food", symptoms: "Stomach upset, hives, wheezing", severity: "medium" },
  { name: "Eggs", type: "Food", symptoms: "Skin reactions, digestive issues, respiratory problems", severity: "medium" },
  { name: "Dust Mites", type: "Environmental", symptoms: "Sneezing, runny nose, itchy eyes", severity: "low" },
  { name: "Aspirin", type: "Medication", symptoms: "Hives, facial swelling, asthma symptoms", severity: "medium" },
  { name: "Shellfish", type: "Food", symptoms: "Hives, swelling, digestive issues, anaphylaxis", severity: "high" },
  { name: "Bee Stings", type: "Environmental", symptoms: "Swelling, pain, anaphylaxis in severe cases", severity: "high" },
];

const Education = () => {
  const [activeTab, setActiveTab] = useState('tips');
  const [searchQuery, setSearchQuery] = useState('');
  const [allergySearch, setAllergySearch] = useState('');
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<typeof restrictedTopics[0] | null>(null);
  const [unlockedTopics, setUnlockedTopics] = useState<string[]>([]);
  
  const { currentUser } = useAuth();
  const { language, t } = useLanguage();

  const isChild = currentUser?.role === 'child';
  const childAge = isChild ? (currentUser as any).age || 9 : 18;

  const handleTopicClick = (topic: typeof restrictedTopics[0]) => {
    if (topic.ageRestricted && childAge < 13 && !unlockedTopics.includes(topic.id)) {
      setSelectedTopic(topic);
      setShowConsentModal(true);
    } else {
      setSelectedTopic(topic);
    }
  };

  const handleConsentSuccess = () => {
    if (selectedTopic) {
      setUnlockedTopics(prev => [...prev, selectedTopic.id]);
    }
  };

  const filteredDiseases = diseases.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.symptoms.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAllergies = allergyData.filter(a =>
    a.name.toLowerCase().includes(allergySearch.toLowerCase()) ||
    a.type.toLowerCase().includes(allergySearch.toLowerCase())
  );

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8 animate-fade-in">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full gradient-primary flex items-center justify-center">
            <BookOpen className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {language === 'sw' ? 'Elimu ya Afya' : 'Health Education'}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {language === 'sw' 
              ? 'Vidokezo muhimu vya afya na mazoezi kwa maisha bora'
              : 'Essential health tips and practices for a healthier lifestyle'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full max-w-3xl mx-auto">
            <TabsTrigger value="tips">Health Tips</TabsTrigger>
            <TabsTrigger value="topics">Topics</TabsTrigger>
            <TabsTrigger value="diseases">Diseases</TabsTrigger>
            <TabsTrigger value="allergies">Allergies</TabsTrigger>
            <TabsTrigger value="meals">Meal Plans</TabsTrigger>
          </TabsList>

          {/* Health Tips Tab */}
          <TabsContent value="tips" className="animate-fade-in">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {healthTips.map((tip, index) => {
                const Icon = tip.icon;
                return (
                  <Card 
                    key={tip.title} 
                    className="hover:shadow-lg transition-all duration-300 animate-fade-in overflow-hidden"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardHeader className="pb-2">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tip.color} flex items-center justify-center mb-3`}>
                        <Icon className="w-6 h-6 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-lg">
                        {language === 'sw' ? tip.titleSw : tip.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {language === 'sw' ? tip.descriptionSw : tip.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Quick Facts */}
            <div className="mt-12 animate-fade-in">
              <Card className="overflow-hidden">
                <div className="gradient-primary p-8 text-primary-foreground">
                  <h2 className="text-2xl font-bold mb-2">
                    {language === 'sw' ? 'Je, Ulijua?' : 'Did You Know?'}
                  </h2>
                  <p className="opacity-90">
                    {language === 'sw' 
                      ? 'Mazoezi ya mwili mara kwa mara yanaweza kupunguza hatari ya magonjwa sugu hadi 50%'
                      : 'Regular physical activity can reduce the risk of chronic diseases by up to 50%'}
                  </p>
                </div>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-3 gap-8">
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">8+</div>
                      <p className="text-muted-foreground">
                        {language === 'sw' ? 'Glasi za maji kila siku' : 'Glasses of water daily'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">30</div>
                      <p className="text-muted-foreground">
                        {language === 'sw' ? 'Dakika za mazoezi' : 'Minutes of exercise'}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-primary mb-2">7-9</div>
                      <p className="text-muted-foreground">
                        {language === 'sw' ? 'Masaa ya usingizi' : 'Hours of sleep'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Age-Restricted Topics Tab */}
          <TabsContent value="topics" className="animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {restrictedTopics.map((topic) => {
                const Icon = topic.icon;
                const isLocked = topic.ageRestricted && childAge < 13 && !unlockedTopics.includes(topic.id);
                const isUnlocked = unlockedTopics.includes(topic.id);

                return (
                  <Card 
                    key={topic.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      isLocked ? 'opacity-75 border-warning/30' : 'hover:shadow-lg'
                    }`}
                    onClick={() => handleTopicClick(topic)}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          isLocked ? 'bg-warning/20' : 'bg-primary/10'
                        }`}>
                          <Icon className={`w-6 h-6 ${isLocked ? 'text-warning' : 'text-primary'}`} />
                        </div>
                        {isLocked ? (
                          <Badge variant="outline" className="border-warning text-warning">
                            <Lock className="w-3 h-3 mr-1" />
                            13+
                          </Badge>
                        ) : isUnlocked ? (
                          <Badge className="bg-green-500">
                            <Unlock className="w-3 h-3 mr-1" />
                            Unlocked
                          </Badge>
                        ) : null}
                      </div>
                      <CardTitle className="text-lg mt-4">
                        {language === 'sw' ? topic.titleSw : topic.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {topic.description}
                      </p>
                      {isLocked && (
                        <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
                          <p className="text-xs text-warning-foreground flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            Parent approval required
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Selected Topic Content */}
            {selectedTopic && (unlockedTopics.includes(selectedTopic.id) || childAge >= 13 || !selectedTopic.ageRestricted) && (
              <Card className="mt-8 animate-fade-in">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <selectedTopic.icon className="w-6 h-6 text-primary" />
                    {language === 'sw' ? selectedTopic.titleSw : selectedTopic.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <div className="whitespace-pre-line text-muted-foreground">
                      {selectedTopic.content}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Disease Search Tab */}
          <TabsContent value="diseases" className="animate-fade-in space-y-6">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search diseases, symptoms..."
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {filteredDiseases.map((disease) => (
                <Card key={disease.name} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <AlertTriangle className="w-5 h-5 text-warning" />
                      {disease.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">Symptoms:</p>
                      <p className="text-sm text-muted-foreground">{disease.symptoms}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Prevention:</p>
                      <p className="text-sm text-muted-foreground">{disease.prevention}</p>
                    </div>
                    <a 
                      href={disease.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline italic"
                    >
                      Learn more from WHO
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredDiseases.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No diseases found matching "{searchQuery}"
              </div>
            )}
          </TabsContent>

          {/* Allergy Checker Tab */}
          <TabsContent value="allergies" className="animate-fade-in space-y-6">
            <div className="max-w-md mx-auto">
              <div className="relative">
                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  value={allergySearch}
                  onChange={(e) => setAllergySearch(e.target.value)}
                  placeholder="Search allergies (foods, medications...)"
                  className="pl-10"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {filteredAllergies.map((allergy) => (
                <Card key={allergy.name} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-foreground">{allergy.name}</h3>
                      <Badge 
                        variant={allergy.severity === 'high' ? 'destructive' : allergy.severity === 'medium' ? 'default' : 'secondary'}
                      >
                        {allergy.severity}
                      </Badge>
                    </div>
                    <Badge variant="outline" className="mb-2">{allergy.type}</Badge>
                    <p className="text-sm text-muted-foreground">{allergy.symptoms}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredAllergies.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No allergies found matching "{allergySearch}"
              </div>
            )}

            {/* User's Known Allergies */}
            {currentUser?.role === 'child' && (
              <Card className="border-warning/30 bg-warning/5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-warning">
                    <AlertTriangle className="w-5 h-5" />
                    Your Known Allergies
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="destructive">Penicillin</Badge>
                    <Badge variant="outline">Demo Data - Editable for Presentation</Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Meal Plans Tab */}
          <TabsContent value="meals" className="animate-fade-in">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Breakfast",
                  icon: Sun,
                  color: "from-yellow-500 to-orange-500",
                  meals: [
                    { name: "Porridge with Milk", allergens: ["Milk"] },
                    { name: "Fresh Fruit Salad", allergens: [] },
                    { name: "Whole Grain Toast", allergens: ["Gluten"] },
                    { name: "Boiled Eggs", allergens: ["Eggs"] },
                  ]
                },
                {
                  title: "Lunch",
                  icon: Utensils,
                  color: "from-green-500 to-emerald-500",
                  meals: [
                    { name: "Ugali with Sukuma Wiki", allergens: [] },
                    { name: "Grilled Fish", allergens: ["Fish"] },
                    { name: "Bean Stew", allergens: [] },
                    { name: "Fresh Vegetables", allergens: [] },
                  ]
                },
                {
                  title: "Dinner",
                  icon: Moon,
                  color: "from-purple-500 to-indigo-500",
                  meals: [
                    { name: "Rice with Lentils", allergens: [] },
                    { name: "Chicken Stew", allergens: [] },
                    { name: "Chapati", allergens: ["Gluten"] },
                    { name: "Mixed Vegetable Soup", allergens: [] },
                  ]
                },
              ].map((mealTime) => {
                const Icon = mealTime.icon;
                return (
                  <Card key={mealTime.title} className="overflow-hidden">
                    <CardHeader className={`bg-gradient-to-br ${mealTime.color} text-white`}>
                      <CardTitle className="flex items-center gap-2">
                        <Icon className="w-5 h-5" />
                        {mealTime.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4">
                      <ul className="space-y-3">
                        {mealTime.meals.map((meal) => (
                          <li key={meal.name} className="flex items-center justify-between">
                            <span className="text-sm text-foreground">{meal.name}</span>
                            {meal.allergens.length > 0 && (
                              <div className="flex gap-1">
                                {meal.allergens.map((a) => (
                                  <Badge key={a} variant="outline" className="text-xs">
                                    {a}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="mt-6 bg-muted/50">
              <CardContent className="p-6 text-center">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> Meal plans are suggestions only. Adjust based on dietary restrictions, 
                  allergies, and personal preferences. Consult a nutritionist for personalized advice.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Consent Modal */}
      <ConsentModal
        isOpen={showConsentModal}
        onClose={() => setShowConsentModal(false)}
        onSuccess={handleConsentSuccess}
        title="Restricted Content"
        description="This content is age-restricted and requires parental consent."
      />
    </PageLayout>
  );
};

export default Education;
