import { QUERY_ROOT } from "./queryKeys";

export type CourseListParams = {
    page: number;
    limit: number;
};

export const courseKeys = {
    all: [QUERY_ROOT, "courses"] as const,
    lists: () => [...courseKeys.all, "list"] as const,
    list: (params: CourseListParams) => [...courseKeys.lists(), params] as const,
    details: () => [...courseKeys.all, "detail"] as const,
    detail: (id: string) => [...courseKeys.details(), id] as const,
};
