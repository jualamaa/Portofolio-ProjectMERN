export const TEMP_PROFILE = {
    name: 'Yoseph Ekarunio Andika Septyanto',
    brandName: 'JOSEPH.DEV',
    title: 'Fullstack Web Developer & IoT Systems Enthusiast',
    headline: 'Building Ideas Into Practical Digital Experiences.',
    shortIntro:
        'Software engineering student and fullstack developer focused on building structured web applications, RESTful APIs, and hardware-integrated IoT systems.',
    bio: 'I specialize in designing and developing reliable web platforms using modern JavaScript ecosystems, PHP/MySQL architectures, and cloud-backed databases. Alongside web engineering, I explore embedded microcontroller systems and network infrastructure—turning real-world operational needs into clean, maintainable digital tools.',
    location: 'Klaten, Central Java, Indonesia',
    availability: 'Available for Collaboration & Junior Engineering Roles',
    email: 'contact@joseph.dev',
    profileImage:
        'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    socialLinks: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        instagram: 'https://instagram.com',
    },
    education: [
        {
            institution: 'SMK Negeri 2 Klaten',
            program: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
            period: '2024 — 2027',
            description: 'Focused on fullstack software engineering, database design, cloud infrastructure, and IoT systems.',
        },
        {
            institution: 'SMP Negeri 2 Klaten',
            program: 'Junior High School Education',
            period: '2021 — 2024',
            description: 'Built foundational analytical thinking and early interest in computing.',
        },
    ],
    learningJourney: [
        {
            year: '2023',
            topic: 'Web Foundations (HTML, CSS & Responsive Layout)',
            detail: 'Learned semantic HTML5, modern CSS grid/flexbox systems, and editorial layout principles.',
        },
        {
            year: '2024',
            topic: 'PHP, MySQL & Relational Databases',
            detail: 'Built server-rendered web applications, CRUD inventory portals, and normalized relational schemas.',
        },
        {
            year: '2025',
            topic: 'Modern JavaScript, React & Tailwind CSS',
            detail: 'Transitioned toward component-driven single-page applications, state management, and utility-first styling.',
        },
        {
            year: '2025',
            topic: 'IoT Hardware & Embedded Integration',
            detail: 'Developed ESP32 and NodeMCU telemetry dashboards bridging hardware sensors with web interfaces.',
        },
        {
            year: '2026',
            topic: 'Fullstack MERN Architecture & Cloud Security',
            detail: 'Architecting decoupled REST APIs with Node.js, Express, MongoDB Atlas, JWT cookies, and Cloudinary.',
        },
    ],
    achievements: [
        {
            title: 'Fullstack Digital Voting & Attendance System',
            context: 'School-wide Election Infrastructure (2026)',
            metric: 'Real-time database sync & token validation',
        },
        {
            title: 'IoT Lab Inventory & Borrowing Portal',
            context: 'Departmental Equipment Management (2026)',
            metric: 'Automated stock ledger & approval workflow',
        },
        {
            title: 'THERAVO Environmental Telemetry System',
            context: 'Embedded Air Quality Monitoring Project (2026)',
            metric: 'Automated threshold actuation & live sensor dashboard',
        },
    ],
};

export const TEMP_SKILLS = [
    { _id: 's1', name: 'React.js', category: 'Frontend', level: 'Intermediate' },
    { _id: 's2', name: 'JavaScript (ES6+)', category: 'Frontend', level: 'Intermediate' },
    { _id: 's3', name: 'Tailwind CSS', category: 'Frontend', level: 'Proficient' },
    { _id: 's4', name: 'HTML5 & Semantic CSS', category: 'Frontend', level: 'Proficient' },
    { _id: 's5', name: 'Node.js & Express.js', category: 'Backend', level: 'Intermediate' },
    { _id: 's6', name: 'PHP & MySQL', category: 'Backend', level: 'Proficient' },
    { _id: 's7', name: 'MongoDB & Mongoose', category: 'Database', level: 'Intermediate' },
    { _id: 's8', name: 'REST API & JWT Auth', category: 'Backend', level: 'Intermediate' },
    { _id: 's9', name: 'ESP32 / NodeMCU IoT', category: 'Hardware & IoT', level: 'Intermediate' },
    { _id: 's10', name: 'Git & GitHub', category: 'Tools & DevOps', level: 'Proficient' },
];

