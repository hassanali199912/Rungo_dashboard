export type CoinPackage = {
    id: string;
    name: string;
    coins: number;
    price: number;
    currency: string;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type CoinPackageInput = {
    name: string;
    coins: number;
    price: number;
    currency: string;
    isActive?: boolean;
};
