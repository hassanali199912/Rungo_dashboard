import { Box, TextField, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formPasswordToggleAdornment, formStartAdornment } from "./formFieldAdornment";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppPasswordWithBarProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    startIcon?: ReactNode;
}

export default function AppPasswordWithBarField({
    name,
    label,
    placeholder,
    disabled = false,
    startIcon,
}: AppPasswordWithBarProps) {
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();
    const { control, watch } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);

    const passwordValue = watch(name) || "";

    const strength = useMemo(() => {
        let score = 0;

        if (passwordValue.length >= 8) score++;
        if (/[0-9]/.test(passwordValue)) score++;
        if (/[A-Z]/.test(passwordValue)) score++;
        if (/[^A-Za-z0-9]/.test(passwordValue)) score++;

        return score;
    }, [passwordValue]);

    const getStrengthLabel = () => {
        if (strength <= 1) return t("login.weak");
        if (strength === 2) return t("login.medal");
        return t("login.strong");
    };

    const strengthColor = strength <= 1 ? "error.main" : strength === 2 ? "warning.main" : "success.main";

    return (
        <Box>
            <Typography sx={formFieldLabelSx}>{label}</Typography>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        placeholder={placeholder}
                        disabled={disabled}
                        error={!!error}
                        helperText={error?.message ? t(error.message) : ""}
                        slotProps={{
                            htmlInput: { dir },
                            formHelperText: {
                                sx: {
                                    textAlign: dir === "rtl" ? "right" : "left",
                                },
                            },
                            input: {
                                startAdornment: formStartAdornment(startIcon),
                                endAdornment: formPasswordToggleAdornment(
                                    showPassword,
                                    () => setShowPassword((open) => !open),
                                    t("auth.toggle_password"),
                                ),
                            },
                        }}
                        sx={formOutlinedSingleLineInputSx}
                    />
                )}
            />
            {passwordValue ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 1.25 }}>
                    <Box sx={{ display: "flex", flex: 1, gap: 0.75 }}>
                        {[0, 1, 2, 3].map((index) => (
                            <Box
                                key={index}
                                sx={{
                                    flex: 1,
                                    height: 4,
                                    borderRadius: 999,
                                    bgcolor: index < strength ? strengthColor : "surface.dark",
                                }}
                            />
                        ))}
                    </Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, color: strengthColor, minWidth: 56 }}>
                        {getStrengthLabel()}
                    </Typography>
                </Box>
            ) : null}
        </Box>
    );
}
