'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import imageUrl from '../../utils/imageUrl';

export default function BlogCard({ post, index = 0 }) {
  return (
    <Link href={`/blog/${post.slug}`} passHref>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        viewport={{ once: true }}
        whileHover={{ y: -8 }}
        className="group relative bg-overlay backdrop-blur-sm border border-border-light rounded-2xl overflow-hidden transition-all duration-300 hover:border-primary/30 hover:bg-overlay-strong flex flex-col cursor-pointer h-full"
      >
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-overlay">
          <Image
            src={imageUrl(post.image)}
            alt={post.title}
            fill
            unoptimized
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute top-3 left-3 bg-scrim backdrop-blur-sm border border-border-light text-xs font-medium text-text px-3 py-1 rounded-full">
            {post.category}
          </span>
        </div>

        <div className="flex flex-col flex-1 p-5">
          <span className="text-xs text-text-muted">
            {post.date} • {post.readTime}
          </span>
          <h3 className="text-text font-semibold text-lg leading-tight mt-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
          <p className="text-sm text-text-muted mt-2 flex-1 line-clamp-2">
            {post.excerpt}
          </p>
          <span className="text-sm text-text-muted mt-4">By {post.author}</span>
        </div>
      </motion.div>
    </Link>
  );
}
