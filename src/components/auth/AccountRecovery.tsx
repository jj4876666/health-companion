import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { 
  KeyRound, Mail, Phone, Shield, CheckCircle, 
  ArrowRight, ArrowLeft, AlertTriangle, User
} from 'lucide-react';

interface AccountRecoveryProps {
  isOpen: boolean;
  onClose: () => void;
}

type Step = 'identify' | 'verify' | 'reset' | 'success' | 'child-pending';

export function AccountRecovery({ isOpen, onClose }: AccountRecoveryProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<Step>('identify');
  const [emecId, setEmecId] = useState('');
  const [recoveryMethod, setRecoveryMethod] = useState<'sms' | 'email'>('sms');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isChildAccount, setIsChildAccount] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');

  // Demo data
  const DEMO_OTP = '847291';

  const handleIdentify = async () => {
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if it's a child account (demo: starts with K or F for Kevin/Faith)
    const isChild = emecId.toUpperCase().startsWith('K') || emecId.toUpperCase().startsWith('F');
    setIsChildAccount(isChild);

    if (isChild) {
      setIsLoading(false);
      setStep('child-pending');
      return;
    }

    // Generate and "send" OTP
    const newOtp = DEMO_OTP;
    setGeneratedOtp(newOtp);
    
    toast({
      title: '📱 OTP Sent',
      description: `A verification code has been sent to your ${recoveryMethod === 'sms' ? 'phone' : 'email'}.`,
    });

    setIsLoading(false);
    setStep('verify');
  };

  const handleVerifyOtp = async () => {
    setError('');
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (otp === generatedOtp || otp === DEMO_OTP) {
      setIsLoading(false);
      setStep('reset');
    } else {
      setError('Invalid OTP. Please try again.');
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));

    toast({
      title: '✅ Password Reset Successful',
      description: 'Your password has been updated. You can now login.',
    });

    setIsLoading(false);
    setStep('success');
  };

  const handleClose = () => {
    setStep('identify');
    setEmecId('');
    setOtp('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setIsChildAccount(false);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <DialogTitle className="text-xl">Account Recovery</DialogTitle>
          <DialogDescription>
            {step === 'identify' && 'Enter your EMEC ID to recover your account'}
            {step === 'verify' && 'Enter the verification code sent to you'}
            {step === 'reset' && 'Create a new password for your account'}
            {step === 'success' && 'Your password has been reset successfully'}
            {step === 'child-pending' && 'Parental approval required'}
          </DialogDescription>
        </DialogHeader>

        {/* Step Indicator */}
        {step !== 'success' && step !== 'child-pending' && (
          <div className="flex justify-center gap-2 py-2">
            {['identify', 'verify', 'reset'].map((s, i) => (
              <div
                key={s}
                className={`w-3 h-3 rounded-full transition-colors ${
                  step === s ? 'bg-primary' : 
                  ['identify', 'verify', 'reset'].indexOf(step) > i ? 'bg-success' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        )}

        {/* Step: Identify */}
        {step === 'identify' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="emec-id" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                EMEC ID
              </Label>
              <Input
                id="emec-id"
                value={emecId}
                onChange={(e) => setEmecId(e.target.value.toUpperCase())}
                placeholder="e.g., AJM2025B002"
                className="text-center font-mono tracking-widest"
                maxLength={11}
              />
            </div>

            <div className="space-y-2">
              <Label>Recovery Method</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={recoveryMethod === 'sms' ? 'default' : 'outline'}
                  onClick={() => setRecoveryMethod('sms')}
                  className="gap-2"
                >
                  <Phone className="w-4 h-4" />
                  SMS
                </Button>
                <Button
                  type="button"
                  variant={recoveryMethod === 'email' ? 'default' : 'outline'}
                  onClick={() => setRecoveryMethod('email')}
                  className="gap-2"
                >
                  <Mail className="w-4 h-4" />
                  Email
                </Button>
              </div>
            </div>

            <Button
              onClick={handleIdentify}
              disabled={emecId.length !== 11 || isLoading}
              className="w-full"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}

        {/* Step: Verify OTP */}
        {step === 'verify' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit code"
                className="text-center text-2xl tracking-widest font-mono"
                maxLength={6}
              />
            </div>

            {/* Demo hint */}
            <div className="p-3 rounded-lg bg-muted/50 text-sm">
              <p className="text-muted-foreground">
                <Shield className="w-4 h-4 inline mr-2 text-primary" />
                Demo OTP: <strong className="text-foreground">{DEMO_OTP}</strong>
              </p>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('identify')} className="flex-1">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <Button
                onClick={handleVerifyOtp}
                disabled={otp.length !== 6 || isLoading}
                className="flex-1"
              >
                {isLoading ? 'Verifying...' : 'Verify'}
              </Button>
            </div>
          </div>
        )}

        {/* Step: Reset Password */}
        {step === 'reset' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>New Password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>

            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleResetPassword}
              disabled={!newPassword || !confirmPassword || isLoading}
              className="w-full"
            >
              {isLoading ? 'Resetting...' : 'Reset Password'}
            </Button>
          </div>
        )}

        {/* Step: Success */}
        {step === 'success' && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Password Reset Complete!</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You can now login with your new password.
              </p>
            </div>
            <Button onClick={handleClose} className="w-full">
              Return to Login
            </Button>
          </div>
        )}

        {/* Step: Child Account - Pending Parent Approval */}
        {step === 'child-pending' && (
          <div className="text-center space-y-4 py-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 flex items-center justify-center">
              <Shield className="w-8 h-8 text-amber-500" />
            </div>
            <div>
              <Badge className="mb-3 bg-amber-500">Child Account Detected</Badge>
              <h3 className="font-semibold text-lg">Parental Approval Required</h3>
              <p className="text-sm text-muted-foreground mt-1">
                A password reset request has been sent to your parent/guardian.
                They will receive a notification to approve or deny this request.
              </p>
            </div>
            <Alert className="text-left bg-amber-50 dark:bg-amber-950/20 border-amber-300">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-700 dark:text-amber-300">
                For safety, child accounts require parent approval for password resets.
                Please contact your parent or guardian.
              </AlertDescription>
            </Alert>
            <Button onClick={handleClose} variant="outline" className="w-full">
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
