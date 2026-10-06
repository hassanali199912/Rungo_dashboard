import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export type AddChapterInput = {
    courseId: string;
    title: string;
};

export type CreatedChapter = {
    id: string;
    title: string;
    position: number;
};

export function addChapterApi(input: AddChapterInput) {
    return client.post<CreatedChapter>(`/courses/${input.courseId}/chapters`, {
        title: input.title,
    });
}

export function useAddChapter() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: AddChapterInput) => {
            const { data } = await addChapterApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
        },
    });
}
