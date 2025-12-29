// Comprehensive Health Education Content - Age-Aware, Culturally Sensitive, Evidence-Based

export type AgeGroup = 'child' | 'teen' | 'adult';
export type Gender = 'male' | 'female' | 'all';

export interface EducationTopic {
  id: string;
  title: {
    en: string;
    sw: string;
    fr: string;
  };
  description: {
    en: string;
    sw: string;
    fr: string;
  };
  icon: string;
  ageGroups: AgeGroup[];
  gender?: Gender;
  category: string;
  content: EducationSection[];
  color: string;
}

export interface EducationSection {
  id: string;
  title: {
    en: string;
    sw: string;
    fr: string;
  };
  content: {
    en: string;
    sw: string;
    fr: string;
  };
  bulletPoints?: {
    en: string[];
    sw: string[];
    fr: string[];
  };
  warningSign?: boolean;
  ageGroups: AgeGroup[];
}

// CHILDREN EDUCATION (Below 13)
export const childrenEducation: EducationTopic[] = [
  {
    id: 'hand-hygiene-child',
    title: {
      en: 'Wash Your Hands!',
      sw: 'Nawa Mikono Yako!',
      fr: 'Lave tes mains!'
    },
    description: {
      en: 'Learn how to keep your hands clean and stay healthy',
      sw: 'Jifunze jinsi ya kuweka mikono yako safi na kuwa na afya',
      fr: 'Apprends à garder tes mains propres et rester en bonne santé'
    },
    icon: '🧼',
    ageGroups: ['child'],
    category: 'hygiene',
    color: 'from-blue-400 to-cyan-400',
    content: [
      {
        id: 'when-to-wash',
        title: { en: 'When to Wash', sw: 'Wakati wa Kunawa', fr: 'Quand se laver' },
        content: {
          en: 'Washing your hands is like giving them a superhero shield against germs!',
          sw: 'Kunawa mikono ni kama kuwapa ngao ya shujaa dhidi ya vijidudu!',
          fr: 'Se laver les mains c\'est comme leur donner un bouclier de super-héros contre les microbes!'
        },
        bulletPoints: {
          en: [
            '🍽️ Before eating food',
            '🚽 After using the bathroom',
            '🏃 After playing outside',
            '🤧 After sneezing or coughing',
            '🐶 After touching animals'
          ],
          sw: [
            '🍽️ Kabla ya kula chakula',
            '🚽 Baada ya kutumia choo',
            '🏃 Baada ya kucheza nje',
            '🤧 Baada ya kupiga chafya au kukohoa',
            '🐶 Baada ya kushika wanyama'
          ],
          fr: [
            '🍽️ Avant de manger',
            '🚽 Après avoir utilisé les toilettes',
            '🏃 Après avoir joué dehors',
            '🤧 Après avoir éternué ou toussé',
            '🐶 Après avoir touché des animaux'
          ]
        },
        ageGroups: ['child']
      },
      {
        id: 'how-to-wash',
        title: { en: 'The 20-Second Song', sw: 'Wimbo wa Sekunde 20', fr: 'La chanson de 20 secondes' },
        content: {
          en: 'Sing "Happy Birthday" twice while washing - that\'s how long you need!',
          sw: 'Imba "Happy Birthday" mara mbili ukiwa unanawa - hivyo ndivyo unavyohitaji!',
          fr: 'Chante "Joyeux Anniversaire" deux fois en te lavant - c\'est le temps qu\'il faut!'
        },
        bulletPoints: {
          en: [
            '1️⃣ Wet your hands with clean water',
            '2️⃣ Add soap and rub together',
            '3️⃣ Scrub between fingers',
            '4️⃣ Don\'t forget under nails!',
            '5️⃣ Rinse and dry with clean towel'
          ],
          sw: [
            '1️⃣ Lowesha mikono yako na maji safi',
            '2️⃣ Ongeza sabuni na sugua pamoja',
            '3️⃣ Sugua kati ya vidole',
            '4️⃣ Usisahau chini ya kucha!',
            '5️⃣ Suuza na kausha na taulo safi'
          ],
          fr: [
            '1️⃣ Mouille tes mains avec de l\'eau propre',
            '2️⃣ Ajoute du savon et frotte',
            '3️⃣ Frotte entre les doigts',
            '4️⃣ N\'oublie pas sous les ongles!',
            '5️⃣ Rince et sèche avec une serviette propre'
          ]
        },
        ageGroups: ['child']
      }
    ]
  },
  {
    id: 'healthy-eating-child',
    title: {
      en: 'Eat the Rainbow!',
      sw: 'Kula Upinde wa Mvua!',
      fr: 'Mange l\'arc-en-ciel!'
    },
    description: {
      en: 'Discover colorful foods that make you strong',
      sw: 'Gundua vyakula vyenye rangi vinavyokufanya kuwa na nguvu',
      fr: 'Découvre les aliments colorés qui te rendent fort'
    },
    icon: '🌈',
    ageGroups: ['child'],
    category: 'nutrition',
    color: 'from-green-400 to-emerald-400',
    content: [
      {
        id: 'rainbow-foods',
        title: { en: 'Rainbow Foods', sw: 'Vyakula vya Upinde wa Mvua', fr: 'Aliments arc-en-ciel' },
        content: {
          en: 'Each color gives you different superpowers!',
          sw: 'Kila rangi inakupa nguvu tofauti!',
          fr: 'Chaque couleur te donne des superpouvoirs différents!'
        },
        bulletPoints: {
          en: [
            '🔴 Red (tomatoes, apples) - Strong heart',
            '🟠 Orange (carrots, oranges) - Super eyesight',
            '🟡 Yellow (bananas, corn) - Energy boost',
            '🟢 Green (spinach, broccoli) - Strong muscles',
            '🔵 Blue/Purple (berries) - Smart brain'
          ],
          sw: [
            '🔴 Nyekundu (nyanya, tufaha) - Moyo wenye nguvu',
            '🟠 Machungwa (karoti, machungwa) - Macho mazuri',
            '🟡 Njano (ndizi, mahindi) - Nguvu zaidi',
            '🟢 Kijani (mchicha, brokoli) - Misuli yenye nguvu',
            '🔵 Bluu/Zambarau (berries) - Ubongo mzuri'
          ],
          fr: [
            '🔴 Rouge (tomates, pommes) - Cœur fort',
            '🟠 Orange (carottes, oranges) - Super vision',
            '🟡 Jaune (bananes, maïs) - Boost d\'énergie',
            '🟢 Vert (épinards, brocoli) - Muscles forts',
            '🔵 Bleu/Violet (baies) - Cerveau intelligent'
          ]
        },
        ageGroups: ['child']
      }
    ]
  },
  {
    id: 'body-awareness-child',
    title: {
      en: 'My Amazing Body',
      sw: 'Mwili Wangu wa Ajabu',
      fr: 'Mon corps incroyable'
    },
    description: {
      en: 'Learn about the parts of your body and how they work',
      sw: 'Jifunze kuhusu sehemu za mwili wako na jinsi zinavyofanya kazi',
      fr: 'Apprends les parties de ton corps et comment elles fonctionnent'
    },
    icon: '🦴',
    ageGroups: ['child'],
    category: 'body',
    color: 'from-purple-400 to-pink-400',
    content: [
      {
        id: 'body-parts',
        title: { en: 'Body Parts', sw: 'Sehemu za Mwili', fr: 'Parties du corps' },
        content: {
          en: 'Your body is amazing! Each part has an important job.',
          sw: 'Mwili wako ni wa ajabu! Kila sehemu ina kazi muhimu.',
          fr: 'Ton corps est incroyable! Chaque partie a un travail important.'
        },
        bulletPoints: {
          en: [
            '🧠 Brain - Helps you think and learn',
            '❤️ Heart - Pumps blood through your body',
            '🫁 Lungs - Help you breathe',
            '🦴 Bones - Keep you standing tall',
            '💪 Muscles - Help you move and play'
          ],
          sw: [
            '🧠 Ubongo - Inakusaidia kufikiri na kujifunza',
            '❤️ Moyo - Inasukuma damu kwenye mwili wako',
            '🫁 Mapafu - Yanakusaidia kupumua',
            '🦴 Mifupa - Inakuweka umesimama',
            '💪 Misuli - Inakusaidia kusogea na kucheza'
          ],
          fr: [
            '🧠 Cerveau - T\'aide à penser et apprendre',
            '❤️ Cœur - Pompe le sang dans ton corps',
            '🫁 Poumons - T\'aident à respirer',
            '🦴 Os - Te gardent debout',
            '💪 Muscles - T\'aident à bouger et jouer'
          ]
        },
        ageGroups: ['child']
      }
    ]
  },
  {
    id: 'safety-child',
    title: {
      en: 'Stay Safe!',
      sw: 'Kaa Salama!',
      fr: 'Reste en sécurité!'
    },
    description: {
      en: 'Important safety rules to protect yourself',
      sw: 'Sheria muhimu za usalama za kujilinda',
      fr: 'Règles de sécurité importantes pour te protéger'
    },
    icon: '🛡️',
    ageGroups: ['child'],
    category: 'safety',
    color: 'from-yellow-400 to-orange-400',
    content: [
      {
        id: 'personal-safety',
        title: { en: 'Personal Safety', sw: 'Usalama wa Kibinafsi', fr: 'Sécurité personnelle' },
        content: {
          en: 'Your body belongs to you. These rules keep you safe!',
          sw: 'Mwili wako ni wako. Sheria hizi zinakuweka salama!',
          fr: 'Ton corps t\'appartient. Ces règles te gardent en sécurité!'
        },
        bulletPoints: {
          en: [
            '🚫 Say NO to things that make you uncomfortable',
            '🏃 Run away from danger',
            '🗣️ Tell a trusted adult if something feels wrong',
            '📞 Know your parents\' phone numbers',
            '🏠 Know your home address'
          ],
          sw: [
            '🚫 Sema HAPANA kwa mambo yanayokufanya usijisikie vizuri',
            '🏃 Kimbia kutoka hatarini',
            '🗣️ Mwambie mtu mzima unayemwamini kama kitu kinaonekana kibaya',
            '📞 Jua nambari za simu za wazazi wako',
            '🏠 Jua anwani ya nyumba yako'
          ],
          fr: [
            '🚫 Dis NON aux choses qui te mettent mal à l\'aise',
            '🏃 Fuis le danger',
            '🗣️ Parle à un adulte de confiance si quelque chose semble mal',
            '📞 Connais les numéros de téléphone de tes parents',
            '🏠 Connais ton adresse'
          ]
        },
        ageGroups: ['child']
      }
    ]
  }
];

