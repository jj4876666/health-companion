import { Quiz } from '@/types/emec';

// Get today's date as seed for "daily" quizzes
const getDayOfYear = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const demoQuizzes: Quiz[] = [
  // EASY QUIZZES
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
  // INTERMEDIATE QUIZZES
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
      {
        id: 'q3',
        question: 'What is the recovery position used for?',
        questionSw: 'Msimamo wa kupona hutumiwa kwa nini?',
        options: ['Sleeping', 'Unconscious but breathing person', 'Exercise', 'Back pain'],
        optionsSw: ['Kulala', 'Mtu asiye na fahamu lakini anapumua', 'Mazoezi', 'Maumivu ya mgongo'],
        correctIndex: 1,
        explanation: 'The recovery position keeps airways open for an unconscious but breathing person.',
        explanationSw: 'Msimamo wa kupona huweka njia za hewa wazi kwa mtu asiye na fahamu lakini anapumua.',
      },
    ],
  },
  {
    id: 'quiz-005',
    title: 'Disease Prevention',
    titleSw: 'Kuzuia Magonjwa',
    description: 'Learn how to prevent common diseases',
    descriptionSw: 'Jifunze jinsi ya kuzuia magonjwa ya kawaida',
    category: 'health',
    difficulty: 'medium',
    points: 75,
    isAgeRestricted: false,
    questions: [
      {
        id: 'q1',
        question: 'Malaria is transmitted by:',
        questionSw: 'Malaria huenezwa na:',
        options: ['Dirty water', 'Mosquitoes', 'Bad food', 'Cold weather'],
        optionsSw: ['Maji machafu', 'Mbu', 'Chakula kibaya', 'Hali ya baridi'],
        correctIndex: 1,
        explanation: 'Malaria is transmitted through bites from infected mosquitoes.',
        explanationSw: 'Malaria huenezwa kupitia kuumwa na mbu walioambukizwa.',
      },
      {
        id: 'q2',
        question: 'How can you prevent cholera?',
        questionSw: 'Unawezaje kuzuia kipindupindu?',
        options: ['Eat more meat', 'Drink clean water', 'Sleep more', 'Exercise daily'],
        optionsSw: ['Kula nyama zaidi', 'Kunywa maji safi', 'Kulala zaidi', 'Kufanya mazoezi kila siku'],
        correctIndex: 1,
        explanation: 'Cholera is prevented by drinking clean, safe water and proper sanitation.',
        explanationSw: 'Kipindupindu huzuiwa kwa kunywa maji safi, salama na usafi wa mazingira.',
      },
      {
        id: 'q3',
        question: 'Vaccines help by:',
        questionSw: 'Chanjo husaidia kwa:',
        options: ['Curing diseases', 'Preventing diseases', 'Making you sick', 'Nothing'],
        optionsSw: ['Kuponya magonjwa', 'Kuzuia magonjwa', 'Kukufanya mgonjwa', 'Hakuna'],
        correctIndex: 1,
        explanation: 'Vaccines train your immune system to prevent diseases before you get them.',
        explanationSw: 'Chanjo hufunza mfumo wako wa kinga kuzuia magonjwa kabla hujapata.',
      },
    ],
  },
  // DIFFICULT QUIZZES
  {
    id: 'quiz-004',
    title: 'Understanding Your Body',
    titleSw: 'Kuelewa Mwili Wako',
    description: 'Learn about body changes during puberty',
    descriptionSw: 'Jifunze kuhusu mabadiliko ya mwili wakati wa kubalehe',
    category: 'health',
    difficulty: 'hard',
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
  {
    id: 'quiz-006',
    title: 'Advanced Nutrition',
    titleSw: 'Lishe ya Juu',
    description: 'Deep dive into nutritional science',
    descriptionSw: 'Jifunze kwa kina kuhusu sayansi ya lishe',
    category: 'nutrition',
    difficulty: 'hard',
    points: 100,
    isAgeRestricted: false,
    questions: [
      {
        id: 'q1',
        question: 'Which nutrient has 9 calories per gram?',
        questionSw: 'Lishe ipi ina kalori 9 kwa gramu?',
        options: ['Protein', 'Carbohydrates', 'Fat', 'Fiber'],
        optionsSw: ['Protini', 'Wanga', 'Mafuta', 'Nyuzinyuzi'],
        correctIndex: 2,
        explanation: 'Fat provides 9 calories per gram, while protein and carbs provide 4.',
        explanationSw: 'Mafuta hutoa kalori 9 kwa gramu, wakati protini na wanga hutoa 4.',
      },
      {
        id: 'q2',
        question: 'Iron deficiency causes:',
        questionSw: 'Upungufu wa chuma husababisha:',
        options: ['Night blindness', 'Anemia', 'Scurvy', 'Rickets'],
        optionsSw: ['Kutokona usiku', 'Upungufu wa damu', 'Skavi', 'Ugonjwa wa mifupa'],
        correctIndex: 1,
        explanation: 'Iron deficiency leads to anemia, causing fatigue and weakness.',
        explanationSw: 'Upungufu wa chuma husababisha upungufu wa damu, na kusababisha uchovu.',
      },
      {
        id: 'q3',
        question: 'The glycemic index measures:',
        questionSw: 'Kielezo cha glycemic hupima:',
        options: ['Vitamin content', 'Blood sugar impact', 'Calorie count', 'Protein quality'],
        optionsSw: ['Kiwango cha vitamini', 'Athari kwa sukari ya damu', 'Idadi ya kalori', 'Ubora wa protini'],
        correctIndex: 1,
        explanation: 'Glycemic index measures how quickly foods raise blood sugar levels.',
        explanationSw: 'Kielezo cha glycemic hupima jinsi vyakula vinavyoongeza sukari ya damu haraka.',
      },
    ],
  },
];

