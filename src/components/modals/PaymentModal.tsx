import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Lock, CreditCard, Smartphone, Building2, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  amount: string;
  charityName?: string;
}

const paymentMethods = [
  { id: 'mpesa', name: 'M-Pesa', icon: Smartphone, description: 'Pay via M-Pesa mobile money' },
  { id: 'card', name: 'Card', icon: CreditCard, description: 'Visa, Mastercard, or debit card' },
  { id: 'bank', name: 'Bank Transfer', icon: Building2, description: 'Direct bank transfer' },
];

export function PaymentModal({
  isOpen,
  onClose,
  onSuccess,
  amount,
  charityName,
}: PaymentModalProps) {
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [pin, setPin] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('+254 7XX XXX XXX');
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState<'method' | 'pin'>('method');
  const { toast } = useToast();

  // Demo PIN: 1234
  const DEMO_PIN = '1234';

  const handleSelectMethod = () => {
    setStep('pin');
  };

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin !== DEMO_PIN) {
      toast({
        title: "Invalid PIN",
        description: "Demo PIN is 1234",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setStep('method');
    setPin('');
    onSuccess();
  };

  const handleClose = () => {
    setStep('method');
    setPin('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {step === 'method' ? 'Select Payment Method' : 'Enter PIN'}
          </DialogTitle>
          <DialogDescription>
            {step === 'method' 
              ? `Donate KES ${amount}${charityName ? ` to ${charityName}` : ''}` 
              : `Confirm ${paymentMethods.find(p => p.id === paymentMethod)?.name} payment of KES ${amount}`
            }
          </DialogDescription>
        </DialogHeader>

        {step === 'method' ? (
          <div className="space-y-4">
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <div
                    key={method.id}
                    className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setPaymentMethod(method.id)}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      method.id === 'mpesa' ? 'bg-green-500' :
                      method.id === 'card' ? 'bg-blue-500' : 'bg-purple-500'
                    }`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <Label htmlFor={method.id} className="font-semibold cursor-pointer">
                        {method.name}
                      </Label>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </div>
                );
              })}
            </RadioGroup>

            {paymentMethod === 'mpesa' && (
              <div className="space-y-2">
                <Label>M-Pesa Phone Number</Label>
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+254 7XX XXX XXX"
                />
              </div>
            )}

            <Button onClick={handleSelectMethod} className="w-full">
              Continue to Payment
            </Button>
          </div>
        ) : (
          <form onSubmit={handlePayment} className="space-y-4">
            <div className="p-4 rounded-xl bg-muted/50 text-center">
              <p className="text-2xl font-bold text-primary">KES {amount}</p>
              {charityName && <p className="text-sm text-muted-foreground">{charityName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-pin">Enter PIN</Label>
              <Input
                id="payment-pin"
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={4}
                placeholder="Enter 4-digit PIN"
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                className="text-center text-2xl tracking-widest"
                autoFocus
              />
            </div>

            <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                <span>Demo PIN: <strong className="text-foreground">1234</strong></span>
              </p>
            </div>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => setStep('method')} className="flex-1">
                Back
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={pin.length !== 4 || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Pay Now'
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              Demo Mode – No actual payment will be processed
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
