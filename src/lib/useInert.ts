import { useEffect, type RefObject } from 'react';

/**
 * Keeps a closed overlay out of the tab order and the accessibility tree.
 *
 * The drawers and modals stay mounted so they can animate, which means their
 * buttons remain focusable and announceable while invisible. `inert` is the
 * one attribute that removes both at once.
 */
export function useInertWhenClosed(ref: RefObject<HTMLElement | null>, open: boolean): void {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        if (open) el.removeAttribute('inert');
        else el.setAttribute('inert', '');
    }, [ref, open]);
}
