import { QUERY_ROOT } from "./queryKeys";

export const authKeys = {
    all: [QUERY_ROOT, "auth"] as const,
    me: () => [...authKeys.all, "me"] as const,
};
