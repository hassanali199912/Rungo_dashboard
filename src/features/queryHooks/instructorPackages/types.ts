export type InstructorPackage = {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: string;
    durationDays: number;
    maxCourses: number;
    maxVideos: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
};

export type InstructorPackageInput = {
    name: string;
    description: string;
    price: number;
    currency: string;
    durationDays: number;
    maxCourses: number;
    maxVideos: number;
    isActive?: boolean;
};
