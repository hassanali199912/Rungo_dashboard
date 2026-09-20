
// ─── Toast ────────────────────────────────────────────────
import { Toaster } from "react-hot-toast"
// ─── MUI Theme ────────────────────────────────────────────────
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { createAppTheme } from '../theme';
import { ThemeModeProvider, useThemeMode } from './ThemeModeProvider';

// ─── i18next ──────────────────────────────────────────────────
import { I18nextProvider } from 'react-i18next';
import { i18n } from '../language/index';
// ─── Redux ────────────────────────────────────────────────────
import { useEffect, useMemo, type ReactNode } from 'react';
import useLocalStorage from "../shared/hooks/useLocalStorage";
import { AuthProvider } from "./AuthProvider";
import { QueryProvider } from "./QueryProvider";


interface AppProvidersProps {
    children: ReactNode;
}

function ThemedApp({ children }: AppProvidersProps) {
    const { mode } = useThemeMode();
    const theme = useMemo(() => createAppTheme(mode), [mode]);

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <I18nextProvider i18n={i18n}>
                {children}
                <Toaster
                    position={i18n.language == "en" ? "top-left" : "top-right"}
                    toastOptions={{
                        duration: 4000,
                    }}
                />
            </I18nextProvider>
        </ThemeProvider>
    );
}

export default function AppProviders({ children }: AppProvidersProps) {

    const [getItem, setItem] = useLocalStorage();

    useEffect(() => {
        const lang = getItem("lang");
        if (!lang) {
            setItem("lang", "ar");
            i18n.changeLanguage("ar");
        } else {
            i18n.changeLanguage(lang);
        }

    }, [])


    return (
        <QueryProvider>
            <AuthProvider>
                <ThemeModeProvider>
                    <ThemedApp>{children}</ThemedApp>
                </ThemeModeProvider>
            </AuthProvider>
        </QueryProvider>
    );
}