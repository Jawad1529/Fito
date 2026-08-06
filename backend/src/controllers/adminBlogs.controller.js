import asyncHandler from '../utils/asyncHandler.js';
import Blog from '../models/Blog.model.js';
import { toPublicBlog } from '../utils/serializers.js';
import { BLOG_STATUS } from '../constants/contentStatus.js';
import { toImageUrl } from '../middleware/upload.middleware.js';
import slugify from '../utils/slugify.js';

// The panel sends body paragraphs either as a JSON array or as one textarea
// blob; both normalize to the array shape the app renders.
const parseContent = (content) => {
    if (content === undefined) return undefined;
    if (Array.isArray(content)) return content.map((p) => String(p).trim()).filter(Boolean);
    try {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) return parsed.map((p) => String(p).trim()).filter(Boolean);
    } catch {
        // Not JSON — treat it as plain text split on blank lines.
    }
    return String(content)
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean);
};

// GET /api/admin/blogs — includes drafts.
export const listBlogs = asyncHandler(async (req, res) => {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json({ blogs: blogs.map(toPublicBlog) });
});

// POST /api/admin/blogs (multipart/form-data, field name: image)
export const createBlog = asyncHandler(async (req, res) => {
    const { title, category, author, excerpt, readTime, status, date, content } = req.body;

    if (!title || !category || !author || !excerpt) {
        res.status(400);
        throw new Error('Title, category, author and excerpt are required');
    }
    if (status && !Object.values(BLOG_STATUS).includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${Object.values(BLOG_STATUS).join(', ')}`);
    }

    const slug = slugify(title);
    if (await Blog.exists({ slug })) {
        res.status(409);
        throw new Error('A blog post with a similar title already exists');
    }

    const blog = await Blog.create({
        title,
        slug,
        category,
        author,
        excerpt,
        readTime,
        status,
        content: parseContent(content) ?? [],
        publishedAt: date ? new Date(date) : undefined,
        image: toImageUrl(req.file),
    });

    res.status(201).json({ blog: toPublicBlog(blog) });
});

// PATCH /api/admin/blogs/:id (multipart/form-data)
export const updateBlog = asyncHandler(async (req, res) => {
    const { title, category, author, excerpt, readTime, status, date, content } = req.body;

    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Blog post not found');
    }

    if (status && !Object.values(BLOG_STATUS).includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${Object.values(BLOG_STATUS).join(', ')}`);
    }

    // Retitling re-derives the slug, so published URLs follow the new title.
    if (title !== undefined && title !== blog.title) {
        const slug = slugify(title);
        if (await Blog.exists({ slug, _id: { $ne: blog._id } })) {
            res.status(409);
            throw new Error('A blog post with a similar title already exists');
        }
        blog.title = title;
        blog.slug = slug;
    }

    if (category !== undefined) blog.category = category;
    if (author !== undefined) blog.author = author;
    if (excerpt !== undefined) blog.excerpt = excerpt;
    if (readTime !== undefined) blog.readTime = readTime;
    if (status !== undefined) blog.status = status;
    if (date) blog.publishedAt = new Date(date);

    const parsedContent = parseContent(content);
    if (parsedContent !== undefined) blog.content = parsedContent;

    // Only replace the cover image when a new file was actually uploaded.
    const uploaded = toImageUrl(req.file);
    if (uploaded) blog.image = uploaded;

    await blog.save();

    res.json({ blog: toPublicBlog(blog) });
});

// DELETE /api/admin/blogs/:id
export const deleteBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
        res.status(404);
        throw new Error('Blog post not found');
    }

    await blog.deleteOne();

    res.json({ message: 'Blog post deleted' });
});
