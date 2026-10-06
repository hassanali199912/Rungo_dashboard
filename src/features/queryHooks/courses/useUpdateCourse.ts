import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export type UpdateCourseInput = {
    courseId: string;
    title?: string;
    description?: string;
    tags?: string[];
    price?: number;
    cover?: File;
    published?: boolean;
};

export function updateCourseApi(input: UpdateCourseInput) {
    const formData = new FormData();
    if (input.title !== undefined) formData.append("title", input.title);
    if (input.description !== undefined) formData.append("description", input.description);
    if (input.tags !== undefined) formData.append("tags", JSON.stringify(input.tags));
    if (input.price !== undefined) formData.append("price", String(input.price));
    if (input.cover) formData.append("cover", input.cover);
    if (input.published !== undefined) formData.append("published", input.published ? "true" : "false");

    return client.patch(`/courses/${input.courseId}`, formData, {
        maxBodyLength: Infinity,
        timeout: 120_000,
    });
}

export function useUpdateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateCourseInput) => {
            const { data } = await updateCourseApi(input);
            return data;
        },
        onSuccess: (_data, input) => {
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
            queryClient.invalidateQueries({ queryKey: courseKeys.detail(input.courseId) });
        },
    });
}
