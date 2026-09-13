import { formFieldLabelSx } from "@/components/form/formFieldLayout";
import { typography } from "@/styles/fontsLayout";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import InsertLinkIcon from "@mui/icons-material/InsertLink";
import { Box, Divider, IconButton, Tooltip, Typography } from "@mui/material";
import { useEffect, useRef, type ReactNode } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";

type ToolbarAction = {
    command: string;
    icon: ReactNode;
    label: string;
    dividerBefore?: boolean;
};

type BodyEditorSurfaceProps = {
    value: string;
    onChange: (value: string) => void;
    onBlur: () => void;
    errorMessage?: string;
};

function BodyEditorSurface({
    value,
    onChange,
    onBlur,
    errorMessage,
}: BodyEditorSurfaceProps) {
    const { t, i18n } = useTranslation();
    const editorRef = useRef<HTMLDivElement | null>(null);
    const dir = i18n.dir();

    useEffect(() => {
        if (!editorRef.current) return;
        if (document.activeElement === editorRef.current) return;
        if (editorRef.current.innerHTML !== (value || "")) {
            editorRef.current.innerHTML = value || "";
        }
    }, [value]);

    const actions: ToolbarAction[] = [
        { command: "bold", icon: <FormatBoldIcon fontSize="small" />, label: "Bold" },
        { command: "italic", icon: <FormatItalicIcon fontSize="small" />, label: "Italic" },
        { command: "underline", icon: <FormatUnderlinedIcon fontSize="small" />, label: "Underline" },
        {
            command: "insertUnorderedList",
            icon: <FormatListBulletedIcon fontSize="small" />,
            label: "Bullet list",
            dividerBefore: true,
        },
        {
            command: "insertOrderedList",
            icon: <FormatListNumberedIcon fontSize="small" />,
            label: "Numbered list",
        },
        {
            command: "justifyRight",
            icon: <FormatAlignRightIcon fontSize="small" />,
            label: "Align right",
            dividerBefore: true,
        },
        {
            command: "justifyCenter",
            icon: <FormatAlignCenterIcon fontSize="small" />,
            label: "Align center",
        },
        {
            command: "justifyLeft",
            icon: <FormatAlignLeftIcon fontSize="small" />,
            label: "Align left",
        },
        {
            command: "createLink",
            icon: <InsertLinkIcon fontSize="small" />,
            label: "Link",
            dividerBefore: true,
        },
    ];

    const syncValue = () => {
        if (editorRef.current) onChange(editorRef.current.innerHTML);
    };

    const runCommand = (command: string) => {
        editorRef.current?.focus();
        if (command === "createLink") {
            const url = window.prompt(t("form.richtext_link_prompt"));
            if (!url) return;
            document.execCommand(command, false, url);
            syncValue();
            return;
        }
        document.execCommand(command, false);
        syncValue();
    };

    return (
        <Box
            sx={{
                border: "1px solid",
                borderColor: errorMessage ? "error.main" : "divider",
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "white.main",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: 0.25,
                    px: 1,
                    py: 0.75,
                    bgcolor: "#F7F8FA",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                }}
            >
                {actions.map((action) => (
                    <Box key={action.command} sx={{ display: "flex", alignItems: "center" }}>
                        {action.dividerBefore && (
                            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, my: 0.5 }} />
                        )}
                        <Tooltip title={action.label}>
                            <IconButton
                                size="small"
                                onMouseDown={(event) => event.preventDefault()}
                                onClick={() => runCommand(action.command)}
                                sx={{ color: "text.secondary" }}
                            >
                                {action.icon}
                            </IconButton>
                        </Tooltip>
                    </Box>
                ))}
            </Box>

            <Box
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                dir={dir}
                onInput={syncValue}
                onBlur={onBlur}
                sx={{
                    ...typography.font14_14,
                    minHeight: 220,
                    p: 2,
                    outline: "none",
                    textAlign: dir === "rtl" ? "right" : "left",
                    lineHeight: 1.8,
                    "& p": { m: 0, mb: 1 },
                    "& a": { color: "primary.main" },
                }}
            />

            {errorMessage && (
                <Typography
                    variant="caption"
                    sx={{
                        color: "error.main",
                        display: "block",
                        px: 2,
                        pb: 1,
                        textAlign: dir === "rtl" ? "right" : "left",
                    }}
                >
                    {t(errorMessage)}
                </Typography>
            )}
        </Box>
    );
}

type AppRichTextFieldProps = {
    name: string;
    label: string;
};

export default function AppRichTextField({ name, label }: AppRichTextFieldProps) {
    const { control } = useFormContext();

    return (
        <Box>
            <Typography sx={{ ...formFieldLabelSx, fontWeight: 500 }}>{label}</Typography>

            <Controller
                name={name}
                control={control}
                render={({ field, fieldState: { error } }) => (
                    <BodyEditorSurface
                        value={field.value || ""}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        errorMessage={error?.message}
                    />
                )}
            />
        </Box>
    );
}
