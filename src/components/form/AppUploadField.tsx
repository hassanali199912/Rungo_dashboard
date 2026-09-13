import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import UploadOutlinedIcon from "@mui/icons-material/UploadOutlined";
import {
    Box,
    IconButton,
    LinearProgress,
    Typography,
} from "@mui/material";
import { useEffect, useState, type ChangeEvent } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formFieldLabelSx } from "./formFieldLayout";

interface AppUploadFieldProps {
    name: string;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    multiple?: boolean;
    accept?: string;
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

function UploadFileRow({
    file,
    onDelete,
}: {
    file: File;
    onDelete: () => void;
}) {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const isImage = file.type.startsWith("image/");
    const { i18n } = useTranslation();
    const dir = i18n.dir()

    useEffect(() => {
        if (!isImage) {
            setPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [file, isImage]);

    return (
        <Box
            sx={{
                width: "100%",
                minWidth: 0,
                overflow: "hidden",
                display: "flex",
                gap: "12px",
                alignItems: "center",
            }}
        >
            <IconButton
                onClick={onDelete}
                size="small"
                sx={{ color: "text.secondary", flexShrink: 0 }}
            >
                <DeleteOutlineIcon />
            </IconButton>

            <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                    sx={{
                        fontSize: "14px",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                    }}
                >
                    {file.name}
                </Typography>
                <Typography sx={{ fontSize: "12px", color: "text.secondary", mt: 0.5 }}>
                    {formatBytes(file.size)}
                </Typography>
                <LinearProgress
                    dir={dir}
                    variant="determinate"
                    value={15}
                    sx={{
                        width: "100%",
                        maxWidth: "100%",
                        mt: 1.25,
                        height: 6,
                        borderRadius: 999,
                        overflow: "hidden",
                        backgroundColor: "#F1D9CC",
                        "& .MuiLinearProgress-bar": {
                            backgroundColor: "primary.main",
                        },
                    }}
                />
            </Box>

            {previewUrl ? (
                <Box
                    component="img"
                    src={previewUrl}
                    alt={file.name}
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        objectFit: "cover",
                        flexShrink: 0,
                    }}
                />
            ) : (
                <Box
                    sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        backgroundColor: "#F7F7F7",
                        border: "1px solid",
                        borderColor: "divider",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <UploadOutlinedIcon sx={{ color: "text.secondary" }} />
                </Box>
            )}
        </Box>
    );
}

export default function AppUploadField({
    name,
    label,
    placeholder,
    disabled = false,
    multiple = false,
    accept,
}: AppUploadFieldProps) {
    const { control } = useFormContext();
    const { t } = useTranslation();

    const uploadPlaceholder = placeholder || "قم بإرفاق الملف";

    return (
        <Box sx={{ width: "100%", minWidth: 0 }}>
            <Typography sx={formFieldLabelSx}>{label}</Typography>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => {
                    const files = normalizeFiles(field.value);

                    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
                        const selectedFiles = Array.from(event.target.files ?? []);
                        if (!selectedFiles.length) return;

                        field.onChange(
                            multiple
                                ? [...files, ...selectedFiles]
                                : selectedFiles[0] ?? null
                        );
                        event.target.value = "";
                    };

                    const handleDelete = (index: number) => {
                        if (!multiple) {
                            field.onChange(null);
                            return;
                        }

                        const nextFiles = files.filter((_, fileIndex) => fileIndex !== index);
                        field.onChange(nextFiles.length ? nextFiles : null);
                    };

                    return (
                        <>
                            <Box
                                component="label"
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                    padding: "12px 16px",
                                    borderRadius: 2,
                                    border: "1px solid",
                                    borderColor: error ? "error.main" : "divider",
                                    backgroundColor: "#fff",
                                    cursor: disabled ? "not-allowed" : "pointer",
                                }}
                            >
                                <UploadOutlinedIcon sx={{ color: "text.secondary" }} />
                                <Typography sx={{ fontSize: "14px", color: "text.secondary" }}>
                                    {uploadPlaceholder}
                                </Typography>
                                <Box
                                    component="input"
                                    type="file"
                                    multiple={multiple}
                                    accept={accept}
                                    disabled={disabled}
                                    onChange={handleFileChange}
                                    sx={{ display: "none" }}
                                />
                            </Box>

                            {files.length > 0 ? (
                                <Box sx={{
                                    width: "100%",
                                    minWidth: 0,
                                    overflow: "hidden",
                                    mt: 2,
                                    display: "grid",
                                    gap: 1.5,
                                }}>
                                    {files.map((file, index) => (
                                        <UploadFileRow
                                            key={`${file.name}-${file.size}-${index}`}
                                            file={file}
                                            onDelete={() => handleDelete(index)}
                                        />
                                    ))}
                                </Box>
                            ) : null}

                            {error?.message ? (
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "error.main",
                                        mt: 0.5,
                                        display: "block",
                                    }}
                                >
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
