import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { UserRole } from '@/types/emec';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Users, Shield, ArrowRightLeft, Lock } from 'lucide-react';

const roleOptions: { role: UserRole; label: string; icon: typeof User; pin: string }[] = [
  { role: 'child', label: 'Kevin Otieno (Child)', icon: User, pin: '1234' },
  { role: 'parent', label: 'Grace Achieng (Parent)', icon: Users, pin: '5678' },
  { role: 'admin', label: 'Demo Admin (Health Officer)', icon: Shield, pin: '9999' },
];

interface AccountSwitcherProps {
  trigger?: React.ReactNode;
}

export function AccountSwitcher({ trigger }: AccountSwitcherProps) {
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  
  const { currentUser, switchAccount } = useAuth();
  const { t } = useLanguage();

  const handleSwitch = () => {
    if (!selectedRole || !pin) {
      setError('Please select account and enter PIN');
      return;
    }

    const success = switchAccount(selectedRole, pin);
    
    if (success) {
      setOpen(false);
      setSelectedRole(null);
      setPin('');
      setError('');
    } else {
      setError(t('auth.wrongPin'));
      setPin('');
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedRole(null);
    setPin('');
    setError('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2">
            <ArrowRightLeft className="w-4 h-4" />
            {t('auth.switchAccount')}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5" />
            {t('auth.switchAccount')}
          </DialogTitle>
          <DialogDescription>
            Currently logged in as: <strong>{currentUser?.name}</strong>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Account Options */}
          <div className="space-y-2">
            {roleOptions
              .filter((option) => option.role !== currentUser?.role)
              .map((option) => {
                const Icon = option.icon;
                const isSelected = selectedRole === option.role;

                return (
                  <button
                    key={option.role}
                    onClick={() => {
                      setSelectedRole(option.role);
                      setError('');
                    }}
                    className={`w-full p-3 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{option.label}</p>
                      <p className="text-xs text-muted-foreground font-mono">PIN: {option.pin}</p>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* PIN Entry */}
          {selectedRole && (
            <div className="space-y-3 animate-fade-in">
              <Label htmlFor="switch-pin" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Enter PIN
              </Label>
              <Input
                id="switch-pin"
                type="password"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter 4-digit PIN"
                maxLength={4}
                className="text-center text-xl tracking-[0.5em] font-mono"
                onKeyDown={(e) => e.key === 'Enter' && handleSwitch()}
              />
              
              {error && (
                <p className="text-destructive text-sm text-center">{error}</p>
              )}

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleClose} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={handleSwitch} className="flex-1">
                  Switch
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
