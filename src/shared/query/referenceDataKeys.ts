import { QUERY_ROOT } from "./queryKeys";

export const referenceDataKeys = {
    all: [QUERY_ROOT, "reference-data"] as const,
    countries: () => [...referenceDataKeys.all, "countries"] as const,
    currencies: () => [...referenceDataKeys.all, "currencies"] as const,
};
