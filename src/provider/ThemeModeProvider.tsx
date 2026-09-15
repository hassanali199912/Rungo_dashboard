import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { PaletteMode } from "@mui/material";
import useLocalStorage from "../shared/hooks/useLocalStorage";

const THEME_MODE_KEY = "themeMode";

type ThemeModeContextType = {
    mode: PaletteMode;
    setMode: (next: PaletteMode) => void;
    toggleMode: () => void;
};

const ThemeModeContext = createContext<ThemeModeContextType | null>(null);

function readStoredMode(getItem: ReturnType<typeof useLocalStorage>[0]): PaletteMode {
    const stored = getItem<PaletteMode>(THEME_MODE_KEY);
    return stored === "dark" ? "dark" : "light";
}

export const ThemeModeProvider = ({ children }: { children: ReactNode }) => {
    const [getItem, setItem] = useLocalStorage();
    const [mode, setMode] = useState<PaletteMode>(() => readStoredMode(getItem));

    const applyMode = useCallback((next: PaletteMode) => {
        setMode(next);
        setItem(THEME_MODE_KEY, next);
    }, [setItem]);

    const toggleMode = useCallback(() => {
        setMode((prev) => {
            const next: PaletteMode = prev === "light" ? "dark" : "light";
            setItem(THEME_MODE_KEY, next);
            return next;
        });
    }, [setItem]);

    const value = useMemo(() => ({ mode, setMode: applyMode, toggleMode }), [mode, applyMode, toggleMode]);

    return (
        <ThemeModeContext.Provider value={value}>
            {children}
        </ThemeModeContext.Provider>
    );
};

export const useThemeMode = () => {
    const context = useContext(ThemeModeContext);

    if (!context) {
        throw new Error("useThemeMode must be used within ThemeModeProvider");
    }

    return context;
};
