import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { courseKeys } from "@/shared/query/courseKeys";

export type CreateCourseInput = {
    title: string;
    description: string;
    tags: string[];
    price: number;
    cover: File;
};

export type CreatedCourse = {
    id: string;
};

export function createCourseApi(input: CreateCourseInput) {
    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("tags", JSON.stringify(input.tags));
    formData.append("price", String(input.price));
    formData.append("cover", input.cover);

    return client.post<CreatedCourse>("/courses", formData, {
        maxBodyLength: Infinity,
        timeout: 120_000,
    });
}

export function useCreateCourse() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateCourseInput) => {
            const { data } = await createCourseApi(input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: courseKeys.lists() });
        },
    });
}
