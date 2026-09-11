import React, { useState } from 'react';
import { Plus, Check } from 'lucide-react';
import type { Product } from '../../lib/catalog';
import { productImages } from '../../lib/catalog';
import { STRAPI_URL } from '../../lib/constants';
import type { CartItem } from '../../lib/cart';
import WishlistButton from '../ui/WishlistButton';
import Price from '../ui/Price';
import Stars from '../ui/Stars';

interface Props {
    product: Product;
    exchangeRate: number | null;
    onQuickView: (p: Product) => void;
    onAddToCart?: (item: Omit<CartItem, 'quantity'>) => void;
    /** Compact variant used inside horizontal rails. */
    compact?: boolean;
}

const ProductCard: React.FC<Props> = ({ product, exchangeRate, onQuickView, onAddToCart, compact = false }) => {
    const images = productImages(product, STRAPI_URL);
    const [added, setAdded] = useState(false);
    const soldOut = product.stock != null && product.stock <= 0;

    const handleAdd = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!onAddToCart || soldOut) return;
        onAddToCart({
            id: product.id,
            name: product.name,
            sku: product.sku,
            price: product.price ?? 0,
            imageUrl: images[0] ?? null,
            brand: product.brand?.name ?? null,
            size: product.size ?? null,
        });
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
    };

    return (
        <article className={`group relative flex flex-col ${compact ? '' : 'h-full'}`}>
            {/* ── Image ─────────────────────────────────────────────────── */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => onQuickView(product)}
                    aria-label={`Ver detalle de ${product.name}`}
                    className="relative block w-full overflow-hidden rounded-2xl grad-cream aspect-square"
                >
                    {images[0] ? (
                        <img
                            src={images[0]}
                            alt={product.name}
                            loading="lazy"
                            decoding="async"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(.22,1,.36,1)] group-hover:scale-[1.06]"
                        />
                    ) : (
                        <span className="absolute inset-0 grid place-items-center text-muted text-xs">Sin imagen</span>
                    )}

                    {/* Second shot cross-fades in on hover when the product has one */}
                    {images[1] && (
                        <img
                            src={images[1]}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        />
                    )}

                    {product.badge && (
                        <span className="absolute top-2.5 left-2.5 bg-white/85 backdrop-blur-sm text-wine text-[9px] font-medium uppercase px-2.5 py-1 rounded-full tracking-[0.16em]">
                            {product.badge}
                        </span>
                    )}
                    {soldOut && (
                        <span className="absolute inset-x-0 bottom-0 bg-white/85 backdrop-blur-sm text-wine text-[10px] tracking-[0.2em] uppercase py-2 text-center">
                            Agotado
                        </span>
                    )}
                </button>

                {/* Kept outside the button so interactive elements never nest */}
                <div className="absolute top-2.5 right-2.5 z-10">
                    <WishlistButton productId={product.id} productName={product.name} />
                </div>

                {/* Quick add stays visible at all times — hover-only would be
                    unreachable on touch, which is most of this store's traffic. */}
                {onAddToCart && !soldOut && (
                    <button
                        type="button"
                        onClick={handleAdd}
                        aria-label={`Agregar ${product.name} al carrito`}
                        className={`absolute bottom-3 right-3 z-10 w-10 h-10 rounded-full grid place-items-center
                                    shadow-[0_6px_18px_-8px_rgba(110,42,56,0.6)] transition-all duration-300 active:scale-95
                                    ${added ? 'bg-wine text-white' : 'bg-white text-wine hover:bg-cocoa hover:text-white'}`}
                    >
                        {added ? <Check className="w-4 h-4" strokeWidth={2} /> : <Plus className="w-4 h-4" strokeWidth={1.6} />}
                    </button>
                )}
            </div>

            {/* ── Meta ──────────────────────────────────────────────────── */}
            <div className="pt-3 flex flex-col gap-1">
                {product.brand && <span className="eyebrow !tracking-[0.2em] text-taupe">{product.brand.name}</span>}
                <h3 className="font-[family-name:var(--font-sans)] text-[13px] font-normal text-ink leading-snug line-clamp-2">
                    <button type="button" onClick={() => onQuickView(product)} className="text-left hover:text-wine transition-colors">
                        {product.name}
                    </button>
                </h3>
                {!compact && <Stars rating={product.rating} count={product.reviews_count} />}
                <div className="mt-0.5">
                    <Price
                        price={product.price}
                        compareAt={product.compare_at_price}
                        priceVes={product.price_ves}
                        exchangeRate={exchangeRate}
                    />
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
