import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorSubscriptionKeys } from "@/shared/query/instructorSubscriptionKeys";
import type { AdminCreateInstructorSubscriptionInput, InstructorSubscription } from "./types";

export function createAdminInstructorSubscriptionApi(input: AdminCreateInstructorSubscriptionInput) {
    return client.post<InstructorSubscription>("/instructor-subscriptions/admin", input);
}

export function useAdminCreateInstructorSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AdminCreateInstructorSubscriptionInput) => {
            const { data } = await createAdminInstructorSubscriptionApi(input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instructorSubscriptionKeys.lists() });
        },
    });
}
