import axios, { AxiosError, AxiosHeaders, type AxiosRequestConfig } from 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        /** When true, a 401 will not clear the stored token or emit `unauthenticated`. */
        skipAuthHandling?: boolean;
        /** Internal: this request already recovered from a 401 via refresh. */
        _authRetried?: boolean;
    }
}

export interface ApiErrorBody {
    code?: string;
    message?: string;
    errors?: Record<string, string[]>;
}

type ApiEvent = 'unauthenticated';

const ACCESS_TOKEN_KEY = 'rungo.accessToken';
const REFRESH_TOKEN_KEY = 'rungo.refreshToken';
const AUTH_USER_KEY = 'rungo.authUser';
const PUBLIC_AUTH_PATH = /\/auth\/(?:dashboard\/)?(login|register|refresh)\/?$/i;

const listeners = new Map<ApiEvent, Set<() => void>>();

export function onApiEvent(event: ApiEvent, listener: () => void) {
    const group = listeners.get(event) ?? new Set();
    group.add(listener);
    listeners.set(event, group);
    return () => {
        group.delete(listener);
    };
}

function emit(event: ApiEvent) {
    listeners.get(event)?.forEach((listener) => listener());
}

function readStorage(key: string): string | null {
    try {
        return localStorage.getItem(key);
    } catch {
        return null;
    }
}

function writeStorage(key: string, value: string | null) {
    try {
        if (value) localStorage.setItem(key, value);
        else localStorage.removeItem(key);
    } catch {
        // Storage can be unavailable (private mode / blocked). Requests simply go unauthenticated.
    }
}

export function getAccessToken(): string | null {
    return readStorage(ACCESS_TOKEN_KEY);
}

export function getRefreshToken(): string | null {
    return readStorage(REFRESH_TOKEN_KEY);
}

export function getStoredUser<T = unknown>(): T | null {
    const raw = readStorage(AUTH_USER_KEY);
    if (!raw) return null;
    try {
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

export function setStoredUser(user: unknown | null) {
    writeStorage(AUTH_USER_KEY, user == null ? null : JSON.stringify(user));
}

export function setAuthSession(session: {
    accessToken: string;
    refreshToken?: string | null;
    user?: unknown | null;
}) {
    writeStorage(ACCESS_TOKEN_KEY, session.accessToken);
    writeStorage(REFRESH_TOKEN_KEY, session.refreshToken ?? null);
    if (session.user !== undefined) setStoredUser(session.user);
}

export function clearAuth() {
    writeStorage(ACCESS_TOKEN_KEY, null);
    writeStorage(REFRESH_TOKEN_KEY, null);
    writeStorage(AUTH_USER_KEY, null);
    emit('unauthenticated');
}

type AuthSessionPayload = {
    accessToken: string;
    refreshToken: string;
    user: unknown;
};

let refreshRequest: Promise<AuthSessionPayload | null> | null = null;

export async function refreshAccessToken() {
    if (refreshRequest) return refreshRequest;

    const run = async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return null;
        try {
            const { data } = await axiosInstance.post<AuthSessionPayload>(
                '/auth/refresh',
                { refreshToken },
                { skipAuthHandling: true },
            );
            setAuthSession({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken,
                user: data.user,
            });
            return data;
        } catch {
            return null;
        }
    };

    refreshRequest = run().finally(() => {
        refreshRequest = null;
    });
    return refreshRequest;
}

function requestPath(config: AxiosRequestConfig): string {
    const raw = config.url ?? '';
    const withoutQuery = raw.split('?')[0] || '';
    try {
        if (/^https?:\/\//i.test(withoutQuery)) return new URL(withoutQuery).pathname;
        const base = config.baseURL || window.location.origin;
        return new URL(withoutQuery || '/', base).pathname;
    } catch {
        return withoutQuery;
    }
}

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || undefined,
    timeout: 15000,
    withCredentials: false,
    headers: { Accept: 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
    const headers = AxiosHeaders.from(config.headers);
    headers.delete('Authorization');

    const path = requestPath(config);
    const token = getAccessToken();
    if (token && !PUBLIC_AUTH_PATH.test(path)) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    config.headers = headers;
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: AxiosError<ApiErrorBody>) => {
        const config = error.config;
        const status = error.response?.status;
        if (status !== 401 || !config || config.skipAuthHandling || config._authRetried) {
            return Promise.reject(error);
        }

        const path = requestPath(config);
        if (PUBLIC_AUTH_PATH.test(path)) {
            return Promise.reject(error);
        }

        const session = await refreshAccessToken();
        if (!session) {
            clearAuth();
            return Promise.reject(error);
        }

        config._authRetried = true;
        return axiosInstance.request(config);
    },
);

export default axiosInstance;
