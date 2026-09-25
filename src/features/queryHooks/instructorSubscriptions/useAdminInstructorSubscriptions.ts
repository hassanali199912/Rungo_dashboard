import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorSubscriptionKeys } from "@/shared/query/instructorSubscriptionKeys";
import type { InstructorSubscription } from "./types";

export function adminInstructorSubscriptionsApi() {
    return client.get<InstructorSubscription[]>("/instructor-subscriptions/admin");
}

export async function fetchAdminInstructorSubscriptions() {
    const { data } = await adminInstructorSubscriptionsApi();
    return data;
}

export function useAdminInstructorSubscriptions(enabled = true) {
    return useQuery({
        queryKey: instructorSubscriptionKeys.list(),
        queryFn: fetchAdminInstructorSubscriptions,
        enabled,
    });
}
