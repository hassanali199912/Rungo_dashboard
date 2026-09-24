import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { shortsKeys } from "@/shared/query/shortsKeys";
import type { Short } from "./useShorts";

export type CreateShortInput = {
    title: string;
    description: string;
    tags: string[];
    video: File;
    cover?: File;
    onUploadProgress?: (progress: number) => void;
};

export function createShortApi(input: CreateShortInput) {
    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("tags", JSON.stringify(input.tags));
    formData.append("video", input.video);

    if (input.cover) {
        formData.append("cover", input.cover);
    }

    return client.post<Short>("/shorts", formData, {
        maxBodyLength: Infinity,
        onUploadProgress: (event) => {
            const progress = event.progress ?? (event.total ? event.loaded / event.total : 0);
            input.onUploadProgress?.(Math.round(progress * 100));
        },
    });
}

export function useCreateShort() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: CreateShortInput) => {
            const { data } = await createShortApi(input);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: shortsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: shortsKeys.statistics() });
        },
    });
}
