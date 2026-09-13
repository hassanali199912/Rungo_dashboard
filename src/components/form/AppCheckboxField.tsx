import { Box, Checkbox, FormControlLabel, Typography } from "@mui/material";
import type { ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface AppCheckboxFieldProps {
    name: string;
    label: string;
    disabled?: boolean;
    children?: ReactNode;
}

export default function AppCheckboxField({
    name,
    label,
    disabled = false,
    children,
}: AppCheckboxFieldProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();

    return (
        <Box>
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <Box sx={{ mb: 0.5 }}>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                gap: 1,
                            }}
                        >
                            <FormControlLabel
                                sx={{ m: 0, alignItems: "flex-start", gap: 0.5 }}
                                control={
                                    <Checkbox
                                        {...field}
                                        checked={Boolean(field.value)}
                                        disabled={disabled}
                                        sx={{
                                            mt: -0.25,
                                            color: "text.disabled",
                                            "&.Mui-checked": { color: "primary.main" },
                                        }}
                                    />
                                }
                                label={
                                    <Typography sx={{ fontSize: 13, color: "text.secondary", lineHeight: 1.6, pt: 0.75 }}>
                                        {label}
                                    </Typography>
                                }
                            />

                            {children}
                        </Box>

                        {error?.message ? (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "error.main",
                                    mt: 0.5,
                                    textAlign: i18n.dir() === "rtl" ? "right" : "left",
                                }}
                            >
                                {t(error.message)}
                            </Typography>
                        ) : null}
                    </Box>
                )}
            />
        </Box>
    );
}
