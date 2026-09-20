// nameSpace للمشروع كلة , بيستخدم في تنظيف الكاش 
export const QUERY_ROOT = 'sahel' as const;


// genaric keys علشان الركوستات الي هتكون شبة بعض 
export function createResourceKeys<TFilters = unknown>(resource: string) {
    return {
        all: (businessUid: string) =>
            [QUERY_ROOT, businessUid, resource] as const,
        lists: (businessUid: string) =>
            [QUERY_ROOT, businessUid, resource, 'list'] as const,
        list: (businessUid: string, filters?: TFilters) =>
            filters === undefined
                ? ([QUERY_ROOT, businessUid, resource, 'list'] as const)
                : ([QUERY_ROOT, businessUid, resource, 'list', filters] as const),
        details: (businessUid: string) =>
            [QUERY_ROOT, businessUid, resource, 'detail'] as const,
        detail: (businessUid: string, id: string | number) =>
            [QUERY_ROOT, businessUid, resource, 'detail', id] as const,
    };
}

export type ResourceKeys<TFilters = unknown> = ReturnType<typeof createResourceKeys<TFilters>>;
