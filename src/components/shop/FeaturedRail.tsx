/**
 * Home-page product rail island.
 *
 * Owns its own CartProvider (a separate React root from the header) — the two
 * stay in sync through the module-level cartStore.
 */
import React, { useMemo, useState } from 'react';
import { CartProvider, useCart } from '../../context/CartContext';
import { useCatalog } from '../../lib/productStore';
import { useExchangeRate } from '../../lib/exchangeRateStore';
import { bestSellers, byCategory, type Product } from '../../lib/catalog';
import ProductRail from './ProductRail';
import QuickView from './QuickView';

interface Props {
    /** 'best-sellers' or a category slug present in the catalog. */
    mode?: string;
    limit?: number;
    label: string;
}

const Inner: React.FC<Props> = ({ mode = 'best-sellers', limit = 10, label }) => {
    const { products, loading } = useCatalog();
    const exchangeRate = useExchangeRate();
    const { add } = useCart();
    const [preview, setPreview] = useState<Product | null>(null);

    const list = useMemo(() => {
        const base = mode === 'best-sellers' ? bestSellers(products) : byCategory(products, mode);
        return (base.length ? base : products).slice(0, limit);
    }, [products, mode, limit]);

    return (
        <>
            <ProductRail
                products={list}
                loading={loading}
                exchangeRate={exchangeRate}
                onQuickView={setPreview}
                onAddToCart={add}
                label={label}
            />
            {preview && (
                <QuickView
                    product={preview}
                    exchangeRate={exchangeRate}
                    onClose={() => setPreview(null)}
                    onAddToCart={add}
                />
            )}
        </>
    );
};

const FeaturedRail: React.FC<Props> = (props) => (
    <CartProvider>
        <Inner {...props} />
    </CartProvider>
);

export default FeaturedRail;
