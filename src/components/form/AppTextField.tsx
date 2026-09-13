import { Box, TextField, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formStartAdornment } from "./formFieldAdornment";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppTextFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    showLable?: boolean;
    startIcon?: ReactNode;
}

export default function AppTextField({
    name,
    label,
    placeholder,
    disabled = false,
    showLable = true,
    startIcon,
}: AppTextFieldProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();
    return (
        <Box>
            {showLable && <Typography sx={formFieldLabelSx}>{label}</Typography>}

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        type="text"
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
                            },
                        }}
                        sx={formOutlinedSingleLineInputSx}
                    />
                )}
            />
        </Box>
    );
}
