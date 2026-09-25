import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorSubscriptionKeys } from "@/shared/query/instructorSubscriptionKeys";
import type { AdminUpdateInstructorSubscriptionBody, InstructorSubscription } from "./types";

export type AdminUpdateInstructorSubscriptionInput = {
    id: string;
    body: AdminUpdateInstructorSubscriptionBody;
};

export function updateAdminInstructorSubscriptionApi({ id, body }: AdminUpdateInstructorSubscriptionInput) {
    return client.patch<InstructorSubscription>(`/instructor-subscriptions/admin/${id}`, body);
}

export function useAdminUpdateInstructorSubscription() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AdminUpdateInstructorSubscriptionInput) => {
            const { data } = await updateAdminInstructorSubscriptionApi(input);
            return data;
        },
        onSuccess: (updated) => {
            if (updated?.id) {
                queryClient.setQueryData(instructorSubscriptionKeys.detail(updated.id), updated);
            }
            queryClient.invalidateQueries({ queryKey: instructorSubscriptionKeys.lists() });
        },
    });
}
