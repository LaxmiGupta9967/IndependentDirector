
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const LoginPage: React.FC = () => {
    const { loginWithEmail, signupWithEmail } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (isLogin) {
                await loginWithEmail(email, password);
            } else {
                if (!name) throw new Error("Name is required for sign up.");
                await signupWithEmail(email, password, name);
            }
        } catch (err: any) {
            console.error("Auth Error:", err);
            // Handle generic errors or strings returned by backend
            const msg = err.message || "Authentication failed";
            if (msg.includes("Invalid")) setError("Invalid email or password.");
            else if (msg.includes("exists")) setError("Email already registered.");
            else setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-grow flex items-center justify-center px-4 py-12">
            <div className="glass-card p-8 md:p-10 rounded-2xl max-w-md w-full outer-glow relative z-10">
                
                <div className="flex justify-center mb-8 border-b border-white/10 pb-4">
                    <button 
                        onClick={() => { setIsLogin(true); setError(''); }}
                        className={`px-6 py-2 text-sm font-semibold transition-colors ${isLogin ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        Login
                    </button>
                    <button 
                        onClick={() => { setIsLogin(false); setError(''); }}
                        className={`px-6 py-2 text-sm font-semibold transition-colors ${!isLogin ? 'text-teal-400 border-b-2 border-teal-400' : 'text-gray-400 hover:text-white'}`}
                    >
                        Sign Up
                    </button>
                </div>

                <h1 className="text-2xl font-bold text-white mb-2 text-center">
                    {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-center text-gray-400 text-sm mb-6">
                    {isLogin ? 'Access your dashboard' : 'Join the independent directory'}
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 text-sm p-3 rounded-lg mb-4 text-center break-words">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <div>
                            <input 
                                type="text" 
                                value={name} 
                                onChange={(e) => setName(e.target.value)} 
                                required={!isLogin}
                                className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-slate-500 focus:outline-none" 
                                placeholder="Full Name"
                            />
                        </div>
                    )}
                    <div>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required
                            className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-slate-500 focus:outline-none" 
                            placeholder="Email Address"
                        />
                    </div>
                    <div>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required
                            className="w-full px-4 py-3 rounded-lg glass-input text-white placeholder-slate-500 focus:outline-none" 
                            placeholder="Password"
                        />
                    </div>

                    <button 
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 mt-2 rounded-lg font-bold text-white glow-button hover:scale-[1.02] transition-transform disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
