import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorSubscriptionKeys } from "@/shared/query/instructorSubscriptionKeys";

export type InstructorPlanName = {
    planName: string | null;
};

export function instructorPlanNameApi(userId: string) {
    return client.get<InstructorPlanName>(`/instructor-subscriptions/admin/users/${userId}`);
}

export async function fetchInstructorPlanName(userId: string) {
    const { data } = await instructorPlanNameApi(userId);
    return data;
}

export function useInstructorPlanName(userId?: string) {
    return useQuery({
        queryKey: instructorSubscriptionKeys.planName(userId ?? ""),
        queryFn: () => fetchInstructorPlanName(userId ?? ""),
        enabled: Boolean(userId),
    });
}
