import { Link } from 'react-router-dom';
import {
    HiMail,
    HiPhone,
    HiLocationMarker
} from 'react-icons/hi';
import {
    FaTwitter,
    FaGithub,
    FaLinkedin,
    FaInstagram
} from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const categories = [
        { name: 'Web Development', slug: 'web-development' },
        { name: 'Mobile Apps', slug: 'mobile-app' },
        { name: 'Machine Learning', slug: 'machine-learning' },
        { name: 'Data Science', slug: 'data-science' },
        { name: 'Blockchain', slug: 'blockchain' },
    ];

    const quickLinks = [
        { name: 'Browse Projects', path: '/projects' },
        { name: 'Sell a Project', path: '/upload' },
        { name: 'How It Works', path: '/#how-it-works' },
        { name: 'Pricing', path: '/#pricing' },
    ];

    const supportLinks = [
        { name: 'Help Center', path: '/help' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQs', path: '/faqs' },
        { name: 'Terms of Service', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
    ];

    return (
        <footer className="bg-white border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
                                <span className="text-white font-bold text-xl">S</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900">
                                Student<span className="text-gradient">Market</span>
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm">
                            The marketplace for students to buy and sell their coding projects.
                            Turn your academic work into profit.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaTwitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaGithub className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaLinkedin className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary-500 transition-colors">
                                <FaInstagram className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-gray-900 font-semibold mb-4">Categories</h3>
                        <ul className="space-y-2">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        to={`/projects?category=${category.slug}`}
                                        className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-gray-900 font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <Link
                                        to={link.path}
                                        className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                                    >
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-gray-900 font-semibold mb-4">Contact Us</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-gray-500 text-sm">
                                <HiMail className="w-4 h-4 text-primary-500" />
                                support@studentmarket.com
                            </li>
                            <li className="flex items-center gap-2 text-gray-500 text-sm">
                                <HiPhone className="w-4 h-4 text-primary-500" />
                                +91 12345 67890
                            </li>
                            <li className="flex items-start gap-2 text-gray-500 text-sm">
                                <HiLocationMarker className="w-4 h-4 text-primary-500 mt-0.5" />
                                <span>123 Tech Street, Bangalore, India</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-gray-500 text-sm">
                        © {currentYear} StudentMarket. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {supportLinks.slice(3).map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                className="text-gray-500 hover:text-gray-900 text-sm transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
