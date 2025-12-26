
// Added React import to provide the React namespace required for FC and ReactNode types
import React, { createContext, useContext, useEffect, useState } from 'react';
import { loginUser, signupUser } from '../services/directorService';

export interface User {
    id: string;
    email: string;
    displayName: string;
    photoURL?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithEmail: (email: string, password: string) => Promise<void>;
    signupWithEmail: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

// Added React.FC and React.ReactNode type annotations which require the React namespace
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('id_app_user');
        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (e) {
                localStorage.removeItem('id_app_user');
            }
        }
        setLoading(false);
    }, []);

    const loginWithEmail = async (email: string, password: string) => {
        try {
            const result = await loginUser(email, password);
            if (!result.user) throw new Error("Invalid response from server");

            const userData: User = {
                id: result.user.id,
                email: result.user.email,
                displayName: result.user.name,
                photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(result.user.name)}&background=random`
            };
            
            setUser(userData);
            localStorage.setItem('id_app_user', JSON.stringify(userData));
        } catch (error) {
            console.error("Login failed", error);
            throw error;
        }
    };

    const signupWithEmail = async (email: string, password: string, name: string) => {
        try {
            await signupUser(email, password, name);
            // v8 script doesn't return user on signup, so we login immediately after
            await loginWithEmail(email, password);
        } catch (error) {
            console.error("Signup failed", error);
            throw error;
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('id_app_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithEmail, signupWithEmail, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
