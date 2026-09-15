export type StoredProfile = {
    name: string;
    email: string;
    expertise: string;
    portfolio: string;
};

const PROFILE_KEY = "rungo.settings.profile";

export function loadProfile(): StoredProfile | null {
    try {
        const raw = localStorage.getItem(PROFILE_KEY);
        if (!raw) return null;
        return JSON.parse(raw) as StoredProfile;
    } catch {
        return null;
    }
}

export function saveProfile(profile: StoredProfile) {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
}
