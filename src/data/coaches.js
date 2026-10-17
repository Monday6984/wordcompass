// The coaching team. `featured: true` shows a coach on the homepage.
// `slug` is the web address of the coach's own page: /coaches/{slug}. Keep it unique,
// lowercase, with hyphens instead of spaces.
// `shortBio` is the one- or two-sentence summary on coach cards (homepage and /coaches);
// `bio` is the full text on the coach's own page.
// To add a photo: put the file in public/images/coaches/ and set `photo: "/images/coaches/name.webp"`.

export const COACHES = [
  {
    name: "Messiah Odinma",
    slug: "messiah-odinma",
    shortBio:
      "Messiah Odinma is a dedicated and values-driven higher education professional, mentor, and student advocate with extensive experience empowering young adults to overcome barriers and reach their full potential. He currently serves as the Head of Student Finance at the University of Hertfordshire.",
    headline: "Higher Education Leader, Student Advocate, and Youth Mentor",
    photo: null,
    bio: "Messiah Odinma is a dedicated and values-driven higher education professional, mentor, and student advocate with extensive experience empowering young adults to overcome barriers and reach their full potential. With a deep career background spanning notable institutions like King’s College London, the University of East London, and the Institute of Contemporary Music Performance (ICMP), Messiah has dedicated his professional life to improving student retention, engagement, and overall success. He currently serves as the Head of Student Finance at the University of Hertfordshire.",
    expertise: [
      {
        title: "Overcoming Educational & Systemic Barriers",
        body: "Messiah has led critical initiatives designed to close attainment gaps and ensure that underrepresented or marginalized young people have the tools they need to thrive.",
      },
      {
        title: "Dedicated Support for Vulnerable Youth",
        body: "He has extensive experience building sustainable support frameworks for vulnerable demographics. Notably, he serves as the Chair of the AccessHE Care Experienced and Estranged Students Forum, where he directly champions the voices and future progression of care leavers.",
      },
      {
        title: "Holistic Life & Financial Guidance",
        body: "Understanding that personal success is tied to real-world stability, Messiah leverages his deep understanding of student finance and institutional navigation to guide young adults through complex educational, financial, and personal landscapes.",
      },
    ],
    connect:
      "Messiah is known for his evidence-informed approach combined with an approachable, student-first demeanor. As a coach, he doesn’t just offer advice; he actively listens, elevates student voices, and collaborates with young adults to design actionable pathways forward. Whether helping a young person navigate university life, build financial confidence, or map out a career, Messiah is an empowering ally committed to turning challenges into opportunities for growth.",
    featured: true,
  },
  {
    name: "Mayowa Adebambo Agyo",
    slug: "mayowa-adebambo-agyo",
    shortBio:
      "Mayowa Adebambo Agyo is a passionate, community-driven professional and youth mentor based in Bradford, England. Mayowa dedicates her time to helping young adults navigate life’s pressures, build resilience, and discover their true purpose.",
    headline: "Public Health Professional, Youth Mentor, and Mental Health Advocate",
    photo: null,
    bio: "Mayowa Adebambo Agyo is a passionate, community-driven professional and youth mentor based in Bradford, England. Combining over seven years of experience as a Public Health Analyst with Bradford Council with a deep-seated commitment to youth development, Mayowa dedicates her time to helping young adults navigate life’s pressures, build resilience, and discover their true purpose. Known for her faith-inspired optimism, empathetic listening, and strategic problem-solving, she creates a safe, empowering environment where the next generation can transition from confusion to clarity.",
    expertise: [
      {
        title: "Mental Health & Well-being",
        body: "As a qualified Mental Health First Aider, Mayowa actively breaks down stigmas surrounding mental health — particularly within BAME and faith-based communities. She equips young adults with coping mechanisms for anxiety, stress, and life transitions, promoting positive mental health through open dialogue.",
      },
      {
        title: "Resilience & Positive Mindset",
        body: "Mayowa is a firm believer in overcoming adversity with joy, confidence, and gratitude. She coaches young adults to build an unstoppable mindset, helping them view life’s unexpected challenges not as setbacks, but as opportunities to move forward.",
      },
      {
        title: "Community & Cultural Engagement",
        body: "Deeply embedded in the local landscape, Mayowa is passionate about celebrating identity and fostering community cohesion. She actively champions initiatives like the Bradford African Festival of Arts (BAFA), using culture and community connection as a bridge to inspire young people.",
      },
    ],
    connect:
      "With an educational background that includes a BSc from the University of Bradford and a Master of Public Health (MPH), Mayowa bridges the gap between structured, data-driven support and authentic human connection. Young adults describe her as an accessible, uplifting, and comforting ally. Whether she is helping a young person clear a path toward their future career, navigate a mental health hurdle, or find their voice within the community, Mayowa walks alongside them as a trusted anchor and guide.",
    featured: true,
  },
  {
    name: "Adaeze Obasuyi",
    slug: "adaeze-obasuyi",
    shortBio:
      "Adaeze Obasuyi is a compassionate Christian Life and Wellness Coach, author, and student mentor based in Brighton, England. Adaeze helps young adults step out of overwhelm, care for their physical and mental well-being, and confidently unlock their purpose.",
    headline: "Holistic Wellness Coach, Author, and Young Adult Mentor",
    photo: null,
    bio: "Adaeze Obasuyi is a compassionate Christian Life and Wellness Coach, author, and student mentor based in Brighton, England. Combining an empathetic approach with strategic mindset tools, Adaeze helps young adults step out of overwhelm, care for their physical and mental well-being, and confidently unlock their purpose. As the founder and director of Rooted Branch Creatives, she is dedicated to guiding the next generation away from the modern trap of “busy culture” and toward intentional, meaningful living.",
    expertise: [
      {
        title: "Holistic Wellness & Mindset Strategy",
        body: "Author of The ABCs of Wellness, Adaeze specializes in teaching young adults how to cultivate deep self-compassion, balance stressful schedules, and master the foundational habits required for physical, emotional, and spiritual well-being.",
      },
      {
        title: "Overcoming Anxiety & Life Transitions",
        body: "Stepping into the adult world brings significant pressure. Adaeze helps young people navigate high-stakes life transitions — such as leaving university, entering the workforce, or handling sudden lifestyle shifts — by replacing the fear of the unknown with actionable confidence.",
      },
      {
        title: "Faith-Based Empowerment",
        body: "For young adults seeking to integrate their beliefs with daily goal-setting, Adaeze provides clear, values-driven mentoring. She teaches individuals how to tune out the noise of expectations and connect with their authentic identity.",
      },
    ],
    connect:
      "Young adults find an accessible, steady anchor in Adaeze. Known for her relatable, warm, and deeply authentic style, she creates a pressure-free environment where individuals can honestly address their struggles. Instead of demanding perfection, Adaeze mentors young adults to embrace slow, consistent progress — equipping them with the emotional resilience and clarity needed to thrive.",
    featured: true,
  },
  {
    name: "Smart Osadolor",
    slug: "smart-osadolor",
    shortBio:
      "Smart Osadolor is a dynamic former professional footballer, corporate professional, and elite sports mentor dedicated to empowering the next generation of young athletes. Smart provides young athletes with a rare, invaluable blend of athletic discipline and real-world strategy to help them win both on and off the pitch.",
    headline: "Ex-Professional Footballer, Elite Mentor, and Athlete Performance Coach",
    photo: null,
    bio: "Smart Osadolor is a dynamic former professional footballer, corporate professional, and elite sports mentor dedicated to empowering the next generation of young athletes. Born in Nigeria and raised in London, with studies in Glasgow and America, Smart understands the intense pressures, heavy sacrifices, and psychological challenges of elite youth sports. Having successfully navigated the transition from professional football to the corporate financial sector, Smart provides young athletes with a rare, invaluable blend of athletic discipline and real-world strategy to help them win both on and off the pitch.",
    expertise: [
      {
        title: "The “More Than an Athlete” Strategy",
        body: "Smart is a prime example of an athlete who refused to limit his potential. He secured a soccer scholarship to Tiffin University in the US, earning an MBA in General Management and International Business, before returning to the UK to play professional football while simultaneously building a career as a financial analyst at “Big Four” firm KPMG. He coaches young athletes on how to build a powerful “Plan B,” balance intense training schedules with education, and prepare early for life after sports.",
      },
      {
        title: "Building Elite Mental Resilience",
        body: "At age 16, just as his football journey was accelerating, Smart faced the profound personal loss of his mother. Drawing from his own path through grief, pressure, and uncertainty, he provides empathetic mentorship to young athletes facing setbacks, injuries, or release from academies, teaching them how to process adversity and build an unbreakable mindset.",
      },
      {
        title: "Pro-Level Discipline & Execution",
        body: "Over a decade-long career playing across the Scottish Professional Football League (SPFL) pyramid — including Annan Athletic, Elgin City, Queen’s Park, and Bonnyrigg Rose — Smart mastered the daily habits required to stay at the top. He translates locker-room leadership into life lessons, mentoring athletes on focus, self-discipline, nutrition, media accountability, and the confidence needed to perform under intense pressure.",
      },
    ],
    connect:
      "Smart is far more than an advisor; he is a relatable, high-energy mentor who speaks the language of modern sports. He knows firsthand what it feels like to chase the dream, handle the politics of the game, and manage the anxieties of performance. Whether he is helping a rising star navigate academy pressure, guiding an athlete through a tough career transition, or teaching a team the fundamentals of collective accountability, Smart stands as a trusted anchor. His lived experience inspires young athletes to drop the excuses, protect their mental well-being, and step confidently into their full potential.",
    featured: true,
  },
];

export function getCoachBySlug(slug) {
  return COACHES.find((coach) => coach.slug === slug) || null;
}

// Previous and next coaches for the links at the bottom of a coach page (wraps around).
export function getAdjacentCoaches(slug) {
  const index = COACHES.findIndex((coach) => coach.slug === slug);
  if (index === -1 || COACHES.length < 2) return { previous: null, next: null };
  return {
    previous: COACHES[(index - 1 + COACHES.length) % COACHES.length],
    next: COACHES[(index + 1) % COACHES.length],
  };
}
