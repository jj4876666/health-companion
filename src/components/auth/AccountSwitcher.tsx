import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole } from '@/types/emec';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Users, Shield, ArrowRightLeft, Lock, CheckCircle, AlertCircle, Baby, Stethoscope } from 'lucide-react';
import { allDemoUsers, validateEmecLogin } from '@/data/demoUsers';

const roleIcons: Record<UserRole, React.ElementType> = {
  child: Baby,
  parent: Users,
  adult: User,
  admin: Shield,
};

const roleLabels: Record<UserRole, string> = {
  child: 'Child Account',
  parent: 'Parent Account',
  adult: 'Adult Patient',
  admin: 'Admin/Healthcare Provider',
};

interface AccountSwitcherProps {
  trigger?: React.ReactNode;
}

export function AccountSwitcher({ trigger }: AccountSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [emecId, setEmecId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [verifiedUser, setVerifiedUser] = useState<typeof allDemoUsers[0] | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const { currentUser, loginWithEmecId } = useAuth();
  const { t } = useLanguage();

  const availableAccounts = allDemoUsers.filter(user => user.role !== currentUser?.role);

  const handleEmecLookup = () => {
    if (!emecId.trim()) {
      setError('Please enter your EMEC ID');
      return;
    }

    setIsVerifying(true);
    
    setTimeout(() => {
      const foundUser = allDemoUsers.find(u => u.emecId.toLowerCase() === emecId.toLowerCase());
      
      if (foundUser) {
        setVerifiedUser(foundUser);
        setError('');
      } else {
        setError('EMEC ID not found in system');
        setVerifiedUser(null);
      }
      setIsVerifying(false);
    }, 800);
  };

  const handleSwitch = async () => {
    if (!verifiedUser) {
      setError('Please verify your EMEC ID first');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    const validatedUser = validateEmecLogin(emecId, password);
    
    if (!validatedUser) {
      setError('Invalid password for this EMEC ID');
      return;
    }

    const success = loginWithEmecId(emecId, password);
    
    if (success) {
      handleClose();
    } else {
      setError('Failed to switch account');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEmecId('');
    setPassword('');
    setError('');
    setVerifiedUser(null);
    setIsVerifying(false);
  };

  const handleQuickSelect = (user: typeof allDemoUsers[0]) => {
    setEmecId(user.emecId);
    setVerifiedUser(user);
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) handleClose();
      else setOpen(true);
    }}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            {t('auth.switchAccount')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            EMEC Account Verification
          </DialogTitle>
          <DialogDescription>
            Currently logged in as: <strong>{currentUser?.name}</strong>
            <br />
            <span className="font-mono text-xs">{currentUser?.emecId}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Demo Accounts Quick Select */}
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Demo Accounts (Click to select)</Label>
            <div className="grid gap-2 max-h-48 overflow-y-auto pr-1">
              {availableAccounts.map((user) => {
                const Icon = roleIcons[user.role];
                const isSelected = verifiedUser?.emecId === user.emecId;
                
                return (
                  <button
                    key={user.id}
                    onClick={() => handleQuickSelect(user)}
                    className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${
                      isSelected 
                        ? 'border-primary bg-primary/10' 
                        : 'border-border hover:border-primary/50 hover:bg-muted/50'
                    }`}
                  >
                    <div className={`p-2 rounded-full ${
                      isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{roleLabels[user.role]}</p>
                      <p className="text-xs font-mono text-primary">{user.emecId}</p>
                    </div>
                    {isSelected && (
                      <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual EMEC ID Entry */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or enter manually</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="emec-id">EMEC ID</Label>
              <div className="flex gap-2">
                <Input
                  id="emec-id"
                  placeholder="e.g., KOT2025A001"
                  value={emecId}
                  onChange={(e) => {
                    setEmecId(e.target.value.toUpperCase());
                    setVerifiedUser(null);
                    setError('');
                  }}
                  className="font-mono"
                />
                <Button 
                  variant="secondary" 
                  onClick={handleEmecLookup}
                  disabled={isVerifying}
                  size="sm"
                >
                  {isVerifying ? '...' : 'Verify'}
                </Button>
              </div>
            </div>

            {/* Verified User Display */}
            {verifiedUser && (
              <div className="p-3 rounded-lg bg-primary/10 border border-primary/30 space-y-2">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle className="h-4 w-4" />
                  <span className="text-sm font-medium">Account Verified</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Name:</span>
                    <p className="font-medium text-sm">{verifiedUser.name}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Role:</span>
                    <p className="font-medium text-sm capitalize">{verifiedUser.role}</p>
                  </div>
                  {'bloodGroup' in verifiedUser && (verifiedUser as { bloodGroup?: string }).bloodGroup && (
                    <div>
                      <span className="text-muted-foreground text-xs">Blood:</span>
                      <p className="font-medium text-sm">{(verifiedUser as { bloodGroup: string }).bloodGroup}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground text-xs">Status:</span>
                    <p className="font-medium text-sm text-green-600">
                      {verifiedUser.isVerified ? '✓ Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Password Entry */}
            {verifiedUser && (
              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSwitch()}
                />
                <p className="text-xs text-muted-foreground">
                  Demo: kevin2025, grace2025, james2025, admin2025
                </p>
              </div>
            )}

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSwitch} 
            disabled={!verifiedUser || !password}
            className="gap-2"
          >
            <Stethoscope className="h-4 w-4" />
            Switch Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
