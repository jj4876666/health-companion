import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { AdminUser } from '@/types/emec';
import { useToast } from '@/hooks/use-toast';
import { 
  Lock, Shield, KeyRound, Fingerprint, AlertTriangle, 
  Clock, CheckCircle, XCircle, Siren, Eye, EyeOff
} from 'lucide-react';

interface SecurityAccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (success: boolean, isEmergency?: boolean) => void;
  patientEmecId: string;
}

export function SecurityAccessModal({
  isOpen,
  onClose,
  onSuccess,
  patientEmecId,
}: SecurityAccessModalProps) {
  const { addAuditEntry, currentUser } = useAuth();
  const { toast } = useToast();
  
  const [consentCode, setConsentCode] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [emergencyReason, setEmergencyReason] = useState('');
  const [showEmergencyConfirm, setShowEmergencyConfirm] = useState(false);

  // Demo codes
  const DEMO_CONSENT_CODE = '123456';
  const DEMO_PIN = '1234';
  const MAX_ATTEMPTS = 3;
  const LOCKOUT_DURATION = 30; // seconds

  // Lockout timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setIsLocked(false);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTime]);

  const handleVerify = async () => {
    if (isLocked) {
      toast({
        variant: 'destructive',
        title: 'Account Locked',
        description: `Please wait ${lockoutTime} seconds before trying again.`,
      });
      return;
    }

    setError('');
    setIsVerifying(true);

    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (consentCode === DEMO_CONSENT_CODE && pin === DEMO_PIN) {
      addAuditEntry({
        userId: currentUser?.id || '',
        userName: currentUser?.name || '',
        userRole: currentUser?.role || 'admin',
        action: 'ACCESS_GRANTED',
        target: `Patient ${patientEmecId}`,
        details: 'Consent code and PIN verified successfully',
        facilityName: (currentUser as AdminUser)?.facilityName,
      });

      setIsVerifying(false);
      resetForm();
      onSuccess(true, false);
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);

      addAuditEntry({
        userId: currentUser?.id || '',
        userName: currentUser?.name || '',
        userRole: currentUser?.role || 'admin',
        action: 'ACCESS_DENIED',
        target: `Patient ${patientEmecId}`,
        details: `Invalid credentials (Attempt ${newAttempts}/${MAX_ATTEMPTS})`,
        facilityName: (currentUser as AdminUser)?.facilityName,
      });

      if (newAttempts >= MAX_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(LOCKOUT_DURATION);
        setError(`Too many failed attempts. Locked for ${LOCKOUT_DURATION} seconds.`);
        
        toast({
          variant: 'destructive',
          title: '🔒 Account Locked',
          description: 'Too many failed attempts. This incident has been logged.',
        });
      } else {
        setError(`Invalid code or PIN. ${MAX_ATTEMPTS - newAttempts} attempts remaining.`);
      }

      setIsVerifying(false);
      onSuccess(false);
    }
  };

  const handleEmergencyOverride = async () => {
    if (!emergencyReason.trim()) {
      setError('Please provide a reason for emergency access');
      return;
    }

    setIsVerifying(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    addAuditEntry({
      userId: currentUser?.id || '',
      userName: currentUser?.name || '',
      userRole: currentUser?.role || 'admin',
      action: 'EMERGENCY_OVERRIDE',
      target: `Patient ${patientEmecId}`,
      details: `Emergency access granted. Reason: ${emergencyReason}`,
      facilityName: (currentUser as AdminUser)?.facilityName,
    });

    toast({
      title: '⚠️ Emergency Override Activated',
      description: 'Time-limited access granted. Patient will be notified.',
    });

    setIsVerifying(false);
    resetForm();
    onSuccess(true, true);
  };

  const resetForm = () => {
    setConsentCode('');
    setPin('');
    setError('');
    setEmergencyReason('');
    setShowEmergencyConfirm(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Secure Access Verification</DialogTitle>
          <DialogDescription>
            Two-factor authentication required to access patient records
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="standard" className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="standard" className="gap-2">
              <KeyRound className="w-4 h-4" />
              Standard
            </TabsTrigger>
            <TabsTrigger value="emergency" className="gap-2 text-destructive">
              <Siren className="w-4 h-4" />
              Emergency
            </TabsTrigger>
          </TabsList>

          {/* Standard Access */}
          <TabsContent value="standard" className="space-y-4 mt-4">
            {isLocked && (
              <Alert variant="destructive">
                <Lock className="h-4 w-4" />
                <AlertDescription className="flex items-center justify-between">
                  <span>Account locked</span>
                  <Badge variant="destructive">{lockoutTime}s</Badge>
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="consent-code" className="flex items-center gap-2">
                <KeyRound className="w-4 h-4" />
                Consent Code (from patient)
              </Label>
              <Input
                id="consent-code"
                value={consentCode}
                onChange={(e) => setConsentCode(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="text-center text-xl tracking-widest font-mono"
                disabled={isLocked}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pin" className="flex items-center gap-2">
                <Fingerprint className="w-4 h-4" />
                Access PIN
              </Label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                  placeholder="Enter 4-digit PIN"
                  maxLength={4}
                  className="text-center text-xl tracking-widest font-mono pr-10"
                  disabled={isLocked}
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Demo hint */}
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <Shield className="w-4 h-4 text-primary" />
                Demo: Consent <strong>123456</strong>, PIN <strong>1234</strong>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button
                onClick={handleVerify}
                disabled={consentCode.length !== 6 || pin.length !== 4 || isVerifying || isLocked}
                className="flex-1"
              >
                {isVerifying ? (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 animate-pulse" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Verify Access
                  </span>
                )}
              </Button>
            </div>
          </TabsContent>

          {/* Emergency Override */}
          <TabsContent value="emergency" className="space-y-4 mt-4">
            <Alert className="border-orange-500 bg-orange-50 dark:bg-orange-950/20">
              <Siren className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-700 dark:text-orange-300">
                Emergency override grants limited access (15 minutes) and notifies the patient.
                All actions are logged for review.
              </AlertDescription>
            </Alert>

            {!showEmergencyConfirm ? (
              <>
                <div className="space-y-2">
                  <Label>Reason for Emergency Access</Label>
                  <textarea
                    value={emergencyReason}
                    onChange={(e) => setEmergencyReason(e.target.value)}
                    placeholder="Describe the medical emergency requiring immediate access..."
                    className="w-full h-24 px-3 py-2 rounded-md border border-input bg-background text-sm resize-none"
                  />
                </div>

                <Button
                  variant="destructive"
                  onClick={() => setShowEmergencyConfirm(true)}
                  disabled={!emergencyReason.trim()}
                  className="w-full"
                >
                  <Siren className="w-4 h-4 mr-2" />
                  Request Emergency Override
                </Button>
              </>
            ) : (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Confirm Emergency Access</strong>
                    <br />
                    This action will be reviewed by hospital administration.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setShowEmergencyConfirm(false)} className="flex-1">
                    <XCircle className="w-4 h-4 mr-2" />
                    Go Back
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleEmergencyOverride}
                    disabled={isVerifying}
                    className="flex-1"
                  >
                    {isVerifying ? 'Processing...' : 'Confirm Override'}
                  </Button>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
