import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { X, MapPin, Plus, ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { buildOrderWaMessage } from '../../lib/cart';
import ShippingMap, { type AddressResult } from './ShippingMap';
import { useExchangeRate } from '../../lib/exchangeRateStore';
import { loadUserProfile, upsertUserProfile, type SavedAddress } from '../../lib/userProfile';
import { usd, ves, toVes } from '../../lib/format';
import { WhatsAppIcon } from '../ui/icons';
import { useInertWhenClosed } from '../../lib/useInert';

const PAYMENT_METHODS = [
    { id: 'pago-movil', label: 'Pago móvil', hint: 'En bolívares, tasa BCV del día' },
    { id: 'transferencia', label: 'Transferencia', hint: 'Cuenta nacional en bolívares' },
    { id: 'zelle', label: 'Zelle', hint: 'En dólares' },
    { id: 'binance', label: 'Binance (USDT)', hint: 'Cripto, confirmación inmediata' },
    { id: 'efectivo', label: 'Efectivo', hint: 'Solo entregas en Valencia' },
] as const;

const DELIVERY_METHODS = [
    { id: 'delivery', label: 'Delivery Valencia', hint: 'Mismo día si confirmas antes de las 2:00 p. m.' },
    { id: 'nacional', label: 'Envío nacional', hint: 'Zoom, MRW o Tealca — 24 a 96 h' },
    { id: 'retiro', label: 'Retiro con cita', hint: 'Coordinamos punto y hora por WhatsApp' },
] as const;

type Step = 1 | 2 | 3;

const CheckoutModal: React.FC = () => {
    const { items, subtotal, clear, isCheckoutOpen, closeCheckout } = useCart();
    const exchangeRate = useExchangeRate();
    const subtotalVes = toVes(subtotal, exchangeRate);

    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);
    const rootRef = useRef<HTMLDivElement>(null);
    useInertWhenClosed(rootRef, isCheckoutOpen);

    const [step, setStep] = useState<Step>(1);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('+58 ');
    const [notes, setNotes] = useState('');
    const [payment, setPayment] = useState<string>('pago-movil');
    const [delivery, setDelivery] = useState<string>('nacional');
    const [address, setAddress] = useState<AddressResult>({ formatted: '', lat: 0, lng: 0 });

    const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
    const [selectedSaved, setSelectedSaved] = useState<number | null>(null);
    const [showNewAddress, setShowNewAddress] = useState(false);

    // Prefill from the last order so returning customers barely type anything
    useEffect(() => {
        if (!isCheckoutOpen) return;
        setStep(1);
        const profile = loadUserProfile();
        if (!profile) return;
        if (profile.name) setName(profile.name);
        if (profile.phone) setPhone(profile.phone);
        if (profile.addresses.length) {
            setSavedAddresses(profile.addresses);
            setSelectedSaved(0);
            const first = profile.addresses[0];
            setAddress({ formatted: first.formatted, lat: first.lat, lng: first.lng });
            setShowNewAddress(false);
        }
    }, [isCheckoutOpen]);

    useEffect(() => {
        if (!isCheckoutOpen) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && closeCheckout();
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [isCheckoutOpen, closeCheckout]);

    const step1Valid = name.trim().length > 1 && phone.replace(/\D/g, '').length >= 10;
    const step2Valid = delivery === 'retiro' || address.formatted.trim().length > 4;

    const handleSend = () => {
        if (!step1Valid || !step2Valid) return;

        if (address.formatted.trim()) {
            upsertUserProfile(name.trim(), phone.trim(), {
                formatted: address.formatted,
                lat: address.lat,
                lng: address.lng,
            });
        }

        const deliveryLabel = DELIVERY_METHODS.find((d) => d.id === delivery)?.label ?? '';
        const paymentLabel = PAYMENT_METHODS.find((p) => p.id === payment)?.label ?? '';

        const url = buildOrderWaMessage({
            items,
            subtotal,
            exchangeRate,
            customerName: name.trim(),
            customerPhone: phone.trim(),
            address: delivery === 'retiro' ? 'Retiro con cita previa (Valencia)' : address.formatted,
            notes: [`Entrega: ${deliveryLabel}`, `Pago: ${paymentLabel}`, notes.trim()].filter(Boolean).join('\n'),
            coords: address.lat !== 0 ? { lat: address.lat, lng: address.lng } : null,
        });

        window.open(url, '_blank', 'noreferrer');
        clear();
        closeCheckout();
    };

    const Field: React.FC<{ id: string; label: string; children: React.ReactNode }> = ({ id, label, children }) => (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-[11px] uppercase tracking-[0.14em] text-muted">{label}</label>
            {children}
        </div>
    );

    const inputClass =
        'w-full border border-line rounded-full px-4 py-3 text-sm text-ink focus:outline-none focus:border-taupe transition-colors';

    const OptionCard: React.FC<{ active: boolean; onClick: () => void; label: string; hint: string }> = ({ active, onClick, label, hint }) => (
        <button
            type="button"
            onClick={onClick}
            aria-pressed={active}
            className={`text-left px-4 py-3 rounded-2xl border transition-all duration-300 flex items-start gap-3
                        ${active ? 'border-wine bg-rose-light/60' : 'border-line hover:border-taupe bg-white'}`}
        >
            <span className={`mt-0.5 w-4 h-4 rounded-full border grid place-items-center shrink-0
                              ${active ? 'border-wine bg-wine' : 'border-line'}`}>
                {active && <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />}
            </span>
            <span className="flex flex-col min-w-0">
                <span className="text-[13px] text-ink">{label}</span>
                <span className="text-[11px] text-muted leading-snug">{hint}</span>
            </span>
        </button>
    );

    const modal = (
        <div
            ref={rootRef}
            className={`fixed inset-0 z-[80] transition-opacity duration-300 ${isCheckoutOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal={isCheckoutOpen}
            aria-label="Finalizar pedido"
        >
            <div className="absolute inset-0 bg-wine/35 backdrop-blur-sm" onClick={closeCheckout} aria-hidden="true" />

            <div className="absolute inset-0 flex items-end sm:items-center justify-center sm:p-6 pointer-events-none">
                <div
                    className={`pointer-events-auto bg-white w-full sm:max-w-lg max-h-[94dvh] rounded-t-3xl sm:rounded-3xl
                                overflow-hidden flex flex-col shadow-2xl transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]
                                ${isCheckoutOpen ? 'translate-y-0' : 'translate-y-full sm:translate-y-6'}`}
                >
                    {/* Header + progress */}
                    <header className="shrink-0 border-b border-line">
                        <div className="flex items-center justify-between px-5 sm:px-6 py-4">
                            {step > 1 ? (
                                <button onClick={() => setStep((s) => (s - 1) as Step)} aria-label="Volver" className="w-9 h-9 grid place-items-center -ml-2 rounded-full hover:bg-rose-light text-wine transition-colors">
                                    <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                                </button>
                            ) : <span className="w-9" />}

                            <h2 className="font-[family-name:var(--font-display)] text-lg text-wine">
                                {step === 1 ? 'Tus datos' : step === 2 ? 'Entrega' : 'Confirmar pedido'}
                            </h2>

                            <button onClick={closeCheckout} aria-label="Cerrar" className="w-9 h-9 grid place-items-center -mr-2 rounded-full hover:bg-rose-light text-wine transition-colors">
                                <X className="w-4 h-4" strokeWidth={1.5} />
                            </button>
                        </div>
                        <div className="flex gap-1 px-5 sm:px-6 pb-3" aria-hidden="true">
                            {[1, 2, 3].map((n) => (
                                <span key={n} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${n <= step ? 'bg-cocoa' : 'bg-line'}`} />
                            ))}
                        </div>
                    </header>

                    <div className="flex-1 overflow-y-auto px-5 sm:px-6 py-5 flex flex-col gap-5">
                        {/* ── Step 1 ─────────────────────────────────────── */}
                        {step === 1 && (
                            <>
                                <Field id="checkout-name" label="Nombre completo">
                                    <input id="checkout-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej: María González" className={inputClass} />
                                </Field>
                                <Field id="checkout-phone" label="WhatsApp">
                                    <input id="checkout-phone" type="tel" inputMode="tel" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+58 412 1234567" className={inputClass} />
                                </Field>
                                <div>
                                    <h3 className="text-[11px] uppercase tracking-[0.14em] text-muted mb-2">Método de pago</h3>
                                    <div className="grid gap-2">
                                        {PAYMENT_METHODS.map((m) => (
                                            <OptionCard key={m.id} active={payment === m.id} onClick={() => setPayment(m.id)} label={m.label} hint={m.hint} />
                                        ))}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* ── Step 2 ─────────────────────────────────────── */}
                        {step === 2 && (
                            <>
                                <div>
                                    <h3 className="text-[11px] uppercase tracking-[0.14em] text-muted mb-2">¿Cómo lo recibes?</h3>
                                    <div className="grid gap-2">
                                        {DELIVERY_METHODS.map((m) => (
                                            <OptionCard key={m.id} active={delivery === m.id} onClick={() => setDelivery(m.id)} label={m.label} hint={m.hint} />
                                        ))}
                                    </div>
                                </div>

                                {delivery !== 'retiro' && (
                                    <div>
                                        {savedAddresses.length > 0 && (
                                            <div className="flex flex-col gap-2 mb-3">
                                                <h3 className="text-[11px] uppercase tracking-[0.14em] text-muted">Direcciones guardadas</h3>
                                                {savedAddresses.map((a, idx) => (
                                                    <button
                                                        key={idx}
                                                        type="button"
                                                        onClick={() => {
                                                            setSelectedSaved(idx);
                                                            setAddress({ formatted: a.formatted, lat: a.lat, lng: a.lng });
                                                            setShowNewAddress(false);
                                                        }}
                                                        className={`flex items-start gap-3 text-left px-4 py-3 rounded-2xl border transition-colors
                                                                    ${selectedSaved === idx && !showNewAddress ? 'border-wine bg-rose-light/60' : 'border-line hover:border-taupe'}`}
                                                    >
                                                        <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${selectedSaved === idx && !showNewAddress ? 'text-wine' : 'text-muted'}`} strokeWidth={1.4} />
                                                        <span className="text-[13px] text-ink leading-snug">{a.formatted}</span>
                                                    </button>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedSaved(null);
                                                        setAddress({ formatted: '', lat: 0, lng: 0 });
                                                        setShowNewAddress(true);
                                                    }}
                                                    className={`flex items-center gap-2 px-4 py-3 rounded-2xl border border-dashed transition-colors
                                                                ${showNewAddress ? 'border-wine bg-rose-light/60 text-wine' : 'border-line text-muted hover:border-taupe'}`}
                                                >
                                                    <Plus className="w-4 h-4" strokeWidth={1.4} />
                                                    <span className="text-[13px]">Agregar otra dirección</span>
                                                </button>
                                            </div>
                                        )}

                                        {(savedAddresses.length === 0 || showNewAddress) && (
                                            <ShippingMap onAddressChange={setAddress} initialAddress="" />
                                        )}
                                    </div>
                                )}

                                <Field id="checkout-notes" label="Notas para tu asesora (opcional)">
                                    <textarea
                                        id="checkout-notes"
                                        rows={2}
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        placeholder="Ej: entregar en la tarde, es un regalo…"
                                        className="w-full border border-line rounded-2xl px-4 py-3 text-sm text-ink resize-none focus:outline-none focus:border-taupe transition-colors"
                                    />
                                </Field>
                            </>
                        )}

                        {/* ── Step 3 ─────────────────────────────────────── */}
                        {step === 3 && (
                            <>
                                <section>
                                    <h3 className="text-[11px] uppercase tracking-[0.14em] text-muted mb-2">Tu pedido</h3>
                                    <div className="rounded-2xl bg-snow p-4 flex flex-col gap-2.5">
                                        {items.map((item) => {
                                            const line = item.price * item.quantity;
                                            const lineVes = toVes(line, exchangeRate);
                                            return (
                                                <div key={item.id} className="flex justify-between gap-3 items-start">
                                                    <span className="flex-1 min-w-0">
                                                        <span className="block text-[13px] text-ink leading-snug line-clamp-1">{item.name}</span>
                                                        <span className="block text-[10px] text-muted">Ref. {item.sku} × {item.quantity}</span>
                                                    </span>
                                                    <span className="flex flex-col items-end shrink-0">
                                                        <span className="text-[13px] text-ink tabular-nums">{usd(line)}</span>
                                                        {lineVes != null && <span className="text-[10px] text-muted tabular-nums">{ves(lineVes)}</span>}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        <div className="border-t border-line pt-2.5 flex justify-between items-start">
                                            <span className="text-[11px] uppercase tracking-[0.14em] text-muted">Subtotal</span>
                                            <span className="flex flex-col items-end">
                                                <span className="text-base text-ink tabular-nums">{usd(subtotal)}</span>
                                                {subtotalVes != null && <span className="text-[10px] text-muted tabular-nums">{ves(subtotalVes)}</span>}
                                            </span>
                                        </div>
                                    </div>
                                </section>

                                <dl className="grid grid-cols-1 gap-2 text-[13px]">
                                    {[
                                        ['Cliente', name],
                                        ['WhatsApp', phone],
                                        ['Entrega', DELIVERY_METHODS.find((d) => d.id === delivery)?.label ?? ''],
                                        ['Pago', PAYMENT_METHODS.find((p) => p.id === payment)?.label ?? ''],
                                        ['Dirección', delivery === 'retiro' ? 'Retiro con cita previa (Valencia)' : address.formatted],
                                    ].map(([k, v]) => (
                                        <div key={k} className="flex gap-3 justify-between border-b border-line pb-2 last:border-0">
                                            <dt className="text-muted shrink-0">{k}</dt>
                                            <dd className="text-ink text-right">{v || '—'}</dd>
                                        </div>
                                    ))}
                                </dl>

                                <p className="text-[11px] text-muted bg-rose-light/50 border border-line rounded-2xl px-4 py-3 leading-relaxed">
                                    Al confirmar se abre WhatsApp con tu pedido listo para enviar. Tu asesora te confirma
                                    disponibilidad, el costo de envío y los datos de pago.
                                </p>
                            </>
                        )}
                    </div>

                    <footer className="shrink-0 border-t border-line px-5 sm:px-6 py-4 pb-safe">
                        {step < 3 ? (
                            <button
                                onClick={() => setStep((s) => (s + 1) as Step)}
                                disabled={step === 1 ? !step1Valid : !step2Valid}
                                className="btn btn-primary w-full !py-4 disabled:bg-snow disabled:text-muted disabled:shadow-none disabled:border disabled:border-line"
                            >
                                Continuar
                            </button>
                        ) : (
                            <button onClick={handleSend} className="btn w-full !py-4 bg-[#25D366] text-white hover:brightness-95">
                                <WhatsAppIcon className="w-4 h-4" />
                                Enviar pedido por WhatsApp
                            </button>
                        )}
                        {step === 1 && !step1Valid && (
                            <p className="text-[10px] text-center text-muted mt-2">Completa tu nombre y un WhatsApp válido.</p>
                        )}
                        {step === 2 && !step2Valid && (
                            <p className="text-[10px] text-center text-muted mt-2">Indica la dirección de entrega para continuar.</p>
                        )}
                    </footer>
                </div>
            </div>
        </div>
    );

    if (!mounted) return null;
    return ReactDOM.createPortal(modal, document.body);
};

export default CheckoutModal;