// Endless mode questions pool
export const endlessQuestions = [
  {
    id: 'endless-1',
    question: 'The human body has how many bones?',
    questionSw: 'Mwili wa binadamu una mifupa mingapi?',
    options: ['106', '156', '206', '256'],
    optionsSw: ['106', '156', '206', '256'],
    correctIndex: 2,
    explanation: 'An adult human has 206 bones.',
    explanationSw: 'Mtu mzima ana mifupa 206.',
    category: 'health',
  },
  {
    id: 'endless-2',
    question: 'Which organ pumps blood through the body?',
    questionSw: 'Ni kiungo gani kinasukuma damu mwilini?',
    options: ['Brain', 'Lungs', 'Heart', 'Liver'],
    optionsSw: ['Ubongo', 'Mapafu', 'Moyo', 'Ini'],
    correctIndex: 2,
    explanation: 'The heart pumps blood throughout the body.',
    explanationSw: 'Moyo husukuma damu mwili mzima.',
    category: 'health',
  },
  {
    id: 'endless-3',
    question: 'Spinach is rich in:',
    questionSw: 'Mchicha una wingi wa:',
    options: ['Calcium', 'Iron', 'Vitamin C', 'All of the above'],
    optionsSw: ['Kalsiamu', 'Chuma', 'Vitamini C', 'Yote hapo juu'],
    correctIndex: 3,
    explanation: 'Spinach contains calcium, iron, vitamin C and many other nutrients.',
    explanationSw: 'Mchicha una kalsiamu, chuma, vitamini C na virutubisho vingine vingi.',
    category: 'nutrition',
  },
  {
    id: 'endless-4',
    question: 'How often should you exercise per week?',
    questionSw: 'Unapaswa kufanya mazoezi mara ngapi kwa wiki?',
    options: ['Once', '2-3 times', '3-5 times', 'Every day'],
    optionsSw: ['Mara moja', 'Mara 2-3', 'Mara 3-5', 'Kila siku'],
    correctIndex: 2,
    explanation: 'Exercising 3-5 times per week is recommended for good health.',
    explanationSw: 'Kufanya mazoezi mara 3-5 kwa wiki kunapendekezwa kwa afya njema.',
    category: 'health',
  },
  {
    id: 'endless-5',
    question: 'Sleep helps with:',
    questionSw: 'Usingizi husaidia na:',
    options: ['Memory', 'Growth', 'Healing', 'All of the above'],
    optionsSw: ['Kumbukumbu', 'Ukuaji', 'Uponyaji', 'Yote hapo juu'],
    correctIndex: 3,
    explanation: 'Sleep is essential for memory, growth, and healing.',
    explanationSw: 'Usingizi ni muhimu kwa kumbukumbu, ukuaji, na uponyaji.',
    category: 'health',
  },
  {
    id: 'endless-6',
    question: 'Ugali is mainly a source of:',
    questionSw: 'Ugali ni chanzo kikuu cha:',
    options: ['Protein', 'Carbohydrates', 'Vitamins', 'Fats'],
    optionsSw: ['Protini', 'Wanga', 'Vitamini', 'Mafuta'],
    correctIndex: 1,
    explanation: 'Ugali is made from maize flour, which is rich in carbohydrates.',
    explanationSw: 'Ugali hutengenezwa kutoka unga wa mahindi, ambao una wanga mwingi.',
    category: 'nutrition',
  },
  {
    id: 'endless-7',
    question: 'Which is NOT a symptom of dehydration?',
    questionSw: 'Ni ipi SIYO dalili ya upungufu wa maji?',
    options: ['Thirst', 'Dark urine', 'Fever', 'Headache'],
    optionsSw: ['Kiu', 'Mkojo mweusi', 'Homa', 'Maumivu ya kichwa'],
    correctIndex: 2,
    explanation: 'Fever is not typically a symptom of dehydration.',
    explanationSw: 'Homa si dalili ya kawaida ya upungufu wa maji.',
    category: 'health',
  },
  {
    id: 'endless-8',
    question: 'Mosquito nets help prevent:',
    questionSw: 'Chandarua husaidia kuzuia:',
    options: ['Cold', 'Malaria', 'Cholera', 'Typhoid'],
    optionsSw: ['Homa', 'Malaria', 'Kipindupindu', 'Homa ya matumbo'],
    correctIndex: 1,
    explanation: 'Sleeping under mosquito nets prevents malaria by blocking mosquitoes.',
    explanationSw: 'Kulala chini ya chandarua huzuia malaria kwa kuzuia mbu.',
    category: 'safety',
  },
];

export const getQuizById = (id: string): Quiz | undefined => {
  return demoQuizzes.find((quiz) => quiz.id === id);
};

export const getQuizzesByCategory = (category: string): Quiz[] => {
  return demoQuizzes.filter((quiz) => quiz.category === category);
};

export const getQuizzesByDifficulty = (difficulty: 'easy' | 'medium' | 'hard'): Quiz[] => {
  return demoQuizzes.filter((quiz) => quiz.difficulty === difficulty);
};

export const getAvailableQuizzesForAge = (age: number): Quiz[] => {
  return demoQuizzes.filter(
    (quiz) => !quiz.isAgeRestricted || (quiz.minAge && age >= quiz.minAge)
  );
};

// Get daily quiz based on day of year
export const getDailyQuiz = (): Quiz => {
  const dayOfYear = getDayOfYear();
  const availableQuizzes = demoQuizzes.filter(q => !q.isAgeRestricted);
  return availableQuizzes[dayOfYear % availableQuizzes.length];
};

// Get random endless questions
export const getEndlessQuestions = (count: number = 10) => {
  const shuffled = [...endlessQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};