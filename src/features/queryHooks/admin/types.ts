export type CoinPurchaseStatus = "pending" | "completed" | "failed";

export type StudentLastPurchase = {
    id: string;
    pricePaid: number;
    currency: string;
    coinsGranted: number;
    status: CoinPurchaseStatus;
    createdAt: string;
};

export type AdminStudentListItem = {
    id: string;
    email: string | null;
    phoneNumber: string | null;
    role: "student";
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
    coinBalance: number;
    invoiceCount: number;
    lastPurchase: StudentLastPurchase | null;
};

export type AdminStudentPage = {
    items: AdminStudentListItem[];
    total: number;
    page: number;
    limit: number;
};

export type AdminWalletBalance = {
    balance: number;
};

export type CoinPurchase = {
    id: string;
    userId: string;
    coinPackageId: string;
    coinsGranted: number;
    pricePaid: number;
    currency: string;
    paymentId: string | null;
    status: CoinPurchaseStatus;
    createdAt: string;
    updatedAt: string;
};

export type CoinPurchasePage = {
    items: CoinPurchase[];
    total: number;
    page: number;
    limit: number;
};

export type PaymentType = "instructor_subscription" | "coin_purchase";

export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";

export type AdminInvoice = {
    id: string;
    userId: string;
    displayName: string | null;
    email: string | null;
    type: PaymentType;
    referenceId: string;
    amount: number;
    currency: string;
    status: PaymentStatus;
    createdAt: string;
    updatedAt: string;
};

export type AdminInvoicePage = {
    items: AdminInvoice[];
    total: number;
    page: number;
    limit: number;
};

export type PlatformSettingsResponse = {
    supportEmail: string;
    creatorSplit: number;
    usdPerCoin: number;
    maintenanceMode: boolean;
    updatedAt: string;
};

export type UpdatePlatformSettingsBody = {
    supportEmail?: string;
    creatorSplit?: number;
    usdPerCoin?: number;
    maintenanceMode?: boolean;
};
