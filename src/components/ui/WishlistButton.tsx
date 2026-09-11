import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { wishlistStore } from '../../lib/wishlistStore';

interface Props {
    productId: number;
    productName: string;
    className?: string;
    size?: 'sm' | 'md';
}

const WishlistButton: React.FC<Props> = ({ productId, productName, className = '', size = 'sm' }) => {
    const [active, setActive] = useState(false);

    useEffect(() => {
        setActive(wishlistStore.has(productId));
        return wishlistStore.subscribe(() => setActive(wishlistStore.has(productId)));
    }, [productId]);

    const dim = size === 'md' ? 'w-10 h-10' : 'w-9 h-9';
    const icon = size === 'md' ? 'w-[18px] h-[18px]' : 'w-4 h-4';

    return (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                wishlistStore.toggle(productId);
            }}
            aria-pressed={active}
            aria-label={active ? `Quitar ${productName} de favoritos` : `Guardar ${productName} en favoritos`}
            className={`${dim} inline-flex items-center justify-center rounded-full transition-all duration-300
                        ${active ? 'text-wine bg-rose-light' : 'text-muted bg-white/70 hover:bg-rose-light hover:text-wine'}
                        backdrop-blur-sm ${className}`}
        >
            <Heart className={`${icon} transition-transform ${active ? 'fill-current scale-110' : ''}`} strokeWidth={1.4} />
        </button>
    );
};

export default WishlistButton;
