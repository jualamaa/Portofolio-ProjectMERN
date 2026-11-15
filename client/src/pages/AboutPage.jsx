import { Github, Linkedin, Mail, MapPin, GraduationCap, Compass } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { TEMP_PROFILE, TEMP_SKILLS } from '../utils/mockPortfolioData';

export default function AboutPage() {
    const skillCategories = [...new Set(TEMP_SKILLS.map((s) => s.category))];

    return (
        <div className="editorial-container py-16 sm:py-24">
            <SectionHeader
                index="ABOUT /"
                eyebrow="Identity & Journey"
                title="Developer Profile & Learning Trajectory"
                description="A transparent overview of my educational foundation, technical exploration, and current engineering toolkit."
                theme="light"
            />

            {/* BIO & PORTRAIT */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-[#242629]/15">
                <div className="lg:col-span-4">
                    <div className="border border-[#242629]/20 p-3 bg-white/40">
                        <img
                            src={TEMP_PROFILE.profileImage}
                            alt={TEMP_PROFILE.name}
                            className="w-full aspect-[4/5] object-cover"
                        />
                        <div className="pt-3 mt-3 border-t border-[#242629]/15 space-y-1 text-xs font-mono">
                            <p className="font-semibold">{TEMP_PROFILE.name}</p>
                            <p className="text-[#242629]/70 flex items-center gap-1.5">
                                <MapPin className="w-3.5 h-3.5 text-[#657568]" />
                                {TEMP_PROFILE.location}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 flex flex-col justify-between space-y-8">
                    <div className="space-y-5">
                        <span className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                            {TEMP_PROFILE.title}
                        </span>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-snug">
                            Focused on building practical fullstack web systems and bridging software with real-world hardware.
                        </h2>
                        <p className="text-[#242629]/80 text-base leading-relaxed">
                            {TEMP_PROFILE.bio}
                        </p>
                        <p className="text-[#242629]/80 text-base leading-relaxed">
                            My technical interests span fullstack JavaScript architecture (MERN), relational database modeling, cloud infrastructure, and embedded IoT automation. Rather than treating tools as buzzwords, I focus on understanding how data flows securely from user interfaces to backend APIs and persistent storage.
                        </p>
                    </div>

                    {/* Social Links */}
                    <div className="pt-6 border-t border-[#242629]/15 flex flex-wrap items-center gap-4">
                        <a
                            href={TEMP_PROFILE.socialLinks.github}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 border border-[#242629]/25 px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                        >
                            <Github className="w-4 h-4" />
                            <span>GitHub</span>
                        </a>
                        <a
                            href={TEMP_PROFILE.socialLinks.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-2 border border-[#242629]/25 px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                        >
                            <Linkedin className="w-4 h-4" />
                            <span>LinkedIn</span>
                        </a>
                        <a
                            href={`mailto:${TEMP_PROFILE.email}`}
                            className="inline-flex items-center gap-2 border border-[#242629]/25 px-4 py-2.5 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] hover:border-[#657568] hover:text-[#F2F0EA] transition-colors"
                        >
                            <Mail className="w-4 h-4" />
                            <span>{TEMP_PROFILE.email}</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* EDUCATION & LEARNING JOURNEY TIMELINE */}
            <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 py-20 border-b border-[#242629]/15">
                <div className="lg:col-span-5 space-y-6">
                    <div className="flex items-center gap-2.5 text-[#657568]">
                        <GraduationCap className="w-5 h-5" />
                        <span className="font-mono text-xs uppercase tracking-widest">Education</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold">Academic Background</h3>

                    <div className="space-y-6">
                        {TEMP_PROFILE.education.map((edu, idx) => (
                            <div key={idx} className="border border-[#242629]/15 p-6 bg-white/30">
                                <span className="font-mono text-xs text-[#657568]">{edu.period}</span>
                                <h4 className="font-display text-lg font-bold mt-1">{edu.institution}</h4>
                                <p className="text-sm font-medium text-[#242629]/85 mt-0.5">{edu.program}</p>
                                <p className="text-sm text-[#242629]/70 mt-3 leading-relaxed">{edu.description}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                    <div className="flex items-center gap-2.5 text-[#657568]">
                        <Compass className="w-5 h-5" />
                        <span className="font-mono text-xs uppercase tracking-widest">Timeline</span>
                    </div>
                    <h3 className="font-display text-2xl font-bold">Technical Learning Journey</h3>

                    <div className="border-l border-[#242629]/25 ml-2 space-y-8 pl-6">
                        {TEMP_PROFILE.learningJourney.map((step, idx) => (
                            <div key={idx} className="relative">
                                <span className="absolute -left-[29px] top-1.5 w-2.5 h-2.5 bg-[#657568]" />
                                <span className="font-mono text-xs text-[#657568] font-semibold">{step.year}</span>
                                <h4 className="font-display text-lg font-bold mt-1">{step.topic}</h4>
                                <p className="text-sm text-[#242629]/75 mt-1.5 leading-relaxed">{step.detail}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* SKILLS & PROFICIENCY LEVELS */}
            <section className="pt-20">
                <div className="mb-10">
                    <span className="font-mono text-xs uppercase tracking-widest text-[#657568]">
                        Capabilities
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-bold mt-2">
                        Technologies & Current Proficiency
                    </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {skillCategories.map((category) => (
                        <div key={category} className="border border-[#242629]/15 p-6 bg-white/30">
                            <h4 className="font-mono text-xs uppercase tracking-widest text-[#657568] border-b border-[#242629]/15 pb-3 mb-4">
                                {category}
                            </h4>
                            <div className="divide-y divide-[#242629]/10">
                                {TEMP_SKILLS.filter((s) => s.category === category).map((skill) => (
                                    <div key={skill._id} className="py-3 flex items-center justify-between text-sm">
                                        <span className="font-medium">{skill.name}</span>
                                        <span className="font-mono text-xs px-2.5 py-0.5 border border-[#242629]/20 text-[#242629]/80">
                                            {skill.level}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}