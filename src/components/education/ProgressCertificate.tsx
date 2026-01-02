import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Award, Download, Share2, CheckCircle, Star, Calendar, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface ProgressCertificateProps {
  isOpen: boolean;
  onClose: () => void;
  topicTitle: string;
  topicIcon: string;
  completedSections: number;
  totalSections: number;
  userName?: string;
  completionDate: Date;
}

export function ProgressCertificate({
  isOpen,
  onClose,
  topicTitle,
  topicIcon,
  completedSections,
  totalSections,
  userName = "Health Learner",
  completionDate
}: ProgressCertificateProps) {
  const { toast } = useToast();
  const { language } = useLanguage();
  const [isSharing, setIsSharing] = useState(false);

  const lang = (language || 'en') as 'en' | 'sw' | 'fr';

  const translations = {
    en: {
      title: 'Certificate of Completion',
      awarded: 'This certificate is awarded to',
      completing: 'for successfully completing',
      sections: 'sections',
      date: 'Completion Date',
      share: 'Share Certificate',
      download: 'Download',
      copied: 'Certificate link copied!',
      shared: 'Opening share dialog...',
      emec: 'EMEC Health Education',
      verified: 'Verified by EMEC Platform'
    },
    sw: {
      title: 'Cheti cha Kukamilisha',
      awarded: 'Cheti hiki kinatolewa kwa',
      completing: 'kwa kukamilisha kwa mafanikio',
      sections: 'sehemu',
      date: 'Tarehe ya Kukamilisha',
      share: 'Shiriki Cheti',
      download: 'Pakua',
      copied: 'Kiungo cha cheti kimenakiliwa!',
      shared: 'Kufungua mazungumzo ya kushiriki...',
      emec: 'EMEC Elimu ya Afya',
      verified: 'Imethibitishwa na Jukwaa la EMEC'
    },
    fr: {
      title: 'Certificat de Réussite',
      awarded: 'Ce certificat est décerné à',
      completing: 'pour avoir terminé avec succès',
      sections: 'sections',
      date: 'Date de Réussite',
      share: 'Partager le Certificat',
      download: 'Télécharger',
      copied: 'Lien du certificat copié!',
      shared: 'Ouverture du dialogue de partage...',
      emec: 'EMEC Éducation Santé',
      verified: 'Vérifié par la Plateforme EMEC'
    }
  };

  const t = translations[lang];

  const handleShare = async () => {
    setIsSharing(true);
    
    const shareText = `🎓 I just earned a certificate for completing "${topicTitle}" on EMEC Health Education! ${topicIcon}\n\n✅ Completed ${completedSections}/${totalSections} sections\n📅 ${completionDate.toLocaleDateString()}\n\n#EMECHealth #HealthEducation #Learning`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.title} - ${topicTitle}`,
          text: shareText,
          url: window.location.href
        });
        toast({ title: t.shared });
      } catch (error) {
        // User cancelled or share failed, copy to clipboard instead
        await navigator.clipboard.writeText(shareText);
        toast({ title: t.copied });
      }
    } else {
      await navigator.clipboard.writeText(shareText);
      toast({ title: t.copied });
    }
    
    setIsSharing(false);
  };

  const handleDownload = () => {
    // Create a simple text certificate that can be printed
    const certificateText = `
╔════════════════════════════════════════════════════════════╗
║                                                            ║
║              🏆 ${t.title.toUpperCase()} 🏆              ║
║                                                            ║
╠════════════════════════════════════════════════════════════╣
║                                                            ║
║                     ${t.emec}                              ║
║                                                            ║
║           ${t.awarded}:                                    ║
║                                                            ║
║              ★  ${userName}  ★                             ║
║                                                            ║
║           ${t.completing}:                                 ║
║                                                            ║
║              ${topicIcon} ${topicTitle}                    ║
║                                                            ║
║           ${completedSections}/${totalSections} ${t.sections}                                    ║
║                                                            ║
║           ${t.date}: ${completionDate.toLocaleDateString()}║
║                                                            ║
║           ✓ ${t.verified}                                  ║
║                                                            ║
╚════════════════════════════════════════════════════════════╝
    `;

    const blob = new Blob([certificateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMEC_Certificate_${topicTitle.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Certificate Downloaded! 📜",
      description: "You can print this certificate for your records."
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden">
        {/* Certificate Design */}
        <div className="relative bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/50 dark:to-orange-950/50">
          {/* Decorative Border */}
          <div className="absolute inset-2 border-4 border-double border-amber-400/50 rounded-lg pointer-events-none" />
          
          {/* Corner Decorations */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-4 border-l-4 border-amber-500 rounded-tl-lg" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-4 border-r-4 border-amber-500 rounded-tr-lg" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-4 border-l-4 border-amber-500 rounded-bl-lg" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-4 border-r-4 border-amber-500 rounded-br-lg" />

          <div className="p-8 pt-10 text-center relative">
            {/* Header */}
            <div className="flex justify-center mb-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-xl animate-pulse">
                <Award className="w-10 h-10 text-white" />
              </div>
            </div>

            <Badge className="mb-3 bg-amber-500/20 text-amber-700 dark:text-amber-400 border-amber-500/30">
              <Sparkles className="w-3 h-3 mr-1" />
              {t.emec}
            </Badge>

            <DialogHeader className="text-center space-y-3">
              <DialogTitle className="text-2xl font-black text-amber-800 dark:text-amber-200 tracking-wide">
                {t.title}
              </DialogTitle>
              <DialogDescription className="text-amber-700 dark:text-amber-300">
                {t.awarded}
              </DialogDescription>
            </DialogHeader>

            {/* User Name */}
            <div className="my-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-full border-2 border-amber-300 dark:border-amber-700">
                <Star className="w-5 h-5 text-amber-600 fill-amber-400" />
                <span className="text-xl font-bold text-amber-900 dark:text-amber-100">{userName}</span>
                <Star className="w-5 h-5 text-amber-600 fill-amber-400" />
              </div>
            </div>

            <p className="text-sm text-amber-700 dark:text-amber-300 mb-3">{t.completing}</p>

            {/* Topic */}
            <Card className="p-4 bg-white/80 dark:bg-black/20 border-amber-200 dark:border-amber-800 mb-4">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{topicIcon}</span>
                <span className="text-lg font-bold text-amber-900 dark:text-amber-100">{topicTitle}</span>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 text-amber-700 dark:text-amber-300">
                <CheckCircle className="w-4 h-4 text-green-600" />
                <span className="text-sm">{completedSections}/{totalSections} {t.sections}</span>
              </div>
            </Card>

            {/* Date */}
            <div className="flex items-center justify-center gap-2 text-sm text-amber-600 dark:text-amber-400 mb-4">
              <Calendar className="w-4 h-4" />
              <span>{t.date}: {completionDate.toLocaleDateString()}</span>
            </div>

            {/* Verified Badge */}
            <Badge variant="outline" className="border-green-500/50 text-green-700 dark:text-green-400">
              <CheckCircle className="w-3 h-3 mr-1" />
              {t.verified}
            </Badge>
          </div>
        </div>

        {/* Actions */}
        <DialogFooter className="p-4 bg-muted/30 gap-2">
          <Button variant="outline" onClick={handleDownload} className="flex-1 gap-2">
            <Download className="w-4 h-4" />
            {t.download}
          </Button>
          <Button onClick={handleShare} disabled={isSharing} className="flex-1 gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
            <Share2 className="w-4 h-4" />
            {t.share}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
