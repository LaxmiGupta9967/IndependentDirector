
import React, { useState, useEffect } from 'react';
import { Director, Job } from './types';
import { getDirectors, deleteDirector } from './services/directorService';
import HomePage from './pages/HomePage';
import DirectoryPage from './pages/DirectoryPage';
import DirectorDetailPage from './pages/DirectorDetailPage';
import Header from './components/Header';
import Spinner from './components/Spinner';
import VantaBackground from './components/VantaBackground';
import Footer from './components/Footer';
import LoginPage from './pages/LoginPage';
import DirectorRegistrationPage from './pages/DirectorRegistrationPage';
import ProfilePage from './pages/ProfilePage';
import LegalPage from './pages/LegalPage';
import JobPortalPage from './pages/JobPortalPage';
import JobDetailsPage from './pages/JobDetailsPage';
import PostJobPage from './pages/PostJobPage';
import BoardroomProgramPage from './pages/BoardroomProgramPage';
import CertificationApplicationPage from './pages/CertificationApplicationPage';
import { useAuth } from './context/AuthContext';
import Chatbot from './components/Chatbot';

type View = 'home' | 'directory' | 'detail' | 'login' | 'register' | 'profile' | 'legal' | 'job-portal' | 'job-detail' | 'post-job' | 'program' | 'apply-cert';
type LegalSection = 'privacy' | 'terms' | 'disclaimer';

