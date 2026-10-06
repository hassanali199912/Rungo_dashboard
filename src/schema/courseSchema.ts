import { z } from "zod";

const MAX_COVER_BYTES = 5 * 1024 * 1024;
const COVER_TYPES = ["image/jpeg", "image/png", "image/webp"];

const coverFileSchema = z
    .custom<File>((value) => value instanceof File, { message: "dashboard.courses.builder.errors.cover" })
    .refine((file) => file.size <= MAX_COVER_BYTES, "dashboard.courses.builder.errors.cover_size")
    .refine((file) => COVER_TYPES.includes(file.type), "dashboard.courses.builder.errors.cover_type");

export const courseLessonSchema = z.object({
    id: z.string(),
    shortId: z.string().optional(),
    title: z.string().trim().min(1, "dashboard.courses.builder.errors.lesson_title"),
    duration: z.string(),
    access: z.enum(["free", "coins", "premium"]),
    videoUrl: z.string().optional(),
    video: z.custom<File>((value) => value instanceof File).optional(),
});

export const courseChapterSchema = z.object({
    id: z.string(),
    title: z.string().trim().min(1, "dashboard.courses.builder.errors.chapter_title"),
    lessons: z.array(courseLessonSchema),
});

export const addCourseSchema = z
    .object({
        title: z
            .string()
            .trim()
            .min(1, "dashboard.courses.builder.errors.title")
            .max(120, "dashboard.courses.builder.errors.title_max"),
        description: z
            .string()
            .trim()
            .min(1, "dashboard.courses.builder.errors.description")
            .max(4000, "dashboard.courses.builder.errors.description_max"),
        tags: z.array(z.string()).max(20, "dashboard.courses.builder.errors.tags_max"),
        coinPrice: z.coerce.number().int("dashboard.courses.builder.errors.price").min(0, "dashboard.courses.builder.errors.price"),
        cover: coverFileSchema,
        chapters: z.array(courseChapterSchema),
    });

export const editCourseSchema = addCourseSchema.extend({
    cover: coverFileSchema.optional(),
});

export type AddCourseValues = z.infer<typeof addCourseSchema>;
export type CourseChapterValues = z.infer<typeof courseChapterSchema>;
export type CourseLessonValues = z.infer<typeof courseLessonSchema>;
