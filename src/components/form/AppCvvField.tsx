import { Box, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppCvvFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    showLable?: boolean;
}

export function formatCvvInput(value: string): string {
    return value.replace(/\D/g, "").slice(0, 4);
}

export default function AppCvvField({
    name,
    label,
    placeholder,
    disabled = false,
    showLable = true,
}: AppCvvFieldProps) {
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
                        value={field.value ?? ""}
                        type="password"
                        fullWidth
                        placeholder={placeholder}
                        disabled={disabled}
                        error={!!error}
                        helperText={error?.message ? t(error.message) : ""}
                        slotProps={{
                            htmlInput: {
                                dir,
                                inputMode: "numeric",
                                maxLength: 4,
                                autoComplete: "cc-csc",
                            },
                            formHelperText: {
                                sx: {
                                    textAlign: dir === "rtl" ? "right" : "left",
                                },
                            },
                        }}
                        onChange={(event) => {
                            field.onChange(formatCvvInput(event.target.value));
                        }}
                        sx={formOutlinedSingleLineInputSx}
                    />
                )}
            />
        </Box>
    );
}
