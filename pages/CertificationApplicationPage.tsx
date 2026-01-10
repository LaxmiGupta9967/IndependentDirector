
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { submitCertificationApplication, createRazorpayOrder, verifyRazorpayPayment } from '../services/directorService';
import Spinner from '../components/Spinner';

declare global {
    interface Window {
        Razorpay: any;
    }
}

interface Props {
    onBack: () => void;
    onSuccess: () => void;
    onLoginRedirect: () => void;
}

const CertificationApplicationPage: React.FC<Props> = ({ onBack, onSuccess, onLoginRedirect }) => {
    const MotionDiv = motion.div as any;
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(false);

    const [formData, setFormData] = useState({
        fullName: user?.displayName || '',
        email: user?.email || '',
        mobile: '',
        cityCountry: '',
        yearsOfExperience: '',
        designation: '',
        industryExpertise: '',
        functionalExpertise: '',
        priorBoardExperience: 'No',
        interestedRole: 'Independent Director',
        areasOfInterest: '',
        din: '',
        pan: '',
        mcaRegistered: 'No',
        willingToTest: 'Yes',
        cvUrl: '',
        interestStatement: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!user) {
            onLoginRedirect();
            return;
        }

        if (!window.Razorpay) {
            alert("Razorpay SDK not loaded. Please check your internet connection and refresh.");
            return;
        }

        setLoading(true);

        try {
            // 1. Create Razorpay Order (Backend returns amount in paise and the key)
            const fee = 99;
            const orderResult = await createRazorpayOrder(fee);
            
            if (orderResult.status !== 'success') {
                throw new Error(orderResult.message || "Failed to create payment order.");
            }

            // 2. Configure Razorpay Options
            const options = {
                key: orderResult.key,
                amount: orderResult.amount, // In paise
                currency: orderResult.currency,
                name: "Aviyana Independent Director",
                description: "Boardroom Certification Verification Fee",
                image: "https://i.postimg.cc/T1RnvJWX/Untitled-design-1-removebg-preview.png",
                order_id: orderResult.id,
                handler: async (response: any) => {
                    setLoading(true);
                    try {
                        // 3. Verify Payment Signature on Backend
                        const verification = await verifyRazorpayPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        });

                        if (verification.status === 'success') {
                            // 4. Submit actual application data only after successful payment
                            await submitCertificationApplication({
                                ...formData,
                                paymentId: response.razorpay_payment_id
                            } as any);
                            
                            setSuccessMessage(true);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        } else {
                            alert("Payment verification failed. If your money was deducted, please contact support.");
                        }
                    } catch (err) {
                        console.error("Verification error:", err);
                        alert("There was an error verifying your payment.");
                    } finally {
                        setLoading(false);
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.mobile
                },
                theme: { color: "#14B8A6" },
                modal: {
                    ondismiss: () => setLoading(false)
                }
            };

            // 3. Open Razorpay Checkout
            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', (resp: any) => {
                alert("Payment Failed: " + resp.error.description);
                setLoading(false);
            });
            rzp.open();
        } catch (error: any) {
            alert(error.message || "Could not initiate payment.");
            setLoading(false);
        }
    };

    if (successMessage) {
        return (
            <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center min-h-[60vh]">
                <MotionDiv 
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-24 h-24 bg-teal-500 rounded-full flex items-center justify-center text-5xl mb-8 shadow-2xl shadow-teal-500/50"
                >
                    ✓
                </MotionDiv>
                <h1 className="text-4xl font-bold text-white mb-4 text-center">Application & Payment Successful</h1>
                <p className="text-xl text-gray-300 text-center max-w-2xl leading-relaxed">
                    Thank you, {formData.fullName}. Your certification fee has been processed. Our governance committee will review your application and provide an update within 3-5 working days. An auto-reply has been sent to your email.
                </p>
                <button 
                    onClick={onSuccess} 
                    className="mt-10 px-10 py-4 bg-white/10 text-white rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/10"
                >
                    Back to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-12 max-w-4xl">
            <button onClick={onBack} className="mb-8 text-teal-400 hover:text-teal-300 flex items-center gap-2 group transition-all">
                <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Program Details
            </button>

            <MotionDiv 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden relative"
            >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500 to-indigo-600"></div>
                
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">🎙️ Boardroom Certification</h1>
                    <p className="text-gray-400 text-lg">Complete your profile - for boardroom certification program</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-12">
                    {/* Section 1: Personal */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-teal-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-sm border border-teal-500/20">01</span>
                            Personal & Contact Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Full Name (As per PAN) *</label>
                                <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-teal-500/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email ID *</label>
                                <input required type="email" name="email" value={formData.email} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-teal-500/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Mobile Number *</label>
                                <input required name="mobile" value={formData.mobile} onChange={handleChange} placeholder="+91" className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-teal-500/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">City / Country *</label>
                                <input required name="cityCountry" value={formData.cityCountry} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-teal-500/50" />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Professional */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm border border-indigo-500/20">02</span>
                            Professional Background
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Total Years of Experience *</label>
                                <input required name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} placeholder="e.g. 20 Years" className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-indigo-500/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Current / Last Designation *</label>
                                <input required name="designation" value={formData.designation} onChange={handleChange} placeholder="e.g. CEO / VP Finance" className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-indigo-500/50" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Industry / Sector Expertise *</label>
                                <input required name="industryExpertise" value={formData.industryExpertise} onChange={handleChange} placeholder="e.g. Banking, Manufacturing, IT" className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-indigo-500/50" />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Key Functional Expertise *</label>
                                <input required name="functionalExpertise" value={formData.functionalExpertise} onChange={handleChange} placeholder="Finance / Legal / HR / Strategy / ESG / Risk" className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-indigo-500/50" />
                            </div>
                        </div>
                    </section>

                    {/* Section 3: Governance */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-teal-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-sm border border-teal-500/20">03</span>
                            Board & Governance Readiness
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Prior Board Experience? *</label>
                                <select name="priorBoardExperience" value={formData.priorBoardExperience} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white bg-[#0A192F]">
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Interested Role *</label>
                                <select name="interestedRole" value={formData.interestedRole} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white bg-[#0A192F]">
                                    <option value="Independent Director">Independent Director</option>
                                    <option value="Advisor">Advisor</option>
                                    <option value="Mentor">Mentor</option>
                                    <option value="Committee Member">Committee Member</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Areas of Interest *</label>
                                <input required name="areasOfInterest" value={formData.areasOfInterest} onChange={handleChange} placeholder="Audit / CSR / ESG / Risk / HR / Compliance / Strategy" className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-teal-500/50" />
                            </div>
                        </div>
                    </section>

                    {/* Section 4: Statutory */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-indigo-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-sm border border-indigo-500/20">04</span>
                            Statutory & Compliance Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">DIN (If available)</label>
                                <input name="din" value={formData.din} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-indigo-500/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">PAN Number *</label>
                                <input required name="pan" value={formData.pan} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-indigo-500/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Registered on MCA ID Databank? *</label>
                                <select name="mcaRegistered" value={formData.mcaRegistered} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white bg-[#0A192F]">
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Willing to undergo Proficiency Test? *</label>
                                <select name="willingToTest" value={formData.willingToTest} onChange={handleChange} className="w-full glass-input px-4 py-3 rounded-xl text-white bg-[#0A192F]">
                                    <option value="Yes">Yes</option>
                                    <option value="No">No</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Section 5: Documents */}
                    <section className="space-y-6">
                        <h3 className="text-xl font-bold text-teal-400 flex items-center gap-3">
                            <span className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-sm border border-teal-500/20">05</span>
                            Upload Documents
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Updated CV / Profile URL *</label>
                                <input required type="url" name="cvUrl" value={formData.cvUrl} onChange={handleChange} placeholder="https://drive.google.com/..." className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-teal-500/50" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Brief Statement of Board Interest (Optional)</label>
                                <textarea name="interestStatement" value={formData.interestStatement} onChange={handleChange} rows={4} className="w-full glass-input px-4 py-3 rounded-xl text-white focus:ring-2 ring-teal-500/50" placeholder="Tell us why you want to serve on a board..." />
                            </div>
                        </div>
                    </section>

                    <div className="pt-8">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full py-5 bg-gradient-to-r from-teal-600 to-indigo-600 text-white rounded-2xl font-bold text-xl glow-button hover:scale-[1.01] transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center gap-3">
                                    <Spinner /> Processing Payment...
                                </div>
                            ) : (
                                'Pay ₹99 & Submit Certification Application'
                            )}
                        </button>
                    </div>
                </form>
            </MotionDiv>
        </div>
    );
};

export default CertificationApplicationPage;
