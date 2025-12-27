import { Translations } from '@/types/emec';

export const translations: Translations = {
  // App General
  'app.name': { en: 'EMEC', sw: 'EMEC', fr: 'EMEC' },
  'app.tagline': { en: 'Your Health. Your Records. Your Control.', sw: 'Afya Yako. Rekodi Zako. Udhibiti Wako.', fr: 'Votre Santé. Vos Dossiers. Votre Contrôle.' },
  'app.fullName': { en: 'Electronic Medical & Education Companion', sw: 'Mwenza wa Kielektroniki wa Matibabu na Elimu', fr: 'Compagnon Médical et Éducatif Électronique' },
  'app.copyright': { en: '© 2025 EMEC – All rights reserved', sw: '© 2025 EMEC – Haki zote zimehifadhiwa', fr: '© 2025 EMEC – Tous droits réservés' },
  'app.developers': { en: 'Developed by Jacob Johnson & Barack Hussein, Mbita High School', sw: 'Imetengenezwa na Jacob Johnson & Barack Hussein, Shule ya Upili ya Mbita', fr: 'Développé par Jacob Johnson & Barack Hussein, Lycée de Mbita' },
  
  // Navigation
  'nav.home': { en: 'Home', sw: 'Nyumbani', fr: 'Accueil' },
  'nav.education': { en: 'Education', sw: 'Elimu', fr: 'Éducation' },
  'nav.quizzes': { en: 'Quizzes', sw: 'Maswali', fr: 'Quiz' },
  'nav.firstAid': { en: 'First Aid', sw: 'Msaada wa Kwanza', fr: 'Premiers Secours' },
  'nav.emergency': { en: 'Emergency', sw: 'Dharura', fr: 'Urgence' },
  'nav.donations': { en: 'Donations', sw: 'Michango', fr: 'Dons' },
  'nav.settings': { en: 'Settings', sw: 'Mipangilio', fr: 'Paramètres' },
  'nav.dashboard': { en: 'Dashboard', sw: 'Dashibodi', fr: 'Tableau de Bord' },
  'nav.calculators': { en: 'Calculators', sw: 'Vikokotozi', fr: 'Calculatrices' },
  'nav.allergies': { en: 'Allergy Checker', sw: 'Kikagua Mzio', fr: 'Vérificateur d\'Allergies' },
  'nav.facilities': { en: 'Health Facilities', sw: 'Vituo vya Afya', fr: 'Établissements de Santé' },
  
  // Auth
  'auth.login': { en: 'Login', sw: 'Ingia', fr: 'Connexion' },
  'auth.logout': { en: 'Logout', sw: 'Ondoka', fr: 'Déconnexion' },
  'auth.switchAccount': { en: 'Switch Account', sw: 'Badilisha Akaunti', fr: 'Changer de Compte' },
  'auth.enterPin': { en: 'Enter PIN', sw: 'Ingiza PIN', fr: 'Entrer le PIN' },
  'auth.enterEmecId': { en: 'Enter EMEC ID', sw: 'Ingiza EMEC ID', fr: 'Entrer l\'ID EMEC' },
  'auth.enterPassword': { en: 'Enter Password', sw: 'Ingiza Nenosiri', fr: 'Entrer le Mot de Passe' },
  'auth.selectRole': { en: 'Select Account Type', sw: 'Chagua Aina ya Akaunti', fr: 'Sélectionner le Type de Compte' },
  'auth.child': { en: 'Child / Patient', sw: 'Mtoto / Mgonjwa', fr: 'Enfant / Patient' },
  'auth.adult': { en: 'Adult User', sw: 'Mtumiaji Mtu Mzima', fr: 'Utilisateur Adulte' },
  'auth.parent': { en: 'Parent / Guardian', sw: 'Mzazi / Mlezi', fr: 'Parent / Tuteur' },
  'auth.admin': { en: 'Health Facility Admin', sw: 'Msimamizi wa Kituo cha Afya', fr: 'Admin Établissement de Santé' },
  'auth.wrongCredentials': { en: 'Invalid EMEC ID or Password', sw: 'EMEC ID au Nenosiri si sahihi', fr: 'ID EMEC ou Mot de Passe invalide' },
  'auth.switchSuccess': { en: 'Account switched successfully', sw: 'Akaunti imebadilishwa kwa mafanikio', fr: 'Compte changé avec succès' },
  'auth.verified': { en: 'Verified', sw: 'Imethibitishwa', fr: 'Vérifié' },
  
  // Dashboard
  'dashboard.welcome': { en: 'Welcome', sw: 'Karibu', fr: 'Bienvenue' },
  'dashboard.points': { en: 'Points', sw: 'Pointi', fr: 'Points' },
  'dashboard.quizzes': { en: 'Quizzes', sw: 'Maswali', fr: 'Quiz' },
  'dashboard.achievements': { en: 'Achievements', sw: 'Mafanikio', fr: 'Réalisations' },
  'dashboard.linkedChildren': { en: 'Linked Children', sw: 'Watoto Waliounganishwa', fr: 'Enfants Liés' },
  'dashboard.pendingApprovals': { en: 'Pending Approvals', sw: 'Idhini Zinazosubiri', fr: 'Approbations en Attente' },
  'dashboard.auditLog': { en: 'Audit Log', sw: 'Kumbukumbu za Ukaguzi', fr: 'Journal d\'Audit' },
  'dashboard.facilityInfo': { en: 'Facility Information', sw: 'Taarifa za Kituo', fr: 'Informations sur l\'Établissement' },
  'dashboard.healthProfile': { en: 'Health Profile', sw: 'Wasifu wa Afya', fr: 'Profil de Santé' },
  'dashboard.medications': { en: 'Medications', sw: 'Dawa', fr: 'Médicaments' },
  'dashboard.allergies': { en: 'Known Allergies', sw: 'Mizio Yanayojulikana', fr: 'Allergies Connues' },
  
  // Quizzes
  'quiz.start': { en: 'Start Quiz', sw: 'Anza Maswali', fr: 'Commencer le Quiz' },
  'quiz.next': { en: 'Next', sw: 'Ifuatayo', fr: 'Suivant' },
  'quiz.submit': { en: 'Submit', sw: 'Wasilisha', fr: 'Soumettre' },
  'quiz.score': { en: 'Your Score', sw: 'Alama Yako', fr: 'Votre Score' },
  'quiz.correct': { en: 'Correct!', sw: 'Sahihi!', fr: 'Correct!' },
  'quiz.incorrect': { en: 'Incorrect', sw: 'Si sahihi', fr: 'Incorrect' },
  'quiz.pointsEarned': { en: 'Points Earned', sw: 'Pointi Zilizopatikana', fr: 'Points Gagnés' },
  'quiz.easy': { en: 'Easy', sw: 'Rahisi', fr: 'Facile' },
  'quiz.intermediate': { en: 'Intermediate', sw: 'Wastani', fr: 'Intermédiaire' },
  'quiz.difficult': { en: 'Difficult', sw: 'Ngumu', fr: 'Difficile' },
  'quiz.endless': { en: 'Endless Mode', sw: 'Hali Isiyo na Mwisho', fr: 'Mode Sans Fin' },
  
  // Restrictions
  'restricted.title': { en: 'Restricted Content', sw: 'Maudhui Yaliyozuiliwa', fr: 'Contenu Restreint' },
  'restricted.message': { en: 'This section is restricted. Parent approval required.', sw: 'Sehemu hii imezuiliwa. Idhini ya mzazi inahitajika.', fr: 'Cette section est restreinte. Approbation parentale requise.' },
  'restricted.enterCode': { en: 'Enter Consent Code', sw: 'Ingiza Nambari ya Idhini', fr: 'Entrer le Code de Consentement' },
  'restricted.unlock': { en: 'Unlock', sw: 'Fungua', fr: 'Déverrouiller' },
  'restricted.timeLimit': { en: 'Code expires in 5 minutes', sw: 'Nambari inaisha baada ya dakika 5', fr: 'Le code expire dans 5 minutes' },
  
  // Settings
  'settings.title': { en: 'Settings', sw: 'Mipangilio', fr: 'Paramètres' },
  'settings.theme': { en: 'Theme', sw: 'Mandhari', fr: 'Thème' },
  'settings.light': { en: 'Light', sw: 'Mwanga', fr: 'Clair' },
  'settings.dark': { en: 'Dark', sw: 'Giza', fr: 'Sombre' },
  'settings.language': { en: 'Language', sw: 'Lugha', fr: 'Langue' },
  'settings.microphone': { en: 'Enable Microphone', sw: 'Washa Kipaza Sauti', fr: 'Activer le Microphone' },
  'settings.notifications': { en: 'Notifications', sw: 'Arifa', fr: 'Notifications' },
  'settings.resetDemo': { en: 'Reset Demo Data', sw: 'Weka upya Data ya Demo', fr: 'Réinitialiser les Données Démo' },
  'settings.background': { en: 'Background Color', sw: 'Rangi ya Mandharinyuma', fr: 'Couleur d\'Arrière-plan' },
  'settings.passwordReset': { en: 'Reset Password', sw: 'Weka upya Nenosiri', fr: 'Réinitialiser le Mot de Passe' },
  
  // Offline
  'offline.detected': { en: 'Offline Mode Active', sw: 'Hali ya Nje ya Mtandao Imeamilishwa', fr: 'Mode Hors Ligne Actif' },
  'offline.syncing': { en: 'Syncing data...', sw: 'Kusawazisha data...', fr: 'Synchronisation des données...' },
  'offline.synced': { en: 'Data synced successfully', sw: 'Data imesawazishwa kwa mafanikio', fr: 'Données synchronisées avec succès' },
  'offline.available': { en: 'Works Offline', sw: 'Inafanya Kazi Bila Mtandao', fr: 'Fonctionne Hors Ligne' },
  
  // Donations
  'donation.title': { en: 'Support EMEC', sw: 'Saidia EMEC', fr: 'Soutenir EMEC' },
  'donation.amount': { en: 'Amount (KES)', sw: 'Kiasi (KES)', fr: 'Montant (KES)' },
  'donation.processing': { en: 'Processing...', sw: 'Inachakata...', fr: 'Traitement...' },
  'donation.success': { en: 'Thank you for your donation!', sw: 'Asante kwa mchango wako!', fr: 'Merci pour votre don!' },
  'donation.impact': { en: 'Your donation helps children in Kenya.', sw: 'Mchango wako unasaidia watoto Kenya.', fr: 'Votre don aide les enfants au Kenya.' },
  'donation.donorWall': { en: 'Donor Wall', sw: 'Ukuta wa Wafadhili', fr: 'Mur des Donateurs' },
  'donation.premium': { en: 'Premium Subscription', sw: 'Usajili wa Premium', fr: 'Abonnement Premium' },
  'donation.freeTrial': { en: '7-Day Free Trial', sw: 'Jaribio la Bure la Siku 7', fr: 'Essai Gratuit de 7 Jours' },
  
  // Emergency
  'emergency.title': { en: 'Emergency Services', sw: 'Huduma za Dharura', fr: 'Services d\'Urgence' },
  'emergency.call': { en: 'Call Emergency', sw: 'Piga Simu Dharura', fr: 'Appeler les Urgences' },
  'emergency.nearby': { en: 'Nearby Facilities', sw: 'Vituo vya Karibu', fr: 'Établissements à Proximité' },
  'emergency.dialPad': { en: 'Emergency Dial Pad', sw: 'Kibonyezo cha Dharura', fr: 'Clavier d\'Urgence' },
  
  // Health Tools
  'health.hydration': { en: 'Hydration Calculator', sw: 'Kikokotozi cha Maji', fr: 'Calculateur d\'Hydratation' },
  'health.heartRate': { en: 'Heart Rate Zones', sw: 'Maeneo ya Mapigo ya Moyo', fr: 'Zones de Fréquence Cardiaque' },
  'health.bmi': { en: 'BMI Calculator', sw: 'Kikokotozi cha BMI', fr: 'Calculateur IMC' },
  'health.bmr': { en: 'BMR Calculator', sw: 'Kikokotozi cha BMR', fr: 'Calculateur BMR' },
  'health.mealPlan': { en: 'Meal Plans', sw: 'Mipango ya Chakula', fr: 'Plans de Repas' },
  'health.medication': { en: 'Medication Reminders', sw: 'Vikumbusho vya Dawa', fr: 'Rappels de Médicaments' },
  
  // Consent
  'consent.title': { en: 'Consent Required', sw: 'Idhini Inahitajika', fr: 'Consentement Requis' },
  'consent.message': { en: 'Admin has requested to update your records', sw: 'Msimamizi ameomba kusasisha rekodi zako', fr: 'L\'admin a demandé la mise à jour de vos dossiers' },
  'consent.approve': { en: 'Approve', sw: 'Kubali', fr: 'Approuver' },
  'consent.reject': { en: 'Reject', sw: 'Kataa', fr: 'Rejeter' },
  'consent.timer': { en: 'Code expires in', sw: 'Nambari inaisha baada ya', fr: 'Le code expire dans' },
  
  // Demo
  'demo.label': { en: 'Demo Mode – Editable for Presentation', sw: 'Hali ya Demo – Inaweza kuhaririwa kwa Wasilisho', fr: 'Mode Démo – Modifiable pour Présentation' },
  'demo.reset': { en: 'Reset Demo Data', sw: 'Weka upya Data ya Demo', fr: 'Réinitialiser les Données Démo' },
  'demo.offline': { en: 'Works Offline for Demo', sw: 'Inafanya Kazi Bila Mtandao kwa Demo', fr: 'Fonctionne Hors Ligne pour la Démo' },
};

export type Language = 'en' | 'sw' | 'fr';

export const t = (key: string, language: Language = 'en'): string => {
  const translation = translations[key];
  if (!translation) return key;
  return translation[language] || translation['en'] || key;
};
