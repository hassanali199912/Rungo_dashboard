import type { InstructorPackage } from "@/features/queryHooks/instructorPackages/types";

export type SubscriptionInstructor = {
    id: string;
    email: string;
    phoneNumber: string | null;
    role: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
};

export type InstructorSubscription = {
    id: string;
    userId: string;
    instructorPackageId: string;
    instructor?: SubscriptionInstructor | null;
    instructorPackage?: InstructorPackage | null;
    maxCourses: number;
    maxVideos: number;
    coursesCreatedCount: number;
    videosUploadedCount: number;
    status: string;
    paymentId: string | null;
    startedAt: string | null;
    expiresAt: string | null;
    createdAt: string;
    updatedAt: string;
};

export type AdminCreateInstructorSubscriptionInput = {
    userId: string;
    instructorPackageId: string;
};

export type AdminUpdateInstructorSubscriptionBody = {
    instructorPackageId: string;
    status: string;
    maxCourses: number;
    maxVideos: number;
    startedAt: string | null;
    expiresAt: string | null;
};
