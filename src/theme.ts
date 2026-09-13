import { createTheme, type PaletteMode } from '@mui/material/styles';

/** Kinetic Pulse tokens from DESIGN (2).md */
const tokens = {
    primary: '#FF5722',
    primaryLight: '#ffb5a0',
    primaryDark: '#b02f00',
    onPrimary: '#5f1500',
    primaryFixed: '#ffdbd1',
    onPrimaryFixed: '#3b0900',

    secondary: '#121417',
    secondaryMuted: '#c6c6ca',
    secondaryContainer: '#4a4b4f',
    secondaryFixed: '#e2e2e6',
    onSecondary: '#2f3034',

    tertiary: '#00E5FF',
    tertiaryDark: '#00a0b3',
    tertiaryDeep: '#00363d',
    tertiaryFixed: '#9cf0ff',

    carbon: '#121417',
    canvas: '#0f141a',
    canvasLowest: '#0a0e15',
    elevatedSlate: '#1E2229',
    surfaceBright: '#353941',
    surfaceLow: '#181c23',
    surface: '#1c2027',
    surfaceHigh: '#262a31',
    surfaceHighest: '#31353c',
    modal: '#1A1D23',

    onSurface: '#dfe2ec',
    onSurfaceVariant: '#e4beb4',
    coolSlate: '#94A3B8',
    white: '#ffffff',

    outline: '#ab8980',
    outlineVariant: '#5b4039',

    error: '#ffb4ab',
    onError: '#690005',
    errorContainer: '#93000a',
    errorOnLight: '#93000a',
} as const;

declare module '@mui/material/styles' {
    interface Palette {
        neutral: Palette['primary'];
        surface: Palette['primary'];
        white: Palette['primary'];
        tertiary: Palette['primary'];
    }

    interface PaletteOptions {
        neutral?: PaletteOptions['primary'];
        surface?: PaletteOptions['primary'];
        white?: PaletteOptions['primary'];
        tertiary?: PaletteOptions['primary'];
    }
}

declare module '@mui/material/Button' {
    interface ButtonPropsColorOverrides {
        neutral: true;
        surface: true;
        white: true;
        tertiary: true;
    }
}

declare module '@mui/material/Chip' {
    interface ChipPropsColorOverrides {
        neutral: true;
        surface: true;
        white: true;
        tertiary: true;
    }
}

export function createAppTheme(mode: PaletteMode = 'light') {
    const isDark = mode === 'dark';

    return createTheme({
        palette: {
            mode,

            primary: {
                main: tokens.primary,
                light: tokens.primaryLight,
                dark: tokens.primaryDark,
                contrastText: tokens.white,
            },

            secondary: isDark
                ? {
                    main: tokens.secondaryMuted,
                    light: tokens.secondaryFixed,
                    dark: tokens.secondaryContainer,
                    contrastText: tokens.onSecondary,
                }
                : {
                    main: tokens.secondary,
                    light: tokens.surfaceHigh,
                    dark: tokens.canvasLowest,
                    contrastText: tokens.white,
                },

            tertiary: {
                main: isDark ? tokens.tertiary : tokens.tertiaryDark,
                light: tokens.tertiaryFixed,
                dark: tokens.tertiaryDeep,
                contrastText: isDark ? tokens.tertiaryDeep : tokens.white,
            },

            success: {
                main: tokens.tertiaryDark,
                light: tokens.tertiary,
                dark: tokens.tertiaryDeep,
            },

            error: isDark
                ? {
                    main: tokens.error,
                    light: '#ffdad6',
                    dark: tokens.errorContainer,
                    contrastText: tokens.onError,
                }
                : {
                    main: tokens.errorOnLight,
                    light: tokens.error,
                    dark: tokens.onError,
                    contrastText: tokens.white,
                },

            warning: {
                main: tokens.primary,
                light: tokens.primaryLight,
                dark: tokens.primaryDark,
                contrastText: tokens.white,
            },

            text: isDark
                ? {
                    primary: tokens.onSurface,
                    secondary: tokens.coolSlate,
                    disabled: tokens.outline,
                }
                : {
                    primary: tokens.carbon,
                    secondary: tokens.elevatedSlate,
                    disabled: tokens.coolSlate,
                },

            background: isDark
                ? {
                    default: tokens.canvas,
                    paper: tokens.elevatedSlate,
                }
                : {
                    default: '#FAFAFA',
                    paper: tokens.white,
                },

            divider: isDark ? tokens.outlineVariant : tokens.outline,

            /** Elevated Slate — cards, inputs, borders */
            neutral: {
                main: tokens.elevatedSlate,
                light: isDark ? tokens.surfaceHigh : tokens.surfaceHighest,
                dark: tokens.carbon,
                contrastText: isDark ? tokens.onSurface : tokens.white,
            },

            /** Surface container stack */
            surface: {
                main: isDark ? tokens.surface : '#F4F2F1',
                light: isDark ? tokens.surfaceHigh : tokens.white,
                dark: isDark ? tokens.surfaceLow : tokens.secondaryFixed,
                contrastText: isDark ? tokens.onSurface : tokens.carbon,
            },

            white: {
                main: isDark ? tokens.modal : tokens.white,
                light: isDark ? tokens.surfaceLow : '#fafafa',
                dark: isDark ? tokens.canvasLowest : tokens.primaryFixed,
                contrastText: isDark ? tokens.white : tokens.carbon,
            },
        },

        typography: {
            fontFamily: [
                'Cairo',
                'Inter',
                'system-ui',
                'sans-serif',
            ].join(','),

            body1: { fontFamily: 'Cairo, Inter, sans-serif' },
        },
        shape: {
            borderRadius: 4,
        },

        components: {
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'capitalize',
                        fontWeight: 500,
                        padding: '10px 20px',
                    },
                },
            },
            MuiCard: {
                styleOverrides: {
                    root: {
                        boxShadow: isDark
                            ? '0 4px 20px rgba(255, 87, 34, 0.18)'
                            : '0 13px 19px 0 rgba(18, 20, 23, 0.07)',
                        border: isDark ? '1px solid rgba(255, 255, 255, 0.06)' : undefined,
                        borderRadius: 8,
                    },
                },
            },
        },
    });
}

export default createAppTheme('light');
