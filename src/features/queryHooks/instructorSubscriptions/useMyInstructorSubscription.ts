import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorSubscriptionKeys } from "@/shared/query/instructorSubscriptionKeys";
import type { InstructorSubscription } from "./types";

export function myInstructorSubscriptionApi() {
    return client.get<InstructorSubscription | null>("/instructor-subscriptions/me");
}

export async function fetchMyInstructorSubscription() {
    const { data } = await myInstructorSubscriptionApi();
    return data;
}

export function useMyInstructorSubscription(enabled = true) {
    return useQuery({
        queryKey: instructorSubscriptionKeys.mine(),
        queryFn: fetchMyInstructorSubscription,
        enabled,
    });
}
