import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Search, AlertTriangle, CheckCircle2, XCircle, 
  Apple, Wheat, Milk, Egg, Fish, Cookie,
  Mic, Volume2
} from 'lucide-react';

// Expanded Kenyan foods allergen database
const allergenDatabase: Record<string, string[]> = {
  // Western foods
  'bread': ['wheat', 'gluten', 'milk', 'eggs'],
  'cake': ['wheat', 'gluten', 'milk', 'eggs', 'soy'],
  'pasta': ['wheat', 'gluten', 'eggs'],
  'pizza': ['wheat', 'gluten', 'milk'],
  'cookies': ['wheat', 'gluten', 'milk', 'eggs', 'nuts'],
  'chocolate': ['milk', 'soy', 'nuts'],
  'ice cream': ['milk', 'eggs', 'nuts', 'soy'],
  'cheese': ['milk'],
  'yogurt': ['milk'],
  'butter': ['milk'],
  'scrambled eggs': ['eggs', 'milk'],
  'omelette': ['eggs', 'milk'],
  'mayonnaise': ['eggs'],
  'salad dressing': ['eggs', 'soy'],
  'peanut butter': ['peanuts', 'nuts'],
  'almond milk': ['nuts'],
  'soy milk': ['soy'],
  'tofu': ['soy'],
  'soy sauce': ['soy', 'wheat', 'gluten'],
  
  // Kenyan staples
  'ugali': [],
  'chapati': ['wheat', 'gluten'],
  'mandazi': ['wheat', 'gluten', 'eggs', 'milk'],
  'sukuma wiki': [],
  'nyama choma': [],
  'githeri': [],
  'mukimo': ['milk'],
  'pilau': [],
  'samosa': ['wheat', 'gluten'],
  
  // Kenyan fish dishes
  'tilapia': ['fish'],
  'omena': ['fish'],
  'fish fry': ['fish', 'wheat', 'gluten'],
  'samaki wa kukaanga': ['fish', 'wheat'],
  'fish stew': ['fish'],
  'dagaa': ['fish'],
  
  // Kenyan traditional dishes
  'matoke': [],
  'irio': ['milk'],
  'wali': [],
  'kachumbari': [],
  'mchuzi wa nyama': [],
  'mchuzi wa kuku': [],
  'mchuzi wa samaki': ['fish'],
  'bhajia': ['wheat', 'gluten'],
  'viazi karai': ['wheat', 'gluten'],
  'maharagwe': [],
  'dengu': [],
  'ndengu': [],
  'mbaazi': [],
  'kunde': [],
  'terere': [],
  'mrenda': [],
  'managu': [],
  'kienyeji vegetables': [],
  
  // Kenyan snacks
  'mahamri': ['wheat', 'gluten', 'milk'],
  'kashata': ['nuts', 'peanuts'],
  'ndazi': ['wheat', 'gluten', 'eggs'],
  'kaimati': ['wheat', 'gluten', 'milk'],
  'vitumbua': ['wheat', 'milk'],
  'mkate wa sinia': ['wheat', 'gluten', 'eggs', 'milk'],
  'maandazi': ['wheat', 'gluten', 'eggs', 'milk'],
  
  // Kenyan drinks
  'uji': ['wheat', 'sorghum'],
  'mursik': ['milk'],
  'chai': ['milk'],
  'tangawizi': [],
  'madafu': [],
  
  // Coastal Kenyan dishes
  'biryani': ['milk', 'nuts'],
  'pilau ya nyama': [],
  'wali wa nazi': ['nuts'],
  'mbaazi za nazi': ['nuts'],
  'mishkaki': [],
  'pweza': ['shellfish'],
  'kamba': ['shellfish'],
  
  // Seafood
  'fish': ['fish', 'shellfish'],
  'shrimp': ['shellfish'],
  'crab': ['shellfish'],
  'lobster': ['shellfish'],
  'prawns': ['shellfish'],
  'calamari': ['shellfish'],
  
  // Nyama varieties
  'nyama': [],
  'kuku': [],
  'goat meat': [],
  'beef stew': [],
  'liver': [],
  'matumbo': [],
  'mutura': [],
};

const allergenIcons: Record<string, React.ElementType> = {
  'wheat': Wheat,
  'gluten': Wheat,
  'milk': Milk,
  'eggs': Egg,
  'fish': Fish,
  'shellfish': Fish,
  'nuts': Cookie,
  'peanuts': Cookie,
  'soy': Apple,
};

interface AllergyCheckerProps {
  userAllergies?: string[];
}