// TEENAGER EDUCATION (Ages 13-17)
export const teenEducation: EducationTopic[] = [
  {
    id: 'puberty-male',
    title: {
      en: 'Understanding Puberty (Boys)',
      sw: 'Kuelewa Balehe (Wavulana)',
      fr: 'Comprendre la puberté (Garçons)'
    },
    description: {
      en: 'What happens to your body during adolescence',
      sw: 'Kinachotokea kwa mwili wako wakati wa ujana',
      fr: 'Ce qui arrive à ton corps pendant l\'adolescence'
    },
    icon: '👦',
    ageGroups: ['teen'],
    gender: 'male',
    category: 'puberty',
    color: 'from-blue-500 to-indigo-500',
    content: [
      {
        id: 'physical-changes-male',
        title: { en: 'Physical Changes', sw: 'Mabadiliko ya Kimwili', fr: 'Changements physiques' },
        content: {
          en: 'Puberty usually starts between ages 10-14. These changes are completely normal and happen to every boy.',
          sw: 'Balehe kawaida huanza kati ya miaka 10-14. Mabadiliko haya ni ya kawaida kabisa na hutokea kwa kila mvulana.',
          fr: 'La puberté commence généralement entre 10-14 ans. Ces changements sont complètement normaux et arrivent à tous les garçons.'
        },
        bulletPoints: {
          en: [
            'Growth spurts - you may grow taller quickly',
            'Voice changes (deepening)',
            'Facial and body hair growth',
            'Increased sweating and body odor',
            'Skin changes (acne is common)',
            'Muscle development'
          ],
          sw: [
            'Kukua haraka - unaweza kuwa mrefu haraka',
            'Mabadiliko ya sauti (kuwa nzito)',
            'Nywele za uso na mwili kukua',
            'Kutoa jasho zaidi na harufu ya mwili',
            'Mabadiliko ya ngozi (chunusi ni kawaida)',
            'Maendeleo ya misuli'
          ],
          fr: [
            'Poussées de croissance - tu peux grandir rapidement',
            'Changements de voix (approfondissement)',
            'Croissance des poils du visage et du corps',
            'Augmentation de la transpiration et odeur corporelle',
            'Changements de peau (l\'acné est courante)',
            'Développement musculaire'
          ]
        },
        ageGroups: ['teen']
      },
      {
        id: 'emotional-changes-male',
        title: { en: 'Emotional Changes', sw: 'Mabadiliko ya Kihisia', fr: 'Changements émotionnels' },
        content: {
          en: 'It\'s normal to experience mood swings and new emotions during puberty.',
          sw: 'Ni kawaida kupitia mabadiliko ya hisia na hisia mpya wakati wa balehe.',
          fr: 'Il est normal de connaître des sautes d\'humeur et de nouvelles émotions pendant la puberté.'
        },
        bulletPoints: {
          en: [
            'Mood swings are normal',
            'Increased interest in relationships',
            'Wanting more independence',
            'Feeling self-conscious about your body',
            'It\'s okay to talk to trusted adults'
          ],
          sw: [
            'Mabadiliko ya hisia ni ya kawaida',
            'Kupendezwa zaidi na mahusiano',
            'Kutaka uhuru zaidi',
            'Kujisikia wasiwasi kuhusu mwili wako',
            'Ni sawa kuzungumza na watu wazima unaowaamini'
          ],
          fr: [
            'Les sautes d\'humeur sont normales',
            'Intérêt accru pour les relations',
            'Vouloir plus d\'indépendance',
            'Se sentir gêné par son corps',
            'C\'est ok de parler à des adultes de confiance'
          ]
        },
        ageGroups: ['teen']
      }
    ]
  },
  {
    id: 'puberty-female',
    title: {
      en: 'Understanding Puberty (Girls)',
      sw: 'Kuelewa Balehe (Wasichana)',
      fr: 'Comprendre la puberté (Filles)'
    },
    description: {
      en: 'What happens to your body during adolescence',
      sw: 'Kinachotokea kwa mwili wako wakati wa ujana',
      fr: 'Ce qui arrive à ton corps pendant l\'adolescence'
    },
    icon: '👧',
    ageGroups: ['teen'],
    gender: 'female',
    category: 'puberty',
    color: 'from-pink-500 to-rose-500',
    content: [
      {
        id: 'physical-changes-female',
        title: { en: 'Physical Changes', sw: 'Mabadiliko ya Kimwili', fr: 'Changements physiques' },
        content: {
          en: 'Puberty usually starts between ages 8-13. These changes are completely normal and happen to every girl.',
          sw: 'Balehe kawaida huanza kati ya miaka 8-13. Mabadiliko haya ni ya kawaida kabisa na hutokea kwa kila msichana.',
          fr: 'La puberté commence généralement entre 8-13 ans. Ces changements sont complètement normaux et arrivent à toutes les filles.'
        },
        bulletPoints: {
          en: [
            'Growth spurts - you may grow taller quickly',
            'Breast development',
            'Body hair growth (underarms, legs)',
            'Widening of hips',
            'Skin changes (acne is common)',
            'Beginning of menstruation'
          ],
          sw: [
            'Kukua haraka - unaweza kuwa ndefu haraka',
            'Maendeleo ya matiti',
            'Kukua kwa nywele za mwili (makwapa, miguu)',
            'Kupanuka kwa nyonga',
            'Mabadiliko ya ngozi (chunusi ni kawaida)',
            'Kuanza kwa hedhi'
          ],
          fr: [
            'Poussées de croissance - tu peux grandir rapidement',
            'Développement des seins',
            'Croissance des poils corporels (aisselles, jambes)',
            'Élargissement des hanches',
            'Changements de peau (l\'acné est courante)',
            'Début des menstruations'
          ]
        },
        ageGroups: ['teen']
      }
    ]
  },
  {
    id: 'menstruation',
    title: {
      en: 'Understanding Menstruation',
      sw: 'Kuelewa Hedhi',
      fr: 'Comprendre les menstruations'
    },
    description: {
      en: 'Everything you need to know about your menstrual cycle',
      sw: 'Kila kitu unachohitaji kujua kuhusu mzunguko wako wa hedhi',
      fr: 'Tout ce que tu dois savoir sur ton cycle menstruel'
    },
    icon: '🌸',
    ageGroups: ['teen'],
    gender: 'female',
    category: 'menstruation',
    color: 'from-rose-500 to-pink-500',
    content: [
      {
        id: 'what-is-menstruation',
        title: { en: 'What is Menstruation?', sw: 'Hedhi ni Nini?', fr: 'Qu\'est-ce que les menstruations?' },
        content: {
          en: 'Menstruation (your period) is a natural, healthy process that shows your body is maturing. It typically starts between ages 10-16 and is a sign that your body can one day have children.',
          sw: 'Hedhi ni mchakato wa asili na wa afya unaoonyesha mwili wako unakomaa. Kawaida huanza kati ya miaka 10-16 na ni ishara kwamba mwili wako unaweza siku moja kupata watoto.',
          fr: 'Les menstruations (tes règles) sont un processus naturel et sain qui montre que ton corps mûrit. Elles commencent généralement entre 10-16 ans et sont un signe que ton corps peut un jour avoir des enfants.'
        },
        bulletPoints: {
          en: [
            'Your body releases an egg each month',
            'The uterus prepares a lining for the egg',
            'If no pregnancy occurs, the lining sheds',
            'This blood exits through the vagina',
            'A typical cycle is 21-35 days'
          ],
          sw: [
            'Mwili wako hutoa yai kila mwezi',
            'Kizazi huandaa tabaka kwa yai',
            'Ikiwa hakuna mimba, tabaka hutoka',
            'Damu hii hutoka kupitia uke',
            'Mzunguko wa kawaida ni siku 21-35'
          ],
          fr: [
            'Ton corps libère un ovule chaque mois',
            'L\'utérus prépare une muqueuse pour l\'ovule',
            'Si pas de grossesse, la muqueuse est évacuée',
            'Ce sang sort par le vagin',
            'Un cycle typique dure 21-35 jours'
          ]
        },
        ageGroups: ['teen']
      },
      {
        id: 'normal-vs-abnormal',
        title: { en: 'Normal vs. Abnormal Periods', sw: 'Hedhi ya Kawaida dhidi ya Isiyo ya Kawaida', fr: 'Règles normales vs. anormales' },
        content: {
          en: 'It\'s important to know what\'s normal and when to seek help.',
          sw: 'Ni muhimu kujua ni nini kawaida na wakati wa kutafuta msaada.',
          fr: 'Il est important de savoir ce qui est normal et quand demander de l\'aide.'
        },
        bulletPoints: {
          en: [
            '✅ Normal: 3-7 days of bleeding',
            '✅ Normal: Some cramping and discomfort',
            '✅ Normal: Irregular cycles in first 2 years',
            '⚠️ Abnormal: Extremely heavy bleeding',
            '⚠️ Abnormal: Severe pain that stops daily activities',
            '⚠️ Abnormal: No period by age 16'
          ],
          sw: [
            '✅ Kawaida: Siku 3-7 za kutoka damu',
            '✅ Kawaida: Maumivu kidogo na usumbufu',
            '✅ Kawaida: Mizunguko isiyo ya kawaida katika miaka 2 ya kwanza',
            '⚠️ Si kawaida: Kutoka damu nyingi sana',
            '⚠️ Si kawaida: Maumivu makali yanayosimamisha shughuli za kila siku',
            '⚠️ Si kawaida: Hakuna hedhi kufikia umri wa miaka 16'
          ],
          fr: [
            '✅ Normal: 3-7 jours de saignement',
            '✅ Normal: Quelques crampes et inconfort',
            '✅ Normal: Cycles irréguliers les 2 premières années',
            '⚠️ Anormal: Saignements extrêmement abondants',
            '⚠️ Anormal: Douleur sévère empêchant les activités quotidiennes',
            '⚠️ Anormal: Pas de règles à 16 ans'
          ]
        },
        warningSign: true,
        ageGroups: ['teen']
      },
      {
        id: 'hygiene-practices',
        title: { en: 'Hygiene During Your Period', sw: 'Usafi Wakati wa Hedhi', fr: 'Hygiène pendant tes règles' },
        content: {
          en: 'Good hygiene during your period keeps you healthy and comfortable.',
          sw: 'Usafi mzuri wakati wa hedhi unakuweka na afya na starehe.',
          fr: 'Une bonne hygiène pendant tes règles te garde en bonne santé et à l\'aise.'
        },
        bulletPoints: {
          en: [
            '🌸 Change pads/tampons every 4-6 hours',
            '🧼 Wash your hands before and after changing',
            '🚿 Bathe or shower daily',
            '👗 Wear comfortable, breathable underwear',
            '♻️ Dispose of products properly',
            '📝 Track your cycle with a calendar or app'
          ],
          sw: [
            '🌸 Badilisha pedi/tamponi kila masaa 4-6',
            '🧼 Nawa mikono yako kabla na baada ya kubadilisha',
            '🚿 Oga kila siku',
            '👗 Vaa chupi yenye starehe, inayopitisha hewa',
            '♻️ Tupa bidhaa kwa usahihi',
            '📝 Fuatilia mzunguko wako na kalenda au programu'
          ],
          fr: [
            '🌸 Change les serviettes/tampons toutes les 4-6 heures',
            '🧼 Lave-toi les mains avant et après le changement',
            '🚿 Douche-toi ou baigne-toi quotidiennement',
            '👗 Porte des sous-vêtements confortables et respirants',
            '♻️ Jette les produits correctement',
            '📝 Suis ton cycle avec un calendrier ou une application'
          ]
        },
        ageGroups: ['teen']
      },
      {
        id: 'managing-cramps',
        title: { en: 'Managing Cramps & Discomfort', sw: 'Kudhibiti Maumivu na Usumbufu', fr: 'Gérer les crampes et l\'inconfort' },
        content: {
          en: 'Cramps are caused by your uterus contracting. Here are ways to feel better:',
          sw: 'Maumivu yanasababishwa na kusinyaa kwa kizazi chako. Hapa kuna njia za kujisikia vizuri:',
          fr: 'Les crampes sont causées par les contractions de l\'utérus. Voici comment te sentir mieux:'
        },
        bulletPoints: {
          en: [
            '🌡️ Use a heating pad on your lower belly',
            '💊 Over-the-counter pain relief (with parent permission)',
            '🧘 Light exercise and stretching',
            '🍵 Warm drinks like herbal tea',
            '🛏️ Rest when you need to',
            '🍌 Eat potassium-rich foods (bananas)'
          ],
          sw: [
            '🌡️ Tumia kifaa cha joto kwenye tumbo lako la chini',
            '💊 Dawa za maumivu za kawaida (kwa idhini ya mzazi)',
            '🧘 Mazoezi nyepesi na kunyoosha',
            '🍵 Vinywaji vya moto kama chai ya mitishamba',
            '🛏️ Pumzika unapohitaji',
            '🍌 Kula vyakula vyenye potasiamu (ndizi)'
          ],
          fr: [
            '🌡️ Utilise une bouillotte sur le bas du ventre',
            '💊 Antidouleurs en vente libre (avec permission des parents)',
            '🧘 Exercices légers et étirements',
            '🍵 Boissons chaudes comme tisanes',
            '🛏️ Repose-toi quand tu en as besoin',
            '🍌 Mange des aliments riches en potassium (bananes)'
          ]
        },
        ageGroups: ['teen']
      },
      {
        id: 'when-to-see-doctor',
        title: { en: 'When to See a Doctor', sw: 'Wakati wa Kumuona Daktari', fr: 'Quand voir un médecin' },
        content: {
          en: 'Talk to a parent or doctor if you experience these symptoms:',
          sw: 'Zungumza na mzazi au daktari ikiwa unapata dalili hizi:',
          fr: 'Parle à un parent ou médecin si tu ressens ces symptômes:'
        },
        bulletPoints: {
          en: [
            '🚨 Very heavy bleeding (soaking through a pad in 1 hour)',
            '🚨 Periods lasting more than 7 days',
            '🚨 Severe pain that doesn\'t improve with rest',
            '🚨 No period by age 16',
            '🚨 Periods suddenly stop for 3+ months',
            '🚨 Fever during your period'
          ],
          sw: [
            '🚨 Kutoka damu nyingi sana (kujaza pedi katika saa 1)',
            '🚨 Hedhi inayodumu zaidi ya siku 7',
            '🚨 Maumivu makali yasiyoboreka na kupumzika',
            '🚨 Hakuna hedhi kufikia umri wa miaka 16',
            '🚨 Hedhi inasimama ghafla kwa miezi 3+',
            '🚨 Homa wakati wa hedhi yako'
          ],
          fr: [
            '🚨 Saignements très abondants (tremper une serviette en 1 heure)',
            '🚨 Règles durant plus de 7 jours',
            '🚨 Douleur sévère qui ne s\'améliore pas avec le repos',
            '🚨 Pas de règles à 16 ans',
            '🚨 Règles qui s\'arrêtent soudainement pendant 3+ mois',
            '🚨 Fièvre pendant tes règles'
          ]
        },
        warningSign: true,
        ageGroups: ['teen']
      }
    ]
  },
  {
    id: 'mental-health-teen',
    title: {
      en: 'Mental Health & Wellness',
      sw: 'Afya ya Akili na Ustawi',
      fr: 'Santé mentale et bien-être'
    },
    description: {
      en: 'Taking care of your mental health is just as important as physical health',
      sw: 'Kutunza afya yako ya akili ni muhimu kama afya ya kimwili',
      fr: 'Prendre soin de ta santé mentale est aussi important que la santé physique'
    },
    icon: '🧠',
    ageGroups: ['teen'],
    category: 'mental-health',
    color: 'from-purple-500 to-indigo-500',
    content: [
      {
        id: 'understanding-emotions',
        title: { en: 'Understanding Your Emotions', sw: 'Kuelewa Hisia Zako', fr: 'Comprendre tes émotions' },
        content: {
          en: 'It\'s completely normal to experience intense emotions during your teenage years. Hormonal changes affect how you feel.',
          sw: 'Ni kawaida kabisa kupitia hisia kali wakati wa ujana wako. Mabadiliko ya homoni yanaathiri jinsi unavyojisikia.',
          fr: 'Il est complètement normal de ressentir des émotions intenses pendant l\'adolescence. Les changements hormonaux affectent ce que tu ressens.'
        },
        bulletPoints: {
          en: [
            'Mood swings are normal but manageable',
            'Talk about your feelings with trusted people',
            'Journaling can help process emotions',
            'Physical activity releases feel-good chemicals',
            'Sleep affects your mood significantly'
          ],
          sw: [
            'Mabadiliko ya hisia ni ya kawaida lakini yanaweza kudhibitiwa',
            'Zungumza kuhusu hisia zako na watu unaowaamini',
            'Kuandika shajara kunaweza kusaidia kusindika hisia',
            'Shughuli za kimwili hutoa kemikali za kujisikia vizuri',
            'Kulala kunaathiri hali yako ya hisia sana'
          ],
          fr: [
            'Les sautes d\'humeur sont normales mais gérables',
            'Parle de tes sentiments avec des personnes de confiance',
            'Le journal intime peut aider à traiter les émotions',
            'L\'activité physique libère des substances chimiques agréables',
            'Le sommeil affecte considérablement ton humeur'
          ]
        },
        ageGroups: ['teen']
      },
      {
        id: 'stress-management',
        title: { en: 'Managing Stress', sw: 'Kudhibiti Msongo wa Mawazo', fr: 'Gérer le stress' },
        content: {
          en: 'School, friendships, and family can sometimes feel overwhelming. Here are healthy ways to cope:',
          sw: 'Shule, urafiki, na familia wakati mwingine zinaweza kuhisi kuzidiwa. Hapa kuna njia zenye afya za kukabiliana:',
          fr: 'L\'école, les amitiés et la famille peuvent parfois sembler accablantes. Voici des façons saines de faire face:'
        },
        bulletPoints: {
          en: [
            '🧘 Deep breathing exercises',
            '🎵 Listen to calming music',
            '📝 Break big tasks into smaller steps',
            '⏰ Manage your time with schedules',
            '🏃 Regular physical activity',
            '📵 Take breaks from social media'
          ],
          sw: [
            '🧘 Mazoezi ya kupumua kwa kina',
            '🎵 Sikiliza muziki wa kutuliza',
            '📝 Gawanya kazi kubwa kuwa hatua ndogo',
            '⏰ Simamia muda wako na ratiba',
            '🏃 Shughuli za kawaida za kimwili',
            '📵 Chukua mapumziko kutoka mitandao ya kijamii'
          ],
          fr: [
            '🧘 Exercices de respiration profonde',
            '🎵 Écoute de la musique apaisante',
            '📝 Divise les grandes tâches en petites étapes',
            '⏰ Gère ton temps avec des horaires',
            '🏃 Activité physique régulière',
            '📵 Fais des pauses des réseaux sociaux'
          ]
        },
        ageGroups: ['teen']
      },
      {
        id: 'getting-help',
        title: { en: 'When to Get Help', sw: 'Wakati wa Kupata Msaada', fr: 'Quand demander de l\'aide' },
        content: {
          en: 'It\'s brave to ask for help. Reach out if you experience:',
          sw: 'Ni ushujaa kuomba msaada. Wasiliana ikiwa unapitia:',
          fr: 'C\'est courageux de demander de l\'aide. Contacte quelqu\'un si tu ressens:'
        },
        bulletPoints: {
          en: [
            '😔 Persistent sadness for more than 2 weeks',
            '😰 Overwhelming anxiety that won\'t go away',
            '🚫 Thoughts of self-harm (seek help immediately)',
            '😴 Significant changes in sleep or appetite',
            '🔇 Withdrawing from friends and activities you enjoy'
          ],
          sw: [
            '😔 Huzuni inayoendelea kwa zaidi ya wiki 2',
            '😰 Wasiwasi mkubwa ambao hauendi',
            '🚫 Mawazo ya kujidhuru (tafuta msaada mara moja)',
            '😴 Mabadiliko makubwa katika kulala au hamu ya kula',
            '🔇 Kujiondoa kwa marafiki na shughuli unazofurahia'
          ],
          fr: [
            '😔 Tristesse persistante pendant plus de 2 semaines',
            '😰 Anxiété accablante qui ne disparaît pas',
            '🚫 Pensées d\'automutilation (cherche de l\'aide immédiatement)',
            '😴 Changements significatifs du sommeil ou de l\'appétit',
            '🔇 Retrait des amis et activités que tu aimes'
          ]
        },
        warningSign: true,
        ageGroups: ['teen']
      }
    ]
  },
  {
    id: 'body-image-teen',
    title: {
      en: 'Body Image & Self-Care',
      sw: 'Taswira ya Mwili na Kujitunza',
      fr: 'Image corporelle et soins personnels'
    },
    description: {
      en: 'Learning to appreciate and care for your changing body',
      sw: 'Kujifunza kuthamini na kutunza mwili wako unaobadilika',
      fr: 'Apprendre à apprécier et prendre soin de ton corps qui change'
    },
    icon: '💪',
    ageGroups: ['teen'],
    category: 'self-care',
    color: 'from-emerald-500 to-teal-500',
    content: [
      {
        id: 'healthy-body-image',
        title: { en: 'Healthy Body Image', sw: 'Taswira ya Mwili yenye Afya', fr: 'Image corporelle saine' },
        content: {
          en: 'Everyone\'s body is unique and develops at its own pace. Comparing yourself to others or media images isn\'t helpful.',
          sw: 'Mwili wa kila mtu ni wa kipekee na huendelea kwa kasi yake. Kujinganisha na wengine au picha za media hakusaidii.',
          fr: 'Le corps de chacun est unique et se développe à son propre rythme. Se comparer aux autres ou aux images médiatiques n\'aide pas.'
        },
        bulletPoints: {
          en: [
            'Bodies come in all shapes and sizes',
            'Social media often shows edited/filtered images',
            'Focus on what your body CAN do, not just how it looks',
            'Speak kindly to yourself',
            'Surround yourself with positive influences'
          ],
          sw: [
            'Miili ina maumbo na ukubwa wa kila aina',
            'Mitandao ya kijamii mara nyingi inaonyesha picha zilizohaririwa/zilizochujwa',
            'Zingatia kile mwili wako UNAWEZA kufanya, si tu jinsi unavyoonekana',
            'Jiongeleane kwa upole',
            'Jizungushe na ushawishi chanya'
          ],
          fr: [
            'Les corps existent dans toutes les formes et tailles',
            'Les réseaux sociaux montrent souvent des images éditées/filtrées',
            'Concentre-toi sur ce que ton corps PEUT faire, pas seulement son apparence',
            'Parle-toi gentiment',
            'Entoure-toi d\'influences positives'
          ]
        },
        ageGroups: ['teen']
      }
    ]
  },
  {
    id: 'nutrition-teen',
    title: {
      en: 'Nutrition for Growing Bodies',
      sw: 'Lishe kwa Miili Inayokua',
      fr: 'Nutrition pour les corps en croissance'
    },
    description: {
      en: 'Fuel your body right during this important growth phase',
      sw: 'Lisha mwili wako kwa usahihi wakati wa awamu hii muhimu ya ukuaji',
      fr: 'Nourris bien ton corps pendant cette phase de croissance importante'
    },
    icon: '🥗',
    ageGroups: ['teen'],
    category: 'nutrition',
    color: 'from-green-500 to-lime-500',
    content: [
      {
        id: 'teen-nutrition-needs',
        title: { en: 'What Your Body Needs', sw: 'Kinachohitajika na Mwili Wako', fr: 'Ce dont ton corps a besoin' },
        content: {
          en: 'During adolescence, your body needs extra nutrients to support growth and development.',
          sw: 'Wakati wa ujana, mwili wako unahitaji virutubisho vya ziada kusaidia ukuaji na maendeleo.',
          fr: 'Pendant l\'adolescence, ton corps a besoin de nutriments supplémentaires pour soutenir la croissance et le développement.'
        },
        bulletPoints: {
          en: [
            '🥛 Calcium - for strong bones (milk, yogurt, leafy greens)',
            '🥩 Protein - for muscle growth (meat, eggs, beans, nuts)',
            '🍊 Vitamin C - for immune health (fruits, vegetables)',
            '🥬 Iron - especially important for menstruating girls',
            '💧 Water - stay hydrated throughout the day',
            '🍎 Limit sugary drinks and processed foods'
          ],
          sw: [
            '🥛 Kalsiamu - kwa mifupa imara (maziwa, yoghurt, mboga za kijani)',
            '🥩 Protini - kwa ukuaji wa misuli (nyama, mayai, maharage, karanga)',
            '🍊 Vitamini C - kwa afya ya kinga (matunda, mboga)',
            '🥬 Chuma - muhimu hasa kwa wasichana wenye hedhi',
            '💧 Maji - kaa na maji mwili mzima wa siku',
            '🍎 Punguza vinywaji vyenye sukari na vyakula vilivyosindikwa'
          ],
          fr: [
            '🥛 Calcium - pour des os solides (lait, yaourt, légumes verts)',
            '🥩 Protéines - pour la croissance musculaire (viande, œufs, haricots, noix)',
            '🍊 Vitamine C - pour la santé immunitaire (fruits, légumes)',
            '🥬 Fer - particulièrement important pour les filles qui ont leurs règles',
            '💧 Eau - reste hydraté tout au long de la journée',
            '🍎 Limite les boissons sucrées et les aliments transformés'
          ]
        },
        ageGroups: ['teen']
      }
    ]
  },
  {
    id: 'sleep-teen',
    title: {
      en: 'Sleep & Rest',
      sw: 'Kulala na Kupumzika',
      fr: 'Sommeil et repos'
    },
    description: {
      en: 'Why sleep matters for teenagers',
      sw: 'Kwa nini kulala ni muhimu kwa vijana',
      fr: 'Pourquoi le sommeil est important pour les adolescents'
    },
    icon: '😴',
    ageGroups: ['teen'],
    category: 'sleep',
    color: 'from-indigo-500 to-purple-500',
    content: [
      {
        id: 'teen-sleep-needs',
        title: { en: 'How Much Sleep Do You Need?', sw: 'Unahitaji Kulala Kiasi Gani?', fr: 'De combien de sommeil as-tu besoin?' },
        content: {
          en: 'Teenagers need 8-10 hours of sleep per night. Your brain is still developing, and sleep is when important growth happens.',
          sw: 'Vijana wanahitaji masaa 8-10 ya kulala kwa usiku. Ubongo wako bado unaendelea, na kulala ndipo ukuaji muhimu unapotokea.',
          fr: 'Les adolescents ont besoin de 8-10 heures de sommeil par nuit. Ton cerveau se développe encore, et c\'est pendant le sommeil que la croissance importante se produit.'
        },
        bulletPoints: {
          en: [
            '📵 Put away screens 1 hour before bed',
            '🛏️ Keep a consistent sleep schedule',
            '🌙 Create a dark, quiet sleeping environment',
            '☕ Avoid caffeine in the afternoon',
            '📖 Develop a relaxing bedtime routine'
          ],
          sw: [
            '📵 Weka mbali skrini saa 1 kabla ya kulala',
            '🛏️ Weka ratiba thabiti ya kulala',
            '🌙 Tengeneza mazingira ya kulala yenye giza na utulivu',
            '☕ Epuka kafeini alasiri',
            '📖 Endeleza utaratibu wa kupumzika wa kulala'
          ],
          fr: [
            '📵 Range les écrans 1 heure avant de dormir',
            '🛏️ Garde un horaire de sommeil régulier',
            '🌙 Crée un environnement de sommeil sombre et calme',
            '☕ Évite la caféine l\'après-midi',
            '📖 Développe une routine de coucher relaxante'
          ]
        },
        ageGroups: ['teen']
      }
    ]
  }
];

