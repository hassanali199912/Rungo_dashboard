import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export type AddLessonVideoInput = {
    courseId: string;
    chapterId: string;
    title: string;
    video: File;
};

export type CreatedLesson = {
    id?: string;
    shortId: string;
    title?: string;
    videoUrl: string;
};

export function addLessonVideoApi(input: AddLessonVideoInput) {
    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("video", input.video);

    return client.post<CreatedLesson>(
        `/courses/${input.courseId}/chapters/${input.chapterId}/shorts`,
        formData,
        { maxBodyLength: Infinity, timeout: 600_000 },
    );
}

export function useAddLessonVideo() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AddLessonVideoInput) => {
            const { data } = await addLessonVideoApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
        },
    });
}
