import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, ShieldCheck, AlertTriangle } from 'lucide-react';

interface ConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  title: string;
  description: string;
  requiredCode?: string;
}

export function ConsentModal({
  isOpen,
  onClose,
  onSuccess,
  title,
  description,
  requiredCode = '5678', // Default parent code
}: ConsentModalProps) {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { t } = useLanguage();
  const { addAuditEntry, currentUser } = useAuth();

  const handleVerify = async () => {
    setIsVerifying(true);
    setError('');

    // Simulate verification delay
    await new Promise((resolve) => setTimeout(resolve, 600));

    if (code === requiredCode) {
      addAuditEntry({
        action: 'consent_granted',
        targetUser: currentUser?.name,
        details: `Parental consent verified for: ${title}`,
        facility: 'EMEC App',
      });
      onSuccess();
      setCode('');
      onClose();
    } else {
      setError('Invalid consent code. Please try again.');
      addAuditEntry({
        action: 'consent_failed',
        targetUser: currentUser?.name,
        details: `Failed consent attempt for: ${title}`,
        facility: 'EMEC App',
      });
    }

    setIsVerifying(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-warning/20 flex items-center justify-center">
              <Lock className="w-6 h-6 text-warning" />
            </div>
            <div>
              <DialogTitle className="text-xl">{title}</DialogTitle>
              <DialogDescription>{description}</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-center gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0" />
            <p className="text-sm text-warning-foreground">
              This section is restricted for underage users. Parent approval required.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="consent-code" className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Parent/Guardian Consent Code
            </Label>
            <Input
              id="consent-code"
              type="password"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter 4-digit code"
              maxLength={4}
              className="text-center text-xl tracking-[0.5em] font-mono"
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
            <p className="text-xs text-muted-foreground text-center">
              Demo code: 5678 (Parent)
            </p>
          </div>

          {error && (
            <p className="text-destructive text-sm text-center animate-fade-in">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleVerify}
              disabled={!code || isVerifying}
              className="flex-1"
            >
              {isVerifying ? (
                <span className="flex items-center gap-2">
                  <Lock className="w-4 h-4 animate-pulse" />
                  Verifying...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4" />
                  Verify & Unlock
                </span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
