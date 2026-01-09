
import React from 'react';
import SearchBar from '../components/SearchBar';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';


interface HomePageProps {
    onSearch: (query: string) => void;
    onViewDirectory: () => void;
    onProgramClick: () => void;
    onApplyClick: () => void;
}

const featuredSectors = ['Technology', 'Healthcare', 'Transport', 'Marketing', 'Finance', 'Retail'];

const SectionDivider: React.FC = () => (
    <div className="w-full max-w-screen-2xl mx-auto my-16">
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent glow-divider"></div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onSearch, onViewDirectory, onProgramClick, onApplyClick }) => {
    return (
        <div className="flex flex-col w-full">
            {/* Hero Section - Perfectly Centered */}
            <div className="relative min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center px-4 py-12">
                <div className="glass-card p-8 md:p-12 rounded-2xl max-w-4xl w-full outer-glow relative overflow-hidden transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500"></div>
                    
                    {/* Branding Strip */}
                    <div className="mb-8 flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-700">
                        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-teal-500/10 border border-teal-500/20 mb-3 group hover:bg-teal-500/20 transition-all cursor-default">
                            <span className="text-base md:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                                <span className="text-xl group-hover:scale-125 transition-transform">🎙️</span> 
                                The Boardroom Podcast™
                            </span>
                        </div>
                        <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.4em] font-extrabold text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]">
                            Where Experienced Leaders Step Into the Boardroom
                        </p>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        <span className="text-blue-400">Independent</span> <span className="text-teal-400">Director</span>
                    </h1>
                    
                    <div className="text-lg md:text-xl text-white mb-8 space-y-1">
                        <p className="font-bold text-teal-300">Learn. Certify. Lead.</p>
                        <p>Get Board-Ready as a Certified Independent Director</p>
                        <p className="text-sm md:text-base text-gray-400">under Companies Act, MCA & IICA Framework.</p>
                    </div>
                    
                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 mb-6 justify-center items-center">
                        <button 
                            onClick={onApplyClick}
                            className="glow-button w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            <span>🎓</span> Apply for Board Certification
                        </button>
                        <button 
                            onClick={onProgramClick}
                            className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white border-2 border-teal-500/50 hover:bg-teal-500/10 transition-all hover:scale-105 flex items-center justify-center gap-2 text-sm md:text-base"
                        >
                            <span>📘</span> Explore the Boardroom Program
                        </button>
                    </div>

                    {/* Micro-copy */}
                    <div className="mb-10 text-xs md:text-sm text-gray-400 font-medium animate-pulse">
                        <p>Boards Are Looking. Are You Board-Ready?</p>
                        <p className="text-teal-400 font-bold uppercase tracking-wider mt-1">Get Certified. Get Empanelled. Get Considered.</p>
                    </div>

                    <div className="flex justify-center">
                        <SearchBar onSearch={onSearch} />
                    </div>
                </div>
            </div>

            {/* Content Sections */}
            <div className="w-full px-4 pb-16">
                <div className="container mx-auto max-w-screen-2xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold gradient-text mb-4">Explore Featured Sectors</h2>
                        <div className="h-1 w-20 bg-gradient-to-r from-blue-500 to-teal-400 mx-auto rounded-full mb-8"></div>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {featuredSectors.map(sector => (
                                <div 
                                    key={sector}
                                    onClick={() => onSearch(sector)}
                                    className="glass-card p-6 rounded-lg cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:outer-glow group"
                                >
                                    <h3 className="text-lg font-semibold text-white group-hover:text-teal-400 transition-colors">{sector}</h3>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <SectionDivider />
                    <WhyChooseUsSection />
                    <SectionDivider />
                    <AboutSection />
                    <SectionDivider />
                    <ContactSection />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
