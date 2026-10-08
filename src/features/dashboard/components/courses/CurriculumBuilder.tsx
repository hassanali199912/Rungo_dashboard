import Add from "@mui/icons-material/Add";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import CloudUploadOutlined from "@mui/icons-material/CloudUploadOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import DragIndicator from "@mui/icons-material/DragIndicator";
import EditOutlined from "@mui/icons-material/EditOutlined";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FolderOpenOutlined from "@mui/icons-material/FolderOpenOutlined";
import PlayArrowOutlined from "@mui/icons-material/PlayArrowOutlined";
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, IconButton, MenuItem, Select, TextField, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";
import axios from "axios";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useFieldArray, useFormContext, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import AppBtn from "@/components/ui/AppBtn";
import { showErrorToast, showSuccessToast } from "@/components/ui/appToast";
import { fetchCourseLessonVideo } from "@/features/queryHooks/courses/useCourseOutline";
import { useAddChapter } from "@/features/queryHooks/courses/useAddChapter";
import { useAddLessonVideo } from "@/features/queryHooks/courses/useAddLessonVideo";
import { useAttachLesson } from "@/features/queryHooks/courses/useAttachLesson";
import { useSaveOutline } from "@/features/queryHooks/courses/useSaveOutline";
import { useDetachLesson } from "@/features/queryHooks/courses/useDetachLesson";
import { useUpdateChapter } from "@/features/queryHooks/courses/useUpdateChapter";
import { useUpdateLessonTitle } from "@/features/queryHooks/courses/useUpdateLessonTitle";
import { useShorts } from "@/features/queryHooks/shorts/useShorts";
import { formOutlinedSingleLineInputSx } from "@/components/form/formFieldLayout";
import type { AddCourseValues, CourseChapterValues, CourseLessonValues } from "@/schema";
import { btnIconStartSx } from "@/styles/btnStyle";
import LessonVideoPlayer, { LessonVideoDialog } from "./LessonVideoPlayer";
import StudioCard from "../StudioCard";

type LessonPoint = {
    chapterIndex: number;
    lessonIndex: number;
};

const MAX_LESSON_TITLE = 70;
const MAX_CHAPTER_TITLE = 120;
const MAX_LESSON_VIDEO_BYTES = 200 * 1024 * 1024;
const LESSON_VIDEO_TYPES = new Set(["video/mp4", "video/webm", "video/quicktime"]);

function isLessonVideo(file: File) {
    if (LESSON_VIDEO_TYPES.has(file.type)) return true;
    return /\.(mp4|mov|webm)$/i.test(file.name);
}

