import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorPackageKeys } from "@/shared/query/instructorPackageKeys";
import type { InstructorPackage } from "./types";

export function deleteInstructorPackageApi(id: string) {
    return client.delete<void>(`/instructor-packages/${id}`);
}

export function useDeleteInstructorPackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (id: string) => {
            await deleteInstructorPackageApi(id);
            return id;
        },
        onSuccess: (deletedId) => {
            queryClient.setQueryData<InstructorPackage[]>(instructorPackageKeys.list(), (current) =>
                current?.filter((plan) => plan.id !== deletedId),
            );
            queryClient.removeQueries({ queryKey: instructorPackageKeys.detail(deletedId) });
            queryClient.invalidateQueries({ queryKey: instructorPackageKeys.lists() });
        },
    });
}
