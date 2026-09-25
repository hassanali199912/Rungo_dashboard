import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { userKeys } from "@/shared/query/userKeys";
import type { UserProfile } from "./types";

export function toggleUserActiveApi(id: string) {
    return client.patch<UserProfile>(`/users/${id}/toggle-active`);
}

export function useToggleUserActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await toggleUserActiveApi(id);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}
