/**
 * "Crea tu rutina" — a short questionnaire that maps answers onto the concern
 * slugs and categories already present in the catalog, then assembles a
 * 4-step routine from whatever products are in stock.
 */
import type { Product } from './catalog';

export interface QuizOption {
    value: string;
    label: string;
    hint?: string;
}

export interface QuizStep {
    id: 'skinType' | 'goal' | 'sensitivity' | 'experience';
    question: string;
    help?: string;
    options: QuizOption[];
}

export const quizSteps: QuizStep[] = [
    {
        id: 'skinType',
        question: '¿Cómo se comporta tu piel un día normal?',
        help: 'Piensa en cómo la sientes a media tarde, sin retocar nada.',
        options: [
            { value: 'piel-seca',   label: 'Tirante y con zonas ásperas', hint: 'Piel seca' },
            { value: 'mixta-grasa', label: 'Brilla en frente y nariz',    hint: 'Piel mixta o grasa' },
            { value: 'hidratacion', label: 'Cómoda, pero apagada',        hint: 'Piel normal deshidratada' },
            { value: 'piel-sensible', label: 'Se pone roja con facilidad', hint: 'Piel sensible' },
        ],
    },
    {
        id: 'goal',
        question: '¿Qué te gustaría mejorar primero?',
        help: 'Elige solo una. Una rutina con un objetivo claro funciona mejor que una con cinco.',
        options: [
            { value: 'acne',      label: 'Menos brotes y poros congestionados' },
            { value: 'manchas',   label: 'Un tono más parejo, menos marcas' },
            { value: 'anti-edad', label: 'Firmeza y líneas finas' },
            { value: 'hidratacion', label: 'Luminosidad e hidratación' },
        ],
    },
    {
        id: 'sensitivity',
        question: '¿Has tenido reacciones con algún producto?',
        options: [
            { value: 'alta',   label: 'Sí, con frecuencia',      hint: 'Vamos con fórmulas muy suaves' },
            { value: 'media',  label: 'Alguna vez',              hint: 'Introducimos activos poco a poco' },
            { value: 'ninguna', label: 'Nunca, tolero bien todo', hint: 'Podemos subir la potencia' },
        ],
    },
    {
        id: 'experience',
        question: '¿Cuántos pasos quieres hacer al día?',
        options: [
            { value: 'minima',   label: 'Lo esencial, 3 pasos' },
            { value: 'completa', label: 'Una rutina completa, 5 pasos' },
        ],
    },
];

export type QuizAnswers = Partial<Record<QuizStep['id'], string>>;

export interface RoutineStep {
    step: number;
    label: string;
    moment: 'Mañana' | 'Noche' | 'Mañana y noche';
    category: string;
    product: Product | null;
    why: string;
}

/** Ranks a product against the answers. Higher is a better match. */
function score(p: Product, answers: QuizAnswers): number {
    let s = 0;
    const wanted = [answers.skinType, answers.goal].filter(Boolean) as string[];
    for (const c of wanted) if (p.concerns?.includes(c)) s += 3;

    // High sensitivity: avoid strong actives, prefer anything flagged soothing
    if (answers.sensitivity === 'alta') {
        if (p.concerns?.includes('piel-sensible')) s += 2;
        if (/retinal|peel|exfolia|aha|bha/i.test(`${p.name} ${p.description ?? ''}`)) s -= 5;
    }
    if (answers.sensitivity === 'ninguna' && /retinal|vitamina c|aha/i.test(p.name)) s += 1;

    if ((p.stock ?? 0) > 0) s += 1;
    if (p.badge === 'Best seller') s += 1;
    s += (p.rating ?? 0) / 10;
    return s;
}

function pick(products: Product[], categorySlug: string, answers: QuizAnswers): Product | null {
    const pool = products.filter((p) => p.category?.slug === categorySlug && (p.stock ?? 1) > 0);
    if (!pool.length) return null;
    return pool.slice().sort((a, b) => score(b, answers) - score(a, answers))[0];
}

const GOAL_COPY: Record<string, string> = {
    acne: 'mantiene los poros despejados sin resecar',
    manchas: 'trabaja el tono desigual y las marcas post-acné',
    'anti-edad': 'aporta firmeza y suaviza líneas finas',
    hidratacion: 'devuelve agua y luminosidad a la piel',
};

const TYPE_COPY: Record<string, string> = {
    'piel-seca': 'piel seca',
    'mixta-grasa': 'piel mixta o grasa',
    hidratacion: 'piel deshidratada',
    'piel-sensible': 'piel sensible',
};

export function buildRoutine(products: Product[], answers: QuizAnswers): RoutineStep[] {
    const full = answers.experience === 'completa';
    const goalCopy = GOAL_COPY[answers.goal ?? ''] ?? 'cuida tu piel a diario';

    const plan: Array<Omit<RoutineStep, 'product' | 'step'>> = [
        { label: 'Limpia',   moment: 'Mañana y noche', category: 'limpiadores',      why: 'Retira protector solar, maquillaje y sebo sin desequilibrar la barrera.' },
        ...(full ? [{ label: 'Tonifica', moment: 'Mañana y noche' as const, category: 'tonicos', why: 'Prepara la piel para que el sérum entre mejor.' }] : []),
        { label: 'Trata',    moment: 'Noche',          category: 'sueros',           why: `El paso activo de tu rutina: ${goalCopy}.` },
        { label: 'Hidrata',  moment: 'Mañana y noche', category: 'cremas',           why: 'Sella todo lo anterior y repara la barrera mientras duermes.' },
        { label: 'Protege',  moment: 'Mañana',         category: 'proteccion-solar', why: 'El paso que más resultados da a largo plazo. Sin excepciones.' },
        ...(full ? [{ label: 'Cuida tus labios', moment: 'Mañana y noche' as const, category: 'lip-care', why: 'La piel del labio no produce sebo: necesita ayuda externa.' }] : []),
    ];

    return plan.map((s, i) => ({ ...s, step: i + 1, product: pick(products, s.category, answers) }));
}

export function routineSummary(answers: QuizAnswers): string {
    const type = TYPE_COPY[answers.skinType ?? ''] ?? 'tu piel';
    const goal = GOAL_COPY[answers.goal ?? ''] ?? 'mantener la piel sana';
    const care = answers.sensitivity === 'alta' ? ' Evitamos activos fuertes porque marcaste reacciones frecuentes.' : '';
    return `Rutina pensada para ${type}, enfocada en ${goal}.${care}`;
}
