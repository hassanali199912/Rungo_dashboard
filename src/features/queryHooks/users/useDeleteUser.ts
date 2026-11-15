import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { userKeys } from "@/shared/query/userKeys";

export function deleteUserApi(id: string) {
    return client.delete<void>(`/users/${id}`);
}

export function useDeleteUser() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteUserApi(id);
            return id;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: userKeys.all });
        },
    });
}
