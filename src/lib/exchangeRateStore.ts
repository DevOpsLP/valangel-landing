import { useEffect, useState } from 'react';
import { STRAPI_URL } from './constants';

/**
 * BCV rate (Bs / USD) served by impoven-cms at /api/exchange-rate.
 * Fetched once per page load and shared by every island, exactly like the cart.
 */

let rate: number | null = null;
let fetchedAt: string | null = null;
let initiated = false;
let listeners: Array<() => void> = [];

function notify() {
    listeners.forEach((fn) => fn());
}

export function getRate(): number | null {
    return rate;
}

export function getRateFetchedAt(): string | null {
    return fetchedAt;
}

function subscribe(fn: () => void): () => void {
    listeners.push(fn);
    return () => {
        listeners = listeners.filter((l) => l !== fn);
    };
}

export async function initExchangeRate(): Promise<void> {
    if (initiated) return;
    initiated = true;

    try {
        const res = await fetch(`${STRAPI_URL}/api/exchange-rate`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (data.rate != null) {
            rate = data.rate;
            fetchedAt = data.fetchedAt ?? null;
            notify();
        }
    } catch {
        // CMS unreachable — every bolívar line simply stays hidden
    }
}

export function useExchangeRate(): number | null {
    const [r, setR] = useState<number | null>(null);

    useEffect(() => {
        setR(getRate());
        const unsub = subscribe(() => setR(getRate()));
        initExchangeRate();
        return unsub;
    }, []);

    return r;
}
