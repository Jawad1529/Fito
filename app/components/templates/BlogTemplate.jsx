'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { H2, Text } from '../atoms/Typography';
import Icon from '../atoms/Icon';
import Avatar from '../atoms/Avatar';
import Spinner from '../atoms/Spinner';
import BlogCard from '../organisms/BlogCard';
import useApiResource from '../../hooks/useApiResource';
import { getBlogBySlug } from '../../services/blog.service';
import imageUrl from '../../utils/imageUrl';

// Interactive half of the blog detail page. The route's server component owns
// metadata and Article structured data.
export default function BlogTemplate({ slug, initialData = null }) {
    const { data, loading, error } = useApiResource(() => getBlogBySlug(slug), [slug], {
        // The server component already fetched this post for metadata.
        skip: !slug || Boolean(initialData),
        fallback: initialData,
    });

    const { post, relatedPosts } = useMemo(() => {
        const resolved = data ?? initialData;
        return { post: resolved?.blog ?? null, relatedPosts: resolved?.related ?? [] };
    }, [data, initialData]);

    if (loading && !post) {
        return (
            <div className="pt-24 pb-16 min-h-screen flex justify-center">
                <Spinner className="w-8 h-8" />
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="pt-24 pb-16 min-h-screen">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
                    <H2>Post Not Found</H2>
                    <Text muted className="mt-2">
                        {error || "That article doesn't exist or is no longer published."}
                    </Text>
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-sm text-primary hover:underline mt-6"
                    >
                        Back to Blog
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-16 min-h-screen">
            <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
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
                    {/* Single H1 per page so the article title is the page's main heading. */}
                    <h1 className="mt-2 text-3xl sm:text-4xl font-bold text-text">{post.title}</h1>

                    <div className="flex items-center gap-3 mt-5">
                        <Avatar name={post.author} size="sm" />
                        <div>
                            <div className="text-sm font-medium text-text">{post.author}</div>
                            <div className="text-xs text-text-muted">
                                <time dateTime={post.publishedAt ?? post.date}>{post.date}</time>
                                {post.readTime ? ` • ${post.readTime}` : ''}
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
                    <Image
                        src={imageUrl(post.image)}
                        alt={post.seo?.imageAlt || post.title}
                        fill
                        unoptimized
                        className="object-cover"
                        priority
                    />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex flex-col gap-5 mt-8"
                >
                    {/* Posts store `content` as sanitized HTML from the admin's Tiptap
                        editor (bold/italic/strike/links only). */}
                    <div
                        className="flex flex-col gap-5 text-base text-text-secondary leading-relaxed [&_p]:m-0 [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_strong]:font-semibold [&_strong]:text-text [&_em]:italic [&_s]:line-through"
                        dangerouslySetInnerHTML={{ __html: post.content ?? '' }}
                    />
                </motion.div>
            </article>

            {relatedPosts.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16"
                >
                    <h2 className="text-2xl font-bold text-text mb-6">More on {post.category}</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {relatedPosts.map((related) => (
                            <BlogCard key={related.slug} post={related} />
                        ))}
                    </div>
                </motion.div>
            )}
        </div>
    );
}
