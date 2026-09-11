/**
 * impoven-cms (Strapi v5) access layer.
 *
 * Every call degrades gracefully: live collection → legacy collection →
 * bundled fallback data. The storefront is therefore always browsable, even
 * with the CMS offline, which is what makes the static GitHub Pages preview
 * work end to end.
 */
import { STRAPI_URL, strapiHeaders } from './constants';
import { fallbackProducts, type Product } from './catalog';
import { fallbackHeroSlides, type HeroSlideStrapi } from './heroData';

async function getJson(path: string): Promise<any | null> {
    try {
        const res = await fetch(`${STRAPI_URL}${path}`, { headers: strapiHeaders });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        return null;
    }
}

/** Resolves a Strapi media URL (relative uploads need the CMS origin). */
export function resolveMedia(url: string): string {
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
}

/**
 * Products. Tries `/api/products` first (the Valangel content type) and falls
 * back to `/api/parts`, the collection the Impoven CMS already ships, so this
 * storefront works against the existing instance without a migration.
 */
export async function fetchProducts(pageSize = 200): Promise<{ products: Product[]; source: 'cms' | 'fallback' }> {
    const query = `?populate=*&pagination[pageSize]=${pageSize}`;

    for (const collection of ['products', 'parts']) {
        const data = await getJson(`/api/${collection}${query}`);
        if (data?.data?.length) {
            return { products: data.data as Product[], source: 'cms' };
        }
    }

    return { products: fallbackProducts, source: 'fallback' };
}

export async function fetchHeroSlides(): Promise<HeroSlideStrapi[]> {
    const data = await getJson('/api/hero-slides?populate=*&sort=sort_order:asc');
    if (data?.data?.length) return data.data as HeroSlideStrapi[];
    return fallbackHeroSlides;
}

/** Newsletter opt-in. Posts to the CMS when available; never blocks the UI. */
export async function subscribeToNewsletter(email: string): Promise<boolean> {
    try {
        const res = await fetch(`${STRAPI_URL}/api/subscribers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', ...strapiHeaders },
            body: JSON.stringify({ data: { email, source: 'valangel-landing' } }),
        });
        return res.ok;
    } catch {
        return false;
    }
}
