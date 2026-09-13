import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState, type RefObject } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";
import { typography } from "@/styles/fontsLayout";

interface AppColorFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    showLable?: boolean;
}

function normalizeHex(value: string) {
    return value.replace(/[^0-9A-Fa-f]/g, "").slice(0, 6).toUpperCase();
}

function toPickerValue(hex: string) {
    const normalized = normalizeHex(hex);
    return normalized.length === 6 ? `#${normalized}` : "#D44D00";
}

export default function AppColorField({
    name,
    label,
    placeholder = "D44D00",
    disabled = false,
    showLable = true,
}: AppColorFieldProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();
    const colorInputRef = useRef<HTMLInputElement>(null);

    return (
        <Box>
            {showLable && <Typography sx={formFieldLabelSx}>{label}</Typography>}

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <ColorFieldInner
                        value={field.value ?? ""}
                        onCommit={(hex) => field.onChange(hex)}
                        onBlur={field.onBlur}
                        name={field.name}
                        inputRef={field.ref}
                        errorMessage={error?.message ? t(error.message) : ""}
                        placeholder={placeholder}
                        disabled={disabled}
                        dir={dir}
                        label={label}
                        colorInputRef={colorInputRef}
                    />
                )}
            />
        </Box>
    );
}

function ColorFieldInner({
    value,
    onCommit,
    onBlur,
    name,
    inputRef,
    errorMessage,
    placeholder,
    disabled,
    dir,
    label,
    colorInputRef,
}: {
    value: string;
    onCommit: (hex: string) => void;
    onBlur: () => void;
    name: string;
    inputRef: (instance: HTMLInputElement | null) => void;
    errorMessage: string;
    placeholder: string;
    disabled: boolean;
    dir: string;
    label: string;
    colorInputRef: RefObject<HTMLInputElement | null>;
}) {
    const [localHex, setLocalHex] = useState(() => normalizeHex(value));
    const commitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const latestLocalRef = useRef(localHex);

    useEffect(() => {
        const next = normalizeHex(value);
        // Sync from form only when external reset/default changes, not while typing locally.
        if (next !== latestLocalRef.current) {
            latestLocalRef.current = next;
            setLocalHex(next);
        }
    }, [value]);

    useEffect(() => {
        return () => {
            if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
        };
    }, []);

    const flushCommit = (hex: string) => {
        if (commitTimerRef.current) {
            clearTimeout(commitTimerRef.current);
            commitTimerRef.current = null;
        }
        const next = normalizeHex(hex);
        latestLocalRef.current = next;
        if (next !== normalizeHex(value)) {
            onCommit(next);
        }
    };

    const updateLocal = (raw: string, { commitNow = false }: { commitNow?: boolean } = {}) => {
        const next = normalizeHex(raw);
        latestLocalRef.current = next;
        setLocalHex(next);

        if (commitNow) {
            flushCommit(next);
            return;
        }

        if (commitTimerRef.current) clearTimeout(commitTimerRef.current);
        commitTimerRef.current = setTimeout(() => {
            flushCommit(next);
        }, 200);
    };

    const pickerValue = toPickerValue(localHex);

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%" }}>
            <TextField
                value={localHex}
                onChange={(event) => updateLocal(event.target.value)}
                onBlur={() => {
                    flushCommit(latestLocalRef.current);
                    onBlur();
                }}
                name={name}
                inputRef={inputRef}
                fullWidth
                placeholder={placeholder}
                disabled={disabled}
                error={Boolean(errorMessage)}
                helperText={errorMessage}
                slotProps={{
                    htmlInput: { dir, maxLength: 6 },
                    formHelperText: {
                        sx: {
                            textAlign: dir === "rtl" ? "right" : "left",
                        },
                    },
                    input: {
                        startAdornment: (
                            <InputAdornment position="start">
                                <Typography
                                    sx={{
                                        ...typography.font14_14,
                                        color: "text.secondary",
                                    }}
                                >
                                    #
                                </Typography>
                            </InputAdornment>
                        ),
                    },
                }}
                sx={{
                    ...formOutlinedSingleLineInputSx,
                    "& .MuiInputBase-root": {
                        ...formOutlinedSingleLineInputSx["& .MuiInputBase-root"],
                        minHeight: 40,
                    },
                }}
            />

            <Box
                component="button"
                type="button"
                disabled={disabled}
                onClick={() => colorInputRef.current?.click()}
                aria-label={label || "color picker"}
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    flexShrink: 0,
                    bgcolor: pickerValue,
                    border: "1px solid",
                    borderColor: "divider",
                    p: 0,
                    cursor: disabled ? "not-allowed" : "pointer",
                    opacity: disabled ? 0.6 : 1,
                }}
            />

            <Box
                component="input"
                ref={colorInputRef}
                type="color"
                value={pickerValue}
                disabled={disabled}
                onInput={(event) => {
                    // Dragging: update local swatch only (cheap). Form write is debounced.
                    updateLocal((event.target as HTMLInputElement).value);
                }}
                onChange={(event) => {
                    // Settled selection: commit immediately.
                    updateLocal(event.target.value, { commitNow: true });
                }}
                sx={{
                    position: "absolute",
                    width: 0,
                    height: 0,
                    opacity: 0,
                    pointerEvents: "none",
                }}
            />
        </Box>
    );
}
