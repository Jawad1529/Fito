// Derives SEO content from the fields an admin already fills in, so no one has
// to hand-write meta tags in the panel. Called from Product.model.js on every
// save, which means seeded, created and edited products all stay in sync.
import slugify from './slugify.js';
import { PRODUCT_STATUS } from '../constants/contentStatus.js';
import {
    BRAND,
    DESCRIPTION_LIMIT,
    clamp,
    composeTitle,
    firstSentence,
    keywordsFrom,
} from './seoText.js';

const buildProductSeo = (product) => {
    const name = String(product.name ?? '').trim();
    const category = String(product.category ?? '').trim();
    const description = String(product.description ?? '').trim();
    const price = Number(product.price ?? 0);
    const inStock =
        Number(product.stock ?? 0) > 0 &&
        product.status !== PRODUCT_STATUS.OUT_OF_STOCK &&
        product.status !== PRODUCT_STATUS.COMING_SOON;
    const comingSoon = product.status === PRODUCT_STATUS.COMING_SOON;

    const metaTitle = composeTitle(name, category);

    const metaDescription = clamp(
        `${firstSentence(description)} ${comingSoon ? 'Coming soon —' : inStock ? 'Buy' : 'Shop'} ${name} online at ${BRAND} for PKR ${price.toFixed(0)}.`,
        DESCRIPTION_LIMIT
    );

    const keywords = [
        ...new Set([
            name.toLowerCase(),
            category.toLowerCase(),
            ...keywordsFrom(name, 4),
            ...keywordsFrom(description, 6),
            `buy ${name.toLowerCase()} online`,
            `${BRAND.toLowerCase()} supplements`,
        ]),
    ].filter(Boolean);

    return {
        metaTitle,
        metaDescription,
        keywords,
        // Long-form copy for the product page body, still fully derived from admin input.
        headline: clamp(`${name}${category ? ` for ${category.toLowerCase()} goals` : ''}`, 70),
        imageAlt: clamp([name, category, BRAND].filter(Boolean).join(' - '), 120),
        generatedAt: new Date(),
    };
};

// Slugs power /product/<slug> and the canonical URL. `_id` is appended so two
// products sharing a name can't collide without a uniqueness retry loop.
const buildProductSlug = (product) =>
    [slugify(product.name), String(product._id).slice(-6)].filter(Boolean).join('-');

export { buildProductSeo, buildProductSlug };
export default buildProductSeo;
