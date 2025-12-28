import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, Clock, CheckCircle, XCircle, AlertTriangle, 
  User, Building2, Key, Send
} from 'lucide-react';

interface ConsentRequest {
  id: string;
  patientName: string;
  patientEmecId: string;
  adminName: string;
  facilityName: string;
  code: string;
  expiresAt: Date;
  status: 'pending' | 'approved' | 'rejected' | 'expired';
  fieldToChange?: string;
  oldValue?: string;
  newValue?: string;
}

interface ConsentWorkflowProps {
  mode: 'admin' | 'patient';
  patientEmecId?: string;
  onCodeGenerated?: (code: string) => void;
  onApprove?: (requestId: string) => void;
  onReject?: (requestId: string) => void;
}

export function ConsentWorkflow({ 
  mode, 
  patientEmecId,
  onCodeGenerated,
  onApprove,
  onReject 
}: ConsentWorkflowProps) {
  const { toast } = useToast();
  const [emecIdInput, setEmecIdInput] = useState(patientEmecId || '');
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes in seconds
  const [isCodeActive, setIsCodeActive] = useState(false);
  const [pendingRequests, setPendingRequests] = useState<ConsentRequest[]>([]);

  // Demo pending requests for patient view
  useEffect(() => {
    if (mode === 'patient') {
      setPendingRequests([
        {
          id: 'consent-001',
          patientName: 'Kevin Otieno',
          patientEmecId: 'KOT2025A001',
          adminName: 'Dr. Omondi Wekesa',
          facilityName: 'Mbita Sub-County Hospital',
          code: '847291',
          expiresAt: new Date(Date.now() + 240000),
          status: 'pending',
          fieldToChange: 'Blood Group',
          oldValue: 'O+',
          newValue: 'A+',
        },
      ]);
    }
  }, [mode]);

  // Countdown timer
  useEffect(() => {
    if (isCodeActive && timeRemaining > 0) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsCodeActive(false);
            setGeneratedCode(null);
            toast({
              title: 'Code Expired',
              description: 'The consent code has expired. Generate a new one.',
              variant: 'destructive',
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [isCodeActive, timeRemaining, toast]);

  const generateConsentCode = () => {
    if (!emecIdInput) {
      toast({
        title: 'EMEC ID Required',
        description: 'Please enter the patient\'s EMEC ID',
        variant: 'destructive',
      });
      return;
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedCode(code);
    setTimeRemaining(300);
    setIsCodeActive(true);
    onCodeGenerated?.(code);

    toast({
      title: 'Consent Code Generated',
      description: `Code ${code} has been sent to patient for approval`,
    });
  };

  const handleApprove = (requestId: string) => {
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'approved' as const } : r))
    );
    onApprove?.(requestId);
    toast({
      title: 'Change Approved',
      description: 'The medical record update has been approved',
    });
  };

  const handleReject = (requestId: string) => {
    setPendingRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'rejected' as const } : r))
    );
    onReject?.(requestId);
    toast({
      title: 'Change Rejected',
      description: 'The medical record update has been rejected',
      variant: 'destructive',
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (mode === 'admin') {
    return (
      <Card className="border-2 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            Patient Consent Request
          </CardTitle>
          <CardDescription>
            Generate a 5-minute consent code for patient approval
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Patient EMEC ID
            </label>
            <div className="flex gap-2">
              <Input
                value={emecIdInput}
                onChange={(e) => setEmecIdInput(e.target.value.toUpperCase())}
                placeholder="Enter EMEC ID (e.g., KOT2025A001)"
                className="font-mono"
              />
              <Button onClick={generateConsentCode} disabled={isCodeActive}>
                <Send className="w-4 h-4 mr-2" />
                Request
              </Button>
            </div>
          </div>

          {isCodeActive && generatedCode && (
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center gap-2">
                  <Key className="w-4 h-4" />
                  Consent Code
                </span>
                <Badge variant={timeRemaining < 60 ? 'destructive' : 'default'}>
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(timeRemaining)}
                </Badge>
              </div>
              
              <div className="text-center py-4">
                <span className="text-4xl font-mono font-bold tracking-widest text-primary">
                  {generatedCode}
                </span>
              </div>

              <Progress 
                value={(timeRemaining / 300) * 100} 
                className="h-2"
              />

              <p className="text-xs text-muted-foreground text-center">
                Code expires in {formatTime(timeRemaining)}. Patient must approve within this time.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Patient view
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Pending Record Changes
        </CardTitle>
        <CardDescription>
          Review and approve/reject changes requested by health facilities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingRequests.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckCircle className="w-12 h-12 mx-auto mb-2 text-green-500" />
            <p>No pending consent requests</p>
          </div>
        ) : (
          pendingRequests.map((request) => (
            <div
              key={request.id}
              className={`p-4 rounded-lg border-2 ${
                request.status === 'pending'
                  ? 'border-amber-300 bg-amber-50 dark:bg-amber-900/20'
                  : request.status === 'approved'
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20'
                  : 'border-red-300 bg-red-50 dark:bg-red-900/20'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 font-medium">
                    <Building2 className="w-4 h-4" />
                    {request.facilityName}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Requested by: {request.adminName}
                  </p>
                </div>
                <Badge
                  variant={
                    request.status === 'pending'
                      ? 'outline'
                      : request.status === 'approved'
                      ? 'default'
                      : 'destructive'
                  }
                >
                  {request.status.toUpperCase()}
                </Badge>
              </div>

              {request.fieldToChange && (
                <div className="p-3 bg-white dark:bg-card rounded border mb-3">
                  <p className="text-sm font-medium mb-2">Requested Change:</p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{request.fieldToChange}:</span>
                    <Badge variant="secondary">{request.oldValue}</Badge>
                    <span>→</span>
                    <Badge>{request.newValue}</Badge>
                  </div>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-green-500 text-green-600 hover:bg-green-50"
                    onClick={() => handleApprove(request.id)}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-red-500 text-red-600 hover:bg-red-50"
                    onClick={() => handleReject(request.id)}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
