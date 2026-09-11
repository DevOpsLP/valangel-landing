import React, { useEffect, useRef, useState } from 'react';
import { X, ChevronDown, Heart, Sparkles } from 'lucide-react';
import { primaryNav, secondaryNav } from '../../lib/nav';
import { u, isActive } from '../../lib/url';
import { BRAND, WA_LINK } from '../../lib/constants';
import { WhatsAppIcon, SocialIcon } from '../ui/icons';
import Logo from '../ui/Logo';
import { useInertWhenClosed } from '../../lib/useInert';

interface Props {
    open: boolean;
    onClose: () => void;
    pathname: string;
    exchangeRate: number | null;
}

/**
 * Full-height mobile navigation.
 *
 * Two details matter here and are easy to get wrong: the panel must not leave
 * the page scrollable underneath, and a section with children must still let
 * you reach the section itself — the chevron toggles, the label navigates.
 */
const MobileNav: React.FC<Props> = ({ open, onClose, pathname, exchangeRate }) => {
    const [expanded, setExpanded] = useState<string | null>(null);
    const rootRef = useRef<HTMLDivElement>(null);
    useInertWhenClosed(rootRef, open);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
        document.addEventListener('keydown', onKey);
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => {
            document.removeEventListener('keydown', onKey);
            document.body.style.overflow = prev;
        };
    }, [open, onClose]);

    return (
        <div ref={rootRef} className={`lg:hidden fixed inset-0 z-[65] ${open ? '' : 'pointer-events-none'}`} aria-hidden={!open}>
            <div
                className={`absolute inset-0 bg-wine/25 backdrop-blur-[2px] transition-opacity duration-400 ${open ? 'opacity-100' : 'opacity-0'}`}
                onClick={onClose}
            />

            <nav
                className={`absolute left-0 top-0 h-[100dvh] w-[88%] max-w-sm bg-white flex flex-col
                            shadow-[24px_0_60px_-40px_rgba(110,42,56,.6)]
                            transition-transform duration-500 ease-[cubic-bezier(.22,1,.36,1)]
                            ${open ? 'translate-x-0' : '-translate-x-full'}`}
                aria-label="Menú principal"
            >
                <div className="flex items-center justify-between px-5 py-4 border-b border-line shrink-0">
                    <a href={u('/')} className="text-wine" onClick={onClose} aria-label={`${BRAND.name} — inicio`}>
                        <Logo size="sm" />
                    </a>
                    <button onClick={onClose} aria-label="Cerrar menú" className="w-10 h-10 grid place-items-center rounded-full hover:bg-rose-light text-wine transition-colors">
                        <X className="w-5 h-5" strokeWidth={1.4} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                    <ul className="flex flex-col">
                        {primaryNav.map((link) => {
                            const active = isActive(u(link.href), pathname);
                            const isOpen = expanded === link.label;
                            return (
                                <li key={link.label} className="border-b border-line">
                                    <div className="flex items-center">
                                        <a
                                            href={u(link.href)}
                                            onClick={onClose}
                                            aria-current={active ? 'page' : undefined}
                                            className={`flex-1 py-4 font-[family-name:var(--font-display)] text-2xl transition-colors
                                                        ${active ? 'text-wine' : 'text-ink hover:text-wine'}`}
                                        >
                                            {link.label}
                                        </a>
                                        {link.children && (
                                            <button
                                                onClick={() => setExpanded(isOpen ? null : link.label)}
                                                aria-expanded={isOpen}
                                                aria-label={`${isOpen ? 'Ocultar' : 'Ver'} categorías de ${link.label}`}
                                                className="w-11 h-11 grid place-items-center text-muted"
                                            >
                                                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                                            </button>
                                        )}
                                    </div>

                                    {link.children && (
                                        <div className={`grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(.22,1,.36,1)] ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
                                            <ul className="overflow-hidden flex flex-col">
                                                {link.children.map((child) => (
                                                    <li key={child.href}>
                                                        <a
                                                            href={u(child.href)}
                                                            onClick={onClose}
                                                            className="block py-2.5 pl-3 text-[13px] text-muted hover:text-wine transition-colors"
                                                        >
                                                            {child.label}
                                                        </a>
                                                    </li>
                                                ))}
                                                <li className="h-2" />
                                            </ul>
                                        </div>
                                    )}
                                </li>
                            );
                        })}

                        {secondaryNav.map((link) => (
                            <li key={link.label} className="border-b border-line">
                                <a
                                    href={u(link.href)}
                                    onClick={onClose}
                                    aria-current={isActive(u(link.href), pathname) ? 'page' : undefined}
                                    className={`block py-3.5 text-sm tracking-[0.1em] uppercase transition-colors
                                                ${isActive(u(link.href), pathname) ? 'text-wine' : 'text-muted hover:text-wine'}`}
                                >
                                    {link.label}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-6 flex flex-col gap-2">
                        <a href={u('/favoritos')} onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-snow text-ink text-[13px]">
                            <Heart className="w-4 h-4 text-taupe" strokeWidth={1.4} /> Mis favoritos
                        </a>
                        <a href={u('/rutinas')} onClick={onClose} className="flex items-center gap-3 px-4 py-3 rounded-2xl grad-rose text-wine text-[13px]">
                            <Sparkles className="w-4 h-4" strokeWidth={1.4} /> Crear mi rutina
                        </a>
                        <a href={WA_LINK} target="_blank" rel="noreferrer" className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#25D366] text-white text-[13px]">
                            <WhatsAppIcon className="w-4 h-4" /> Asesoría por WhatsApp
                        </a>
                    </div>
                </div>

                <div className="shrink-0 border-t border-line px-5 py-4 flex items-center justify-between gap-3 pb-safe">
                    <div className="flex gap-1">
                        {(['instagram', 'tiktok', 'facebook'] as const).map((n) => (
                            <a
                                key={n}
                                href={BRAND[n]}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={`${BRAND.name} en ${n}`}
                                className="w-9 h-9 grid place-items-center rounded-full text-taupe hover:text-wine hover:bg-rose-light transition-colors"
                            >
                                <SocialIcon name={n} />
                            </a>
                        ))}
                    </div>
                    {exchangeRate != null && (
                        <span className="text-[10px] text-muted tabular-nums">
                            BCV {exchangeRate.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs/USD
                        </span>
                    )}
                </div>
            </nav>
        </div>
    );
};

export default MobileNav;
