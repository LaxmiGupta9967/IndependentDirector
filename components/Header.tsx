
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
    onHomeClick: () => void;
    onDirectoryClick: () => void;
    onJobsClick: () => void;
    onProgramClick: () => void;
    onAboutClick: () => void;
    onContactClick: () => void;
    onLoginClick: () => void;
    onRegisterClick: () => void;
    onLogoutClick: () => void;
    onDeleteProfile?: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
    onHomeClick, 
    onDirectoryClick,
    onJobsClick,
    onProgramClick,
    onAboutClick, 
    onContactClick,
    onLoginClick,
    onRegisterClick,
    onLogoutClick,
}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { user, logout } = useAuth();
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

    const handleLinkClick = (navFunction: () => void) => {
        navFunction();
        setIsMenuOpen(false);
    };

    const navButtonClasses = "font-semibold text-xs lg:text-sm text-white bg-cyan-600 hover:bg-cyan-500 transition-colors duration-300 px-3 lg:px-4 py-1.5 rounded-md shadow whitespace-nowrap";
    const mobileNavButtonClasses = "w-full text-center py-3 font-semibold text-white bg-cyan-600 hover:bg-cyan-500 transition-colors duration-300 rounded-md shadow text-lg";

    const avatarUrl = user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`;
    // Logo requested by the user
    const brandLogoUrl = "https://i.postimg.cc/T1RnvJWX/Untitled-design-1-removebg-preview.png";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
            <nav className="container mx-auto px-4 lg:px-6 py-3 flex justify-between items-center">
                <div className="flex items-center cursor-pointer group" onClick={onHomeClick}>
                    <img 
                        src={brandLogoUrl} 
                        alt="Independent Director Logo" 
                        className="h-12 md:h-14 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                </div>

                <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                    <button onClick={onHomeClick} className={navButtonClasses}>Home</button>
                    <button onClick={onDirectoryClick} className={navButtonClasses}>Directory</button>
                    <button onClick={onJobsClick} className="font-semibold text-xs lg:text-sm text-white bg-teal-600 hover:bg-teal-500 transition-colors duration-300 px-3 lg:px-4 py-1.5 rounded-md shadow flex items-center gap-2 whitespace-nowrap">
                        💼 Jobs
                    </button>
                    <button onClick={onProgramClick} className="font-semibold text-xs lg:text-sm text-white bg-indigo-600 hover:bg-indigo-500 transition-colors duration-300 px-3 lg:px-4 py-1.5 rounded-md shadow flex items-center gap-2 whitespace-nowrap">
                        🎓 Board Certification Program
                    </button>
                    <button onClick={onAboutClick} className={navButtonClasses}>About</button>
                    <button onClick={onContactClick} className={navButtonClasses}>Contact</button>
                    
                    {!user ? (
                        <button onClick={onLoginClick} className="font-semibold text-xs lg:text-sm text-white bg-teal-500 hover:bg-teal-400 transition-colors duration-300 px-3 lg:px-4 py-1.5 rounded-md shadow whitespace-nowrap">
                             Login
                        </button>
                    ) : (
                        <div className="relative">
                            <button onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)} className="flex items-center gap-2 text-white bg-white/10 px-2 py-1 rounded-full border border-white/10 hover:bg-white/20 transition-all">
                                <img src={avatarUrl} alt="User" className="w-8 h-8 rounded-full border border-teal-500" />
                                <span className="text-xs font-medium hidden lg:block pr-1">{user.displayName?.split(' ')[0]}</span>
                            </button>
                            {isProfileMenuOpen && (
                                <div className="absolute right-0 mt-2 w-56 bg-[#0A192F] border border-teal-500/30 rounded-lg shadow-xl py-2 z-50 glass-card">
                                    <div className="px-4 py-2 border-b border-white/10 mb-2">
                                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Signed in as</p>
                                        <p className="text-sm text-white font-semibold truncate">{user.email}</p>
                                    </div>
                                    <button onClick={() => handleLinkClick(onRegisterClick)} className="block w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-white/10 transition-colors">My Profile</button>
                                    <button onClick={async () => { await logout(); onLogoutClick(); }} className="block w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">Logout</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="md:hidden flex items-center gap-2">
                    {user && (
                         <button onClick={onRegisterClick} className="w-8 h-8 rounded-full overflow-hidden border border-teal-500">
                             <img src={avatarUrl} alt="User" className="w-full h-full object-cover" />
                         </button>
                    )}
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-white hover:bg-white/10 rounded-lg transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                        </svg>
                    </button>
                </div>
            </nav>

            {isMenuOpen && (
                 <div className="md:hidden pb-6 px-4 glass-card border-t border-white/10 animate-in fade-in slide-in-from-top-4">
                    <div className="flex flex-col items-center space-y-3 pt-4">
                        <button onClick={() => handleLinkClick(onHomeClick)} className={mobileNavButtonClasses}>Home</button>
                        <button onClick={() => handleLinkClick(onDirectoryClick)} className={mobileNavButtonClasses}>Directory</button>
                        <button onClick={() => handleLinkClick(onJobsClick)} className="w-full text-center py-3 font-semibold text-white bg-teal-700 rounded-md shadow text-lg">Jobs Portal</button>
                        <button onClick={() => handleLinkClick(onProgramClick)} className="w-full text-center py-3 font-semibold text-white bg-indigo-700 rounded-md shadow text-lg">Board Certification Program</button>
                        <button onClick={() => handleLinkClick(onAboutClick)} className={mobileNavButtonClasses}>About Us</button>
                        <button onClick={() => handleLinkClick(onContactClick)} className={mobileNavButtonClasses}>Contact</button>
                        {!user ? (
                            <button onClick={() => handleLinkClick(onLoginClick)} className="w-full text-center py-3 font-semibold text-white bg-teal-500 rounded-md shadow text-lg">Login / Sign Up</button>
                        ) : (
                            <button onClick={async () => { await logout(); handleLinkClick(onLogoutClick); }} className="w-full text-center py-3 font-semibold text-red-300 bg-red-900/30 border border-red-500/50 rounded-md shadow text-lg">Logout</button>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;