const App: React.FC = () => {
    const [view, setView] = useState<View>('home');
    const [directors, setDirectors] = useState<Director[]>([]);
    const [filteredDirectors, setFilteredDirectors] = useState<Director[]>([]);
    const [selectedDirector, setSelectedDirector] = useState<Director | null>(null);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [directorToEdit, setDirectorToEdit] = useState<Director | null>(null);
    const [dataLoading, setDataLoading] = useState<boolean>(true);
    const [isChatbotOpen, setIsChatbotOpen] = useState(false);
    const [legalSection, setLegalSection] = useState<LegalSection>('privacy');
    
    const { user, loading: authLoading } = useAuth();

    const fetchAllDirectors = async () => {
        try {
            setDataLoading(true);
            const allDirectors = await getDirectors();
            setDirectors(allDirectors);
            setFilteredDirectors(allDirectors);
        } catch (error) {
            console.error("Failed to fetch directors:", error);
        } finally {
            setDataLoading(false);
        }
    };

    useEffect(() => {
        fetchAllDirectors();
    }, []);

    const navigateHome = () => {
        setView('home');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Redirect to home if user logs in successfully from the login page
    useEffect(() => {
        if (user && view === 'login') {
            navigateHome();
        }
    }, [user, view]);

    const handleSearch = (query: string) => {
        if (!query) {
            setFilteredDirectors(directors);
            setView('directory');
            return;
        }
        setDataLoading(true);
        setView('directory');
        const lowerCaseQuery = query.toLowerCase();
        const results = directors.filter(d => 
            d.name.toLowerCase().includes(lowerCaseQuery) ||
            d.industry.toLowerCase().includes(lowerCaseQuery) ||
            d.description.toLowerCase().includes(lowerCaseQuery)
        );
        setFilteredDirectors(results);
        setDataLoading(false);
    };
    
    const handleSelectDirector = (id: string) => {
        const director = directors.find(d => d.id === id);
        if(director) {
            setSelectedDirector(director);
            setView('detail');
        }
    };

    const handleSelectJob = (job: Job) => {
        setSelectedJob(job);
        setView('job-detail');
    };
    
    const navigateToDirectory = () => {
        setFilteredDirectors(directors);
        setView('directory');
    };

    const handleScrollToSection = (sectionId: string) => {
        setView('home');
        setTimeout(() => {
            const element = document.getElementById(sectionId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    };

    const handleRegistrationSuccess = () => {
        setView('profile');
        setDirectorToEdit(null);
        fetchAllDirectors();
    };

    const handleLegalClick = (section: LegalSection) => {
        setLegalSection(section);
        setView('legal');
    };

    const renderView = () => {
        if(dataLoading && !['home', 'register', 'login', 'profile', 'legal', 'job-portal', 'job-detail', 'post-job', 'program', 'apply-cert'].includes(view)) {
            return <div className="flex justify-center items-center flex-grow"><Spinner /></div>
        }

        switch (view) {
            case 'home':
                return <HomePage 
                    onSearch={handleSearch} 
                    onViewDirectory={navigateToDirectory} 
                    onProgramClick={() => setView('program')}
                    onApplyClick={() => setView('apply-cert')}
                />;
            case 'directory':
                return <DirectoryPage directors={filteredDirectors} onSelectDirector={handleSelectDirector} onSearch={handleSearch}/>;
            case 'detail':
                return selectedDirector ? <DirectorDetailPage director={selectedDirector} onBack={() => setView('directory')} /> : null;
            case 'job-portal':
                return <JobPortalPage onSelectJob={handleSelectJob} onPostJob={() => setView('post-job')} />;
            case 'post-job':
                return <PostJobPage onCancel={() => setView('job-portal')} onSuccess={() => setView('job-portal')} />;
            case 'job-detail':
                return selectedJob ? <JobDetailsPage job={selectedJob} onBack={() => setView('job-portal')} onLoginRedirect={() => setView('login')} /> : null;
            case 'program':
                return <BoardroomProgramPage onApplyClick={() => setView('apply-cert')} onBack={navigateHome} />;
            case 'apply-cert':
                return <CertificationApplicationPage onBack={() => setView('program')} onSuccess={() => setView('home')} onLoginRedirect={() => setView('login')} />;
            case 'login':
                return <LoginPage />;
            case 'profile':
                return user ? (
                    <ProfilePage 
                        onEdit={(d) => { setDirectorToEdit(d.id ? d : null); setView('register'); }} 
                        onHome={navigateHome} 
                        onViewDetails={(d) => { setSelectedDirector(d); setView('detail'); }}
                        onDeleteSuccess={handleRegistrationSuccess}
                    />
                ) : <LoginPage />;
            case 'register':
                return <DirectorRegistrationPage onCancel={() => setView('profile')} onSuccess={handleRegistrationSuccess} initialData={directorToEdit} />;
            case 'legal':
                return <LegalPage type={legalSection} onBack={navigateHome} />;
            default:
                return <HomePage 
                    onSearch={handleSearch} 
                    onViewDirectory={navigateToDirectory}
                    onProgramClick={() => setView('program')}
                    onApplyClick={() => setView('apply-cert')}
                />;
        }
    };

    if (authLoading) return <div className="min-h-screen flex justify-center items-center bg-[#0A192F]"><Spinner /></div>;

    return (
        <div className={`transition-colors duration-300 ${(view === 'home' || view === 'login') ? 'bg-transparent' : 'bg-[#0A192F]'} text-white min-h-screen flex flex-col`}>
            {(view === 'home' || view === 'login') && <VantaBackground />}
            <Header 
                onHomeClick={navigateHome} 
                onDirectoryClick={navigateToDirectory}
                onJobsClick={() => setView('job-portal')}
                onProgramClick={() => setView('program')}
                onAboutClick={() => handleScrollToSection('about')}
                onContactClick={() => handleScrollToSection('contact')}
                onLoginClick={() => setView('login')}
                onRegisterClick={() => setView('profile')}
                onLogoutClick={() => setView('home')}
            />
            <main className="pt-20 relative z-10 flex-grow flex flex-col">
                {renderView()}
            </main>
            <Footer 
                onHomeClick={navigateHome} 
                onDirectoryClick={navigateToDirectory}
                onAboutClick={() => handleScrollToSection('about')}
                onContactClick={() => handleScrollToSection('contact')}
                onLegalClick={handleLegalClick}
            />
            <button onClick={() => setIsChatbotOpen(true)} className="fixed bottom-6 right-6 p-4 rounded-full bg-gradient-to-r from-teal-500 to-blue-600 shadow-lg z-40">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
            </button>
            <Chatbot isOpen={isChatbotOpen} onClose={() => setIsChatbotOpen(false)} directors={directors} />
        </div>
    );
};

export default App;
