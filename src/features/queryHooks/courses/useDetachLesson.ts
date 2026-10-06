import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";
import { shortsKeys } from "@/shared/query/shortsKeys";

export type DetachLessonInput = {
    courseId: string;
    chapterId: string;
    shortId: string;
};

export function detachLessonApi(input: DetachLessonInput) {
    return client.delete(
        `/courses/${input.courseId}/chapters/${input.chapterId}/shorts/${input.shortId}`,
    );
}

export function useDetachLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: DetachLessonInput) => {
            const { data } = await detachLessonApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
            queryClient.invalidateQueries({ queryKey: shortsKeys.lists() });
        },
    });
}
