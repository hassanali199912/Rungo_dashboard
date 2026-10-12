import { z } from "zod";

const optionalUrl = z
    .string()
    .trim()
    .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
        message: "auth.errors.portfolio_invalid",
    });

const MAX_AVATAR_BYTES = 5 * 1024 * 1024;
const AVATAR_TYPES = ["image/jpeg", "image/png", "image/webp"];

const avatarSchema = z
    .union([
        z
            .custom<File>((value) => value instanceof File)
            .refine((file) => file.size <= MAX_AVATAR_BYTES, "dashboard.settings.errors.avatar_size")
            .refine((file) => AVATAR_TYPES.includes(file.type), "dashboard.settings.errors.avatar_type"),
        z.string(),
    ])
    .optional();

export const profileSettingsSchema = z.object({
    avatar: avatarSchema,
    name: z
        .string()
        .trim()
        .min(1, "auth.errors.name_required")
        .max(100, "dashboard.settings.errors.name_max"),
    email: z.string().trim().min(1, "auth.errors.email_required").email("auth.errors.email_invalid"),
    expertise: z.string(),
    bio: z.string().trim().max(1000, "dashboard.settings.errors.bio_max"),
    linkedin: optionalUrl,
    github: optionalUrl,
    facebook: optionalUrl,
    youtube: optionalUrl,
    x: optionalUrl,
    instagram: optionalUrl,
});

export const passwordSettingsSchema = z
    .object({
        currentPassword: z.string().min(1, "auth.errors.password_required"),
        newPassword: z.string().min(8, "auth.errors.password_min"),
        confirmPassword: z.string().min(1, "auth.errors.password_required"),
    })
    .superRefine((data, ctx) => {
        if (data.newPassword === data.currentPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["newPassword"],
                message: "dashboard.settings.errors.password_same",
            });
        }
        if (data.newPassword !== data.confirmPassword) {
            ctx.addIssue({
                code: "custom",
                path: ["confirmPassword"],
                message: "dashboard.settings.errors.password_mismatch",
            });
        }
    });

export const renewSubscriptionSchema = z.object({
    cardName: z.string().trim().min(1, "dashboard.subscription.errors.card_name"),
    cardNumber: z
        .string()
        .refine((value) => /^\d{13,19}$/.test(value.replace(/\s/g, "")), {
            message: "dashboard.subscription.errors.card_number",
        }),
    expiry: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "dashboard.subscription.errors.expiry"),
    cvv: z.string().regex(/^\d{3,4}$/, "dashboard.subscription.errors.cvv"),
});

export type ProfileSettingsValues = z.infer<typeof profileSettingsSchema>;
export type PasswordSettingsValues = z.infer<typeof passwordSettingsSchema>;
export type RenewSubscriptionValues = z.infer<typeof renewSubscriptionSchema>;
