import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Package, Truck, CheckCircle, Clock, MapPin, 
  Phone, MessageSquare, RefreshCw, Navigation
} from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
  orderStatus: 'pending' | 'verified' | 'dispatched' | 'out_for_delivery' | 'delivered';
  pharmacyName: string;
  estimatedTime: string;
  deliveryAddress: string;
  items: { name: string; quantity: number }[];
  onRefresh?: () => void;
}

const statusSteps = [
  { key: 'pending', label: { en: 'Ordered', sw: 'Imeagizwa', fr: 'Commandé' }, icon: Package },
  { key: 'verified', label: { en: 'Verified', sw: 'Imethibitishwa', fr: 'Vérifié' }, icon: CheckCircle },
  { key: 'dispatched', label: { en: 'Dispatched', sw: 'Imetumwa', fr: 'Expédié' }, icon: Truck },
  { key: 'out_for_delivery', label: { en: 'Out for Delivery', sw: 'Inawasilishwa', fr: 'En livraison' }, icon: Navigation },
  { key: 'delivered', label: { en: 'Delivered', sw: 'Imewasilishwa', fr: 'Livré' }, icon: CheckCircle },
];

export function OrderTracking({
  orderId,
  orderStatus,
  pharmacyName,
  estimatedTime,
  deliveryAddress,
  items,
  onRefresh
}: OrderTrackingProps) {
  const [progress, setProgress] = useState(0);
  const lang = (localStorage.getItem('emec-language') || 'en') as 'en' | 'sw' | 'fr';

  const currentStepIndex = statusSteps.findIndex(step => step.key === orderStatus);
  const progressPercentage = ((currentStepIndex + 1) / statusSteps.length) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setProgress(progressPercentage), 300);
    return () => clearTimeout(timer);
  }, [progressPercentage]);

  const getStatusColor = (stepIndex: number) => {
    if (stepIndex < currentStepIndex) return 'bg-success text-success-foreground';
    if (stepIndex === currentStepIndex) return 'bg-primary text-primary-foreground animate-pulse';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="border-0 shadow-elegant overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-primary/10 to-accent/10">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Truck className="w-5 h-5" />
              {lang === 'sw' ? 'Fuatilia Agizo' : lang === 'fr' ? 'Suivi de commande' : 'Track Order'}
            </CardTitle>
            <CardDescription className="mt-1">
              {lang === 'sw' ? 'Agizo' : lang === 'fr' ? 'Commande' : 'Order'} #{orderId.slice(0, 8).toUpperCase()}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {lang === 'sw' ? 'Sasisha' : lang === 'fr' ? 'Actualiser' : 'Refresh'}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Progress Bar */}
        <div className="space-y-3">
          <Progress value={progress} className="h-3" />
          
          {/* Status Steps */}
          <div className="flex justify-between">
            {statusSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.key} className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${getStatusColor(index)}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-xs mt-2 text-center max-w-16 ${
                    index <= currentStepIndex ? 'text-foreground font-medium' : 'text-muted-foreground'
                  }`}>
                    {step.label[lang]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Status Card */}
        <div className="p-4 rounded-xl bg-primary/5 border-2 border-primary/20">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center animate-pulse">
              {(() => {
                const CurrentIcon = statusSteps[currentStepIndex]?.icon || Package;
                return <CurrentIcon className="w-5 h-5 text-primary-foreground" />;
              })()}
            </div>
            <div>
              <p className="font-semibold">
                {statusSteps[currentStepIndex]?.label[lang]}
              </p>
              <p className="text-sm text-muted-foreground">
                {orderStatus === 'pending' && (lang === 'sw' ? 'Agizo lako linasubiri uthibitisho' : lang === 'fr' ? 'Votre commande attend vérification' : 'Your order is awaiting verification')}
                {orderStatus === 'verified' && (lang === 'sw' ? 'Dawa zako zinaandaliwa' : lang === 'fr' ? 'Vos médicaments sont en préparation' : 'Your medications are being prepared')}
                {orderStatus === 'dispatched' && (lang === 'sw' ? 'Dereva yuko njiani kwenda kwako' : lang === 'fr' ? 'Le chauffeur est en route vers vous' : 'Driver is on the way to you')}
                {orderStatus === 'out_for_delivery' && (lang === 'sw' ? 'Karibu kufika - jiandae!' : lang === 'fr' ? 'Presque arrivé - préparez-vous!' : 'Almost there - get ready!')}
                {orderStatus === 'delivered' && (lang === 'sw' ? 'Imewasilishwa kwa mafanikio!' : lang === 'fr' ? 'Livré avec succès!' : 'Successfully delivered!')}
              </p>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">
                {lang === 'sw' ? 'Muda uliokadiriwa' : lang === 'fr' ? 'Temps estimé' : 'Estimated Time'}
              </span>
            </div>
            <p className="text-lg font-semibold">{estimatedTime}</p>
          </div>
          
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-4 h-4 text-primary" />
              <span className="font-medium text-sm">{pharmacyName}</span>
            </div>
            <Badge variant="secondary">
              {items.length} {lang === 'sw' ? 'bidhaa' : lang === 'fr' ? 'articles' : 'items'}
            </Badge>
          </div>
        </div>

        {/* Delivery Address */}
        <div className="p-4 rounded-xl border-2 border-dashed border-muted-foreground/30">
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-sm mb-1">
                {lang === 'sw' ? 'Anwani ya Uwasilishaji' : lang === 'fr' ? 'Adresse de livraison' : 'Delivery Address'}
              </p>
              <p className="text-muted-foreground">{deliveryAddress}</p>
            </div>
          </div>
        </div>

        {/* Contact Options */}
        {(orderStatus === 'dispatched' || orderStatus === 'out_for_delivery') && (
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <Phone className="w-4 h-4" />
              {lang === 'sw' ? 'Piga Dereva' : lang === 'fr' ? 'Appeler chauffeur' : 'Call Driver'}
            </Button>
            <Button variant="outline" className="gap-2">
              <MessageSquare className="w-4 h-4" />
              {lang === 'sw' ? 'Tuma Ujumbe' : lang === 'fr' ? 'Envoyer message' : 'Send Message'}
            </Button>
          </div>
        )}

        {/* Demo Notice */}
        <p className="text-xs text-center text-muted-foreground">
          {lang === 'sw' 
            ? 'Hali ya Demo - Ufuatiliaji halisi unapatikana katika uzalishaji'
            : lang === 'fr'
            ? 'Mode démo - Le suivi en temps réel est disponible en production'
            : 'Demo Mode - Real-time tracking available in production'}
        </p>
      </CardContent>
    </Card>
  );
}
