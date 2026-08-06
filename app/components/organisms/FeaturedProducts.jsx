'use client';

import { useState, useCallback, useMemo } from 'react';
import { H2, Text } from '../../components/atoms/Typography';
import Spinner from '../atoms/Spinner';
import ProductCard from './ProductCard';
import useTestingMode from '../../hooks/useTestingMode';
import useApiResource from '../../hooks/useApiResource';
import { getProducts } from '../../services/product.service';
import productsData from '../../data/products.json';

export default function FeaturedProducts({
  title = 'Featured Supplements',
  subtitle = 'Our top‑selling products, handpicked for quality and performance.',
  limit = 8,
  excludeId,
}) {
  const { testingMode } = useTestingMode();
  const [wishlist, setWishlist] = useState([]);

  const { data: apiProducts, loading } = useApiResource(() => getProducts({ sort: 'rating' }), [], {
    skip: testingMode,
    fallback: [],
  });

  const products = useMemo(() => {
    const source = testingMode ? productsData : apiProducts ?? [];
    return source.filter((p) => p.id !== excludeId).slice(0, limit);
  }, [testingMode, apiProducts, excludeId, limit]);

  // Stable identity so the memo on ProductCard actually holds — an inline
  // arrow would be a new prop every render and defeat it.
  const toggleWishlist = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  }, []);

  return (
    <section className="relative py-20 section-defer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {title && (
          <div className="text-center mb-12 reveal">
            <H2>{title}</H2>
            {subtitle && (
              <Text muted className="mt-3 max-w-xl mx-auto">
                {subtitle}
              </Text>
            )}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="w-8 h-8" />
          </div>
        ) : products.length === 0 ? (
          <Text muted className="text-center py-10">
            No products available yet.
          </Text>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 reveal">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
