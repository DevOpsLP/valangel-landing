import React from 'react';
import { Trash2, Minus, Plus } from 'lucide-react';
import type { CartItem } from '../../lib/cart';
import { usd } from '../../lib/format';

interface Props {
    item: CartItem;
    onSetQty: (id: number, qty: number) => void;
    onRemove: (id: number) => void;
}

const CartItemRow: React.FC<Props> = ({ item, onSetQty, onRemove }) => (
    <div className="flex gap-3 py-4 border-b border-line last:border-0">
        <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden grad-cream">
            {item.imageUrl ? (
                <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
                <span className="w-full h-full grid place-items-center text-[9px] text-muted">Sin foto</span>
            )}
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
            {item.brand && <span className="eyebrow !text-[9px] text-taupe">{item.brand}</span>}
            <p className="text-[13px] text-ink leading-snug line-clamp-2">{item.name}</p>
            <p className="text-[10px] text-muted mt-0.5">
                {item.size ? `${item.size} · ` : ''}Ref. {item.sku}
            </p>

            <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                <div className="flex items-center border border-line rounded-full overflow-hidden">
                    <button
                        onClick={() => onSetQty(item.id, item.quantity - 1)}
                        aria-label={`Reducir cantidad de ${item.name}`}
                        className="w-8 h-8 grid place-items-center text-muted hover:text-wine transition-colors"
                    >
                        <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-7 text-center text-xs tabular-nums text-ink">{item.quantity}</span>
                    <button
                        onClick={() => onSetQty(item.id, item.quantity + 1)}
                        aria-label={`Aumentar cantidad de ${item.name}`}
                        className="w-8 h-8 grid place-items-center text-muted hover:text-wine transition-colors"
                    >
                        <Plus className="w-3 h-3" />
                    </button>
                </div>

                <span className="text-sm text-ink tabular-nums">{usd(item.price * item.quantity)}</span>
            </div>
        </div>

        <button
            onClick={() => onRemove(item.id)}
            aria-label={`Eliminar ${item.name} del carrito`}
            className="self-start p-1.5 -mr-1.5 text-muted hover:text-wine transition-colors"
        >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.4} />
        </button>
    </div>
);

export default CartItemRow;
