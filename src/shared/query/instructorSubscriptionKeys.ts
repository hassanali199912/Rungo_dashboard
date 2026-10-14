import { QUERY_ROOT } from "./queryKeys";

export const instructorSubscriptionKeys = {
    all: [QUERY_ROOT, "instructor-subscriptions"] as const,
    lists: () => [...instructorSubscriptionKeys.all, "list"] as const,
    list: () => [...instructorSubscriptionKeys.lists()] as const,
    mine: () => [...instructorSubscriptionKeys.all, "me"] as const,
    mineAll: () => [...instructorSubscriptionKeys.all, "me-all"] as const,
    details: () => [...instructorSubscriptionKeys.all, "detail"] as const,
    detail: (id: string) => [...instructorSubscriptionKeys.details(), id] as const,
    planName: (userId: string) => [...instructorSubscriptionKeys.all, "plan-name", userId] as const,
};
