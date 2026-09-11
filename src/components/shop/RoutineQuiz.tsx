/**
 * "Crea tu rutina" — the questionnaire, its result, and a one-tap
 * "add the whole routine to the bag" action.
 */
import React, { useMemo, useState } from 'react';
import { ArrowLeft, RotateCcw, Check, ShoppingBag } from 'lucide-react';
import { CartProvider, useCart } from '../../context/CartContext';
import { useCatalog } from '../../lib/productStore';
import { useExchangeRate } from '../../lib/exchangeRateStore';
import { quizSteps, buildRoutine, routineSummary, type QuizAnswers } from '../../lib/routines';
import { productImages, type Product } from '../../lib/catalog';
import { STRAPI_URL } from '../../lib/constants';
import { usd } from '../../lib/format';
import QuickView from './QuickView';
import Price from '../ui/Price';

const Inner: React.FC = () => {
    const { products, loading } = useCatalog();
    const exchangeRate = useExchangeRate();
    const { add } = useCart();

    const [index, setIndex] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({});
    const [done, setDone] = useState(false);
    const [preview, setPreview] = useState<Product | null>(null);
    const [addedAll, setAddedAll] = useState(false);

    const routine = useMemo(
        () => (done ? buildRoutine(products, answers) : []),
        [done, products, answers]
    );

    const total = routine.reduce((sum, s) => sum + (s.product?.price ?? 0), 0);

    const choose = (value: string) => {
        const step = quizSteps[index];
        const next = { ...answers, [step.id]: value };
        setAnswers(next);
        if (index < quizSteps.length - 1) setIndex(index + 1);
        else setDone(true);
    };

    const restart = () => {
        setAnswers({});
        setIndex(0);
        setDone(false);
        setAddedAll(false);
    };

    const addWholeRoutine = () => {
        for (const step of routine) {
            const p = step.product;
            if (!p) continue;
            add({
                id: p.id,
                name: p.name,
                sku: p.sku,
                price: p.price ?? 0,
                imageUrl: productImages(p, STRAPI_URL)[0] ?? null,
                brand: p.brand?.name ?? null,
                size: p.size ?? null,
            });
        }
        setAddedAll(true);
        setTimeout(() => setAddedAll(false), 2500);
    };

    // ── Result ────────────────────────────────────────────────────────────
    if (done) {
        return (
            <>
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                        <div>
                            <p className="eyebrow">Tu rutina Valangel</p>
                            <h2 className="display text-3xl sm:text-4xl mt-2">Esto es lo que tu piel necesita</h2>
                            <p className="mt-3 text-sm text-muted max-w-lg leading-relaxed">{routineSummary(answers)}</p>
                        </div>
                        <button onClick={restart} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-wine self-start sm:self-auto shrink-0">
                            <RotateCcw className="w-3.5 h-3.5" /> Repetir test
                        </button>
                    </div>

                    {loading ? (
                        <p className="text-sm text-muted">Armando tu rutina…</p>
                    ) : (
                        <ol className="flex flex-col gap-3">
                            {routine.map((step) => (
                                <li key={step.step} className="border border-line rounded-3xl p-4 sm:p-5 flex gap-4 items-start bg-white">
                                    <span className="w-8 h-8 shrink-0 rounded-full grad-rose grid place-items-center text-wine text-[13px] font-[family-name:var(--font-display)]">
                                        {step.step}
                                    </span>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-baseline gap-2 flex-wrap">
                                            <h3 className="font-[family-name:var(--font-display)] text-lg">{step.label}</h3>
                                            <span className="text-[10px] uppercase tracking-[0.14em] text-taupe">{step.moment}</span>
                                        </div>
                                        <p className="text-[13px] text-muted leading-relaxed mt-1">{step.why}</p>

                                        {step.product ? (
                                            <button
                                                onClick={() => setPreview(step.product)}
                                                className="mt-3 flex items-center gap-3 w-full text-left group"
                                            >
                                                <span className="w-14 h-14 rounded-xl overflow-hidden grad-cream shrink-0">
                                                    {productImages(step.product, STRAPI_URL)[0] && (
                                                        <img src={productImages(step.product, STRAPI_URL)[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
                                                    )}
                                                </span>
                                                <span className="flex-1 min-w-0">
                                                    {step.product.brand && <span className="block eyebrow !text-[9px] text-taupe">{step.product.brand.name}</span>}
                                                    <span className="block text-[13px] text-ink truncate group-hover:text-wine transition-colors">{step.product.name}</span>
                                                </span>
                                                <Price price={step.product.price} exchangeRate={exchangeRate} align="right" />
                                            </button>
                                        ) : (
                                            <p className="mt-3 text-[12px] text-muted italic">
                                                Sin stock ahora mismo — escríbenos y te avisamos cuando llegue.
                                            </p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ol>
                    )}

                    {!loading && routine.some((s) => s.product) && (
                        <div className="sticky bottom-16 sm:bottom-4 z-20">
                            <div className="bg-white border border-line rounded-full shadow-[0_16px_40px_-24px_rgba(110,42,56,.5)] px-5 py-3 flex items-center justify-between gap-4">
                                <span className="flex flex-col leading-tight">
                                    <span className="text-[10px] uppercase tracking-[0.14em] text-muted">Rutina completa</span>
                                    <span className="text-base text-ink tabular-nums">{usd(total)}</span>
                                </span>
                                <button onClick={addWholeRoutine} className={`btn ${addedAll ? 'bg-wine text-white' : 'btn-primary'}`}>
                                    {addedAll ? <><Check className="w-3.5 h-3.5" /> Agregada</> : <><ShoppingBag className="w-3.5 h-3.5" /> Agregar todo</>}
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {preview && (
                    <QuickView product={preview} exchangeRate={exchangeRate} onClose={() => setPreview(null)} onAddToCart={add} />
                )}
            </>
        );
    }

    // ── Questions ─────────────────────────────────────────────────────────
    const step = quizSteps[index];

    return (
        <div className="max-w-xl">
            <div className="flex items-center gap-3 mb-8">
                {index > 0 && (
                    <button onClick={() => setIndex(index - 1)} aria-label="Pregunta anterior" className="w-9 h-9 -ml-2 grid place-items-center rounded-full hover:bg-rose-light text-wine transition-colors">
                        <ArrowLeft className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                )}
                <div className="flex gap-1.5 flex-1" role="progressbar" aria-valuenow={index + 1} aria-valuemin={1} aria-valuemax={quizSteps.length} aria-label="Progreso del test">
                    {quizSteps.map((s, i) => (
                        <span key={s.id} className={`h-[3px] flex-1 rounded-full transition-colors duration-500 ${i <= index ? 'bg-cocoa' : 'bg-line'}`} />
                    ))}
                </div>
                <span className="text-[11px] text-muted tabular-nums shrink-0">{index + 1}/{quizSteps.length}</span>
            </div>

            <h2 className="display text-2xl sm:text-3xl text-balance">{step.question}</h2>
            {step.help && <p className="mt-3 text-sm text-muted leading-relaxed">{step.help}</p>}

            <div className="mt-7 flex flex-col gap-2.5">
                {step.options.map((opt) => (
                    <button
                        key={opt.value}
                        onClick={() => choose(opt.value)}
                        className="group text-left border border-line rounded-2xl px-5 py-4 bg-white
                                   hover:border-taupe hover:bg-rose-light/40 transition-all duration-300
                                   flex items-center justify-between gap-4"
                    >
                        <span className="flex flex-col">
                            <span className="text-[15px] text-ink">{opt.label}</span>
                            {opt.hint && <span className="text-[11px] text-muted mt-0.5">{opt.hint}</span>}
                        </span>
                        <span className="w-6 h-6 rounded-full border border-line grid place-items-center text-taupe shrink-0 transition-colors group-hover:border-taupe group-hover:bg-white">
                            <svg viewBox="0 0 24 24" className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
};

const RoutineQuiz: React.FC = () => (
    <CartProvider>
        <Inner />
    </CartProvider>
);

export default RoutineQuiz;
