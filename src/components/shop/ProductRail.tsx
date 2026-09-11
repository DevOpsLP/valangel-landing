import React, { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Product } from '../../lib/catalog';
import type { CartItem } from '../../lib/cart';
import ProductCard from './ProductCard';

interface Props {
    products: Product[];
    loading?: boolean;
    exchangeRate: number | null;
    onQuickView: (p: Product) => void;
    onAddToCart?: (item: Omit<CartItem, 'quantity'>) => void;
    /** Rendered as the rail's accessible name. */
    label: string;
}

const CardSkeleton: React.FC = () => (
    <div className="w-[46vw] sm:w-56 shrink-0">
        <div className="aspect-square rounded-2xl bg-gradient-to-r from-snow via-white to-snow animate-shimmer" />
        <div className="pt-3 flex flex-col gap-2">
            <div className="h-2 w-12 rounded-full bg-snow" />
            <div className="h-3 w-3/4 rounded-full bg-snow" />
            <div className="h-3 w-1/3 rounded-full bg-snow" />
        </div>
    </div>
);

/**
 * Horizontal snap rail. Native scrolling on touch (no JS needed to swipe) with
 * arrow buttons layered on top for pointer devices.
 */
const ProductRail: React.FC<Props> = ({ products, loading, exchangeRate, onQuickView, onAddToCart, label }) => {
    const railRef = useRef<HTMLDivElement>(null);
    const [atStart, setAtStart] = useState(true);
    const [atEnd, setAtEnd] = useState(false);

    const updateEdges = () => {
        const el = railRef.current;
        if (!el) return;
        setAtStart(el.scrollLeft < 8);
        setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 8);
    };

    useEffect(() => {
        updateEdges();
        const el = railRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateEdges, { passive: true });
        window.addEventListener('resize', updateEdges);
        return () => {
            el.removeEventListener('scroll', updateEdges);
            window.removeEventListener('resize', updateEdges);
        };
    }, [products.length]);

    const scrollBy = (dir: 1 | -1) => {
        const el = railRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
    };

    const Arrow: React.FC<{ dir: 1 | -1; disabled: boolean }> = ({ dir, disabled }) => (
        <button
            type="button"
            onClick={() => scrollBy(dir)}
            disabled={disabled}
            aria-label={dir === 1 ? 'Ver más productos' : 'Ver productos anteriores'}
            className={`hidden md:grid place-items-center w-10 h-10 rounded-full border border-line
                        bg-white/95 backdrop-blur-sm text-wine shadow-[0_6px_20px_-10px_rgba(110,42,56,.6)]
                        transition-all duration-300 hover:bg-rose-light disabled:opacity-0 disabled:pointer-events-none
                        absolute top-[38%] z-20 ${dir === 1 ? 'right-2' : 'left-2'}`}
        >
            {dir === 1 ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
    );

    return (
        <div className="relative">
            <Arrow dir={-1} disabled={atStart} />
            <Arrow dir={1} disabled={atEnd} />

            <div
                ref={railRef}
                className="rail gap-4 sm:gap-6 pb-2 pr-4"
                role="region"
                aria-label={label}
                tabIndex={0}
            >
                {loading
                    ? Array.from({ length: 5 }).map((_, i) => <CardSkeleton key={i} />)
                    : products.map((p) => (
                          <div key={p.id} className="w-[46vw] sm:w-56 lg:w-60">
                              <ProductCard
                                  product={p}
                                  exchangeRate={exchangeRate}
                                  onQuickView={onQuickView}
                                  onAddToCart={onAddToCart}
                              />
                          </div>
                      ))}
            </div>
        </div>
    );
};

export default ProductRail;
