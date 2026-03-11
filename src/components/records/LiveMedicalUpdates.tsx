import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  FileText, Activity, Pill, ClipboardList, AlertTriangle, 
  Stethoscope, Syringe, RefreshCw
} from 'lucide-react';

interface MedicalUpdateData {
  [key: string]: string | number | boolean;
}

interface MedicalUpdate {
  id: string;
  update_type: string;
  title: string;
  data: MedicalUpdateData;
  officer_name: string | null;
  facility_name: string | null;
  created_at: string;
}

interface Props {
  profileId: string;
}

export function LiveMedicalUpdates({ profileId }: Props) {
  const [updates, setUpdates] = useState<MedicalUpdate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUpdates = async () => {
    const { data } = await supabase
      .from('medical_updates')
      .select('*')
      .eq('patient_id', profileId)
      .order('created_at', { ascending: false });
    setUpdates(data || []);
    setLoading(false);
  };

  useEffect(() => {
    if (!profileId) return;
    fetchUpdates();

    // Realtime subscription
    const channel = supabase
      .channel(`medical_updates_${profileId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'medical_updates',
          filter: `patient_id=eq.${profileId}`,
        },
        (payload) => {
          setUpdates(prev => [payload.new as MedicalUpdate, ...prev]);
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [profileId, fetchUpdates]);

  const getIcon = (type: string) => {
    const icons: Record<string, typeof Activity> = {
      vitals: Activity,
      blood_sugar: Activity,
      medication: Pill,
      clinical_note: ClipboardList,
      lab_result: FileText,
      allergy: AlertTriangle,
      condition: Stethoscope,
      immunization: Syringe,
    };
    return icons[type] || FileText;
  };

  const getColor = (type: string) => {
    const colors: Record<string, string> = {
      vitals: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
      blood_sugar: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
      medication: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
      clinical_note: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400',
      lab_result: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
      allergy: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
      condition: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400',
      immunization: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    };
    return colors[type] || 'bg-muted text-muted-foreground';
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
          Loading medical updates...
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Medical Updates
          <Badge variant="secondary">{updates.length}</Badge>
          <Badge variant="outline" className="ml-auto text-xs bg-green-50 text-green-700 border-green-300">
            ● Live
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {updates.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p className="font-medium">No medical updates yet</p>
            <p className="text-sm">Updates from your health officer will appear here in real-time</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {updates.map((update) => {
                const Icon = getIcon(update.update_type);
                return (
                  <div key={update.id} className="p-4 rounded-lg border transition-all animate-in fade-in slide-in-from-top-2">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${getColor(update.update_type)}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="font-semibold">{update.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {update.update_type.replace('_', ' ')} • {update.officer_name || 'Unknown'} • {update.facility_name || ''}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(update.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {Object.entries(update.data as Record<string, string>).map(([key, value]) => (
                        value && (
                          <div key={key} className="p-2 bg-muted/50 rounded text-sm">
                            <span className="text-muted-foreground capitalize">{key.replace(/_/g, ' ')}: </span>
                            <span className="font-medium">{value}</span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
