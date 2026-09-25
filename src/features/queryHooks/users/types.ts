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
