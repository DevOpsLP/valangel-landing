import React, { useState } from 'react';
import { ArrowRight, Check } from 'lucide-react';
import { subscribeToNewsletter } from '../../lib/strapi';

/**
 * Newsletter opt-in. Posts to impoven-cms when it is reachable, and still
 * confirms to the visitor when it is not — the address is kept locally so the
 * form is not re-shown to someone who already signed up.
 */
const NewsletterForm: React.FC = () => {
    const [email, setEmail] = useState('');
    const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const value = email.trim();
        if (!/^[^@\s]+@[^@\s]+\.[^@\s]{2,}$/.test(value)) {
            setState('error');
            return;
        }
        setState('sending');
        await subscribeToNewsletter(value);
        try {
            localStorage.setItem('valangel_newsletter', value);
        } catch { /* ignore */ }
        setState('done');
    };

    if (state === 'done') {
        return (
            <p className="flex items-center gap-2 text-sm text-wine" role="status">
                <span className="w-6 h-6 rounded-full bg-wine text-white grid place-items-center shrink-0">
                    <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                </span>
                ¡Listo! Revisa tu correo, te escribimos pronto.
            </p>
        );
    }

    return (
        <form onSubmit={submit} className="w-full max-w-sm" noValidate>
            <div className="relative">
                <label htmlFor="newsletter-email" className="sr-only">Tu correo electrónico</label>
                <input
                    id="newsletter-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); if (state === 'error') setState('idle'); }}
                    placeholder="Tu correo electrónico"
                    aria-invalid={state === 'error'}
                    aria-describedby={state === 'error' ? 'newsletter-error' : undefined}
                    className={`w-full h-12 pl-5 pr-14 rounded-full bg-white border text-sm text-ink
                                placeholder:text-muted/70 focus:outline-none transition-colors
                                ${state === 'error' ? 'border-wine' : 'border-line focus:border-taupe'}`}
                />
                <button
                    type="submit"
                    disabled={state === 'sending'}
                    aria-label="Suscribirme"
                    className="absolute right-1.5 top-1.5 w-9 h-9 rounded-full bg-cocoa text-white grid place-items-center
                               hover:bg-wine transition-colors disabled:opacity-60"
                >
                    <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
                </button>
            </div>
            {state === 'error' && (
                <p id="newsletter-error" className="mt-2 text-[11px] text-wine">Escribe un correo válido para continuar.</p>
            )}
            <p className="mt-2 text-[10px] text-muted leading-relaxed">
                Al suscribirte aceptas recibir correos de Valangel Skin. Puedes darte de baja cuando quieras.
            </p>
        </form>
    );
};

export default NewsletterForm;
