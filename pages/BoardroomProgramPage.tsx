
import React from 'react';
import { motion } from 'framer-motion';

interface Props {
    onApplyClick: () => void;
    onBack: () => void;
}

const BoardroomProgramPage: React.FC<Props> = ({ onApplyClick, onBack }) => {
    // Cast motion components to any for environment compatibility
    const MotionDiv = motion.div as any;

    const sections = [
        {
            title: "Program Overview",
            icon: "🌟",
            content: "The Boardroom Program is an elite certification path designed for senior professionals seeking to transition into Independent Directorship. This program bridges the gap between executive leadership and effective board governance, equipping candidates with the regulatory knowledge and strategic mindset required in modern boardrooms."
        },
        {
            title: "Companies Act Section 149",
            icon: "⚖️",
            content: "Under Section 149 of the Companies Act, 2013, specified classes of companies are mandated to have a certain number of Independent Directors. These directors play a pivotal role in ensuring corporate accountability, safeguarding stakeholder interests, and providing unbiased professional judgment on matters of strategy and risk."
        },
        {
            title: "Who Should Apply?",
            icon: "👥",
            content: "Ideally suited for CEOs, CFOs, COOs, Chartered Accountants, Legal Counsel, and Senior Executives with 15+ years of leadership experience. If you are passionate about corporate governance and have a track record of strategic decision-making, this program is your gateway to the next level of professional contribution."
        },
        {
            title: "Certification Benefits",
            icon: "🏆",
            content: "Gain institutional credibility through our verified directory listing. Benefits include exclusive networking opportunities with listed companies, mastery of board dynamics, deep understanding of ESG compliance, and placement assistance through our job portal specifically dedicated to board-level roles."
        }
    ];

    return (
        <div className="w-full flex flex-col items-center">
            {/* Hero Section - Updated per user request */}
            <div className="w-full min-h-[60vh] flex flex-col items-center px-6 py-12 relative overflow-hidden bg-[#0A192F]">
                <div className="w-full max-w-6xl relative">
                    <button 
                        onClick={onBack}
                        className="text-teal-400 hover:text-teal-300 transition-colors flex items-center gap-2 group mb-8"
                    >
                        <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span> Back to Home
                    </button>
                </div>

                <MotionDiv 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-5xl w-full text-center z-10"
                >
                    <div className="inline-block px-6 py-2 rounded-full border border-teal-500/30 mb-8">
                        <span className="text-teal-400 font-bold text-xs tracking-widest uppercase">ELITE CERTIFICATION</span>
                    </div>

                    {/* Updated Title: Box removed, text size reduced, headline clarified */}
                    <div className="mb-6">
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight mb-4">
                            Boardroom <span className="text-teal-400">Certification</span> Program
                        </h1>
                        <h2 className="text-2xl md:text-3xl font-bold text-blue-400 mb-6">
                            Become a Board-Ready Independent Director
                        </h2>
                    </div>

                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed mb-10 max-w-4xl mx-auto font-medium">
                        Master the art of corporate governance with our comprehensive certification program, 
                        strictly aligned with the <span className="text-white font-bold">Companies Act, MCA & IICA Framework</span>.
                    </p>
                    
                    <button 
                        onClick={onApplyClick}
                        className="px-10 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white rounded-xl font-bold text-lg shadow-xl hover:scale-105 transition-all active:scale-95"
                    >
                        Apply for Certification Now
                    </button>
                </MotionDiv>
            </div>

            {/* Feature Grid */}
            <div className="w-full max-w-screen-2xl px-6 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                    {sections.map((sec, idx) => (
                        <MotionDiv 
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            className="glass-card p-10 rounded-[2.5rem] border border-white/10 hover:border-teal-500/30 transition-all group relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/5 rounded-bl-full -z-10 transition-all group-hover:bg-teal-500/10"></div>
                            <div className="text-5xl mb-6 group-hover:scale-110 transition-transform origin-left">{sec.icon}</div>
                            <h2 className="text-3xl font-bold text-white mb-5">{sec.title}</h2>
                            <p className="text-gray-400 text-lg leading-relaxed">{sec.content}</p>
                        </MotionDiv>
                    ))}
                </div>

                {/* Process Section */}
                <MotionDiv 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="glass-card p-12 md:p-20 rounded-[3rem] border-t-4 border-teal-500 mb-20 shadow-2xl"
                >
                    <div className="flex flex-col lg:flex-row gap-16">
                        <div className="lg:w-1/3">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">The Application Process</h2>
                            <p className="text-gray-400 text-lg">Your step-by-step journey to becoming a certified Board Member.</p>
                            <div className="mt-8 h-1 w-24 bg-teal-500 rounded-full"></div>
                        </div>
                        <div className="lg:w-2/3 space-y-10">
                            {[
                                { step: "01", title: "Candidacy Submission", text: "Submit your professional profile and board candidacy details through our secure portal." },
                                { step: "02", title: "Governance Review", text: "Undergo a preliminary eligibility review by our elite governance committee." },
                                { step: "03", title: "Module Completion", text: "Complete the certification module covering Companies Act Section 149 and board ethics." },
                                { step: "04", title: "Global Listing", text: "Get verified and listed in the Independent Director Global Directory for board opportunities." }
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-8 group">
                                    <span className="text-4xl font-black text-teal-500/20 group-hover:text-teal-400/40 transition-colors pt-1">{item.step}</span>
                                    <div>
                                        <h4 className="text-2xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-lg text-gray-400 leading-relaxed">{item.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </MotionDiv>

                {/* Final Call to Action */}
                <div className="text-center bg-gradient-to-br from-blue-900/40 to-teal-900/20 p-16 md:p-24 rounded-[4rem] border border-white/10 shadow-3xl mb-20 relative overflow-hidden">
                    <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
                    
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">Ready to Elevate Your Career?</h2>
                    <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
                        Join the ranks of elite independent directors today. Your expertise is in high demand in the global boardroom.
                    </p>
                    <button 
                        onClick={onApplyClick}
                        className="glow-button px-16 py-6 rounded-2xl font-bold text-white text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all"
                    >
                        Apply for Board Certification
                    </button>
                    <p className="mt-8 text-sm text-gray-500 font-medium uppercase tracking-[0.3em]">Empowering Excellence in Governance</p>
                </div>
            </div>
        </div>
    );
};

export default BoardroomProgramPage;
