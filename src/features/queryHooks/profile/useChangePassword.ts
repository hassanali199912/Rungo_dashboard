import { useMutation } from "@tanstack/react-query";
import client from "@/config/apis";
import type { ChangePasswordInput } from "./types";

export function changePasswordApi(input: ChangePasswordInput) {
    return client.post<{ ok: boolean }>("/users/me/change-password", input);
}

export function useChangePassword() {
    return useMutation({
        mutationFn: async (input: ChangePasswordInput) => {
            const { data } = await changePasswordApi(input);
            return data;
        },
    });
}
