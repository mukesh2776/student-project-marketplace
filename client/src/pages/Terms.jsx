import ScrollReveal from '../components/ScrollReveal';

const Terms = () => {
    const lastUpdated = 'February 21, 2026';

    const sections = [
        {
            title: '1. Acceptance of Terms',
            content: `By accessing and using StudentMarket ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Platform. We reserve the right to update these terms at any time, and continued use of the Platform constitutes acceptance of any changes.`,
        },
        {
            title: '2. Account Registration',
            content: `To use certain features of the Platform, you must register for an account. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.`,
        },
        {
            title: '3. Buying Projects',
            content: `When you purchase a project on StudentMarket, you receive a non-exclusive, non-transferable license to use the project for personal, educational, and portfolio purposes. You may not resell, redistribute, or sublicense the project to others. Each purchase is for a single user only. We offer a 7-day refund policy if the project does not match its listed description.`,
        },
        {
            title: '4. Selling Projects',
            content: `By listing a project for sale, you represent that you are the original creator or have full rights to sell the project. You retain ownership of your project but grant StudentMarket a license to display and distribute it to buyers. The Platform charges a 10% commission on each successful sale. Sellers are responsible for ensuring their projects do not contain malicious code, plagiarized content, or copyrighted material they don't own.`,
        },
        {
            title: '5. Prohibited Conduct',
            content: `Users may not: (a) upload projects containing malware, viruses, or harmful code; (b) sell plagiarized or stolen projects; (c) misrepresent project features or functionality; (d) share purchased projects with others or resell them; (e) attempt to circumvent the Platform's payment system; (f) harass, abuse, or threaten other users.`,
        },
        {
            title: '6. Intellectual Property',
            content: `All content on the Platform, including the website design, logos, and branding, is the intellectual property of StudentMarket. Projects listed by sellers remain the intellectual property of their respective creators. By purchasing a project, you acquire usage rights but not ownership of the intellectual property.`,
        },
        {
            title: '7. Payments & Commissions',
            content: `All transactions are processed through secure payment gateways. Sellers receive 90% of the sale price, with 10% retained by the Platform as a service fee. Payments to sellers are processed within 3-5 business days. All prices on the Platform are listed in Indian Rupees (INR).`,
        },
        {
            title: '8. Limitation of Liability',
            content: `StudentMarket acts as an intermediary between buyers and sellers. We do not guarantee the quality, functionality, or completeness of any project listed on the Platform. The Platform is provided "as is" without warranties of any kind. We are not liable for any damages arising from your use of the Platform or any project purchased through it.`,
        },
        {
            title: '9. Account Termination',
            content: `We reserve the right to suspend or terminate your account if you violate these Terms of Service. Upon termination, your right to use the Platform ceases immediately. Any pending payments owed to you as a seller will be processed within 30 days of termination.`,
        },
        {
            title: '10. Contact',
            content: `If you have questions about these Terms of Service, please contact us at support@studentmarket.com or through our Contact page.`,
        },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
                        <p className="text-gray-400 text-sm">Last updated: {lastUpdated}</p>
                    </div>
                </ScrollReveal>

                <div className="space-y-8">
                    {sections.map((section, index) => (
                        <ScrollReveal key={index} delay={index * 50}>
                            <div className="glass-card p-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-3">{section.title}</h2>
                                <p className="text-gray-500 text-sm leading-relaxed">{section.content}</p>
                            </div>
                        </ScrollReveal>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Terms;
