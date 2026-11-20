import { useState, useEffect } from 'react';
import { Send, CheckCircle2, AlertCircle, Mail, MapPin, Github, Linkedin } from 'lucide-react';
import { portfolioService } from '../services/portfolioService';
import { contactService } from '../services/contactService';
import { usePageMeta } from '../hooks/usePageMeta';

export default function ContactPage() {
    usePageMeta({
        title: 'Contact',
        description: 'Get in touch with Yoseph Ekarunio for software development and collaboration.',
    });
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
        website: '', // Honeypot field
    });
    const [submitting, setSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: null, text: '' });

    useEffect(() => {
        portfolioService
            .getProfile()
            .then((data) => setProfile(data))
            .catch(() => { });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: null, text: '' });

        if (form.name.trim().length < 2) {
            setStatus({ type: 'error', text: 'Please enter your full name (minimum 2 characters).' });
            return;
        }
        if (!form.email.includes('@')) {
            setStatus({ type: 'error', text: 'Please enter a valid email address.' });
            return;
        }
        if (form.subject.trim().length < 3) {
            setStatus({ type: 'error', text: 'Please provide a brief subject for your inquiry.' });
            return;
        }
        if (form.message.trim().length < 10) {
            setStatus({ type: 'error', text: 'Please write a message of at least 10 characters.' });
            return;
        }

        setSubmitting(true);
        try {
            const res = await contactService.sendMessage(form);
            setStatus({
                type: 'success',
                text: res.message || 'Your message has been sent successfully.',
            });
            setForm({ name: '', email: '', subject: '', message: '', website: '' });
        } catch (err) {
            setStatus({
                type: 'error',
                text: err.response?.data?.message || 'Unable to send message right now. Please try again.',
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-[#F2F0EA] text-[#242629] min-h-screen">
            <div className="max-w-6xl mx-auto px-6 py-20 sm:py-28">
                {/* HEADER */}
                <div className="max-w-3xl border-b border-[#242629]/15 pb-10 mb-14">
                    <p className="font-mono text-xs uppercase tracking-widest text-[#657568] mb-3">
                        Direct Communication
                    </p>
                    <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight mb-4">
                        Start a Conversation
                    </h1>
                    <p className="text-base sm:text-lg text-[#242629]/75 leading-relaxed">
                        Have a software engineering project, IoT hardware integration, or collaboration in mind?
                        Send a direct message below and it will be delivered straight to my inbox.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* CONTACT INFO COLUMN */}
                    <div className="lg:col-span-4 space-y-8">
                        <div className="border border-[#242629]/15 bg-white/50 p-6 space-y-6">
                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-widest text-[#657568] mb-1">
                                    Availability
                                </p>
                                <p className="text-sm font-semibold">
                                    {profile?.availability || 'Open for Freelance & Collaboration'}
                                </p>
                            </div>

                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-widest text-[#657568] mb-1">
                                    Direct Email
                                </p>
                                <a
                                    href={`mailto:${profile?.email || 'yosephekarunio@gmail.com'}`}
                                    className="inline-flex items-center gap-2 text-sm font-medium hover:text-[#657568] transition-colors"
                                >
                                    <Mail className="w-4 h-4 text-[#657568]" />
                                    <span>{profile?.email || 'yosephekarunio@gmail.com'}</span>
                                </a>
                            </div>

                            <div>
                                <p className="font-mono text-[11px] uppercase tracking-widest text-[#657568] mb-1">
                                    Location
                                </p>
                                <p className="inline-flex items-center gap-2 text-sm text-[#242629]/80">
                                    <MapPin className="w-4 h-4 text-[#657568]" />
                                    <span>{profile?.location || 'Klaten, Central Java, Indonesia'}</span>
                                </p>
                            </div>

                            <div className="pt-4 border-t border-[#242629]/15 flex items-center gap-3">
                                {profile?.socialLinks?.github && (
                                    <a
                                        href={profile.socialLinks.github}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 border border-[#242629]/20 px-3 py-2 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                                    >
                                        <Github className="w-3.5 h-3.5" />
                                        <span>GitHub</span>
                                    </a>
                                )}
                                {profile?.socialLinks?.linkedin && (
                                    <a
                                        href={profile.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="inline-flex items-center gap-1.5 border border-[#242629]/20 px-3 py-2 text-xs font-mono uppercase hover:bg-[#17191C] hover:text-[#F2F0EA] transition-colors"
                                    >
                                        <Linkedin className="w-3.5 h-3.5" />
                                        <span>LinkedIn</span>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* FORM COLUMN */}
                    <div className="lg:col-span-8">
                        <div className="border border-[#242629]/20 bg-white/60 p-6 sm:p-10">
                            {status.text && (
                                <div
                                    className={`mb-6 p-4 border flex items-start gap-3 text-sm ${status.type === 'success'
                                        ? 'border-[#657568] bg-[#657568]/15 text-[#242629]'
                                        : 'border-red-600/40 bg-red-50 text-red-700'
                                        }`}
                                >
                                    {status.type === 'success' ? (
                                        <CheckCircle2 className="w-5 h-5 text-[#657568] shrink-0 mt-0.5" />
                                    ) : (
                                        <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                                    )}
                                    <span>{status.text}</span>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                                {/* Honeypot anti-spam trap (hidden from real users) */}
                                <div className="hidden" aria-hidden="true">
                                    <label htmlFor="website-field">Website</label>
                                    <input
                                        id="website-field"
                                        type="text"
                                        name="website"
                                        tabIndex={-1}
                                        autoComplete="off"
                                        value={form.website}
                                        onChange={(e) => setForm({ ...form, website: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="contact-name"
                                            className="block font-mono text-xs uppercase tracking-widest text-[#242629]/80 mb-2"
                                        >
                                            Your Name *
                                        </label>
                                        <input
                                            id="contact-name"
                                            type="text"
                                            required
                                            placeholder="John Doe"
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            className="w-full bg-white border border-[#242629]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                                        />
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="contact-email"
                                            className="block font-mono text-xs uppercase tracking-widest text-[#242629]/80 mb-2"
                                        >
                                            Email Address *
                                        </label>
                                        <input
                                            id="contact-email"
                                            type="email"
                                            required
                                            placeholder="john@example.com"
                                            value={form.email}
                                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                                            className="w-full bg-white border border-[#242629]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-subject"
                                        className="block font-mono text-xs uppercase tracking-widest text-[#242629]/80 mb-2"
                                    >
                                        Subject *
                                    </label>
                                    <input
                                        id="contact-subject"
                                        type="text"
                                        required
                                        placeholder="Web Application Inquiry / Collaboration"
                                        value={form.subject}
                                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                        className="w-full bg-white border border-[#242629]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="contact-message"
                                        className="block font-mono text-xs uppercase tracking-widest text-[#242629]/80 mb-2"
                                    >
                                        Message *
                                    </label>
                                    <textarea
                                        id="contact-message"
                                        rows={6}
                                        required
                                        placeholder="Describe your project requirements, timeline, or question..."
                                        value={form.message}
                                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                                        className="w-full bg-white border border-[#242629]/25 px-4 py-3 text-sm focus:outline-none focus:border-[#657568]"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="inline-flex items-center gap-2.5 bg-[#17191C] text-[#F2F0EA] px-8 py-3.5 text-xs font-mono font-semibold uppercase tracking-widest hover:bg-[#657568] transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                    <span>{submitting ? 'Dispatching Message...' : 'Send Message'}</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}