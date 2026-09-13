// src/hooks/useLocalStorage.ts
import { useCallback } from 'react';

export default function useLocalStorage() {
    const getItem = useCallback(<T = any>(key: string): T | null => {
        try {
            const item = localStorage.getItem(key);
            if (item === null) return null;
            return JSON.parse(item) as T;
        } catch {
            return null;
        }
    }, []);

    const setItem = useCallback(<T>(key: string, value: T): void => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (err) {
            console.warn('مشكلة في حفظ localStorage', err);
        }
    }, []);

    const removeItem = useCallback((key: string): void => {
        localStorage.removeItem(key);
    }, []);

    const removeAll = useCallback((): void => {
        localStorage.clear();
    }, []);

    return [getItem, setItem, removeItem, removeAll] as const;
}