
import React from 'react';

const InformationTicker: React.FC = () => {
    return (
        <div className="w-full bg-[#0A192F]/90 backdrop-blur-md border-y border-teal-500/30 py-4 overflow-hidden relative z-20 shadow-lg">
            <div className="container mx-auto px-4 overflow-hidden relative">
                <div className="animate-marquee flex items-center gap-6">
                    {/* First Copy */}
                    <span className="text-teal-400 text-2xl">⚖️</span>
                    <p className="text-white md:text-lg text-sm font-semibold tracking-wide">
                        Companies Act, 2013 (Section 149) mandates listed public companies to appoint at least one-third of their Board as Independent Directors.
                        Independent Directors bring transparency, objectivity, and balanced decision-making between management and shareholders.
                        Companies are actively seeking visionary leaders for Independent Director positions.
                    </p>
                    <span className="mx-12 text-teal-800 text-xl font-bold">•</span>
                    <span className="text-teal-400 text-2xl">🏛️</span>
                    <p className="text-white md:text-lg text-sm font-semibold tracking-wide">
                        Companies Act, 2013 (Section 149) mandates listed public companies to appoint at least one-third of their Board as Independent Directors.
                        Independent Directors bring transparency, objectivity, and balanced decision-making between management and shareholders.
                        Companies are actively seeking visionary leaders for Independent Director positions.
                    </p>
                    <span className="mx-12 text-teal-800 text-xl font-bold">•</span>

                    {/* Second Copy for Seamless Loop */}
                    <span className="text-teal-400 text-2xl">⚖️</span>
                    <p className="text-white md:text-lg text-sm font-semibold tracking-wide">
                        Companies Act, 2013 (Section 149) mandates listed public companies to appoint at least one-third of their Board as Independent Directors.
                        Independent Directors bring transparency, objectivity, and balanced decision-making between management and shareholders.
                        Companies are actively seeking visionary leaders for Independent Director positions.
                    </p>
                    <span className="mx-12 text-teal-800 text-xl font-bold">•</span>
                    <span className="text-teal-400 text-2xl">🏛️</span>
                    <p className="text-white md:text-lg text-sm font-semibold tracking-wide">
                        Companies Act, 2013 (Section 149) mandates listed public companies to appoint at least one-third of their Board as Independent Directors.
                        Independent Directors bring transparency, objectivity, and balanced decision-making between management and shareholders.
                        Companies are actively seeking visionary leaders for Independent Director positions.
                    </p>
                    <span className="mx-12 text-teal-800 text-xl font-bold">•</span>
                </div>
            </div>
            {/* Subtle bottom glow */}
            <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
            {/* Subtle top glow */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-teal-500/50 to-transparent"></div>
        </div>
    );
};

export default InformationTicker;
