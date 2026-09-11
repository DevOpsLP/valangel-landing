/**
 * The /tienda storefront: search, category + brand + concern filters, sorting,
 * and a responsive grid. Filter state is mirrored into the URL so a filtered
 * view can be shared or reached from a category circle on the home page.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { SlidersHorizontal, X, Search, ChevronDown } from 'lucide-react';
import { CartProvider, useCart } from '../../context/CartContext';
import { useCatalog } from '../../lib/productStore';
import { useExchangeRate } from '../../lib/exchangeRateStore';
import { categories, brands, concerns, type Product } from '../../lib/catalog';
import ProductCard from './ProductCard';
import QuickView from './QuickView';

type SortKey = 'relevancia' | 'precio_asc' | 'precio_desc' | 'valoracion' | 'nuevos';

const SORTS: Array<{ value: SortKey; label: string }> = [
    { value: 'relevancia', label: 'Relevancia' },
    { value: 'precio_asc', label: 'Precio: menor a mayor' },
    { value: 'precio_desc', label: 'Precio: mayor a menor' },
    { value: 'valoracion', label: 'Mejor valorados' },
    { value: 'nuevos', label: 'Novedades' },
];

const GridSkeleton: React.FC = () => (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-9">
        {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
                <div className="aspect-square rounded-2xl bg-gradient-to-r from-snow via-white to-snow animate-shimmer" />
                <div className="pt-3 flex flex-col gap-2">
                    <div className="h-2 w-12 rounded-full bg-snow" />
                    <div className="h-3 w-3/4 rounded-full bg-snow" />
                    <div className="h-3 w-1/3 rounded-full bg-snow" />
                </div>
            </div>
        ))}
    </div>
);

const Chip: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode; count?: number }> = ({
    active, onClick, children, count,
}) => (
    <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[11px] tracking-[0.12em] uppercase
                    border transition-all duration-300 whitespace-nowrap
                    ${active
                        ? 'bg-wine text-white border-wine'
                        : 'bg-white text-muted border-line hover:border-taupe hover:text-wine'}`}
    >
        {children}
        {count != null && <span className={`text-[9px] tabular-nums ${active ? 'opacity-70' : 'opacity-50'}`}>{count}</span>}
    </button>
);

const Inner: React.FC<Props> = ({ initialCategory, initialBrand, hideBrandFilter }) => {
    const { products, loading, source } = useCatalog();
    const exchangeRate = useExchangeRate();
    const { add } = useCart();

    const [query, setQuery] = useState('');
    const [category, setCategory] = useState(initialCategory ?? 'todos');
    const [brand, setBrand] = useState(initialBrand ?? 'todas');
    const [concern, setConcern] = useState('todas');
    const [sort, setSort] = useState<SortKey>('relevancia');
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [preview, setPreview] = useState<Product | null>(null);

    // ── Read filters out of the URL on mount (shareable filtered views) ────
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const q = params.get('q');
        const cat = params.get('categoria');
        const br = params.get('marca');
        const co = params.get('necesidad');
        if (q) setQuery(q);
        if (cat) setCategory(cat);
        if (br) setBrand(br);
        if (co) setConcern(co);
    }, []);

    // Deep link to a single product (?producto=slug) once the catalog is in
    useEffect(() => {
        if (loading || !products.length) return;
        const slug = new URLSearchParams(window.location.search).get('producto');
        if (!slug) return;
        const match = products.find((p) => p.slug === slug || String(p.id) === slug);
        if (match) setPreview(match);
    }, [loading, products]);

    // ── Mirror filters back into the URL, without adding history entries ───
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const set = (key: string, value: string, empty: string) =>
            value && value !== empty ? params.set(key, value) : params.delete(key);
        set('q', query, '');
        set('categoria', category, 'todos');
        set('marca', brand, 'todas');
        set('necesidad', concern, 'todas');
        params.delete('producto');
        const qs = params.toString();
        window.history.replaceState({}, '', `${window.location.pathname}${qs ? `?${qs}` : ''}`);
    }, [query, category, brand, concern]);

    const counts = useMemo(() => {
        const byCat = new Map<string, number>();
        const byBrand = new Map<string, number>();
        for (const p of products) {
            if (p.category?.slug) byCat.set(p.category.slug, (byCat.get(p.category.slug) ?? 0) + 1);
            if (p.brand?.slug) byBrand.set(p.brand.slug, (byBrand.get(p.brand.slug) ?? 0) + 1);
        }
        return { byCat, byBrand };
    }, [products]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        let list = products.filter((p) => {
            if (category !== 'todos' && p.category?.slug !== category) return false;
            if (brand !== 'todas' && p.brand?.slug !== brand) return false;
            if (concern !== 'todas' && !p.concerns?.includes(concern)) return false;
            if (q) {
                const haystack = `${p.name} ${p.sku} ${p.brand?.name ?? ''} ${p.description ?? ''}`.toLowerCase();
                if (!haystack.includes(q)) return false;
            }
            return true;
        });

        list = list.slice();
        switch (sort) {
            case 'precio_asc': list.sort((a, b) => (a.price ?? Infinity) - (b.price ?? Infinity)); break;
            case 'precio_desc': list.sort((a, b) => (b.price ?? -Infinity) - (a.price ?? -Infinity)); break;
            case 'valoracion': list.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)); break;
            case 'nuevos': list.sort((a, b) => Number(b.badge === 'Nuevo') - Number(a.badge === 'Nuevo')); break;
            default: list.sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)));
        }
        return list;
    }, [products, query, category, brand, concern, sort]);

    const activeCount = [category !== 'todos', brand !== 'todas', concern !== 'todas', query !== ''].filter(Boolean).length;

    const reset = () => {
        setQuery(''); setCategory('todos'); setBrand('todas'); setConcern('todas'); setSort('relevancia');
    };

    const filterPanel = (
        <div className="flex flex-col gap-6">
            <div>
                <h3 className="eyebrow mb-3">Categoría</h3>
                <div className="flex flex-wrap gap-2">
                    <Chip active={category === 'todos'} onClick={() => setCategory('todos')} count={products.length}>Todos</Chip>
                    {categories.map((c) => (
                        <Chip key={c.slug} active={category === c.slug} onClick={() => setCategory(c.slug)} count={counts.byCat.get(c.slug) ?? 0}>
                            {c.name}
                        </Chip>
                    ))}
                </div>
            </div>

            <div className={hideBrandFilter ? 'hidden' : ''}>
                <h3 className="eyebrow mb-3">Marca</h3>
                <div className="flex flex-wrap gap-2">
                    <Chip active={brand === 'todas'} onClick={() => setBrand('todas')}>Todas</Chip>
                    {brands
                        .filter((b) => (counts.byBrand.get(b.slug) ?? 0) > 0)
                        .map((b) => (
                            <Chip key={b.slug} active={brand === b.slug} onClick={() => setBrand(b.slug)} count={counts.byBrand.get(b.slug)}>
                                {b.name}
                            </Chip>
                        ))}
                </div>
            </div>

            <div>
                <h3 className="eyebrow mb-3">Necesidad de tu piel</h3>
                <div className="flex flex-wrap gap-2">
                    <Chip active={concern === 'todas'} onClick={() => setConcern('todas')}>Todas</Chip>
                    {concerns.map((c) => (
                        <Chip key={c.slug} active={concern === c.slug} onClick={() => setConcern(c.slug)}>{c.name}</Chip>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* ── Search + controls ─────────────────────────────────────── */}
            <div className="flex flex-col gap-4">
                <div className="flex gap-2 items-stretch">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" strokeWidth={1.4} />
                        <input
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Buscar producto, marca o ingrediente…"
                            aria-label="Buscar en la tienda"
                            className="w-full h-12 pl-11 pr-4 rounded-full border border-line bg-white text-sm text-ink
                                       placeholder:text-muted/70 focus:border-taupe focus:outline-none transition-colors"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => setFiltersOpen((v) => !v)}
                        aria-expanded={filtersOpen}
                        className="lg:hidden h-12 px-5 rounded-full border border-line bg-white text-[11px] uppercase tracking-[0.14em] text-wine
                                   inline-flex items-center gap-2 shrink-0"
                    >
                        <SlidersHorizontal className="w-4 h-4" strokeWidth={1.4} />
                        Filtros
                        {activeCount > 0 && <span className="w-4 h-4 rounded-full bg-wine text-white text-[9px] grid place-items-center">{activeCount}</span>}
                    </button>
                </div>

                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <p className="text-xs text-muted" aria-live="polite">
                        {loading ? 'Cargando productos…' : `${filtered.length} producto${filtered.length !== 1 ? 's' : ''}`}
                        {!loading && source === 'fallback' && (
                            <span className="ml-2 text-[10px] uppercase tracking-[0.14em] text-taupe">· catálogo demo</span>
                        )}
                    </p>

                    <label className="relative inline-flex items-center">
                        <span className="sr-only">Ordenar por</span>
                        <select
                            value={sort}
                            onChange={(e) => setSort(e.target.value as SortKey)}
                            className="appearance-none h-10 pl-4 pr-9 rounded-full border border-line bg-white text-[11px] uppercase tracking-[0.12em] text-wine focus:outline-none focus:border-taupe"
                        >
                            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 w-3.5 h-3.5 text-muted pointer-events-none" />
                    </label>
                </div>
            </div>

            {/* ── Layout: sidebar on desktop, collapsible panel on mobile ─ */}
            <div className="mt-8 grid lg:grid-cols-[220px_1fr] gap-8 lg:gap-12">
                <aside className={`${filtersOpen ? 'block' : 'hidden'} lg:block`}>
                    <div className="lg:sticky lg:top-28 flex flex-col gap-6">
                        {filterPanel}
                        {activeCount > 0 && (
                            <button onClick={reset} className="self-start inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.14em] text-wine underline underline-offset-4">
                                <X className="w-3 h-3" /> Limpiar filtros
                            </button>
                        )}
                    </div>
                </aside>

                <div>
                    {loading ? (
                        <GridSkeleton />
                    ) : filtered.length > 0 ? (
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 gap-y-9">
                            {filtered.map((p) => (
                                <ProductCard key={p.id} product={p} exchangeRate={exchangeRate} onQuickView={setPreview} onAddToCart={add} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 rounded-3xl grad-cream">
                            <p className="font-[family-name:var(--font-display)] text-2xl text-wine mb-2">Nada por aquí todavía</p>
                            <p className="text-sm text-muted max-w-sm mx-auto">
                                No encontramos productos con esos filtros. Prueba con menos filtros o escríbenos y te ayudamos a encontrarlo.
                            </p>
                            <button onClick={reset} className="btn btn-ghost mt-6">Limpiar filtros</button>
                        </div>
                    )}
                </div>
            </div>

            {preview && (
                <QuickView product={preview} exchangeRate={exchangeRate} onClose={() => setPreview(null)} onAddToCart={add} />
            )}
        </>
    );
};

interface Props {
    initialCategory?: string;
    /** Pre-selects a brand — used by /marcas/[slug]. */
    initialBrand?: string;
    /** Hides the brand chips on a page that is already scoped to one brand. */
    hideBrandFilter?: boolean;
}

const ShopBrowser: React.FC<Props> = (props) => (
    <CartProvider>
        <Inner {...props} />
    </CartProvider>
);

export default ShopBrowser;
