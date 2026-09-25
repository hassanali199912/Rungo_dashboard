import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorPackageKeys } from "@/shared/query/instructorPackageKeys";
import type { InstructorPackage, InstructorPackageInput } from "./types";

export function createInstructorPackageApi(input: InstructorPackageInput) {
    return client.post<InstructorPackage>("/instructor-packages", input);
}

export function useCreateInstructorPackage() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: InstructorPackageInput) => {
            const { data } = await createInstructorPackageApi(input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: instructorPackageKeys.lists() });
        },
    });
}
