import { STUDIO_PLAN_IDS, type StudioPlanId } from "./studioPlans";

export type StoredSubscription = {
    plan: StudioPlanId;
    renewsAt: string;
};

const SUBSCRIPTION_KEY = "rungo.settings.subscription";

export function nextMonthIsoDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

function isPlanId(value: string): value is StudioPlanId {
    return (STUDIO_PLAN_IDS as readonly string[]).includes(value);
}

export function loadSubscription(): StoredSubscription {
    try {
        const raw = localStorage.getItem(SUBSCRIPTION_KEY);
        if (raw) {
            const parsed = JSON.parse(raw) as StoredSubscription;
            if (parsed?.plan && isPlanId(parsed.plan) && parsed.renewsAt) {
                return parsed;
            }
        }
    } catch {
        /* use default */
    }

    return { plan: "pro", renewsAt: nextMonthIsoDate() };
}

export function saveSubscription(subscription: StoredSubscription) {
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
}

export function formatRenewDate(isoDate: string, locale: string) {
    const [year, month, day] = isoDate.split("-").map(Number);
    if (!year || !month || !day) return isoDate;
    return new Date(year, month - 1, day).toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}
