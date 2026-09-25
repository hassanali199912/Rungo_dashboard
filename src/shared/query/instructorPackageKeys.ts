import { QUERY_ROOT } from "./queryKeys";

export const instructorPackageKeys = {
    all: [QUERY_ROOT, "instructor-packages"] as const,
    lists: () => [...instructorPackageKeys.all, "list"] as const,
    list: () => [...instructorPackageKeys.lists()] as const,
    details: () => [...instructorPackageKeys.all, "detail"] as const,
    detail: (id: string) => [...instructorPackageKeys.details(), id] as const,
};
