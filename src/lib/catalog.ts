/**
 * Catalog domain model.
 *
 * The shapes mirror what impoven-cms (Strapi v5) returns from `/api/products`
 * so swapping the fallback for live data is a no-op at the component level.
 * Until the CMS is populated, `fallbackProducts` keeps the whole storefront —
 * grid, filters, quick view, cart, checkout — fully navigable.
 */

// ─── Strapi media ─────────────────────────────────────────────────────────────

export interface StrapiMedia {
    id: number;
    url: string;
    alternativeText?: string | null;
    formats?: Record<string, unknown>;
}

// ─── Taxonomy ─────────────────────────────────────────────────────────────────

export interface Category {
    id: number;
    documentId?: string;
    name: string;
    slug: string;
    /** Short line used on the category circles and collection headers. */
    blurb?: string;
    image?: string;
}

export interface Brand {
    id: number;
    documentId?: string;
    name: string;
    slug: string;
    origin?: string;
    blurb?: string;
    /** Wordmark is rendered as text — K-beauty logos are typographic anyway. */
    wordmarkClass?: string;
}

export interface Concern {
    slug: string;
    name: string;
    /** Inline SVG path data for the pictogram row in "Build your routine". */
    icon: 'leaf' | 'spark' | 'drop' | 'waves' | 'dots' | 'sun' | 'circle';
    description: string;
}

// ─── Product ──────────────────────────────────────────────────────────────────

export interface Product {
    id: number;
    documentId?: string;
    name: string;
    slug: string;
    sku: string;
    /** Markdown — rendered with react-markdown in the quick view. */
    description?: string | null;
    brand?: Brand | null;
    category?: Category | null;
    price?: number | null;
    /** Optional CMS-provided bolívar price; otherwise derived from the BCV rate. */
    price_ves?: number | null;
    compare_at_price?: number | null;
    rating?: number | null;
    reviews_count?: number | null;
    badge?: string | null;
    stock?: number | null;
    size?: string | null;
    concerns?: string[];
    skin_types?: string[];
    key_ingredients?: string[];
    how_to_use?: string | null;
    image?: StrapiMedia | null;
    images?: StrapiMedia[];
    featured?: boolean;
}

// ─── Placeholder imagery (free Unsplash) ──────────────────────────────────────

