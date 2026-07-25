'use client';

import { useParams, notFound } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { H2, Text } from '../../../../components/atoms/Typography';
import Icon from '../../../../components/atoms/Icon';
import Avatar from '../../../../components/atoms/Avatar';
import BlogCard from '../../../../components/organisms/BlogCard';
import blogsData from '../../../../data/blogs.json';

export default function BlogDetailPage() {
  const { slug } = useParams();

  const post = useMemo(() => {
    if (!slug) return null;
    return blogsData.find((p) => p.slug === slug) || null;
  }, [slug]);

  useEffect(() => {
    if (slug && !post) {
      notFound();
    }
  }, [slug, post]);

  const relatedPosts = useMemo(() => {
    if (!post) return [];
    return blogsData.filter((p) => p.slug !== post.slug && p.category === post.category).slice(0, 3);
  }, [post]);

  if (!post) {
    return null;
  }

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text transition-colors mb-8"
        >
          <Icon name="arrowRight" className="w-4 h-4 rotate-180" />
          Back to Blog
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-primary text-sm font-medium uppercase tracking-wider">
            {post.category}
          </span>
          <H2 className="mt-2">{post.title}</H2>

          <div className="flex items-center gap-3 mt-5">
            <Avatar name={post.author} size="sm" />
            <div>
              <div className="text-sm font-medium text-text">{post.author}</div>
              <div className="text-xs text-text-muted">
                {post.date} • {post.readTime}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden mt-8"
        >
          <Image src={post.image} alt={post.title} fill unoptimized className="object-cover" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col gap-5 mt-8"
        >
          {post.content.map((paragraph, i) => (
            <Text key={i} className="text-text-secondary leading-relaxed">
              {paragraph}
            </Text>
          ))}
        </motion.div>
      </div>

      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
        >
          <h3 className="text-2xl font-bold text-text mb-6">More on {post.category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedPosts.map((related, index) => (
              <BlogCard key={related.slug} post={related} index={index} />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