// ADULT EDUCATION (18+)
export const adultEducation: EducationTopic[] = [
  {
    id: 'chronic-disease-management',
    title: {
      en: 'Chronic Disease Management',
      sw: 'Usimamizi wa Magonjwa Sugu',
      fr: 'Gestion des maladies chroniques'
    },
    description: {
      en: 'Managing long-term health conditions effectively',
      sw: 'Kusimamia hali za afya za muda mrefu kwa ufanisi',
      fr: 'Gérer efficacement les conditions de santé à long terme'
    },
    icon: '🏥',
    ageGroups: ['adult'],
    category: 'chronic-disease',
    color: 'from-red-500 to-rose-500',
    content: [
      {
        id: 'understanding-chronic',
        title: { en: 'Understanding Chronic Conditions', sw: 'Kuelewa Hali Sugu', fr: 'Comprendre les conditions chroniques' },
        content: {
          en: 'Chronic diseases require ongoing management but can be controlled with proper care.',
          sw: 'Magonjwa sugu yanahitaji usimamizi unaoendelea lakini yanaweza kudhibitiwa na huduma sahihi.',
          fr: 'Les maladies chroniques nécessitent une gestion continue mais peuvent être contrôlées avec des soins appropriés.'
        },
        bulletPoints: {
          en: [
            'Diabetes - monitor blood sugar, diet, exercise',
            'Hypertension - regular BP checks, medication adherence',
            'Asthma - identify triggers, use inhalers correctly',
            'Heart disease - cardiac rehabilitation, lifestyle changes',
            'Regular check-ups are essential'
          ],
          sw: [
            'Kisukari - fuatilia sukari ya damu, lishe, mazoezi',
            'Shinikizo la damu - uchunguzi wa kawaida wa BP, kufuata dawa',
            'Pumu - tambua vichochezi, tumia vizuliaji kwa usahihi',
            'Ugonjwa wa moyo - ukarabati wa moyo, mabadiliko ya mtindo wa maisha',
            'Uchunguzi wa kawaida ni muhimu'
          ],
          fr: [
            'Diabète - surveiller la glycémie, régime, exercice',
            'Hypertension - contrôles réguliers de la TA, adhésion aux médicaments',
            'Asthme - identifier les déclencheurs, utiliser correctement les inhalateurs',
            'Maladie cardiaque - réadaptation cardiaque, changements de mode de vie',
            'Les bilans réguliers sont essentiels'
          ]
        },
        ageGroups: ['adult']
      }
    ]
  },
  {
    id: 'preventive-care',
    title: {
      en: 'Preventive Health Care',
      sw: 'Huduma ya Afya ya Kuzuia',
      fr: 'Soins de santé préventifs'
    },
    description: {
      en: 'Screenings and check-ups to catch problems early',
      sw: 'Uchunguzi na uchunguzi wa kupata matatizo mapema',
      fr: 'Dépistages et bilans pour détecter les problèmes tôt'
    },
    icon: '🩺',
    ageGroups: ['adult'],
    category: 'preventive',
    color: 'from-teal-500 to-cyan-500',
    content: [
      {
        id: 'regular-screenings',
        title: { en: 'Recommended Screenings', sw: 'Uchunguzi Uliopendekezwa', fr: 'Dépistages recommandés' },
        content: {
          en: 'Regular screenings can detect health issues before symptoms appear.',
          sw: 'Uchunguzi wa kawaida unaweza kugundua masuala ya afya kabla dalili hazijatokea.',
          fr: 'Les dépistages réguliers peuvent détecter des problèmes de santé avant l\'apparition des symptômes.'
        },
        bulletPoints: {
          en: [
            'Blood pressure - at least once a year',
            'Cholesterol - every 4-6 years (more if at risk)',
            'Diabetes screening - every 3 years after age 45',
            'Cancer screenings - as recommended by your doctor',
            'Eye and dental exams - annually'
          ],
          sw: [
            'Shinikizo la damu - angalau mara moja kwa mwaka',
            'Cholesterol - kila miaka 4-6 (zaidi ikiwa uko hatarini)',
            'Uchunguzi wa kisukari - kila miaka 3 baada ya umri wa miaka 45',
            'Uchunguzi wa kansa - kama ilivyopendekezwa na daktari wako',
            'Mitihani ya macho na meno - kila mwaka'
          ],
          fr: [
            'Tension artérielle - au moins une fois par an',
            'Cholestérol - tous les 4-6 ans (plus si à risque)',
            'Dépistage du diabète - tous les 3 ans après 45 ans',
            'Dépistages du cancer - selon les recommandations de votre médecin',
            'Examens des yeux et dentaires - annuellement'
          ]
        },
        ageGroups: ['adult']
      }
    ]
  },
  {
    id: 'workplace-health',
    title: {
      en: 'Workplace Health',
      sw: 'Afya Mahali pa Kazi',
      fr: 'Santé au travail'
    },
    description: {
      en: 'Staying healthy while working',
      sw: 'Kukaa na afya wakati wa kufanya kazi',
      fr: 'Rester en bonne santé au travail'
    },
    icon: '💼',
    ageGroups: ['adult'],
    category: 'workplace',
    color: 'from-blue-500 to-indigo-500',
    content: [
      {
        id: 'office-ergonomics',
        title: { en: 'Office Ergonomics', sw: 'Ergonomia ya Ofisi', fr: 'Ergonomie de bureau' },
        content: {
          en: 'Proper workplace setup prevents pain and injury.',
          sw: 'Mpangilio sahihi wa mahali pa kazi unazuia maumivu na majeraha.',
          fr: 'Une bonne installation du lieu de travail prévient la douleur et les blessures.'
        },
        bulletPoints: {
          en: [
            'Screen at eye level',
            'Feet flat on floor or footrest',
            'Take breaks every 30-60 minutes',
            'Practice good posture',
            'Use proper lifting techniques'
          ],
          sw: [
            'Skrini kwenye kiwango cha macho',
            'Miguu bapa juu ya sakafu au kisahani cha miguu',
            'Chukua mapumziko kila dakika 30-60',
            'Fanya mkao mzuri',
            'Tumia mbinu sahihi za kuinua'
          ],
          fr: [
            'Écran au niveau des yeux',
            'Pieds à plat sur le sol ou repose-pieds',
            'Prenez des pauses toutes les 30-60 minutes',
            'Adoptez une bonne posture',
            'Utilisez des techniques de levage appropriées'
          ]
        },
        ageGroups: ['adult']
      }
    ]
  }
];

