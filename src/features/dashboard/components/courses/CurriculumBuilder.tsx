import Add from "@mui/icons-material/Add";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import DragIndicator from "@mui/icons-material/DragIndicator";
import FolderOpenOutlined from "@mui/icons-material/FolderOpenOutlined";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import { Box, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { showSuccessToast } from "@/components/ui/appToast";
import { formOutlinedSingleLineInputSx } from "@/components/form/formFieldLayout";
import type { AddCourseValues, CourseLessonValues } from "@/schema";
import { btnIconStartSx } from "@/styles/btnStyle";
import LessonVideoPlayer, { LessonVideoDialog } from "./LessonVideoPlayer";
import StudioCard from "../StudioCard";

type LessonPoint = {
    chapterIndex: number;
    lessonIndex: number;
};

function createId() {
    return crypto.randomUUID();
}

function formatDuration(total: number) {
    if (!Number.isFinite(total) || total <= 0) return "0:00";
    const minutes = Math.floor(total / 60);
    const seconds = Math.round(total % 60)
        .toString()
        .padStart(2, "0");
    return `${minutes}:${seconds}`;
}

function readVideoDuration(file: File): Promise<string> {
    return new Promise((resolve) => {
        if (!file.type.startsWith("video/")) {
            resolve("0:00");
            return;
        }
        const url = URL.createObjectURL(file);
        const video = document.createElement("video");
        const finish = (value: string) => {
            window.clearTimeout(timer);
            video.onloadedmetadata = null;
            video.onerror = null;
            URL.revokeObjectURL(url);
            resolve(value);
        };
        const timer = window.setTimeout(() => finish("0:00"), 2500);
        video.preload = "metadata";
        video.onloadedmetadata = () => finish(formatDuration(video.duration));
        video.onerror = () => finish("0:00");
        video.src = url;
    });
}

function LessonVideoThumb({
    file,
    label,
    onOpen,
}: {
    file?: File;
    label: string;
    onOpen?: () => void;
}) {
    const url = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

    useEffect(() => {
        return () => {
            if (url) URL.revokeObjectURL(url);
        };
    }, [url]);

    return (
        <Box
            component="button"
            type="button"
            aria-label={label}
            disabled={!url}
            onClick={(event) => {
                event.stopPropagation();
                onOpen?.();
            }}
            sx={{
                position: "relative",
                width: 52,
                aspectRatio: "9 / 16",
                border: 0,
                p: 0,
                borderRadius: 1.5,
                overflow: "hidden",
                flexShrink: 0,
                bgcolor: "secondary.main",
                color: "common.white",
                cursor: url ? "pointer" : "default",
            }}
        >
            {url ? (
                <Box
                    component="video"
                    src={url}
                    muted
                    playsInline
                    preload="metadata"
                    sx={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                />
            ) : (
                <Box sx={{ width: "100%", height: "100%", display: "grid", placeItems: "center" }}>
                    <PlayArrowOutlined sx={{ fontSize: 22 }} />
                </Box>
            )}
            {url ? (
                <Box
                    sx={{
                        position: "absolute",
                        inset: 0,
                        display: "grid",
                        placeItems: "center",
                        bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.22),
                    }}
                >
                    <Box
                        sx={{
                            width: 28,
                            height: 28,
                            borderRadius: "50%",
                            bgcolor: "background.paper",
                            color: "text.primary",
                            display: "grid",
                            placeItems: "center",
                        }}
                    >
                        <PlayArrowOutlined sx={{ fontSize: 18 }} />
                    </Box>
                </Box>
            ) : null}
        </Box>
    );
}

function moveLesson(list: CourseLessonValues[], fromIndex: number, toIndex: number) {
    const next = [...list];
    const [moved] = next.splice(fromIndex, 1);
    if (!moved) return list;
    next.splice(toIndex, 0, moved);
    return next;
}

export default function CurriculumBuilder() {
    const { t } = useTranslation();
    const { control, getValues, setValue, formState } = useFormContext<AddCourseValues>();
    const { fields, append, remove } = useFieldArray({ control, name: "chapters", keyName: "_key" });
    const watchedChapters = useWatch({ control, name: "chapters" }) ?? [];
    const lessonTotal = watchedChapters.reduce((total, chapter) => total + (chapter.lessons?.length ?? 0), 0);
    const [targetChapter, setTargetChapter] = useState(0);
    const [dragLesson, setDragLesson] = useState<LessonPoint | null>(null);
    const [overLesson, setOverLesson] = useState<LessonPoint | null>(null);

    const addChapter = () => {
        append({
            id: createId(),
            title: t("dashboard.courses.builder.untitled_chapter", { number: fields.length + 1 }),
            lessons: [],
        });
        setTargetChapter(fields.length);
    };

    const addLesson = async (chapterIndex: number, lesson: CourseLessonValues) => {
        const current = getValues(`chapters.${chapterIndex}.lessons`) ?? [];
        setValue(`chapters.${chapterIndex}.lessons`, [...current, lesson], { shouldValidate: true, shouldDirty: true });
    };

    const removeLesson = (chapterIndex: number, lessonIndex: number) => {
        const current = getValues(`chapters.${chapterIndex}.lessons`) ?? [];
        setValue(
            `chapters.${chapterIndex}.lessons`,
            current.filter((_, index) => index !== lessonIndex),
            { shouldValidate: true, shouldDirty: true },
        );
    };

    const reorderLesson = (from: LessonPoint, to: LessonPoint) => {
        if (from.chapterIndex === to.chapterIndex && from.lessonIndex === to.lessonIndex) return;

        if (from.chapterIndex === to.chapterIndex) {
            const current = getValues(`chapters.${from.chapterIndex}.lessons`) ?? [];
            setValue(`chapters.${from.chapterIndex}.lessons`, moveLesson(current, from.lessonIndex, to.lessonIndex), {
                shouldDirty: true,
                shouldValidate: true,
            });
            return;
        }

        const source = [...(getValues(`chapters.${from.chapterIndex}.lessons`) ?? [])];
        const [moved] = source.splice(from.lessonIndex, 1);
        if (!moved) return;
        const destination = [...(getValues(`chapters.${to.chapterIndex}.lessons`) ?? [])];
        destination.splice(to.lessonIndex, 0, moved);
        setValue(`chapters.${from.chapterIndex}.lessons`, source, { shouldDirty: true, shouldValidate: true });
        setValue(`chapters.${to.chapterIndex}.lessons`, destination, { shouldDirty: true, shouldValidate: true });
    };

    const clearDrag = () => {
        setDragLesson(null);
        setOverLesson(null);
    };

    return (
        <StudioCard
            title={t("dashboard.courses.builder.curriculum_title")}
            subtitle={t("dashboard.courses.builder.curriculum_subtitle", {
                chapters: fields.length,
                lessons: lessonTotal,
            })}
        >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {fields.map((chapter, chapterIndex) => (
                    <ChapterBlock
                        key={chapter._key}
                        chapterIndex={chapterIndex}
                        canRemove={fields.length > 1}
                        dragLesson={dragLesson}
                        overLesson={overLesson}
                        onDragLessonStart={setDragLesson}
                        onDragLessonOver={setOverLesson}
                        onDropLesson={(to) => {
                            if (dragLesson) reorderLesson(dragLesson, to);
                            clearDrag();
                        }}
                        onDragEnd={clearDrag}
                        onRemoveChapter={() => {
                            if (fields.length <= 1) return;
                            remove(chapterIndex);
                            setTargetChapter((current) => Math.max(0, Math.min(current, fields.length - 2)));
                        }}
                        onRemoveLesson={(lessonIndex) => removeLesson(chapterIndex, lessonIndex)}
                    />
                ))}

                <AppBtn customType="outline" type="button" startIcon={<Add sx={btnIconStartSx} />} onClick={addChapter} sx={{ borderRadius: 999, alignSelf: "flex-start" }}>
                    {t("dashboard.courses.builder.add_new_chapter")}
                </AppBtn>

                {formState.errors.chapters?.root?.message || formState.errors.chapters?.message ? (
                    <Typography sx={{ color: "error.main", fontSize: 13 }}>
                        {t(formState.errors.chapters.root?.message || formState.errors.chapters.message || "")}
                    </Typography>
                ) : null}

                <Box>
                    <LessonComposer
                        chapterCount={fields.length}
                        targetChapter={Math.min(targetChapter, Math.max(fields.length - 1, 0))}
                        onTargetChapterChange={setTargetChapter}
                        onAdd={async (lesson) => {
                            const index = Math.min(targetChapter, Math.max(fields.length - 1, 0));
                            await addLesson(index, lesson);
                            showSuccessToast(t("dashboard.courses.builder.lesson_added"));
                        }}
                    />
                </Box>
            </Box>
        </StudioCard>
    );
}

function ChapterBlock({
    chapterIndex,
    canRemove,
    dragLesson,
    overLesson,
    onDragLessonStart,
    onDragLessonOver,
    onDropLesson,
    onDragEnd,
    onRemoveChapter,
    onRemoveLesson,
}: {
    chapterIndex: number;
    canRemove: boolean;
    dragLesson: LessonPoint | null;
    overLesson: LessonPoint | null;
    onDragLessonStart: (point: LessonPoint) => void;
    onDragLessonOver: (point: LessonPoint) => void;
    onDropLesson: (point: LessonPoint) => void;
    onDragEnd: () => void;
    onRemoveChapter: () => void;
    onRemoveLesson: (lessonIndex: number) => void;
}) {
    const { t } = useTranslation();
    const { register } = useFormContext<AddCourseValues>();
    const lessons = useWatch({ name: `chapters.${chapterIndex}.lessons` }) as CourseLessonValues[] | undefined;
    const items = lessons ?? [];
    const [preview, setPreview] = useState<{ file: File; title: string } | null>(null);

    return (
        <Box
            sx={{
                borderRadius: "1rem",
                bgcolor: "surface.main",
                p: 1.75,
            }}
            onDragOver={(event) => {
                if (!items.length) event.preventDefault();
            }}
            onDrop={(event) => {
                if (!items.length) {
                    event.preventDefault();
                    onDropLesson({ chapterIndex, lessonIndex: 0 });
                }
            }}
        >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: items.length ? 1.5 : 0 }}>
                <TextField
                    {...register(`chapters.${chapterIndex}.title`)}
                    variant="standard"
                    slotProps={{ input: { disableUnderline: true } }}
                    sx={{
                        flex: 1,
                        "& .MuiInputBase-input": { fontWeight: 800, fontSize: 15, py: 0.5 },
                    }}
                />
                <Typography sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>
                    {t("dashboard.courses.builder.chapter_meta", { count: items.length })}
                </Typography>
                {canRemove ? (
                    <IconButton aria-label={t("dashboard.courses.builder.remove_chapter")} onClick={onRemoveChapter} sx={{ color: "text.secondary" }}>
                        <DeleteOutlined fontSize="small" />
                    </IconButton>
                ) : null}
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                {items.map((lesson, lessonIndex) => {
                    const isDragging =
                        dragLesson?.chapterIndex === chapterIndex && dragLesson.lessonIndex === lessonIndex;
                    const isOver = overLesson?.chapterIndex === chapterIndex && overLesson.lessonIndex === lessonIndex && !isDragging;

                    return (
                        <Box
                            key={lesson.id || `${chapterIndex}-${lessonIndex}`}
                            onDragOver={(event) => {
                                event.preventDefault();
                                event.dataTransfer.dropEffect = "move";
                                onDragLessonOver({ chapterIndex, lessonIndex });
                            }}
                            onDrop={(event) => {
                                event.preventDefault();
                                event.stopPropagation();
                                onDropLesson({ chapterIndex, lessonIndex });
                            }}
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1.25,
                                bgcolor: "background.paper",
                                borderRadius: "1rem",
                                p: 1,
                                opacity: isDragging ? 0.45 : 1,
                                outline: isOver ? "2px solid" : "2px solid transparent",
                                outlineColor: isOver ? "primary.main" : "transparent",
                            }}
                        >
                            <Box
                                component="button"
                                type="button"
                                draggable
                                aria-label={t("dashboard.courses.builder.reorder_lesson")}
                                onDragStart={(event: DragEvent<HTMLButtonElement>) => {
                                    event.dataTransfer.effectAllowed = "move";
                                    event.dataTransfer.setData("text/plain", lesson.id);
                                    onDragLessonStart({ chapterIndex, lessonIndex });
                                }}
                                onDragEnd={onDragEnd}
                                sx={{
                                    border: 0,
                                    bgcolor: "transparent",
                                    color: "text.secondary",
                                    cursor: "grab",
                                    display: "grid",
                                    placeItems: "center",
                                    p: 0.25,
                                    borderRadius: 1,
                                    "&:active": { cursor: "grabbing" },
                                }}
                            >
                                <DragIndicator sx={{ fontSize: 20 }} />
                            </Box>
                            <LessonVideoThumb
                                file={lesson.video}
                                label={t("dashboard.courses.builder.preview_lesson")}
                                onOpen={lesson.video ? () => setPreview({ file: lesson.video as File, title: lesson.title }) : undefined}
                            />
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                <TextField
                                    {...register(`chapters.${chapterIndex}.lessons.${lessonIndex}.title`)}
                                    variant="standard"
                                    slotProps={{ input: { disableUnderline: true } }}
                                    sx={{
                                        width: "100%",
                                        "& .MuiInputBase-input": { fontWeight: 700, fontSize: 14, py: 0.25 },
                                    }}
                                />
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                    {t(`dashboard.courses.builder.access_${lesson.access}`)} · {lesson.duration}
                                </Typography>
                            </Box>
                            <IconButton
                                aria-label={t("dashboard.courses.builder.remove_lesson")}
                                onClick={() => onRemoveLesson(lessonIndex)}
                                sx={{ color: "text.secondary" }}
                            >
                                <DeleteOutlined fontSize="small" />
                            </IconButton>
                        </Box>
                    );
                })}
            </Box>
            <LessonVideoDialog
                file={preview?.file ?? null}
                title={preview?.title}
                onClose={() => setPreview(null)}
            />
        </Box>
    );
}

