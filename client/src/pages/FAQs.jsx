import { useState } from 'react';
import ScrollReveal from '../components/ScrollReveal';
import { HiChevronDown } from 'react-icons/hi';

const FAQs = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggle = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqCategories = [
        {
            title: 'Buying Projects',
            faqs: [
                {
                    q: 'How do I purchase a project?',
                    a: 'Simply browse or search for a project, click on it to view details, and add it to your cart. Proceed to checkout to complete your purchase. You\'ll receive download access immediately.',
                },
                {
                    q: 'Can I get a refund?',
                    a: 'We offer a 7-day refund policy if the project doesn\'t match the description. Contact our support team with your order details and we\'ll process it within 48 hours.',
                },
                {
                    q: 'Can I use the project for my college submission?',
                    a: 'Yes! Projects are sold with full usage rights. You can use them for college submissions, portfolio building, or learning purposes. We recommend understanding the code so you can explain it during reviews.',
                },
                {
                    q: 'What formats are the projects delivered in?',
                    a: 'Projects are delivered as downloadable ZIP files containing the complete source code, documentation, and any necessary setup instructions.',
                },
            ],
        },
        {
            title: 'Selling Projects',
            faqs: [
                {
                    q: 'How do I list a project for sale?',
                    a: 'Create an account, go to your Dashboard, and click "Upload Project." Fill in the details like title, description, tech stack, set your price, and upload your project files and screenshots.',
                },
                {
                    q: 'How much commission does the platform take?',
                    a: 'We charge a flat 10% commission on each sale. You keep 90% of the sale price. Payments are processed to your linked bank account.',
                },
                {
                    q: 'Can I sell the same project to multiple buyers?',
                    a: 'Yes, projects are sold as digital goods and can be purchased by multiple buyers. Each buyer receives their own copy.',
                },
                {
                    q: 'What kinds of projects sell best?',
                    a: 'Full-stack web apps, ML/AI projects, mobile apps, and projects with good documentation tend to sell the best. Adding screenshots and a demo video significantly increases sales.',
                },
            ],
        },
        {
            title: 'Account & Payments',
            faqs: [
                {
                    q: 'How do I create an account?',
                    a: 'Click "Register" in the top navigation. Fill in your name, email, and password. You\'ll receive an OTP to verify your email address.',
                },
                {
                    q: 'How do I receive payments as a seller?',
                    a: 'Go to Dashboard → Banking Details and add your bank account or UPI ID. Payments are processed within 3-5 business days after a sale.',
                },
                {
                    q: 'Is my personal data secure?',
                    a: 'Absolutely. We use industry-standard encryption (bcrypt for passwords, HTTPS for data transfer) and never share your personal information with third parties.',
                },
            ],
        },
    ];

    let globalIndex = 0;

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Frequently Asked Questions
                        </h1>
                        <p className="text-gray-500 text-lg">
                            Everything you need to know about StudentMarket
                        </p>
                    </div>
                </ScrollReveal>

                {/* FAQ Sections */}
                <div className="space-y-10">
                    {faqCategories.map((category, catIndex) => (
                        <ScrollReveal key={catIndex} delay={catIndex * 100}>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center text-primary-500 text-sm font-bold">
                                        {catIndex + 1}
                                    </span>
                                    {category.title}
                                </h2>

                                <div className="space-y-3">
                                    {category.faqs.map((faq) => {
                                        const idx = globalIndex++;
                                        const isOpen = openIndex === idx;
                                        return (
                                            <div
                                                key={idx}
                                                className={`glass-card overflow-hidden transition-all duration-300 ${isOpen ? 'ring-2 ring-primary-500/20' : ''}`}
                                            >
                                                <button
                                                    onClick={() => toggle(idx)}
                                                    className="w-full flex items-center justify-between p-5 text-left"
                                                >
                                                    <span className="font-medium text-gray-900 pr-4">{faq.q}</span>
                                                    <HiChevronDown
                                                        className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                                                    />
                                                </button>
                                                <div
                                                    className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-60 opacity-100' : 'max-h-0 opacity-0'}`}
                                                >
                                                    <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed">
                                                        {faq.a}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Still need help? */}
                <ScrollReveal direction="up">
                    <div className="mt-12 glass-card p-8 text-center relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-cyan-50" />
                        <div className="relative z-10">
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Still have questions?</h3>
                            <p className="text-gray-500 mb-4">Can't find what you're looking for? Reach out to our team.</p>
                            <a
                                href="/contact"
                                className="btn-primary inline-flex items-center gap-2"
                            >
                                Contact Support
                            </a>
                        </div>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default FAQs;
