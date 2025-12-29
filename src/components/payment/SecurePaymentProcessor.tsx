import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CreditCard, Smartphone, Building2, Shield, Lock, CheckCircle, 
  AlertCircle, Eye, EyeOff, Fingerprint, Key
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethod {
  id: string;
  name: string;
  icon: typeof CreditCard;
  color: string;
  fields: { name: string; placeholder: string; type: string; masked?: boolean }[];
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'mpesa',
    name: 'M-Pesa',
    icon: Smartphone,
    color: 'bg-green-500',
    fields: [
      { name: 'phone', placeholder: '07XX XXX XXX', type: 'tel' },
      { name: 'pin', placeholder: 'M-Pesa PIN (Demo: 1234)', type: 'password', masked: true },
    ],
  },
  {
    id: 'card',
    name: 'Visa/Mastercard',
    icon: CreditCard,
    color: 'bg-blue-500',
    fields: [
      { name: 'cardNumber', placeholder: '4XXX XXXX XXXX XXXX', type: 'text', masked: true },
      { name: 'expiry', placeholder: 'MM/YY', type: 'text' },
      { name: 'cvv', placeholder: 'CVV', type: 'password', masked: true },
      { name: 'name', placeholder: 'Cardholder Name', type: 'text' },
    ],
  },
  {
    id: 'bank',
    name: 'Bank Transfer',
    icon: Building2,
    color: 'bg-gray-500',
    fields: [
      { name: 'accountNumber', placeholder: 'Account Number', type: 'text', masked: true },
      { name: 'bankName', placeholder: 'Bank Name', type: 'text' },
      { name: 'cardNumber', placeholder: 'Debit Card Number', type: 'text', masked: true },
      { name: 'expiry', placeholder: 'Card Expiry (MM/YY)', type: 'text' },
      { name: 'cvv', placeholder: 'CVV', type: 'password', masked: true },
    ],
  },
  {
    id: 'airtel',
    name: 'Airtel Money',
    icon: Smartphone,
    color: 'bg-red-500',
    fields: [
      { name: 'phone', placeholder: '07XX XXX XXX', type: 'tel' },
      { name: 'pin', placeholder: 'Airtel Money PIN (Demo: 1234)', type: 'password', masked: true },
    ],
  },
];

interface SecurePaymentProcessorProps {
  amount: number;
  currency?: string;
  description: string;
  onSuccess: (transactionId: string) => void;
  onCancel: () => void;
}

