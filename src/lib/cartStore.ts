/**
 * Module-level singleton cart store, shared across every React island on the
 * page. The header island and the product grids live in separate React roots,
 * so context alone cannot connect them — this store can.
 */
import { cartReducer, type CartAction, type CartItem, loadCart, saveCart } from './cart';

type Listener = () => void;

let currentItems: CartItem[] = [];
const listeners = new Set<Listener>();

if (typeof window !== 'undefined') currentItems = loadCart();

function notify(): void {
    listeners.forEach((l) => l());
}

export const cartStore = {
    subscribe(listener: Listener): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot(): CartItem[] {
        return currentItems;
    },
    getServerSnapshot(): CartItem[] {
        return [];
    },
    dispatch(action: CartAction): void {
        currentItems = cartReducer(currentItems, action);
        saveCart(currentItems);
        notify();
    },
};

/** Cross-island signal: fired after ADD so the header island opens the drawer. */
export const CART_ITEM_ADDED_EVENT = 'cart:item-added';
/** Cross-island signal: opens the search overlay from anywhere (e.g. tab bar). */
export const OPEN_SEARCH_EVENT = 'ui:open-search';
/** Cross-island signal: opens the cart drawer without adding anything. */
export const OPEN_CART_EVENT = 'ui:open-cart';
