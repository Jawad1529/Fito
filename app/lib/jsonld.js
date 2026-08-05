// schema.org payloads. Rich results (price, stock, star rating) only show up if
// the Product/Offer/AggregateRating shape is valid, so keep these in sync with
// https://developers.google.com/search/docs/appearance/structured-data/product
import { SITE_NAME, SITE_URL, CURRENCY, absoluteUrl } from '@/config/siteConfig';
import imageUrl from '@/utils/imageUrl';

const AVAILABILITY = {
  inStock: 'https://schema.org/InStock',
  outOfStock: 'https://schema.org/OutOfStock',
};

export const productJsonLd = (product) => {
  if (!product) return null;

  const url = absoluteUrl(`/product/${product.slug || product.id}`);
  const images = (product.images?.length ? product.images : [product.image])
    .filter(Boolean)
    .map(imageUrl);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.seo?.metaDescription || product.description,
    image: images,
    sku: String(product.id),
    category: product.category,
    brand: { '@type': 'Brand', name: SITE_NAME },
    url,
    offers: {
      '@type': 'Offer',
      url,
      price: Number(product.price ?? 0).toFixed(2),
      priceCurrency: CURRENCY,
      availability: product.stock > 0 ? AVAILABILITY.inStock : AVAILABILITY.outOfStock,
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@type': 'Organization', name: SITE_NAME },
    },
  };

  // Google rejects an AggregateRating with zero reviews, so only attach it once
  // real reviews exist.
  const reviewCount = Number(product.reviewCount ?? product.reviews ?? 0);
  if (reviewCount > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: Number(product.rating ?? 0).toFixed(1),
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  return jsonLd;
};

export const breadcrumbJsonLd = (trail = []) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: trail.map((crumb, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: crumb.name,
    item: absoluteUrl(crumb.href ?? '/'),
  })),
});

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
});

export default productJsonLd;
