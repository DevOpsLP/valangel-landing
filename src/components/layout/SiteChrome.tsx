/**
 * Everything that wraps the page: announcement bar, header, mobile drawer,
 * search overlay, cart drawer, checkout and the mobile tab bar.
 *
 * Mounted once per page with client:load so the cart is interactive before the
 * rest of the islands hydrate.
 */
import React, { useEffect, useState } from 'react';
import { CartProvider, useCart } from '../../context/CartContext';
import { CART_ITEM_ADDED_EVENT, OPEN_SEARCH_EVENT, OPEN_CART_EVENT } from '../../lib/cartStore';
import { useExchangeRate } from '../../lib/exchangeRateStore';
import { useWishlist } from '../../lib/wishlistStore';
import Header from './Header';
import MobileNav from './MobileNav';
import MobileTabBar from './MobileTabBar';
import SearchOverlay from './SearchOverlay';
import CartDrawer from '../cart/CartDrawer';
import CheckoutModal from '../cart/CheckoutModal';

const Inner: React.FC<{ pathname: string }> = ({ pathname }) => {
    const { itemCount, openDrawer } = useCart();
    const exchangeRate = useExchangeRate();
    const { ids } = useWishlist();

    const [menuOpen, setMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);

    // Islands in other React roots talk to this one through DOM events
    useEffect(() => {
        const onAdded = () => openDrawer();
        const onSearch = () => setSearchOpen(true);
        const onCart = () => openDrawer();
        window.addEventListener(CART_ITEM_ADDED_EVENT, onAdded);
        window.addEventListener(OPEN_SEARCH_EVENT, onSearch);
        window.addEventListener(OPEN_CART_EVENT, onCart);
        return () => {
            window.removeEventListener(CART_ITEM_ADDED_EVENT, onAdded);
            window.removeEventListener(OPEN_SEARCH_EVENT, onSearch);
            window.removeEventListener(OPEN_CART_EVENT, onCart);
        };
    }, [openDrawer]);

    return (
        <>
            <Header
                pathname={pathname}
                cartCount={itemCount}
                wishlistCount={ids.length}
                exchangeRate={exchangeRate}
                onOpenCart={openDrawer}
                onOpenSearch={() => setSearchOpen(true)}
                onOpenMenu={() => setMenuOpen(true)}
            />
            <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} pathname={pathname} exchangeRate={exchangeRate} />
            <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
            <CartDrawer />
            <CheckoutModal />
            <MobileTabBar
                pathname={pathname}
                cartCount={itemCount}
                wishlistCount={ids.length}
                onOpenCart={openDrawer}
                onOpenSearch={() => setSearchOpen(true)}
            />
        </>
    );
};

const SiteChrome: React.FC<{ pathname: string }> = ({ pathname }) => (
    <CartProvider>
        <Inner pathname={pathname} />
    </CartProvider>
);

export default SiteChrome;
