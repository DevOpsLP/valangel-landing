/** /favoritos — the products this browser has hearted. */
import React, { useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import { CartProvider, useCart } from '../../context/CartContext';
import { useCatalog } from '../../lib/productStore';
import { useExchangeRate } from '../../lib/exchangeRateStore';
import { useWishlist, wishlistStore } from '../../lib/wishlistStore';
import type { Product } from '../../lib/catalog';
import ProductCard from './ProductCard';
import QuickView from './QuickView';
import { u } from '../../lib/url';

const Inner: React.FC = () => {
    const { products, loading } = useCatalog();
    const exchangeRate = useExchangeRate();
    const { ids } = useWishlist();
    const { add } = useCart();
    const [preview, setPreview] = useState<Product | null>(null);

    const saved = useMemo(() => products.filter((p) => ids.includes(p.id)), [products, ids]);

    if (loading) {
        return <p className="text-sm text-muted">Cargando tus favoritos…</p>;
    }

    if (!saved.length) {
        return (
            <div className="text-center py-16 rounded-3xl grad-cream">
                <span className="w-16 h-16 mx-auto rounded-full bg-white grid place-items-center mb-4">
                    <Heart className="w-6 h-6 text-mauve" strokeWidth={1.2} />
                </span>
                <p className="font-[family-name:var(--font-display)] text-2xl text-wine mb-2">Todavía no guardas nada</p>
                <p className="text-sm text-muted max-w-sm mx-auto leading-relaxed">
                    Toca el corazón en cualquier producto para guardarlo aquí y encontrarlo cuando estés lista.
                </p>
                <a href={u('/tienda')} className="btn btn-primary mt-6">Explorar la tienda</a>
            </div>
        );
    }

    return (
        <>
            <div className="flex items-center justify-between mb-6">
                <p className="text-xs text-muted" aria-live="polite">
                    {saved.length} producto{saved.length !== 1 ? 's' : ''} guardado{saved.length !== 1 ? 's' : ''}
                </p>
                <button
                    onClick={() => wishlistStore.clear()}
                    className="text-[11px] uppercase tracking-[0.14em] text-wine underline underline-offset-4"
                >
                    Vaciar lista
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-9">
                {saved.map((p) => (
                    <ProductCard key={p.id} product={p} exchangeRate={exchangeRate} onQuickView={setPreview} onAddToCart={add} />
                ))}
            </div>

            {preview && <QuickView product={preview} exchangeRate={exchangeRate} onClose={() => setPreview(null)} onAddToCart={add} />}
        </>
    );
};

const WishlistBrowser: React.FC = () => (
    <CartProvider>
        <Inner />
    </CartProvider>
);

export default WishlistBrowser;
