
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Director, JobApplication } from '../types';
import { getDirectorByEmail, getMyApplications } from '../services/directorService';
import DirectorCard from '../components/DirectorCard';
import Spinner from '../components/Spinner';

interface ProfilePageProps {
    onEdit: (director: Director) => void;
    onHome: () => void;
    onViewDetails: (director: Director) => void;
    onDeleteSuccess: () => void;
}

const ProfilePage: React.FC<ProfilePageProps> = ({ onEdit, onHome, onViewDetails, onDeleteSuccess }) => {
    const { user, logout } = useAuth();
    const [directorProfile, setDirectorProfile] = useState<Director | null>(null);
    const [applications, setApplications] = useState<JobApplication[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.email) return;
            try {
                const [profile, apps] = await Promise.all([
                    getDirectorByEmail(user.email),
                    getMyApplications(user.email)
                ]);
                setDirectorProfile(profile || null);
                setApplications(apps);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfileData();
    }, [user?.email, onDeleteSuccess]);

    if (loading) return <div className="min-h-screen flex items-center justify-center"><Spinner /></div>;

    const avatarUrl = user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random`;

    return (
        <div className="container mx-auto px-6 py-12 max-w-5xl">
             <div className="glass-card rounded-2xl p-8 mb-10 flex flex-col md:flex-row items-center gap-6 border-l-4 border-teal-500">
                <img src={avatarUrl} alt="User" className="w-24 h-24 rounded-full border-2 border-teal-400" />
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-white">{user?.displayName}</h1>
                    <p className="text-gray-400">{user?.email}</p>
                </div>
                <button onClick={() => { logout(); onHome(); }} className="px-4 py-2 border border-red-500/50 text-red-300 rounded-lg hover:bg-red-500/10 transition-colors">Logout</button>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Director Profile Column */}
                <div className="lg:col-span-1">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-teal-500 rounded-full"></span>
                        Directory Profile
                    </h2>
                    {directorProfile ? (
                         <div className="flex flex-col gap-4">
                            <DirectorCard director={directorProfile} onSelect={() => onViewDetails(directorProfile)} />
                            <button onClick={() => onEdit(directorProfile)} className="w-full py-3 bg-teal-600 hover:bg-teal-500 text-white font-bold rounded-lg transition-all">Update Profile</button>
                         </div>
                    ) : (
                        <div className="text-center py-10 glass-card rounded-xl">
                            <p className="text-gray-300 mb-6">Not registered yet.</p>
                            <button onClick={() => onEdit({} as Director)} className="px-6 py-2 bg-teal-600 text-white rounded-lg">Register Now</button>
                        </div>
                    )}
                </div>

                {/* Applications Tracking Column */}
                <div className="lg:col-span-2">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                        <span className="w-2 h-6 bg-blue-500 rounded-full"></span>
                        My Applications
                    </h2>
                    {applications.length > 0 ? (
                        <div className="space-y-4">
                            {applications.map(app => (
                                <div key={app.id} className="glass-card p-6 rounded-2xl flex justify-between items-center border border-white/5">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{app.jobTitle}</h3>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                                            Applied on {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'N/A'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
                                            app.status === 'Shortlisted' ? 'bg-green-500/20 text-green-400' :
                                            app.status === 'Closed' ? 'bg-red-500/20 text-red-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }`}>
                                            {app.status || 'Under Review'}
                                        </span>
                                        <p className="text-[10px] text-teal-400 mt-2 font-bold uppercase tracking-widest truncate max-w-[120px]">
                                            ID: {app.paymentId}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-center glass-card rounded-2xl border border-dashed border-white/10">
                            <p className="text-gray-400">You haven't applied for any positions yet.</p>
                        </div>
                    )}
                </div>
             </div>
        </div>
    );
};

export default ProfilePage;
