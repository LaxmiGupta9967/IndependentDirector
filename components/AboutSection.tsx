import React from 'react';

const AboutSection: React.FC = () => {
    return (
        <section id="about" className="container mx-auto max-w-screen-2xl py-16 px-4">
            <div className="bg-slate-800/90 dark:bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 md:p-12">
                <h2 className="text-4xl font-bold text-center mb-10 gradient-text">
                    About Independent Director
                </h2>
                
                <div className="border border-cyan-400/50 rounded-xl p-6 md:p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-white">
                        <div>
                            <p className="mb-6 leading-relaxed">
                                Independent Director is a next-generation AI-powered professional discovery platform that connects enterprises with verified independent directors across every industry — from tech and healthcare to finance and manufacturing.
                            </p>
                            <p className="leading-relaxed mb-6">
                                Our mission is to make corporate governance accessible, intelligent, and transparent. We use Google Gemini AI to analyze director profiles, summarize expertise, and recommend suitable candidates, helping companies build stronger, more diverse boards.
                            </p>
                             <p className="leading-relaxed">
                                Whether you're a company seeking board members, an investor performing due diligence, or a professional looking to connect with top-tier board members — Independent Director is your trusted partner.
                            </p>
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold gradient-text mb-4">Our Core Values</h3>
                            <ul className="space-y-3">
                                <li><strong className="font-semibold text-white">Transparency:</strong> Every director listed is verified and credible.</li>
                                <li><strong className="font-semibold text-white">Innovation:</strong> Built using AI to bring clarity and speed to board selection.</li>
                                <li><strong className="font-semibold text-white">Growth:</strong> Helping enterprises and directors grow through smart connections.</li>
                            </ul>
                            <h3 className="text-2xl font-bold gradient-text mt-8 mb-4">Our Vision</h3>
                            <p className="leading-relaxed">
                               To become India’s most trusted AI-driven director discovery platform, empowering excellence in corporate governance for enterprises and individuals globally.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AboutSection;