export const TEMP_PROJECTS = [
    {
        _id: 'p1',
        title: 'THERAVO — Smart Air Quality & Fan Actuation System',
        slug: 'theravo',
        shortDescription:
            'IoT environmental monitoring dashboard combining NodeMCU ESP8266, MQ-135, and DHT11 sensors with automated ventilation control.',
        overview:
            'THERAVO bridges physical air quality sensors with a browser-based control interface to monitor CO₂ concentration and ambient temperature in real time.',
        background:
            'Indoor workspaces often suffer from undetected CO₂ buildup and thermal discomfort without automated feedback loops.',
        problem:
            'Manual monitoring does not provide continuous air-quality logging or automatic ventilation response when thresholds are exceeded.',
        solution:
            'Engineered an ESP8266 sensor node paired with a PHP/MySQL backend and responsive dashboard supporting both threshold-driven auto mode and manual override.',
        features: [
            'Real-time CO₂ (ppm) and temperature (°C) telemetry',
            'Multi-tier air quality classification (Normal, Moderate, Bad)',
            'Automatic relay fan actuation based on custom thresholds',
            'Instant manual override switch from the web dashboard',
        ],
        technologies: ['ESP8266', 'C++', 'JavaScript', 'PHP', 'MySQL', 'REST API'],
        category: { name: 'IoT & Web Systems', slug: 'iot-web' },
        year: 2026,
        status: 'Published',
        featured: true,
        coverImage: {
            url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
        },
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
                caption: 'Hardware microcontroller and sensor telemetry integration',
            },
            {
                url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                caption: 'Real-time environmental threshold analytics view',
            },
        ],
        challenges:
            'Eliminating latency between manual toggle actions on the web UI and microcontroller polling cycles required optimizing API response payloads.',
        githubUrl: 'https://github.com',
        demoUrl: '',
    },
    {
        _id: 'p2',
        title: 'IoT Lab Equipment Borrowing & Inventory Portal',
        slug: 'iot-lab-inventory',
        shortDescription:
            'Fullstack inventory ledger and equipment borrowing system with stock tracking, proof-of-return uploads, and admin approval workflows.',
        overview:
            'A centralized portal built to digitize laboratory hardware borrowing, stock auditing, and administrative approvals.',
        background:
            'Paper-based borrowing logs in school laboratories frequently led to untracked components and stock discrepancies.',
        problem:
            'Administrators lacked real-time visibility into available microcontroller kits, sensors, and active borrower accountability.',
        solution:
            'Developed an end-to-end borrowing workflow with quantity validation, automated stock deduction/restoration, and image proof archiving.',
        features: [
            'Live component catalog with real-time stock availability',
            'Multi-item borrowing cart with quantity validation',
            'Admin CRUD management and multi-stage approval workflow',
            'Cloud-backed image proof storage for returned hardware',
        ],
        technologies: ['JavaScript', 'Tailwind CSS', 'Google Apps Script', 'Cloud Storage'],
        category: { name: 'Fullstack Web', slug: 'fullstack-web' },
        year: 2026,
        status: 'Published',
        featured: true,
        coverImage: {
            url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
        },
        gallery: [
            {
                url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                caption: 'Modular inventory catalog and borrowing interface',
            },
        ],
        challenges:
            'Preventing concurrent borrowing requests from exceeding physical stock required atomic validation checks prior to record creation.',
        githubUrl: 'https://github.com',
        demoUrl: '',
    },
    {
        _id: 'p3',
        title: 'PEMILU ITSC — Digital Voting & Attendance Platform',
        slug: 'pemilu-itsc-voting',
        shortDescription:
            'Token-authenticated digital voting booth and real-time student attendance synchronization system.',
        overview:
            'Designed to streamline student organization elections with single-use token verification and live participation tracking.',
        background:
            'Manual ballot counting and attendance verification required significant time and risked duplicate entries.',
        problem:
            'Needed a fast, verifiable digital booth capable of preventing double voting while displaying live class turnout.',
        solution:
            'Built a PostgreSQL/Supabase-backed onboarding and ballot submission pipeline with database-level RPC functions and real-time subscriptions.',
        features: [
            'Unique token validation per voter session',
            'Atomic server-side vote submission RPC',
            'Real-time class attendance synchronization',
            'Clean, distraction-free candidate selection UI',
        ],
        technologies: ['JavaScript', 'HTML5', 'CSS3', 'PostgreSQL', 'Supabase'],
        category: { name: 'Fullstack Web', slug: 'fullstack-web' },
        year: 2026,
        status: 'Published',
        featured: true,
        coverImage: {
            url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        },
        gallery: [],
        challenges:
            'Handling concurrent submissions across multiple voting booths required strict database-level constraints and idempotent RPC logic.',
        githubUrl: 'https://github.com',
        demoUrl: '',
    },
];

export const TEMP_CERTIFICATES = [
    {
        _id: 'c1',
        title: 'Fullstack Web Development Fundamentals',
        slug: 'fullstack-web-fundamentals',
        issuer: 'Dicoding Indonesia',
        category: { name: 'Web Development', slug: 'web-development' },
        issuedAt: '2026-05-14',
        credentialId: 'DCD-WEB-2026-8841',
        credentialUrl: 'https://dicoding.com',
        description: 'Comprehensive certification covering modern HTTP architecture, REST APIs, and responsive frontend engineering.',
        image: {
            url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
        },
    },
    {
        _id: 'c2',
        title: 'Database Design & SQL Implementation',
        slug: 'database-design-sql',
        issuer: 'Oracle Academy',
        category: { name: 'Database', slug: 'database' },
        issuedAt: '2025-11-20',
        credentialId: 'ORA-DB-2025-1092',
        credentialUrl: 'https://academy.oracle.com',
        description: 'Entity-relationship modeling, normalization, indexing strategies, and transactional query optimization.',
        image: {
            url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80',
        },
    },
    {
        _id: 'c3',
        title: 'Network Routing & Infrastructure Basics',
        slug: 'network-routing-basics',
        issuer: 'MikroTik Training Partner',
        category: { name: 'Networking & Cloud', slug: 'networking-cloud' },
        issuedAt: '2026-08-03',
        credentialId: 'MTC-NET-2026-4410',
        credentialUrl: '',
        description: 'RouterOS configuration, subnetting, wireless bridging, and WAN gateway security fundamentals.',
        image: {
            url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
        },
    },
];