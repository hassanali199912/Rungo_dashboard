import type { StudioPlanId } from "@/features/dashboard/pages/subscription/studioPlans";
import type { AccountStatus, CatalogPlan, CoinPack, PlatformSettings } from "./adminTypes";

const STATUS_KEY = "rungo.admin.status";
const HIDDEN_KEY = "rungo.admin.hidden";
const PLANS_KEY = "rungo.admin.instructorPlans";
const REFUNDS_KEY = "rungo.admin.refunds";
const PACKS_KEY = "rungo.admin.coinPacks";
const PLATFORM_KEY = "rungo.admin.platform";
const CATALOG_KEY = "rungo.admin.planCatalog";

type StatusMap = Record<string, AccountStatus>;

function readJson<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
        return fallback;
    }
}

function writeJson<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
}

export function getStatusMap(kind: "instructor" | "student"): StatusMap {
    return readJson<Record<string, StatusMap>>(STATUS_KEY, {})[kind] ?? {};
}

export function setAccountStatus(kind: "instructor" | "student", id: string, status: AccountStatus) {
    const all = readJson<Record<string, StatusMap>>(STATUS_KEY, {});
    writeJson(STATUS_KEY, {
        ...all,
        [kind]: { ...(all[kind] ?? {}), [id]: status },
    });
}

export function getHiddenIds(kind: "courses" | "shorts"): string[] {
    return readJson<Record<string, string[]>>(HIDDEN_KEY, {})[kind] ?? [];
}

export function toggleHidden(kind: "courses" | "shorts", id: string) {
    const all = readJson<Record<string, string[]>>(HIDDEN_KEY, {});
    const list = all[kind] ?? [];
    const next = list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
    writeJson(HIDDEN_KEY, { ...all, [kind]: next });
    return next;
}

export function getInstructorPlanOverrides(): Record<string, StudioPlanId> {
    return readJson(PLANS_KEY, {});
}

export function setInstructorPlan(id: string, plan: StudioPlanId) {
    writeJson(PLANS_KEY, { ...getInstructorPlanOverrides(), [id]: plan });
}

export function getRefundedInvoices(): string[] {
    return readJson(REFUNDS_KEY, []);
}

export function markInvoiceRefunded(id: string) {
    const next = Array.from(new Set([...getRefundedInvoices(), id]));
    writeJson(REFUNDS_KEY, next);
    return next;
}

export function getStoredCoinPacks(fallback: CoinPack[]): CoinPack[] {
    return readJson(PACKS_KEY, fallback);
}

export function saveCoinPacks(packs: CoinPack[]) {
    writeJson(PACKS_KEY, packs);
}

export function getPlatformSettings(): PlatformSettings {
    return readJson(PLATFORM_KEY, {
        supportEmail: "support@rungo.app",
        creatorSplit: 85,
        usdPerCoin: 0.05,
        maintenance: false,
    });
}

export function savePlatformSettings(settings: PlatformSettings) {
    writeJson(PLATFORM_KEY, settings);
}

export function getCatalogPlans(fallback: CatalogPlan[]): CatalogPlan[] {
    const stored = readJson<CatalogPlan[] | null>(CATALOG_KEY, null);
    if (!stored?.length) return fallback;
    const byId = Object.fromEntries(stored.map((plan) => [plan.id, plan]));
    return fallback.map((plan) => byId[plan.id] ?? plan);
}

export function saveCatalogPlans(plans: CatalogPlan[]) {
    writeJson(CATALOG_KEY, plans);
}
