import { Box, TextareaAutosize, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx } from "./formFieldLayout";

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
    const { t } = useTranslation();
    return (
        <Box sx={{
            width: "100%"
        }}>
            <Typography sx={[formFieldLabelSx, { fontWeight: 500 }]}>
                {label}
            </Typography>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <TextareaAutosize
                            {...field}
                            placeholder={placeholder}
                            disabled={disabled}
                            minRows={minRows}
                            maxRows={maxRows}
                            style={{
                                width: "100%",
                                padding: "12px",
                                borderRadius: 8,
                                border: `1px solid ${error ? "#d32f2f" : "#dcdcdc"}`,
                                fontFamily: "inherit",
                                fontSize: "1rem",
                                resize: "vertical",
                                outline: "none",
                                background:"#fff"
                            }}
                        />

                        {error && (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "error.main",
                                    mt: 0.5,
                                    display: "block",
                                }}
                            >
                                {t(`${error?.message}`)}
                            </Typography>
                        )}
                    </>
                )}
            />
        </Box>
    );
}