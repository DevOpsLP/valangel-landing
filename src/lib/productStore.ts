/**
 * One catalog fetch per page load, shared by every island.
 *
 * The home page alone renders three product rails; without this they would each
 * hit impoven-cms separately. Same singleton pattern as the cart and the rate.
 */
import { useEffect, useState } from 'react';
import { fetchProducts } from './strapi';
import { fallbackProducts, type Product } from './catalog';

type Listener = () => void;

let products: Product[] = [];
let status: 'idle' | 'loading' | 'ready' = 'idle';
let source: 'cms' | 'fallback' | null = null;
const listeners = new Set<Listener>();

function notify() {
    listeners.forEach((l) => l());
}

export async function initCatalog(): Promise<void> {
    if (status !== 'idle') return;
    status = 'loading';
    notify();

    const result = await fetchProducts();
    products = result.products;
    source = result.source;
    status = 'ready';
    notify();
}

export interface CatalogState {
    products: Product[];
    loading: boolean;
    /** 'cms' when impoven-cms answered, 'fallback' when the demo data is shown. */
    source: 'cms' | 'fallback' | null;
}

export function useCatalog(): CatalogState {
    const [state, setState] = useState<CatalogState>({ products: [], loading: true, source: null });

    useEffect(() => {
        const sync = () =>
            setState({ products: products.slice(), loading: status !== 'ready', source });
        sync();
        listeners.add(sync);
        initCatalog();
        return () => {
            listeners.delete(sync);
        };
    }, []);

    return state;
}

/** Synchronous access for code paths that cannot wait (e.g. deep-link lookup). */
export function peekProducts(): Product[] {
    return products.length ? products : fallbackProducts;
}
