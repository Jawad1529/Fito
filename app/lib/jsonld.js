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

export const articleJsonLd = (post) => {
  if (!post) return null;

  const url = absoluteUrl(`/blog/${post.slug}`);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.seo?.metaDescription || post.excerpt,
    image: [post.image].filter(Boolean).map(imageUrl),
    articleSection: post.category,
    keywords: (post.seo?.keywords ?? []).join(', ') || undefined,
    wordCount: post.seo?.wordCount || undefined,
    author: { '@type': 'Person', name: post.author },
    publisher: { '@type': 'Organization', name: SITE_NAME, url: SITE_URL },
    datePublished: post.publishedAt ?? post.createdAt,
    dateModified: post.updatedAt ?? post.publishedAt ?? post.createdAt,
    // Required by Google so the article can't be attributed to the wrong page.
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
  };
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

// `categories` is FAQ_CATEGORIES from constants/faqContent.js — flattened
// since FAQPage expects a single mainEntity list, not grouped sections.
export const faqPageJsonLd = (categories = []) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: categories.flatMap((group) =>
    group.questions.map((qa) => ({
      '@type': 'Question',
      name: qa.question,
      acceptedAnswer: { '@type': 'Answer', text: qa.answer },
    }))
  ),
});

export const organizationJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
});

// Declares the site's search endpoint so Google can offer a sitelinks
// searchbox. The URL template has to match the shop page's query param.
export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${SITE_URL}/shop?search={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
});

// `mainEntity` points back at the Organization so the About page is understood
// as being about the company rather than as a standalone article.
export const aboutPageJsonLd = ({ description, teamMembers = [] } = {}) => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  name: `About ${SITE_NAME}`,
  description,
  url: absoluteUrl('/about'),
  mainEntity: {
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    employee: teamMembers.map((member) => ({
      '@type': 'Person',
      name: member.name,
      jobTitle: member.title,
    })),
  },
});

export default productJsonLd;
