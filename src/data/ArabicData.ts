// src/data/ArabicData.ts — Arabic learning content

export type ArabicLetter = {
  letter: string;
  name: string;
  transliteration: string;
  example: string;
  exampleMeaning: string;
  color: string;
  nonConnecting: boolean; // letters that only join on the right side (ا د ذ ر ز و)
};

export type Surah = {
  id: number;
  name: string;
  arabicName: string;
  meaning: string;
  verses: { arabic: string; transliteration: string; translation: string }[];
};

export type Dua = {
  id: number;
  title: string;
  occasion: string;
  arabic: string;
  transliteration: string;
  translation: string;
  emoji: string;
};

export const ARABIC_LETTERS: ArabicLetter[] = [
  { letter: 'ا', name: 'Alif',  transliteration: 'A',  example: 'أَسَد',   exampleMeaning: 'Lion',      color: '#FF6B6B', nonConnecting: true  },
  { letter: 'ب', name: 'Ba',    transliteration: 'B',  example: 'بَيْت',   exampleMeaning: 'House',     color: '#FF8E53', nonConnecting: false },
  { letter: 'ت', name: 'Ta',    transliteration: 'T',  example: 'تُفَّاح',  exampleMeaning: 'Apple',     color: '#FFB347', nonConnecting: false },
  { letter: 'ث', name: 'Tha',   transliteration: 'Th', example: 'ثَعْلَب',  exampleMeaning: 'Fox',       color: '#FFD700', nonConnecting: false },
  { letter: 'ج', name: 'Jim',   transliteration: 'J',  example: 'جَمَل',   exampleMeaning: 'Camel',     color: '#9EE09E', nonConnecting: false },
  { letter: 'ح', name: 'Ha',    transliteration: 'H',  example: 'حِمَار',   exampleMeaning: 'Donkey',    color: '#77DD77', nonConnecting: false },
  { letter: 'خ', name: 'Kha',   transliteration: 'Kh', example: 'خَرُوف',  exampleMeaning: 'Sheep',     color: '#4BC8A0', nonConnecting: false },
  { letter: 'د', name: 'Dal',   transliteration: 'D',  example: 'دَجَاجَة', exampleMeaning: 'Hen',       color: '#3FB5FF', nonConnecting: true  },
  { letter: 'ذ', name: 'Dhal',  transliteration: 'Dh', example: 'ذِئْب',   exampleMeaning: 'Wolf',      color: '#7BB8FF', nonConnecting: true  },
  { letter: 'ر', name: 'Ra',    transliteration: 'R',  example: 'رُمَّان',  exampleMeaning: 'Pomegranate', color: '#B68CFF', nonConnecting: true },
  { letter: 'ز', name: 'Zay',   transliteration: 'Z',  example: 'زَهْرَة',  exampleMeaning: 'Flower',    color: '#D898FF', nonConnecting: true  },
  { letter: 'س', name: 'Sin',   transliteration: 'S',  example: 'سَمَكَة',  exampleMeaning: 'Fish',      color: '#FF8CCC', nonConnecting: false },
  { letter: 'ش', name: 'Shin',  transliteration: 'Sh', example: 'شَجَرَة',  exampleMeaning: 'Tree',      color: '#FF6B9D', nonConnecting: false },
  { letter: 'ص', name: 'Sad',   transliteration: 'S',  example: 'صَقْر',   exampleMeaning: 'Falcon',    color: '#FF6B6B', nonConnecting: false },
  { letter: 'ض', name: 'Dad',   transliteration: 'D',  example: 'ضِفْدَع',  exampleMeaning: 'Frog',      color: '#FF8E53', nonConnecting: false },
  { letter: 'ط', name: 'Ta',    transliteration: 'T',  example: 'طَاوُوس',  exampleMeaning: 'Peacock',   color: '#FFB347', nonConnecting: false },
  { letter: 'ظ', name: 'Dha',   transliteration: 'Dh', example: 'ظَبْي',   exampleMeaning: 'Deer',      color: '#FFD700', nonConnecting: false },
  { letter: 'ع', name: 'Ain',   transliteration: 'A',  example: 'عَصْفُور', exampleMeaning: 'Sparrow',   color: '#9EE09E', nonConnecting: false },
  { letter: 'غ', name: 'Ghain', transliteration: 'Gh', example: 'غُرَاب',  exampleMeaning: 'Crow',      color: '#77DD77', nonConnecting: false },
  { letter: 'ف', name: 'Fa',    transliteration: 'F',  example: 'فِيل',    exampleMeaning: 'Elephant',  color: '#4BC8A0', nonConnecting: false },
  { letter: 'ق', name: 'Qaf',   transliteration: 'Q',  example: 'قِطّ',    exampleMeaning: 'Cat',       color: '#3FB5FF', nonConnecting: false },
  { letter: 'ك', name: 'Kaf',   transliteration: 'K',  example: 'كَلْب',   exampleMeaning: 'Dog',       color: '#7BB8FF', nonConnecting: false },
  { letter: 'ل', name: 'Lam',   transliteration: 'L',  example: 'لَيْمُون', exampleMeaning: 'Lemon',    color: '#B68CFF', nonConnecting: false },
  { letter: 'م', name: 'Mim',   transliteration: 'M',  example: 'مَوْز',   exampleMeaning: 'Banana',    color: '#D898FF', nonConnecting: false },
  { letter: 'ن', name: 'Nun',   transliteration: 'N',  example: 'نَمْلَة',  exampleMeaning: 'Ant',       color: '#FF8CCC', nonConnecting: false },
  { letter: 'ه', name: 'Ha',    transliteration: 'H',  example: 'هِرّ',    exampleMeaning: 'Cat',       color: '#FF6B9D', nonConnecting: false },
  { letter: 'و', name: 'Waw',   transliteration: 'W',  example: 'وَرْد',   exampleMeaning: 'Rose',      color: '#FF6B6B', nonConnecting: true  },
  { letter: 'ي', name: 'Ya',    transliteration: 'Y',  example: 'يَد',    exampleMeaning: 'Hand',      color: '#FF8E53', nonConnecting: false },
];

