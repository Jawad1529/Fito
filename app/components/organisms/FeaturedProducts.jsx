'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { H2, Text } from '../../components/atoms/Typography';
import ProductCard from './ProductCard';
import productsData from '../../data/products'; // adjust path

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
          {productsData.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              index={index}
              isWishlisted={wishlist.includes(product.id)}
              isInCart={cartItems.includes(product.id)}
              onToggleWishlist={toggleWishlist}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </div>
    </section>
  );
}