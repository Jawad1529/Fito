'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { H2, Text } from '../../../components/atoms/Typography';
import ProductCard from '../../../components/organisms/ProductCard';
import Icon from '../../../components/atoms/Icon';
import Button from '../../../components/atoms/Button';
import Spinner from '../../../components/atoms/Spinner';
import useTestingMode from '../../../hooks/useTestingMode';
import useDebounce from '../../../hooks/useDebounce';
import useApiResource from '../../../hooks/useApiResource';
import { getProducts, getProductCategories } from '../../../services/product.service';
import productsData from '../../../data/products.json';

// Applied only in testing mode; with the API on, the backend does the work.
const filterLocally = (products, { search, category, sort }) => {
  let result = [...products];

  if (search.trim()) {
    const query = search.toLowerCase().trim();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }
  if (category !== 'all') {
    result = result.filter((p) => p.category === category);
  }
  if (sort === 'price-low') result.sort((a, b) => a.price - b.price);
  if (sort === 'price-high') result.sort((a, b) => b.price - a.price);
  if (sort === 'rating') result.sort((a, b) => b.rating - a.rating);

  return result;
};

export default function ShopPage() {
  const { testingMode } = useTestingMode();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [wishlist, setWishlist] = useState([]);

  // Avoids firing a request on every keystroke.
  const debouncedSearch = useDebounce(searchQuery, 350);

  const { data: apiCategories } = useApiResource(getProductCategories, [], {
    skip: testingMode,
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
    { skip: testingMode, fallback: [] }
  );

  const categories = useMemo(() => {
    const source = testingMode ? productsData.map((p) => p.category) : apiCategories ?? [];
    return ['all', ...new Set(source)];
  }, [testingMode, apiCategories]);

  const products = useMemo(() => {
    if (testingMode) {
      return filterLocally(productsData, {
        search: searchQuery,
        category: selectedCategory,
        sort: sortBy,
      });
    }
    return apiProducts ?? [];
  }, [testingMode, apiProducts, searchQuery, selectedCategory, sortBy]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSortBy('default');
  };

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <H2>Shop All Supplements</H2>
          <Text muted className="mt-2 max-w-xl mx-auto">
            Find the perfect product for your fitness journey – filtered by goal, category, or price.
          </Text>
        </motion.div>

        {/* Filters Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 sm:p-6 mb-8"
        >
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
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition appearance-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat} className="bg-black">
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:w-48">
              <label htmlFor="sort" className="block text-sm font-medium text-gray-300 mb-1">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/50 transition appearance-none"
              >
                <option value="default" className="bg-black">Default</option>
                <option value="price-low" className="bg-black">Price: Low to High</option>
                <option value="price-high" className="bg-black">Price: High to Low</option>
                <option value="rating" className="bg-black">Top Rated</option>
              </select>
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
        </motion.div>

        <div className="flex justify-between items-center mb-6">
          <Text className="text-gray-400">
            Showing <span className="text-white font-semibold">{products.length}</span> products
          </Text>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Spinner className="w-8 h-8" />
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
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                isWishlisted={wishlist.includes(product.id)}
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
