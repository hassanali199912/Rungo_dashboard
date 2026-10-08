import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export type UpdateChapterInput = {
    courseId: string;
    chapterId: string;
    title: string;
};

export type UpdatedChapter = {
    id: string;
    title: string;
    position: number;
};

export function updateChapterApi(input: UpdateChapterInput) {
    return client.patch<UpdatedChapter>(`/courses/${input.courseId}/chapters/${input.chapterId}`, {
        title: input.title,
    });
}

export function useUpdateChapter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateChapterInput) => {
            const { data } = await updateChapterApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
        },
    });
}
