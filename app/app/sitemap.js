import { SITE_URL } from '@/config/siteConfig';
import { getProductsForSeo } from '@/services/product.server';

// Products added through the admin panel show up here on the next revalidation,
// so no one has to touch the sitemap when the catalogue changes.
export const revalidate = 3600;

const STATIC_ROUTES = [
    { path: '/', priority: 1, changeFrequency: 'daily' },
    { path: '/shop', priority: 0.9, changeFrequency: 'daily' },
    { path: '/categories', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/blog', priority: 0.7, changeFrequency: 'weekly' },
    { path: '/about', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/contact', priority: 0.5, changeFrequency: 'monthly' },
    { path: '/faq', priority: 0.4, changeFrequency: 'monthly' },
];

export default async function sitemap() {
    const products = await getProductsForSeo();

    return [
        ...STATIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
            url: `${SITE_URL}${path}`,
            lastModified: new Date(),
            changeFrequency,
            priority,
        })),
        ...products.map((product) => ({
            url: `${SITE_URL}/product/${product.slug || product.id}`,
            lastModified: new Date(product.updatedAt ?? product.createdAt ?? Date.now()),
            changeFrequency: 'weekly',
            priority: 0.8,
        })),
    ];
}
