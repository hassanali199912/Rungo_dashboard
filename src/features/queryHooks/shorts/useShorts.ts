import { useQuery } from "@tanstack/react-query";
import client from "@/config/apis";
import { shortsKeys, type ShortsListParams } from "@/shared/query/shortsKeys";

export type Short = {
    id: string;
    instructorUserId: string;
    title: string;
    description: string;
    tagCodes: string[];
    videoUrl: string;
    coverUrl: string | null;
    likeCount: number;
    commentCount: number;
    shareCount: number;
    isActive: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type ShortPage = {
    items: Short[];
    total: number;
    page: number;
    limit: number;
};

const SHORTS_API_URL = `${
    import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "https://rungo-backend.vercel.app"
}/shorts/manage`;

export function shortsApi(params: ShortsListParams) {
    return client.get<ShortPage>(SHORTS_API_URL, {
        params,
        maxBodyLength: Infinity,
    });
}

export async function fetchShorts(params: ShortsListParams) {
    const { data } = await shortsApi(params);
    return data;
}

export function useShorts(params: ShortsListParams) {
    return useQuery({
        queryKey: shortsKeys.list(params),
        queryFn: () => fetchShorts(params),
        placeholderData: (previousData) => previousData,
    });
}
