import { z } from "zod";

export const loginSchema = z.object({
    email: z.string().trim().min(1, "auth.errors.email_required").email("auth.errors.email_invalid"),
    password: z.string().min(1, "auth.errors.password_required"),
    remember: z.boolean(),
});

export const registerSchema = z
    .object({
        displayName: z.string().trim().min(1, "auth.errors.name_required"),
        email: z.string().trim().min(1, "auth.errors.email_required").email("auth.errors.email_invalid"),
        password: z.string().min(8, "auth.errors.password_min"),
        confirmPassword: z.string().min(1, "auth.errors.password_required"),
        terms: z.boolean().refine((value) => value, { message: "auth.errors.terms_required" }),
    })
    .superRefine((data, ctx) => {
        if (data.password !== data.confirmPassword) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["confirmPassword"],
                message: "auth.errors.password_mismatch",
            });
        }
    });

export type LoginValues = z.infer<typeof loginSchema>;
export type RegisterValues = z.infer<typeof registerSchema>;
