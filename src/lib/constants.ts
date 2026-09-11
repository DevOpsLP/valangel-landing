/** Runtime configuration. Every value is overridable through env vars so the
 *  same build can point at staging or production impoven-cms. */

const waNumber = import.meta.env.PUBLIC_WA_NUMBER ?? '584124113978';

export const WA_NUMBER = waNumber;
export const WA_LINK = `https://wa.me/${waNumber}`;

/** impoven-cms (Strapi v5) base URL. */
export const STRAPI_URL =
    import.meta.env.PUBLIC_STRAPI_URL ?? import.meta.env.STRAPI_URL ?? 'http://localhost:1337';
export const STRAPI_TOKEN = import.meta.env.PUBLIC_STRAPI_TOKEN ?? '';
export const GOOGLE_MAPS_API_KEY = import.meta.env.PUBLIC_GOOGLE_MAPS_API_KEY ?? '';

/** Pre-built headers for every Strapi fetch. */
export const strapiHeaders: HeadersInit = STRAPI_TOKEN
    ? { Authorization: `Bearer ${STRAPI_TOKEN}` }
    : {};

// ─── Brand identity ───────────────────────────────────────────────────────────

export const BRAND = {
    name: 'Valangel Skin',
    tagline: 'Made to glow.',
    claim: 'Skincare for a more radiant you',
    city: 'Valencia, Venezuela',
    email: 'hola@valangelskin.com',
    instagram: 'https://instagram.com/valangelskin',
    tiktok: 'https://tiktok.com/@valangelskin',
    facebook: 'https://facebook.com/valangelskin',
    youtube: 'https://youtube.com/@valangelskin',
    pinterest: 'https://pinterest.com/valangelskin',
} as const;

export const ANNOUNCEMENTS = [
    'Envíos a todo el país',
    'Productos originales',
    'Tu rutina, nuestra pasión',
] as const;
