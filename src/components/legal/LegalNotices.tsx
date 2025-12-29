import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, Shield, FileText, Heart, Scale, 
  Eye, Lock, CheckCircle, Info, ExternalLink
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface LegalNotice {
  id: string;
  icon: typeof AlertTriangle;
  title: { en: string; sw: string; fr: string };
  content: { en: string; sw: string; fr: string };
  type: 'warning' | 'info' | 'important';
}

const legalNotices: LegalNotice[] = [
  {
    id: 'educational',
    icon: AlertTriangle,
    title: {
      en: 'Educational & Awareness Only',
      sw: 'Elimu na Uhamasishaji Pekee',
      fr: 'Éducation et Sensibilisation Uniquement',
    },
    content: {
      en: 'EMEC is designed for health education and awareness purposes only. This app does NOT provide medical diagnosis, treatment recommendations, or prescriptions. Always consult a qualified healthcare professional for medical advice. In emergencies, call emergency services or visit your nearest health facility immediately.',
      sw: 'EMEC imeundwa kwa madhumuni ya elimu ya afya na uhamasishaji pekee. Programu hii HAITOI utambuzi wa kimatibabu, mapendekezo ya matibabu, au maagizo ya dawa. Daima wasiliana na mtaalamu wa afya aliyehitimu kwa ushauri wa kimatibabu. Katika dharura, piga simu kwa huduma za dharura au tembelea kituo cha afya kilicho karibu nawe mara moja.',
      fr: 'EMEC est conçu à des fins éducatives et de sensibilisation uniquement. Cette application NE fournit PAS de diagnostic médical, de recommandations de traitement ou de prescriptions. Consultez toujours un professionnel de la santé qualifié pour obtenir des conseils médicaux. En cas d\'urgence, appelez les services d\'urgence ou rendez-vous immédiatement à l\'établissement de santé le plus proche.',
    },
    type: 'warning',
  },
  {
    id: 'data-protection',
    icon: Lock,
    title: {
      en: 'Data Protection & Privacy',
      sw: 'Ulinzi wa Data na Faragha',
      fr: 'Protection des Données et Confidentialité',
    },
    content: {
      en: 'Your health information is confidential. The patient and/or parent/guardian is responsible for protecting their EMEC ID and password. Do not share your login credentials with anyone. EMEC uses encryption to protect your data, but you are ultimately responsible for maintaining the security of your account.',
      sw: 'Taarifa zako za afya ni za siri. Mgonjwa na/au mzazi/mlezi anawajibika kulinda EMEC ID yake na nenosiri. Usishiriki akreditesheni zako za kuingia na mtu yeyote. EMEC inatumia usimbaji fiche kulinda data yako, lakini wewe unawajibika mwishowe kudumisha usalama wa akaunti yako.',
      fr: 'Vos informations de santé sont confidentielles. Le patient et/ou le parent/tuteur est responsable de la protection de son identifiant EMEC et de son mot de passe. Ne partagez vos identifiants de connexion avec personne. EMEC utilise le cryptage pour protéger vos données, mais vous êtes ultimement responsable du maintien de la sécurité de votre compte.',
    },
    type: 'important',
  },
  {
    id: 'admin-records',
    icon: Shield,
    title: {
      en: 'Health Facility Admin Access',
      sw: 'Ufikiaji wa Msimamizi wa Kituo cha Afya',
      fr: 'Accès Administrateur des Établissements de Santé',
    },
    content: {
      en: 'Health Facility Administrators (Health Officers) can only update verified patient records after receiving proper consent. A temporary consent code valid for 5 minutes must be approved by the patient or their parent/guardian before any changes can be made. All admin actions are logged in the audit trail.',
      sw: 'Wasimamizi wa Vituo vya Afya (Maafisa wa Afya) wanaweza tu kusasisha rekodi zilizothibitishwa za mgonjwa baada ya kupokea idhini sahihi. Nambari ya idhini ya muda inayofanya kazi kwa dakika 5 lazima ikubaliwe na mgonjwa au mzazi/mlezi wake kabla ya mabadiliko yoyote kufanywa. Vitendo vyote vya msimamizi vimerekodiwa katika kumbukumbu za ukaguzi.',
      fr: 'Les administrateurs des établissements de santé (agents de santé) ne peuvent mettre à jour les dossiers de patients vérifiés qu\'après avoir reçu le consentement approprié. Un code de consentement temporaire valide 5 minutes doit être approuvé par le patient ou son parent/tuteur avant toute modification. Toutes les actions administratives sont enregistrées dans la piste d\'audit.',
    },
    type: 'info',
  },
  {
    id: 'child-accounts',
    icon: Heart,
    title: {
      en: 'Child Account Protection',
      sw: 'Ulinzi wa Akaunti ya Mtoto',
      fr: 'Protection des Comptes Enfants',
    },
    content: {
      en: 'Child accounts (ages 0-17) are linked to parent/guardian accounts. Parents have full visibility of their children\'s health information and must approve certain content access. Age-appropriate content filtering is applied automatically. Parents can view their child\'s activity and progress at any time.',
      sw: 'Akaunti za watoto (umri wa miaka 0-17) zimeunganishwa na akaunti za wazazi/walezi. Wazazi wana mwonekano kamili wa taarifa za afya za watoto wao na lazima wakubali ufikiaji wa maudhui fulani. Uchujaji wa maudhui unaofaa kwa umri unatumika kiotomatiki. Wazazi wanaweza kuona shughuli na maendeleo ya mtoto wao wakati wowote.',
      fr: 'Les comptes enfants (0-17 ans) sont liés aux comptes parents/tuteurs. Les parents ont une visibilité complète sur les informations de santé de leurs enfants et doivent approuver certains accès au contenu. Le filtrage de contenu adapté à l\'âge est appliqué automatiquement. Les parents peuvent voir l\'activité et les progrès de leur enfant à tout moment.',
    },
    type: 'info',
  },
  {
    id: 'ai-disclaimer',
    icon: Info,
    title: {
      en: 'AI Assistant Limitations',
      sw: 'Vikwazo vya Msaidizi wa AI',
      fr: 'Limitations de l\'Assistant IA',
    },
    content: {
      en: 'The AI Health Assistant provides general health information for educational purposes only. It is NOT a substitute for professional medical advice. The AI cannot diagnose conditions, prescribe medications, or provide treatment plans. Always verify information with a healthcare professional and seek immediate medical attention for emergencies.',
      sw: 'Msaidizi wa Afya wa AI hutoa habari za jumla za afya kwa madhumuni ya elimu pekee. SI mbadala wa ushauri wa kimatibabu wa kitaalamu. AI haiwezi kugundua hali, kuagiza dawa, au kutoa mipango ya matibabu. Daima thibitisha habari na mtaalamu wa afya na tafuta msaada wa kimatibabu mara moja kwa dharura.',
      fr: 'L\'Assistant Santé IA fournit des informations générales sur la santé à des fins éducatives uniquement. Ce n\'est PAS un substitut aux conseils médicaux professionnels. L\'IA ne peut pas diagnostiquer des conditions, prescrire des médicaments ou fournir des plans de traitement. Vérifiez toujours les informations auprès d\'un professionnel de la santé et consultez immédiatement pour les urgences.',
    },
    type: 'warning',
  },
];

