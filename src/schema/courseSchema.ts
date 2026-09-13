import { z } from "zod";

const MAX_COVER_BYTES = 8 * 1024 * 1024;

export const courseLessonSchema = z.object({
    id: z.string(),
    title: z.string().trim().min(1, "dashboard.courses.builder.errors.lesson_title"),
    duration: z.string(),
    access: z.enum(["free", "coins", "premium"]),
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
            .max(80, "dashboard.courses.builder.errors.title_max"),
        description: z.string().trim().min(1, "dashboard.courses.builder.errors.description"),
        tags: z.array(z.string()).min(1, "dashboard.courses.builder.errors.tags"),
        coinPrice: z.coerce.number().min(1, "dashboard.courses.builder.errors.price"),
        cover: z
            .custom<File>((value) => value instanceof File, { message: "dashboard.courses.builder.errors.cover" })
            .refine((file) => file.size <= MAX_COVER_BYTES, "dashboard.courses.builder.errors.cover_size")
            .refine((file) => file.type.startsWith("image/"), "dashboard.courses.builder.errors.cover_type")
            .optional(),
        chapters: z.array(courseChapterSchema).min(1, "dashboard.courses.builder.errors.chapters"),
    })
    .superRefine((data, ctx) => {
        const lessonCount = data.chapters.reduce((total, chapter) => total + chapter.lessons.length, 0);
        if (lessonCount < 1) {
            ctx.addIssue({
                code: "custom",
                path: ["chapters"],
                message: "dashboard.courses.builder.errors.lessons",
            });
        }
    });

export type AddCourseValues = z.infer<typeof addCourseSchema>;
export type CourseChapterValues = z.infer<typeof courseChapterSchema>;
export type CourseLessonValues = z.infer<typeof courseLessonSchema>;
