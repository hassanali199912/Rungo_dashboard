import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { shortsKeys } from "@/shared/query/shortsKeys";
import type { ShortPage } from "./useShorts";

export function deleteShortApi(id: string) {
    return client.delete<void>(`/shorts/${id}`);
}

export function useDeleteShort() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteShortApi(id);
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueriesData<ShortPage>({ queryKey: shortsKeys.lists() }, (page) => {
                if (!page) return page;
                return {
                    ...page,
                    items: page.items.filter((item) => item.id !== deletedId),
                    total: Math.max(0, page.total - 1),
                };
            });
            queryClient.removeQueries({ queryKey: shortsKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: shortsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: shortsKeys.statistics() });
        },
    });
}
