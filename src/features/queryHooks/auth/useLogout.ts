import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clearAuth } from "@/config/apis";
import { QUERY_ROOT } from "@/shared/query/queryKeys";

export function useLogout() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            await queryClient.cancelQueries({ queryKey: [QUERY_ROOT] });
            queryClient.removeQueries({ queryKey: [QUERY_ROOT] });
            clearAuth();
        },
    });
}
