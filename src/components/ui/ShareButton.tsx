import React, { useState } from 'react';
import { Check, Share2 } from 'lucide-react';
import { u } from '../../lib/url';

interface Props {
    slug: string;
    productId: number | string;
    productName: string;
    className?: string;
    size?: 'sm' | 'md';
}

/**
 * Copies a deep link to the product. Uses the native share sheet on mobile
 * (where it exists) and falls back to the clipboard everywhere else.
 */
const ShareButton: React.FC<Props> = ({ slug, productId, productName, className = '', size = 'sm' }) => {
    const [copied, setCopied] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const url = `${window.location.origin}${u('/tienda')}?producto=${encodeURIComponent(slug || String(productId))}`;

        if (navigator.share) {
            try {
                await navigator.share({ title: productName, url });
                return;
            } catch {
                // user dismissed the sheet — fall through to the clipboard
            }
        }
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            /* clipboard blocked */
        }
    };

    const dim = size === 'md' ? 'w-10 h-10' : 'w-9 h-9';
    const icon = size === 'md' ? 'w-[18px] h-[18px]' : 'w-4 h-4';

    return (
        <button
            type="button"
            onClick={handleShare}
            aria-label={`Compartir ${productName}`}
            title={copied ? '¡Enlace copiado!' : 'Compartir'}
            className={`${dim} inline-flex items-center justify-center rounded-full border border-line transition-colors
                        ${copied ? 'bg-rose-light text-wine border-mauve' : 'text-muted hover:text-wine hover:bg-rose-light'} ${className}`}
        >
            {copied ? <Check className={icon} strokeWidth={1.6} /> : <Share2 className={icon} strokeWidth={1.4} />}
        </button>
    );
};

export default ShareButton;
