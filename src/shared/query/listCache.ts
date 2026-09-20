import type { QueryClient, QueryKey } from "@tanstack/react-query";
import type { PaginatedResponse } from "@/shared/types/api.types";

type Identifiable = { id: string | number };

function patchLists<T extends Identifiable>(
    queryClient: QueryClient,
    listsKey: QueryKey,
    updater: (page: PaginatedResponse<T>) => PaginatedResponse<T>,
) {
    queryClient.setQueriesData<PaginatedResponse<T>>({ queryKey: listsKey }, (current) => {
        if (!current?.data) return current;
        return updater(current);
    });
}

export function prependItem<T extends Identifiable>(
    queryClient: QueryClient,
    listsKey: QueryKey,
    item: T,
) {
    patchLists<T>(queryClient, listsKey, (page) => ({
        ...page,
        data: [item, ...page.data.filter((row) => row.id !== item.id)],
        meta: { ...page.meta, total: page.meta.total + 1 },
    }));
}

export function replaceItem<T extends Identifiable>(
    queryClient: QueryClient,
    listsKey: QueryKey,
    item: T,
) {
    patchLists<T>(queryClient, listsKey, (page) => ({
        ...page,
        data: page.data.map((row) => (row.id === item.id ? item : row)),
    }));
}

export function removeItem<T extends Identifiable>(
    queryClient: QueryClient,
    listsKey: QueryKey,
    id: string | number,
) {
    patchLists<T>(queryClient, listsKey, (page) => {
        const data = page.data.filter((row) => row.id !== id);
        if (data.length === page.data.length) return page;
        return {
            ...page,
            data,
            meta: { ...page.meta, total: Math.max(0, page.meta.total - 1) },
        };
    });
}
