'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Button from '../atoms/Button';
import Icon from '../atoms/Icon';

// Full Stars component (restored from your original)
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
    className={`w-4 h-4 ${filled ? 'text-primary' : half ? 'text-primary' : 'text-text-muted'}`}
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

export default function ProductCard({
  product,
  isWishlisted = false,
  isInCart = false,
  onToggleWishlist,
  onAddToCart,
  index = 0,
}) {
  // Prevent navigation when clicking on interactive elements
  const handleButtonClick = (e, callback) => {
    e.stopPropagation();
    callback(product.id);
  };

  return (
    <Link href={`/product/${product.id}`} passHref>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group relative bg-overlay backdrop-blur-sm border border-border-light rounded-2xl p-4 transition-all duration-300 hover:border-primary/30 hover:bg-overlay-strong flex flex-col cursor-pointer"
      >
        {/* Image */}
        <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-overlay mb-4">
          <Image
            src={product.image}
            alt={product.name}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>

        {/* Wishlist button – stops propagation */}
        <button
          onClick={(e) => handleButtonClick(e, onToggleWishlist)}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-scrim backdrop-blur-sm flex items-center justify-center transition-colors hover:bg-primary/20 border border-border-light z-10"
          aria-label="Add to wishlist"
        >
          <Icon
            name="heart"
            className={`w-4 h-4 ${isWishlisted ? 'text-primary fill-primary' : 'text-text-secondary'}`}
          />
        </button>

        {/* Product info */}
        <div className="flex flex-col flex-1">
          <div className="flex items-start justify-between">
            <h3 className="text-text font-semibold text-lg leading-tight">
              {product.name}
            </h3>
          </div>
          <span className="text-sm text-text-muted mb-1">{product.category}</span>

          {/* Rating with stars – now fully functional */}
          <div className="flex items-center gap-2 mt-1">
            <Stars rating={product.rating} />
            <span className="text-sm text-text-muted">({product.reviews})</span>
          </div>

          <p className="text-sm text-text-muted mt-2 flex-1 line-clamp-2">
            {product.description}
          </p>

          <div className="mt-4 flex items-center justify-between">
            <span className="text-xl font-bold text-text">
              PKR {product.price.toFixed(2)}
            </span>
            {/* Quick Add button – stops propagation */}
            <Button
              variant={isInCart ? 'secondary' : 'primary'}
              size="sm"
              onClick={(e) => handleButtonClick(e, onAddToCart)}
              className="rounded-full px-4 py-1.5 text-xs"
            >
              {isInCart ? 'In Cart' : 'Quick Add'}
            </Button>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}