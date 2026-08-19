'use client';

import { Suspense, useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Select } from 'antd';
import { H2, Text } from '../../../components/atoms/Typography';
import ProductCard from '../../../components/organisms/ProductCard';
import ProductCardSkeleton from '../../../components/molecules/ProductCardSkeleton';
import Icon from '../../../components/atoms/Icon';
import Button from '../../../components/atoms/Button';
import useDebounce from '../../../hooks/useDebounce';
import useApiResource from '../../../hooks/useApiResource';
import useWishlist from '../../../hooks/useWishlist';
import { getProducts } from '../../../services/product.service';
import { getCategories } from '../../../services/category.service';

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
];

export default function ShopPage() {
  return (
    <Suspense fallback={null}>
      <ShopPageInner />
    </Suspense>
  );
}

function ShopPageInner() {
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState('');
  // Pre-selected from footer/nav links like /shop?category=protein-powders.
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('default');
  const { isWishlisted, toggleWishlist } = useWishlist();

  // Avoids firing a request on every keystroke.
  const debouncedSearch = useDebounce(searchQuery, 350);

  const { data: apiCategories } = useApiResource(getCategories, [], {
    fallback: [],
  });

  const {
    data: apiProducts,
    loading,
    error,
    reload,
  } = useApiResource(
    () => getProducts({ category: selectedCategory, search: debouncedSearch, sort: sortBy }),
    [selectedCategory, debouncedSearch, sortBy],
    { fallback: [] }
  );

  const categories = useMemo(() => {
    return [
      { value: 'all', label: 'All Categories' },
      ...(apiCategories ?? []).map((c) => ({ value: c.slug, label: c.name })),
    ];
  }, [apiCategories]);

  const products = useMemo(() => apiProducts ?? [], [apiProducts]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
  }, []);

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <H2>Shop All Supplements</H2>
          <Text muted className="mt-2 max-w-xl mx-auto">
            Find the perfect product for your fitness journey – filtered by goal, category, or price.
          </Text>
        </div>

        {/* Filters Bar */}
        <div className="glass border border-border-light rounded-2xl p-4 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-end">
            <div className="flex-1">
              <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
                Search Products
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                  <Icon name="search" className="w-5 h-5" />
                </span>
                <input
                  id="search"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, category, or description..."
                  className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition"
                />
              </div>
            </div>

            <div className="sm:w-48">
              <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">
                Category
              </label>
              <Select
                id="category"
                value={selectedCategory}
                onChange={setSelectedCategory}
                options={categories}
                size="large"
                className="w-full"
              />
            </div>

            <div className="sm:w-48">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-300 mb-1">
                Sort By
              </label>
              <Select
                id="sort"
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                size="large"
                className="w-full"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="mt-1 sm:mt-0 whitespace-nowrap"
            >
              <Icon name="close" className="w-4 h-4 mr-1" />
              Clear
            </Button>
          </div>
        </div>

        {/* Announces the new count when filters change, which was previously
            a silent update for screen reader users. */}
        <div className="flex justify-between items-center mb-6" aria-live="polite" aria-atomic="true">
          <Text className="text-text-muted">
            Showing <span className="text-text font-semibold">{products.length}</span> products
          </Text>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <Text className="text-danger">{error}</Text>
            <Button variant="outline" onClick={reload} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={isWishlisted(product.id)}
                onToggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="text-gray-400 text-lg">No products found.</div>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
