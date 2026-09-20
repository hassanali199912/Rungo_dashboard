import { QueryClient } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import type { ApiErrorBody } from '../../config/apis';

declare module '@tanstack/react-query' {
    interface Register {
        defaultError: AxiosError<ApiErrorBody>;
    }
}

const SKIP_RETRY_STATUSES = new Set([401, 403, 404, 422]);

function shouldRetryQuery(failureCount: number, error: Error): boolean {
    if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status != null && SKIP_RETRY_STATUSES.has(status)) return false;
    }
    return failureCount < 2;
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 60_000,
            gcTime: 10 * 60_000,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
            retry: shouldRetryQuery,
        },
        mutations: {
            retry: 0,
        },
    },
});
