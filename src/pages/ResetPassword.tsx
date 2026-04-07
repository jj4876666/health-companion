import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { KeyRound, CheckCircle, AlertTriangle, Loader2, Eye, EyeOff } from 'lucide-react';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Listen for the PASSWORD_RECOVERY event from the URL hash
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    // Also check hash params directly
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async () => {
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 2000);
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Password Updated!</h2>
          <p className="text-sm text-muted-foreground">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isRecovery) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="w-full max-w-md text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-semibold">Invalid Reset Link</h2>
          <p className="text-sm text-muted-foreground">This link is expired or invalid. Please request a new password reset.</p>
          <Button onClick={() => navigate('/')} className="gap-2">Back to Login</Button>
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
          <h2 className="text-xl font-semibold">Set New Password</h2>
          <p className="text-sm text-muted-foreground">Enter your new password below</p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm password"
            />
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Button onClick={handleReset} disabled={isLoading || !password} className="w-full gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>
    </div>
  );
}
