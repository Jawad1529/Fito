'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { H2, H3, Text } from '../atoms/Typography';
import ImageGallery from '../organisms/ImageGallery';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';
import Spinner from '../atoms/Spinner';
import FeaturedProducts from '../organisms/FeaturedProducts';
import ReviewSection from '../organisms/ReviewSection';
import QuantitySelector from '../molecules/QuantitySelector';
import useCart from '../../hooks/useCart';
import useTestingMode from '../../hooks/useTestingMode';
import useApiResource from '../../hooks/useApiResource';
import { getProduct } from '../../services/product.service';
import productsData from '../../data/products.json';

// Interactive half of the product page. The route's server component owns
// metadata and structured data; everything stateful lives here.
export default function ProductTemplate({ id, initialProduct = null }) {
    const { testingMode } = useTestingMode();

    const {
        data: apiProduct,
        loading,
        error,
        setData: setProduct,
    } = useApiResource(() => getProduct(id), [id], {
        // The server component already fetched this product for metadata, so skip
        // the duplicate request on first paint when we have it.
        skip: testingMode || !id || Boolean(initialProduct),
        fallback: initialProduct,
    });

    const product = useMemo(() => {
        if (!testingMode) return apiProduct ?? initialProduct;
        return productsData.find((p) => String(p.id) === String(id)) || null;
    }, [testingMode, apiProduct, initialProduct, id]);

    const [isWishlisted, setIsWishlisted] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const { addToCart, isInCart } = useCart();

    if (loading && !product) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex justify-center">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="pt-24 pb-16 min-h-screen">
                <div className="max-w-xl mx-auto px-4 text-center py-20">
                    <H2>Product Not Found</H2>
                    <Text muted className="mt-2">
                        {error || "That product doesn't exist or is no longer available."}
                    </Text>
                    <Button href="/shop" variant="primary" size="lg" className="mt-6">
                        Browse Products
                    </Button>
                </div>
            </div>
        );
    }

    const inCart = isInCart(product.id);

    const handleAddToCart = () => {
        if (!inCart) addToCart(product, quantity);
    };

    // Keeps the rating summary in sync after a review is written or removed.
    const handleRatingChange = ({ rating, reviewCount }) => {
        if (testingMode) return;
        setProduct((prev) => (prev ? { ...prev, rating, reviews: reviewCount, reviewCount } : prev));
    };

    return (
        <div className="pt-24 pb-16 min-h-screen bg-black">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <ImageGallery
                            images={product.images?.length ? product.images : [product.image].filter(Boolean)}
                            alt={product.seo?.imageAlt || product.name}
                        />
                    </motion.div>

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
                            {/* Single H1 per page, carrying the generated headline for keyword relevance. */}
                            <h1 className="text-3xl font-bold text-white">{product.name}</h1>
                            {product.seo?.headline && product.seo.headline !== product.name && (
                                <Text muted className="mt-1">
                                    {product.seo.headline}
                                </Text>
                            )}
                            <div className="flex items-center gap-3 mt-2">
                                <div className="flex items-center gap-1 text-yellow-400">
                                    <Icon name="star" className="w-5 h-5 fill-current" />
                                    <span className="font-semibold text-white">
                                        {Number(product.rating ?? 0).toFixed(1)}
                                    </span>
                                </div>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-400">{product.reviews ?? 0} reviews</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 flex-wrap">
                            <div className="text-3xl font-bold text-white">
                                PKR {(product.discountedPrice ?? product.price).toFixed(2)}
                            </div>
                            {product.discountPercent > 0 && (
                                <>
                                    <span className="text-lg text-gray-400 line-through">
                                        PKR {product.price.toFixed(2)}
                                    </span>
                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-500/15 text-green-400">
                                        {product.discountPercent}% off
                                    </span>
                                </>
                            )}
                        </div>

                        <div className="border-t border-white/10 pt-6">
                            <Text className="text-gray-300 leading-relaxed">{product.description}</Text>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 mt-4">
                            {!inCart && <QuantitySelector value={quantity} onChange={setQuantity} />}
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
                                onClick={() => setIsWishlisted((prev) => !prev)}
                                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                                aria-pressed={isWishlisted}
                                className="px-4"
                            >
                                <Icon
                                    name="heart"
                                    className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`}
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

                <ReviewSection
                    productId={product.id}
                    rating={product.rating ?? 0}
                    reviewCount={product.reviews ?? 0}
                    onRatingChange={handleRatingChange}
                />

                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="mt-16"
                >
                    <H3 className="text-2xl font-bold text-white mb-6">You May Also Like</H3>
                    <FeaturedProducts title="" subtitle="" limit={4} excludeId={product.id} />
                </motion.div>
            </div>
        </div>
    );
}
