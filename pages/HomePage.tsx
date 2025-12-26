
import React from 'react';
import SearchBar from '../components/SearchBar';
import AboutSection from '../components/AboutSection';
import ContactSection from '../components/ContactSection';
import WhyChooseUsSection from '../components/WhyChooseUsSection';


interface HomePageProps {
    onSearch: (query: string) => void;
    onViewDirectory: () => void;
}

const featuredSectors = ['Technology', 'Healthcare', 'Transport', 'Marketing', 'Finance', 'Retail'];

const SectionDivider: React.FC = () => (
    <div className="w-full max-w-screen-2xl mx-auto my-16">
        <div className="h-px bg-gradient-to-r from-transparent via-teal-500 to-transparent glow-divider"></div>
    </div>
);

const HomePage: React.FC<HomePageProps> = ({ onSearch, onViewDirectory }) => {
    return (
        <div>
             <div className="relative min-h-screen flex flex-col items-center justify-center text-center px-4">
                <div className="glass-card p-8 md:p-12 rounded-2xl max-w-4xl w-full outer-glow">
                    <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
                        <span className="text-blue-400">Independent</span> <span className="text-teal-400">Director</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white mb-8">Discover. Connect. Grow with Verified Independent Directors.</p>
                    <SearchBar onSearch={onSearch} />
                </div>

                <div className="mt-16 w-full max-w-screen-2xl px-4">
                    <h2 className="text-3xl font-bold gradient-text mb-8">Explore Featured Sectors</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {featuredSectors.map(sector => (
                            <div 
                                key={sector}
                                onClick={() => onSearch(sector)}
                                className="glass-card p-6 rounded-lg cursor-pointer transition-all duration-300 hover:transform hover:-translate-y-2 hover:outer-glow"
                            >
                                <h3 className="text-lg font-semibold text-white">{sector}</h3>
                            </div>
                        ))}
                    </div>
                </div>
             </div>
             
             <div className="px-4 pb-16">
                <SectionDivider />
                <WhyChooseUsSection />
                <SectionDivider />
                <AboutSection />
                <SectionDivider />
                <ContactSection />
            </div>
        </div>
    );
};

export default HomePage;
