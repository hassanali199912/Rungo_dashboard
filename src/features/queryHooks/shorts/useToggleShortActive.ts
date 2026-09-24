import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { shortsKeys } from "@/shared/query/shortsKeys";
import type { Short, ShortPage } from "./useShorts";

export function toggleShortActiveApi(id: string) {
    return client.patch<Short>(`/shorts/${id}/toggle-active`);
}

export function useToggleShortActive() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            const { data } = await toggleShortActiveApi(id);
            return data;
        },
        onSuccess: (updatedShort) => {
            queryClient.setQueriesData<ShortPage>({ queryKey: shortsKeys.lists() }, (page) => {
                if (!page) return page;
                return {
                    ...page,
                    items: page.items.map((item) => (item.id === updatedShort.id ? updatedShort : item)),
                };
            });
            queryClient.invalidateQueries({ queryKey: shortsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: shortsKeys.statistics() });
        },
    });
}
