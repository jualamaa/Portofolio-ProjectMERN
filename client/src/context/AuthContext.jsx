import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    const checkSession = useCallback(async () => {
        try {
            const { data } = await api.get('/auth/me');
            setAdmin(data.data);
        } catch {
            setAdmin(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        checkSession();
    }, [checkSession]);

    const login = async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        setAdmin(data.data);
        return data.data;
    };

    const logout = async () => {
        await api.post('/auth/logout');
        setAdmin(null);
    };

    return (
        <AuthContext.Provider value={{ admin, loading, login, logout, checkSession }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}