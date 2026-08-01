'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { H2, Text } from '../../../components/atoms/Typography';
import BlogCard from '../../../components/organisms/BlogCard';
import blogsData from '../../../data/blogs.json';

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = useMemo(() => {
    const cats = blogsData.map((post) => post.category);
    return ['all', ...new Set(cats)];
  }, []);

  const filteredPosts = useMemo(() => {
    if (selectedCategory === 'all') return blogsData;
    return blogsData.filter((post) => post.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <H2>The Fitoo Blog</H2>
          <Text muted className="mt-2 max-w-xl mx-auto">
            Nutrition science, training tips, and supplement guides to help you train and eat smarter.
          </Text>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                selectedCategory === cat
                  ? 'bg-primary border-primary text-text-inverse'
                  : 'bg-transparent border-border-light text-text-secondary hover:text-text hover:border-primary/40'
              }`}
            >
              {cat === 'all' ? 'All Posts' : cat}
            </button>
          ))}
        </motion.div>

        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, index) => (
              <BlogCard key={post.slug} post={post} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <Text muted>No posts found in this category.</Text>
          </div>
        )}
      </div>
    </div>
  );
}
