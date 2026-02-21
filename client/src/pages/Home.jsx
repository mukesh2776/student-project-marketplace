import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { projectsAPI } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import Button from '../components/Button';
import ScrollReveal from '../components/ScrollReveal';
import SkeletonCard from '../components/SkeletonCard';
import AnimatedCounter from '../components/AnimatedCounter';
import {
    HiArrowRight,
    HiLightningBolt,
    HiCurrencyDollar,
    HiShieldCheck,
    HiUserGroup,
    HiCode,
    HiTrendingUp
} from 'react-icons/hi';

const Home = () => {
    const [featuredProjects, setFeaturedProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await projectsAPI.getFeatured();
                setFeaturedProjects(response.data);
            } catch (error) {
                console.error('Error fetching featured projects:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeatured();
    }, []);

    const stats = [
        { end: 500, suffix: '+', prefix: '', label: 'Projects Sold', icon: HiCode },
        { end: 2000, suffix: '+', prefix: '', label: 'Happy Students', icon: HiUserGroup },
        { end: 500000, suffix: '+', prefix: '₹', label: 'Earned by Sellers', icon: HiTrendingUp },
    ];

    const howItWorks = [
        {
            step: '01',
            title: 'List Your Project',
            description: 'Upload your project with details, screenshots, and set your price.',
            icon: '📤',
        },
        {
            step: '02',
            title: 'Connect with Buyers',
            description: 'Students browse and purchase projects that fit their needs.',
            icon: '🤝',
        },
        {
            step: '03',
            title: 'Get Paid',
            description: 'Receive 90% of the sale price directly to your account.',
            icon: '💰',
        },
    ];

    const features = [
        {
            title: 'Instant Access',
            description: 'Download projects immediately after purchase with secure links.',
            icon: HiLightningBolt,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50',
        },
        {
            title: 'Fair Pricing',
            description: 'Only 10% commission. Sellers keep 90% of their earnings.',
            icon: HiCurrencyDollar,
            color: 'text-green-500',
            bg: 'bg-green-50',
        },
        {
            title: 'Verified Projects',
            description: 'All projects are reviewed for quality and authenticity.',
            icon: HiShieldCheck,
            color: 'text-blue-500',
            bg: 'bg-blue-50',
        },
    ];

    const categories = [
        { name: 'Web Development', icon: '🌐', count: 120, slug: 'web-development' },
        { name: 'Mobile Apps', icon: '📱', count: 85, slug: 'mobile-app' },
        { name: 'Machine Learning', icon: '🤖', count: 64, slug: 'machine-learning' },
        { name: 'Data Science', icon: '📊', count: 45, slug: 'data-science' },
        { name: 'Blockchain', icon: '⛓️', count: 32, slug: 'blockchain' },
        { name: 'Game Development', icon: '🎮', count: 28, slug: 'game-development' },
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-gradient relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 shadow-sm mb-6 animate-fade-in">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-600">Over 500+ projects sold</span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 animate-fade-in">
                            Turn Your Projects Into{' '}
                            <span className="text-gradient">Profit</span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-500 mb-8 max-w-2xl mx-auto animate-fade-in">
                            The marketplace for students to buy and sell unique coding projects.
                            Stand out in placements with original work, not recycled GitHub repos.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in">
                            <Link to="/projects">
                                <Button
                                    size="lg"
                                    rightIcon={<HiArrowRight className="w-5 h-5" />}
                                >
                                    Browse Projects
                                </Button>
                            </Link>
                            <Link to="/register">
                                <Button variant="secondary" size="lg">
                                    Start Selling
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Floating Elements (decorative) */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent-cyan/5 rounded-full blur-3xl" />
            </section>

            {/* Stats Section */}
            <section className="py-16 border-y border-gray-200 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {stats.map((stat, index) => (
                            <ScrollReveal key={index} delay={index * 150} direction="up">
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary-50 mb-4">
                                        <stat.icon className="w-6 h-6 text-primary-500" />
                                    </div>
                                    <div className="text-3xl sm:text-4xl font-bold text-gradient mb-2">
                                        <AnimatedCounter end={stat.end} suffix={stat.suffix} prefix={stat.prefix} duration={2000} />
                                    </div>
                                    <p className="text-gray-500">{stat.label}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-12">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Explore Categories
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                Find projects across various domains and technologies
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {categories.map((category, index) => (
                            <ScrollReveal key={category.slug} delay={index * 100} direction="up">
                                <Link
                                    to={`/projects?category=${category.slug}`}
                                    className="glass-card p-4 text-center card-hover group block"
                                >
                                    <span className="text-4xl mb-3 block">{category.icon}</span>
                                    <h3 className="text-gray-900 font-semibold text-sm mb-1 group-hover:text-primary-500 transition-colors">
                                        {category.name}
                                    </h3>
                                    <p className="text-gray-400 text-xs">{category.count} projects</p>
                                </Link>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Projects */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="flex justify-between items-center mb-12">
                            <div>
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                                    Featured Projects
                                </h2>
                                <p className="text-gray-500">Hand-picked quality projects</p>
                            </div>
                            <Link to="/projects" className="hidden sm:block">
                                <Button
                                    variant="ghost"
                                    rightIcon={<HiArrowRight className="w-4 h-4" />}
                                >
                                    View All
                                </Button>
                            </Link>
                        </div>
                    </ScrollReveal>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <SkeletonCard key={i} />
                            ))}
                        </div>
                    ) : featuredProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProjects.slice(0, 4).map((project, index) => (
                                <ScrollReveal key={project._id} delay={index * 120}>
                                    <ProjectCard project={project} />
                                </ScrollReveal>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No featured projects yet. Be the first to list!</p>
                            <Link to="/upload" className="inline-block mt-4">
                                <Button>Upload Project</Button>
                            </Link>
                        </div>
                    )}

                    <div className="text-center mt-8 sm:hidden">
                        <Link to="/projects">
                            <Button variant="secondary">View All Projects</Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20" id="how-it-works">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                How It Works
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                Start selling your projects in three simple steps
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {howItWorks.map((item, index) => (
                            <ScrollReveal key={index} delay={index * 200} direction="up">
                                <div className="relative">
                                    <div className="glass-card p-8 text-center h-full">
                                        <span className="text-5xl mb-6 block">{item.icon}</span>
                                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                                            <span className="text-white text-sm font-bold">{item.step}</span>
                                        </div>
                                        <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                            {item.title}
                                        </h3>
                                        <p className="text-gray-500">{item.description}</p>
                                    </div>
                                    {index < howItWorks.length - 1 && (
                                        <div className="hidden md:block absolute top-1/2 -right-4 w-8 text-gray-300">
                                            <HiArrowRight className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ScrollReveal>
                        <div className="text-center mb-16">
                            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                Why Choose Us
                            </h2>
                            <p className="text-gray-500 max-w-2xl mx-auto">
                                Built by students, for students
                            </p>
                        </div>
                    </ScrollReveal>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <ScrollReveal key={index} delay={index * 150} direction="up">
                                <div className="glass-card p-8">
                                    <div className={`w-12 h-12 rounded-xl ${feature.bg} flex items-center justify-center mb-4 ${feature.color}`}>
                                        <feature.icon className="w-6 h-6" />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-500">{feature.description}</p>
                                </div>
                            </ScrollReveal>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <ScrollReveal direction="up" duration={800}>
                <section className="py-20">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <div className="glass-card p-12 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary-50 to-cyan-50" />
                            <div className="relative z-10">
                                <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                                    Ready to Get Started?
                                </h2>
                                <p className="text-gray-500 mb-8 max-w-xl mx-auto">
                                    Join thousands of students already using StudentMarket to buy and sell projects.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link to="/register">
                                        <Button size="lg">Create Free Account</Button>
                                    </Link>
                                    <Link to="/projects">
                                        <Button variant="secondary" size="lg">Browse Projects</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </ScrollReveal>
        </div>
    );
};

export default Home;
