import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export function setCoursePublishedApi(courseId: string, published: boolean) {
    return client.patch(`/courses/${courseId}/published`, { published });
}

export function useSetCoursePublished() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: { courseId: string; published: boolean }) => {
            const { data } = await setCoursePublishedApi(input.courseId, input.published);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}
