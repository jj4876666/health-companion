import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { 
  KeyRound, Mail, CheckCircle, ArrowLeft, AlertTriangle, Loader2
} from 'lucide-react';

interface AccountRecoveryProps {
  isOpen?: boolean;
  onClose?: () => void;
  onBack?: () => void;
}

export function AccountRecovery({ onBack }: AccountRecoveryProps) {
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = async () => {
    setError('');
    if (!email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
    toast({
      title: '📧 Reset Email Sent',
      description: 'Check your inbox for a password reset link.',
    });
  };

  if (sent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="w-full max-w-md space-y-6 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-xl font-semibold">Check Your Email</h2>
          <p className="text-sm text-muted-foreground">
            We sent a password reset link to <strong>{email}</strong>. 
            Click the link in the email to set a new password.
          </p>
          <Button variant="outline" onClick={onBack} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Reset Password</h2>
          <p className="text-sm text-muted-foreground">
            Enter the email address linked to your account
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email" className="flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email Address
            </Label>
            <Input
              id="reset-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              onKeyDown={(e) => e.key === 'Enter' && handleReset()}
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleReset} disabled={isLoading || !email} className="w-full gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            {isLoading ? 'Sending...' : 'Send Reset Link'}
          </Button>

          <Button variant="ghost" onClick={onBack} className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </Button>
        </div>
      </div>
    </div>
  );
}
