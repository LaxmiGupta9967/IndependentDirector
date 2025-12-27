
import React, { useState } from 'react';

// Updated to match the current API_URL in directorService.ts
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxvHlqXfQ29fj_0Bq_wUioCirMQFkXpLGHYWIIrnHSKog00j1s0tQTCkNxHIkZJkj8PXA/exec';

const ContactSection: React.FC = () => {
    const mapEmbedUrl = "https://maps.google.com/maps?q=Aviyana%20House,%20609-Parth%20Solitaire%20Commercial%20Complex,%20Plot%20No-2,%20Sector-9E,%20Kalamboli,%20Roadpali,%20Navi%20Mumbai-410218&t=&z=15&ie=UTF8&iwloc=&output=embed";

    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                redirect: 'follow', 
                // Adding 'path' so backend routes it to handleContact in V18
                body: JSON.stringify({ ...formData, path: 'contact' }),
                headers: {
                    "Content-Type": "text/plain;charset=utf-8",
                },
            });
            
            const result = await response.json();

            if (result.status === 'success') {
                 setSubmitStatus('success');
                 setFormData({ fullName: '', email: '', subject: '', message: '' }); 
            } else {
                 throw new Error(result.message || 'Submission failed');
            }
        
        } catch (error) {
            console.error('Error submitting form:', error);
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section id="contact" className="py-16">
            <div className="container mx-auto max-w-screen-2xl px-4">
                <div className="glass-card rounded-2xl p-8 md:p-12 outer-glow">
                    <h2 className="text-4xl font-bold text-center mb-8 text-white">Get in Touch</h2>
                    <p className="text-center text-white max-w-3xl mx-auto mb-12">
                        We’d love to hear from you — whether you’re a director looking to get listed, a company seeking board members, or a partner exploring opportunities with Independent Director.
                    </p>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        {/* Contact Form */}
                         <div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="fullName" className="block mb-2 text-sm font-medium text-white">Full Name</label>
                                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-slate-400" placeholder="John Doe" />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email Address</label>
                                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-slate-400" placeholder="john.doe@example.com" />
                                </div>
                                 <div>
                                    <label htmlFor="subject" className="block mb-2 text-sm font-medium text-white">Subject</label>
                                    <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-slate-400" placeholder="Regarding director listing" />
                                </div>
                                <div>
                                    <label htmlFor="message" className="block mb-2 text-sm font-medium text-white">Message</label>
                                    <textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-slate-400" placeholder="How can we help you?"></textarea>
                                </div>
                                <button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full px-6 py-3 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 glow-button disabled:opacity-60"
                                >
                                    {isSubmitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                            {submitStatus === 'success' && (
                                <div className="mt-4 p-4 text-center text-green-200 bg-green-900 rounded-lg">
                                    Thank you! Your message has been sent successfully.
                                </div>
                            )}
                            {submitStatus === 'error' && (
                                <div className="mt-4 p-4 text-center text-red-200 bg-red-900 rounded-lg">
                                    Something went wrong. Please try again or email us directly.
                                </div>
                            )}
                        </div>
                        
                        {/* Contact Details */}
                        <div className="space-y-6 text-white">
                            <div>
                                <h3 className="text-xl font-semibold text-teal-400 flex items-center gap-3">
                                    <span className="text-2xl">📍</span> HEAD OFFICE-WEST
                                </h3>
                                <p className="mt-2 ml-9 text-sm">Aviyana House, 609-Parth Solitaire Commercial Complex, Plot No-2, Sector-9E, Kalamboli, Roadpali, Navi Mumbai-410218</p>
                            </div>
                            <div>
                               <h3 className="text-xl font-semibold text-teal-400 flex items-center gap-3">
                                    <span className="text-2xl">📍</span> REGIONAL OFFICE-NORTH
                                </h3>
                                <p className="mt-2 ml-9 text-sm">Aviyana House, 301-A, Mansingh Palace, Ambedkar Road, Ghaziabad-NCR-201001</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-teal-400 flex items-center gap-3">
                                    <span className="text-2xl">📞</span> Call Us
                                </h3>
                                <p className="mt-2 ml-9">+91 87791 01817</p>
                                <p className="mt-1 ml-9">+91 87791 02007</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-teal-400 flex items-center gap-3">
                                    <span className="text-2xl">📧</span> Email Us
                                </h3>
                                <a href="mailto:connect@aviyanaventures.com" className="mt-2 ml-9 text-blue-400 hover:underline">connect@aviyanaventures.com</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="mt-16 w-full h-[300px] md:h-[400px] px-4">
                <iframe
                    src={mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen={true}
                    loading="lazy"
                    title="Aviyana Head Office Location"
                    className="rounded-lg shadow-2xl"
                ></iframe>
            </div>
        </section>
    );
};

export default ContactSection;
