import React, { useEffect, useRef, useState } from 'react';
import { Menu, Search, ShoppingBag, Heart, User } from 'lucide-react';
import Logo from '../ui/Logo';
import { primaryNav, secondaryNav } from '../../lib/nav';
import { u, isActive } from '../../lib/url';
import { ANNOUNCEMENTS, BRAND } from '../../lib/constants';

interface Props {
    pathname: string;
    cartCount: number;
    wishlistCount: number;
    exchangeRate: number | null;
    onOpenCart: () => void;
    onOpenSearch: () => void;
    onOpenMenu: () => void;
}

const AnnouncementBar: React.FC<{ exchangeRate: number | null }> = ({ exchangeRate }) => (
    <div className="bg-rose-light text-wine overflow-hidden">
        {/* Desktop: static three-up. Mobile: a marquee, so nothing gets clipped. */}
        <div className="hidden md:flex max-w-[1400px] mx-auto px-6 h-9 items-center justify-between">
            <div className="flex items-center gap-6">
                {ANNOUNCEMENTS.map((a, i) => (
                    <React.Fragment key={a}>
                        {i > 0 && <span className="w-px h-3 bg-wine/20" aria-hidden="true" />}
                        <span className="text-[10px] uppercase tracking-[0.24em]">{a}</span>
                    </React.Fragment>
                ))}
            </div>
            <div className="flex items-center gap-5">
                {exchangeRate != null && (
                    <span className="text-[10px] uppercase tracking-[0.16em] tabular-nums opacity-80">
                        BCV {exchangeRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs/USD
                    </span>
                )}
                <span className="text-[10px] uppercase tracking-[0.24em] opacity-70">{BRAND.city}</span>
            </div>
        </div>

        <div className="md:hidden h-8 flex items-center">
            <div className="flex animate-marquee whitespace-nowrap will-change-transform">
                {[0, 1].map((dup) => (
                    <div key={dup} className="flex items-center shrink-0" aria-hidden={dup === 1}>
                        {[...ANNOUNCEMENTS, BRAND.city].map((a) => (
                            <span key={a} className="text-[9px] uppercase tracking-[0.22em] px-5 flex items-center gap-5">
                                {a}
                                <span className="w-1 h-1 rounded-full bg-wine/30" />
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    </div>
);

const IconButton: React.FC<{
    label: string;
    onClick?: () => void;
    href?: string;
    badge?: number;
    children: React.ReactNode;
}> = ({ label, onClick, href, badge, children }) => {
    const cls =
        'relative w-10 h-10 grid place-items-center rounded-full text-wine hover:bg-rose-light transition-colors';
    const inner = (
        <>
            {children}
            {badge != null && badge > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-wine text-white text-[9px] grid place-items-center tabular-nums leading-none">
                    {badge > 99 ? '99+' : badge}
                </span>
            )}
        </>
    );
    return href ? (
        <a href={href} aria-label={label} className={cls}>{inner}</a>
    ) : (
        <button type="button" onClick={onClick} aria-label={label} className={cls}>{inner}</button>
    );
};

const Header: React.FC<Props> = ({
    pathname, cartCount, wishlistCount, exchangeRate, onOpenCart, onOpenSearch, onOpenMenu,
}) => {
    const [scrolled, setScrolled] = useState(false);
    const [megaOpen, setMegaOpen] = useState<string | null>(null);
    const closeTimer = useRef<number | null>(null);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const openMega = (label: string) => {
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        setMegaOpen(label);
    };
    const scheduleClose = () => {
        if (closeTimer.current) window.clearTimeout(closeTimer.current);
        closeTimer.current = window.setTimeout(() => setMegaOpen(null), 140);
    };

    const navLinkClass = (href: string) =>
        `text-[11px] uppercase tracking-[0.18em] transition-colors py-2 ${
            isActive(u(href), pathname) ? 'text-wine' : 'text-muted hover:text-wine'
        }`;

    const activeMega = primaryNav.find((l) => l.label === megaOpen && l.children);

    return (
        <header className="fixed inset-x-0 top-0 z-50">
            <AnnouncementBar exchangeRate={exchangeRate} />

            <div
                className={`border-b transition-all duration-500 ${
                    scrolled ? 'bg-white/95 backdrop-blur-md border-line shadow-[0_4px_24px_-20px_rgba(110,42,56,.5)]' : 'bg-white border-transparent'
                }`}
                onMouseLeave={scheduleClose}
            >
                <div className={`max-w-[1400px] mx-auto px-4 sm:px-6 transition-[height] duration-500 ${scrolled ? 'h-16' : 'h-16 lg:h-[72px]'}`}>
                    <div className="h-full grid grid-cols-[1fr_auto_1fr] items-center gap-2">

                        {/* ── Left ─────────────────────────────────────── */}
                        <div className="flex items-center gap-1 lg:gap-5">
                            <button
                                onClick={onOpenMenu}
                                aria-label="Abrir menú"
                                className="lg:hidden w-10 h-10 -ml-2 grid place-items-center rounded-full text-wine hover:bg-rose-light transition-colors"
                            >
                                <Menu className="w-5 h-5" strokeWidth={1.4} />
                            </button>

                            <button
                                onClick={onOpenSearch}
                                aria-label="Buscar"
                                className="hidden lg:grid w-10 h-10 place-items-center rounded-full text-wine hover:bg-rose-light transition-colors"
                            >
                                <Search className="w-[18px] h-[18px]" strokeWidth={1.4} />
                            </button>

                            <nav className="hidden lg:flex items-center gap-6" aria-label="Navegación principal">
                                {primaryNav.map((link) => (
                                    <div
                                        key={link.label}
                                        onMouseEnter={() => (link.children ? openMega(link.label) : setMegaOpen(null))}
                                        className="relative"
                                    >
                                        <a
                                            href={u(link.href)}
                                            className={navLinkClass(link.href)}
                                            aria-current={isActive(u(link.href), pathname) ? 'page' : undefined}
                                            aria-haspopup={link.children ? 'true' : undefined}
                                            aria-expanded={link.children ? megaOpen === link.label : undefined}
                                        >
                                            {link.label}
                                        </a>
                                    </div>
                                ))}
                            </nav>
                        </div>

                        {/* ── Centre: wordmark ─────────────────────────── */}
                        <a href={u('/')} aria-label={`${BRAND.name} — inicio`} className="text-wine px-2 justify-self-center">
                            <Logo size="md" />
                        </a>

                        {/* ── Right ────────────────────────────────────── */}
                        <div className="flex items-center justify-end gap-1 lg:gap-5">
                            <nav className="hidden lg:flex items-center gap-6" aria-label="Navegación secundaria">
                                {secondaryNav.map((link) => (
                                    <a key={link.label} href={u(link.href)} className={navLinkClass(link.href)} aria-current={isActive(u(link.href), pathname) ? 'page' : undefined}>
                                        {link.label}
                                    </a>
                                ))}
                            </nav>

                            <div className="flex items-center">
                                <span className="lg:hidden">
                                    <IconButton label="Buscar" onClick={onOpenSearch}>
                                        <Search className="w-[18px] h-[18px]" strokeWidth={1.4} />
                                    </IconButton>
                                </span>
                                <span className="hidden sm:inline-flex">
                                    <IconButton label="Mis favoritos" href={u('/favoritos')} badge={wishlistCount}>
                                        <Heart className="w-[18px] h-[18px]" strokeWidth={1.4} />
                                    </IconButton>
                                </span>
                                <span className="hidden lg:inline-flex">
                                    <IconButton label="Contacto y ayuda" href={u('/contacto')}>
                                        <User className="w-[18px] h-[18px]" strokeWidth={1.4} />
                                    </IconButton>
                                </span>
                                <IconButton label={`Carrito, ${cartCount} artículo${cartCount !== 1 ? 's' : ''}`} onClick={onOpenCart} badge={cartCount}>
                                    <ShoppingBag className="w-[18px] h-[18px]" strokeWidth={1.4} />
                                </IconButton>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ── Mega menu (desktop only) ───────────────────────── */}
                <div
                    className={`hidden lg:block absolute inset-x-0 top-full bg-white border-b border-line overflow-hidden
                                transition-all duration-400 ease-[cubic-bezier(.22,1,.36,1)]
                                ${activeMega ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                    style={{ maxHeight: activeMega ? 420 : 0 }}
                    onMouseEnter={() => activeMega && openMega(activeMega.label)}
                    onMouseLeave={scheduleClose}
                >
                    {activeMega && (
                        <div className="max-w-[1400px] mx-auto px-6 py-8 grid grid-cols-4 gap-x-8 gap-y-4">
                            {activeMega.children!.map((child) => (
                                <a key={child.href} href={u(child.href)} className="group flex flex-col gap-0.5 py-1.5">
                                    <span className="text-[13px] text-ink group-hover:text-wine transition-colors">{child.label}</span>
                                    {child.note && <span className="text-[11px] text-muted leading-snug">{child.note}</span>}
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
