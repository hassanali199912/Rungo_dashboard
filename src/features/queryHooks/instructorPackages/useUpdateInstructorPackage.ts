import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorPackageKeys } from "@/shared/query/instructorPackageKeys";
import type { InstructorPackage, InstructorPackageInput } from "./types";

export type UpdateInstructorPackageInput = {
    id: string;
} & InstructorPackageInput;

export function updateInstructorPackageApi({ id, ...input }: UpdateInstructorPackageInput) {
    return client.patch<InstructorPackage>(`/instructor-packages/${id}`, input);
}

export function useUpdateInstructorPackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateInstructorPackageInput) => {
            const { data } = await updateInstructorPackageApi(input);
            return data;
        },
        onSuccess: (updated) => {
            queryClient.setQueryData(instructorPackageKeys.detail(updated.id), updated);
            queryClient.invalidateQueries({ queryKey: instructorPackageKeys.lists() });
        },
    });
}
