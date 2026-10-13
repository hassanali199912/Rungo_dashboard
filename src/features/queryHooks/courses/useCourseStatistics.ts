import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export type CourseStatistics = {
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;
    activeCourses: number;
    inactiveCourses: number;
    totalLessons: number;
    totalEnrollments: number;
    totalCoinsEarned: number;
};

export function courseStatisticsApi() {
    return client.get<CourseStatistics>("/statistics/courses");
}

export async function fetchCourseStatistics() {
    const { data } = await courseStatisticsApi();
    return data;
}

export function useCourseStatistics() {
    return useQuery({
        queryKey: courseKeys.statistics(),
        queryFn: fetchCourseStatistics,
    });
}
