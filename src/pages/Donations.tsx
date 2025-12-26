import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  HandHeart, Heart, Gift, Users, Check, Loader2, 
  Share2, Lock, Sparkles, Globe
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const charities = [
  {
    id: 'charity-001',
    name: 'Children with Special Conditions Fund',
    description: 'Supporting children with disabilities and special needs across Kenya',
    raised: 125000,
    goal: 500000,
    image: '🏥',
  },
  {
    id: 'charity-002',
    name: 'Kenya Child Nutrition Program',
    description: 'Providing healthy meals to underprivileged children in rural areas',
    raised: 89000,
    goal: 200000,
    image: '🍎',
  },
  {
    id: 'charity-003',
    name: 'Education for All Kenya',
    description: 'Building schools and providing educational resources',
    raised: 340000,
    goal: 750000,
    image: '📚',
  },
];

export default function Donations() {
  const { currentUser, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const [selectedCharity, setSelectedCharity] = useState<string | null>(null);
  const [amount, setAmount] = useState('500');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleDonate = async () => {
    if (!selectedCharity || !amount) {
      toast({
        title: "Error",
        description: "Please select a charity and enter an amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsProcessing(false);
    setIsComplete(true);

    toast({
      title: "Thank you! 🎉",
      description: `Your donation of KES ${amount} has been processed.`,
    });
  };

  const resetDonation = () => {
    setSelectedCharity(null);
    setAmount('500');
    setMessage('');
    setIsPublic(false);
    setIsComplete(false);
  };

  // Donation Complete Screen
  if (isComplete) {
    const charity = charities.find((c) => c.id === selectedCharity);
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 max-w-xl mx-auto">
          <Card className="border-0 shadow-elegant overflow-hidden">
            <div className="gradient-emec p-8 text-white text-center">
              <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-bounce-soft">
                <Heart className="w-10 h-10 fill-white" />
              </div>
              <h2 className="text-3xl font-bold mb-2">Thank You!</h2>
              <p className="text-white/80">Your generosity makes a difference</p>
            </div>
            <CardContent className="p-6 space-y-4">
              <div className="text-center">
                <p className="text-lg">
                  You donated <strong className="text-primary">KES {amount}</strong> to
                </p>
                <p className="font-semibold text-xl mt-1">{charity?.name}</p>
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
                <p className="text-center text-sm">
                  <Sparkles className="w-4 h-4 inline mr-1" />
                  Your donation helps <strong>X children</strong> in Kenya today.
                </p>
              </div>

              {isPublic && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>This donation will appear on the public donor wall</span>
                </div>
              )}

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 gap-2">
                  <Share2 className="w-4 h-4" />
                  Share
                </Button>
                <Button onClick={resetDonation} className="flex-1">
                  Donate Again
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Demo Mode – No actual payment processed
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  // Processing Screen
  if (isProcessing) {
    return (
      <DashboardLayout>
        <div className="p-4 md:p-6 flex items-center justify-center min-h-[60vh]">
          <Card className="border-0 shadow-elegant w-full max-w-md">
            <CardContent className="p-8 text-center">
              <div className="relative w-20 h-20 mx-auto mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                <Lock className="w-8 h-8 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('donation.processing')}</h3>
              <p className="text-muted-foreground">Securely processing your donation...</p>
              <p className="text-xs text-muted-foreground mt-4">
                Demo Mode – Simulated payment
              </p>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl gradient-emec flex items-center justify-center">
            <HandHeart className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{t('donation.title')}</h1>
            <p className="text-muted-foreground">Support children's health and education</p>
          </div>
        </div>

        {/* Demo Label */}
        <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
          Demo Mode – Pre-filled donor: {currentUser?.name || 'Jacob Johnson'}
        </Badge>

        {/* Charity Selection */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Select a Charity</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {charities.map((charity) => {
              const progress = (charity.raised / charity.goal) * 100;
              const isSelected = selectedCharity === charity.id;

              return (
                <Card
                  key={charity.id}
                  className={`border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-primary shadow-md scale-[1.02]'
                      : 'border-transparent shadow-elegant hover:border-primary/50'
                  }`}
                  onClick={() => setSelectedCharity(charity.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-2xl">
                        {charity.image}
                      </div>
                      {isSelected && (
                        <div className="ml-auto w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-4 h-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <h3 className="font-semibold">{charity.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{charity.description}</p>
                    <div className="mt-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>KES {charity.raised.toLocaleString()}</span>
                        <span className="text-muted-foreground">of KES {charity.goal.toLocaleString()}</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Donation Form */}
        {selectedCharity && (
          <Card className="border-0 shadow-elegant animate-fade-in">
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
              <CardDescription>Complete your donation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Amount Selection */}
              <div className="space-y-2">
                <Label>{t('donation.amount')}</Label>
                <div className="grid grid-cols-4 gap-2">
                  {['100', '500', '1000', '5000'].map((preset) => (
                    <Button
                      key={preset}
                      variant={amount === preset ? 'default' : 'outline'}
                      onClick={() => setAmount(preset)}
                    >
                      {preset}
                    </Button>
                  ))}
                </div>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Custom amount"
                  className="mt-2"
                />
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label>Message (optional)</Label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message of support..."
                  rows={3}
                />
              </div>

              {/* Public Toggle */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">Make this donation public</span>
                </div>
                <Switch checked={isPublic} onCheckedChange={setIsPublic} />
              </div>

              {/* Donate Button */}
              <Button
                onClick={handleDonate}
                className="w-full h-12 text-lg"
                size="lg"
              >
                <Gift className="w-5 h-5 mr-2" />
                Donate KES {amount}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                Demo Mode – No actual payment will be processed
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
