export type UserRole = "student" | "instructor" | "admin";

export type UserProfile = {
    id: string;
    email: string;
    phoneNumber: string | null;
    role: string;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    createdAt: string;
    updatedAt: string;
};

export type AdminUserProfile = {
    id: string;
    email: string | null;
    phoneNumber: string | null;
    role: UserRole;
    displayName: string;
    avatarUrl: string | null;
    bio: string | null;
    isActive: boolean;
    majorCode: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    facebookUrl: string | null;
    linkedinUrl: string | null;
    youtubeUrl: string | null;
    githubUrl: string | null;
    createdAt: string;
    updatedAt: string;
};
