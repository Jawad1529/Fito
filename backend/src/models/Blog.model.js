import mongoose from 'mongoose';
import { BLOG_STATUS } from '../constants/contentStatus.js';
import slugify from '../utils/slugify.js';

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
    },
    { timestamps: true }
);

// Slug is derived from the title unless one was supplied explicitly. Uniqueness
// is enforced by the index above; the controller surfaces the conflict.
blogSchema.pre('validate', function setSlug() {
    if (!this.slug && this.title) {
        this.slug = slugify(this.title);
    }
});

export default mongoose.model('Blog', blogSchema);
