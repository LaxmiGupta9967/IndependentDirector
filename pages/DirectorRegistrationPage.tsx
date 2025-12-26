
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { registerDirector, deleteDirector } from '../services/directorService';
import { motion, AnimatePresence } from 'framer-motion';
import { Director } from '../types';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
    initialData?: Director | null;
}

const DirectorRegistrationPage: React.FC<Props> = ({ onCancel, onSuccess, initialData }) => {
    // Fix: Cast motion.div to any to bypass type errors for motion props
    const MotionDiv = motion.div as any;
    const { user } = useAuth();
    
    // Default avatar
    const defaultPhoto = user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=0D8ABC&color=fff`;

    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        industry: '',
        description: '',
        age: '',
        dinNumber: '',
        yearsOfExperience: '',
        isCurrentDirector: 'No',
        sectorsServed: '',
        currentSectors: '',
        isIODCertified: 'No',
        iodCertificateUrl: '',
        internationalBoards: '',
        committeeCount: '0',
        subCommitteeCount: '0',
        litigationDetails: '',
        logoUrl: defaultPhoto
    });
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [statusMessage, setStatusMessage] = useState<{ type: 'error' | 'success' | 'info', text: string } | null>(null);

    // Populate form if editing
    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || user?.displayName || '',
                industry: initialData.industry || '',
                description: initialData.description || '',
                age: initialData.age ? String(initialData.age) : '',
                dinNumber: initialData.dinNumber || '',
                yearsOfExperience: initialData.yearsOfExperience ? String(initialData.yearsOfExperience) : '',
                isCurrentDirector: initialData.isCurrentDirector ? 'Yes' : 'No',
                sectorsServed: initialData.sectorsServed ? initialData.sectorsServed.join(', ') : '',
                currentSectors: initialData.currentSectors ? initialData.currentSectors.join(', ') : '',
                isIODCertified: initialData.isIODCertified ? 'Yes' : 'No',
                iodCertificateUrl: initialData.iodCertificateUrl || '',
                internationalBoards: initialData.internationalBoards ? initialData.internationalBoards.join(', ') : '',
                committeeCount: initialData.committeeCount ? String(initialData.committeeCount) : '0',
                subCommitteeCount: initialData.subCommitteeCount ? String(initialData.subCommitteeCount) : '0',
                litigationDetails: initialData.litigationDetails || '',
                logoUrl: initialData.logoUrl || defaultPhoto
            });
        }
    }, [initialData, user, defaultPhoto]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // --- Validation Check ---
        if (!formData.name || !formData.age || !formData.industry || !formData.yearsOfExperience || !formData.description) {
             setStatusMessage({ 
                 type: 'error', 
                 text: 'Please fill all required fields before submitting.' 
             });
             return;
        }

        setIsSubmitting(true);
        setStatusMessage({ type: 'info', text: 'Processing your request… Updating profile.' });

        try {
            // Include email in the payload - keys are mapped inside registerDirector to match sheet headers
            const result = await registerDirector({
                ...formData,
                id: initialData?.id, // Preserve ID if updating
                email: user?.email || '', 
            });

            // --- Success / Duplicate Logic based on Backend Response ---
            if (result.action === 'update') {
                setStatusMessage({ 
                    type: 'success', 
                    text: 'Profile updated successfully! Your changes are saved.' 
                });
            } else {
                setStatusMessage({ 
                    type: 'success', 
                    text: 'Profile created successfully! 🎉 Your information has been saved to the directory.' 
                });
            }

            // Delay calling onSuccess to let user read the message
            setTimeout(() => {
                onSuccess();
            }, 2000);

        } catch (err: any) {
            console.error(err);
            setStatusMessage({ type: 'error', text: 'Operation failed. Please try again later.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!user?.email) {
            alert("Error: User email is missing. Please log out and log in again.");
            return;
        }
        
        const confirmed = window.confirm("Are you sure you want to delete your director profile? This action cannot be undone.");
        if (!confirmed) return;

        setIsSubmitting(true);
        setStatusMessage({ type: 'info', text: 'Deleting profile...' });

        try {
            await deleteDirector(user.email);
            setStatusMessage({ type: 'success', text: 'Profile deleted successfully.' });
            
            setTimeout(() => {
                onSuccess(); 
            }, 2000);
        } catch (err) {
            console.error(err);
            setStatusMessage({ type: 'error', text: 'Failed to delete profile. Please try again.' });
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-12 max-w-3xl">
            <button onClick={onCancel} className="mb-6 text-teal-400 hover:text-teal-300 flex items-center gap-2">
                <span>←</span> Back to Profile
            </button>
            
            <div className="glass-card p-8 rounded-2xl border-t border-teal-500/50 shadow-2xl relative overflow-hidden">
                <div className="flex items-center gap-4 mb-6 relative z-10">
                    <img 
                        src={formData.logoUrl} 
                        onError={(e) => { e.currentTarget.src = `https://ui-avatars.com/api/?name=${formData.name}`; }}
                        alt="User" 
                        className="w-16 h-16 rounded-full border-2 border-teal-400 object-cover" 
                    />
                    <div>
                        <h1 className="text-3xl font-bold text-white">{initialData ? 'Update Profile' : 'Director Registration'}</h1>
                        <p className="text-gray-300">{initialData ? 'Edit your professional details.' : 'Join our verified network of independent directors.'}</p>
                    </div>
                </div>

                {/* Status Banners */}
                <AnimatePresence>
                    {statusMessage && (
                        <MotionDiv 
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className={`p-4 rounded-lg mb-6 border relative z-10 font-medium ${
                                statusMessage.type === 'error' ? 'bg-red-900/80 text-red-100 border-red-700' :
                                statusMessage.type === 'success' ? 'bg-green-900/80 text-green-100 border-green-700' :
                                'bg-blue-900/80 text-blue-100 border-blue-700'
                            }`}
                        >
                            {statusMessage.text}
                        </MotionDiv>
                    )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Full Name *</label>
                            <input name="name" value={formData.name} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Email</label>
                            <input value={user?.email || ''} disabled className="w-full glass-input px-4 py-3 rounded-lg text-gray-400 cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Age *</label>
                            <input type="number" name="age" value={formData.age} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                         <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Profile Photo URL</label>
                            <input type="url" name="logoUrl" value={formData.logoUrl} onChange={handleChange} placeholder="https://..." className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                    </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Primary Industry *</label>
                            <input name="industry" value={formData.industry} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                         <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">DIN Number</label>
                            <input name="dinNumber" value={formData.dinNumber} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                         <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Experience (Years) *</label>
                            <input type="number" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Currently Serving as ID?</label>
                            <select name="isCurrentDirector" value={formData.isCurrentDirector} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-lg text-white bg-slate-900">
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-teal-300 text-sm font-semibold mb-2">Professional Bio *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="Briefly describe your board experience..." />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Sectors Served</label>
                            <input name="sectorsServed" value={formData.sectorsServed} onChange={handleChange} placeholder="IT, Retail" className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Current Sectors</label>
                            <input name="currentSectors" value={formData.currentSectors} onChange={handleChange} placeholder="Finance" className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">IOD Certified?</label>
                             <select name="isIODCertified" value={formData.isIODCertified} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-lg text-white bg-slate-900">
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        {formData.isIODCertified === 'Yes' && (
                            <div>
                                <label className="block text-teal-300 text-sm font-semibold mb-2">Copy of IOD Certificate (URL)</label>
                                <input type="url" name="iodCertificateUrl" value={formData.iodCertificateUrl} onChange={handleChange} placeholder="https://..." className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                            </div>
                        )}
                         <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Committees Count</label>
                            <input type="number" name="committeeCount" value={formData.committeeCount} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                         <div>
                            <label className="block text-teal-300 text-sm font-semibold mb-2">Sub-Committees Count</label>
                            <input type="number" name="subCommitteeCount" value={formData.subCommitteeCount} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-teal-300 text-sm font-semibold mb-2">Any International Companies You Are On Board</label>
                        <input name="internationalBoards" value={formData.internationalBoards} onChange={handleChange} placeholder="Company A, Company B" className="w-full glass-input px-4 py-3 rounded-lg text-white" />
                    </div>

                    <div>
                        <label className="block text-teal-300 text-sm font-semibold mb-2">Any Litigation or Board Governance Enquiries</label>
                        <textarea name="litigationDetails" value={formData.litigationDetails} onChange={handleChange} rows={2} className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="Details of any enquiries (optional)" />
                    </div>

                    <div className="flex flex-col gap-4 mt-8">
                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className="w-full py-4 rounded-lg font-bold text-white glow-button disabled:opacity-50 hover:scale-[1.02] transition-transform"
                        >
                            {isSubmitting ? 'Processing...' : (initialData ? 'Update Profile' : 'Register as Director')}
                        </button>
                        
                        {initialData && (
                            <button 
                                type="button"
                                onClick={handleDelete}
                                disabled={isSubmitting}
                                className="w-full py-3 rounded-lg font-bold text-red-200 bg-red-900/30 border border-red-500/30 hover:bg-red-900/50 hover:text-red-100 transition-colors disabled:opacity-50"
                            >
                                Delete Profile
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DirectorRegistrationPage;