// DISABILITY EDUCATION
export const disabilityEducation: EducationTopic[] = [
  {
    id: 'living-with-disability',
    title: {
      en: 'Living with a Disability',
      sw: 'Kuishi na Ulemavu',
      fr: 'Vivre avec un handicap'
    },
    description: {
      en: 'Resources and tips for daily living',
      sw: 'Rasilimali na vidokezo vya maisha ya kila siku',
      fr: 'Ressources et conseils pour la vie quotidienne'
    },
    icon: '♿',
    ageGroups: ['child', 'teen', 'adult'],
    category: 'disability',
    color: 'from-purple-500 to-violet-500',
    content: [
      {
        id: 'daily-care',
        title: { en: 'Daily Care Tips', sw: 'Vidokezo vya Huduma ya Kila Siku', fr: 'Conseils de soins quotidiens' },
        content: {
          en: 'Maintaining independence and quality of life with a disability.',
          sw: 'Kudumisha uhuru na ubora wa maisha na ulemavu.',
          fr: 'Maintenir l\'indépendance et la qualité de vie avec un handicap.'
        },
        bulletPoints: {
          en: [
            'Establish consistent routines',
            'Use assistive devices as recommended',
            'Stay connected with support networks',
            'Advocate for your needs',
            'Focus on abilities, not limitations'
          ],
          sw: [
            'Anzisha utaratibu thabiti',
            'Tumia vifaa vya msaada kama ilivyopendekezwa',
            'Kaa umeunganishwa na mitandao ya msaada',
            'Tetea mahitaji yako',
            'Zingatia uwezo, si mapungufu'
          ],
          fr: [
            'Établissez des routines cohérentes',
            'Utilisez les appareils d\'assistance recommandés',
            'Restez connecté avec les réseaux de soutien',
            'Défendez vos besoins',
            'Concentrez-vous sur les capacités, pas les limitations'
          ]
        },
        ageGroups: ['child', 'teen', 'adult']
      }
    ]
  },
  {
    id: 'caregiver-guidance',
    title: {
      en: 'Caregiver Guidance',
      sw: 'Mwongozo wa Mlezi',
      fr: 'Guide du soignant'
    },
    description: {
      en: 'Supporting those who care for people with disabilities',
      sw: 'Kusaidia wale wanaotunza watu wenye ulemavu',
      fr: 'Soutenir ceux qui s\'occupent de personnes handicapées'
    },
    icon: '🤝',
    ageGroups: ['adult'],
    category: 'caregiving',
    color: 'from-pink-500 to-rose-500',
    content: [
      {
        id: 'caregiver-wellness',
        title: { en: 'Caregiver Self-Care', sw: 'Kujitunza kwa Mlezi', fr: 'Auto-soins du soignant' },
        content: {
          en: 'Taking care of yourself is essential to caring for others.',
          sw: 'Kujitunza ni muhimu kwa kuwatunza wengine.',
          fr: 'Prendre soin de soi est essentiel pour prendre soin des autres.'
        },
        bulletPoints: {
          en: [
            'Take regular breaks and rest',
            'Seek respite care when needed',
            'Join caregiver support groups',
            'Maintain your own health appointments',
            'Ask for and accept help from others'
          ],
          sw: [
            'Chukua mapumziko ya kawaida na kupumzika',
            'Tafuta huduma ya kupumzika inapohitajika',
            'Jiunge na vikundi vya msaada vya walezi',
            'Dumisha miadi yako ya afya',
            'Omba na ukubali msaada kutoka kwa wengine'
          ],
          fr: [
            'Prenez des pauses régulières et reposez-vous',
            'Cherchez des soins de répit au besoin',
            'Rejoignez des groupes de soutien aux aidants',
            'Maintenez vos propres rendez-vous de santé',
            'Demandez et acceptez l\'aide des autres'
          ]
        },
        ageGroups: ['adult']
      },
      {
        id: 'emergency-prep',
        title: { en: 'Emergency Preparedness', sw: 'Kujiandaa kwa Dharura', fr: 'Préparation aux urgences' },
        content: {
          en: 'Being prepared for emergencies when caring for someone with a disability.',
          sw: 'Kuwa tayari kwa dharura unapomtunza mtu mwenye ulemavu.',
          fr: 'Être préparé aux urgences lors de la prise en charge d\'une personne handicapée.'
        },
        bulletPoints: {
          en: [
            'Keep medical information readily accessible',
            'Have backup power for essential equipment',
            'Create an emergency contact list',
            'Practice evacuation procedures',
            'Stock necessary medications and supplies'
          ],
          sw: [
            'Weka habari za matibabu ziwe zinapatikana kwa urahisi',
            'Kuwa na nguvu ya akiba kwa vifaa muhimu',
            'Tengeneza orodha ya mawasiliano ya dharura',
            'Fanya mazoezi ya taratibu za kuondoka',
            'Hifadhi dawa na vifaa muhimu'
          ],
          fr: [
            'Gardez les informations médicales facilement accessibles',
            'Ayez une alimentation de secours pour les équipements essentiels',
            'Créez une liste de contacts d\'urgence',
            'Pratiquez les procédures d\'évacuation',
            'Stockez les médicaments et fournitures nécessaires'
          ]
        },
        ageGroups: ['adult']
      }
    ]
  }
];

// Helper function to get content based on age and language
export function getEducationContent(ageCategory: string, language: 'en' | 'sw' | 'fr' = 'en') {
  let ageGroup: AgeGroup;
  
  if (ageCategory === '0-5' || ageCategory === '6-12') {
    ageGroup = 'child';
  } else if (ageCategory === '13-17') {
    ageGroup = 'teen';
  } else {
    ageGroup = 'adult';
  }

  const allContent = [
    ...childrenEducation,
    ...teenEducation,
    ...adultEducation,
    ...disabilityEducation
  ];

  return allContent.filter(topic => topic.ageGroups.includes(ageGroup));
}

// Get topic by ID
export function getTopicById(topicId: string) {
  const allContent = [
    ...childrenEducation,
    ...teenEducation,
    ...adultEducation,
    ...disabilityEducation
  ];

  return allContent.find(topic => topic.id === topicId);
}
