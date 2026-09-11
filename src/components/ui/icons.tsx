import React from 'react';

/** Brand pictograms. Drawn as thin 1.25px strokes to match the brand board. */

type P = { className?: string };
const base = 'w-full h-full';

const stroke = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.25,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
};

export const WhatsAppIcon: React.FC<P> = ({ className = 'w-4 h-4' }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

/** Value-prop icons (trust bar). */
export const DiamondIcon: React.FC<P> = ({ className = base }) => (
    <svg viewBox="0 0 32 32" className={className} {...stroke} aria-hidden="true">
        <path d="M8 5h16l6 7-14 15L2 12z" /><path d="M2 12h28M11 12l5 15M21 12l-5 15M8 5l3 7M24 5l-3 7" />
    </svg>
);
export const TruckIcon: React.FC<P> = ({ className = base }) => (
    <svg viewBox="0 0 32 32" className={className} {...stroke} aria-hidden="true">
        <path d="M2 8h16v14H2zM18 13h6l4 4v5h-10z" /><circle cx="9" cy="24" r="2.5" /><circle cx="23" cy="24" r="2.5" />
    </svg>
);
export const CardIcon: React.FC<P> = ({ className = base }) => (
    <svg viewBox="0 0 32 32" className={className} {...stroke} aria-hidden="true">
        <rect x="2" y="7" width="28" height="18" rx="2.5" /><path d="M2 13h28M6 19h5" />
    </svg>
);
export const HeartOutlineIcon: React.FC<P> = ({ className = base }) => (
    <svg viewBox="0 0 32 32" className={className} {...stroke} aria-hidden="true">
        <path d="M16 27S4 20.2 4 12.6A6.6 6.6 0 0116 9.4a6.6 6.6 0 0112 3.2C28 20.2 16 27 16 27z" />
    </svg>
);

/** Skin-concern pictograms used by "Build your routine". */
export const ConcernIcon: React.FC<P & { name: string }> = ({ name, className = base }) => {
    const paths: Record<string, React.ReactNode> = {
        leaf: <><path d="M6 26C6 14 14 8 26 7c1 12-5 19-16 19H6z" /><path d="M6 26c4-6 9-10 15-12" /></>,
        spark: <><path d="M16 4v7M16 21v7M4 16h7M21 16h7M8 8l4.5 4.5M19.5 19.5L24 24M24 8l-4.5 4.5M12.5 19.5L8 24" /><circle cx="16" cy="16" r="3" /></>,
        drop: <path d="M16 4s8 9.5 8 14.5a8 8 0 11-16 0C8 13.5 16 4 16 4z" />,
        waves: <><path d="M3 11c3.5-3 6.5-3 10 0s6.5 3 10 0 6.5-3 9 0" /><path d="M3 18c3.5-3 6.5-3 10 0s6.5 3 10 0" /><path d="M3 25c3.5-3 6.5-3 10 0s6.5 3 10 0" /></>,
        dots: <>{[8, 16, 24].map((y) => [8, 16, 24].map((x) => <circle key={`${x}-${y}`} cx={x} cy={y} r="1.6" />))}</>,
        sun: <><circle cx="16" cy="16" r="6" /><path d="M16 2v4M16 26v4M2 16h4M26 16h4M6.2 6.2l2.8 2.8M23 23l2.8 2.8M25.8 6.2L23 9M9 23l-2.8 2.8" /></>,
        circle: <><circle cx="16" cy="16" r="11" /><circle cx="12" cy="13" r="2" /><circle cx="20" cy="19" r="3" /></>,
    };
    return (
        <svg viewBox="0 0 32 32" className={className} {...stroke} aria-hidden="true">
            {paths[name] ?? paths.circle}
        </svg>
    );
};

/** Social glyphs for the newsletter band and footer. */
export const SocialIcon: React.FC<P & { name: string }> = ({ name, className = 'w-4 h-4' }) => {
    const d: Record<string, string> = {
        instagram: 'M12 2.2c3.2 0 3.6 0 4.9.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.86s0 3.6-.07 4.86c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 01-.9 1.38 3.7 3.7 0 01-1.38.9c-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.86.07s-3.6 0-4.86-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 01-1.38-.9 3.7 3.7 0 01-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.6 2.2 15.2 2.2 12s0-3.6.07-4.86c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38a3.7 3.7 0 011.38-.9c.42-.16 1.06-.36 2.23-.41C8.4 2.21 8.8 2.2 12 2.2zm0 3.05A6.75 6.75 0 1018.75 12 6.75 6.75 0 0012 5.25zm0 11.13A4.38 4.38 0 1116.38 12 4.38 4.38 0 0112 16.38zm8.6-11.4a1.58 1.58 0 11-1.58-1.58 1.58 1.58 0 011.58 1.58z',
        tiktok: 'M16.5 2h2.9a5.7 5.7 0 004.6 4.5v2.9a8.5 8.5 0 01-4.6-1.4v6.6a6.6 6.6 0 11-6.6-6.6c.35 0 .7.03 1 .09v3a3.6 3.6 0 102.6 3.46V2z',
        facebook: 'M22 12a10 10 0 10-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.77-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0022 12z',
        youtube: 'M23 12s0-3.2-.4-4.7a2.5 2.5 0 00-1.77-1.78C19.3 5.1 12 5.1 12 5.1s-7.3 0-8.83.42A2.5 2.5 0 001.4 7.3C1 8.8 1 12 1 12s0 3.2.4 4.7a2.5 2.5 0 001.77 1.78c1.53.42 8.83.42 8.83.42s7.3 0 8.83-.42A2.5 2.5 0 0022.6 16.7C23 15.2 23 12 23 12zM9.75 15.02V8.98L15.5 12z',
        pinterest: 'M12 2a10 10 0 00-3.65 19.31c-.09-.78-.17-1.98.03-2.83.19-.78 1.2-4.94 1.2-4.94s-.3-.61-.3-1.51c0-1.42.82-2.48 1.85-2.48.87 0 1.29.66 1.29 1.44 0 .88-.56 2.2-.85 3.42-.24 1.02.51 1.86 1.52 1.86 1.83 0 3.23-1.93 3.23-4.71 0-2.46-1.77-4.18-4.3-4.18a4.46 4.46 0 00-4.65 4.47c0 .89.34 1.84.77 2.36.09.1.1.19.07.3-.08.32-.25.98-.28 1.12-.04.18-.15.22-.34.13-1.27-.59-2.06-2.44-2.06-3.93 0-3.2 2.32-6.13 6.7-6.13 3.51 0 6.25 2.5 6.25 5.85 0 3.49-2.2 6.3-5.25 6.3-1.03 0-2-.53-2.32-1.17l-.63 2.4c-.23.88-.85 1.98-1.26 2.65A10 10 0 1012 2z',
    };
    return (
        <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
            <path d={d[name] ?? d.instagram} />
        </svg>
    );
};
