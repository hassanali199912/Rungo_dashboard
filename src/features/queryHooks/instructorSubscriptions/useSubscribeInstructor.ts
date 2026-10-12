import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorSubscriptionKeys } from "@/shared/query/instructorSubscriptionKeys";
import type { InstructorSubscription } from "./types";

export function subscribeInstructorApi(instructorPackageId: string) {
    return client.post<InstructorSubscription>("/instructor-subscriptions", { instructorPackageId });
}

export function useSubscribeInstructor() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (instructorPackageId: string) => {
            const { data } = await subscribeInstructorApi(instructorPackageId);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instructorSubscriptionKeys.mine() });
            queryClient.invalidateQueries({ queryKey: instructorSubscriptionKeys.mineAll() });
        },
    });
}
