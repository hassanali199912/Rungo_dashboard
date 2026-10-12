import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/config/apis";
import { profileKeys } from "@/shared/query/profileKeys";
import type { InstructorProfile, UpdateProfileInput } from "./types";

export function updateProfileApi(input: UpdateProfileInput) {
    const formData = new FormData();
    formData.append("displayName", input.displayName);
    formData.append("bio", input.bio);
    formData.append("majorCode", input.majorCode);
    formData.append("twitterUrl", input.twitterUrl);
    formData.append("instagramUrl", input.instagramUrl);
    formData.append("facebookUrl", input.facebookUrl);
    formData.append("linkedinUrl", input.linkedinUrl);
    formData.append("youtubeUrl", input.youtubeUrl);
    formData.append("githubUrl", input.githubUrl);
    if (input.avatar) formData.append("avatar", input.avatar);

    return client.patch<InstructorProfile>("/users/me/profile", formData, {
        maxBodyLength: Infinity,
        timeout: 120_000,
    });
}

export function useUpdateProfile() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (input: UpdateProfileInput) => {
            const { data } = await updateProfileApi(input);
            return data;
        },
        onSuccess: (profile) => {
            queryClient.setQueryData(profileKeys.me(), profile);
        },
    });
}
