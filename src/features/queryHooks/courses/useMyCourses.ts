import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys, type CourseListParams } from "@/shared/query/courseKeys";
import type { CoursePage } from "./types";

export function myCoursesApi(params: CourseListParams) {
    return client.get<CoursePage>("/courses/manage", { params });
}

export async function fetchMyCourses(params: CourseListParams) {
    const { data } = await myCoursesApi(params);
    return data;
}

export function useMyCourses(params: CourseListParams, enabled = true) {
    return useQuery({
        queryKey: courseKeys.list(params),
        queryFn: () => fetchMyCourses(params),
        enabled,
        placeholderData: (previousData) => previousData,
    });
}
