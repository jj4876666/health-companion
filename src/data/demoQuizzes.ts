import { Quiz } from '@/types/emec';

export const demoQuizzes: Quiz[] = [
  {
    id: 'quiz-001',
    title: 'Hygiene Basics',
    titleSw: 'Misingi ya Usafi',
    description: 'Learn about proper hygiene practices',
    descriptionSw: 'Jifunze kuhusu mazoea sahihi ya usafi',
    category: 'hygiene',
    difficulty: 'easy',
    points: 50,
    isAgeRestricted: false,
    questions: [
      {
        id: 'q1',
        question: 'How long should you wash your hands?',
        questionSw: 'Unapaswa kunawa mikono kwa muda gani?',
        options: ['5 seconds', '20 seconds', '1 minute', '5 minutes'],
        optionsSw: ['Sekunde 5', 'Sekunde 20', 'Dakika 1', 'Dakika 5'],
        correctIndex: 1,
        explanation: 'You should wash hands for at least 20 seconds to remove germs effectively.',
        explanationSw: 'Unapaswa kunawa mikono kwa sekunde 20 kuondoa vijidudu kikamilifu.',
      },
      {
        id: 'q2',
        question: 'When should you brush your teeth?',
        questionSw: 'Unapaswa kupiga mswaki lini?',
        options: ['Once a week', 'Once a day', 'Twice a day', 'After every meal'],
        optionsSw: ['Mara moja kwa wiki', 'Mara moja kwa siku', 'Mara mbili kwa siku', 'Baada ya kila mlo'],
        correctIndex: 2,
        explanation: 'Brushing twice daily helps maintain good oral health.',
        explanationSw: 'Kupiga mswaki mara mbili kwa siku husaidia kudumisha afya njema ya mdomo.',
      },
      {
        id: 'q3',
        question: 'What helps prevent the spread of germs?',
        questionSw: 'Nini husaidia kuzuia kuenea kwa vijidudu?',
        options: ['Sharing towels', 'Covering your cough', 'Not washing hands', 'Using dirty utensils'],
        optionsSw: ['Kushiriki taulo', 'Kufunika kikohozi chako', 'Kutokawa mikono', 'Kutumia vyombo vichafu'],
        correctIndex: 1,
        explanation: 'Covering your cough prevents germs from spreading to others.',
        explanationSw: 'Kufunika kikohozi chako huzuia vijidudu kuenea kwa wengine.',
      },
    ],
  },
  {
    id: 'quiz-002',
    title: 'Healthy Eating',
    titleSw: 'Kula Kiafya',
    description: 'Test your knowledge about nutrition',
    descriptionSw: 'Jaribu ujuzi wako kuhusu lishe',
    category: 'nutrition',
    difficulty: 'easy',
    points: 50,
    isAgeRestricted: false,
    questions: [
      {
        id: 'q1',
        question: 'Which food group provides the most energy?',
        questionSw: 'Kundi lipi la chakula hutoa nguvu zaidi?',
        options: ['Proteins', 'Carbohydrates', 'Vitamins', 'Minerals'],
        optionsSw: ['Protini', 'Wanga', 'Vitamini', 'Madini'],
        correctIndex: 1,
        explanation: 'Carbohydrates are the body\'s main source of energy.',
        explanationSw: 'Wanga ni chanzo kikuu cha nguvu kwa mwili.',
      },
      {
        id: 'q2',
        question: 'How many glasses of water should you drink daily?',
        questionSw: 'Unapaswa kunywa glasi ngapi za maji kwa siku?',
        options: ['2 glasses', '4 glasses', '6-8 glasses', '10-12 glasses'],
        optionsSw: ['Glasi 2', 'Glasi 4', 'Glasi 6-8', 'Glasi 10-12'],
        correctIndex: 2,
        explanation: 'Drinking 6-8 glasses of water daily keeps you hydrated.',
        explanationSw: 'Kunywa glasi 6-8 za maji kwa siku hukuweka na maji ya kutosha.',
      },
      {
        id: 'q3',
        question: 'Which vitamin do we get from sunlight?',
        questionSw: 'Vitamini gani tunapata kutoka jua?',
        options: ['Vitamin A', 'Vitamin B', 'Vitamin C', 'Vitamin D'],
        optionsSw: ['Vitamini A', 'Vitamini B', 'Vitamini C', 'Vitamini D'],
        correctIndex: 3,
        explanation: 'Our bodies produce Vitamin D when exposed to sunlight.',
        explanationSw: 'Miili yetu huzalisha Vitamini D tunapoangaziwa na jua.',
      },
    ],
  },
  {
    id: 'quiz-003',
    title: 'First Aid Knowledge',
    titleSw: 'Ujuzi wa Msaada wa Kwanza',
    description: 'Learn essential first aid skills',
    descriptionSw: 'Jifunze ujuzi muhimu wa msaada wa kwanza',
    category: 'safety',
    difficulty: 'medium',
    points: 75,
    isAgeRestricted: false,
    questions: [
      {
        id: 'q1',
        question: 'What should you do first for a minor burn?',
        questionSw: 'Nini cha kufanya kwanza kwa kuchomwa kidogo?',
        options: ['Apply butter', 'Run cool water', 'Cover with cloth', 'Apply ice directly'],
        optionsSw: ['Paka siagi', 'Mwaga maji baridi', 'Funika kwa nguo', 'Weka barafu moja kwa moja'],
        correctIndex: 1,
        explanation: 'Cool running water helps reduce pain and prevent further damage.',
        explanationSw: 'Maji baridi yanayotiririka husaidia kupunguza maumivu na kuzuia uharibifu zaidi.',
      },
      {
        id: 'q2',
        question: 'For a nosebleed, you should:',
        questionSw: 'Kwa kutoka damu puani, unapaswa:',
        options: ['Tilt head back', 'Pinch nose and lean forward', 'Lie down flat', 'Blow your nose'],
        optionsSw: ['Inama nyuma', 'Bana pua na inama mbele', 'Lala chini', 'Piga pua'],
        correctIndex: 1,
        explanation: 'Pinching the nose and leaning forward prevents blood from going down the throat.',
        explanationSw: 'Kubana pua na kuinama mbele huzuia damu kwenda kooni.',
      },
    ],
  },
  {
    id: 'quiz-004',
    title: 'Understanding Your Body',
    titleSw: 'Kuelewa Mwili Wako',
    description: 'Learn about body changes during puberty',
    descriptionSw: 'Jifunze kuhusu mabadiliko ya mwili wakati wa kubalehe',
    category: 'health',
    difficulty: 'medium',
    points: 100,
    isAgeRestricted: true,
    minAge: 10,
    questions: [
      {
        id: 'q1',
        question: 'Puberty typically begins between ages:',
        questionSw: 'Kubalehe huanza kawaida kati ya umri:',
        options: ['5-7 years', '8-14 years', '15-18 years', '18-21 years'],
        optionsSw: ['Miaka 5-7', 'Miaka 8-14', 'Miaka 15-18', 'Miaka 18-21'],
        correctIndex: 1,
        explanation: 'Puberty typically begins between ages 8-14, varying by individual.',
        explanationSw: 'Kubalehe huanza kawaida kati ya umri wa miaka 8-14, inategemea mtu.',
      },
      {
        id: 'q2',
        question: 'Which hormone triggers puberty?',
        questionSw: 'Homoni gani husababisha kubalehe?',
        options: ['Insulin', 'Adrenaline', 'Growth hormones', 'Melatonin'],
        optionsSw: ['Insulini', 'Adrenalini', 'Homoni za ukuaji', 'Melatonini'],
        correctIndex: 2,
        explanation: 'Growth hormones and sex hormones trigger the changes of puberty.',
        explanationSw: 'Homoni za ukuaji na homoni za ngono husababisha mabadiliko ya kubalehe.',
      },
    ],
  },
];

export const getQuizById = (id: string): Quiz | undefined => {
  return demoQuizzes.find((quiz) => quiz.id === id);
};

export const getQuizzesByCategory = (category: string): Quiz[] => {
  return demoQuizzes.filter((quiz) => quiz.category === category);
};

export const getAvailableQuizzesForAge = (age: number): Quiz[] => {
  return demoQuizzes.filter(
    (quiz) => !quiz.isAgeRestricted || (quiz.minAge && age >= quiz.minAge)
  );
};
