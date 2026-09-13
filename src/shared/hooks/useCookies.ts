// src/hooks/useCookies.ts

export default function useCookies() {

    const getItem = (name: string): string | null => {
        if (typeof window === 'undefined') return null;

        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            return parts.pop()?.split(';').shift() || null;
        }
        return null;
    };

    const setItem = (
        name: string,
        value: string | number | boolean | object,
        options: {
            expires?: number;
            path?: string;
            secure?: boolean;
            sameSite?: 'Strict' | 'Lax' | 'None';
        } = {}
    ): void => {
        if (typeof window === 'undefined') return;

        let cookieString = `${name}=${encodeURIComponent(
            typeof value === 'object' ? JSON.stringify(value) : String(value)
        )}`;

        if (options.expires) {
            const date = new Date();
            date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
            cookieString += `; expires=${date.toUTCString()}`;
        }

        cookieString += `; path=${options.path || '/'}`;

        if (options.secure) cookieString += '; Secure';
        if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

        document.cookie = cookieString;
    };

    const removeItem = (name: string): void => {
        if (typeof window === 'undefined') return;
        document.cookie = `${name}=; Max-Age=0; path=/`;
    };

    const removeAll = (): void => {
        if (typeof window === 'undefined') return;

        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
            const eqPos = cookie.indexOf('=');
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = `${name}=; Max-Age=0; path=/`;
        }
    };

    return [getItem, setItem, removeItem, removeAll] as const;
}