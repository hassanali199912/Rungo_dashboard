import axios, { AxiosError, type AxiosRequestConfig } from 'axios';

declare module 'axios' {
    interface AxiosRequestConfig {
        businessScoped?: boolean;
        skipSessionHandling?: boolean;
        _csrfRetried?: boolean;
        _sessionVersion?: number;
    }
}
export interface ApiErrorBody {
    code?: string;
    message?: string;
    errors?: Record<string, string[]>;
}
type ApiEvent = 'unauthenticated' | 'actorChanged' | 'contextRequired' | 'businessUnavailable';
const listeners = new Map<ApiEvent, Set<() => void>>();
export function onApiEvent(event: ApiEvent, listener: () => void) {
    const group = listeners.get(event) ?? new Set();
    group.add(listener);
    listeners.set(event, group);
    return () => { group.delete(listener); };
}
function emit(event: ApiEvent) { listeners.get(event)?.forEach(listener => listener()); }
let selectedUid: string | null = null;
let sessionVersion = 0;
let sessionActorId: string | null = null;
export function setBusinessContext(uid: string | null) { selectedUid = uid; }
export function getSessionVersion() { return sessionVersion; }
function advanceSessionGeneration() {
    sessionVersion++;
    selectedUid = null;
}
export function replaceSessionActor(actorId: string | number, newLogin = false) {
    const nextId = String(actorId);
    if (!newLogin && sessionActorId === nextId) return;
    const replacingActor = sessionActorId !== null;
    sessionActorId = nextId;
    advanceSessionGeneration();
    // Clear previous actor state synchronously before pending provider callbacks run.
    // Initial hydration preserves the saved selector for authorized-list validation.
    if (replacingActor) emit('actorChanged');
}
export function invalidateSession(expectedVersion = sessionVersion) {
    if (expectedVersion !== sessionVersion) return;
    sessionActorId = null;
    advanceSessionGeneration();
    emit('unauthenticated');
}
function assertCurrentSession(config: AxiosRequestConfig) {
    if (config._sessionVersion !== sessionVersion) {
        throw new axios.CanceledError('Stale session request');
    }
}
const axiosInstance = axios.create({
    baseURL: '/',
    timeout: 15000,
    withCredentials: true,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    headers: { Accept: 'application/json' },
});
// Root-relative URLs only. Resolve with the browser model before classification;
// retain the caller's outgoing URL, including its query, without rewriting it.
export function normalizeApiPath(url: string) {
    const origin = window.location.origin;
    const resolved = new URL(url, origin);
    if (resolved.origin !== origin || !url.startsWith('/') || url.startsWith('//') ||
        url.includes('\\') || /\p{Cc}/u.test(url)) {
        throw new Error('API requests must use same-origin root-relative URLs without control characters or backslashes.');
    }
    return resolved.pathname.replace(/\/+$/, '') || '/';
}
const unscoped = new Set([
    '/sanctum/csrf-cookie', '/api/app/v1/auth/login', '/api/app/v1/auth/register',
    '/api/app/v1/auth/me', '/api/app/v1/auth/logout', '/api/app/v1/businesses',
]);
axiosInstance.interceptors.request.use(config => {
    if (config.baseURL !== '/') throw new Error('API baseURL must remain root-relative.');
    const path = normalizeApiPath(config.url ?? '');
    config._sessionVersion ??= sessionVersion;
    assertCurrentSession(config);
    const scoped = !unscoped.has(path) &&
        (config.businessScoped || path === '/api/app/v1/businesses/current');
    if (config._csrfRetried && scoped &&
        (config.headers.get('X-Business-Uid') || null) !== selectedUid) {
        throw new axios.CanceledError('Business context changed during CSRF recovery');
    }
    config.headers.delete('X-Business-Uid');
    if (scoped && selectedUid) config.headers.set('X-Business-Uid', selectedUid);
    return config;
});
let csrfRequest: { version: number; promise: Promise<void> } | undefined;
export function bootstrapCsrf() {
    if (csrfRequest?.version === sessionVersion) return csrfRequest.promise;
    const request = {
        version: sessionVersion,
        promise: axiosInstance.get('/sanctum/csrf-cookie', {
            skipSessionHandling: true, _sessionVersion: sessionVersion,
        }).then(() => undefined).finally(() => {
            if (csrfRequest === request) csrfRequest = undefined;
        }),
    };
    csrfRequest = request;
    return request.promise;
}
axiosInstance.interceptors.response.use(response => {
    assertCurrentSession(response.config);
    return response;
}, async (error: AxiosError<ApiErrorBody>) => {
    const config = error.config;
    if (!config) return Promise.reject(error);
    assertCurrentSession(config);
    const status = error.response?.status;
    const code = error.response?.data?.code;
    const path = normalizeApiPath(config.url ?? '/');
    if (status === 419 && code === 'CSRF_TOKEN_MISMATCH' &&
        !config._csrfRetried && path !== '/sanctum/csrf-cookie') {
        // Laravel rejects this request before mutation execution. No other mutation retry is permitted.
        config._csrfRetried = true;
        const uid = config.headers.get('X-Business-Uid');
        await bootstrapCsrf();
        assertCurrentSession(config);
        if ((config.businessScoped || path === '/api/app/v1/businesses/current') &&
            (uid || null) !== selectedUid) {
            throw new axios.CanceledError('Business context changed during CSRF recovery');
        }
        config.headers.delete('X-XSRF-TOKEN');
        return axiosInstance.request(config);
    }
    if (status === 401 && !config.skipSessionHandling) invalidateSession();
    if (status === 422 && code === 'BUSINESS_CONTEXT_REQUIRED') emit('contextRequired');
    const failedBusinessUid = config.headers.get('X-Business-Uid');
    if (status === 404 && code === 'BUSINESS_NOT_AVAILABLE' &&
        typeof failedBusinessUid === 'string' && failedBusinessUid.length > 0 &&
        failedBusinessUid === selectedUid) {
        selectedUid = null;
        emit('businessUnavailable');
    }
    return Promise.reject(error);
});
export default axiosInstance;
