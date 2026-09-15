import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { Box, IconButton, Typography } from "@mui/material";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";

interface ProfileImageUploaderProps {
    name: string;
    label?: string;
    disabled?: boolean;
    showLable?: boolean;
}

export default function ProfileImageUploader({
    name,
    label = "",
    disabled = false,
    showLable = false,
}: ProfileImageUploaderProps) {
    const { control } = useFormContext();
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const value = useWatch({ control, name });
    const [objectUrl, setObjectUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!(value instanceof File)) {
            setObjectUrl(null);
            return;
        }
        const url = URL.createObjectURL(value);
        setObjectUrl(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    const previewSrc =
        value instanceof File
            ? objectUrl
            : typeof value === "string" && value
              ? value
              : null;

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState: { error } }) => {
                const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                    const file = event.target.files?.[0];
                    if (!file) return;
                    field.onChange(file);
                    event.target.value = "";
                };

                return (
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        {showLable && label ? (
                            <Typography sx={{ mb: 2, fontSize: "14px" }}>{label}</Typography>
                        ) : null}

                        <Box sx={{ position: "relative", width: 120, height: 120 }}>
                            <Box
                                sx={{
                                    width: 120,
                                    height: 120,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    bgcolor: "surface.main",
                                    border: "1px solid",
                                    borderColor: error ? "error.main" : "divider",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {previewSrc ? (
                                    <Box
                                        component="img"
                                        src={previewSrc}
                                        alt=""
                                        sx={{
                                            width: "100%",
                                            height: "100%",
                                            objectFit: "cover",
                                        }}
                                    />
                                ) : (
                                    <PersonOutlinedIcon
                                        sx={{ fontSize: 56, color: "text.disabled" }}
                                    />
                                )}
                            </Box>

                            <IconButton
                                type="button"
                                disabled={disabled}
                                onClick={() => inputRef.current?.click()}
                                aria-label={t("form.edit")}
                                sx={{
                                    position: "absolute",
                                    top: 4,
                                    insetInlineEnd: 4,
                                    width: 32,
                                    height: 32,
                                    bgcolor: "common.white",
                                    border: "1px solid",
                                    borderColor: "divider",
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                    "&:hover": { bgcolor: "common.white" },
                                }}
                            >
                                <EditOutlinedIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            </IconButton>

                            <Box
                                component="input"
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                disabled={disabled}
                                onChange={handleChange}
                                sx={{ display: "none" }}
                            />
                        </Box>

                        {error?.message ? (
                            <Typography
                                variant="caption"
                                sx={{ color: "error.main", mt: 1, display: "block" }}
                            >
                                {t(error.message)}
                            </Typography>
                        ) : null}
                    </Box>
                );
            }}
        />
    );
}
