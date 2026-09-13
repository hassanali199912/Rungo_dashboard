import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { Box, InputAdornment, TextField, Typography } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx, formOutlinedSingleLineInputSx } from "./formFieldLayout";

export type EmailStatus = "verified" | "unverified";

interface AppEmailStatusFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    emailStatus?: EmailStatus;
}

const statusBadgeSx = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
    px: 1,
    py: 0.25,
    borderRadius: 999,
    border: "1px solid #0F993E",
    background: "#DCFCE7",
    color: "#008236",
    fontSize: "12px",
    fontWeight: 600,
    whiteSpace: "nowrap",
    lineHeight: 1.4,
} as const;

export default function AppEmailStatusField({
    name,
    label,
    placeholder,
    disabled = false,
    emailStatus = "unverified",
}: AppEmailStatusFieldProps) {
    const { control } = useFormContext();
    const { t, i18n } = useTranslation();
    const dir = i18n.dir();
    const isVerified = emailStatus === "verified";

    return (
        <Box>
            <Typography sx={formFieldLabelSx}>{label}</Typography>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <>
                        <TextField
                            {...field}
                            type="email"
                            fullWidth
                            placeholder={placeholder}
                            disabled={disabled}
                            error={!!error}
                            slotProps={{
                                htmlInput: { dir },
                                input: {
                                    endAdornment: isVerified ? (
                                        <InputAdornment position="end">
                                            <Box component="span" sx={statusBadgeSx}>
                                                <CheckCircleIcon sx={{ fontSize: 14 }} />
                                                {t("profile_page.personal_information.verified")}
                                            </Box>
                                        </InputAdornment>
                                    ) : undefined,
                                },
                            }}
                            sx={formOutlinedSingleLineInputSx}
                        />

                        {error?.message ? (
                            <Typography
                                variant="caption"
                                sx={{
                                    color: "error.main",
                                    mt: 0.5,
                                    display: "block",
                                    textAlign: dir === "rtl" ? "right" : "left",
                                }}
                            >
                                {t(error.message)}
                            </Typography>
                        ) : isVerified ? (
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5,
                                    mt: 0.75,
                                    color: "#0F993E",
                                }}
                            >
                                <CheckCircleIcon sx={{ fontSize: 16 }} />
                                <Typography sx={{ fontSize: "13px", color: "inherit" }}>
                                    {t("profile_page.personal_information.email_verified")}
                                </Typography>
                            </Box>
                        ) : null}
                    </>
                )}
            />
        </Box>
    );
}
