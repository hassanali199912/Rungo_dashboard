import { QUERY_ROOT } from "./queryKeys";

export type ShortsListParams = {
    page: number;
    limit: number;
};

export const shortsKeys = {
    all: [QUERY_ROOT, "shorts"] as const,
    lists: () => [...shortsKeys.all, "list"] as const,
    list: (params: ShortsListParams) => [...shortsKeys.lists(), params] as const,
    details: () => [...shortsKeys.all, "detail"] as const,
    detail: (id: string) => [...shortsKeys.details(), id] as const,
    statistics: () => [...shortsKeys.all, "statistics"] as const,
};
