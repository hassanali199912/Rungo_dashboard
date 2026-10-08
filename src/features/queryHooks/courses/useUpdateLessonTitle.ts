import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";
import { shortsKeys } from "@/shared/query/shortsKeys";

export type UpdateLessonTitleInput = {
    courseId: string;
    shortId: string;
    title: string;
};

export function updateLessonTitleApi(input: UpdateLessonTitleInput) {
    const formData = new FormData();
    formData.append("title", input.title);
    return client.patch(`/shorts/${input.shortId}`, formData);
}

export function useUpdateLessonTitle() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateLessonTitleInput) => {
            const { data } = await updateLessonTitleApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
            queryClient.invalidateQueries({ queryKey: shortsKeys.detail(input.shortId) });
            queryClient.invalidateQueries({ queryKey: shortsKeys.lists() });
        },
    });
}
