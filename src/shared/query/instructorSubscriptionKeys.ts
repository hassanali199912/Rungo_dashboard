import { QUERY_ROOT } from "./queryKeys";

export const instructorSubscriptionKeys = {
    all: [QUERY_ROOT, "instructor-subscriptions"] as const,
    lists: () => [...instructorSubscriptionKeys.all, "list"] as const,
    list: () => [...instructorSubscriptionKeys.lists()] as const,
    details: () => [...instructorSubscriptionKeys.all, "detail"] as const,
    detail: (id: string) => [...instructorSubscriptionKeys.details(), id] as const,
};
