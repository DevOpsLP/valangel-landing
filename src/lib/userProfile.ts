export interface SavedAddress {
    formatted: string;
    lat: number;
    lng: number;
}

export interface UserProfile {
    name: string;
    phone: string;
    addresses: SavedAddress[];
}

const KEY = 'valangel_user_v1';

export function loadUserProfile(): UserProfile | null {
    try {
        const raw = localStorage.getItem(KEY);
        return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
        return null;
    }
}

export function saveUserProfile(profile: UserProfile): void {
    try {
        localStorage.setItem(KEY, JSON.stringify(profile));
    } catch {
        /* ignore */
    }
}

/** Stores name + phone and prepends the address, de-duplicated, capped at 5. */
export function upsertUserProfile(name: string, phone: string, address: SavedAddress): void {
    const existing = loadUserProfile();
    const prev = existing?.addresses ?? [];
    const deduped = prev.filter((a) => a.formatted !== address.formatted);
    saveUserProfile({ name, phone, addresses: [address, ...deduped].slice(0, 5) });
}
