/**
 * Favourites ("Mis favoritos"). Same singleton pattern as the cart so the
 * heart on a product card and the counter in the header stay in sync across
 * React roots.
 */
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'valangel_wishlist_v1';

type Listener = () => void;

let ids: number[] = [];
const listeners = new Set<Listener>();

function read(): number[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        return Array.isArray(parsed) ? parsed.filter((n) => typeof n === 'number') : [];
    } catch {
        return [];
    }
}

function write(next: number[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
        /* ignore */
    }
}

if (typeof window !== 'undefined') ids = read();

function notify(): void {
    listeners.forEach((l) => l());
}

export const wishlistStore = {
    subscribe(l: Listener): () => void {
        listeners.add(l);
        return () => listeners.delete(l);
    },
    get(): number[] {
        return ids;
    },
    has(id: number): boolean {
        return ids.includes(id);
    },
    toggle(id: number): boolean {
        const next = ids.includes(id) ? ids.filter((n) => n !== id) : [...ids, id];
        ids = next;
        write(next);
        notify();
        return next.includes(id);
    },
    clear(): void {
        ids = [];
        write(ids);
        notify();
    },
};

/** Subscribes a component to the wishlist. SSR-safe: starts empty. */
export function useWishlist(): { ids: number[]; has: (id: number) => boolean; toggle: (id: number) => void } {
    const [list, setList] = useState<number[]>([]);

    useEffect(() => {
        setList(wishlistStore.get().slice());
        return wishlistStore.subscribe(() => setList(wishlistStore.get().slice()));
    }, []);

    return {
        ids: list,
        has: (id: number) => list.includes(id),
        toggle: (id: number) => wishlistStore.toggle(id),
    };
}