/** Builds an Unsplash delivery URL. All ids below were checked to resolve 200. */
export function unsplash(id: string, w = 900, h?: number): string {
    const size = h ? `w=${w}&h=${h}` : `w=${w}`;
    return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&${size}&q=80`;
}

export const PHOTO = {
    cleanserTube: '1620916566398-39f1143ab7be',
    serumTrio: '1585652757141-8837d676fac8',
    bottlesFour: '1631729371254-42c2892f0e6e',
    dropperWhite: '1576426863848-c21f53c60b19',
    amberDropper: '1608571423902-eed4a5ad8108',
    pedestals: '1629198688000-71f23e745b6e',
    maskBox: '1608248543803-ba4f8c70ae0b',
    bodyOil: '1611930022073-b7a4ba5fcccd',
    bodyLotion: '1526947425960-945c6e72858f',
    creamTube: '1556228578-8c89e6adf883',
    pinkPowder: '1503236823255-94609f598e71',
    lipFlatlay: '1598452963314-b09f397a5c48',
    roseGoldFlatlay: '1596462502278-27bfdc403348',
    marbleFlatlay: '1522335789203-aabd1fc54bc9',
    dropperLeaf: '1617897903246-719242758050',
    blackJars: '1567721913486-6585f069b332',
    guaShaSet: '1600428877878-1a0fd85beda8',
    jadeRoller: '1592136957897-b2b6ca21e10d',
    brushWreath: '1571875257727-256c39da42af',
    compactFlowers: '1547887538-047f814bfb64',
    pinkHairdryer: '1522338140262-f46f5913618a',
    facialMask: '1570172619644-dfd03ed5d881',
    spaMask: '1616394584738-fc6e612e71b9',
    beautyCloseup: '1487412947147-5cebf100ffc2',
    handDropper: '1573575155376-b5010099301b',
    handCream: '1620916297397-a4a5402a3c6c',
    handsJar: '1552046122-03184de85e08',
    ambersMoody: '1631730359585-38a4935cbec4',
    palette: '1512496015851-a90fb38ba796',
    pinkNails: '1519014816548-bf5fe059798b',
} as const;

const media = (id: string, alt: string, i = 0): StrapiMedia => ({
    id: i,
    url: unsplash(id, 900),
    alternativeText: alt,
});

// ─── Categories ───────────────────────────────────────────────────────────────

export const categories: Category[] = [
    { id: 1, name: 'Limpiadores',      slug: 'limpiadores',      blurb: 'Primer paso de toda rutina',        image: PHOTO.cleanserTube },
    { id: 2, name: 'Tónicos',          slug: 'tonicos',          blurb: 'Equilibrio y preparación',          image: PHOTO.dropperWhite },
    { id: 3, name: 'Sueros',           slug: 'sueros',           blurb: 'Activos concentrados',              image: PHOTO.serumTrio },
    { id: 4, name: 'Cremas',           slug: 'cremas',           blurb: 'Hidratación que sella la rutina',   image: PHOTO.pedestals },
    { id: 5, name: 'Protección Solar', slug: 'proteccion-solar', blurb: 'El anti-edad más eficaz',           image: PHOTO.bottlesFour },
    { id: 6, name: 'Lip Care',         slug: 'lip-care',         blurb: 'Labios suaves todo el día',         image: PHOTO.lipFlatlay },
    { id: 7, name: 'Body Care',        slug: 'body-care',        blurb: 'Tu piel, de pies a cabeza',         image: PHOTO.bodyLotion },
    { id: 8, name: 'Accesorios',       slug: 'accesorios',       blurb: 'Pequeños detalles, grandes resultados', image: PHOTO.jadeRoller },
    { id: 9, name: 'Kits & Sets',      slug: 'kits-sets',        blurb: 'Rutinas completas listas para usar', image: PHOTO.maskBox },
];

export const categoryBySlug = new Map(categories.map((c) => [c.slug, c]));

// ─── Brands ───────────────────────────────────────────────────────────────────

export const brands: Brand[] = [
    { id: 1,  name: 'Anua',             slug: 'anua',             origin: 'Corea del Sur', blurb: 'Formulaciones mínimas con ingredientes de origen natural. Su Heartleaf 77% es un básico para pieles reactivas.' },
    { id: 2,  name: 'medicube',         slug: 'medicube',         origin: 'Corea del Sur', blurb: 'Dermocosmética coreana centrada en resultados visibles: colágeno, PDRN y tecnología de cabina en casa.' },
    { id: 3,  name: 'SKIN1004',         slug: 'skin1004',         origin: 'Corea del Sur', blurb: 'Centella asiática de Madagascar en fórmulas ligeras, calmantes y aptas para piel sensible.' },
    { id: 4,  name: 'Dr. Althea',       slug: 'dr-althea',        origin: 'Corea del Sur', blurb: 'Skincare clínico y accesible. Su 345 Relief Cream repara la barrera sin sensación pesada.' },
    { id: 5,  name: 'rhode',            slug: 'rhode',            origin: 'Estados Unidos', blurb: 'Rutina editada al mínimo: pocos productos, mucho glow. El Peptide Lip Treatment es su clásico.' },
    { id: 6,  name: 'TOCOBO',           slug: 'tocobo',           origin: 'Corea del Sur', blurb: 'Texturas limpias y protectores solares que no dejan velo blanco.' },
    { id: 7,  name: 'celimax',          slug: 'celimax',          origin: 'Corea del Sur', blurb: 'Ingredientes vegetales concentrados, ideal para piel mixta y grasa.' },
    { id: 8,  name: 'Beauty of Joseon', slug: 'beauty-of-joseon', origin: 'Corea del Sur', blurb: 'Herbología coreana tradicional reinterpretada: arroz, ginseng y filtros solares elegantes.' },
    { id: 9,  name: 'numbuzin',         slug: 'numbuzin',         origin: 'Corea del Sur', blurb: 'Rutinas por números. Cada línea resuelve una necesidad concreta, sin adivinanzas.' },
    { id: 10, name: 'PURITO',           slug: 'purito',           origin: 'Corea del Sur', blurb: 'Fórmulas veganas, sin fragancia y con listas de ingredientes cortas y honestas.' },
];

export const brandBySlug = new Map(brands.map((b) => [b.slug, b]));

// ─── Skin concerns ────────────────────────────────────────────────────────────

export const concerns: Concern[] = [
    { slug: 'piel-sensible', name: 'Piel sensible', icon: 'leaf',   description: 'Enrojecimiento, tirantez y reacciones frecuentes.' },
    { slug: 'acne',          name: 'Acné',          icon: 'spark',  description: 'Brotes, puntos negros y poros congestionados.' },
    { slug: 'manchas',       name: 'Manchas',       icon: 'circle', description: 'Hiperpigmentación, marcas post-acné y tono desigual.' },
    { slug: 'hidratacion',   name: 'Hidratación',   icon: 'drop',   description: 'Piel deshidratada que pierde luminosidad.' },
    { slug: 'anti-edad',     name: 'Anti-edad',     icon: 'waves',  description: 'Líneas finas, pérdida de firmeza y elasticidad.' },
    { slug: 'mixta-grasa',   name: 'Piel mixta/grasa', icon: 'dots', description: 'Brillo en zona T y textura irregular.' },
    { slug: 'piel-seca',     name: 'Piel seca',     icon: 'sun',    description: 'Descamación, aspereza y barrera debilitada.' },
];

export const concernBySlug = new Map(concerns.map((c) => [c.slug, c]));

// ─── Fallback catalog ─────────────────────────────────────────────────────────

const cat = (slug: string) => categoryBySlug.get(slug) ?? null;
const br = (slug: string) => brandBySlug.get(slug) ?? null;

export const fallbackProducts: Product[] = [
    {
        id: 101, name: 'Collagen Jelly Cream', slug: 'medicube-collagen-jelly-cream', sku: 'VLG-MC-101',
        brand: br('medicube'), category: cat('cremas'), price: 40, compare_at_price: 46,
        rating: 4.8, reviews_count: 214, badge: 'Best seller', stock: 18, size: '110 ml', featured: true,
        concerns: ['anti-edad', 'hidratacion'], skin_types: ['Todo tipo de piel'],
        key_ingredients: ['Colágeno hidrolizado', 'Péptidos', 'Niacinamida'],
        description: 'Una **crema-gelatina** que rebota al tacto y se funde en la piel sin dejar sensación pegajosa.\n\nCombina colágeno hidrolizado con péptidos para devolver elasticidad y un acabado jugoso desde la primera semana.',
        how_to_use: 'Aplica una capa generosa como último paso de la rutina de noche. De día, sella siempre con protector solar.',
        images: [media(PHOTO.creamTube, 'Collagen Jelly Cream', 1), media(PHOTO.pedestals, 'Textura de la crema', 2)],
    },
    {
        id: 102, name: 'Heartleaf 77% Soothing Toner', slug: 'anua-heartleaf-77-toner', sku: 'VLG-AN-102',
        brand: br('anua'), category: cat('tonicos'), price: 32,
        rating: 4.9, reviews_count: 512, badge: 'Best seller', stock: 25, size: '250 ml', featured: true,
        concerns: ['piel-sensible', 'acne'], skin_types: ['Sensible', 'Mixta'],
        key_ingredients: ['Houttuynia Cordata 77%', 'Pantenol', 'Ácido salicílico'],
        description: 'El tónico calmante que convirtió a Anua en un fenómeno.\n\n**77 % de extracto de heartleaf** para bajar el rojo, ordenar la textura y dejar la piel lista para absorber el resto de la rutina.',
        how_to_use: 'Tras limpiar, aplica con las manos dando palmaditas. Puedes usarlo también como mascarilla exprés con algodón durante 5 minutos.',
        images: [media(PHOTO.dropperWhite, 'Heartleaf 77% Soothing Toner', 1), media(PHOTO.serumTrio, 'Tónico en uso', 2)],
    },
    {
        id: 103, name: '345 Relief Cream', slug: 'dr-althea-345-relief-cream', sku: 'VLG-DA-103',
        brand: br('dr-althea'), category: cat('cremas'), price: 38,
        rating: 4.7, reviews_count: 188, badge: 'Best seller', stock: 12, size: '50 ml', featured: true,
        concerns: ['piel-sensible', 'piel-seca'], skin_types: ['Seca', 'Sensible'],
        key_ingredients: ['Ceramidas', 'Escualano', 'Madecassoside'],
        description: 'Reparadora de barrera con una textura ligera que no asfixia.\n\nIdeal después de exfoliar, tras el sol o cuando la piel está reactiva.',
        how_to_use: 'Aplica mañana y noche sobre el rostro limpio y aún húmedo para sellar mejor la hidratación.',
        images: [media(PHOTO.cleanserTube, '345 Relief Cream', 1), media(PHOTO.bottlesFour, 'Rutina completa', 2)],
    },
    {
        id: 104, name: 'Peptide Lip Treatment', slug: 'rhode-peptide-lip-treatment', sku: 'VLG-RH-104',
        brand: br('rhode'), category: cat('lip-care'), price: 30,
        rating: 4.9, reviews_count: 933, badge: 'Best seller', stock: 30, size: '10 ml', featured: true,
        concerns: ['hidratacion'], skin_types: ['Todo tipo de piel'],
        key_ingredients: ['Péptidos', 'Manteca de shea', 'Cica'],
        description: 'El bálsamo que todo el mundo tiene en el bolso.\n\nBrillo sutil, nada pegajoso y una capa que aguanta la noche entera.',
        how_to_use: 'Aplica cuando quieras. Úsalo también sobre cutículas o zonas secas.',
        images: [media(PHOTO.lipFlatlay, 'Peptide Lip Treatment', 1)],
    },
    {
        id: 105, name: 'Hyalu-Cica Water-Fit Sun Serum', slug: 'skin1004-hyalu-cica-sun-serum', sku: 'VLG-SK-105',
        brand: br('skin1004'), category: cat('proteccion-solar'), price: 34,
        rating: 4.8, reviews_count: 421, badge: 'Best seller', stock: 22, size: '50 ml', featured: true,
        concerns: ['piel-sensible', 'manchas', 'anti-edad'], skin_types: ['Todo tipo de piel'],
        key_ingredients: ['Centella asiática', 'Ácido hialurónico', 'SPF50+ PA++++'],
        description: 'Protector solar con **textura de sérum**: se absorbe en segundos y no deja velo blanco.\n\nSPF50+ PA++++ con centella para calmar mientras protege.',
        how_to_use: 'Último paso de la rutina de día. Reaplica cada 2-3 horas de exposición directa.',
        images: [media(PHOTO.bottlesFour, 'Hyalu-Cica Sun Serum', 1), media(PHOTO.amberDropper, 'Textura sérum', 2)],
    },
    {
        id: 106, name: 'Peach 70% Niacinamide Serum', slug: 'anua-peach-70-niacinamide-serum', sku: 'VLG-AN-106',
        brand: br('anua'), category: cat('sueros'), price: 36, compare_at_price: 42,
        rating: 4.7, reviews_count: 276, badge: 'Nuevo', stock: 16, size: '30 ml', featured: true,
        concerns: ['manchas', 'mixta-grasa'], skin_types: ['Mixta', 'Grasa'],
        key_ingredients: ['Niacinamida 10%', 'Extracto de durazno 70%', 'Arbutina'],
        description: 'Ilumina el tono y desdibuja marcas post-acné sin irritar.\n\nLa niacinamida al 10 % viene amortiguada con extracto de durazno, así que es amable incluso en pieles reactivas.',
        how_to_use: 'De noche, después del tónico. Introduce el producto poco a poco: 3 veces por semana la primera semana.',
        images: [media(PHOTO.serumTrio, 'Peach 70% Niacinamide Serum', 1), media(PHOTO.dropperLeaf, 'Aplicación del sérum', 2)],
    },
    {
        id: 107, name: 'Rice Probiotics Gel Cleanser', slug: 'beauty-of-joseon-rice-cleanser', sku: 'VLG-BJ-107',
        brand: br('beauty-of-joseon'), category: cat('limpiadores'), price: 22,
        rating: 4.6, reviews_count: 143, stock: 28, size: '150 ml',
        concerns: ['hidratacion', 'piel-seca'], skin_types: ['Seca', 'Normal'],
        key_ingredients: ['Agua de arroz', 'Probióticos', 'Glicerina'],
        description: 'Limpiador en gel de pH bajo que deja la piel limpia sin esa sensación de tirantez.',
        how_to_use: 'Emulsiona con agua tibia y masajea 30 segundos. Segundo paso de la doble limpieza.',
        images: [media(PHOTO.cleanserTube, 'Rice Probiotics Gel Cleanser', 1)],
    },
    {
        id: 108, name: 'Bean Cleansing Oil', slug: 'celimax-bean-cleansing-oil', sku: 'VLG-CX-108',
        brand: br('celimax'), category: cat('limpiadores'), price: 26,
        rating: 4.7, reviews_count: 201, stock: 20, size: '200 ml',
        concerns: ['acne', 'mixta-grasa'], skin_types: ['Mixta', 'Grasa'],
        key_ingredients: ['Aceite de soja', 'Vitamina E'],
        description: 'Disuelve protector solar y maquillaje resistente al agua, y se enjuaga sin dejar película.',
        how_to_use: 'Sobre piel seca, masajea en círculos, añade agua para emulsionar y enjuaga.',
        images: [media(PHOTO.bodyOil, 'Bean Cleansing Oil', 1)],
    },
    {
        id: 109, name: 'Bio Peel Gauze Peeling', slug: 'purito-bio-peel-gauze', sku: 'VLG-PU-109',
        brand: br('purito'), category: cat('limpiadores'), price: 24,
        rating: 4.5, reviews_count: 97, stock: 14, size: '70 uds',
        concerns: ['manchas', 'mixta-grasa'], skin_types: ['Mixta', 'Grasa'],
        key_ingredients: ['AHA', 'Extracto de té verde'],
        description: 'Discos exfoliantes de doble cara con AHA. Textura más lisa en dos usos.',
        how_to_use: 'Dos veces por semana, de noche, sobre piel limpia. Enjuaga y sigue con tónico.',
        images: [media(PHOTO.pinkPowder, 'Bio Peel Gauze Peeling', 1)],
    },
    {
        id: 110, name: 'Multi Ceramide Cream', slug: 'tocobo-multi-ceramide-cream', sku: 'VLG-TC-110',
        brand: br('tocobo'), category: cat('cremas'), price: 33,
        rating: 4.8, reviews_count: 164, stock: 19, size: '50 ml',
        concerns: ['piel-seca', 'piel-sensible'], skin_types: ['Seca'],
        key_ingredients: ['Complejo de 5 ceramidas', 'Colesterol', 'Ácidos grasos'],
        description: 'Restaura la barrera con la proporción clásica **ceramidas : colesterol : ácidos grasos**.',
        how_to_use: 'Último paso hidratante de la noche. En invierno, también de día.',
        images: [media(PHOTO.blackJars, 'Multi Ceramide Cream', 1)],
    },
    {
        id: 111, name: 'Vita-Niacin Glow Toner Pad', slug: 'numbuzin-vita-niacin-toner-pad', sku: 'VLG-NB-111',
        brand: br('numbuzin'), category: cat('tonicos'), price: 29,
        rating: 4.6, reviews_count: 132, badge: 'Nuevo', stock: 21, size: '70 uds',
        concerns: ['manchas', 'hidratacion'], skin_types: ['Todo tipo de piel'],
        key_ingredients: ['Niacinamida', 'Vitamina C derivada', 'Pantenol'],
        description: 'Discos empapados en tónico iluminador: tónico, exfoliación suave y mascarilla exprés en un solo paso.',
        how_to_use: 'Pasa un disco por el rostro tras limpiar. No requiere enjuague.',
        images: [media(PHOTO.pedestals, 'Vita-Niacin Glow Toner Pad', 1)],
    },
    {
        id: 112, name: 'Deep Sea Hydro Serum', slug: 'skin1004-deep-sea-hydro-serum', sku: 'VLG-SK-112',
        brand: br('skin1004'), category: cat('sueros'), price: 31,
        rating: 4.7, reviews_count: 118, stock: 17, size: '50 ml',
        concerns: ['hidratacion', 'piel-seca'], skin_types: ['Seca', 'Deshidratada'],
        key_ingredients: ['Agua marina profunda', 'Ácido hialurónico de 5 pesos'],
        description: 'Hidratación en capas para pieles que beben producto y siguen tirantes al mediodía.',
        how_to_use: 'Sobre piel húmeda, antes de la crema. Puedes aplicar dos capas finas.',
        images: [media(PHOTO.dropperWhite, 'Deep Sea Hydro Serum', 1)],
    },
    {
        id: 113, name: 'Retinal 0.05% Night Ampoule', slug: 'medicube-retinal-night-ampoule', sku: 'VLG-MC-113',
        brand: br('medicube'), category: cat('sueros'), price: 48, compare_at_price: 55,
        rating: 4.8, reviews_count: 302, badge: 'Últimas unidades', stock: 4, size: '30 ml',
        concerns: ['anti-edad', 'manchas'], skin_types: ['Normal', 'Mixta'],
        key_ingredients: ['Retinal 0.05%', 'Escualano', 'Ceramidas'],
        description: 'Retinal encapsulado: los resultados del retinol, con bastante menos irritación.\n\n**Solo de noche** y siempre acompañado de protector solar al día siguiente.',
        how_to_use: 'Empieza 2 noches por semana durante 3 semanas y sube poco a poco. No combinar con exfoliantes la misma noche.',
        images: [media(PHOTO.amberDropper, 'Retinal Night Ampoule', 1), media(PHOTO.ambersMoody, 'Ampolla de noche', 2)],
    },
    {
        id: 114, name: 'Cotton Soft Sun Stick', slug: 'tocobo-cotton-soft-sun-stick', sku: 'VLG-TC-114',
        brand: br('tocobo'), category: cat('proteccion-solar'), price: 27,
        rating: 4.9, reviews_count: 388, stock: 26, size: '19 g',
        concerns: ['mixta-grasa', 'anti-edad'], skin_types: ['Mixta', 'Grasa'],
        key_ingredients: ['SPF50+ PA++++', 'Filtros minerales', 'Vitamina E'],
        description: 'Stick de reaplicación con acabado seco. Cabe en cualquier bolso y no descompone el maquillaje.',
        how_to_use: 'Desliza 3-4 veces por zona y difumina con los dedos. Reaplica cada 2 horas.',
        images: [media(PHOTO.bottlesFour, 'Cotton Soft Sun Stick', 1)],
    },
    {
        id: 115, name: 'Relief Sun: Rice + Probiotics', slug: 'beauty-of-joseon-relief-sun', sku: 'VLG-BJ-115',
        brand: br('beauty-of-joseon'), category: cat('proteccion-solar'), price: 25,
        rating: 4.9, reviews_count: 764, badge: 'Best seller', stock: 34, size: '50 ml',
        concerns: ['hidratacion', 'anti-edad'], skin_types: ['Todo tipo de piel'],
        key_ingredients: ['SPF50+ PA++++', 'Agua de arroz', 'Probióticos'],
        description: 'El protector solar coreano más querido: textura de crema hidratante, acabado luminoso, cero olor químico.',
        how_to_use: 'Dos dedos de producto como último paso de la mañana.',
        images: [media(PHOTO.creamTube, 'Relief Sun Rice + Probiotics', 1)],
    },
    {
        id: 116, name: 'Glazed Lip Oil', slug: 'rhode-glazed-lip-oil', sku: 'VLG-RH-116',
        brand: br('rhode'), category: cat('lip-care'), price: 28,
        rating: 4.7, reviews_count: 245, badge: 'Nuevo', stock: 23, size: '8 ml',
        concerns: ['hidratacion'], skin_types: ['Todo tipo de piel'],
        key_ingredients: ['Aceite de jojoba', 'Escualano', 'Péptidos'],
        description: 'Aceite de labios con brillo de espejo y un tono rosado casi imperceptible.',
        how_to_use: 'Solo o sobre tu labial favorito para un acabado glossy.',
        images: [media(PHOTO.lipFlatlay, 'Glazed Lip Oil', 1)],
    },
    {
        id: 117, name: 'Ceramide Body Lotion', slug: 'purito-ceramide-body-lotion', sku: 'VLG-PU-117',
        brand: br('purito'), category: cat('body-care'), price: 23,
        rating: 4.6, reviews_count: 88, stock: 27, size: '300 ml',
        concerns: ['piel-seca', 'hidratacion'], skin_types: ['Seca'],
        key_ingredients: ['Ceramidas', 'Manteca de karité', 'Urea'],
        description: 'Loción corporal de absorción rápida que no deja la piel pegajosa con el calor.',
        how_to_use: 'Después de la ducha, sobre la piel aún húmeda.',
        images: [media(PHOTO.bodyLotion, 'Ceramide Body Lotion', 1)],
    },
    {
        id: 118, name: 'Glow Body Oil', slug: 'celimax-glow-body-oil', sku: 'VLG-CX-118',
        brand: br('celimax'), category: cat('body-care'), price: 26,
        rating: 4.5, reviews_count: 64, stock: 15, size: '150 ml',
        concerns: ['piel-seca'], skin_types: ['Seca', 'Normal'],
        key_ingredients: ['Aceite de camelia', 'Vitamina E'],
        description: 'Aceite seco con un brillo satinado precioso para hombros y piernas.',
        how_to_use: 'Masajea sobre la piel seca o mézclalo con tu loción habitual.',
        images: [media(PHOTO.bodyOil, 'Glow Body Oil', 1)],
    },
    {
        id: 119, name: 'Gua Sha de Cuarzo Rosa', slug: 'gua-sha-cuarzo-rosa', sku: 'VLG-AC-119',
        brand: null, category: cat('accesorios'), price: 15,
        rating: 4.8, reviews_count: 156, stock: 40, size: '1 ud',
        concerns: ['anti-edad'], skin_types: ['Todo tipo de piel'],
        key_ingredients: ['Cuarzo rosa natural'],
        description: 'Piedra de cuarzo rosa pulida a mano para drenaje linfático y definición del contorno.',
        how_to_use: 'Siempre con aceite o sérum. Desliza desde el centro del rostro hacia las orejas, 5 pasadas por zona.',
        images: [media(PHOTO.guaShaSet, 'Gua Sha de cuarzo rosa', 1)],
    },
    {
        id: 120, name: 'Facial Roller', slug: 'facial-roller-cuarzo', sku: 'VLG-AC-120',
        brand: null, category: cat('accesorios'), price: 18,
        rating: 4.7, reviews_count: 134, stock: 38, size: '1 ud',
        concerns: ['hidratacion', 'anti-edad'], skin_types: ['Todo tipo de piel'],
        description: 'Rodillo de doble cabezal: el grande para mejillas y frente, el pequeño para el contorno de ojos.',
        how_to_use: 'Guárdalo en la nevera para desinflamar por las mañanas.',
        images: [media(PHOTO.jadeRoller, 'Facial roller de cuarzo', 1)],
    },
    {
        id: 121, name: 'Skincare Headband', slug: 'skincare-headband', sku: 'VLG-AC-121',
        brand: null, category: cat('accesorios'), price: 12,
        rating: 4.9, reviews_count: 210, stock: 45, size: 'Talla única',
        description: 'Banda de rizo suave que aguanta el pelo en su sitio durante toda la rutina.',
        how_to_use: 'Lávala a mano con agua fría para que no pierda elasticidad.',
        images: [media(PHOTO.pinkHairdryer, 'Skincare headband', 1)],
    },
    {
        id: 122, name: 'Makeup Pads Reutilizables', slug: 'makeup-pads-reutilizables', sku: 'VLG-AC-122',
        brand: null, category: cat('accesorios'), price: 10,
        rating: 4.6, reviews_count: 92, stock: 50, size: '8 uds + bolsa',
        description: 'Discos de algodón lavables. Ocho discos sustituyen cientos de desechables.',
        how_to_use: 'Lávalos en la bolsa incluida, ciclo frío, y deja secar al aire.',
        images: [media(PHOTO.brushWreath, 'Makeup pads reutilizables', 1)],
    },
    {
        id: 123, name: 'Skin Spatula Ultrasónica', slug: 'skin-spatula-ultrasonica', sku: 'VLG-AC-123',
        brand: null, category: cat('accesorios'), price: 28,
        rating: 4.4, reviews_count: 57, stock: 11, size: '1 ud + cable USB',
        concerns: ['acne', 'mixta-grasa'],
        description: 'Espátula ultrasónica para una limpieza profunda de poros en casa.',
        how_to_use: 'Sobre piel húmeda, 1 vez por semana como máximo. Hidrata siempre después.',
        images: [media(PHOTO.compactFlowers, 'Skin spatula ultrasónica', 1)],
    },
    {
        id: 124, name: 'Travel Set Valangel', slug: 'travel-set-valangel', sku: 'VLG-KT-124',
        brand: null, category: cat('kits-sets'), price: 16,
        rating: 4.8, reviews_count: 121, stock: 24, size: '4 envases + neceser',
        description: 'Envases rellenables de viaje y neceser transparente apto para cabina.',
        how_to_use: 'Rellena con tus básicos y llévate la rutina completa en 100 ml.',
        images: [media(PHOTO.pedestals, 'Travel set Valangel', 1)],
    },
    {
        id: 125, name: 'Kit Rutina Esencial', slug: 'kit-rutina-esencial', sku: 'VLG-KT-125',
        brand: null, category: cat('kits-sets'), price: 89, compare_at_price: 104,
        rating: 4.9, reviews_count: 178, badge: 'Ahorra 15%', stock: 9, size: '4 productos',
        concerns: ['hidratacion', 'piel-sensible'], skin_types: ['Todo tipo de piel'],
        description: 'Limpiador, tónico, sérum y protector solar. La rutina completa sin decidir nada.\n\n**Incluye:** Rice Gel Cleanser · Heartleaf Toner · Deep Sea Serum · Relief Sun',
        how_to_use: 'Sigue el orden del folleto incluido: limpiar, tonificar, tratar, proteger.',
        images: [media(PHOTO.bottlesFour, 'Kit Rutina Esencial', 1), media(PHOTO.serumTrio, 'Productos del kit', 2)],
    },
    {
        id: 126, name: 'Kit Glow Anti-Manchas', slug: 'kit-glow-anti-manchas', sku: 'VLG-KT-126',
        brand: null, category: cat('kits-sets'), price: 96,
        rating: 4.7, reviews_count: 83, stock: 7, size: '3 productos',
        concerns: ['manchas', 'anti-edad'],
        description: 'Sérum de niacinamida, tónico con vitamina C y protector solar. Tres pasos, un objetivo: unificar el tono.',
        how_to_use: 'Niacinamida de noche, vitamina C de día y protector solar siempre.',
        images: [media(PHOTO.marbleFlatlay, 'Kit Glow Anti-Manchas', 1)],
    },
];

// ─── Derived helpers ──────────────────────────────────────────────────────────

export function productImages(p: Product, base = ''): string[] {
    const list = p.images?.length ? p.images : p.image ? [p.image] : [];
    return list.map((m) => (m.url.startsWith('http') ? m.url : `${base}${m.url}`));
}

export function bestSellers(list: Product[]): Product[] {
    const flagged = list.filter((p) => p.badge === 'Best seller' || p.featured);
    return flagged.length ? flagged : list.slice(0, 8);
}

export function byCategory(list: Product[], slug: string): Product[] {
    return list.filter((p) => p.category?.slug === slug);
}
