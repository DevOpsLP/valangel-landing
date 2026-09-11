/** Editorial content: blog, FAQ and the value props used across the site. */
import { PHOTO } from './catalog';

export interface Post {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string;
    readingMinutes: number;
    image: string;
    /** Markdown body rendered on the post page. */
    body: string;
}

export const posts: Post[] = [
    {
        slug: 'orden-correcto-rutina-skincare',
        title: 'El orden correcto de tu rutina de skincare',
        excerpt: 'Limpiador, tónico, sérum, crema, protector solar. Suena simple, pero el orden cambia por completo los resultados.',
        category: 'Básicos',
        date: '2026-08-18',
        readingMinutes: 6,
        image: PHOTO.bottlesFour,
        body: `Una rutina funciona cuando cada producto puede hacer su trabajo. Y para eso, el orden importa más que la cantidad de pasos.

## La regla de oro

**De la textura más ligera a la más densa.** Un sérum acuoso no atraviesa una crema oclusiva, así que si inviertes el orden estás desperdiciando el producto más caro de tu repisa.

## Rutina de día

1. **Limpiador suave** — solo agua si tu piel está reactiva.
2. **Tónico** — prepara y calma.
3. **Sérum** — antioxidantes, vitamina C o niacinamida.
4. **Hidratante** — sella lo anterior.
5. **Protector solar** — SPF50+, dos dedos de producto, sin excepciones.

## Rutina de noche

1. **Aceite limpiador** — disuelve protector solar y maquillaje.
2. **Limpiador en gel o espuma** — la segunda limpieza.
3. **Tónico**.
4. **Tratamiento** — retinal, exfoliante o calmante, nunca los tres la misma noche.
5. **Crema reparadora**.

## Errores frecuentes

- Mezclar retinal y exfoliantes ácidos la misma noche.
- Aplicar protector solar sobre la piel todavía húmeda de crema.
- Cambiar toda la rutina de golpe: introduce **un producto nuevo cada dos semanas** para saber qué te sienta bien.`,
    },
    {
        slug: 'niacinamida-para-que-sirve',
        title: 'Niacinamida: qué hace realmente por tu piel',
        excerpt: 'El activo más versátil del skincare coreano, explicado sin marketing: qué resuelve, en qué porcentaje y con qué no combinarlo.',
        category: 'Ingredientes',
        date: '2026-07-30',
        readingMinutes: 5,
        image: PHOTO.serumTrio,
        body: `La niacinamida (vitamina B3) aparece en casi todos los séruns coreanos, y por buenas razones.

## Qué hace

- **Unifica el tono**: interrumpe la transferencia de melanina, así que las marcas post-acné se desvanecen antes.
- **Regula el sebo**: muy útil en piel mixta y grasa.
- **Refuerza la barrera**: aumenta la producción de ceramidas propias.

## En qué porcentaje

Entre **4 % y 10 %**. Por encima de eso no hay más beneficio, solo más probabilidad de irritación. Si tu piel es sensible, empieza en 4-5 %.

## Con qué combinarla

Se lleva bien con casi todo: ácido hialurónico, péptidos, ceramidas y protector solar.

> Lo de "niacinamida y vitamina C no se pueden mezclar" viene de un estudio de los años 60 hecho a temperaturas que tu baño nunca va a alcanzar. En formulaciones modernas conviven sin problema.

## Cuánto tarda

Entre **8 y 12 semanas** para ver un cambio real en el tono. La constancia gana siempre a la potencia.`,
    },
    {
        slug: 'proteccion-solar-venezuela',
        title: 'Protección solar en Venezuela: lo que nadie te cuenta',
        excerpt: 'Vivimos cerca del ecuador, con índice UV alto todo el año. Así se usa el protector solar de verdad.',
        category: 'Cuidado diario',
        date: '2026-07-02',
        readingMinutes: 4,
        image: PHOTO.creamTube,
        body: `El índice UV en buena parte del país se mantiene **entre 9 y 12 durante todo el año**. Eso es categoría "muy alto" a "extremo", en enero igual que en julio.

## Cantidad

La cifra de laboratorio es 2 mg/cm². En la práctica: **dos dedos de producto** para rostro y cuello. Casi todo el mundo aplica un tercio de lo necesario, y con ello un SPF50 se comporta como un SPF15.

## Reaplicación

Cada 2-3 horas de exposición directa. Un **stick** o un protector en formato compacto hace esto viable sin arruinar el maquillaje.

## Nubes y ventanas

La radiación UVA atraviesa nubes y cristales. Si pasas el día junto a una ventana, necesitas protector igual.

## Textura

La mejor fórmula es la que te pones todos los días. Los protectores coreanos tipo sérum se absorben en segundos y no dejan velo blanco, que es justo el motivo por el que la gente deja de usarlos.`,
    },
    {
        slug: 'rutina-piel-sensible',
        title: 'Rutina mínima para piel sensible',
        excerpt: 'Cuando todo irrita, menos es más. Cuatro productos, doce semanas, y una barrera reconstruida.',
        category: 'Rutinas',
        date: '2026-06-14',
        readingMinutes: 5,
        image: PHOTO.facialMask,
        body: `Si tu piel arde, pica o se pone roja con casi cualquier cosa, el problema rara vez es el producto nuevo: es la **barrera cutánea**.

## Las cuatro semanas de reset

Durante un mes, solo cuatro productos:

1. Limpiador suave sin sulfatos, una vez al día.
2. Tónico calmante con heartleaf o centella.
3. Crema con ceramidas.
4. Protector solar mineral o híbrido sin fragancia.

**Nada más.** Ni exfoliantes, ni retinal, ni vitamina C, ni mascarillas.

## Cómo reintroducir activos

A partir de la semana cinco, **un activo nuevo cada dos semanas**, dos noches por semana al principio. Si aparece escozor que dura más de un minuto, retrocede.

## Señales de que la barrera se recuperó

- La piel ya no se siente tirante después de limpiar.
- El enrojecimiento baja en minutos, no en horas.
- Los productos dejan de "arder" al entrar.`,
    },
    {
        slug: 'como-saber-si-un-producto-es-original',
        title: 'Cómo saber si tu producto coreano es original',
        excerpt: 'Lotes, sellos, texturas y precios imposibles: la guía para no comprar falsificaciones.',
        category: 'Guías',
        date: '2026-05-21',
        readingMinutes: 4,
        image: PHOTO.pedestals,
        body: `El mercado de K-beauty en Latinoamérica se llenó de réplicas. Estas son las señales que revisamos en cada lote que entra a Valangel.

## 1. El código de lote

Todo producto coreano trae un código de fabricación impreso (no pegado) en la caja **y** en el envase. Si solo está en uno de los dos, desconfía.

## 2. El precio

Un sérum que en Corea cuesta 25 USD no puede venderse a 8 USD con envío incluido. Si el precio es imposible, el producto también.

## 3. El sello de seguridad

La mayoría de las marcas usan un sello que se rompe al abrir. Un envase que gira libremente sin resistencia es sospechoso.

## 4. La textura y el olor

Las réplicas suelen tener un perfume más fuerte y una textura más líquida. Si ya conocías el producto, lo notas al instante.

## 5. El distribuidor

Pregunta siempre de dónde viene el lote. En Valangel trabajamos con importación directa y guardamos la trazabilidad de cada envío.`,
    },
    {
        slug: 'doble-limpieza-paso-a-paso',
        title: 'Doble limpieza: el paso que más cambia tu piel',
        excerpt: 'Dos limpiadores, cinco minutos, y la diferencia entre una rutina que funciona y una que no.',
        category: 'Básicos',
        date: '2026-04-09',
        readingMinutes: 3,
        image: PHOTO.cleanserTube,
        body: `El protector solar y el maquillaje resistente al agua no se van con agua y jabón. Por eso existe la doble limpieza.

## Paso uno: base oleosa

Sobre **piel seca**, masajea el aceite o bálsamo limpiador durante un minuto. El aceite disuelve el aceite: filtros solares, maquillaje y sebo oxidado.

## Paso dos: base acuosa

Añade agua para emulsionar, enjuaga y sigue con un limpiador en gel o espuma de pH bajo.

## Cuándo hacerla

**Solo de noche.** Por la mañana, tu piel solo tiene encima lo que le pusiste anoche: agua o un limpiador suave bastan.`,
    },
];

