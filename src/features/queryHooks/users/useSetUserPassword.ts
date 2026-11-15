import { useMutation } from "@tanstack/react-query";
import client from "@/config/apis";

export function setUserPasswordApi(id: string, password: string) {
    return client.patch<{ ok: true }>(`/users/${id}/password`, { password });
}

export function useSetUserPassword() {
    return useMutation({
        mutationFn: async (input: { id: string; password: string }) => {
            const { data } = await setUserPasswordApi(input.id, input.password);
            return data;
        },
    });
}
