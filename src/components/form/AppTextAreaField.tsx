import { Box, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx, formOutlinedMultilineSx } from "./formFieldLayout";

interface AppTextAreaFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    minRows?: number;
    maxRows?: number;
}

export default function AppTextAreaField({
    name,
    label,
    placeholder,
    disabled = false,
    minRows = 4,
    maxRows,
}: AppTextAreaFieldProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();

    return (
        <Box sx={{ width: "100%" }}>
            <Typography sx={formFieldLabelSx}>{label}</Typography>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <TextField
                        {...field}
                        multiline
                        fullWidth
                        minRows={minRows}
                        maxRows={maxRows}
                        placeholder={placeholder}
                        disabled={disabled}
                        error={!!error}
                        helperText={error?.message ? t(error.message) : ""}
                        slotProps={{
                            htmlInput: { dir },
                            formHelperText: {
                                sx: { textAlign: dir === "rtl" ? "right" : "left" },
                            },
                        }}
                        sx={formOutlinedMultilineSx}
                    />
                )}
            />
        </Box>
    );
}