function LessonComposer({
    chapterCount,
    targetChapter,
    onTargetChapterChange,
    onAdd,
}: {
    chapterCount: number;
    targetChapter: number;
    onTargetChapterChange: (index: number) => void;
    onAdd: (lesson: CourseLessonValues) => Promise<void>;
}) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState<File | null>(null);

    const applyFile = (file?: File) => {
        if (!file) return;
        setVideo(file);
        if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragging(false);
        applyFile(event.dataTransfer.files?.[0]);
    };

    const handleAdd = async () => {
        if (!title.trim() || !video) return;
        const duration = await readVideoDuration(video);
        await onAdd({
            id: createId(),
            title: title.trim(),
            duration,
            access: "coins",
            video,
        });
        setTitle("");
        setVideo(null);
    };

    return (
        <Box
            sx={{
                borderRadius: "1rem",
                border: "1px dashed",
                borderColor: dragging ? "primary.main" : "divider",
                bgcolor: dragging ? (theme) => alpha(theme.palette.primary.main, 0.06) : "surface.main",
                p: 2,
            }}
        >
            {video ? (
                <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                    <Box>
                        <Typography sx={{ fontSize: 12, fontWeight: 700, color: "text.secondary", mb: 1, textAlign: "center" }}>
                            {t("dashboard.courses.builder.watch_video")}
                        </Typography>
                        <LessonVideoPlayer file={video} title={title || video.name} />
                    </Box>
                </Box>
            ) : null}

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 2 }}>
                <Box
                    component="label"
                    onDragOver={(event) => {
                        event.preventDefault();
                        setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    sx={{
                        display: "flex",
                        flex: 1,
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: "center",
                        gap: 1.5,
                        cursor: "pointer",
                        minWidth: 0,
                    }}
                >
                    {video ? null : (
                    <Box
                        sx={{
                            width: 48,
                            height: 48,
                            borderRadius: "50%",
                            bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                            color: "primary.main",
                            display: "grid",
                            placeItems: "center",
                            flexShrink: 0,
                        }}
                    >
                        <CloudUploadOutlined />
                    </Box>
                    )}
                <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", sm: "start" } }}>
                    <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
                        {video ? video.name : t("dashboard.courses.builder.drop_title")}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                        {t("dashboard.courses.builder.drop_hint")}
                    </Typography>
                </Box>
                <AppBtn
                    customType="outline"
                    type="button"
                    startIcon={<FolderOpenOutlined sx={btnIconStartSx} />}
                    onClick={(event) => {
                        event.preventDefault();
                        inputRef.current?.click();
                    }}
                    sx={{ borderRadius: 999 }}
                >
                    {t("dashboard.courses.builder.browse")}
                </AppBtn>
                <Box
                    component="input"
                    ref={inputRef}
                    type="file"
                    accept="video/mp4,video/quicktime,video/webm,.mp4,.mov,.webm"
                    onChange={(event: ChangeEvent<HTMLInputElement>) => {
                        applyFile(event.target.files?.[0]);
                        event.target.value = "";
                    }}
                    sx={{ display: "none" }}
                />
                </Box>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 140px auto" },
                    gap: 1.25,
                    alignItems: "end",
                }}
            >
                <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.75, color: "text.secondary" }}>
                        {t("dashboard.courses.builder.lesson_title")}
                    </Typography>
                    <TextField
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                        placeholder={t("dashboard.courses.builder.lesson_title_placeholder")}
                        sx={{ ...formOutlinedSingleLineInputSx, "& .MuiInputBase-root": { minHeight: 48 } }}
                    />
                </Box>
                <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.75, color: "text.secondary" }}>
                        {t("dashboard.courses.builder.target_chapter")}
                    </Typography>
                    <Select
                        value={String(targetChapter)}
                        onChange={(event) => onTargetChapterChange(Number(event.target.value))}
                        disabled={chapterCount === 0}
                        sx={{
                            width: "100%",
                            minHeight: 48,
                            borderRadius: 999,
                            bgcolor: "background.paper",
                        }}
                    >
                        {Array.from({ length: chapterCount }).map((_, index) => (
                            <MenuItem key={index} value={String(index)}>
                                {t("dashboard.courses.builder.chapter_option", { number: index + 1 })}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <AppBtn
                    customType="primary"
                    type="button"
                    disabled={!title.trim() || !video || chapterCount === 0}
                    startIcon={<Add sx={btnIconStartSx} />}
                    onClick={handleAdd}
                    sx={{ borderRadius: 999, minHeight: 48 }}
                >
                    {t("dashboard.courses.builder.add_it")}
                </AppBtn>
            </Box>
        </Box>
    );
}
