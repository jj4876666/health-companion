import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, Eye, Edit, Lock, AlertTriangle, CheckCircle, 
  XCircle, Building2, User, Clock, Siren
} from 'lucide-react';
import { format } from 'date-fns';
import { AuditLogEntry } from '@/types/emec';

interface RecordAccessLogProps {
  auditLog: AuditLogEntry[];
}

export function RecordAccessLog({ auditLog }: RecordAccessLogProps) {
  const getActionIcon = (action: string) => {
    if (action.includes('VIEW')) return <Eye className="w-4 h-4 text-blue-500" />;
    if (action.includes('EDIT') || action.includes('UPDATE')) return <Edit className="w-4 h-4 text-orange-500" />;
    if (action.includes('GRANTED') || action.includes('APPROVE')) return <CheckCircle className="w-4 h-4 text-success" />;
    if (action.includes('DENIED') || action.includes('REJECT')) return <XCircle className="w-4 h-4 text-destructive" />;
    if (action.includes('EMERGENCY')) return <Siren className="w-4 h-4 text-orange-500" />;
    if (action.includes('CONSENT')) return <Lock className="w-4 h-4 text-primary" />;
    return <History className="w-4 h-4 text-muted-foreground" />;
  };

  const getActionBadgeVariant = (action: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
    if (action.includes('GRANTED') || action.includes('APPROVE')) return 'default';
    if (action.includes('DENIED') || action.includes('REJECT')) return 'destructive';
    if (action.includes('EMERGENCY')) return 'destructive';
    return 'secondary';
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="w-5 h-5 text-primary" />
          Access Log
        </CardTitle>
        <CardDescription>
          Complete audit trail of all record access and modifications
        </CardDescription>
      </CardHeader>
      <CardContent>
        {auditLog.length === 0 ? (
          <div className="text-center py-8">
            <Lock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">No access records yet</p>
            <p className="text-sm text-muted-foreground">All access attempts will be logged here</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {auditLog.map((entry, index) => (
                <div
                  key={entry.id || index}
                  className={`p-4 rounded-lg border transition-colors ${
                    entry.action.includes('DENIED') || entry.action.includes('REJECT')
                      ? 'border-destructive/30 bg-destructive/5'
                      : entry.action.includes('EMERGENCY')
                      ? 'border-orange-500/30 bg-orange-50 dark:bg-orange-950/20'
                      : 'border-border bg-muted/30'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {getActionIcon(entry.action)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Badge variant={getActionBadgeVariant(entry.action)} className="mb-2">
                            {formatAction(entry.action)}
                          </Badge>
                          <p className="text-sm font-medium">{entry.details}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {format(new Date(entry.timestamp), 'dd/MM/yyyy HH:mm')}
                        </span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entry.userName}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {entry.userRole}
                        </Badge>
                        {entry.facilityName && (
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3 h-3" />
                            {entry.facilityName}
                          </span>
                        )}
                      </div>

                      {entry.action.includes('EMERGENCY') && (
                        <div className="mt-2 p-2 rounded bg-orange-100 dark:bg-orange-900/30 text-xs text-orange-700 dark:text-orange-300">
                          <AlertTriangle className="w-3 h-3 inline mr-1" />
                          Emergency override - Review required
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
