export const STUDIO_PLAN_IDS = ["starter", "pro", "elite"] as const;

export type StudioPlanId = (typeof STUDIO_PLAN_IDS)[number];

export type StudioPlan = {
    id: StudioPlanId;
    price: number;
    popular?: boolean;
    featureCount: number;
};

export const STUDIO_PLANS: StudioPlan[] = [
    { id: "starter", price: 0, featureCount: 3 },
    { id: "pro", price: 29, popular: true, featureCount: 4 },
    { id: "elite", price: 79, featureCount: 4 },
];
