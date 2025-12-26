import { Translations } from '@/types/emec';

export const translations: Translations = {
  // App General
  'app.name': { en: 'EMEC', sw: 'EMEC' },
  'app.tagline': { en: 'Empowering Health & Education for Children', sw: 'Kuwezesha Afya na Elimu kwa Watoto' },
  'app.copyright': { en: '© 2025 EMEC – All rights reserved', sw: '© 2025 EMEC – Haki zote zimehifadhiwa' },
  'app.developers': { en: 'Developed by Jacob Johnson & Barack Hussein, Mbita High School', sw: 'Imetengenezwa na Jacob Johnson & Barack Hussein, Shule ya Upili ya Mbita' },
  
  // Navigation
  'nav.home': { en: 'Home', sw: 'Nyumbani' },
  'nav.education': { en: 'Education', sw: 'Elimu' },
  'nav.quizzes': { en: 'Quizzes', sw: 'Maswali' },
  'nav.firstAid': { en: 'First Aid', sw: 'Msaada wa Kwanza' },
  'nav.emergency': { en: 'Emergency', sw: 'Dharura' },
  'nav.donations': { en: 'Donations', sw: 'Michango' },
  'nav.settings': { en: 'Settings', sw: 'Mipangilio' },
  'nav.dashboard': { en: 'Dashboard', sw: 'Dashibodi' },
  
  // Auth
  'auth.login': { en: 'Login', sw: 'Ingia' },
  'auth.logout': { en: 'Logout', sw: 'Ondoka' },
  'auth.switchAccount': { en: 'Switch Account', sw: 'Badilisha Akaunti' },
  'auth.enterPin': { en: 'Enter PIN', sw: 'Ingiza PIN' },
  'auth.selectRole': { en: 'Select Role', sw: 'Chagua Jukumu' },
  'auth.child': { en: 'Child / Patient', sw: 'Mtoto / Mgonjwa' },
  'auth.parent': { en: 'Parent / Guardian', sw: 'Mzazi / Mlezi' },
  'auth.admin': { en: 'Admin / Health Officer', sw: 'Msimamizi / Afisa wa Afya' },
  'auth.wrongPin': { en: 'Wrong PIN. Try again.', sw: 'PIN mbaya. Jaribu tena.' },
  'auth.switchSuccess': { en: 'Account switched successfully', sw: 'Akaunti imebadilishwa kwa mafanikio' },
  
  // Dashboard
  'dashboard.welcome': { en: 'Welcome', sw: 'Karibu' },
  'dashboard.points': { en: 'Points', sw: 'Pointi' },
  'dashboard.quizzes': { en: 'Quizzes', sw: 'Maswali' },
  'dashboard.achievements': { en: 'Achievements', sw: 'Mafanikio' },
  'dashboard.linkedChildren': { en: 'Linked Children', sw: 'Watoto Waliounganishwa' },
  'dashboard.pendingApprovals': { en: 'Pending Approvals', sw: 'Idhini Zinazosubiri' },
  'dashboard.auditLog': { en: 'Audit Log', sw: 'Kumbukumbu za Ukaguzi' },
  'dashboard.facilityInfo': { en: 'Facility Information', sw: 'Taarifa za Kituo' },
  
  // Quizzes
  'quiz.start': { en: 'Start Quiz', sw: 'Anza Maswali' },
  'quiz.next': { en: 'Next', sw: 'Ifuatayo' },
  'quiz.submit': { en: 'Submit', sw: 'Wasilisha' },
  'quiz.score': { en: 'Your Score', sw: 'Alama Yako' },
  'quiz.correct': { en: 'Correct!', sw: 'Sahihi!' },
  'quiz.incorrect': { en: 'Incorrect', sw: 'Si sahihi' },
  'quiz.pointsEarned': { en: 'Points Earned', sw: 'Pointi Zilizopatikana' },
  
  // Restrictions
  'restricted.title': { en: 'Restricted Content', sw: 'Maudhui Yaliyozuiliwa' },
  'restricted.message': { en: 'This section is restricted for underage users. Parent approval required.', sw: 'Sehemu hii imezuiliwa kwa watumiaji wadogo. Idhini ya mzazi inahitajika.' },
  'restricted.enterCode': { en: 'Enter Consent Code', sw: 'Ingiza Nambari ya Idhini' },
  'restricted.unlock': { en: 'Unlock', sw: 'Fungua' },
  
  // Settings
  'settings.title': { en: 'Settings', sw: 'Mipangilio' },
  'settings.theme': { en: 'Theme', sw: 'Mandhari' },
  'settings.light': { en: 'Light', sw: 'Mwanga' },
  'settings.dark': { en: 'Dark', sw: 'Giza' },
  'settings.language': { en: 'Language', sw: 'Lugha' },
  'settings.microphone': { en: 'Enable Microphone', sw: 'Washa Kipaza Sauti' },
  'settings.notifications': { en: 'Notifications', sw: 'Arifa' },
  'settings.resetDemo': { en: 'Reset Demo Data', sw: 'Weka upya Data ya Demo' },
  
  // Offline
  'offline.detected': { en: 'No internet detected. Local data activated.', sw: 'Hakuna mtandao. Data ya ndani imeamilishwa.' },
  'offline.syncing': { en: 'Syncing data...', sw: 'Kusawazisha data...' },
  'offline.synced': { en: 'Data synced successfully', sw: 'Data imesawazishwa kwa mafanikio' },
  
  // Donations
  'donation.title': { en: 'Make a Donation', sw: 'Toa Mchango' },
  'donation.amount': { en: 'Amount (KES)', sw: 'Kiasi (KES)' },
  'donation.processing': { en: 'Processing donation...', sw: 'Inachakata mchango...' },
  'donation.success': { en: 'Thank you for your donation!', sw: 'Asante kwa mchango wako!' },
  'donation.impact': { en: 'Your donation helps children in Kenya today.', sw: 'Mchango wako unasaidia watoto Kenya leo.' },
  
  // Emergency
  'emergency.call': { en: 'Call Emergency Services', sw: 'Piga Simu Huduma za Dharura' },
  'emergency.nearby': { en: 'Nearby Facilities', sw: 'Vituo vya Karibu' },
  
  // Demo
  'demo.label': { en: 'Demo Data – Editable for Presentation', sw: 'Data ya Demo – Inaweza kuhaririwa kwa Wasilisho' },
  'demo.reset': { en: 'Reset Demo Data', sw: 'Weka upya Data ya Demo' },
};

export const t = (key: string, language: 'en' | 'sw' = 'en'): string => {
  return translations[key]?.[language] || key;
};
