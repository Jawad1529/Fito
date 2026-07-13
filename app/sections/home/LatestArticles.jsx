'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { H2, Text } from '../../components/atoms/Typography';
import Icon from '../../components/atoms/Icon';

const articles = [
  {
    id: 'a1',
    slug: 'best-protein-for-beginners',
    title: 'Best Protein for Beginners: A Complete Guide',
    excerpt:
      'New to supplementation? Learn which protein powders are easiest on digestion, taste great, and help you build muscle fast.',
    category: 'Nutrition',
    author: 'Dr. Sarah Kim',
    date: 'May 15, 2026',
    readTime: '8 min read',
    image: 'https://placehold.co/600x400/1a1a1a/facc15?text=Protein+Guide',
  },
  {
    id: 'a2',
    slug: 'whey-vs-isolate',
    title: 'Whey vs Isolate: Which One is Right for You?',
    excerpt:
      'Both are excellent sources of protein, but they differ in absorption rate and lactose content. We break down the science.',
    category: 'Education',
    author: 'Mike Chen',
    date: 'May 12, 2026',
    readTime: '6 min read',
    image: 'https://placehold.co/600x400/1a1a1a/facc15?text=Whey+vs+Isolate',
  },
  {
    id: 'a3',
    slug: 'how-much-protein-do-you-need',
    title: 'How Much Protein Do You Really Need Per Day?',
    excerpt:
      'We debunk the myths and give you evidence‑based recommendations based on your activity level, age, and fitness goals.',
    category: 'Science',
    author: 'Dr. Emily Davis',
    date: 'May 10, 2026',
    readTime: '5 min read',
    image: 'https://placehold.co/600x400/1a1a1a/facc15?text=Protein+Needs',
  },
];

export default function LatestArticles() {
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
          <H2>Latest Articles</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            Stay informed with expert insights on nutrition, supplements, and fitness.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/5 hover:-translate-y-2 flex flex-col"
            >
              {/* Image */}
              <div className="relative w-full aspect-[16/9] overflow-hidden">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  unoptimized
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 left-3 bg-yellow-400/90 text-black text-xs font-semibold px-3 py-1.5 rounded-full">
                  {article.category}
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center text-xs text-gray-400 gap-3 mb-2">
                  <span>{article.author}</span>
                  <span>•</span>
                  <span>{article.date}</span>
                  <span>•</span>
                  <span>{article.readTime}</span>
                </div>

                <h3 className="text-xl font-bold text-white leading-tight mb-2 group-hover:text-yellow-400 transition-colors">
                  <Link href={`/blog/${article.slug}`} className="hover:underline">
                    {article.title}
                  </Link>
                </h3>

                <p className="text-sm text-gray-300 flex-1 leading-relaxed">
                  {article.excerpt}
                </p>

                <div className="mt-4 pt-3 border-t border-white/5">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center text-sm font-medium text-yellow-400 hover:text-yellow-300 transition-colors group-hover:gap-2 gap-1.5"
                  >
                    Read Full Article
                    <span className="transition-transform group-hover:translate-x-1">→</span>
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* View all link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors border border-white/10 hover:border-yellow-400/30 px-6 py-3 rounded-xl hover:bg-yellow-400/5 group"
          >
            View All Articles
            <Icon name="arrow-right" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}