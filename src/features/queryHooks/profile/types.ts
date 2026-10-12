export type InstructorProfile = {
    id: string;
    email: string;
    displayName: string;
    bio: string | null;
    majorCode: string | null;
    twitterUrl: string | null;
    instagramUrl: string | null;
    facebookUrl: string | null;
    linkedinUrl: string | null;
    youtubeUrl: string | null;
    githubUrl: string | null;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
};

export type UpdateProfileInput = {
    displayName: string;
    bio: string;
    majorCode: string;
    twitterUrl: string;
    instagramUrl: string;
    facebookUrl: string;
    linkedinUrl: string;
    youtubeUrl: string;
    githubUrl: string;
    avatar?: File;
};

export type ChangePasswordInput = {
    oldPassword: string;
    newPassword: string;
};
