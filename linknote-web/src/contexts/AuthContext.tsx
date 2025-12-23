import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, getCurrentUser, logout as apiLogout, loginWithGoogle } from '../services/authService';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    login: () => void;
    logout: () => Promise<void>;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuth = async () => {
        try {
            const userData = await getCurrentUser();
            setUser(userData);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = () => {
        loginWithGoogle();
    };

    const logout = async () => {
        try {
            await apiLogout();
            setUser(null);
            // Optional: Redirect to login page managed by router or component
        } catch (error) {
            console.error('Logout failed', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, isLoading, login, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
