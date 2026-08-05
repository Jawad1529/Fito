// Derives SEO content from the fields an admin already fills in, so no one has
// to hand-write meta tags in the panel. Called from Product.model.js on every
// save, which means seeded, created and edited products all stay in sync.
import slugify from './slugify.js';
import { PRODUCT_STATUS } from '../constants/contentStatus.js';

const BRAND = 'Fito';
const TITLE_LIMIT = 60;
const DESCRIPTION_LIMIT = 160;

// Cuts at the last word boundary so titles/descriptions never end mid-word.
const clamp = (value, limit) => {
    const text = String(value ?? '').replace(/\s+/g, ' ').trim();
    if (text.length <= limit) return text;
    const cut = text.slice(0, limit - 1);
    const lastSpace = cut.lastIndexOf(' ');
    return `${(lastSpace > limit * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[,.;:-]$/, '')}…`;
};

const STOP_WORDS = new Set([
    'with', 'for', 'and', 'the', 'per', 'zero', 'pure', 'your', 'from', 'plus', 'more',
]);

// Longest words first: multi-word phrases carry more search intent than filler.
const keywordsFrom = (text, max) =>
    [
        ...new Set(
            String(text ?? '')
                .toLowerCase()
                .match(/[a-z0-9+]{3,}/g) ?? []
        ),
    ]
        .filter((word) => !STOP_WORDS.has(word))
        .slice(0, max);

const buildProductSeo = (product) => {
    const name = String(product.name ?? '').trim();
    const category = String(product.category ?? '').trim();
    const description = String(product.description ?? '').trim();
    const price = Number(product.price ?? 0);
    const inStock = Number(product.stock ?? 0) > 0 && product.status !== PRODUCT_STATUS.OUT_OF_STOCK;

    // First sentence reads as a summary; the rest is detail the snippet drops anyway.
    const summary = description.split(/(?<=[.!?])\s+/)[0] || description;

    // The brand suffix must survive truncation, so the category is only added
    // when the full title still fits; otherwise the name alone is clamped.
    const brandSuffix = ` | ${BRAND}`;
    const withCategory = category ? `${name} - ${category}` : name;
    const metaTitle =
        `${withCategory}${brandSuffix}`.length <= TITLE_LIMIT
            ? `${withCategory}${brandSuffix}`
            : `${clamp(name, TITLE_LIMIT - brandSuffix.length)}${brandSuffix}`;

    const metaDescription = clamp(
        `${summary} ${inStock ? 'Buy' : 'Shop'} ${name} online at ${BRAND} for PKR ${price.toFixed(0)}.`,
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

export { buildProductSeo, buildProductSlug, clamp };
export default buildProductSeo;
