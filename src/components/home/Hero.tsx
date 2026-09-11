import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { fetchHeroSlides, resolveMedia } from '../../lib/strapi';
import { fallbackHeroSlides, type HeroSlideStrapi } from '../../lib/heroData';
import { u } from '../../lib/url';
import { WA_LINK } from '../../lib/constants';
import { Sparkle } from '../ui/Logo';

const BG_CLASS: Record<string, string> = {
    rose: 'grad-rose',
    cream: 'grad-cream',
    silk: 'grad-silk',
    white: 'bg-white',
    black: 'bg-ink',
};

function href(raw: string): string {
    return raw === 'wa' ? WA_LINK : u(raw);
}

const Slide: React.FC<{ slide: HeroSlideStrapi; active: boolean }> = ({ slide, active }) => {
    const bgClass =
        slide.background_type === 'image' ? '' : BG_CLASS[slide.background_color ?? 'rose'] ?? 'grad-rose';
    const bgStyle =
        slide.background_type === 'image' && slide.background_image
            ? { backgroundImage: `url(${resolveMedia(slide.background_image.url)})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : undefined;

    return (
        <div
            className={`relative w-full overflow-hidden ${bgClass}`}
            style={bgStyle}
            aria-hidden={!active}
        >
            {slide.background_type === 'image' && <div className="absolute inset-0 bg-white/45" />}

            <div className="relative max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12">
                <div className="grid lg:grid-cols-[1fr_1.05fr] items-center gap-8 lg:gap-6 py-12 sm:py-16 lg:py-20 min-h-[430px] sm:min-h-[480px] lg:min-h-[520px]">

                    {/* ── Copy ──────────────────────────────────────────── */}
                    <div className={`flex flex-col items-start order-2 lg:order-1 ${active ? 'animate-fade-up' : ''}`}>
                        {slide.eyebrow && <p className="eyebrow text-taupe mb-4 sm:mb-6">{slide.eyebrow}</p>}

                        <h1 className="display text-[clamp(2.75rem,11vw,6rem)] max-w-[12ch] text-balance">
                            {slide.title}
                        </h1>

                        {slide.subtitle && (
                            <p className="mt-5 text-[15px] sm:text-base text-ink/80 max-w-md leading-relaxed text-pretty">
                                {slide.subtitle}
                            </p>
                        )}

                        <div className="mt-7 sm:mt-9 flex flex-wrap gap-3">
                            <a href={href(slide.cta_href)} className="btn btn-primary">{slide.cta_label}</a>
                            {slide.secondary_label && slide.secondary_href && (
                                <a
                                    href={href(slide.secondary_href)}
                                    target={slide.secondary_href === 'wa' ? '_blank' : undefined}
                                    rel={slide.secondary_href === 'wa' ? 'noreferrer' : undefined}
                                    className="btn btn-ghost"
                                >
                                    {slide.secondary_label}
                                </a>
                            )}
                        </div>
                    </div>

                    {/* ── Product shot + script accent ──────────────────── */}
                    <div className="relative order-1 lg:order-2">
                        {/* Sits beside the image, not over it — over a photo the
                            script was unreadable at every breakpoint. */}
                        {slide.script_accent && (
                            <p className="script text-taupe text-right leading-tight whitespace-pre-line
                                          text-lg sm:text-xl lg:text-[1.75rem] mb-3
                                          lg:mb-0 lg:absolute lg:top-6 lg:right-0 lg:w-24 lg:text-left lg:z-10">
                                {slide.script_accent}
                            </p>
                        )}

                        {slide.image && (
                            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[16/10] lg:aspect-[5/4] lg:mr-28 shadow-[0_40px_80px_-50px_rgba(110,42,56,.55)]">
                                <img
                                    src={resolveMedia(slide.image.url)}
                                    alt={slide.image.alternativeText ?? slide.title}
                                    /* The first slide is the LCP element — never lazy-load it. */
                                    loading={slide.sort_order === 0 ? 'eager' : 'lazy'}
                                    fetchPriority={slide.sort_order === 0 ? 'high' : undefined}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        <Sparkle className="absolute -bottom-1 left-2 w-4 h-4 sm:w-5 sm:h-5 text-champagne" />
                    </div>
                </div>
            </div>
        </div>
    );
};

const Hero: React.FC<{ autoPlayMs?: number }> = ({ autoPlayMs = 7000 }) => {
    const [slides, setSlides] = useState<HeroSlideStrapi[]>(fallbackHeroSlides);
    const [current, setCurrent] = useState(0);
    const [paused, setPaused] = useState(false);
    const touchStartX = useRef<number | null>(null);

    useEffect(() => {
        let cancelled = false;
        fetchHeroSlides().then((data) => {
            if (!cancelled && data.length) {
                setSlides([...data].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)));
            }
        });
        return () => { cancelled = true; };
    }, []);

    const total = slides.length;
    const next = useCallback(() => setCurrent((c) => (c + 1) % total), [total]);
    const prev = useCallback(() => setCurrent((c) => (c - 1 + total) % total), [total]);

    useEffect(() => {
        if (paused || total <= 1 || !autoPlayMs) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const id = window.setInterval(next, autoPlayMs);
        return () => window.clearInterval(id);
    }, [next, autoPlayMs, total, paused]);

    if (!total) return null;

    return (
        <section
            aria-label="Destacados"
            aria-roledescription="carrusel"
            className="relative"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onTouchStart={(e) => { touchStartX.current = e.touches[0].clientX; }}
            onTouchEnd={(e) => {
                if (touchStartX.current == null) return;
                const dx = e.changedTouches[0].clientX - touchStartX.current;
                if (Math.abs(dx) > 55) (dx < 0 ? next : prev)();
                touchStartX.current = null;
            }}
        >
            <div className="relative">
                {slides.map((s, i) => (
                    <div key={s.id} className={i === current ? 'block' : 'hidden'}>
                        <Slide slide={s} active={i === current} />
                    </div>
                ))}
            </div>

            {total > 1 && (
                <>
                    <button
                        onClick={prev}
                        aria-label="Anterior"
                        className="hidden md:grid absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 place-items-center rounded-full bg-white/70 backdrop-blur-sm text-wine hover:bg-white transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                        onClick={next}
                        aria-label="Siguiente"
                        className="hidden md:grid absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 place-items-center rounded-full bg-white/70 backdrop-blur-sm text-wine hover:bg-white transition-colors"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                    <div className="absolute bottom-4 inset-x-0 flex justify-center gap-2">
                        {slides.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => setCurrent(i)}
                                aria-label={`Ir al slide ${i + 1} de ${total}`}
                                aria-current={i === current}
                                className={`h-1.5 rounded-full transition-all duration-500 ${i === current ? 'w-8 bg-wine' : 'w-1.5 bg-wine/30 hover:bg-wine/50'}`}
                            />
                        ))}
                    </div>
                </>
            )}
        </section>
    );
};

export default Hero;
