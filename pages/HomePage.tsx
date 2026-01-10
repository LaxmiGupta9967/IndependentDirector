
import React from 'react';
import SearchBar from '../components/SearchBar';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';
import InformationTicker from '../components/InformationTicker';


interface HomePageProps {
    onSearch: (query: string) => void;
    onViewDirectory: () => void;
    onProgramClick: () => void;
    onApplyClick: () => void;
    onRegisterDirectorClick: () => void;
    onPostJobClick: () => void;
}

const featuredSectors = ['Technology', 'Healthcare', 'Transport', 'Marketing', 'Finance', 'Retail'];

const SectionDivider: React.FC = () => (
    <div className="w-full max-w-screen-2xl mx-auto my-16">
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent glow-divider"></div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onSearch, onViewDirectory, onProgramClick, onApplyClick, onRegisterDirectorClick, onPostJobClick }) => {
    
    const handleScrollDown = () => {
        window.scrollTo({
            top: window.innerHeight * 0.8,
            behavior: 'smooth'
        });
    };

    return (
        <div className="flex flex-col w-full">
            {/* Information Ticker */}
            <InformationTicker />

            {/* Hero Section - Perfectly Centered */}
            <div className="relative min-h-[calc(100vh-8rem)] flex flex-col items-center justify-center text-center px-4 py-8">
                <div className="glass-card p-8 md:p-12 rounded-[2rem] max-w-6xl w-full outer-glow relative overflow-hidden transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-teal-400 to-blue-500"></div>
                    
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 mt-4">
                        <span className="text-blue-400">Independent</span> <span className="text-teal-400">Director</span>
                    </h1>
                    
                    <div className="text-lg md:text-xl text-white mb-10 space-y-1">
                        <p className="font-bold text-teal-300">Discover. Connect. Grow with Verified Independent Directors.</p>
                        <p>Your Gateway to Independent Director & Board Opportunities</p>
                        <p className="text-base md:text-xl text-gray-300 elegant-script italic">Profiles, Board Positions & Certification under Companies Act, MCA & IICA</p>
                    </div>
                    
                    {/* CTA Buttons - Responsive Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 justify-center">
                        {/* Button 1: Individuals */}
                        <button 
                            onClick={onRegisterDirectorClick}
                            className="glow-button flex flex-col items-center justify-center p-6 rounded-2xl transition-all hover:scale-[1.03] active:scale-95 border border-white/10 group h-full"
                        >
                            <span className="text-lg md:text-xl font-bold text-white mb-2">Create Your Board Profile</span>
                            <span className="text-xs md:text-sm text-blue-100/70 font-normal leading-tight group-hover:text-white transition-colors">
                                Post your profile as an Independent Director, Advisor or Mentor
                            </span>
                        </button>

                        {/* Button 2: Companies */}
                        <button 
                            onClick={onPostJobClick}
                            className="glow-button flex flex-col items-center justify-center p-6 rounded-2xl transition-all hover:scale-[1.03] active:scale-95 border border-white/10 bg-gradient-to-r from-teal-600 to-blue-700 group h-full"
                        >
                            <span className="text-lg md:text-xl font-bold text-white mb-2">Post a Board Position</span>
                            <span className="text-xs md:text-sm text-teal-100/70 font-normal leading-tight group-hover:text-white transition-colors">
                                Hire Independent Directors, Advisors & Mentors
                            </span>
                        </button>

                        {/* Button 3: Certification */}
                        <button 
                            onClick={onApplyClick}
                            className="glow-button flex flex-col items-center justify-center p-6 rounded-2xl transition-all hover:scale-[1.03] active:scale-95 border border-white/10 bg-gradient-to-r from-indigo-600 to-blue-600 group h-full md:col-span-2 lg:col-span-1"
                        >
                            <span className="text-lg md:text-xl font-bold text-white mb-2">Get Board Certified</span>
                            <span className="text-xs md:text-sm text-indigo-100/70 font-normal leading-tight group-hover:text-white transition-colors">
                                Certification from recognised bodies for Board roles
                            </span>
                        </button>
                    </div>

                    <div className="flex justify-center max-w-3xl mx-auto">
                        <SearchBar onSearch={onSearch} />
                    </div>
                </div>

                {/* Scroll Down Arrow */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
                    <button 
                        onClick={handleScrollDown}
                        className="text-white/40 hover:text-teal-400 transition-all duration-300 animate-bounce group p-2"
                        aria-label="Scroll down to content"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-10 w-10 md:h-12 md:w-12 group-hover:scale-110" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Content Sections */}
            <div id="sectors" className="w-full px-4 pb-16 pt-8">
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
