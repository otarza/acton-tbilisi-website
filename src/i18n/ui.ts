/**
 * Short interface strings (buttons, labels, aria text) that are not page content.
 * Page content lives in src/content/. To add a language: copy the `ka` block, translate it,
 * and add the locale in astro.config.mjs (see docs/I18N.md).
 */
export const ui = {
  ka: {
    skipToContent: 'მთავარ შინაარსზე გადასვლა',
    menu: 'მენიუ',
    closeMenu: 'მენიუს დახურვა',
    bookMeeting: 'დაჯავშნე შეხვედრა',
    sheetTitle: 'როდის გესაუბროთ?',
    sheetNote: '30 წუთი, ვიდეოზარი ან სკოლაში. უფასოა.',
    close: 'დახურვა',
    call: 'დარეკვა',
    contact: 'კონტაქტი',
    pages: 'გვერდები',
    social: 'სოციალური',
    privacyLink: 'ფოტოების და მონაცემების წესი',
    nextExhibition: 'შემდეგი გამოფენა',
    inDays: (n: number) => `${n} დღეში`,
    days: (n: number) => `${n} დღე`,
    childAge: 'ბავშვის ასაკი',
    yourAnswer: 'თქვენი პასუხი',
    yourAnswerSuffix: ' (თქვენი პასუხი)',
    kidsConcluded: 'რა დაასკვნეს ბავშვებმა',
    weeklyQuestion: (n: number) => `კვირის კითხვა №${n} · ამ კვირას დილის წრეზე`,
    previousQuestions: (n: number) => `წინა ${n} კითხვა და ბავშვების დასკვნები →`,
    portfolioSample: 'პორტფოლიოს ნიმუში',
    goalThisWeek: 'მიზანი ამ კვირაში:',
    quizMeta: 'ქვიზი · 4 კითხვა · 1 წუთი',
    whoFills: 'ვინ ავსებს ქვიზს',
    restart: 'თავიდან',
    youWillLike: 'ჩვენთან მოგეწონებათ, თუ',
    otherSchool: 'სხვა სკოლა მოგერგებათ, თუ',
    playVideo: 'ვიდეოს ჩართვა',
    videoSoon: 'ვიდეო მალე დაემატება',
    prev: 'წინა',
    next: 'შემდეგი',
    form: {
      parentName: 'მშობლის სახელი',
      phone: 'ტელეფონი',
      childAge: 'ბავშვის ასაკი',
      preferredTime: 'როდის გირჩევნიათ ზარი? (არასავალდებულო)',
      submit: 'გაგზავნა',
      sending: 'იგზავნება…',
      success: '✓ მივიღეთ! დაგიკავშირდებით 1 საათში (09:00–20:00).',
      successCalendly: 'თუ გსურთ, დრო ახლავე აირჩიეთ კალენდარში →',
      error: 'ვერ გაიგზავნა. დაგვირეკეთ ან მოგვწერეთ:',
      required: 'გთხოვთ, შეავსოთ სახელი და ტელეფონი.',
      consent: 'ვეთანხმები, რომ სკოლა დამიკავშირდეს ამ ნომერზე.',
    },
    assistant: {
      title: 'ვერ იპოვეთ? ჰკითხეთ',
      badge: 'ასისტენტი',
      intro: 'მე საიტის ასისტენტი ვარ. ვპასუხობ მხოლოდ სკოლის დამტკიცებული კითხვა-პასუხებით. რთულ საკითხებს ადამიანს გადავცემ.',
      placeholder: 'დაწერეთ კითხვა…',
      ask: 'კითხვა',
      source: 'წყარო:',
      handoff: 'ამ თემაზე ადამიანი უკეთ გიპასუხებთ.',
      notFound: 'ამაზე დამტკიცებული პასუხი არ მაქვს. მისწერეთ ადამიანს, ის 1 საათში გიპასუხებთ.',
      human: 'მისწერე ადამიანს',
    },
    faq: { all: 'ყველა', topics: 'თემები', count: (n: number, c: number) => `${n} პასუხი, ${c} თემა.`, allQuestions: (n: number) => `ყველა კითხვა (${n}) →` },
    archive: { thisWeek: 'ამ კვირას', answerToo: 'უპასუხე შენც →', seeConclusion: 'ნახე დასკვნა +', conclusion: 'ბავშვების დასკვნა', week: 'კვირა' },
    team: { parent: 'მშობელი', founder: 'დამფუძნებელი', guide: 'მეგზური', investor: 'ინვესტორი' },
    blog: { title: 'ბლოგი', lead: 'ამბები სკოლიდან: ქვესტები, ბაზრობები, გამოფენები და ის, რასაც ბავშვები სწავლობენ.', readMore: 'წაიკითხე →', back: '← ყველა ჩანაწერი', empty: 'ჯერ ჩანაწერი არ არის.', ctaTitle: 'მოდით და ნახეთ თავად.', ctaAccent: '30 წუთი, არანაირი ვალდებულება.' },
    notFound: { title: 'ეს გვერდი ვერ ვიპოვეთ', text: 'შეიძლება ბმული შეიცვალა. დაბრუნდით მთავარ გვერდზე.', home: 'მთავარი გვერდი' },
    placeholderNote: 'ნიმუშის ტექსტი, დასაზუსტებელია',
  },
} as const;

export type Lang = keyof typeof ui;
export const defaultLang: Lang = 'ka';
export function t(lang: Lang = defaultLang) {
  return ui[lang];
}
