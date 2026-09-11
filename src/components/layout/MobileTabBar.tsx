import React from 'react';
import { Home, Search, ShoppingBag, Heart, Sparkles } from 'lucide-react';
import { u, isActive } from '../../lib/url';

interface Props {
    pathname: string;
    cartCount: number;
    wishlistCount: number;
    onOpenCart: () => void;
    onOpenSearch: () => void;
}

/**
 * Persistent bottom tab bar on phones. E-commerce browsing is thumb-driven, and
 * a fixed bar means the cart and search are always one tap away without
 * scrolling back to the header.
 */
const MobileTabBar: React.FC<Props> = ({ pathname, cartCount, wishlistCount, onOpenCart, onOpenSearch }) => {
    const item = (active: boolean) =>
        `relative flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors ${
            active ? 'text-wine' : 'text-muted'
        }`;

    const badge = (n: number) =>
        n > 0 ? (
            <span className="absolute top-1 right-[22%] min-w-[15px] h-[15px] px-1 rounded-full bg-wine text-white text-[8px] grid place-items-center tabular-nums leading-none">
                {n > 9 ? '9+' : n}
            </span>
        ) : null;

    return (
        <nav
            className="sm:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-line pb-safe"
            aria-label="Navegación rápida"
        >
            <div className="flex h-14 items-stretch">
                <a href={u('/')} className={item(isActive(u('/'), pathname))} aria-current={isActive(u('/'), pathname) ? 'page' : undefined}>
                    <Home className="w-[18px] h-[18px]" strokeWidth={1.4} />
                    <span className="text-[9px] tracking-[0.1em] uppercase">Inicio</span>
                </a>

                <a href={u('/tienda')} className={item(isActive(u('/tienda'), pathname))} aria-current={isActive(u('/tienda'), pathname) ? 'page' : undefined}>
                    <Sparkles className="w-[18px] h-[18px]" strokeWidth={1.4} />
                    <span className="text-[9px] tracking-[0.1em] uppercase">Tienda</span>
                </a>

                <button type="button" onClick={onOpenSearch} className={item(false)} aria-label="Buscar">
                    <Search className="w-[18px] h-[18px]" strokeWidth={1.4} />
                    <span className="text-[9px] tracking-[0.1em] uppercase">Buscar</span>
                </button>

                <a href={u('/favoritos')} className={item(isActive(u('/favoritos'), pathname))}>
                    <Heart className="w-[18px] h-[18px]" strokeWidth={1.4} />
                    {badge(wishlistCount)}
                    <span className="text-[9px] tracking-[0.1em] uppercase">Favoritos</span>
                </a>

                <button type="button" onClick={onOpenCart} className={item(false)} aria-label={`Carrito, ${cartCount} artículos`}>
                    <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.4} />
                    {badge(cartCount)}
                    <span className="text-[9px] tracking-[0.1em] uppercase">Bolsa</span>
                </button>
            </div>
        </nav>
    );
};

export default MobileTabBar;
