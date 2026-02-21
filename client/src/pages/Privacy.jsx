import ScrollReveal from '../components/ScrollReveal';

const Privacy = () => {
    const lastUpdated = 'February 21, 2026';

    const sections = [
        {
            title: '1. Information We Collect',
            content: `We collect information you provide during registration (name, email, password) and when using the Platform (projects uploaded, purchase history, banking details for sellers). We also automatically collect device information, IP addresses, browser type, and usage analytics through cookies.`,
        },
        {
            title: '2. How We Use Your Information',
            content: `Your information is used to: (a) provide and maintain our services; (b) process transactions and send related information; (c) send notifications about your account, purchases, and sales; (d) improve our Platform and develop new features; (e) detect, prevent, and address fraud and security issues.`,
        },
        {
            title: '3. Data Storage & Security',
            content: `Your data is stored on secure servers with encryption at rest and in transit. Passwords are hashed using bcrypt. We use HTTPS for all data transmission. While we implement industry-standard security measures, no method of electronic storage is 100% secure, and we cannot guarantee absolute security.`,
        },
        {
            title: '4. Data Sharing',
            content: `We do not sell your personal data to third parties. We may share limited information with: (a) payment processors to facilitate transactions; (b) law enforcement when required by law; (c) service providers who assist in operating our Platform (email services, hosting), bound by confidentiality agreements.`,
        },
        {
            title: '5. Cookies & Tracking',
            content: `We use essential cookies to maintain your session and preferences. We may use analytics cookies to understand how users interact with our Platform. You can control cookie preferences through your browser settings. Disabling essential cookies may affect Platform functionality.`,
        },
        {
            title: '6. Your Rights',
            content: `You have the right to: (a) access, update, or delete your personal data; (b) opt out of marketing communications; (c) request a copy of your data; (d) withdraw consent for data processing. To exercise these rights, contact us at support@studentmarket.com.`,
        },
        {
            title: '7. Data Retention',
            content: `We retain your data for as long as your account is active. If you delete your account, we will remove your personal data within 30 days, except where retention is required by law or for legitimate business purposes (e.g., transaction records for accounting).`,
        },
        {
            title: '8. Children\'s Privacy',
            content: `Our Platform is not intended for use by individuals under the age of 16. We do not knowingly collect personal information from children. If we become aware that we have collected data from a child, we will take steps to delete it promptly.`,
        },
        {
            title: '9. Changes to This Policy',
            content: `We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a prominent notice on the Platform. Your continued use after changes constitutes acceptance of the updated policy.`,
        },
        {
            title: '10. Contact Us',
            content: `For privacy-related inquiries, please contact our Data Protection team at support@studentmarket.com or through our Contact page.`,
        },
    ];

    return (
        <div className="min-h-screen py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
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

export default Privacy;
