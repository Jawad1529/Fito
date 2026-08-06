import mongoose from 'mongoose';
import { BLOG_STATUS } from '../constants/contentStatus.js';
import slugify from '../utils/slugify.js';
import { buildBlogSeo, estimateReadTime } from '../utils/blogSeo.js';

// `content` is an array of paragraphs — the app renders one <Text> per entry
// (see app/app/(public)/blog/[slug]/page.jsx), so the shape is preserved here.
const blogSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
        category: { type: String, required: true, trim: true },
        author: { type: String, required: true, trim: true },
        excerpt: { type: String, required: true, trim: true },
        content: [{ type: String }],
        readTime: { type: String, trim: true },
        image: { type: String },
        publishedAt: { type: Date, default: Date.now },
        status: {
            type: String,
            enum: Object.values(BLOG_STATUS),
            default: BLOG_STATUS.DRAFT,
        },
        // Generated, never entered by the admin — see utils/blogSeo.js.
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [{ type: String }],
            imageAlt: String,
            wordCount: Number,
            generatedAt: Date,
        },
    },
    { timestamps: true }
);

// Fields the generated copy reads from; touching any of them invalidates the SEO block.
const SEO_SOURCE_FIELDS = ['title', 'category', 'author', 'excerpt', 'content'];

blogSchema.pre('save', function assignSeo(next) {
    if (this.isNew || SEO_SOURCE_FIELDS.some((field) => this.isModified(field))) {
        this.seo = buildBlogSeo(this);
        // Only fill read time in when the admin left it blank, so a manually
        // entered value is never overwritten on later edits.
        if (!this.readTime) this.readTime = estimateReadTime(this.content, this.excerpt);
    }
    next();
});

// Slug is derived from the title unless one was supplied explicitly. Uniqueness
// is enforced by the index above; the controller surfaces the conflict.
blogSchema.pre('validate', function setSlug() {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title);
    }
});

export default mongoose.model('Blog', blogSchema);
