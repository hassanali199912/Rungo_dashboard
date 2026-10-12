import { QUERY_ROOT } from "./queryKeys";

export const profileKeys = {
    all: [QUERY_ROOT, "profile"] as const,
    me: () => [...profileKeys.all, "me"] as const,
};
