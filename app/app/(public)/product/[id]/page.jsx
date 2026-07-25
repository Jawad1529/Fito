'use client';

import { useParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { H2, H3, Text } from '../../../../components/atoms/Typography';
import ImageGallery from '../../../../components/organisms/ImageGallery';
import Button from '../../../../components/atoms/Button';
import Icon from '../../../../components/atoms/Icon';
import FeaturedProducts from '../../../../components/organisms/FeaturedProducts';
import ReviewSection from '../../../../components/organisms/ReviewSection';
import QuantitySelector from '../../../../components/molecules/QuantitySelector';
import useCart from '../../../../hooks/useCart';
import productsData from '../../../../data/products';
import { notFound } from 'next/navigation';

export default function ProductDetailPage() {
  const { id } = useParams();

  // Compute product from local data
  const product = useMemo(() => {
    if (!id) return null;
    return productsData.find((p) => p.id === parseInt(id)) || null;
  }, [id]);

  // Trigger 404 if product not found (effect is acceptable here)
  useEffect(() => {
    if (!product) {
      notFound();
    }
  }, [product]);

  // Local state for wishlist (not yet global — see useWishlist stub)
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();

  // Prevent rendering until product is resolved (effect will throw 404 if null)
  if (!product) {
    return null; // or a loading spinner
  }

  const inCart = isInCart(product.id);

  const handleToggleWishlist = () => {
    setIsWishlisted((prev) => !prev);
  };

  const handleAddToCart = () => {
    if (!inCart) addToCart(product, quantity);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Product Detail */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <ImageGallery images={product.images || [product.image]} />
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col gap-6"
          >
            <div>
              <Text className="text-yellow-400 font-medium uppercase tracking-wider mb-1">
                {product.category}
              </Text>
              <H2 className="text-3xl font-bold text-white">{product.name}</H2>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1 text-yellow-400">
                  <Icon name="star" className="w-5 h-5 fill-current" />
                  <span className="font-semibold text-white">{product.rating}</span>
                </div>
                <span className="text-gray-400">•</span>
                <span className="text-gray-400">{product.reviews || 0} reviews</span>
              </div>
            </div>

            <div className="text-3xl font-bold text-white">
              PKR {product.price.toFixed(2)}
            </div>

            <div className="border-t border-white/10 pt-6">
              <Text className="text-gray-300 leading-relaxed">
                {product.description}
              </Text>
            </div>

            {/* Quantity + Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 mt-4">
              {!inCart && (
                <QuantitySelector value={quantity} onChange={setQuantity} />
              )}
              <Button
                variant="primary"
                size="lg"
                onClick={handleAddToCart}
                disabled={inCart}
                className="flex-1 min-w-[150px]"
              >
                {inCart ? (
                  <>
                    <Icon name="check" className="w-5 h-5 mr-2" />
                    In Cart
                  </>
                ) : (
                  <>
                    <Icon name="cart" className="w-5 h-5 mr-2" />
                    Add to Cart
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleToggleWishlist}
                className="px-4"
              >
                <Icon
                  name="heart"
                  className={`w-5 h-5 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : ''
                  }`}
                />
              </Button>
            </div>

            {inCart && (
              <Link
                href="/cart"
                className="text-sm text-primary font-medium hover:text-primary-hover transition-colors -mt-2"
              >
                View cart →
              </Link>
            )}

            <div className="text-sm text-gray-400 mt-2">
              {product.stock > 0 ? (
                <span className="text-green-400">In Stock</span>
              ) : (
                <span className="text-red-400">Out of Stock</span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Reviews */}
        <ReviewSection
          productId={product.id}
          rating={product.rating}
          reviewCount={product.reviews || 0}
        />

        {/* Recommended Products */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16"
        >
          <H3 className="text-2xl font-bold text-white mb-6">
            You May Also Like
          </H3>
          <FeaturedProducts />
        </motion.div>
      </div>
    </div>
  );
}