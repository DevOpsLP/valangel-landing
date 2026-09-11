import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useCatalog } from '../../lib/productStore';
import { productImages } from '../../lib/catalog';
import { STRAPI_URL } from '../../lib/constants';
import { popularSearches } from '../../lib/nav';
import { u } from '../../lib/url';
import { usd } from '../../lib/format';
import { useInertWhenClosed } from '../../lib/useInert';

interface Props {
    open: boolean;
    onClose: () => void;
}

/** Full-width search panel with live results straight from the loaded catalog. */
const SearchOverlay: React.FC<Props> = ({ open, onClose }) => {
    const { products } = useCatalog();
    const [query, setQuery] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    useInertWhenClosed(rootRef, open);

    useEffect(() => {
        if (!open) return;
        const t = setTimeout(() => inputRef.current?.focus(), 120);
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            clearTimeout(t);
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (q.length < 2) return [];
        return products
            .filter((p) => `${p.name} ${p.brand?.name ?? ''} ${p.sku} ${p.category?.name ?? ''}`.toLowerCase().includes(q))
            .slice(0, 6);
    }, [products, query]);

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;
        window.location.href = `${u('/tienda')}?q=${encodeURIComponent(query.trim())}`;
    };

    return (
        <div
            ref={rootRef}
            className={`fixed inset-0 z-[75] transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            aria-hidden={!open}
        >
            <div className="absolute inset-0 bg-wine/25 backdrop-blur-sm" onClick={onClose} />

            <div
                className={`relative bg-white transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]
                            ${open ? 'translate-y-0' : '-translate-y-full'} max-h-[85dvh] overflow-y-auto`}
                role="dialog"
                aria-modal={open}
                aria-label="Buscador"
            >
                <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
                    <form onSubmit={submit} className="relative">
                        <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-taupe" strokeWidth={1.3} />
                        <input
                            ref={inputRef}
                            type="search"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="¿Qué busca tu piel hoy?"
                            aria-label="Buscar productos"
                            className="w-full pl-8 pr-10 py-3 bg-transparent border-b border-line
                                       font-[family-name:var(--font-display)] text-xl sm:text-2xl text-wine
                                       placeholder:text-mauve focus:outline-none focus:border-taupe transition-colors"
                        />
                        <button type="button" onClick={onClose} aria-label="Cerrar búsqueda" className="absolute right-0 top-1/2 -translate-y-1/2 w-9 h-9 grid place-items-center rounded-full hover:bg-rose-light text-wine transition-colors">
                            <X className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                    </form>

                    {query.trim().length < 2 ? (
                        <div className="mt-8">
                            <p className="eyebrow mb-4">Búsquedas populares</p>
                            <div className="flex flex-wrap gap-2">
                                {popularSearches.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setQuery(s)}
                                        className="px-4 py-2 rounded-full border border-line text-[11px] uppercase tracking-[0.12em] text-muted hover:border-taupe hover:text-wine transition-colors"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="mt-6">
                            <p className="eyebrow mb-3">{results.length} resultado{results.length !== 1 ? 's' : ''}</p>
                            <ul className="flex flex-col">
                                {results.map((p) => {
                                    const img = productImages(p, STRAPI_URL)[0];
                                    return (
                                        <li key={p.id}>
                                            <a
                                                href={`${u('/tienda')}?producto=${encodeURIComponent(p.slug)}`}
                                                className="flex items-center gap-4 py-3 border-b border-line group"
                                            >
                                                <span className="w-14 h-14 rounded-xl overflow-hidden grad-cream shrink-0">
                                                    {img && <img src={img} alt="" className="w-full h-full object-cover" loading="lazy" />}
                                                </span>
                                                <span className="flex-1 min-w-0">
                                                    {p.brand && <span className="block eyebrow !text-[9px] text-taupe">{p.brand.name}</span>}
                                                    <span className="block text-sm text-ink truncate group-hover:text-wine transition-colors">{p.name}</span>
                                                </span>
                                                {p.price != null && <span className="text-sm text-ink tabular-nums shrink-0">{usd(p.price)}</span>}
                                            </a>
                                        </li>
                                    );
                                })}
                            </ul>
                            <a href={`${u('/tienda')}?q=${encodeURIComponent(query.trim())}`} className="inline-flex items-center gap-2 mt-5 text-[11px] uppercase tracking-[0.16em] text-wine">
                                Ver todos los resultados <ArrowRight className="w-3.5 h-3.5" />
                            </a>
                        </div>
                    ) : (
                        <div className="mt-8 text-center py-10">
                            <p className="font-[family-name:var(--font-display)] text-xl text-wine mb-2">Sin resultados para “{query}”</p>
                            <p className="text-sm text-muted">Prueba con el nombre de la marca o del ingrediente.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SearchOverlay;