export function LegalNotices() {
  const { language } = useLanguage();
  const lang = language as 'en' | 'sw' | 'fr';

  const getTypeStyles = (type: LegalNotice['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      case 'important':
        return 'bg-warning/10 border-warning/30 text-warning-foreground';
      case 'info':
      default:
        return 'bg-primary/10 border-primary/30 text-primary';
    }
  };

  return (
    <Card className="border-0 shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scale className="w-5 h-5" />
          {lang === 'sw' ? 'Notisi za Kisheria' : lang === 'fr' ? 'Mentions Légales' : 'Legal Notices'}
        </CardTitle>
        <CardDescription>
          {lang === 'sw' 
            ? 'Taarifa muhimu kuhusu matumizi ya EMEC' 
            : lang === 'fr'
            ? 'Informations importantes sur l\'utilisation d\'EMEC'
            : 'Important information about using EMEC'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {legalNotices.map((notice) => {
            const Icon = notice.icon;
            return (
              <AccordionItem key={notice.id} value={notice.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${getTypeStyles(notice.type)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-left font-medium">{notice.title[lang]}</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className={`p-4 rounded-lg border ${getTypeStyles(notice.type)}`}>
                    <p className="text-sm leading-relaxed">{notice.content[lang]}</p>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}

export function LegalBanner() {
  const { language } = useLanguage();
  
  return (
    <div className="p-3 rounded-lg bg-warning/10 border border-warning/30 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
      <div className="text-sm">
        <p className="font-medium text-warning-foreground">
          {language === 'sw' 
            ? 'Onyo Muhimu' 
            : language === 'fr' 
            ? 'Avertissement Important'
            : 'Important Disclaimer'}
        </p>
        <p className="text-muted-foreground">
          {language === 'sw'
            ? 'EMEC ni kwa elimu na uhamasishaji pekee. Tafadhali tembelea kituo cha afya kwa ushauri wa kimatibabu.'
            : language === 'fr'
            ? 'EMEC est à des fins éducatives uniquement. Veuillez consulter un établissement de santé pour obtenir des conseils médicaux.'
            : 'EMEC is for education and awareness only. Please visit a health facility for medical advice.'}
        </p>
      </div>
    </div>
  );
}