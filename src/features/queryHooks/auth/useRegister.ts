import { useMutation } from "@tanstack/react-query";
import client from "@/config/apis";
import type { LoginResponse } from "./useLogin";

export type RegisterInput = {
    email: string;
    password: string;
    role: "instructor" | "admin";
    displayName: string;
    avatarUrl?: string | null;
    bio?: string | null;
};

export function registerApi(input: RegisterInput) {
    return client.post<LoginResponse>("/auth/dashboard/register", input, {
        skipAuthHandling: true,
    });
}

export function useRegister() {
    return useMutation({
        mutationFn: async (input: RegisterInput) => {
            const { data } = await registerApi(input);
            return data;
        },
    });
}
