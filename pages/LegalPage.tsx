
import React, { useEffect } from 'react';

type LegalPageType = 'privacy' | 'terms' | 'disclaimer';

interface LegalPageProps {
    type: LegalPageType;
    onBack: () => void;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, onBack }) => {
    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [type]);

    const getContent = () => {
        switch (type) {
            case 'privacy':
                return {
                    title: 'Privacy Policy',
                    content: (
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p className="italic text-gray-400">Effective Date: {new Date().toLocaleDateString()}</p>
                            <p>At Independent Director, accessible from our website, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by Independent Director and how we use it.</p>
                            
                            <h3 className="text-xl font-bold text-white mt-8 mb-2">1. Information We Collect</h3>
                            <p>We collect information you provide directly to us, such as when you create an account, update your profile, or contact us. This may include your name, email address, professional details, and other information necessary for the directory listings.</p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-2">2. How We Use Your Information</h3>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>To operate, maintain, and improve our directory.</li>
                                <li>To facilitate connections between directors and organizations.</li>
                                <li>To communicate with you regarding updates, security alerts, and support.</li>
                                <li>To detect and prevent fraud or abusive behavior.</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-2">3. Log Files</h3>
                            <p>Independent Director follows a standard procedure of using log files. These files log visitors when they visit websites. The information collected by log files include internet protocol (IP) addresses, browser type, Internet Service Provider (ISP), date and time stamp, referring/exit pages, and possibly the number of clicks.</p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-2">4. Data Security</h3>
                            <p>We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.</p>
                        </div>
                    )
                };
            case 'terms':
                return {
                    title: 'Terms & Conditions',
                    content: (
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                             <p className="italic text-gray-400">Last Updated: {new Date().toLocaleDateString()}</p>
                            <h3 className="text-xl font-bold text-white mt-8 mb-2">1. Introduction</h3>
                            <p>These Website Standard Terms and Conditions written on this webpage shall manage your use of our website, Independent Director.</p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-2">2. Intellectual Property Rights</h3>
                            <p>Other than the content you own, under these Terms, Independent Director and/or its licensors own all the intellectual property rights and materials contained in this Website.</p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-2">3. Restrictions</h3>
                            <p>You are specifically restricted from all of the following:</p>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Publishing any Website material in any other media without permission;</li>
                                <li>Selling, sublicensing and/or otherwise commercializing any Website material;</li>
                                <li>Publicly performing and/or showing any Website material;</li>
                                <li>Using this Website in any way that is or may be damaging to this Website;</li>
                                <li>Using this Website in any way that impacts user access to this Website;</li>
                            </ul>

                            <h3 className="text-xl font-bold text-white mt-8 mb-2">4. Limitation of Liability</h3>
                            <p>In no event shall Independent Director, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this Website.</p>
                        </div>
                    )
                };
            case 'disclaimer':
                return {
                    title: 'Disclaimer',
                    content: (
                        <div className="space-y-4 text-gray-300 text-sm md:text-base leading-relaxed">
                            <p>The information provided by Independent Director ("we," "us", or "our") on our website is for general informational purposes only. All information on the Site is provided in good faith, however we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability or completeness of any information on the Site.</p>
                            
                            <h3 className="text-xl font-bold text-white mt-8 mb-2">External Links Disclaimer</h3>
                            <p>The Site may contain (or you may be sent through the Site) links to other websites or content belonging to or originating from third parties. Such external links are not investigated, monitored, or checked for accuracy, adequacy, validity, reliability, availability or completeness by us.</p>

                            <h3 className="text-xl font-bold text-white mt-8 mb-2">Professional Disclaimer</h3>
                            <p>The Site does not contain legal or financial advice. The information is provided for general informational and educational purposes only and is not a substitute for professional advice. Accordingly, before taking any actions based upon such information, we encourage you to consult with the appropriate professionals.</p>
                        </div>
                    )
                };
            default:
                return { title: '', content: null };
        }
    };

    const { title, content } = getContent();

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl min-h-screen">
             <button 
                onClick={onBack}
                className="mb-8 text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2 group"
            >
                <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Back to Home
            </button>
            <div className="glass-card p-8 md:p-12 rounded-2xl outer-glow border border-white/10">
                <h1 className="text-3xl md:text-4xl font-bold gradient-text mb-8 border-b border-gray-700 pb-4">{title}</h1>
                <div className="prose prose-invert max-w-none">
                    {content}
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
