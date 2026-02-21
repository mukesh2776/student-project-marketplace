import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import {
    HiBookOpen,
    HiSearch,
    HiShoppingCart,
    HiUpload,
    HiCog,
    HiQuestionMarkCircle,
    HiLightningBolt,
    HiShieldCheck,
} from 'react-icons/hi';

const HelpCenter = () => {
    const guides = [
        {
            icon: HiSearch,
            title: 'Finding Projects',
            description: 'Use search, filters, and categories to browse the marketplace and find the perfect project.',
            link: '/projects',
            linkText: 'Browse Projects',
        },
        {
            icon: HiShoppingCart,
            title: 'Buying a Project',
            description: 'Add projects to your cart, proceed to checkout, and access your purchased files instantly.',
            link: '/projects',
            linkText: 'Start Shopping',
        },
        {
            icon: HiUpload,
            title: 'Selling Your Project',
            description: 'Create a listing with title, description, tech stack, screenshots, and set your price. You keep 90% of every sale.',
            link: '/upload',
            linkText: 'Upload Project',
        },
        {
            icon: HiCog,
            title: 'Managing Your Account',
            description: 'View your profile, manage listings, track orders, and update banking details from your dashboard.',
            link: '/dashboard',
            linkText: 'Go to Dashboard',
        },
        {
            icon: HiShieldCheck,
            title: 'Security & Privacy',
            description: 'Your data is encrypted and protected. Learn more about how we keep your information safe.',
            link: '/privacy',
            linkText: 'Privacy Policy',
        },
        {
            icon: HiQuestionMarkCircle,
            title: 'FAQs',
            description: 'Find answers to the most common questions about buying, selling, and using the platform.',
            link: '/faqs',
            linkText: 'View FAQs',
        },
    ];

    const quickTips = [
        {
            icon: '📸',
            tip: 'Add high-quality screenshots and a demo video to boost your project\'s visibility.',
        },
        {
            icon: '📝',
            tip: 'Write a detailed description with setup instructions — buyers prefer well-documented projects.',
        },
        {
            icon: '🏷️',
            tip: 'Price competitively. Check similar projects to understand the market range.',
        },
        {
            icon: '⭐',
            tip: 'Encourage buyers to leave reviews — good ratings increase discoverability.',
        },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <ScrollReveal>
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary-50 mb-4">
                            <HiBookOpen className="w-8 h-8 text-primary-500" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                            Learn how to get the most out of StudentMarket
                        </p>
                    </div>
                </ScrollReveal>

                {/* Guides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {guides.map((guide, index) => (
                        <ScrollReveal key={index} delay={index * 100} direction="up">
                            <div className="glass-card p-6 h-full flex flex-col">
                                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                                    <guide.icon className="w-6 h-6 text-primary-500" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">{guide.title}</h3>
                                <p className="text-gray-500 text-sm mb-4 flex-1">{guide.description}</p>
                                <Link
                                    to={guide.link}
                                    className="text-primary-500 text-sm font-medium hover:text-primary-600 transition-colors"
                                >
                                    {guide.linkText} →
                                </Link>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>

                {/* Quick Tips */}
                <ScrollReveal>
                    <div className="glass-card p-8 relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-cyan-50" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-6">
                                <HiLightningBolt className="w-6 h-6 text-yellow-500" />
                                <h2 className="text-2xl font-semibold text-gray-900">Quick Tips for Sellers</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {quickTips.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 bg-white/60 rounded-xl p-4">
                                        <span className="text-2xl">{item.icon}</span>
                                        <p className="text-gray-600 text-sm">{item.tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </ScrollReveal>

                {/* Still need help? */}
                <ScrollReveal direction="up">
                    <div className="mt-10 text-center">
                        <p className="text-gray-500 mb-3">Can't find what you're looking for?</p>
                        <Link to="/contact" className="btn-primary inline-block">Contact Support</Link>
                    </div>
                </ScrollReveal>
            </div>
        </div>
    );
};

export default HelpCenter;
