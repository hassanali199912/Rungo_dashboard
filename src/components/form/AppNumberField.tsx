import { Box, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

interface AppNumberFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    showLable?: boolean;
}

export default function AppNumberField({
    name,
    label,
    placeholder,
    disabled = false,
    showLable = true,
}: AppNumberFieldProps) {
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
                        type="number"
                        fullWidth
                        placeholder={placeholder}
                        disabled={disabled}
                        error={!!error}
                        helperText={error?.message ? t(error.message) : ""}
                        slotProps={{
                            htmlInput: {
                                dir,
                                min: 0,
                                step: "any",
                                inputMode: "decimal",
                            },
                            formHelperText: {
                                sx: {
                                    textAlign: dir === "rtl" ? "right" : "left",
                                },
                            },
                        }}
                        onKeyDown={(event) => {
                            if (["-", "+", "e", "E"].includes(event.key)) {
                                event.preventDefault();
                            }
                        }}
                        onChange={(event) => {
                            const nextValue = event.target.value;
                            if (nextValue === "" || Number(nextValue) >= 0) {
                                field.onChange(nextValue);
                            }
                        }}
                        sx={formOutlinedSingleLineInputSx}
                    />
                )}
            />
        </Box>
    );
}
