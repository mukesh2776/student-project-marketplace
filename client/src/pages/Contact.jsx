import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import {
    HiMail,
    HiPhone,
    HiLocationMarker,
    HiClock,
    HiPaperAirplane,
} from 'react-icons/hi';
import { useState } from 'react';
import toast from 'react-hot-toast';

const Contact = () => {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [sending, setSending] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.message) {
            toast.error('Please fill in all required fields');
            return;
        }
        setSending(true);
        // Simulate sending
        setTimeout(() => {
            setSending(false);
            toast.success('Message sent! We\'ll get back to you within 24 hours.');
            setForm({ name: '', email: '', subject: '', message: '' });
        }, 1500);
    };

    const contactInfo = [
        {
            icon: HiMail,
            title: 'Email Us',
            detail: 'support@studentmarket.com',
            sub: 'We reply within 24 hours',
        },
        {
            icon: HiPhone,
            title: 'Call Us',
            detail: '+91 12345 67890',
            sub: 'Mon - Fri, 9am - 6pm IST',
        },
        {
            icon: HiLocationMarker,
            title: 'Visit Us',
            detail: '123 Tech Street',
            sub: 'Bangalore, India',
        },
        {
            icon: HiClock,
            title: 'Business Hours',
            detail: 'Mon - Fri: 9am - 6pm',
            sub: 'Sat: 10am - 2pm IST',
        },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Have a question, feedback, or need help? We'd love to hear from you.
                        </p>
                    </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <ScrollReveal>
                            <div className="glass-card p-8">
                                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Send us a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                placeholder="Your name"
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Email <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="email"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                placeholder="you@example.com"
                                                className="input-field"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                        <input
                                            type="text"
                                            value={form.subject}
                                            onChange={(e) => setForm({ ...form, subject: e.target.value })}
                                            placeholder="What's this about?"
                                            className="input-field"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Message <span className="text-red-500">*</span>
                                        </label>
                                        <textarea
                                            value={form.message}
                                            onChange={(e) => setForm({ ...form, message: e.target.value })}
                                            placeholder="Tell us what you need..."
                                            rows={5}
                                            className="input-field resize-none"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={sending}
                                        className="btn-primary w-full sm:w-auto flex items-center justify-center gap-2"
                                    >
                                        {sending ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <HiPaperAirplane className="w-5 h-5 rotate-90" />
                                                Send Message
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </ScrollReveal>
                    </div>

                    {/* Contact Info Cards */}
                    <div className="space-y-4">
                        {contactInfo.map((item, index) => (
                            <ScrollReveal key={index} delay={index * 100} direction="up">
                                <div className="glass-card p-5 flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                                        <item.icon className="w-5 h-5 text-primary-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                                        <p className="text-gray-700 text-sm">{item.detail}</p>
                                        <p className="text-gray-400 text-xs mt-0.5">{item.sub}</p>
                                    </div>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
