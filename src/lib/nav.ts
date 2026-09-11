/** Single source of truth for navigation — header, mobile drawer and footer. */
import { categories } from './catalog';

export interface NavLink {
    label: string;
    href: string;
    /** Sub-items rendered as a mega menu on desktop and an accordion on mobile. */
    children?: Array<{ label: string; href: string; note?: string }>;
}

export const primaryNav: NavLink[] = [
    { label: 'Inicio', href: '/' },
    {
        label: 'Tienda',
        href: '/tienda',
        children: [
            { label: 'Ver todo', href: '/tienda' },
            ...categories.map((c) => ({ label: c.name, href: `/tienda?categoria=${c.slug}`, note: c.blurb })),
        ],
    },
    { label: 'Marcas', href: '/marcas' },
    { label: 'Rutinas', href: '/rutinas' },
];

export const secondaryNav: NavLink[] = [
    { label: 'Acerca de', href: '/acerca-de' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contacto', href: '/contacto' },
];

export const allNav: NavLink[] = [...primaryNav, ...secondaryNav];

export const footerNav: Array<{ title: string; links: Array<{ label: string; href: string }> }> = [
    {
        title: 'Tienda',
        links: [
            { label: 'Ver todo', href: '/tienda' },
            { label: 'Best sellers', href: '/tienda?categoria=todos' },
            { label: 'Kits & Sets', href: '/tienda?categoria=kits-sets' },
            { label: 'Accesorios', href: '/tienda?categoria=accesorios' },
            { label: 'Mis favoritos', href: '/favoritos' },
        ],
    },
    {
        title: 'Descubre',
        links: [
            { label: 'Marcas', href: '/marcas' },
            { label: 'Crear mi rutina', href: '/rutinas' },
            { label: 'Blog', href: '/blog' },
            { label: 'Acerca de', href: '/acerca-de' },
        ],
    },
    {
        title: 'Ayuda',
        links: [
            { label: 'Envíos', href: '/envios' },
            { label: 'Cambios y devoluciones', href: '/cambios-y-devoluciones' },
            { label: 'Preguntas frecuentes', href: '/contacto#faq' },
            { label: 'Términos y condiciones', href: '/terminos' },
            { label: 'Privacidad', href: '/terminos#privacidad' },
            { label: 'Contacto', href: '/contacto' },
        ],
    },
];

/** Quick suggestions shown in the empty state of the search overlay. */
export const popularSearches = [
    'Protector solar',
    'Niacinamida',
    'Anua',
    'Gua sha',
    'Piel sensible',
    'Kits',
];
