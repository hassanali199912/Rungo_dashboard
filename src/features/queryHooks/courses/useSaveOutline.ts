import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export type OutlineChapterOrder = {
    id: string;
    shortIds: string[];
};

export type SaveOutlineInput = {
    courseId: string;
    chapters: OutlineChapterOrder[];
};

export function saveOutlineApi(input: SaveOutlineInput) {
    return client.put(`/courses/${input.courseId}/outline`, {
        chapters: input.chapters,
    });
}

export function useSaveOutline() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: SaveOutlineInput) => {
            const { data } = await saveOutlineApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
        },
    });
}
