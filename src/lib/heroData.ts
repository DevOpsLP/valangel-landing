import { PHOTO, unsplash } from './catalog';

// ─── Hero slide (Strapi v5 shape) ─────────────────────────────────────────────
// Keeps every field the impoven-cms `hero-slides` collection already exposes and
// adds three optional ones (eyebrow, script_accent, theme) that simply fall back
// to sensible defaults when the CMS does not provide them.

export interface StrapiMedia {
    id: number;
    url: string;
    alternativeText?: string | null;
}

export interface HeroSlideStrapi {
    id: number;
    documentId?: string;
    title: string;
    subtitle?: string | null;
    eyebrow?: string | null;
    script_accent?: string | null;
    cta_label: string;
    cta_href: string;
    secondary_label?: string | null;
    secondary_href?: string | null;
    image?: StrapiMedia | null;
    background_type: 'color' | 'image' | 'gradient';
    background_color?: 'rose' | 'cream' | 'silk' | 'black' | 'white' | null;
    background_image?: StrapiMedia | null;
    sort_order?: number | null;
}

export const fallbackHeroSlides: HeroSlideStrapi[] = [
    {
        id: 1,
        eyebrow: 'Skincare for a more radiant you',
        title: 'Made to glow.',
        subtitle: 'Productos que cuidan tu piel hoy, y la mejor versión de ti mañana.',
        script_accent: 'Good Skin\nBrighter You',
        cta_label: 'Explora la tienda',
        cta_href: '/tienda',
        secondary_label: 'Crear mi rutina',
        secondary_href: '/rutinas',
        image: { id: 1, url: unsplash(PHOTO.bottlesFour, 1200), alternativeText: 'Rutina de skincare Valangel' },
        background_type: 'gradient',
        background_color: 'rose',
        sort_order: 0,
    },
    {
        id: 2,
        eyebrow: 'K-Beauty original',
        title: 'Resultados reales, rutinas que amas.',
        subtitle: 'Anua, medicube, SKIN1004, Beauty of Joseon y más — 100 % auténticos, con envío a todo el país.',
        script_accent: 'Real\nResults',
        cta_label: 'Ver marcas',
        cta_href: '/marcas',
        secondary_label: 'Ir a la tienda',
        secondary_href: '/tienda',
        image: { id: 2, url: unsplash(PHOTO.serumTrio, 1200), alternativeText: 'Sueros coreanos originales' },
        background_type: 'gradient',
        background_color: 'cream',
        sort_order: 1,
    },
    {
        id: 3,
        eyebrow: 'Tu rutina a tu medida',
        title: 'Una piel más radiante también es una versión más feliz de ti.',
        subtitle: 'Responde unas preguntas y te recomendamos los productos perfectos para tu tipo de piel.',
        script_accent: 'Self\nCare',
        cta_label: 'Crear mi rutina',
        cta_href: '/rutinas',
        secondary_label: 'Asesoría por WhatsApp',
        secondary_href: 'wa',
        image: { id: 3, url: unsplash(PHOTO.guaShaSet, 1200), alternativeText: 'Accesorios de skincare' },
        background_type: 'gradient',
        background_color: 'silk',
        sort_order: 2,
    },
];
