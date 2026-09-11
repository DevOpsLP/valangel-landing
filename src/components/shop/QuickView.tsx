import React, { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import ReactMarkdown from 'react-markdown';
import { X, ChevronLeft, ChevronRight, Minus, Plus, Check } from 'lucide-react';
import type { Product } from '../../lib/catalog';
import { productImages, concernBySlug } from '../../lib/catalog';
import { STRAPI_URL } from '../../lib/constants';
import { buildProductWaLink, type CartItem } from '../../lib/cart';
import { WhatsAppIcon } from '../ui/icons';
import WishlistButton from '../ui/WishlistButton';
import ShareButton from '../ui/ShareButton';
import Price from '../ui/Price';
import Stars from '../ui/Stars';

interface Props {
    product: Product;
    exchangeRate: number | null;
    onClose: () => void;
    onAddToCart?: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void;
}

const QuickView: React.FC<Props> = ({ product, exchangeRate, onClose, onAddToCart }) => {
    const images = productImages(product, STRAPI_URL);
    const [index, setIndex] = useState(0);
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const [tab, setTab] = useState<'descripcion' | 'uso' | 'ingredientes'>('descripcion');
    const panelRef = useRef<HTMLDivElement>(null);
    const soldOut = product.stock != null && product.stock <= 0;

    // Escape to close + body scroll lock while the dialog owns the screen
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        panelRef.current?.focus();
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [onClose]);

    const handleAdd = () => {
        if (!onAddToCart || soldOut) return;
        onAddToCart(
            {
                id: product.id,
                name: product.name,
                sku: product.sku,
                price: product.price ?? 0,
                imageUrl: images[0] ?? null,
                brand: product.brand?.name ?? null,
                size: product.size ?? null,
            },
            qty
        );
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
    };

    const tabs = [
        { id: 'descripcion' as const, label: 'Descripción', show: Boolean(product.description) },
        { id: 'uso' as const, label: 'Cómo usarlo', show: Boolean(product.how_to_use) },
        { id: 'ingredientes' as const, label: 'Ingredientes clave', show: Boolean(product.key_ingredients?.length) },
    ].filter((t) => t.show);

    const activeTab = tabs.some((t) => t.id === tab) ? tab : tabs[0]?.id;

    const modal = (
        <div className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center sm:p-6" role="dialog" aria-modal="true" aria-label={product.name}>
            <div className="absolute inset-0 bg-wine/30 backdrop-blur-sm animate-[fade-up_.3s_ease]" onClick={onClose} aria-hidden="true" />

            <div
                ref={panelRef}
                tabIndex={-1}
                className="relative z-10 bg-white w-full sm:max-w-4xl max-h-[92dvh] sm:max-h-[88vh]
                           rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col sm:flex-row
                           shadow-[0_-20px_60px_-30px_rgba(110,42,56,.5)] sm:shadow-2xl animate-fade-up outline-none"
            >
                {/* Grab handle — signals the sheet can be dismissed on mobile */}
                <div className="sm:hidden pt-3 pb-1 flex justify-center shrink-0" onClick={onClose}>
                    <span className="w-10 h-1 rounded-full bg-line" />
                </div>

                <button
                    onClick={onClose}
                    aria-label="Cerrar"
                    className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full grid place-items-center bg-white/80 backdrop-blur-sm text-wine hover:bg-rose-light transition-colors"
                >
                    <X className="w-4 h-4" strokeWidth={1.5} />
                </button>

                {/* ── Gallery ───────────────────────────────────────────── */}
                <div className="relative sm:w-[46%] shrink-0 grad-cream">
                    <div className="relative aspect-[4/3] sm:aspect-auto sm:h-full">
                        {images[index] ? (
                            <img key={index} src={images[index]} alt={`${product.name} — imagen ${index + 1}`} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <span className="absolute inset-0 grid place-items-center text-muted text-xs">Sin imagen</span>
                        )}

                        {images.length > 1 && (
                            <>
                                <button
                                    onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
                                    aria-label="Imagen anterior"
                                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center bg-white/80 text-wine hover:bg-white transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => setIndex((i) => (i + 1) % images.length)}
                                    aria-label="Imagen siguiente"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full grid place-items-center bg-white/80 text-wine hover:bg-white transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                                <div className="absolute bottom-3 inset-x-0 flex justify-center gap-1.5">
                                    {images.map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setIndex(i)}
                                            aria-label={`Ir a la imagen ${i + 1}`}
                                            className={`h-1.5 rounded-full transition-all ${i === index ? 'w-5 bg-wine' : 'w-1.5 bg-wine/30'}`}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* ── Details ───────────────────────────────────────────── */}
                <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
                    <div className="flex-1 overflow-y-auto px-5 sm:px-8 pt-5 sm:pt-8 pb-4 flex flex-col gap-4">
                        {product.brand && <span className="eyebrow text-taupe">{product.brand.name}</span>}

                        <h2 className="font-[family-name:var(--font-display)] text-2xl sm:text-[28px] leading-tight text-wine pr-8">
                            {product.name}
                        </h2>

                        <div className="flex items-center gap-3 flex-wrap">
                            <Stars rating={product.rating} count={product.reviews_count} />
                            {product.size && <span className="text-[11px] text-muted">{product.size}</span>}
                            {product.stock != null && product.stock > 0 && product.stock <= 5 && (
                                <span className="text-[10px] uppercase tracking-[0.18em] text-wine bg-rose-light px-2 py-1 rounded-full">
                                    Quedan {product.stock}
                                </span>
                            )}
                        </div>

                        <Price
                            price={product.price}
                            compareAt={product.compare_at_price}
                            priceVes={product.price_ves}
                            exchangeRate={exchangeRate}
                            size="lg"
                        />

                        {product.concerns?.length ? (
                            <div className="flex flex-wrap gap-1.5">
                                {product.concerns.map((slug) => (
                                    <span key={slug} className="text-[10px] uppercase tracking-[0.14em] text-taupe border border-line rounded-full px-2.5 py-1">
                                        {concernBySlug.get(slug)?.name ?? slug}
                                    </span>
                                ))}
                            </div>
                        ) : null}

                        {tabs.length > 0 && (
                            <div className="mt-1">
                                <div className="flex gap-5 border-b border-line" role="tablist">
                                    {tabs.map((t) => (
                                        <button
                                            key={t.id}
                                            role="tab"
                                            aria-selected={activeTab === t.id}
                                            onClick={() => setTab(t.id)}
                                            className={`pb-2 text-[11px] uppercase tracking-[0.16em] transition-colors border-b-2 -mb-px
                                                        ${activeTab === t.id ? 'text-wine border-wine' : 'text-muted border-transparent hover:text-wine'}`}
                                        >
                                            {t.label}
                                        </button>
                                    ))}
                                </div>

                                <div className="pt-3 text-[13px] leading-relaxed text-muted">
                                    {activeTab === 'descripcion' && product.description && (
                                        <div className="prose prose-sm max-w-none prose-p:my-2 prose-strong:text-ink prose-strong:font-medium">
                                            <ReactMarkdown>{product.description}</ReactMarkdown>
                                        </div>
                                    )}
                                    {activeTab === 'uso' && <p>{product.how_to_use}</p>}
                                    {activeTab === 'ingredientes' && (
                                        <ul className="flex flex-col gap-1.5">
                                            {product.key_ingredients?.map((ing) => (
                                                <li key={ing} className="flex items-start gap-2">
                                                    <span className="mt-1.5 w-1 h-1 rounded-full bg-mauve shrink-0" />
                                                    {ing}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        )}

                        <p className="text-[11px] text-muted mt-auto pt-2">
                            Ref. {product.sku}
                            {product.brand?.origin ? ` · ${product.brand.origin}` : ''}
                        </p>
                    </div>

                    {/* Sticky action bar */}
                    <div className="shrink-0 border-t border-line px-5 sm:px-8 py-4 bg-white flex flex-col gap-3 pb-safe">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center border border-line rounded-full overflow-hidden shrink-0">
                                <button onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Reducir cantidad" className="w-10 h-10 grid place-items-center text-muted hover:text-wine transition-colors">
                                    <Minus className="w-3.5 h-3.5" />
                                </button>
                                <span className="w-8 text-center text-sm tabular-nums text-ink" aria-live="polite">{qty}</span>
                                <button onClick={() => setQty((q) => Math.min(99, q + 1))} aria-label="Aumentar cantidad" className="w-10 h-10 grid place-items-center text-muted hover:text-wine transition-colors">
                                    <Plus className="w-3.5 h-3.5" />
                                </button>
                            </div>

                            {onAddToCart && (
                                <button
                                    onClick={handleAdd}
                                    disabled={soldOut}
                                    className={`btn flex-1 ${added ? 'bg-wine text-white' : 'btn-primary'} disabled:bg-snow disabled:text-muted disabled:shadow-none disabled:border disabled:border-line`}
                                >
                                    {soldOut ? 'Agotado' : added ? (<><Check className="w-3.5 h-3.5" /> Agregado</>) : 'Agregar al carrito'}
                                </button>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <a
                                href={buildProductWaLink(product.name, product.sku)}
                                target="_blank"
                                rel="noreferrer"
                                className="btn btn-ghost flex-1 !py-3"
                            >
                                <WhatsAppIcon className="w-3.5 h-3.5" />
                                Consultar
                            </a>
                            <ShareButton slug={product.slug} productId={product.id} productName={product.name} size="md" />
                            <WishlistButton productId={product.id} productName={product.name} size="md" className="border border-line" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    if (typeof document === 'undefined') return null;
    return ReactDOM.createPortal(modal, document.body);
};

export default QuickView;
