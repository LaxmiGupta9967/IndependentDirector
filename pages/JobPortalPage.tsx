
import React, { useState, useEffect } from 'react';
import { getJobs } from '../services/directorService';
import { Job } from '../types';
import Spinner from '../components/Spinner';

interface Props {
    onSelectJob: (job: Job) => void;
    onPostJob: () => void;
}

const JobPortalPage: React.FC<Props> = ({ onSelectJob, onPostJob }) => {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const data = await getJobs();
                setJobs(data);
            } catch (error) {
                console.error("Failed to load jobs", error);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    if (loading) return (
        <div className="py-20 flex-grow flex items-center justify-center">
            <Spinner />
        </div>
    );

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            // Including time as requested by user
            return date.toLocaleString('en-IN', { 
                day: 'numeric', 
                month: 'short', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateStr;
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-screen-2xl">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
                <div className="text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4 leading-tight">Board & Independent Director Opportunities</h1>
                    <p className="text-gray-300 max-w-3xl text-lg">
                        Explore verified board-level roles. Postings are free for organizations, while applications require a nominal verification fee of ₹99 to ensure serious interest.
                    </p>
                </div>
                <button 
                    onClick={onPostJob}
                    className="whitespace-nowrap px-8 py-4 bg-gradient-to-r from-blue-600 to-teal-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 group"
                >
                    <span className="text-xl group-hover:rotate-90 transition-transform duration-300">+</span>
                    Post a Board Position
                </button>
            </div>

            {jobs.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.map(job => (
                        <div 
                            key={job.id} 
                            className="glass-card rounded-2xl p-7 flex flex-col hover:transform hover:-translate-y-2 transition-all duration-300 border border-white/10 relative overflow-hidden group shadow-2xl"
                        >
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-500 to-blue-500 opacity-90"></div>
                            
                            <div className="flex justify-between items-start mb-4">
                                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-md">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-teal-500/70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {formatDate(job.createdAt)}
                                </div>
                                <span className="text-[10px] text-[#C4733A] font-bold flex items-center gap-1.5 uppercase tracking-widest bg-[#C4733A]/10 px-3 py-1.5 rounded-lg border border-[#C4733A]/30">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    ₹99 FEE
                                </span>
                            </div>

                            <div className="mb-6 space-y-5">
                                <div className="flex items-start gap-3">
                                    <span className="mt-2.5 w-1.5 h-1.5 rounded-full bg-gray-500 flex-shrink-0 group-hover:bg-teal-400 transition-colors"></span>
                                    <h3 className="text-2xl font-bold text-white leading-tight min-h-[3.5rem]">
                                        {job.title || 'Untitled Role'}
                                    </h3>
                                </div>
                                
                                <div className="space-y-3 pl-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-red-500 text-lg drop-shadow-sm">📍</span>
                                        <p className="text-gray-300 text-sm font-medium">
                                            {job.location || 'Location Not Specified'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-gray-500 text-lg">🎓</span>
                                        <p className="text-gray-400 text-sm font-medium italic">
                                            {job.experienceRequired || 'N/A'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-auto pt-6 border-t border-white/5 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.6)]"></span>
                                    <p className="text-teal-400 text-base font-bold truncate">
                                        {job.company || 'Confidential'}
                                    </p>
                                </div>
                                <p className="text-gray-500 text-[11px] font-bold uppercase tracking-[0.2em] pl-4">
                                    {job.industry || 'N/A'}
                                </p>
                            </div>

                            <button 
                                onClick={() => onSelectJob(job)}
                                className="mt-8 w-full py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-teal-500/20 transition-all text-sm group-hover:scale-[1.02] active:scale-95"
                            >
                                View Details
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-24 glass-card rounded-3xl border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    </div>
                    <p className="text-gray-400 font-medium">No active job opportunities at the moment.</p>
                </div>
            )}
        </div>
    );
};

export default JobPortalPage;
