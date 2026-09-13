import { Box, TextField, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formEndAdornment, formStartAdornment } from "./formFieldAdornment";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppTextFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    showLable?: boolean;
    startIcon?: ReactNode;
    maxLength?: number;
    endAction?: ReactNode;
}

export default function AppTextField({
    name,
    label,
    placeholder,
    disabled = false,
    showLable = true,
    startIcon,
    maxLength,
    endAction,
}: AppTextFieldProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();

    return (
        <Box>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                    const length = String(field.value ?? "").length;

                    return (
                        <>
                            {showLable && (
                                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                                    <Typography sx={formFieldLabelSx}>{label}</Typography>
                                    {maxLength != null && (
                                        <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1 }}>
                                            {length}/{maxLength}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                            <TextField
                                {...field}
                                type="text"
                                fullWidth
                                placeholder={placeholder}
                                disabled={disabled}
                                error={!!error}
                                helperText={error?.message ? t(error.message) : ""}
                                slotProps={{
                                    htmlInput: { dir, maxLength },
                                    formHelperText: {
                                        sx: {
                                            textAlign: dir === "rtl" ? "right" : "left",
                                        },
                                    },
                                    input: {
                                        startAdornment: formStartAdornment(startIcon),
                                        endAdornment: formEndAdornment(endAction),
                                    },
                                }}
                                sx={formOutlinedSingleLineInputSx}
                            />
                        </>
                    );
                }}
            />
        </Box>
    );
}
