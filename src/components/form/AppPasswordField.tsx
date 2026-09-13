import { Box, TextField, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formPasswordToggleAdornment, formStartAdornment } from "./formFieldAdornment";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppPasswordFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    startIcon?: ReactNode;
}

export default function AppPasswordField({
    name,
    label,
    placeholder,
    disabled = false,
    startIcon,
}: AppPasswordFieldProps) {
    const { control } = useFormContext();
    const [showPassword, setShowPassword] = useState(false);
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();

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
        </Box>
    );
}
