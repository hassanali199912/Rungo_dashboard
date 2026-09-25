import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { instructorPackageKeys } from "@/shared/query/instructorPackageKeys";
import type { InstructorPackage } from "./types";

export function instructorPackagesApi() {
    return client.get<InstructorPackage[]>("/instructor-packages/admin/all");
}

export async function fetchInstructorPackages() {
    const { data } = await instructorPackagesApi();
    return data;
}

export function useInstructorPackages(enabled = true) {
    return useQuery({
        queryKey: instructorPackageKeys.list(),
        queryFn: fetchInstructorPackages,
        enabled,
    });
}