function axiosMessage(cause: unknown) {
    const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
    return typeof message === "string" ? message : undefined;
}

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
    canOpen,
    loading,
    onOpen,
}: {
    file?: File;
    label: string;
    canOpen?: boolean;
    loading?: boolean;
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
            disabled={(!url && !canOpen) || loading}
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
                cursor: url || canOpen ? "pointer" : "default",
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

function reorderChapters(chapters: CourseChapterValues[], from: LessonPoint, to: LessonPoint) {
    const next = chapters.map((chapter) => ({
        ...chapter,
        lessons: [...(chapter.lessons ?? [])],
    }));
    const source = next[from.chapterIndex];
    const destination = next[to.chapterIndex];
    if (!source || !destination) return null;

    if (from.chapterIndex === to.chapterIndex) {
        source.lessons = moveLesson(source.lessons, from.lessonIndex, to.lessonIndex);
        return next;
    }

    const [moved] = source.lessons.splice(from.lessonIndex, 1);
    if (!moved) return null;
    destination.lessons.splice(to.lessonIndex, 0, moved);
    return next;
}

function toOutlineOrder(chapters: CourseChapterValues[]) {
    return chapters.map((chapter) => ({
        id: chapter.id,
        shortIds: (chapter.lessons ?? []).flatMap((lesson) => (lesson.shortId ? [lesson.shortId] : [])),
    }));
}

export default function CurriculumBuilder({ courseId }: { courseId?: string }) {
    const { t } = useTranslation();
    const { control, getValues, setValue, formState } = useFormContext<AddCourseValues>();
    const { fields, append, remove } = useFieldArray({ control, name: "chapters", keyName: "_key" });
    const watchedChapters = useWatch({ control, name: "chapters" }) ?? [];
    const lessonTotal = watchedChapters.reduce((total, chapter) => total + (chapter.lessons?.length ?? 0), 0);
    const [dragLesson, setDragLesson] = useState<LessonPoint | null>(null);
    const [overLesson, setOverLesson] = useState<LessonPoint | null>(null);
    const [namingChapter, setNamingChapter] = useState(false);
    const [chapterTitle, setChapterTitle] = useState("");
    const addChapterRequest = useAddChapter();
    const addLessonRequest = useAddLessonVideo();
    const saveOutline = useSaveOutline();
    const detachLesson = useDetachLesson();

    const addChapter = async () => {
        const title = chapterTitle.trim();
        if (!title || !courseId || addChapterRequest.isPending) return;

        try {
            const created = await addChapterRequest.mutateAsync({ courseId, title });
            append({
                id: created.id,
                title: created.title || title,
                lessons: [],
            });
            setChapterTitle("");
            setNamingChapter(false);
            showSuccessToast(t("dashboard.courses.builder.chapter_added"));
        } catch (cause) {
            const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
            showErrorToast(
                t("dashboard.courses.builder.errors.chapter_failed"),
                typeof message === "string" ? message : undefined,
            );
        }
    };

    const addLesson = async (chapterIndex: number, lesson: CourseLessonValues) => {
        const current = getValues(`chapters.${chapterIndex}.lessons`) ?? [];
        const chapterId = getValues(`chapters.${chapterIndex}.id`);

        if (courseId && chapterId && lesson.video) {
            const title = lesson.title.trim().slice(0, MAX_LESSON_TITLE);
            const created = await addLessonRequest.mutateAsync({
                courseId,
                chapterId,
                title,
                video: lesson.video,
            });
            setValue(
                `chapters.${chapterIndex}.lessons`,
                [
                    ...current,
                    {
                        id: created.id || created.shortId,
                        shortId: created.shortId,
                        title: created.title || title,
                        duration: lesson.duration,
                        access: lesson.access,
                        videoUrl: created.videoUrl,
                        video: lesson.video,
                    },
                ],
                { shouldValidate: true, shouldDirty: true },
            );
            return;
        }

        setValue(`chapters.${chapterIndex}.lessons`, [...current, lesson], { shouldValidate: true, shouldDirty: true });
    };

    const removeLesson = async (chapterIndex: number, lessonIndex: number) => {
        const current = getValues(`chapters.${chapterIndex}.lessons`) ?? [];
        const lesson = current[lessonIndex];
        const chapterId = getValues(`chapters.${chapterIndex}.id`);
        if (!lesson || detachLesson.isPending) return;

        if (courseId && chapterId && lesson.shortId) {
            try {
                await detachLesson.mutateAsync({
                    courseId,
                    chapterId,
                    shortId: lesson.shortId,
                });
                showSuccessToast(t("dashboard.courses.builder.detached"));
            } catch (cause) {
                const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
                showErrorToast(
                    t("dashboard.courses.builder.errors.detach_failed"),
                    typeof message === "string" ? message : undefined,
                );
                return;
            }
        }

        const latest = getValues(`chapters.${chapterIndex}.lessons`) ?? [];
        setValue(
            `chapters.${chapterIndex}.lessons`,
            latest.filter((item) => (lesson.shortId ? item.shortId !== lesson.shortId : item.id !== lesson.id)),
            { shouldValidate: true, shouldDirty: true },
        );
    };

    const reorderLesson = async (from: LessonPoint, to: LessonPoint) => {
        if (from.chapterIndex === to.chapterIndex && from.lessonIndex === to.lessonIndex) return;
        if (saveOutline.isPending) return;

        const current = getValues("chapters") ?? [];
        const next = reorderChapters(current, from, to);
        if (!next) return;

        setValue("chapters", next, { shouldDirty: true, shouldValidate: true });
        if (!courseId) return;

        const lessonCount = next.reduce((total, chapter) => total + (chapter.lessons?.length ?? 0), 0);
        const chapters = toOutlineOrder(next);
        const shortCount = chapters.reduce((total, chapter) => total + chapter.shortIds.length, 0);
        if (lessonCount !== shortCount) {
            setValue("chapters", current, { shouldDirty: true, shouldValidate: true });
            showErrorToast(t("dashboard.courses.builder.errors.outline_failed"));
            return;
        }

        try {
            await saveOutline.mutateAsync({ courseId, chapters });
            showSuccessToast(t("dashboard.courses.builder.outline_saved"));
        } catch (cause) {
            setValue("chapters", current, { shouldDirty: true, shouldValidate: true });
            const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
            showErrorToast(
                t("dashboard.courses.builder.errors.outline_failed"),
                typeof message === "string" ? message : undefined,
            );
        }
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
                            if (dragLesson) void reorderLesson(dragLesson, to);
                            clearDrag();
                        }}
                        onDragEnd={clearDrag}
                        onRemoveChapter={() => {
                            if (fields.length <= 1) return;
                            remove(chapterIndex);
                        }}
                        onRemoveLesson={(lessonIndex) => void removeLesson(chapterIndex, lessonIndex)}
                        removingLesson={detachLesson.isPending}
                        courseId={courseId}
                        addingLesson={addLessonRequest.isPending}
                        onAddLesson={async (lesson) => {
                            await addLesson(chapterIndex, lesson);
                            showSuccessToast(t("dashboard.courses.builder.lesson_added"));
                        }}
                        onAttachLesson={(lesson) => {
                            const current = getValues(`chapters.${chapterIndex}.lessons`) ?? [];
                            setValue(`chapters.${chapterIndex}.lessons`, [...current, lesson], {
                                shouldValidate: true,
                                shouldDirty: true,
                            });
                        }}
                    />
                ))}

                {namingChapter ? (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
                        <TextField
                            value={chapterTitle}
                            onChange={(event) => setChapterTitle(event.target.value)}
                            placeholder={t("dashboard.courses.builder.chapter_name_placeholder")}
                            label={t("dashboard.courses.builder.chapter_name")}
                            sx={{ ...formOutlinedSingleLineInputSx, minWidth: 220, flex: 1 }}
                        />
                        <AppBtn
                            customType="primary"
                            type="button"
                            disabled={!chapterTitle.trim() || addChapterRequest.isPending}
                            onClick={() => void addChapter()}
                            sx={{ borderRadius: 999 }}
                        >
                            {t("dashboard.courses.builder.add_chapter")}
                        </AppBtn>
                        <AppBtn
                            customType="outline"
                            type="button"
                            disabled={addChapterRequest.isPending}
                            onClick={() => {
                                setNamingChapter(false);
                                setChapterTitle("");
                            }}
                            sx={{ borderRadius: 999 }}
                        >
                            {t("dashboard.courses.builder.cancel")}
                        </AppBtn>
                    </Box>
                ) : (
                    <AppBtn
                        customType="outline"
                        type="button"
                        startIcon={<Add sx={btnIconStartSx} />}
                        onClick={() => setNamingChapter(true)}
                        sx={{ borderRadius: 999, alignSelf: "flex-start" }}
                    >
                        {t("dashboard.courses.builder.add_new_chapter")}
                    </AppBtn>
                )}

                {formState.errors.chapters?.root?.message || formState.errors.chapters?.message ? (
                    <Typography sx={{ color: "error.main", fontSize: 13 }}>
                        {t(formState.errors.chapters.root?.message || formState.errors.chapters.message || "")}
                    </Typography>
                ) : null}

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
    removingLesson = false,
    courseId,
    addingLesson = false,
    onAddLesson,
    onAttachLesson,
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
    removingLesson?: boolean;
    courseId?: string;
    addingLesson?: boolean;
    onAddLesson: (lesson: CourseLessonValues) => Promise<void>;
    onAttachLesson: (lesson: CourseLessonValues) => void;
}) {
    const { t } = useTranslation();
    const { setValue } = useFormContext<AddCourseValues>();
    const lessons = useWatch({ name: `chapters.${chapterIndex}.lessons` }) as CourseLessonValues[] | undefined;
    const chapterTitle = (useWatch({ name: `chapters.${chapterIndex}.title` }) as string | undefined) ?? "";
    const chapterId = useWatch({ name: `chapters.${chapterIndex}.id` }) as string | undefined;
    const items = lessons ?? [];
    const updateChapter = useUpdateChapter();
    const updateLessonTitle = useUpdateLessonTitle();
    const [preview, setPreview] = useState<{ file: File; title: string } | null>(null);
    const [loadingLessonId, setLoadingLessonId] = useState<string | null>(null);
    const [editingChapter, setEditingChapter] = useState(false);
    const [chapterDraft, setChapterDraft] = useState("");
    const [editingLesson, setEditingLesson] = useState<number | null>(null);
    const [lessonDraft, setLessonDraft] = useState("");

    const saveChapterTitle = async () => {
        const next = chapterDraft.trim();
        if (!next || updateChapter.isPending) return;
        if (next.length > MAX_CHAPTER_TITLE) {
            showErrorToast(t("dashboard.courses.builder.errors.title_max"));
            return;
        }
        if (courseId && chapterId && next !== chapterTitle) {
            try {
                const updated = await updateChapter.mutateAsync({ courseId, chapterId, title: next });
                setValue(`chapters.${chapterIndex}.title`, updated.title || next, { shouldDirty: false, shouldValidate: true });
                showSuccessToast(t("dashboard.courses.builder.chapter_renamed"));
            } catch (cause) {
                showErrorToast(t("dashboard.courses.builder.errors.chapter_rename_failed"), axiosMessage(cause));
                return;
            }
        } else {
            setValue(`chapters.${chapterIndex}.title`, next, { shouldDirty: false, shouldValidate: true });
        }
        setEditingChapter(false);
    };

    const saveLessonTitle = async (lessonIndex: number) => {
        const lesson = items[lessonIndex];
        const next = lessonDraft.trim();
        if (!lesson || !next || updateLessonTitle.isPending) return;
        if (next.length > MAX_LESSON_TITLE) {
            showErrorToast(t("dashboard.courses.builder.errors.lesson_title_max"));
            return;
        }
        if (courseId && lesson.shortId && next !== lesson.title) {
            try {
                await updateLessonTitle.mutateAsync({ courseId, shortId: lesson.shortId, title: next });
                showSuccessToast(t("dashboard.courses.builder.lesson_renamed"));
            } catch (cause) {
                showErrorToast(t("dashboard.courses.builder.errors.lesson_rename_failed"), axiosMessage(cause));
                return;
            }
        }
        setValue(`chapters.${chapterIndex}.lessons.${lessonIndex}.title`, next, { shouldDirty: false, shouldValidate: true });
        setEditingLesson(null);
    };

    const openLesson = async (lesson: CourseLessonValues) => {
        if (lesson.video instanceof File) {
            setPreview({ file: lesson.video, title: lesson.title });
            return;
        }
        if (!lesson.videoUrl) return;
        setLoadingLessonId(lesson.id);
        try {
            const file = await fetchCourseLessonVideo(lesson.videoUrl);
            setPreview({ file, title: lesson.title });
        } catch (cause) {
            const detail = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
            showErrorToast(t("dashboard.courses.builder.errors.video_failed"), typeof detail === "string" ? detail : undefined);
        } finally {
            setLoadingLessonId(null);
        }
    };

    return (
        <Accordion
            defaultExpanded={chapterIndex === 0}
            disableGutters
            elevation={0}
            sx={{
                borderRadius: "1rem",
                bgcolor: "surface.main",
                overflow: "hidden",
                "&:before": { display: "none" },
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
            <AccordionSummary
                component="div"
                expandIcon={<ExpandMore />}
                sx={{
                    px: 1.75,
                    "& .MuiAccordionSummary-content": { alignItems: "center", gap: 1, my: 1.25, minWidth: 0 },
                }}
            >
                {editingChapter ? (
                    <TextField
                        value={chapterDraft}
                        onChange={(event) => setChapterDraft(event.target.value)}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => {
                            event.stopPropagation();
                            if (event.key === "Enter") {
                                event.preventDefault();
                                void saveChapterTitle();
                            }
                            if (event.key === "Escape") setEditingChapter(false);
                        }}
                        slotProps={{ htmlInput: { maxLength: MAX_CHAPTER_TITLE } }}
                        sx={{ ...formOutlinedSingleLineInputSx, flex: 1, minWidth: 0 }}
                    />
                ) : (
                    <Typography sx={{ flex: 1, minWidth: 0, fontWeight: 800, fontSize: 15 }} noWrap>
                        {chapterTitle}
                    </Typography>
                )}
                <Typography sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap" }}>
                    {t("dashboard.courses.builder.chapter_meta", { count: items.length })}
                </Typography>
                {editingChapter ? (
                    <>
                        <IconButton
                            type="button"
                            aria-label={t("dashboard.courses.builder.save_name")}
                            disabled={!chapterDraft.trim() || updateChapter.isPending}
                            onClick={(event) => {
                                event.stopPropagation();
                                void saveChapterTitle();
                            }}
                            sx={{ color: "primary.main" }}
                        >
                            <CheckOutlined fontSize="small" />
                        </IconButton>
                        <IconButton
                            type="button"
                            aria-label={t("dashboard.courses.builder.cancel")}
                            disabled={updateChapter.isPending}
                            onClick={(event) => {
                                event.stopPropagation();
                                setEditingChapter(false);
                            }}
                            sx={{ color: "text.secondary" }}
                        >
                            <CloseOutlined fontSize="small" />
                        </IconButton>
                    </>
                ) : (
                    <IconButton
                        type="button"
                        aria-label={t("dashboard.courses.builder.edit_chapter")}
                        onClick={(event) => {
                            event.stopPropagation();
                            setChapterDraft(chapterTitle);
                            setEditingChapter(true);
                        }}
                        sx={{ color: "text.secondary" }}
                    >
                        <EditOutlined fontSize="small" />
                    </IconButton>
                )}
                {canRemove ? (
                    <IconButton
                        type="button"
                        aria-label={t("dashboard.courses.builder.remove_chapter")}
                        onClick={(event) => {
                            event.stopPropagation();
                            onRemoveChapter();
                        }}
                        sx={{ color: "text.secondary" }}
                    >
                        <DeleteOutlined fontSize="small" />
                    </IconButton>
                ) : null}
            </AccordionSummary>
            <AccordionDetails sx={{ px: 1.75, pt: 0, pb: 1.75 }}>

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
                            <Box sx={{ position: "relative" }}>
                                <LessonVideoThumb
                                    file={lesson.video}
                                    canOpen={Boolean(lesson.videoUrl)}
                                    loading={loadingLessonId === lesson.id}
                                    label={t("dashboard.courses.builder.preview_lesson")}
                                    onOpen={() => void openLesson(lesson)}
                                />
                                {loadingLessonId === lesson.id ? (
                                    <CircularProgress
                                        size={18}
                                        sx={{ position: "absolute", top: "50%", left: "50%", mt: "-9px", ml: "-9px" }}
                                    />
                                ) : null}
                            </Box>
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                                {editingLesson === lessonIndex ? (
                                    <TextField
                                        value={lessonDraft}
                                        onChange={(event) => setLessonDraft(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                void saveLessonTitle(lessonIndex);
                                            }
                                            if (event.key === "Escape") setEditingLesson(null);
                                        }}
                                        slotProps={{ htmlInput: { maxLength: MAX_LESSON_TITLE } }}
                                        sx={{ ...formOutlinedSingleLineInputSx, width: "100%" }}
                                    />
                                ) : (
                                    <Typography sx={{ fontWeight: 700, fontSize: 14 }} noWrap>
                                        {lesson.title}
                                    </Typography>
                                )}
                                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                    {t(`dashboard.courses.builder.access_${lesson.access}`)} · {lesson.duration}
                                </Typography>
                            </Box>
                            {editingLesson === lessonIndex ? (
                                <>
                                    <IconButton
                                        type="button"
                                        aria-label={t("dashboard.courses.builder.save_name")}
                                        disabled={!lessonDraft.trim() || updateLessonTitle.isPending}
                                        onClick={() => void saveLessonTitle(lessonIndex)}
                                        sx={{ color: "primary.main" }}
                                    >
                                        <CheckOutlined fontSize="small" />
                                    </IconButton>
                                    <IconButton
                                        type="button"
                                        aria-label={t("dashboard.courses.builder.cancel")}
                                        disabled={updateLessonTitle.isPending}
                                        onClick={() => setEditingLesson(null)}
                                        sx={{ color: "text.secondary" }}
                                    >
                                        <CloseOutlined fontSize="small" />
                                    </IconButton>
                                </>
                            ) : (
                                <IconButton
                                    type="button"
                                    aria-label={t("dashboard.courses.builder.edit_lesson")}
                                    onClick={() => {
                                        setLessonDraft(lesson.title);
                                        setEditingLesson(lessonIndex);
                                    }}
                                    sx={{ color: "text.secondary" }}
                                >
                                    <EditOutlined fontSize="small" />
                                </IconButton>
                            )}
                            <IconButton
                                aria-label={t("dashboard.courses.builder.remove_lesson")}
                                disabled={removingLesson}
                                onClick={() => onRemoveLesson(lessonIndex)}
                                sx={{ color: "text.secondary" }}
                            >
                                <DeleteOutlined fontSize="small" />
                            </IconButton>
                        </Box>
                    );
                })}
            </Box>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, my: 2.5 }}>
                <LessonComposer pending={addingLesson} onAdd={onAddLesson} />
                {courseId ? (
                    <AttachFeedShort
                        courseId={courseId}
                        chapterIndex={chapterIndex}
                        onAttached={onAttachLesson}
                    />
                ) : null}
            </Box>
            <LessonVideoDialog
                file={preview?.file ?? null}
                title={preview?.title}
                onClose={() => setPreview(null)}
            />
            </AccordionDetails>
        </Accordion>
    );
}

