
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { postJob } from '../services/directorService';
import Spinner from '../components/Spinner';

interface Props {
    onCancel: () => void;
    onSuccess: () => void;
}

const PostJobPage: React.FC<Props> = ({ onCancel, onSuccess }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        company: '',
        industry: '',
        type: 'Independent',
        experience: '',
        location: '',
        description: '',
        responsibilities: '',
        expectations: '',
        remuneration: '',
        fee: '99' // Updated price to 99 rupees
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return setError('Please login to post a job.');
        
        setLoading(true);
        setError('');

        try {
            const result = await postJob({
                ...formData,
                posterEmail: user.email
            });

            if (result.status === 'success') {
                alert('Job posted successfully!');
                onSuccess();
            } else {
                setError(result.message || 'Failed to post job.');
            }
        } catch (err: any) {
            setError(err.message || 'An error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-6 py-12 max-w-4xl">
            <button onClick={onCancel} className="mb-8 text-teal-400 hover:text-teal-300 flex items-center gap-2">
                <span>←</span> Back to Jobs
            </button>

            <div className="glass-card rounded-2xl p-8 border-t-4 border-teal-500 shadow-2xl">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Post a Board Position</h1>
                    <p className="text-gray-400 mt-2">Hire verified independent directors for your organization. Postings are free.</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-teal-300 text-sm font-bold mb-2">Job Title *</label>
                            <input name="title" value={formData.title} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="e.g. Independent Director" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-bold mb-2">Company Name *</label>
                            <input name="company" value={formData.company} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="e.g. Aviyana Ventures" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-bold mb-2">Industry *</label>
                            <input name="industry" value={formData.industry} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="e.g. Fintech, Healthcare" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-bold mb-2">Role Type *</label>
                            <select name="type" value={formData.type} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-lg text-white bg-[#0A192F]">
                                <option value="Independent">Independent</option>
                                <option value="Advisory">Advisory</option>
                                <option value="Nominee">Nominee</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-bold mb-2">Experience Required *</label>
                            <input name="experience" value={formData.experience} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="e.g. 15+ Years" />
                        </div>
                        <div>
                            <label className="block text-teal-300 text-sm font-bold mb-2">Location *</label>
                            <input name="location" value={formData.location} onChange={handleChange} required className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="e.g. Mumbai / Hybrid" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-teal-300 text-sm font-bold mb-2">Remuneration</label>
                            <input name="remuneration" value={formData.remuneration} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="e.g. Professional Fees as per norms" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-teal-300 text-sm font-bold mb-2">Role Overview *</label>
                        <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="Describe the board role..." />
                    </div>

                    <div>
                        <label className="block text-teal-300 text-sm font-bold mb-2">Key Responsibilities *</label>
                        <textarea name="responsibilities" value={formData.responsibilities} onChange={handleChange} required rows={4} className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="List the primary duties..." />
                    </div>

                    <div>
                        <label className="block text-teal-300 text-sm font-bold mb-2">Compliance & Governance Expectations *</label>
                        <textarea name="expectations" value={formData.expectations} onChange={handleChange} required rows={4} className="w-full glass-input px-4 py-3 rounded-lg text-white" placeholder="What governance values are expected?" />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-teal-600 to-blue-600 text-white rounded-xl font-bold glow-button text-lg disabled:opacity-50"
                        >
                            {loading ? <div className="flex items-center justify-center gap-2"><Spinner /> Processing...</div> : 'Publish Board Position'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostJobPage;