export const SURAHS: Surah[] = [
  {
    id: 1,
    name: 'Al-Fatiha',
    arabicName: 'الْفَاتِحَة',
    meaning: 'The Opening',
    verses: [
      { arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Bismillāhir-raḥmānir-raḥīm', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.' },
      { arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', transliteration: 'Alḥamdu lillāhi rabbil-ʿālamīn', translation: '[All] praise is [due] to Allah, Lord of the worlds –' },
      { arabic: 'الرَّحْمَٰنِ الرَّحِيمِ', transliteration: 'Ar-raḥmānir-raḥīm', translation: 'The Entirely Merciful, the Especially Merciful,' },
      { arabic: 'مَالِكِ يَوْمِ الدِّينِ', transliteration: 'Māliki yawmid-dīn', translation: 'Sovereign of the Day of Recompense.' },
      { arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', transliteration: 'Iyyāka naʿbudu wa iyyāka nastaʿīn', translation: 'It is You we worship and You we ask for help.' },
      { arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', transliteration: 'Ihdinash-shirāṭal-mustaqīm', translation: 'Guide us to the straight path –' },
      { arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', transliteration: 'Ṣirāṭal-ladhīna anʿamta ʿalayhim ghayril-maghḍūbi ʿalayhim wa laḍ-ḍāllīn', translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.' },
    ],
  },
  {
    id: 112,
    name: 'Al-Ikhlas',
    arabicName: 'الْإِخْلَاص',
    meaning: 'Sincerity',
    verses: [
      { arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ', transliteration: 'Qul huwal-lāhu aḥad', translation: 'Say, "He is Allah, [who is] One,' },
      { arabic: 'اللَّهُ الصَّمَدُ', transliteration: 'Allāhuṣ-ṣamad', translation: 'Allah, the Eternal Refuge.' },
      { arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ', transliteration: 'Lam yalid wa lam yūlad', translation: 'He neither begets nor is born,' },
      { arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ', transliteration: 'Wa lam yakul-lahū kufuwan aḥad', translation: 'Nor is there to Him any equivalent."' },
    ],
  },
  {
    id: 113,
    name: 'Al-Falaq',
    arabicName: 'الْفَلَق',
    meaning: 'The Daybreak',
    verses: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ', transliteration: 'Qul aʿūdhu biraббil-falaq', translation: 'Say, "I seek refuge in the Lord of daybreak' },
      { arabic: 'مِن شَرِّ مَا خَلَقَ', transliteration: 'Min sharri mā khalaq', translation: 'From the evil of that which He created' },
      { arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ', transliteration: 'Wa min sharri ghāsiqin idhā waqab', translation: 'And from the evil of darkness when it settles' },
      { arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ', transliteration: 'Wa min sharrin-naffāthāti fil-ʿuqad', translation: 'And from the evil of the blowers in knots' },
      { arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ', transliteration: 'Wa min sharri ḥāsidin idhā ḥasad', translation: 'And from the evil of an envier when he envies."' },
    ],
  },
  {
    id: 114,
    name: 'An-Nas',
    arabicName: 'النَّاس',
    meaning: 'Mankind',
    verses: [
      { arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ', transliteration: 'Qul aʿūdhu birabbin-nās', translation: 'Say, "I seek refuge in the Lord of mankind,' },
      { arabic: 'مَلِكِ النَّاسِ', transliteration: 'Malikin-nās', translation: 'The Sovereign of mankind.' },
      { arabic: 'إِلَٰهِ النَّاسِ', transliteration: 'Ilāhin-nās', translation: 'The God of mankind,' },
      { arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ', transliteration: 'Min sharril-waswāsil-khannās', translation: 'From the evil of the retreating whisperer –' },
      { arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ', transliteration: 'Alladhī yuwaswisu fī ṣudūrin-nās', translation: 'Who whispers [evil] into the breasts of mankind –' },
      { arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ', transliteration: 'Minal-jinnati wan-nās', translation: 'From among the jinn and mankind."' },
    ],
  },
  {
    id: 108,
    name: 'Al-Kawthar',
    arabicName: 'الْكَوْثَر',
    meaning: 'Abundance',
    verses: [
      { arabic: 'إِنَّا أَعْطَيْنَاكَ الْكَوْثَرَ', transliteration: 'Innā aʿṭaynākal-kawthar', translation: 'Indeed, We have granted you, [O Muhammad], al-Kawthar.' },
      { arabic: 'فَصَلِّ لِرَبِّكَ وَانْحَرْ', transliteration: 'Faṣalli lirabbika wanḥar', translation: 'So pray to your Lord and sacrifice [to Him alone].' },
      { arabic: 'إِنَّ شَانِئَكَ هُوَ الْأَبْتَرُ', transliteration: 'Inna shāniʾaka huwal-abtar', translation: 'Indeed, your enemy is the one cut off.' },
    ],
  },
  {
    id: 103,
    name: 'Al-Asr',
    arabicName: 'الْعَصْر',
    meaning: 'The Declining Day',
    verses: [
      { arabic: 'وَالْعَصْرِ', transliteration: 'Wal-ʿaṣr', translation: 'By time,' },
      { arabic: 'إِنَّ الْإِنسَانَ لَفِي خُسْرٍ', transliteration: 'Innal-insāna lafī khusr', translation: 'Indeed, mankind is in loss,' },
      { arabic: 'إِلَّا الَّذِينَ آمَنُوا وَعَمِلُوا الصَّالِحَاتِ وَتَوَاصَوْا بِالْحَقِّ وَتَوَاصَوْا بِالصَّبْرِ', transliteration: 'Illal-ladhīna āmanū wa ʿamiluṣ-ṣāliḥāti wa tawāṣaw bil-ḥaqqi wa tawāṣaw biṣ-ṣabr', translation: 'Except for those who have believed and done righteous deeds and advised each other to truth and advised each other to patience.' },
    ],
  },
];

export const DUAS: Dua[] = [
  {
    id: 1,
    title: 'Before Eating',
    occasion: 'Say before every meal',
    arabic: 'بِسْمِ اللّهِ',
    transliteration: 'Bismillāh',
    translation: 'In the name of Allah.',
    emoji: '🍽️',
  },
  {
    id: 2,
    title: 'After Eating',
    occasion: 'Say after finishing your food',
    arabic: 'الْحَمْدُ لِلّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    transliteration: 'Alḥamdulillāhil-ladhī aṭʿamanā wa saqānā wa jaʿalanā muslimīn',
    translation: 'All praise is for Allah who fed us, gave us drink, and made us Muslims.',
    emoji: '😋',
  },
  {
    id: 3,
    title: 'Before Sleeping',
    occasion: 'Say when going to bed',
    arabic: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا',
    transliteration: 'Allāhumma bismika amūtu wa aḥyā',
    translation: 'O Allah, in Your name I die and I live.',
    emoji: '😴',
  },
  {
    id: 4,
    title: 'Waking Up',
    occasion: 'Say when you wake up in the morning',
    arabic: 'الْحَمْدُ لِلّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    transliteration: 'Alḥamdulillāhil-ladhī aḥyānā baʿda mā amātanā wa ilayhīn-nushūr',
    translation: 'All praise is for Allah who gave us life after having taken it from us, and unto Him is the resurrection.',
    emoji: '🌅',
  },
  {
    id: 5,
    title: 'Entering Home',
    occasion: 'Say when entering your home',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ الْمَوْلَجِ وَخَيْرَ الْمَخْرَجِ بِسْمِ اللَّهِ وَلَجْنَا وَبِسْمِ اللَّهِ خَرَجْنَا وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    transliteration: 'Allāhumma innī asʾaluka khayral-mawlaji wa khayral-makhraj, bismillāhi walajnā, wa bismillāhi kharajnā, wa ʿalallāhi rabbinā tawakkalnā',
    translation: 'O Allah, I ask You for the good of the entry and the good of the exit. In the name of Allah we enter, in the name of Allah we leave, and upon Allah our Lord we rely.',
    emoji: '🏠',
  },
  {
    id: 6,
    title: 'Leaving Home',
    occasion: 'Say when leaving your home',
    arabic: 'بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ وَلَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'Bismillāhi, tawakkaltu ʿalallāh, wa lā ḥawla wa lā quwwata illā billāh',
    translation: 'In the name of Allah, I place my trust in Allah, and there is no might nor power except with Allah.',
    emoji: '🚶',
  },
  {
    id: 7,
    title: 'Entering Toilet',
    occasion: 'Say before entering the bathroom',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    transliteration: 'Allāhumma innī aʿūdhu bika minal-khubuthi wal-khabāʾith',
    translation: 'O Allah, I seek Your protection from evil and the evil ones.',
    emoji: '🚻',
  },
  {
    id: 8,
    title: 'After Wudu',
    occasion: 'Say after making ablution (wudu)',
    arabic: 'أَشْهَدُ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا عَبْدُهُ وَرَسُولُهُ',
    transliteration: 'Ashhadu an lā ilāha illallāh waḥdahū lā sharīka lah, wa ashhadu anna Muḥammadan ʿabduhū wa rasūluh',
    translation: 'I bear witness that there is no god but Allah alone, He has no partner; and I bear witness that Muhammad is His servant and Messenger.',
    emoji: '💧',
  },
  {
    id: 9,
    title: 'For Parents',
    occasion: 'Pray for your mom and dad',
    arabic: 'رَّبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا',
    transliteration: 'Rabbir-ḥamhumā kamā rabbayānī ṣaghīrā',
    translation: 'My Lord, have mercy upon them as they brought me up [when I was] small.',
    emoji: '❤️',
  },
  {
    id: 10,
    title: 'Travelling',
    occasion: 'Say when going on a journey',
    arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ',
    transliteration: 'Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahū muqrinīn, wa innā ilā rabbinā lamunqalibūn',
    translation: 'Glory be to Him who has subjected this to us, and we could not have [otherwise] subdued it. And indeed we, to our Lord, will [surely] return.',
    emoji: '✈️',
  },
];
