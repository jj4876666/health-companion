import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { usePremium } from '@/contexts/PremiumContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SecurePaymentProcessor } from '@/components/payment/SecurePaymentProcessor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  HandHeart, Heart, Gift, Users, Check, Crown, Sparkles, Globe, 
  CreditCard, Smartphone, Building2, Shield, Star, ExternalLink, CheckCircle, Lock
} from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const charities = [
  { id: 'charity-001', name: 'Children with Special Conditions Fund', description: 'Supporting children with disabilities across Kenya', raised: 125000, goal: 500000, image: '🏥' },
  { id: 'charity-002', name: 'Kenya Child Nutrition Program', description: 'Providing healthy meals to children in rural areas', raised: 89000, goal: 200000, image: '🍎' },
  { id: 'charity-003', name: 'Education for All Kenya', description: 'Building schools and providing educational resources', raised: 340000, goal: 750000, image: '📚' },
];

const donorWall = [
  { name: 'Anonymous', amount: 5000, charity: 'Children with Special Conditions Fund', date: '2025-01-15', isPublic: false },
  { name: 'Sarah M.', amount: 2500, charity: 'Kenya Child Nutrition Program', date: '2025-01-14', isPublic: true },
  { name: 'Mbita High School', amount: 10000, charity: 'Education for All Kenya', date: '2025-01-13', isPublic: true, isOrg: true },
  { name: 'James O.', amount: 1000, charity: 'Children with Special Conditions Fund', date: '2025-01-12', isPublic: true },
  { name: 'Anonymous', amount: 7500, charity: 'Education for All Kenya', date: '2025-01-11', isPublic: false },
];

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, color: 'bg-green-500' },
  { id: 'card', name: 'Visa/Mastercard', icon: CreditCard, color: 'bg-blue-500' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, color: 'bg-gray-500' },
  { id: 'airtel', name: 'Airtel Money', icon: Smartphone, color: 'bg-red-500' },
];

