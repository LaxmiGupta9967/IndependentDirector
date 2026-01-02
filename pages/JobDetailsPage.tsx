
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Job } from '../types';
import { useAuth } from '../context/AuthContext';
import { submitJobApplication, createRazorpayOrder, verifyRazorpayPayment } from '../services/directorService';
import Spinner from '../components/Spinner';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Props {
    job: Job;
    onBack: () => void;
    onLoginRedirect: () => void;
}

const JobDetailsPage: React.FC<Props> = ({ job, onBack, onLoginRedirect }) => {
    const MotionDiv = motion.div as any;
    const { user } = useAuth();
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [paymentData, setPaymentData] = useState<any>(null);
    
    const [formData, setFormData] = useState({
        phone: '',
        industry: job.industry || '',
        experience: '',
        currentLocation: '',
        preferredLocation: '',
        currentCTC: '',
        expectedCTC: '',
        noticePeriod: '',
        resumeUrl: '',
        linkedinUrl: '',
        summary: '',
        message: ''
    });

    const formatDate = (dateStr: string) => {
        if (!dateStr) return 'N/A';
        try {
            const date = new Date(dateStr);
            // Including time as requested by user
            return date.toLocaleString('en-IN', { 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true
            });
        } catch (e) {
            return dateStr;
        }
    };

    const handlePayment = async () => {
        if (!user) {
            alert("Please login first to proceed with the application.");
            onLoginRedirect();
            return;
        }

        if (!window.Razorpay) {
            alert("Payment Gateway (Razorpay) is not loaded. Please refresh the page or check your internet connection.");
            return;
        }

        setIsSubmitting(true);
        try {
            const feeToCharge = 99;
            const orderResult = await createRazorpayOrder(feeToCharge); 
            
            if (orderResult.status !== 'success') {
                throw new Error(orderResult.message || "Could not initialize order. Please try again.");
            }

            const options = {
                key: orderResult.key,
                amount: orderResult.amount, 
                currency: orderResult.currency,
                name: "Aviyana Independent Director",
                description: `Application: ${job.title}`,
                order_id: orderResult.id,
                handler: async (response: any) => {
                    setIsSubmitting(true);
                    try {
                        const verification = await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verification.status === 'success') {
                            setPaymentData(response);
                            setIsPaid(true);
                            setIsPaymentModalOpen(false);
                        } else {
                            alert("Payment verification failed. Please contact support if the amount was debited.");
                        }
                    } catch (err) {
                        console.error("Payment Verification Error:", err);
                        alert("Verification error. If your payment was successful, please refresh in a few minutes.");
                    } finally {
                        setIsSubmitting(false);
                    }
                },
                prefill: {
                    name: user.displayName,
                    email: user.email,
                    contact: formData.phone || ""
                },
                theme: { color: "#14B8A6" },
                modal: {
                    ondismiss: () => {
                        setIsSubmitting(false);
                        console.log("Payment window closed by user.");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (response: any) => {
                console.error("Razorpay Error:", response.error);
                alert("Payment Failed: " + response.error.description);
                setIsSubmitting(false);
            });
            rzp.open();
        } catch (err: any) {
            console.error("Payment Gate Error:", err);
            alert(err.message || "An unexpected error occurred during the payment process.");
            setIsSubmitting(false);
        }
    };

    const handleApply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        
        setIsSubmitting(true);
        try {
            await submitJobApplication({
                jobId: job.id,
                jobTitle: job.title,
                companyName: job.company,
                posterEmail: job.posterEmail || '',
                applicantName: user.displayName,
                applicantEmail: user.email,
                phone: formData.phone,
                industry: formData.industry,
                experience: formData.experience,
                currentLocation: formData.currentLocation,
                preferredLocation: formData.preferredLocation,
                currentCTC: formData.currentCTC,
                expectedCTC: formData.expectedCTC,
                noticePeriod: formData.noticePeriod,
                resumeUrl: formData.resumeUrl,
                linkedinUrl: formData.linkedinUrl,
                summary: formData.summary,
                message: formData.message,
                amount: 99,
                paymentId: paymentData?.razorpay_payment_id || 'PRO_V18_FINAL'
            });
            setIsSuccess(true);
        } catch (err) {
            alert("Application submission failed. Please check your connection and try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="container mx-auto px-4 md:px-6 py-8 md:py-12 max-w-4xl">
            <button onClick={onBack} className="mb-6 md:mb-8 text-teal-400 hover:text-teal-300 flex items-center gap-2 group">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Job Portal
            </button>

            <div className="glass-card rounded-2xl p-6 md:p-8 border-t-4 border-blue-500 overflow-hidden relative shadow-2xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div className="w-full md:w-auto">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <span className="px-3 py-1 bg-blue-500/20 text-blue-400 text-[10px] md:text-xs font-bold rounded-full uppercase">
                                {job.roleType} Position
                            </span>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Posted {formatDate(job.createdAt)}
                            </span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white break-words leading-tight">{job.title}</h1>
                        <p className="text-teal-400 font-semibold text-sm md:text-base">{job.company} • {job.industry}</p>
                    </div>
                    <div className="md:text-right w-full md:w-auto pt-4 md:pt-0 border-t md:border-t-0 border-white/5">
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Application Fee</p>
                        <p className="text-3xl font-bold text-white">₹99</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 mb-10">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Location</p>
                        <p className="text-white font-medium text-sm md:text-base">{job.location}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Experience Required</p>
                        <p className="text-white font-medium text-sm md:text-base">{job.experienceRequired}</p>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 flex flex-col justify-center">
                        <p className="text-[10px] text-gray-400 uppercase font-bold mb-1 tracking-widest">Compensation</p>
                        <p className="text-white font-medium text-sm md:text-base">{job.remuneration || 'Competitive'}</p>
                    </div>
                </div>

                <div className="space-y-10 text-gray-300 text-sm md:text-base leading-relaxed">
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 text-sm font-bold border border-teal-500/20">01</span>
                            Role Overview
                        </h3>
                        <div className="whitespace-pre-wrap pl-1">{job.description}</div>
                    </div>
                    <div>
                        <h3 className="text-lg md:text-xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center text-teal-400 text-sm font-bold border border-teal-500/20">02</span>
                            Key Responsibilities
                        </h3>
                        <div className="whitespace-pre-wrap pl-1">{job.responsibilities}</div>
                    </div>
                </div>

                {!isPaid && !isSuccess && (
                    <div className="mt-12 p-6 md:p-8 bg-orange-500/10 border border-orange-500/30 rounded-2xl flex flex-col md:flex-row items-center gap-6 shadow-xl">
                        <div className="flex-1 text-center md:text-left">
                            <h4 className="text-xl font-bold text-orange-200 mb-2">Unlock Application</h4>
                            <p className="text-sm text-orange-100/80 leading-relaxed">
                                This role requires a verification fee of ₹99 to confirm your senior professional identity and maintain high board-level quality.
                            </p>
                        </div>
                        <button 
                            onClick={() => setIsPaymentModalOpen(true)}
                            className="w-full md:w-auto whitespace-nowrap px-10 py-4 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold shadow-lg shadow-orange-900/40 hover:scale-[1.03] active:scale-95 transition-all"
                        >
                            Pay ₹99 & Continue
                        </button>
                    </div>
                )}

                {isPaid && !isSuccess && (
                    <MotionDiv 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-12 bg-teal-500/5 border border-teal-500/20 p-6 md:p-10 rounded-2xl shadow-inner"
                    >
                        <h3 className="text-xl md:text-2xl font-bold text-teal-400 mb-8 flex items-center gap-3">
                            <div className="w-2 h-8 bg-teal-500 rounded-full"></div>
                            Application Profile Details
                        </h3>
                        <form onSubmit={handleApply} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Phone Number *</label>
                                    <input required type="tel" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" placeholder="+91 9876543210" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Primary Industry *</label>
                                    <input required value={formData.industry} onChange={(e)=>setFormData({...formData, industry: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Current Location *</label>
                                    <input required value={formData.currentLocation} onChange={(e)=>setFormData({...formData, currentLocation: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Preferred Location *</label>
                                    <input required value={formData.preferredLocation} onChange={(e)=>setFormData({...formData, preferredLocation: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Total Experience *</label>
                                    <input required value={formData.experience} onChange={(e)=>setFormData({...formData, experience: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" placeholder="e.g. 15 Years" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Current CTC (LPA) *</label>
                                    <input required value={formData.currentCTC} onChange={(e)=>setFormData({...formData, currentCTC: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Expected CTC (LPA) *</label>
                                    <input required value={formData.expectedCTC} onChange={(e)=>setFormData({...formData, expectedCTC: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Notice Period *</label>
                                    <input required value={formData.noticePeriod} onChange={(e)=>setFormData({...formData, noticePeriod: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" placeholder="e.g. 30 Days" />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Resume URL *</label>
                                    <input required type="url" value={formData.resumeUrl} onChange={(e)=>setFormData({...formData, resumeUrl: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" placeholder="Google Drive/Cloud Link" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">LinkedIn Profile URL *</label>
                                <input required type="url" value={formData.linkedinUrl} onChange={(e)=>setFormData({...formData, linkedinUrl: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" placeholder="linkedin.com/in/yourprofile" />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Board Expertise Summary *</label>
                                <textarea required rows={4} value={formData.summary} onChange={(e)=>setFormData({...formData, summary: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" placeholder="Summarize your board eligibility and core competencies..."></textarea>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-300 uppercase tracking-widest">Personal Message (Optional)</label>
                                <textarea rows={2} value={formData.message} onChange={(e)=>setFormData({...formData, message: e.target.value})} className="w-full glass-input px-4 py-3.5 rounded-xl text-white text-sm focus:ring-2 ring-teal-500/50" placeholder="Anything else you'd like the board to know?"></textarea>
                            </div>
                            
                            <button disabled={isSubmitting} className="w-full py-5 bg-teal-600 text-white rounded-2xl font-bold glow-button text-lg shadow-xl shadow-teal-900/40 hover:scale-[1.01] active:scale-95 transition-all">
                                {isSubmitting ? 'Submitting Application...' : 'Submit Final Application'}
                            </button>
                        </form>
                    </MotionDiv>
                )}

                {isSuccess && (
                    <div className="mt-12 text-center p-10 md:p-16 bg-teal-500/10 border border-teal-500/50 rounded-3xl shadow-2xl">
                        <div className="w-20 h-20 md:w-24 md:h-24 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 text-3xl md:text-4xl shadow-lg shadow-teal-500/50">✓</div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Application Successful!</h2>
                        <p className="text-base md:text-lg text-gray-300 mb-10 max-w-xl mx-auto">Your professional profile has been securely forwarded to the hiring organization's selection committee. You can track your status in your dashboard.</p>
                        <button onClick={onBack} className="px-10 py-4 bg-white/10 text-white border border-white/20 rounded-xl hover:bg-white/20 hover:border-white/40 transition-all font-bold">Return to Job Portal</button>
                    </div>
                )}
            </div>

            {isPaymentModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/95 backdrop-blur-xl">
                    <MotionDiv 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="glass-card w-full max-w-sm md:max-w-md rounded-[2.5rem] p-8 md:p-10 border border-white/10 relative shadow-2xl overflow-hidden"
                    >
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-teal-400"></div>
                        <button onClick={() => setIsPaymentModalOpen(false)} className="absolute top-6 right-6 text-gray-400 hover:text-white transition-colors p-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        <div className="text-center mb-10 pt-4">
                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-teal-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-xl">
                                <span className="text-4xl">💳</span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold text-white mt-4">Unlock Application</h2>
                            <p className="text-xs md:text-sm text-gray-400 mt-2 font-medium">Verify your board seniority to proceed.</p>
                        </div>

                        <div className="bg-white/5 rounded-[2rem] p-6 md:p-8 mb-10 border border-white/10 shadow-inner">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-sm md:text-base text-gray-300 font-medium">Verification Fee</span>
                                <span className="text-3xl font-bold text-white">₹99</span>
                            </div>
                            <div className="h-px bg-white/10 w-full my-4"></div>
                            <p className="text-[10px] md:text-[11px] text-gray-500 leading-relaxed font-bold uppercase tracking-widest text-center">One-time payment per application</p>
                        </div>

                        <button 
                            onClick={handlePayment} 
                            disabled={isSubmitting}
                            className="w-full py-5 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-2xl font-bold shadow-2xl shadow-teal-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Processing...
                                </>
                            ) : `Proceed to Secure Payment`}
                        </button>
                    </MotionDiv>
                </div>
            )}
        </div>
    );
};

export default JobDetailsPage;