export const postBySlug = new Map(posts.map((p) => [p.slug, p]));

// ─── Value props ──────────────────────────────────────────────────────────────

export interface ValueProp {
    icon: 'diamond' | 'truck' | 'card' | 'heart';
    title: string;
    text: string;
}

export const valueProps: ValueProp[] = [
    { icon: 'diamond', title: 'Productos originales',   text: 'Marcas 100 % auténticas' },
    { icon: 'truck',   title: 'Envíos a todo el país',  text: 'Rápidos y seguros' },
    { icon: 'card',    title: 'Múltiples métodos de pago', text: 'Compra fácil y confiable' },
    { icon: 'heart',   title: 'Asesoría personalizada', text: 'Te ayudamos a encontrar lo ideal' },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────────

export interface Faq {
    q: string;
    a: string;
}

export const faqs: Faq[] = [
    { q: '¿Hacen envíos a todo el país?', a: 'Sí. Enviamos a las 24 entidades de Venezuela mediante Zoom, MRW y Tealca. En Valencia contamos además con delivery propio el mismo día para pedidos confirmados antes de las 2:00 p. m.' },
    { q: '¿Cuánto tarda mi pedido en llegar?', a: 'Valencia: 24 horas. Caracas, Maracay y Maracaibo: 24 a 48 horas. Resto del país: 2 a 4 días hábiles. Te compartimos el número de guía por WhatsApp en cuanto despachamos.' },
    { q: '¿Qué métodos de pago aceptan?', a: 'Pago móvil, transferencia en bolívares, Zelle, Binance (USDT) y efectivo en divisas al momento de la entrega en Valencia. El monto en bolívares se calcula con la tasa BCV del día.' },
    { q: '¿Los productos son originales?', a: 'Todos. Trabajamos con importación directa y verificamos el código de lote de cada unidad. Si alguna vez tienes dudas de un producto, escríbenos con la foto del lote y lo revisamos contigo.' },
    { q: '¿Puedo cambiar o devolver un producto?', a: 'Sí, dentro de los 7 días siguientes a la entrega, siempre que el producto esté sellado y sin usar. Por normativa sanitaria no podemos aceptar devoluciones de productos abiertos, salvo defecto de fábrica.' },
    { q: '¿Cómo sé qué productos necesito?', a: 'Usa el creador de rutina: respondes unas preguntas sobre tu tipo de piel y tus objetivos, y te armamos una rutina con lo que tenemos en stock. También puedes escribirnos por WhatsApp y te asesoramos sin compromiso.' },
    { q: '¿Tienen tienda física?', a: 'Atendemos con cita previa en Valencia, estado Carabobo. Escríbenos por WhatsApp o Instagram para coordinar el horario.' },
];
