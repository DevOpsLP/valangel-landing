import React, { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
import { GOOGLE_MAPS_API_KEY } from '../../lib/constants';

export interface AddressResult {
    formatted: string;
    lat: number;
    lng: number;
}

interface Props {
    onAddressChange: (addr: AddressResult) => void;
    initialAddress?: string;
    initialCoords?: { lat: number; lng: number };
}

/** Valencia, Carabobo — where Valangel ships from. */
const VALENCIA = { lat: 10.1621, lng: -68.0077 };

const ShippingMap: React.FC<Props> = ({ onAddressChange, initialAddress = '', initialCoords }) => {
    const mapDivRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        if (!GOOGLE_MAPS_API_KEY) {
            setLoading(false);
            setError(true);
            return;
        }

        let cancelled = false;
        setOptions({ key: GOOGLE_MAPS_API_KEY, v: 'weekly', region: 'VE', language: 'es' });

        (async () => {
            try {
                const mapsLib = (await importLibrary('maps')) as google.maps.MapsLibrary;
                const placesLib = (await importLibrary('places')) as google.maps.PlacesLibrary;
                if (cancelled || !mapDivRef.current || !inputRef.current) return;

                setLoading(false);
                const center = initialCoords ?? VALENCIA;
                const map = new mapsLib.Map(mapDivRef.current, {
                    center,
                    zoom: initialCoords ? 15 : 12,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: false,
                    gestureHandling: 'cooperative',
                });

                // Classic Marker rather than AdvancedMarkerElement: the latter
                // silently renders nothing without a cloud-configured Map ID,
                // which this deployment does not have.
                const marker = new window.google.maps.Marker({
                    position: center,
                    map,
                    draggable: true,
                    title: 'Arrastra para ajustar la dirección',
                });

                marker.addListener('dragend', () => {
                    const pos = marker.getPosition();
                    if (!pos) return;
                    onAddressChange({ formatted: inputRef.current?.value ?? '', lat: pos.lat(), lng: pos.lng() });
                });

                const autocomplete = new placesLib.Autocomplete(inputRef.current, {
                    componentRestrictions: { country: 've' },
                    fields: ['geometry', 'formatted_address'],
                });

                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (!place.geometry?.location) return;
                    const lat = place.geometry.location.lat();
                    const lng = place.geometry.location.lng();
                    map.panTo({ lat, lng });
                    map.setZoom(15);
                    marker.setPosition({ lat, lng });
                    onAddressChange({ formatted: place.formatted_address ?? '', lat, lng });
                });
            } catch {
                if (!cancelled) {
                    setLoading(false);
                    setError(true);
                }
            }
        })();

        return () => { cancelled = true; };
        // Intentionally runs once: the map instance owns its own state afterwards.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // No API key, or Maps failed to load — a plain textarea keeps checkout usable
    if (error) {
        return (
            <div className="flex flex-col gap-1.5">
                <label htmlFor="address-fallback" className="text-[11px] uppercase tracking-[0.14em] text-muted">
                    Dirección de envío
                </label>
                <textarea
                    id="address-fallback"
                    rows={3}
                    defaultValue={initialAddress}
                    placeholder="Ej: Av. Bolívar Norte, Urb. El Viñedo, Valencia, Carabobo"
                    onChange={(e) => onAddressChange({ formatted: e.target.value, lat: 0, lng: 0 })}
                    className="w-full border border-line rounded-2xl px-4 py-3 text-sm text-ink resize-none
                               focus:outline-none focus:border-taupe transition-colors"
                />
                <p className="text-[10px] text-muted">Incluye punto de referencia para facilitar la entrega.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-2">
            <label htmlFor="address-search" className="text-[11px] uppercase tracking-[0.14em] text-muted">
                Dirección de envío
            </label>
            <input
                id="address-search"
                ref={inputRef}
                type="text"
                defaultValue={initialAddress}
                placeholder="Busca tu dirección en Venezuela…"
                className="w-full border border-line rounded-full px-4 py-3 text-sm text-ink focus:outline-none focus:border-taupe transition-colors"
            />
            <div className="relative rounded-2xl overflow-hidden border border-line">
                {loading && (
                    <div className="absolute inset-0 grid place-items-center bg-snow z-10">
                        <span className="text-[11px] text-muted">Cargando mapa…</span>
                    </div>
                )}
                <div ref={mapDivRef} className="w-full h-56" />
            </div>
            <p className="text-[10px] text-muted">Arrastra el marcador para ajustar la ubicación exacta.</p>
        </div>
    );
};

export default ShippingMap;
