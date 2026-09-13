import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import FolderOpenOutlined from "@mui/icons-material/FolderOpenOutlined";
import InsertDriveFileOutlined from "@mui/icons-material/InsertDriveFileOutlined";
import { Box, LinearProgress, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { btnIconStartSx } from "@/styles/btnStyle";
import { formFieldLabelSx } from "./formFieldLayout";

export type UploadVariant = "compact" | "dropzone";

interface AppUploadFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    hint?: string;
    browseLabel?: string;
    replaceLabel?: string;
    disabled?: boolean;
    multiple?: boolean;
    accept?: string;
    variant?: UploadVariant;
}

function formatBytes(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    const units = ["KB", "MB", "GB"];
    let size = bytes / 1024;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex += 1;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
}

function normalizeFiles(value: unknown): File[] {
    if (value instanceof File) return [value];
    if (Array.isArray(value)) {
        return value.filter((entry): entry is File => entry instanceof File);
    }
    return [];
}

function useVideoDuration(file: File | null) {
    const [duration, setDuration] = useState("");

    useEffect(() => {
        if (!file || !file.type.startsWith("video/")) {
            setDuration("");
            return;
        }

        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
            const total = Number.isFinite(video.duration) ? video.duration : 0;
            const minutes = Math.floor(total / 60);
            const seconds = Math.round(total % 60).toString().padStart(2, "0");
            setDuration(`${minutes}:${seconds}`);
            URL.revokeObjectURL(url);
        };
        video.src = url;

        return () => URL.revokeObjectURL(url);
    }, [file]);

    return duration;
}

function UploadFileRow({
    file,
    onReplace,
    replaceLabel,
}: {
    file: File;
    onReplace: () => void;
    replaceLabel: string;
}) {
    const { t, i18n } = useTranslation();
    const duration = useVideoDuration(file);

    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 1.5,
                p: 1.5,
                borderRadius: "1rem",
                bgcolor: "surface.main",
            }}
        >
            <Box
                sx={{
                    width: 40,
                    height: 40,
                    borderRadius: 1.5,
                    bgcolor: "background.paper",
                    display: "grid",
                    placeItems: "center",
                    color: "text.secondary",
                    flexShrink: 0,
                }}
            >
                <InsertDriveFileOutlined sx={{ fontSize: 20 }} />
            </Box>
            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {file.name}
                    </Typography>
                    <Box
                        component="button"
                        type="button"
                        onClick={onReplace}
                        sx={{
                            border: 0,
                            bgcolor: "transparent",
                            color: "primary.main",
                            fontSize: 12,
                            fontWeight: 700,
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                        }}
                    >
                        {replaceLabel}
                    </Box>
                </Box>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                    {duration ? `${duration} · ` : ""}
                    {formatBytes(file.size)} · {t("form.uploaded")}
                </Typography>
                <LinearProgress
                    dir={i18n.dir()}
                    variant="determinate"
                    value={100}
                    sx={{
                        mt: 1,
                        height: 6,
                        borderRadius: 999,
                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.16),
                        "& .MuiLinearProgress-bar": { bgcolor: "primary.main" },
                    }}
                />
            </Box>
        </Box>
    );
}

export default function AppUploadField({
    name,
    label,
    placeholder,
    hint,
    browseLabel,
    replaceLabel,
    disabled = false,
    multiple = false,
    accept,
    variant = "dropzone",
}: AppUploadFieldProps) {
    const { control } = useFormContext();
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);

    const uploadPlaceholder = placeholder || t("form.drop_file");
    const browseText = browseLabel || t("form.browse_files");
    const replaceText = replaceLabel || t("form.replace_file");

    return (
        <Box sx={{ width: "100%", minWidth: 0 }}>
            {label ? <Typography sx={formFieldLabelSx}>{label}</Typography> : null}

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                    const files = normalizeFiles(field.value);

                    const applyFiles = (selectedFiles: File[]) => {
                        if (!selectedFiles.length) return;
                        field.onChange(multiple ? [...files, ...selectedFiles] : selectedFiles[0] ?? null);
                    };

                    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
                        applyFiles(Array.from(event.target.files ?? []));
                        event.target.value = "";
                    };

                    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
                        event.preventDefault();
                        setDragging(false);
                        if (disabled) return;
                        applyFiles(Array.from(event.dataTransfer.files ?? []));
                    };

                    return (
                        <>
                            <Box
                                component="label"
                                onDragOver={(event) => {
                                    event.preventDefault();
                                    if (!disabled) setDragging(true);
                                }}
                                onDragLeave={() => setDragging(false)}
                                onDrop={handleDrop}
                                sx={{
                                    display: "flex",
                                    flexDirection: variant === "dropzone" ? "column" : "row",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: variant === "dropzone" ? 1.25 : 1,
                                    px: 2,
                                    py: variant === "dropzone" ? 4 : 1.5,
                                    borderRadius: "1rem",
                                    border: "1px dashed",
                                    borderColor: error ? "error.main" : dragging ? "primary.main" : "divider",
                                    bgcolor: dragging ? (theme) => alpha(theme.palette.primary.main, 0.06) : "surface.main",
                                    cursor: disabled ? "not-allowed" : "pointer",
                                    textAlign: "center",
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 48,
                                        height: 48,
                                        borderRadius: "50%",
                                        bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                                        color: "primary.main",
                                        display: "grid",
                                        placeItems: "center",
                                    }}
                                >
                                    <CloudUploadOutlined />
                                </Box>
                                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>
                                    {uploadPlaceholder}
                                </Typography>
                                {hint && (
                                    <Typography sx={{ fontSize: 12, color: "text.secondary", maxWidth: 420 }}>
                                        {hint}
                                    </Typography>
                                )}
                                <AppBtn
                                    customType="outline"
                                    type="button"
                                    disabled={disabled}
                                    startIcon={<FolderOpenOutlined sx={btnIconStartSx} />}
                                    onClick={(event) => {
                                        event.preventDefault();
                                        inputRef.current?.click();
                                    }}
                                    sx={{ borderRadius: 999, mt: 0.5 }}
                                >
                                    {browseText}
                                </AppBtn>
                                <Box
                                    component="input"
                                    ref={inputRef}
                                    type="file"
                                    multiple={multiple}
                                    accept={accept}
                                    disabled={disabled}
                                    onChange={handleFileChange}
                                    sx={{ display: "none" }}
                                />
                            </Box>

                            {files.length > 0 && (
                                <Box sx={{ mt: 2, display: "grid", gap: 1.5 }}>
                                    {files.map((file, index) => (
                                        <UploadFileRow
                                            key={`${file.name}-${file.size}-${index}`}
                                            file={file}
                                            replaceLabel={replaceText}
                                            onReplace={() => inputRef.current?.click()}
                                        />
                                    ))}
                                </Box>
                            )}

                            {error?.message ? (
                                <Typography variant="caption" sx={{ color: "error.main", mt: 0.5, display: "block" }}>
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
