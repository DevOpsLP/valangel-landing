import React from 'react';

/**
 * Valangel Skin wordmark, rebuilt in type so it stays crisp at any size and
 * inherits the surrounding colour. Mirrors the brand board lock-up:
 * VALANGEL in Playfair, a four-point sparkle, SKIN spaced under a rule.
 */

export const Sparkle: React.FC<{ className?: string }> = ({ className = 'w-3 h-3' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M12 0c.6 5.9 5.5 10.8 11.4 11.4v1.2C17.5 13.2 12.6 18.1 12 24h-1.2C10.2 18.1 5.3 13.2-.6 12.6v-1.2C5.3 10.8 10.2 5.9 10.8 0z" />
    </svg>
);

interface LogoProps {
    /** Height of the VALANGEL line, in rem-ish tailwind text sizes. */
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    /** Renders the "MADE TO GLOW" descender used on the brand board. */
    withTagline?: boolean;
}

const SIZES = {
    sm: { word: 'text-base', track: '0.22em', sub: 'text-[7px]', gap: 'gap-[3px]' },
    md: { word: 'text-base sm:text-xl', track: '0.24em', sub: 'text-[7px] sm:text-[8px]', gap: 'gap-[4px]' },
    lg: { word: 'text-3xl sm:text-4xl', track: '0.26em', sub: 'text-[10px]', gap: 'gap-1.5' },
} as const;

const Logo: React.FC<LogoProps> = ({ size = 'md', className = '', withTagline = false }) => {
    const s = SIZES[size];
    return (
        <span className={`flex flex-col items-center ${s.gap} leading-none ${className}`}>
            <span
                className={`font-[family-name:var(--font-display)] font-medium ${s.word}`}
                style={{ letterSpacing: s.track }}
            >
                VALANGEL
            </span>
            <span className="flex items-center gap-2 w-full">
                <span className="h-px flex-1 bg-current opacity-40" />
                <span className={`font-[family-name:var(--font-sans)] font-medium ${s.sub}`} style={{ letterSpacing: '0.42em' }}>
                    SKIN
                </span>
                <span className="h-px flex-1 bg-current opacity-40" />
            </span>
            {withTagline && (
                <span className={`font-[family-name:var(--font-sans)] mt-1 ${s.sub} opacity-70`} style={{ letterSpacing: '0.3em' }}>
                    MADE TO GLOW
                </span>
            )}
        </span>
    );
};

export default Logo;
