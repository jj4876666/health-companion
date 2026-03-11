import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, Building2, CreditCard, Lock, Eye, EyeOff, 
  CheckCircle2, AlertTriangle, FileText 
} from 'lucide-react';

// Demo verification credentials
const DEMO_ADMIN_CREDENTIALS = {
  licenseNumber: 'KE-MED-2025-001',
  password: 'admin123',
};

interface AdminVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetPatientEmecId: string;
  targetPatientName: string;
  onVerified: () => void;
}

export function AdminVerificationModal({
  isOpen,
  onClose,
  targetPatientEmecId,
  targetPatientName,
  onVerified,
}: AdminVerificationModalProps) {
  const [step, setStep] = useState<'credentials' | 'verified'>('credentials');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerify = async () => {
    if (!licenseNumber || !adminPassword) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    setError('');

    // OPTIMIZED: Reduced delay from 1500ms to 300ms for faster admin verification
    await new Promise(resolve => setTimeout(resolve, 300));

    // Demo verification - accept the demo credentials
    if (
      licenseNumber === DEMO_ADMIN_CREDENTIALS.licenseNumber &&
      adminPassword === DEMO_ADMIN_CREDENTIALS.password
    ) {
      setStep('verified');
      setTimeout(() => {
        onVerified();
        onClose();
        resetForm();
      }, 1500);
    } else {
      setError('Invalid license number or password. Demo: KE-MED-2025-001 / admin123');
    }

    setIsLoading(false);
  };

  const resetForm = () => {
    setStep('credentials');
    setLicenseNumber('');
    setAdminPassword('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Admin Verification Required
          </DialogTitle>
          <DialogDescription>
            Enter your health facility credentials to access patient records
          </DialogDescription>
        </DialogHeader>

        {step === 'credentials' && (
          <div className="space-y-4 pt-2">
            {/* Target Patient Info */}
            <div className="p-3 rounded-lg bg-muted/50 border">
              <p className="text-xs text-muted-foreground mb-1">Accessing records for:</p>
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                <span className="font-medium">{targetPatientName}</span>
                <Badge variant="outline" className="font-mono text-xs">
                  {targetPatientEmecId}
                </Badge>
              </div>
            </div>

            {/* License Number */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Medical License Number
              </Label>
              <Input
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value.toUpperCase())}
                placeholder="e.g., KE-MED-2025-001"
                className="font-mono"
              />
            </div>

            {/* Admin Password */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Admin Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pr-10"
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Demo Hint */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs">
              <p className="font-medium text-amber-600 dark:text-amber-400 mb-1">🧪 Demo Credentials:</p>
              <p className="text-muted-foreground">
                License: <span className="font-mono text-foreground">KE-MED-2025-001</span>
                <br />
                Password: <span className="font-mono text-foreground">admin123</span>
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button onClick={handleVerify} disabled={isLoading} className="flex-1">
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <Lock className="w-4 h-4 animate-pulse" />
                    Verifying...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    Verify & Access
                  </span>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === 'verified' && (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-success/10 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-8 h-8 text-success" />
            </div>
            <h3 className="text-xl font-bold text-success">Verification Successful</h3>
            <p className="text-muted-foreground mt-2">
              Access granted to patient records. Redirecting...
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
