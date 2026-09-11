/**
 * Base-aware link helper.
 *
 * Astro rewrites the paths it generates when `base` is set, but not the hrefs
 * we hand-write in components. GitHub Pages serves the site from
 * /valangel-landing/, so every internal link goes through `u()`.
 */
const BASE = import.meta.env.BASE_URL || '/';

export function u(path: string): string {
    if (!path) return BASE;
    // Leave absolute URLs, anchors, mailto:, tel: and wa.me links untouched
    if (/^([a-z]+:)?\/\//i.test(path) || /^(#|mailto:|tel:)/.test(path)) return path;

    const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `${base}${clean}` || '/';
}

/** True when `href` is the page currently being rendered (ignores the base). */
export function isActive(href: string, pathname: string): boolean {
    const strip = (p: string) => {
        const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
        const out = p.startsWith(base) ? p.slice(base.length) : p;
        return (out.replace(/\/+$/, '') || '/');
    };
    const a = strip(href);
    const b = strip(pathname);
    return a === '/' ? b === '/' : b === a || b.startsWith(`${a}/`);
}
