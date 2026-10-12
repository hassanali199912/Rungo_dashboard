import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorSubscriptionKeys } from "@/shared/query/instructorSubscriptionKeys";
import type { InstructorSubscription } from "./types";

export function myInstructorSubscriptionsApi() {
    return client.get<InstructorSubscription[]>("/instructor-subscriptions/me/all");
}

export async function fetchMyInstructorSubscriptions() {
    const { data } = await myInstructorSubscriptionsApi();
    return data;
}

export function useMyInstructorSubscriptions(enabled = true) {
    return useQuery({
        queryKey: instructorSubscriptionKeys.mineAll(),
        queryFn: fetchMyInstructorSubscriptions,
        enabled,
    });
}
