import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { adminKeys, type AdminPageParams } from "@/shared/query/adminKeys";
import type { AdminStudentPage } from "./types";

export function adminStudentsApi(params: AdminPageParams) {
    return client.get<AdminStudentPage>("/admin/students", { params });
}

export async function fetchAdminStudents(params: AdminPageParams) {
    const { data } = await adminStudentsApi(params);
    return data;
}

export function useAdminStudents(params: AdminPageParams, enabled = true) {
    return useQuery({
        queryKey: adminKeys.students(params),
        queryFn: () => fetchAdminStudents(params),
        enabled,
        placeholderData: (previousData) => previousData,
    });
}
