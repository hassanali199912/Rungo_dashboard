import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";
import type { CourseDetailStatistics } from "./types";

export function courseDetailStatisticsApi(courseId: string) {
    return client.get<CourseDetailStatistics>(`/courses/manage/${courseId}/statistics`);
}

export async function fetchCourseDetailStatistics(courseId: string) {
    const { data } = await courseDetailStatisticsApi(courseId);
    return data;
}

export function useCourseDetailStatistics(courseId?: string) {
    return useQuery({
        queryKey: courseKeys.detailStatistics(courseId ?? ""),
        queryFn: () => fetchCourseDetailStatistics(courseId ?? ""),
        enabled: Boolean(courseId),
    });
}
