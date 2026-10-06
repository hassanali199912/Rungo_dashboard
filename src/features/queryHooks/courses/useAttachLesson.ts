import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";
import { shortsKeys } from "@/shared/query/shortsKeys";

export type AttachLessonInput = {
    courseId: string;
    chapterId: string;
    shortId: string;
};

export type AttachedLesson = {
    id?: string;
    shortId?: string;
    title?: string;
    videoUrl?: string;
};

export function attachLessonApi(input: AttachLessonInput) {
    return client.post<AttachedLesson>(
        `/courses/${input.courseId}/chapters/${input.chapterId}/shorts/${input.shortId}`,
    );
}

export function useAttachLesson() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AttachLessonInput) => {
            const { data } = await attachLessonApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
            queryClient.invalidateQueries({ queryKey: shortsKeys.lists() });
        },
    });
}
