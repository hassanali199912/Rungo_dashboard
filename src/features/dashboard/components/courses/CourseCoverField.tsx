import Add from "@mui/icons-material/Add";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { formFieldLabelSx } from "@/components/form/formFieldLayout";

type CourseCoverFieldProps = {
    name: string;
    label: string;
    hint?: string;
    changeLabel: string;
};

export default function CourseCoverField({ name, label, hint, changeLabel }: CourseCoverFieldProps) {
    const { control } = useFormContext();
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);

    return (
        <Box>
            <Typography sx={formFieldLabelSx}>{label}</Typography>
            {hint && (
                <Typography sx={{ fontSize: 12, color: "text.secondary", mb: 1.25, mt: -0.5 }}>{hint}</Typography>
            )}
            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                    const file = field.value instanceof File ? field.value : null;

                    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                        const next = event.target.files?.[0];
                        if (next) field.onChange(next);
                        event.target.value = "";
                    };

                    return (
                        <>
                            <Box
                                sx={{
                                    borderRadius: "1rem",
                                    overflow: "hidden",
                                    bgcolor: "surface.main",
                                    border: "1px dashed",
                                    borderColor: error ? "error.main" : "divider",
                                }}
                            >
                                {file ? (
                                    <CoverPreview file={file} />
                                ) : (
                                    <Box
                                        component="button"
                                        type="button"
                                        onClick={() => inputRef.current?.click()}
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "16 / 9",
                                            border: 0,
                                            bgcolor: "transparent",
                                            color: "text.secondary",
                                            cursor: "pointer",
                                            display: "grid",
                                            placeItems: "center",
                                            gap: 1,
                                        }}
                                    >
                                        <Add sx={{ fontSize: 28 }} />
                                        <Typography sx={{ fontSize: 13, fontWeight: 700 }}>{hint}</Typography>
                                    </Box>
                                )}
                            </Box>
                            {file && (
                                <AppBtn
                                    customType="outline"
                                    type="button"
                                    onClick={() => inputRef.current?.click()}
                                    sx={{ borderRadius: 999, mt: 1.25 }}
                                >
                                    {changeLabel}
                                </AppBtn>
                            )}
                            <Box
                                component="input"
                                ref={inputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleChange}
                                sx={{ display: "none" }}
                            />
                            {error?.message ? (
                                <Typography variant="caption" sx={{ color: "error.main", mt: 0.75, display: "block" }}>
                                    {t(error.message)}
                                </Typography>
                            ) : null}
                        </>
                    );
                }}
            />
        </Box>
    );
}

function CoverPreview({ file }: { file: File }) {
    const url = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => {
        return () => URL.revokeObjectURL(url);
    }, [url]);

    return (
        <Box
            component="img"
            src={url}
            alt=""
            sx={{ width: "100%", aspectRatio: "16 / 9", objectFit: "cover", display: "block" }}
        />
    );
}
