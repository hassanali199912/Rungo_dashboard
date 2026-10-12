import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorPackageKeys } from "@/shared/query/instructorPackageKeys";
import type { InstructorPackage } from "./types";

export function activeInstructorPackagesApi() {
    return client.get<InstructorPackage[]>("/instructor-packages");
}

export async function fetchActiveInstructorPackages() {
    const { data } = await activeInstructorPackagesApi();
    return data;
}

export function useActiveInstructorPackages(enabled = true) {
    return useQuery({
        queryKey: instructorPackageKeys.catalog(),
        queryFn: fetchActiveInstructorPackages,
        enabled,
    });
}
