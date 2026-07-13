'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { H2, Text } from '../../components/atoms/Typography';
import Button from '../../components/atoms/Button';
import Icon from '../../components/atoms/Icon';
import productsData from '../../data/products'; // adjust path as needed

// Helper to render stars
const Stars = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = 5 - fullStars - halfStar;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} filled />
      ))}
      {halfStar === 1 && <Star half />}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} />
      ))}
    </div>
  );
};

const Star = ({ filled = false, half = false }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-yellow-400' : half ? 'text-yellow-400' : 'text-gray-600'}`}
    fill={filled ? 'currentColor' : half ? 'url(#halfGrad)' : 'none'}
    stroke="currentColor"
    strokeWidth="1.5"
    viewBox="0 0 24 24"
  >
    {half && (
      <defs>
        <linearGradient id="halfGrad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="50%" stopColor="currentColor" />
          <stop offset="50%" stopColor="none" />
        </linearGradient>
      </defs>
    )}
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
);

export default function FeaturedProducts() {
  const [wishlist, setWishlist] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const toggleWishlist = (productId) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const addToCart = (productId) => {
    setCartItems((prev) => [...prev, productId]);
    // Here you would integrate with actual cart state/context
    console.log('Added to cart:', productId);
  };

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <H2>Featured Supplements</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            Our top‑selling products, handpicked for quality and performance.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {productsData.map((product, index) => {
            const isWishlisted = wishlist.includes(product.id);
            const isInCart = cartItems.includes(product.id);

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -8 }}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 transition-all duration-300 hover:border-yellow-400/30 hover:bg-white/10 flex flex-col"
              >
                {/* Image */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white/5 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Wishlist button */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-yellow-400/20 border border-white/10"
                  aria-label="Add to wishlist"
                >
                  <Icon
                    name="heart"
                    className={`w-4 h-4 ${isWishlisted ? 'text-yellow-400 fill-yellow-400' : 'text-white/70'}`}
                  />
                </button>

                {/* Product info */}
                <div className="flex flex-col flex-1">
                  <div className="flex items-start justify-between">
                    <h3 className="text-white font-semibold text-lg leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  <span className="text-sm text-gray-400 mb-1">{product.category}</span>

                  <div className="flex items-center gap-2 mt-1">
                    <Stars rating={product.rating} />
                    <span className="text-sm text-gray-400">({product.reviews})</span>
                  </div>

                  <p className="text-sm text-gray-400 mt-2 flex-1 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xl font-bold text-white">
                      PKR {product.price.toFixed(2)}
                    </span>
                    <Button
                      variant={isInCart ? 'secondary' : 'primary'}
                      size="sm"
                      onClick={() => addToCart(product.id)}
                      className="rounded-full px-4 py-1.5 text-xs"
                    >
                      {isInCart ? 'In Cart' : 'Quick Add'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}