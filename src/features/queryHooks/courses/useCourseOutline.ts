import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";
import type { CourseOutline } from "./types";

export function courseOutlineApi(courseId: string) {
    return client.get<CourseOutline>(`/courses/manage/${courseId}`);
}

export async function fetchCourseOutline(courseId: string) {
    const { data } = await courseOutlineApi(courseId);
    return data;
}

export function useCourseOutline(courseId?: string) {
    return useQuery({
        queryKey: courseKeys.detail(courseId ?? ""),
        queryFn: () => fetchCourseOutline(courseId ?? ""),
        enabled: Boolean(courseId),
    });
}

export async function fetchCourseLessonVideo(videoUrl: string) {
    const { data } = await client.get<Blob>(videoUrl, {
        responseType: "blob",
        timeout: 120_000,
    });
    const type = data.type || "video/mp4";
    return new File([data], "lesson", { type });
}
