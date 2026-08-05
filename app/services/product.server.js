// Server-only product reads for generateMetadata() and sitemap generation.
// The axios client in services/api.js reaches into localStorage for the auth
// token, so it can't run during SSR — plain fetch keeps this usable on the
// server and lets Next cache the response.
import { API_BASE_URL } from '@/config/siteConfig';

const REVALIDATE_SECONDS = 300;

const getJson = async (path) => {
    try {
        const res = await fetch(`${API_BASE_URL}${path}`, {
            next: { revalidate: REVALIDATE_SECONDS },
        });
        if (!res.ok) return null;
        return await res.json();
    } catch {
        // A metadata fetch must never take the page down; callers fall back to
        // default metadata when this returns null.
        return null;
    }
};

export const getProductForSeo = async (idOrSlug) => {
    if (!idOrSlug) return null;
    const data = await getJson(`/products/${encodeURIComponent(idOrSlug)}`);
    return data?.product ?? null;
};

export const getProductsForSeo = async () => {
    const data = await getJson('/products');
    return data?.products ?? [];
};
