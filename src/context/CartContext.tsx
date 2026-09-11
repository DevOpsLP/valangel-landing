import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { cartItemCount, cartSubtotal, type CartItem } from '../lib/cart';
import { cartStore, CART_ITEM_ADDED_EVENT } from '../lib/cartStore';

interface CartContextValue {
    items: CartItem[];
    add: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
    remove: (id: number) => void;
    setQty: (id: number, quantity: number) => void;
    clear: () => void;
    itemCount: number;
    subtotal: number;
    isDrawerOpen: boolean;
    openDrawer: () => void;
    closeDrawer: () => void;
    isCheckoutOpen: boolean;
    openCheckout: () => void;
    closeCheckout: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    /** Starts empty to match SSR output (no localStorage on the server), then
     *  syncs from the shared store after mount to avoid hydration mismatches. */
    const [items, setItems] = useState<CartItem[]>([]);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [isCheckoutOpen, setCheckoutOpen] = useState(false);

    useEffect(() => {
        setItems(cartStore.getSnapshot());
        return cartStore.subscribe(() => setItems(cartStore.getSnapshot().slice()));
    }, []);

    const add = useCallback((item: Omit<CartItem, 'quantity'>, quantity = 1) => {
        cartStore.dispatch({ type: 'ADD', item, quantity });
        window.dispatchEvent(new CustomEvent(CART_ITEM_ADDED_EVENT));
    }, []);

    const remove = useCallback((id: number) => cartStore.dispatch({ type: 'REMOVE', id }), []);
    const setQty = useCallback((id: number, quantity: number) => cartStore.dispatch({ type: 'SET_QTY', id, quantity }), []);
    const clear = useCallback(() => cartStore.dispatch({ type: 'CLEAR' }), []);

    const openDrawer = useCallback(() => setDrawerOpen(true), []);
    const closeDrawer = useCallback(() => setDrawerOpen(false), []);
    const openCheckout = useCallback(() => setCheckoutOpen(true), []);
    const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

    return (
        <CartContext.Provider
            value={{
                items, add, remove, setQty, clear,
                itemCount: cartItemCount(items),
                subtotal: cartSubtotal(items),
                isDrawerOpen, openDrawer, closeDrawer,
                isCheckoutOpen, openCheckout, closeCheckout,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export function useCart(): CartContextValue {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside CartProvider');
    return ctx;
}
