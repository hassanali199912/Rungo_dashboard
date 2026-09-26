import { QUERY_ROOT } from "./queryKeys";

export const coinPackageKeys = {
    all: [QUERY_ROOT, "coin-packages"] as const,
    lists: () => [...coinPackageKeys.all, "list"] as const,
    list: () => [...coinPackageKeys.lists()] as const,
    details: () => [...coinPackageKeys.all, "detail"] as const,
    detail: (id: string) => [...coinPackageKeys.details(), id] as const,
};