export default function Donations() {
  const { currentUser, isAuthenticated } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const { isPremium, activatePremium, daysRemaining, features } = usePremium();

  const [activeTab, setActiveTab] = useState('donate');
  const [selectedCharity, setSelectedCharity] = useState<string | null>(null);
  const [amount, setAmount] = useState('500');
  const [message, setMessage] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [isComplete, setIsComplete] = useState(false);
  const [showPaymentProcessor, setShowPaymentProcessor] = useState(false);
  const [showPremiumPayment, setShowPremiumPayment] = useState<'monthly' | 'yearly' | null>(null);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleDonate = () => {
    if (!selectedCharity || !amount) {
      toast({ title: "Error", description: "Please select a charity and amount", variant: "destructive" });
      return;
    }
    setShowPaymentProcessor(true);
  };

  const handleDonationSuccess = () => {
    setShowPaymentProcessor(false);
    setIsComplete(true);
    toast({ title: "Thank you! 🎉", description: `Your donation of KES ${amount} has been processed.` });
  };

  const handlePremiumPurchase = (plan: 'monthly' | 'yearly') => {
    setShowPremiumPayment(plan);
  };

  const handlePremiumSuccess = () => {
    if (showPremiumPayment) {
      activatePremium(showPremiumPayment as any);
      setShowPremiumPayment(null);
    }
  };

  // Thank You Screen
  if (isComplete) {
    const charity = charities.find(c => c.id === selectedCharity);
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
                <p className="text-lg">You donated <strong className="text-primary">KES {amount}</strong> to</p>
                <p className="font-semibold text-xl mt-1">{charity?.name}</p>
              </div>
              <div className="p-4 rounded-xl bg-primary/10 text-center">
                <Sparkles className="w-5 h-5 inline mr-2" />
                Your donation helps children in Kenya today.
              </div>
              {isPublic && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Globe className="w-4 h-4" />
                  <span>Appearing on the public donor wall</span>
                </div>
              )}
              <Button onClick={() => { setIsComplete(false); setSelectedCharity(null); }} className="w-full">
                Donate Again
              </Button>
              <p className="text-xs text-center text-muted-foreground">Demo Mode – No actual payment</p>
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

        <Badge variant="outline" className="bg-warning/10 text-warning-foreground border-warning/30">
          Demo Mode – Payments are simulated
        </Badge>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="donate"><Gift className="w-4 h-4 mr-2" />Donate</TabsTrigger>
            <TabsTrigger value="wall"><Users className="w-4 h-4 mr-2" />Donor Wall</TabsTrigger>
            <TabsTrigger value="premium"><Crown className="w-4 h-4 mr-2" />Premium</TabsTrigger>
          </TabsList>

          {/* Donate Tab */}
          <TabsContent value="donate" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {charities.map((charity) => (
                <Card key={charity.id} className={`cursor-pointer transition-all ${selectedCharity === charity.id ? 'ring-2 ring-primary' : ''}`} onClick={() => setSelectedCharity(charity.id)}>
                  <CardContent className="p-4">
                    <div className="text-3xl mb-2">{charity.image}</div>
                    <h3 className="font-semibold text-sm">{charity.name}</h3>
                    <Progress value={(charity.raised / charity.goal) * 100} className="h-2 mt-2" />
                    <p className="text-xs text-muted-foreground mt-1">KES {charity.raised.toLocaleString()} / {charity.goal.toLocaleString()}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedCharity && (
              <Card className="border-0 shadow-elegant animate-fade-in">
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-4 gap-2">
                    {['100', '500', '1000', '5000'].map((preset) => (
                      <Button key={preset} variant={amount === preset ? 'default' : 'outline'} onClick={() => setAmount(preset)}>{preset}</Button>
                    ))}
                  </div>
                  <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Custom amount" />
                  
                  <div className="grid grid-cols-4 gap-2">
                    {paymentMethods.map((method) => (
                      <Button key={method.id} variant={paymentMethod === method.id ? 'default' : 'outline'} className="flex-col h-auto py-3" onClick={() => setPaymentMethod(method.id)}>
                        <method.icon className="w-5 h-5 mb-1" />
                        <span className="text-xs">{method.name}</span>
                      </Button>
                    ))}
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                    <span className="text-sm">Make donation public</span>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>

                  <Button onClick={handleDonate} className="w-full h-12" size="lg">
                    <Gift className="w-5 h-5 mr-2" />Donate KES {amount}
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Donor Wall Tab */}
          <TabsContent value="wall" className="space-y-4">
            <Card className="border-0 shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users className="w-5 h-5" />{t('donation.donorWall')}</CardTitle>
                <CardDescription>Recent supporters of EMEC charities</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {donorWall.map((donor, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-muted/50">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      {donor.isPublic ? <Heart className="w-5 h-5 text-primary" /> : <Shield className="w-5 h-5 text-muted-foreground" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{donor.name}</p>
                      <p className="text-xs text-muted-foreground italic">{donor.charity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">KES {donor.amount.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">{donor.date}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Premium Tab */}
          <TabsContent value="premium" className="space-y-4">
            {isPremium ? (
              <Card className="border-0 shadow-elegant overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white text-center">
                  <Crown className="w-12 h-12 mx-auto mb-2" />
                  <h2 className="text-2xl font-bold">Premium Active! 🎉</h2>
                  <p className="text-white/80">{daysRemaining} days remaining</p>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {features.map((feature) => (
                      <div key={feature.id} className="p-3 rounded-xl bg-primary/5 flex items-center gap-3">
                        <span className="text-2xl">{feature.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{feature.name}</p>
                          <p className="text-xs text-muted-foreground">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-elegant overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 text-white text-center">
                  <Crown className="w-12 h-12 mx-auto mb-2" />
                  <h2 className="text-2xl font-bold">{t('donation.premium')}</h2>
                  <p className="text-white/80">Unlock all features and support EMEC</p>
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <Card className="border-2 border-primary cursor-pointer hover:shadow-lg transition-all" onClick={() => handlePremiumPurchase('monthly')}>
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold">KES 299</p>
                        <p className="text-muted-foreground">/month</p>
                        <Button className="w-full mt-4">Subscribe Monthly</Button>
                      </CardContent>
                    </Card>
                    <Card className="border-2 border-warning cursor-pointer hover:shadow-lg transition-all" onClick={() => handlePremiumPurchase('yearly')}>
                      <CardContent className="p-4 text-center">
                        <Badge className="bg-warning text-warning-foreground mb-2">Save 20%</Badge>
                        <p className="text-2xl font-bold">KES 2,499</p>
                        <p className="text-muted-foreground">/year</p>
                        <Button className="w-full mt-4 bg-warning hover:bg-warning/90">Subscribe Yearly</Button>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {features.slice(0, 4).map((feature) => (
                      <div key={feature.id} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>{feature.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Payment Processor Modals */}
        {showPaymentProcessor && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <SecurePaymentProcessor
                amount={parseInt(amount)}
                description={`Donation to ${charities.find(c => c.id === selectedCharity)?.name}`}
                onSuccess={handleDonationSuccess}
                onCancel={() => setShowPaymentProcessor(false)}
              />
            </div>
          </div>
        )}

        {showPremiumPayment && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
              <SecurePaymentProcessor
                amount={showPremiumPayment === 'monthly' ? 299 : 2499}
                description={`EMEC Premium ${showPremiumPayment === 'monthly' ? 'Monthly' : 'Yearly'} Subscription`}
                onSuccess={handlePremiumSuccess}
                onCancel={() => setShowPremiumPayment(null)}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}