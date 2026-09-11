import { WA_NUMBER } from './constants';
import { usd, ves, toVes } from './format';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItem {
    id: number;
    name: string;
    sku: string;
    /** Unit price at the time it was added; 0 when the product had no price. */
    price: number;
    quantity: number;
    imageUrl: string | null;
    brand?: string | null;
    size?: string | null;
}

interface PersistedCart {
    version: number;
    items: CartItem[];
}

// ─── localStorage ─────────────────────────────────────────────────────────────

const STORAGE_KEY = 'valangel_cart_v1';
const SCHEMA_VERSION = 1;

export function loadCart(): CartItem[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const parsed: PersistedCart = JSON.parse(raw);
        if (parsed.version !== SCHEMA_VERSION) return [];
        return Array.isArray(parsed.items) ? parsed.items : [];
    } catch {
        return [];
    }
}

export function saveCart(items: CartItem[]): void {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: SCHEMA_VERSION, items }));
    } catch {
        // private browsing / quota — the cart simply stays in memory
    }
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

export type CartAction =
    | { type: 'LOAD'; items: CartItem[] }
    | { type: 'ADD'; item: Omit<CartItem, 'quantity'>; quantity?: number }
    | { type: 'REMOVE'; id: number }
    | { type: 'SET_QTY'; id: number; quantity: number }
    | { type: 'CLEAR' };

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
    switch (action.type) {
        case 'LOAD':
            return action.items;

        case 'ADD': {
            const qty = Math.max(1, action.quantity ?? 1);
            const idx = state.findIndex((i) => i.id === action.item.id);
            if (idx >= 0) {
                return state.map((i, n) => (n === idx ? { ...i, quantity: i.quantity + qty } : i));
            }
            return [...state, { ...action.item, quantity: qty }];
        }

        case 'REMOVE':
            return state.filter((i) => i.id !== action.id);

        case 'SET_QTY':
            if (action.quantity < 1) return state.filter((i) => i.id !== action.id);
            return state.map((i) => (i.id === action.id ? { ...i, quantity: action.quantity } : i));

        case 'CLEAR':
            return [];

        default:
            return state;
    }
}

// ─── Derived helpers ──────────────────────────────────────────────────────────

export function cartItemCount(items: CartItem[]): number {
    return items.reduce((sum, i) => sum + i.quantity, 0);
}

export function cartSubtotal(items: CartItem[]): number {
    return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}

/** Free shipping threshold used by the progress bar in the cart drawer. */
export const FREE_SHIPPING_THRESHOLD = 60;

export function shippingProgress(subtotal: number): { remaining: number; pct: number } {
    const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
    const pct = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
    return { remaining, pct };
}

// ─── WhatsApp order builder ───────────────────────────────────────────────────

interface OrderParams {
    items: CartItem[];
    subtotal: number;
    exchangeRate?: number | null;
    customerName: string;
    customerPhone: string;
    address: string;
    notes?: string;
    coords: { lat: number; lng: number } | null;
}

export function buildOrderWaMessage(params: OrderParams): string {
    const { items, subtotal, exchangeRate, customerName, customerPhone, address, notes, coords } = params;
    const subtotalVes = toVes(subtotal, exchangeRate);

    const lines: string[] = [
        '🌸 *Nuevo pedido — Valangel Skin*',
        '',
        `*Cliente:* ${customerName}`,
        `*Teléfono:* ${customerPhone}`,
        '',
        '*Productos:*',
        ...items.map(
            (i) => `• ${i.name}${i.size ? ` (${i.size})` : ''} — Ref: ${i.sku} × ${i.quantity} → ${usd(i.price * i.quantity)}`
        ),
        '',
        subtotalVes != null ? `*Subtotal:* ${usd(subtotal)} (${ves(subtotalVes)})` : `*Subtotal:* ${usd(subtotal)}`,
        '*Envío:* a coordinar con la asesora',
        '',
        '*Dirección de envío:*',
        address,
    ];

    if (coords) lines.push(`📍 https://maps.google.com/?q=${coords.lat},${coords.lng}`);
    if (notes?.trim()) lines.push('', '*Notas:*', notes.trim());

    lines.push('', '_Pedido enviado desde valangelskin.com_');

    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(lines.join('\n'))}`;
}

/** Single-product enquiry link used on cards and the quick view. */
export function buildProductWaLink(name: string, sku: string): string {
    const msg = `Hola 🌸 Me interesa *${name}* (Ref: ${sku}). ¿Está disponible?`;
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}
