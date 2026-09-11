/** Money + number formatting shared by cards, drawer and checkout. */

export function usd(value: number): string {
    return `$ ${value.toFixed(2)}`;
}

export function ves(value: number): string {
    return `Bs. ${value.toLocaleString('es-VE', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`;
}

/** Converts a USD amount with the BCV rate, rounded to 2 decimals. */
export function toVes(usdValue: number, rate: number | null | undefined): number | null {
    if (rate == null) return null;
    return Math.round(usdValue * rate * 100) / 100;
}