function LessonComposer({
    onAdd,
    pending = false,
}: {
    onAdd: (lesson: CourseLessonValues) => Promise<void>;
    pending?: boolean;
}) {
    const { t } = useTranslation();
    const inputRef = useRef<HTMLInputElement>(null);
    const [dragging, setDragging] = useState(false);
    const [title, setTitle] = useState("");
    const [video, setVideo] = useState<File | null>(null);

    const applyFile = (file?: File) => {
        if (!file) return;
        if (!isLessonVideo(file)) {
            showErrorToast(t("dashboard.courses.builder.errors.lesson_video_type"));
            return;
        }
        if (file.size > MAX_LESSON_VIDEO_BYTES) {
            showErrorToast(t("dashboard.courses.builder.errors.lesson_video_size"));
            return;
        }
        setVideo(file);
        if (!title.trim()) setTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ").slice(0, MAX_LESSON_TITLE));
    };

    const handleDrop = (event: DragEvent<HTMLLabelElement>) => {
        event.preventDefault();
        setDragging(false);
        applyFile(event.dataTransfer.files?.[0]);
    };

    const handleAdd = async () => {
        const nextTitle = title.trim();
        if (!nextTitle || !video || pending) return;
        if (nextTitle.length > MAX_LESSON_TITLE) {
            showErrorToast(t("dashboard.courses.builder.errors.lesson_title_max"));
            return;
        }
        const duration = await readVideoDuration(video);
        try {
            await onAdd({
                id: createId(),
                title: nextTitle,
                duration,
                access: "coins",
                video,
            });
            setTitle("");
            setVideo(null);
        } catch (cause) {
            const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
            showErrorToast(
                t("dashboard.courses.builder.errors.lesson_failed"),
                typeof message === "string" ? message : undefined,
            );
        }
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
                    gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
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
                        slotProps={{ htmlInput: { maxLength: MAX_LESSON_TITLE } }}
                        sx={{ ...formOutlinedSingleLineInputSx, "& .MuiInputBase-root": { minHeight: 48 } }}
                    />
                </Box>
                <AppBtn
                    customType="primary"
                    type="button"
                    disabled={!title.trim() || !video || pending}
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

function AttachFeedShort({
    courseId,
    chapterIndex,
    onAttached,
}: {
    courseId: string;
    chapterIndex: number;
    onAttached: (lesson: CourseLessonValues) => void;
}) {
    const { t } = useTranslation();
    const chapters = useWatch<AddCourseValues, "chapters">({ name: "chapters" }) ?? [];
    const shortsQuery = useShorts({ page: 1, limit: 50 });
    const attachLesson = useAttachLesson();
    const [shortId, setShortId] = useState("");
    const shorts = shortsQuery.data?.items ?? [];
    const chapterId = chapters[chapterIndex]?.id;

    const handleAttach = async () => {
        if (!chapterId || !shortId || attachLesson.isPending) return;
        const selected = shorts.find((item) => item.id === shortId);
        try {
            const created = await attachLesson.mutateAsync({ courseId, chapterId, shortId });
            const lessonShortId = created.shortId || shortId;
            onAttached({
                id: created.id || lessonShortId,
                shortId: lessonShortId,
                title: created.title || selected?.title || t("dashboard.courses.builder.untitled_lesson"),
                duration: "—",
                access: "coins",
                videoUrl: created.videoUrl || `/courses/${courseId}/shorts/${lessonShortId}/video`,
            });
            setShortId("");
            showSuccessToast(t("dashboard.courses.builder.attached"));
        } catch (cause) {
            const message = axios.isAxiosError(cause) ? cause.response?.data?.message : undefined;
            showErrorToast(
                t("dashboard.courses.builder.errors.attach_failed"),
                typeof message === "string" ? message : undefined,
            );
        }
    };

    return (
        <Box
            sx={{
                borderRadius: "1rem",
                border: "1px dashed",
                borderColor: "divider",
                bgcolor: "surface.main",
                p: 2,
                display: "flex",
                flexDirection: "column",
                gap: 1.25,
            }}
        >
            <Typography sx={{ fontSize: 14, fontWeight: 700 }}>{t("dashboard.courses.builder.attach_title")}</Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", sm: "1fr auto" },
                    gap: 1.25,
                    alignItems: "end",
                }}
            >
                <Box>
                    <Typography sx={{ fontSize: 12, fontWeight: 700, mb: 0.75, color: "text.secondary" }}>
                        {t("dashboard.courses.builder.attach_placeholder")}
                    </Typography>
                    <Select
                        value={shortId}
                        displayEmpty
                        onChange={(event) => setShortId(event.target.value)}
                        disabled={shortsQuery.isPending || shorts.length === 0 || attachLesson.isPending}
                        sx={{ width: "100%", minHeight: 48, borderRadius: 999, bgcolor: "background.paper" }}
                    >
                        <MenuItem value="">{t("dashboard.courses.builder.attach_placeholder")}</MenuItem>
                        {shorts.map((short) => (
                            <MenuItem key={short.id} value={short.id}>
                                {short.title}
                            </MenuItem>
                        ))}
                    </Select>
                </Box>
                <AppBtn
                    customType="primary"
                    type="button"
                    disabled={!chapterId || !shortId || attachLesson.isPending}
                    onClick={() => void handleAttach()}
                    sx={{ borderRadius: 999, minHeight: 48 }}
                >
                    {t("dashboard.courses.builder.attach_action")}
                </AppBtn>
            </Box>
            {shortsQuery.isError ? (
                <Typography sx={{ color: "error.main", fontSize: 13 }}>
                    {t("dashboard.courses.builder.errors.attach_failed")}
                </Typography>
            ) : null}
            {!shortsQuery.isPending && !shortsQuery.isError && shorts.length === 0 ? (
                <Typography sx={{ color: "text.secondary", fontSize: 13 }}>
                    {t("dashboard.courses.builder.attach_empty")}
                </Typography>
            ) : null}
        </Box>
    );
}
