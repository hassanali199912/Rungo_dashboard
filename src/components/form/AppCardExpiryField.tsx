import { Box, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppCardExpiryFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    showLable?: boolean;
}

/** Formats up to 4 digits as MM/YY (e.g. 0329 → 03/29). */
export function formatCardExpiryInput(value: string): string {
    const digits = value.replace(/\D/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

export default function AppCardExpiryField({
    name,
    label,
    placeholder,
    disabled = false,
    showLable = true,
}: AppCardExpiryFieldProps) {
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
                        type="text"
                        fullWidth
                        placeholder={placeholder}
                        disabled={disabled}
                        error={!!error}
                        helperText={error?.message ? t(error.message) : ""}
                        slotProps={{
                            htmlInput: {
                                dir,
                                inputMode: "numeric",
                                maxLength: 5,
                                autoComplete: "cc-exp",
                            },
                            formHelperText: {
                                sx: {
                                    textAlign: dir === "rtl" ? "right" : "left",
                                },
                            },
                        }}
                        onChange={(event) => {
                            field.onChange(formatCardExpiryInput(event.target.value));
                        }}
                        sx={formOutlinedSingleLineInputSx}
                    />
                )}
            />
        </Box>
    );
}
