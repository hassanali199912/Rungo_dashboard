import { z } from "zod";

const MAX_VIDEO_BYTES = 200 * 1024 * 1024;

const shortVideoSchema = z
    .custom<File>((value) => value instanceof File, { message: "dashboard.shorts.publisher.errors.video" })
    .refine((file) => file.size <= MAX_VIDEO_BYTES, "dashboard.shorts.publisher.errors.video_size")
    .refine(
        (file) => file.type.startsWith("video/") || /\.(mp4|mov|webm)$/i.test(file.name),
        "dashboard.shorts.publisher.errors.video_type",
    );

const shortFields = {
    title: z.string().trim().min(1, "dashboard.shorts.publisher.errors.title").max(70, "dashboard.shorts.publisher.errors.title_max"),
    summary: z.string().trim().min(1, "dashboard.shorts.publisher.errors.summary"),
    tags: z.array(z.string()).min(1, "dashboard.shorts.publisher.errors.tags"),
    posters: z.array(z.custom<File>((value) => value instanceof File)).optional(),
};

export const addShortSchema = z.object({
    ...shortFields,
    video: shortVideoSchema,
});

export const updateShortSchema = z.object({
    ...shortFields,
    video: shortVideoSchema.optional(),
});

export type AddShortValues = z.infer<typeof addShortSchema>;
export type UpdateShortValues = z.infer<typeof updateShortSchema>;
