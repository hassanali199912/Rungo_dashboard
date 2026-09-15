/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import axios from 'axios';
import client, { bootstrapCsrf, getSessionVersion, invalidateSession, onApiEvent, replaceSessionActor } from '@/config/apis';

export interface Actor { id: number | string; name: string; email: string; role: string | null }
type Status = 'loading' | 'authenticated' | 'unauthenticated';
interface AuthContextValue {
    user: Actor | null;
    status: Status;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    login: (credentials: { email: string; password: string }) => Promise<Actor>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    updateUser: (patch: Partial<Actor>) => void;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<Actor | null>(null);
    const [status, setStatus] = useState<Status>('loading');
    const [error, setError] = useState<string | null>(null);
    const generation = useRef(0);
    const clear = useCallback(() => {
        generation.current++;
        setUser(null);
        setError(null);
        setStatus('unauthenticated');
    }, []);
    const refresh = useCallback(async () => {
        const version = ++generation.current;
        setStatus('loading');
        setError(null);
        try {
            const response = await client.get<{ data: Actor }>('/api/app/v1/auth/me', { skipSessionHandling: true });
            if (version !== generation.current) return;
            replaceSessionActor(response.data.data.id);
            setUser(response.data.data);
            setStatus('authenticated');
        } catch (cause) {
            if (version !== generation.current || axios.isCancel(cause)) return;
            invalidateSession();
            if (!axios.isAxiosError(cause) || cause.response?.status !== 401) {
                setError('Unable to check your session. Please try again.');
            }
        }
    }, []);
    const cancelPending = useCallback(() => { generation.current++; }, []);
    useEffect(() => {
        const unsubscribe = onApiEvent('unauthenticated', clear);
        void refresh();
        return () => { unsubscribe(); cancelPending(); };
    }, [clear, refresh, cancelPending]);
    const login = async (credentials: { email: string; password: string }) => {
        const version = ++generation.current;
        await bootstrapCsrf();
        if (version !== generation.current) throw new Error('Session changed. Please sign in again.');
        const response = await client.post<{ data: Actor }>('/api/app/v1/auth/login',
            { email: credentials.email, password: credentials.password }, { skipSessionHandling: true });
        if (version !== generation.current) throw new Error('Session changed. Please sign in again.');
        replaceSessionActor(response.data.data.id, true);
        setError(null);
        setUser(response.data.data);
        setStatus('authenticated');
        return response.data.data;
    };
    const logout = async () => {
        generation.current++;
        const session = getSessionVersion();
        try { await client.post('/api/app/v1/auth/logout', undefined, { _sessionVersion: session }); }
        finally { invalidateSession(session); }
    };
    const updateUser = useCallback((patch: Partial<Actor>) => {
        setUser((prev) => (prev ? { ...prev, ...patch } : prev));
    }, []);
    return <AuthContext.Provider value={{
        user, status, error, isAuthenticated: status === 'authenticated',
        isLoading: status === 'loading', login, logout, refresh, updateUser,
    }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be within AuthProvider');
    return context;
}