export function AllergyChecker({ userAllergies }: AllergyCheckerProps) {
  const { getChildUser } = useAuth();
  const child = getChildUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [result, setResult] = useState<{
    food: string;
    allergens: string[];
    dangerous: string[];
    safe: boolean;
  } | null>(null);
  const [isListening, setIsListening] = useState(false);

  const allergies = userAllergies || child?.allergies || ['Peanuts'];

  const checkFood = (food: string) => {
    const normalizedFood = food.toLowerCase().trim();
    const foodAllergens = allergenDatabase[normalizedFood] || [];
    
    const dangerous = foodAllergens.filter(allergen => 
      allergies.some(a => 
        a.toLowerCase().includes(allergen) || 
        allergen.includes(a.toLowerCase())
      )
    );

    setResult({
      food: normalizedFood,
      allergens: foodAllergens,
      dangerous,
      safe: dangerous.length === 0,
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      checkFood(searchTerm);
    }
  };

  const handleVoiceInput = () => {
    setIsListening(true);
    // Demo: Simulate voice recognition
    setTimeout(() => {
      setSearchTerm('bread');
      checkFood('bread');
      setIsListening(false);
    }, 2000);
  };

  const speakResult = () => {
    if (!result) return;
    
    const message = result.safe 
      ? `${result.food} is safe for you to eat.`
      : `Warning! ${result.food} contains ${result.dangerous.join(' and ')}, which you are allergic to. Do not eat this food.`;
    
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  return (
    <Card className="border-0 shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Allergy Checker
        </CardTitle>
        <CardDescription>
          Check if a food is safe based on your allergies
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* User's Allergies */}
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-sm font-medium mb-2">Your Allergies:</p>
          <div className="flex flex-wrap gap-2">
            {allergies.map((allergy) => (
              <Badge key={allergy} variant="destructive">
                {allergy}
              </Badge>
            ))}
          </div>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Type food name (e.g., bread, cookies)"
              className="pl-10"
            />
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleVoiceInput}
            className={isListening ? 'animate-pulse bg-destructive/10' : ''}
          >
            <Mic className={`w-4 h-4 ${isListening ? 'text-destructive' : ''}`} />
          </Button>
          <Button type="submit">Check</Button>
        </form>

        {/* Voice Listening Indicator */}
        {isListening && (
          <div className="p-3 rounded-lg bg-primary/10 text-center animate-pulse">
            <Mic className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-sm font-medium">Listening... Say the food name</p>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className="space-y-3 animate-slide-up">
            <Alert className={result.safe ? 'border-green-500 bg-green-50 dark:bg-green-950/20' : 'border-destructive bg-destructive/10'}>
              <div className="flex items-start gap-3">
                {result.safe ? (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                ) : (
                  <XCircle className="w-6 h-6 text-destructive" />
                )}
                <div className="flex-1">
                  <AlertTitle className="text-lg capitalize">{result.food}</AlertTitle>
                  <AlertDescription>
                    {result.safe ? (
                      <span className="text-green-700 dark:text-green-400">
                        ✓ Safe to eat! No allergens detected for your profile.
                      </span>
                    ) : (
                      <span className="text-destructive font-semibold">
                        ⚠️ WARNING: Contains {result.dangerous.join(', ')}!
                      </span>
                    )}
                  </AlertDescription>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={speakResult}
                  className="shrink-0"
                >
                  <Volume2 className="w-5 h-5" />
                </Button>
              </div>
            </Alert>

            {/* Allergens in food */}
            {result.allergens.length > 0 && (
              <div className="p-3 rounded-lg bg-muted/50">
                <p className="text-sm font-medium mb-2">Allergens in this food:</p>
                <div className="flex flex-wrap gap-2">
                  {result.allergens.map((allergen) => {
                    const Icon = allergenIcons[allergen] || Apple;
                    const isDangerous = result.dangerous.includes(allergen);
                    return (
                      <Badge 
                        key={allergen} 
                        variant={isDangerous ? 'destructive' : 'secondary'}
                        className="flex items-center gap-1"
                      >
                        <Icon className="w-3 h-3" />
                        {allergen}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Quick Check Buttons */}
        <div className="pt-2">
          <p className="text-sm text-muted-foreground mb-2">Quick check Kenyan foods:</p>
          <div className="flex flex-wrap gap-2">
            {['Ugali', 'Tilapia', 'Omena', 'Matoke', 'Mandazi', 'Chapati', 'Pilau', 'Nyama Choma'].map((food) => (
              <Button
                key={food}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchTerm(food);
                  checkFood(food);
                }}
              >
                {food}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
