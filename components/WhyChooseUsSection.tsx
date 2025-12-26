
import React from 'react';
import { motion } from 'framer-motion';

const features = [
    {
        title: "Verified Directors",
        desc: "All profiles are background-checked and verified",
        icon: (
            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    },
    {
        title: "Industry Expertise",
        desc: "Directors across technology, finance, healthcare, transport, marketing, and retail",
        icon: (
            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        )
    },
    {
        title: "Compliance Ready",
        desc: "Aligned with Companies Act and corporate governance norms",
        icon: (
             <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
        )
    },
    {
        title: "Fast Appointment",
        desc: "Connect and onboard directors quickly",
        icon: (
             <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        )
    },
    {
        title: "Confidential & Secure",
        desc: "Data privacy and secure communication",
        icon: (
             <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
        )
    },
    {
        title: "Pan-India Network",
        desc: "Directors available across major Indian cities",
        icon: (
            <svg className="w-8 h-8 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        )
    }
];

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Fix: Removed Variants type annotation since it's not exported as a value in some framer-motion versions
const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring" as const,
            stiffness: 100
        }
    }
};

const WhyChooseUsSection: React.FC = () => {
    // Fix: Cast motion.div to any to bypass type errors for motion props
    const MotionDiv = motion.div as any;

    return (
        <section className="container mx-auto px-6 py-16 max-w-screen-2xl">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold gradient-text mb-4">Why IndependentDirector?</h2>
                <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full"></div>
            </div>

            <MotionDiv 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {features.map((feature, index) => (
                    <MotionDiv
                        key={index}
                        variants={itemVariants}
                        whileHover={{ y: -5, boxShadow: "0 0 25px rgba(20, 184, 166, 0.2)" }}
                        className="glass-card p-8 rounded-xl border border-white/5 hover:border-teal-400/30 transition-colors duration-300 flex flex-col items-center md:items-start text-center md:text-left"
                    >
                        <div className="bg-teal-500/10 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{feature.desc}</p>
                    </MotionDiv>
                ))}
            </MotionDiv>
        </section>
    );
};

export default WhyChooseUsSection;
