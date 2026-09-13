import Add from "@mui/icons-material/Add";
import { Box, Typography } from "@mui/material";
import { useEffect, useMemo, useRef, type ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx } from "./formFieldLayout";

interface AppPosterFieldProps {
    name: string;
    label: string;
    hint?: string;
    disabled?: boolean;
    accept?: string;
}

function normalizeFiles(value: unknown): File[] {
    if (value instanceof File) return [value];
    if (Array.isArray(value)) {
        return value.filter((entry): entry is File => entry instanceof File);
    }
    return [];
}

function PosterTile({ file, onRemove }: { file: File; onRemove: () => void }) {
    const url = useMemo(() => URL.createObjectURL(file), [file]);

    useEffect(() => {
        return () => URL.revokeObjectURL(url);
    }, [url]);

    return (
        <Box
            component="button"
            type="button"
            onClick={onRemove}
            sx={{
                border: 0,
                p: 0,
                width: 92,
                aspectRatio: "9 / 16",
                borderRadius: "1rem",
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "surface.main",
            }}
        >
            <Box component="img" src={url} alt={file.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>
    );
}

export default function AppPosterField({
    name,
    label,
    hint,
    disabled = false,
    accept = "image/*",
}: AppPosterFieldProps) {
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
                    const files = normalizeFiles(field.value);

                    const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
                        const next = Array.from(event.target.files ?? []);
                        if (!next.length) return;
                        field.onChange([...files, ...next]);
                        event.target.value = "";
                    };

                    return (
                        <>
                            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.25 }}>
                                {files.map((file, index) => (
                                    <PosterTile
                                        key={`${file.name}-${file.size}-${index}`}
                                        file={file}
                                        onRemove={() => field.onChange(files.filter((_, fileIndex) => fileIndex !== index))}
                                    />
                                ))}
                                <Box
                                    component="button"
                                    type="button"
                                    disabled={disabled}
                                    onClick={() => inputRef.current?.click()}
                                    sx={{
                                        width: 92,
                                        aspectRatio: "9 / 16",
                                        borderRadius: "1rem",
                                        border: "1px dashed",
                                        borderColor: error ? "error.main" : "divider",
                                        bgcolor: "transparent",
                                        color: "text.secondary",
                                        cursor: disabled ? "not-allowed" : "pointer",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: 0.75,
                                        px: 1,
                                    }}
                                >
                                    <Add sx={{ fontSize: 22 }} />
                                    <Typography sx={{ fontSize: 11, fontWeight: 700, textAlign: "center" }}>
                                        {t("form.upload_poster")}
                                    </Typography>
                                </Box>
                            </Box>
                            <Box
                                component="input"
                                ref={inputRef}
                                type="file"
                                accept={accept}
                                multiple
                                disabled={disabled}
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
