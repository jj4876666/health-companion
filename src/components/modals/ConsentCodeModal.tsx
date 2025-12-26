import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface ConsentCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title?: string;
  description?: string;
}

export function ConsentCodeModal({
  isOpen,
  onClose,
  onSuccess,
  title = "Parent Approval Required",
  description = "This section contains age-restricted content. Please enter your parent's consent code to continue.",
}: ConsentCodeModalProps) {
  const [code, setCode] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const { addAuditEntry, currentUser } = useAuth();
  const { toast } = useToast();

  // Demo consent code: 1234 (Kevin's parent consent code)
  const DEMO_CONSENT_CODE = '1234';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsVerifying(true);

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (code === DEMO_CONSENT_CODE) {
      addAuditEntry({
        userId: currentUser?.id || 'child-001',
        userName: currentUser?.name || 'Kevin Otieno',
        userRole: 'child',
        action: 'CONSENT_VERIFIED',
        target: 'Restricted Content',
        details: 'Parent consent code verified for restricted content access',
      });

      toast({
        title: "Access Granted",
        description: "Parent consent verified. You can now access this content.",
      });

      setIsVerifying(false);
      setCode('');
      onSuccess();
    } else {
      setError('Invalid consent code. Please ask your parent for the correct code.');
      setIsVerifying(false);
      
      addAuditEntry({
        userId: currentUser?.id || 'child-001',
        userName: currentUser?.name || 'Kevin Otieno',
        userRole: 'child',
        action: 'CONSENT_DENIED',
        target: 'Restricted Content',
        details: 'Invalid consent code entered',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-warning" />
          </div>
          <DialogTitle className="text-xl">{title}</DialogTitle>
          <DialogDescription className="text-center">
            {description}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="consent-code">Parent Consent Code</Label>
            <Input
              id="consent-code"
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={4}
              placeholder="Enter 4-digit code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              className="text-center text-2xl tracking-widest"
              autoFocus
            />
            {error && (
              <p className="text-sm text-destructive flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          <div className="p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
            <p className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Demo Code: <strong className="text-foreground">1234</strong></span>
            </p>
          </div>

          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={code.length !== 4 || isVerifying}
            >
              {isVerifying ? 'Verifying...' : 'Verify Code'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
