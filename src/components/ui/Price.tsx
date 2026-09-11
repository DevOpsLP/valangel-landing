import React from 'react';
import { usd, ves, toVes } from '../../lib/format';

interface Props {
    price?: number | null;
    compareAt?: number | null;
    priceVes?: number | null;
    exchangeRate?: number | null;
    size?: 'sm' | 'md' | 'lg';
    align?: 'left' | 'right';
}

/** USD headline plus the bolívar conversion at the BCV rate, when available. */
const Price: React.FC<Props> = ({ price, compareAt, priceVes, exchangeRate, size = 'sm', align = 'left' }) => {
    if (price == null) {
        return <span className="text-xs text-muted">Consultar precio</span>;
    }

    const bs = priceVes ?? toVes(price, exchangeRate);
    const main = size === 'lg' ? 'text-2xl' : size === 'md' ? 'text-base' : 'text-sm';

    return (
        <span className={`flex flex-col ${align === 'right' ? 'items-end' : 'items-start'} leading-tight`}>
            <span className="flex items-baseline gap-2">
                <span className={`${main} font-medium text-ink tabular-nums`}>{usd(price)}</span>
                {compareAt != null && compareAt > price && (
                    <span className="text-xs text-muted line-through tabular-nums">{usd(compareAt)}</span>
                )}
            </span>
            {bs != null && <span className="text-[10px] text-muted tabular-nums mt-0.5">{ves(bs)}</span>}
        </span>
    );
};

export default Price;