export function SecurePaymentProcessor({ 
  amount, 
  currency = 'KES', 
  description,
  onSuccess,
  onCancel 
}: SecurePaymentProcessorProps) {
  const { toast } = useToast();
  const [selectedMethod, setSelectedMethod] = useState<string>('mpesa');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showMasked, setShowMasked] = useState<Record<string, boolean>>({});
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState<'input' | 'verify' | 'processing' | 'success'>('input');
  const [otp, setOtp] = useState('');
  const [encryptionKey] = useState(() => `ENC-${Date.now().toString(36).toUpperCase()}`);

  const currentMethod = paymentMethods.find(m => m.id === selectedMethod);

  // Simulate encryption indicator
  useEffect(() => {
    if (step === 'processing') {
      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + 10;
        });
      }, 300);
      return () => clearInterval(timer);
    }
  }, [step]);

  useEffect(() => {
    if (progress === 100) {
      setTimeout(() => {
        setStep('success');
        const txId = `TXN-${Date.now().toString(36).toUpperCase()}`;
        onSuccess(txId);
      }, 500);
    }
  }, [progress, onSuccess]);

  const handleInputChange = (fieldName: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const toggleMask = (fieldName: string) => {
    setShowMasked(prev => ({ ...prev, [fieldName]: !prev[fieldName] }));
  };

  const handleSubmit = () => {
    // Validate required fields
    const requiredFields = currentMethod?.fields || [];
    const missingFields = requiredFields.filter(f => !formData[f.name]);
    
    if (missingFields.length > 0) {
      toast({ 
        title: "Missing Information", 
        description: "Please fill in all required fields",
        variant: "destructive" 
      });
      return;
    }

    setStep('verify');
    toast({ 
      title: "🔐 Verification Required", 
      description: "Enter the OTP sent to your registered device" 
    });
  };

  const handleVerify = () => {
    if (otp.length < 4) {
      toast({ 
        title: "Invalid OTP", 
        description: "Please enter a valid verification code",
        variant: "destructive" 
      });
      return;
    }

    setStep('processing');
    setProcessing(true);
    toast({ 
      title: "🔒 Processing Securely", 
      description: "Your payment is being encrypted and processed..." 
    });
  };

  const maskValue = (value: string, show: boolean) => {
    if (show || !value) return value;
    if (value.length <= 4) return '****';
    return '*'.repeat(value.length - 4) + value.slice(-4);
  };

  if (step === 'success') {
    return (
      <Card variant="elevated" className="overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 p-8 text-white text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-4 left-1/4 text-6xl animate-float">✨</div>
            <div className="absolute bottom-4 right-1/4 text-4xl animate-bounce-soft">🎉</div>
          </div>
          <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <CheckCircle className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
          <p className="text-white/80">Transaction completed securely</p>
        </div>
        <CardContent className="p-6 text-center">
          <div className="space-y-4">
            <p className="stat-number text-primary">{currency} {amount.toLocaleString()}</p>
            <p className="text-muted-foreground">{description}</p>
            <div className="flex items-center justify-center gap-2 text-sm text-success">
              <Shield className="w-4 h-4" />
              <span>End-to-end encrypted transaction</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'processing') {
    return (
      <Card variant="elevated">
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-10 h-10 text-primary animate-pulse-soft" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Processing Payment</h3>
          <p className="text-muted-foreground mb-6">Encrypting and securing your transaction...</p>
          
          <div className="space-y-4">
            <div className="relative">
              <Progress value={progress} className="h-3" />
              <div className="absolute inset-0 shimmer rounded-full" />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Encrypting...
              </span>
              <span className="font-mono">{progress}%</span>
            </div>
            
            <div className="p-3 rounded-xl bg-muted/50 text-xs font-mono">
              <div className="flex items-center justify-center gap-2 text-primary">
                <Key className="w-3 h-3" />
                <span>Session: {encryptionKey}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (step === 'verify') {
    return (
      <Card variant="elevated">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
            <Fingerprint className="w-8 h-8 text-primary" />
          </div>
          <CardTitle>Verify Your Identity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <p className="text-center text-muted-foreground">
            Enter the 6-digit OTP sent to your device
          </p>
          
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Input
                key={i}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-bold rounded-xl border-2 focus:border-primary transition-colors"
                value={otp[i] || ''}
                onChange={(e) => {
                  const newOtp = otp.split('');
                  newOtp[i] = e.target.value;
                  setOtp(newOtp.join(''));
                  
                  if (e.target.value && i < 5) {
                    const next = e.target.parentElement?.children[i + 1] as HTMLInputElement;
                    next?.focus();
                  }
                }}
              />
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Demo: Enter any 6 digits (e.g., 123456)
          </p>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setStep('input')} className="flex-1 h-11">
              Back
            </Button>
            <Button onClick={handleVerify} className="flex-1 h-11 btn-glow">
              <Shield className="w-4 h-4 mr-2" />
              Verify & Pay
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-success" />
            Secure Payment
          </CardTitle>
          <Badge variant="outline" className="bg-success/10 text-success border-success/30">
            <Shield className="w-3 h-3 mr-1" />
            256-bit SSL
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Amount Display */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent text-center border border-primary/10">
          <p className="text-sm text-muted-foreground mb-1">Amount to Pay</p>
          <p className="stat-number text-primary">{currency} {amount.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>

        {/* Payment Method Selection */}
        <div className="grid grid-cols-4 gap-2">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Button
                key={method.id}
                variant={selectedMethod === method.id ? 'default' : 'outline'}
                className={`flex-col h-auto py-4 rounded-xl transition-all ${
                  selectedMethod === method.id ? 'ring-2 ring-primary ring-offset-2' : ''
                }`}
                onClick={() => {
                  setSelectedMethod(method.id);
                  setFormData({});
                }}
              >
                <Icon className="w-5 h-5 mb-1.5" />
                <span className="text-xs font-medium">{method.name.split('/')[0]}</span>
              </Button>
            );
          })}
        </div>

        {/* Payment Form Fields */}
        {currentMethod && (
          <div className="space-y-3 animate-fade-up">
            {currentMethod.fields.map((field) => (
              <div key={field.name} className="relative">
                <Input
                  type={field.masked && !showMasked[field.name] ? 'password' : field.type}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  className="pr-10 h-12 rounded-xl"
                />
                {field.masked && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                    onClick={() => toggleMask(field.name)}
                  >
                    {showMasked[field.name] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Security Info */}
        <div className="p-4 rounded-xl bg-muted/50 space-y-2">
          <div className="flex items-center gap-2 text-sm text-success">
            <CheckCircle className="w-4 h-4" />
            <span>Your data is encrypted end-to-end</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Key className="w-3 h-3" />
            <span className="font-mono">Session: {encryptionKey}</span>
          </div>
        </div>

        <Badge variant="outline" className="w-full justify-center py-2.5 bg-warning/10 text-warning-foreground border-warning/30">
          <AlertCircle className="w-3 h-3 mr-2" />
          Demo Mode – No actual payment will be processed
        </Badge>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 h-12">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 h-12 btn-glow">
            <Lock className="w-4 h-4 mr-2" />
            Pay {currency} {amount.toLocaleString()}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
