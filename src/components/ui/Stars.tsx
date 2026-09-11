import React from 'react';

interface Props {
    rating?: number | null;
    count?: number | null;
    className?: string;
}

/** Compact 5-star readout. Renders nothing when the product has no rating. */
const Stars: React.FC<Props> = ({ rating, count, className = '' }) => {
    if (rating == null) return null;
    const rounded = Math.round(rating * 2) / 2;

    return (
        <span className={`inline-flex items-center gap-1.5 ${className}`} aria-label={`${rating} de 5 estrellas`}>
            <span className="flex gap-px text-champagne" aria-hidden="true">
                {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} viewBox="0 0 20 20" className="w-3 h-3">
                        <defs>
                            <linearGradient id={`half-${i}`}>
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="transparent" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M10 1.6l2.4 5 5.5.8-4 3.9.95 5.5L10 14.2l-4.9 2.6.95-5.5-4-3.9 5.5-.8z"
                            fill={rounded >= i ? 'currentColor' : rounded >= i - 0.5 ? `url(#half-${i})` : 'none'}
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                ))}
            </span>
            {count != null && <span className="text-[10px] text-muted tabular-nums">({count})</span>}
        </span>
    );
};

export default Stars;
