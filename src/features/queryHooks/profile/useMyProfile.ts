import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { profileKeys } from "@/shared/query/profileKeys";
import type { InstructorProfile } from "./types";

export function myProfileApi() {
    return client.get<InstructorProfile>("/users/me/profile");
}

export async function fetchMyProfile() {
    const { data } = await myProfileApi();
    return data;
}

export function useMyProfile(enabled = true) {
    return useQuery({
        queryKey: profileKeys.me(),
        queryFn: fetchMyProfile,
        enabled,
    });
}
