import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { shortsKeys } from "@/shared/query/shortsKeys";
import type { Short } from "./useShorts";

export type UpdateShortInput = {
    id: string;
    title: string;
    description: string;
    tags: string[];
    video?: File;
    cover?: File;
    onUploadProgress?: (progress: number) => void;
};

export function updateShortApi(input: UpdateShortInput) {
    const formData = new FormData();
    formData.append("title", input.title);
    formData.append("description", input.description);
    formData.append("tags", JSON.stringify(input.tags));

    if (input.video) formData.append("video", input.video);
    if (input.cover) formData.append("cover", input.cover);

    return client.patch<Short>(`/shorts/${input.id}`, formData, {
        maxBodyLength: Infinity,
        onUploadProgress: (event) => {
            const progress = event.progress ?? (event.total ? event.loaded / event.total : 0);
            input.onUploadProgress?.(Math.round(progress * 100));
        },
    });
}

export function useUpdateShort() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateShortInput) => {
            const { data } = await updateShortApi(input);
            return data;
        },
        onSuccess: (updatedShort) => {
            queryClient.setQueryData(shortsKeys.detail(updatedShort.id), updatedShort);
            queryClient.invalidateQueries({ queryKey: shortsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: shortsKeys.statistics() });
        },
    });
}
