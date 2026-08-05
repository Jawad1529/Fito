'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { H2, Text } from '../../components/atoms/Typography';
import Icon from '../../components/atoms/Icon';
import Spinner from '../../components/atoms/Spinner';
import useTestingMode from '../../hooks/useTestingMode';
import useApiResource from '../../hooks/useApiResource';
import { getBlogs } from '../../services/blog.service';
import imageUrl from '../../utils/imageUrl';
import blogsData from '../../data/blogs.json';

const LIMIT = 3;

export default function LatestArticles() {
  const { testingMode } = useTestingMode();

  const { data: apiPosts, loading } = useApiResource(() => getBlogs({ limit: LIMIT }), [], {
    skip: testingMode,
    fallback: [],
  });

  const articles = testingMode ? blogsData.slice(0, LIMIT) : apiPosts ?? [];

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

        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="w-8 h-8" />
          </div>
        ) : articles.length === 0 ? (
          <Text muted className="text-center py-10">
            No articles published yet.
          </Text>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <motion.article
                key={article.id ?? article.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group bg-overlay backdrop-blur-sm border border-border-light rounded-2xl overflow-hidden transition-all duration-500 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-2 flex flex-col"
              >
                <div className="relative w-full aspect-[16/9] overflow-hidden">
                  <Image
                    src={imageUrl(article.image)}
                    alt={article.title}
                    fill
                    unoptimized
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-primary/90 text-text-inverse text-xs font-semibold px-3 py-1.5 rounded-full">
                    {article.category}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center text-xs text-text-muted gap-3 mb-2">
                    <span>{article.author}</span>
                    <span>•</span>
                    <span>{article.date}</span>
                    {article.readTime && (
                      <>
                        <span>•</span>
                        <span>{article.readTime}</span>
                      </>
                    )}
                  </div>

                  <h3 className="text-xl font-bold text-text leading-tight mb-2 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${article.slug}`} className="hover:underline">
                      {article.title}
                    </Link>
                  </h3>

                  <p className="text-sm text-text-secondary flex-1 leading-relaxed">
                    {article.excerpt}
                  </p>

                  <div className="mt-4 pt-3 border-t border-border-light">
                    <Link
                      href={`/blog/${article.slug}`}
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-hover transition-colors group-hover:gap-2 gap-1.5"
                    >
                      Read Full Article
                      <span className="transition-transform group-hover:translate-x-1">→</span>
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-text transition-colors border border-border-light hover:border-primary/30 px-6 py-3 rounded-xl hover:bg-primary/5 group"
          >
            View All Articles
            <Icon name="arrowRight" className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
