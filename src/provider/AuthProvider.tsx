/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import axios from 'axios';
import { useQueryClient } from '@tanstack/react-query';
import { getAccessToken, onApiEvent, setStoredUser } from '@/config/apis';
import { useLogin, type DashboardUser } from '@/features/queryHooks/useLogin';
import { useLogout } from '@/features/queryHooks/useLogout';
import { useMe } from '@/features/queryHooks/useMe';
import { authKeys } from '@/shared/query/authKeys';

export interface Actor {
    id: number | string;
    name: string;
    email: string;
    role: string | null;
    phoneNumber?: string | null;
    avatarUrl?: string | null;
}

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

export function toActor(user: DashboardUser): Actor {
    return {
        id: user.id,
        name: user.displayName,
        email: user.email,
        role: user.role,
        phoneNumber: user.phoneNumber,
        avatarUrl: user.avatarUrl,
    };
}

function sessionErrorMessage(error: unknown): string | null {
    if (!error) return null;
    if (axios.isAxiosError(error) && error.response?.status === 401) return null;
    return 'Unable to check your session. Please try again.';
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const queryClient = useQueryClient();
    const [hasToken, setHasToken] = useState(() => Boolean(getAccessToken()));
    const me = useMe(hasToken);
    const { mutateAsync: loginWithPassword } = useLogin();
    const { mutateAsync: logoutSession } = useLogout();
    const refetchMe = me.refetch;

    useEffect(() => {
        return onApiEvent('unauthenticated', () => {
            setHasToken(false);
            queryClient.setQueryData(authKeys.me(), null);
        });
    }, [queryClient]);

    const user = useMemo(() => (me.data ? toActor(me.data) : null), [me.data]);
    const isLoading = hasToken && me.isPending;
    const isAuthenticated = Boolean(hasToken && me.data);
    const status: Status = isLoading ? 'loading' : isAuthenticated ? 'authenticated' : 'unauthenticated';
    const error = hasToken ? sessionErrorMessage(me.error) : null;

    const login = useCallback(async (credentials: { email: string; password: string }) => {
        const data = await loginWithPassword(credentials);
        setHasToken(true);
        return toActor(data.user);
    }, [loginWithPassword]);

    const logout = useCallback(async () => {
        await logoutSession();
        setHasToken(false);
    }, [logoutSession]);

    const refresh = useCallback(async () => {
        if (!hasToken) return;
        await refetchMe();
    }, [hasToken, refetchMe]);

    const updateUser = useCallback((patch: Partial<Actor>) => {
        queryClient.setQueryData<DashboardUser>(authKeys.me(), (current) => {
            if (!current) return current;
            const next = {
                ...current,
                email: patch.email ?? current.email,
                displayName: patch.name ?? current.displayName,
                avatarUrl: patch.avatarUrl !== undefined ? patch.avatarUrl : current.avatarUrl,
            };
            setStoredUser(next);
            return next;
        });
    }, [queryClient]);

    const value = useMemo<AuthContextValue>(() => ({
        user,
        status,
        isAuthenticated,
        isLoading,
        error,
        login,
        logout,
        refresh,
        updateUser,
    }), [user, status, isAuthenticated, isLoading, error, login, logout, refresh, updateUser]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be within AuthProvider');
    return context;
}
