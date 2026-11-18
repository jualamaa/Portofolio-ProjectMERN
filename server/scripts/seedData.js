import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { Profile } from '../src/models/Profile.js';
import { Category } from '../src/models/Category.js';
import { Skill } from '../src/models/Skill.js';
import { Project } from '../src/models/Project.js';
import { Certificate } from '../src/models/Certificate.js';

const seedInitialPortfolio = async () => {
    await connectDB();

    console.log('[Seed] Clearing existing public portfolio collections...');
    await Promise.all([
        Profile.deleteMany({}),
        Category.deleteMany({}),
        Skill.deleteMany({}),
        Project.deleteMany({}),
        Certificate.deleteMany({}),
    ]);

    console.log('[Seed] Creating developer profile...');
    await Profile.create({
        brandName: 'JOSEPH.DEV',
        name: 'Yoseph Ekarunio Andika Septyanto',
        title: 'Fullstack Web Developer & IoT Systems Enthusiast',
        headline: 'Building Ideas Into Practical Digital Experiences.',
        shortIntro:
            'Software engineering student and fullstack developer focused on building structured web applications, RESTful APIs, and hardware-integrated IoT systems.',
        bio: 'I specialize in designing and developing reliable web platforms using modern JavaScript ecosystems, PHP/MySQL architectures, and cloud-backed databases. Alongside web engineering, I explore embedded microcontroller systems and network infrastructure—turning real-world operational needs into clean, maintainable digital tools.',
        profileImage: {
            url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
            publicId: '',
        },
        location: 'Klaten, Central Java, Indonesia',
        availability: 'Available for Collaboration & Junior Engineering Roles',
        email: 'contact@joseph.dev',
        education: [
            {
                institution: 'SMK Negeri 2 Klaten',
                program: 'Pengembangan Perangkat Lunak dan Gim (PPLG)',
                period: '2024 — 2027',
                description:
                    'Focused on fullstack software engineering, database architecture, network routing, and IoT systems.',
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
                topic: 'Web Foundations (HTML5, CSS3 & Responsive Layout)',
                detail:
                    'Learned semantic markup, modern grid/flexbox architectures, and clean editorial layout composition.',
            },
            {
                year: '2024',
                topic: 'PHP, MySQL & Relational Databases',
                detail:
                    'Built server-rendered web applications, CRUD inventory portals, and normalized relational schemas.',
            },
            {
                year: '2025',
                topic: 'Modern JavaScript, React & Tailwind CSS',
                detail:
                    'Transitioned toward component-driven single-page applications, state management, and utility-first styling.',
            },
            {
                year: '2025',
                topic: 'IoT Hardware & Embedded Integration',
                detail:
                    'Developed ESP32 and NodeMCU telemetry dashboards bridging hardware sensors with web interfaces.',
            },
            {
                year: '2026',
                topic: 'Fullstack MERN Architecture & Cloud Security',
                detail:
                    'Architecting decoupled REST APIs with Node.js, Express, MongoDB Atlas, JWT cookies, and Cloudinary.',
            },
        ],
        achievements: [
            {
                title: 'Fullstack Digital Voting & Attendance System',
                context: 'School-wide Election Infrastructure (2026)',
                metric: 'Real-time database sync & single-use token validation',
            },
            {
                title: 'IoT Lab Inventory & Borrowing Portal',
                context: 'Departmental Equipment Management (2026)',
                metric: 'Automated stock ledger & multi-stage approval workflow',
            },
            {
                title: 'THERAVO Environmental Telemetry System',
                context: 'Embedded Air Quality Monitoring Project (2026)',
                metric: 'Automated threshold actuation & live sensor dashboard',
            },
        ],
        socialLinks: {
            github: 'https://github.com',
            linkedin: 'https://linkedin.com',
            instagram: 'https://instagram.com',
            website: 'https://joseph.dev',
        },
    });

    console.log('[Seed] Creating categories...');
    const [catFullstack, catIoT, catCertWeb, catCertDb, catCertNet] = await Category.create([
        { name: 'Fullstack Web', slug: 'fullstack-web', type: 'project' },
        { name: 'IoT & Web Systems', slug: 'iot-web-systems', type: 'project' },
        { name: 'Web Development', slug: 'web-development', type: 'certificate' },
        { name: 'Database', slug: 'database', type: 'certificate' },
        { name: 'Networking & Cloud', slug: 'networking-cloud', type: 'certificate' },
    ]);

    console.log('[Seed] Creating skills...');
    await Skill.create([
        { name: 'React.js', category: 'Frontend', proficiency: 'Intermediate', displayOrder: 1 },
        { name: 'JavaScript (ES6+)', category: 'Frontend', proficiency: 'Intermediate', displayOrder: 2 },
        { name: 'Tailwind CSS', category: 'Frontend', proficiency: 'Proficient', displayOrder: 3 },
        { name: 'HTML5 & Semantic CSS', category: 'Frontend', proficiency: 'Proficient', displayOrder: 4 },
        { name: 'Node.js & Express.js', category: 'Backend', proficiency: 'Intermediate', displayOrder: 5 },
        { name: 'PHP & MySQL', category: 'Backend', proficiency: 'Proficient', displayOrder: 6 },
        { name: 'REST API & JWT Security', category: 'Backend', proficiency: 'Intermediate', displayOrder: 7 },
        { name: 'MongoDB & Mongoose', category: 'Database', proficiency: 'Intermediate', displayOrder: 8 },
        { name: 'ESP32 / NodeMCU IoT', category: 'Hardware & IoT', proficiency: 'Intermediate', displayOrder: 9 },
        { name: 'Git & GitHub', category: 'Tools & Infrastructure', proficiency: 'Proficient', displayOrder: 10 },
    ]);

    console.log('[Seed] Creating projects...');
    await Project.create([
        {
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
            category: catIoT._id,
            coverImage: {
                url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
                publicId: '',
            },
            gallery: [
                {
                    url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
                    caption: 'Hardware microcontroller and sensor telemetry integration',
                    order: 1,
                },
                {
                    url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
                    caption: 'Real-time environmental threshold analytics view',
                    order: 2,
                },
            ],
            challenges:
                'Eliminating latency between manual toggle actions on the web UI and microcontroller polling cycles required optimizing API response payloads.',
            githubUrl: 'https://github.com',
            demoUrl: '',
            year: 2026,
            featured: true,
            status: 'published',
            displayOrder: 1,
        },
        {
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
            category: catFullstack._id,
            coverImage: {
                url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                publicId: '',
            },
            gallery: [
                {
                    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
                    caption: 'Modular inventory catalog and borrowing interface',
                    order: 1,
                },
            ],
            challenges:
                'Preventing concurrent borrowing requests from exceeding physical stock required atomic validation checks prior to record creation.',
            githubUrl: 'https://github.com',
            demoUrl: '',
            year: 2026,
            featured: true,
            status: 'published',
            displayOrder: 2,
        },
        {
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
            category: catFullstack._id,
            coverImage: {
                url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
                publicId: '',
            },
            gallery: [],
            challenges:
                'Handling concurrent submissions across multiple voting booths required strict database-level constraints and idempotent RPC logic.',
            githubUrl: 'https://github.com',
            demoUrl: '',
            year: 2026,
            featured: true,
            status: 'published',
            displayOrder: 3,
        },
    ]);

    console.log('[Seed] Creating certificates...');
    await Certificate.create([
        {
            title: 'Fullstack Web Development Fundamentals',
            slug: 'fullstack-web-fundamentals',
            issuer: 'Dicoding Indonesia',
            description:
                'Comprehensive certification covering modern HTTP architecture, REST APIs, and responsive frontend engineering.',
            image: {
                url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80',
                publicId: '',
            },
            category: catCertWeb._id,
            issuedAt: new Date('2026-05-14'),
            credentialId: 'DCD-WEB-2026-8841',
            credentialUrl: 'https://dicoding.com',
            displayOrder: 1,
        },
        {
            title: 'Database Design & SQL Implementation',
            slug: 'database-design-sql',
            issuer: 'Oracle Academy',
            description:
                'Entity-relationship modeling, normalization, indexing strategies, and transactional query optimization.',
            image: {
                url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=1000&q=80',
                publicId: '',
            },
            category: catCertDb._id,
            issuedAt: new Date('2025-11-20'),
            credentialId: 'ORA-DB-2025-1092',
            credentialUrl: 'https://academy.oracle.com',
            displayOrder: 2,
        },
        {
            title: 'Network Routing & Infrastructure Basics',
            slug: 'network-routing-basics',
            issuer: 'MikroTik Training Partner',
            description:
                'RouterOS configuration, subnetting, wireless bridging, and WAN gateway security fundamentals.',
            image: {
                url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1000&q=80',
                publicId: '',
            },
            category: catCertNet._id,
            issuedAt: new Date('2026-08-03'),
            credentialId: 'MTC-NET-2026-4410',
            credentialUrl: '',
            displayOrder: 3,
        },
    ]);

    console.log('[Seed] Initial portfolio data successfully inserted into MongoDB Atlas!');
    await mongoose.disconnect();
    process.exit(0);
};

seedInitialPortfolio().catch((err) => {
    console.error('[Seed Error]', err);
    process.exit(1);
});