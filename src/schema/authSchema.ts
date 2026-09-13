import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().min(1, "auth.errors.email_required").email("auth.errors.email_invalid"),
    password: z.string().min(1, "auth.errors.password_required"),
    remember: z.boolean(),
});

export const registerSchema = z.object({
    name: z.string().trim().min(2, "auth.errors.name_required"),
    email: z.string().trim().min(1, "auth.errors.email_required").email("auth.errors.email_invalid"),
    expertise: z.string().min(1, "auth.errors.expertise_required"),
    portfolio: z
        .string()
        .trim()
        .refine((value) => value === "" || /^https?:\/\/.+/i.test(value), {
            message: "auth.errors.portfolio_invalid",
        }),
    password: z.string().min(8, "auth.errors.password_min"),
    terms: z.boolean().refine((value) => value, { message: "auth.errors.terms_required" }),
});

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
