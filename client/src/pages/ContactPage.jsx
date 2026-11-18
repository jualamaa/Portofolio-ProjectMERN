import { useState, useEffect } from 'react';
import { Send, Mail, Github, Linkedin, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import SectionHeader from '../components/common/SectionHeader';
import { portfolioService } from '../services/portfolioService';

export default function ContactPage() {
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '',
    });

    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState({ submitting: false, type: null, text: '' });

    useEffect(() => {
        portfolioService
            .getProfile()
            .then((data) => setProfile(data))
            .catch(() => { });
    }, []);

    const validate = () => {
        const nextErrors = {};
        if (!form.name.trim() || form.name.trim().length < 2) {
            nextErrors.name = 'Please enter your name (at least 2 characters).';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            nextErrors.email = 'Please provide a valid email address.';
        }
        if (!form.subject.trim() || form.subject.trim().length < 3) {
            nextErrors.subject = 'Please specify a subject.';
        }
        if (!form.message.trim() || form.message.trim().length < 15) {
            nextErrors.message = 'Message must be at least 15 characters long.';
        }
        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: null }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setStatus({ submitting: true, type: null, text: '' });

        setTimeout(() => {
            setStatus({
                submitting: false,
                type: 'success',
                text: 'Your message has been validated. Full backend SMTP & MongoDB delivery will activate in Phase 06.',
            });
            setForm({ name: '', email: '', subject: '', message: '', website: '' });
        }, 500);
    };

    return (
        <div className="editorial-container py-16 sm:py-24">
            <SectionHeader
                index="CONTACT /"
                eyebrow="Direct Communication"
                title="Initiate a Conversation"
                description="Whether you are looking to collaborate on a web application, discuss technical architecture, or inquire about opportunities, send a direct message below."
                theme="dark"
            />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-5 space-y-8">
                    <div className="border border-[#D9D4C9]/15 p-6 sm:p-8 space-y-6">
                        <div>
                            <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-2">
                                Direct Email
                            </p>
                            <a
                                href={`mailto:${profile?.email || 'contact@joseph.dev'}`}
                                className="inline-flex items-center gap-2.5 text-base font-medium hover:text-[#657568] transition-colors"
                            >
                                <Mail className="w-4 h-4 text-[#657568]" />
                                <span>{profile?.email || 'contact@joseph.dev'}</span>
                            </a>
                        </div>

                        {profile?.location && (
                            <div>
                                <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-2">
                                    Base Location
                                </p>
                                <p className="inline-flex items-center gap-2.5 text-sm text-[#A5A39D]">
                                    <MapPin className="w-4 h-4 text-[#657568]" />
                                    <span>{profile.location}</span>
                                </p>
                            </div>
                        )}

                        <div className="pt-4 border-t border-[#D9D4C9]/15">
                            <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-3">
                                Developer Profiles
                            </p>
                            <div className="flex flex-wrap gap-3">
                                {profile?.socialLinks?.github && (
                                    <a
                                        href={profile.socialLinks.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 border border-[#D9D4C9]/25 px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] hover:border-[#657568] transition-colors"
                                    >
                                        <Github className="w-4 h-4" />
                                        <span>GitHub</span>
                                    </a>
                                )}
                                {profile?.socialLinks?.linkedin && (
                                    <a
                                        href={profile.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-2 border border-[#D9D4C9]/25 px-4 py-2 text-xs font-mono uppercase tracking-wider hover:bg-[#657568] hover:border-[#657568] transition-colors"
                                    >
                                        <Linkedin className="w-4 h-4" />
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7">
                    <form
                        onSubmit={handleSubmit}
                        noValidate
                        className="border border-[#D9D4C9]/15 p-6 sm:p-10 space-y-6"
                    >
                        <div className="hidden" aria-hidden="true">
                            <label htmlFor="website">Website</label>
                            <input
                                type="text"
                                id="website"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                value={form.website}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="name"
                                    className="block font-mono text-xs uppercase tracking-widest text-[#A5A39D] mb-2"
                                >
                                    Your Name *
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    value={form.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    className="w-full bg-white/[0.03] border border-[#D9D4C9]/20 px-4 py-3 text-sm text-[#F2F0EA] focus:outline-none focus:border-[#657568]"
                                />
                                {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
                            </div>

                            <div>
                                <label
                                    htmlFor="email"
                                    className="block font-mono text-xs uppercase tracking-widest text-[#A5A39D] mb-2"
                                >
                                    Email Address *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="john@example.com"
                                    className="w-full bg-white/[0.03] border border-[#D9D4C9]/20 px-4 py-3 text-sm text-[#F2F0EA] focus:outline-none focus:border-[#657568]"
                                />
                                {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="subject"
                                className="block font-mono text-xs uppercase tracking-widest text-[#A5A39D] mb-2"
                            >
                                Subject *
                            </label>
                            <input
                                id="subject"
                                name="subject"
                                type="text"
                                value={form.subject}
                                onChange={handleChange}
                                placeholder="Project inquiry or collaboration"
                                className="w-full bg-white/[0.03] border border-[#D9D4C9]/20 px-4 py-3 text-sm text-[#F2F0EA] focus:outline-none focus:border-[#657568]"
                            />
                            {errors.subject && <p className="text-xs text-red-400 mt-1.5">{errors.subject}</p>}
                        </div>

                        <div>
                            <label
                                htmlFor="message"
                                className="block font-mono text-xs uppercase tracking-widest text-[#A5A39D] mb-2"
                            >
                                Message *
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                rows={6}
                                value={form.message}
                                onChange={handleChange}
                                placeholder="Describe your project goals, timeline, or message..."
                                className="w-full bg-white/[0.03] border border-[#D9D4C9]/20 px-4 py-3 text-sm text-[#F2F0EA] focus:outline-none focus:border-[#657568]"
                            />
                            {errors.message && <p className="text-xs text-red-400 mt-1.5">{errors.message}</p>}
                        </div>

                        {status.text && (
                            <div
                                className={`p-4 border flex items-start gap-3 text-sm ${status.type === 'success'
                                    ? 'border-[#657568] bg-[#657568]/15 text-[#F2F0EA]'
                                    : 'border-red-500/40 bg-red-950/20 text-red-300'
                                    }`}
                            >
                                {status.type === 'success' ? (
                                    <CheckCircle2 className="w-5 h-5 text-[#657568] shrink-0 mt-0.5" />
                                ) : (
                                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                                )}
                                <span>{status.text}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={status.submitting}
                            className="inline-flex items-center gap-2.5 bg-[#F2F0EA] text-[#17191C] px-7 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#657568] hover:text-[#F2F0EA] transition-colors disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                            <span>{status.submitting ? 'Sending...' : 'Send Message'}</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}