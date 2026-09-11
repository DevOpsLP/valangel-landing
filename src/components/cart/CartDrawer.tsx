import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, ShoppingBag, Truck } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import CartItemRow from './CartItemRow';
import { useExchangeRate } from '../../lib/exchangeRateStore';
import { usd, ves, toVes } from '../../lib/format';
import { shippingProgress, FREE_SHIPPING_THRESHOLD } from '../../lib/cart';
import { u } from '../../lib/url';
import { useInertWhenClosed } from '../../lib/useInert';

const CartDrawer: React.FC = () => {
    const { items, subtotal, itemCount, remove, setQty, isDrawerOpen, closeDrawer, openCheckout } = useCart();
    const [mounted, setMounted] = useState(false);
    const panelRef = useRef<HTMLElement>(null);
    useInertWhenClosed(panelRef, isDrawerOpen);
    const exchangeRate = useExchangeRate();
    const subtotalVes = toVes(subtotal, exchangeRate);
    const { remaining, pct } = shippingProgress(subtotal);

    useEffect(() => setMounted(true), []);

    // Escape closes, and the page behind must not scroll while the drawer is up
    useEffect(() => {
        if (!isDrawerOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeDrawer();
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [isDrawerOpen, closeDrawer]);

    const drawer = (
        <>
            <div
                className={`fixed inset-0 z-[60] bg-wine/25 backdrop-blur-[2px] transition-opacity duration-400
                            ${isDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeDrawer}
                aria-hidden="true"
            />

            <aside
                ref={panelRef}
                className={`fixed right-0 top-0 h-[100dvh] w-full max-w-[420px] bg-white z-[60] flex flex-col
                            shadow-[-24px_0_60px_-40px_rgba(110,42,56,.6)]
                            transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]
                            ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
                role="dialog"
                aria-modal={isDrawerOpen}
                aria-label="Carrito de compras"
                aria-hidden={!isDrawerOpen}
            >
                <header className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
                    <h2 className="font-[family-name:var(--font-display)] text-lg text-wine flex items-center gap-2">
                        Mi bolsa
                        {itemCount > 0 && <span className="text-[11px] font-[family-name:var(--font-sans)] text-muted tabular-nums">({itemCount})</span>}
                    </h2>
                    <button onClick={closeDrawer} aria-label="Cerrar carrito" className="w-9 h-9 grid place-items-center rounded-full hover:bg-rose-light text-wine transition-colors">
                        <X className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                </header>

                {/* Free-shipping progress */}
                {items.length > 0 && (
                    <div className="px-5 py-3 bg-snow border-b border-line shrink-0">
                        <p className="text-[11px] text-muted flex items-center gap-1.5">
                            <Truck className="w-3.5 h-3.5 text-taupe shrink-0" strokeWidth={1.4} />
                            {remaining > 0
                                ? <>Te faltan <strong className="text-wine font-medium">{usd(remaining)}</strong> para el envío gratis</>
                                : <>¡Genial! Tu pedido tiene <strong className="text-wine font-medium">envío gratis</strong></>}
                        </p>
                        <div className="mt-2 h-1 rounded-full bg-line overflow-hidden">
                            <div
                                className="h-full rounded-full bg-gradient-to-r from-mauve to-cocoa transition-[width] duration-700"
                                style={{ width: `${pct}%` }}
                                role="progressbar"
                                aria-valuenow={Math.round(pct)}
                                aria-valuemin={0}
                                aria-valuemax={100}
                                aria-label={`Progreso hacia envío gratis desde ${usd(FREE_SHIPPING_THRESHOLD)}`}
                            />
                        </div>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto px-5">
                    {items.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-center gap-3 py-16">
                            <div className="w-16 h-16 rounded-full grad-rose grid place-items-center">
                                <ShoppingBag className="w-6 h-6 text-wine" strokeWidth={1.2} />
                            </div>
                            <p className="font-[family-name:var(--font-display)] text-xl text-wine">Tu bolsa está vacía</p>
                            <p className="text-xs text-muted max-w-[240px]">
                                Descubre los básicos que nuestra comunidad ama y empieza tu rutina.
                            </p>
                            <a href={u('/tienda')} onClick={closeDrawer} className="btn btn-primary mt-3">Explorar la tienda</a>
                        </div>
                    ) : (
                        items.map((item) => (
                            <CartItemRow key={item.id} item={item} onSetQty={setQty} onRemove={remove} />
                        ))
                    )}
                </div>

                {items.length > 0 && (
                    <footer className="border-t border-line px-5 py-4 flex flex-col gap-3 shrink-0 pb-safe">
                        <div className="flex items-start justify-between">
                            <span className="text-[11px] uppercase tracking-[0.16em] text-muted pt-1">Subtotal</span>
                            <span className="flex flex-col items-end">
                                <span className="text-xl text-ink tabular-nums font-[family-name:var(--font-display)]">{usd(subtotal)}</span>
                                {subtotalVes != null && <span className="text-[10px] text-muted tabular-nums">{ves(subtotalVes)}</span>}
                            </span>
                        </div>
                        <p className="text-[10px] text-muted -mt-1">Envío calculado con tu asesora al confirmar el pedido.</p>

                        <button
                            onClick={() => { closeDrawer(); openCheckout(); }}
                            className="btn btn-primary w-full !py-4"
                        >
                            Finalizar pedido
                        </button>
                        <button onClick={closeDrawer} className="text-[11px] uppercase tracking-[0.16em] text-muted hover:text-wine transition-colors">
                            Seguir comprando
                        </button>
                    </footer>
                )}
            </aside>
        </>
    );

    if (!mounted) return null;
    return ReactDOM.createPortal(drawer, document.body);
};

export default CartDrawer;
