import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.model.js';
import Review from '../models/Review.model.js';
import { toPublicProduct } from '../utils/serializers.js';
import { PRODUCT_STATUS } from '../constants/contentStatus.js';
import { toImageUrl } from '../middleware/upload.middleware.js';
import { parsePagination, buildSearchFilter } from '../utils/queryHelpers.js';

// Multipart bodies arrive as strings, so numeric fields need coercing.
const parseNumber = (value, fallback) => {
    if (value === undefined || value === '') return fallback;
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

// GET /api/admin/products?page=&limit=&search=&category=&status= — includes
// drafts, unlike the public listing.
export const listProducts = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, category, status } = req.query;

    const filter = buildSearchFilter(search, ['name', 'category']);
    if (category) filter.category = category;
    if (Object.values(PRODUCT_STATUS).includes(status)) filter.status = status;

    const [products, total] = await Promise.all([
        Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Product.countDocuments(filter),
    ]);
    res.json({ items: products.map(toPublicProduct), total, page, limit });
});

// POST /api/admin/products (multipart/form-data, field name: images)
export const createProduct = asyncHandler(async (req, res) => {
    const { name, category, price, stock, description, status } = req.body;

    if (!name || !category || !description) {
        res.status(400);
        throw new Error('Name, category and description are required');
    }
    const parsedPrice = parseNumber(price);
    if (parsedPrice === undefined || parsedPrice < 0) {
        res.status(400);
        throw new Error('Price must be a non-negative number');
    }
    if (status && !Object.values(PRODUCT_STATUS).includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${Object.values(PRODUCT_STATUS).join(', ')}`);
    }

    const product = await Product.create({
        name,
        category,
        price: parsedPrice,
        stock: parseNumber(stock, 0),
        description,
        status,
        images: (req.files ?? []).map(toImageUrl),
    });

    res.status(201).json({ product: toPublicProduct(product) });
});

// PATCH /api/admin/products/:id (multipart/form-data)
// Newly uploaded files are appended to the gallery; `existingImages` lets the
// panel drop previously uploaded ones without re-uploading the rest.
export const updateProduct = asyncHandler(async (req, res) => {
    const { name, category, price, stock, description, status, existingImages } = req.body;

    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    if (status && !Object.values(PRODUCT_STATUS).includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${Object.values(PRODUCT_STATUS).join(', ')}`);
    }

    if (name !== undefined) product.name = name;
    if (category !== undefined) product.category = category;
    if (description !== undefined) product.description = description;
    if (status !== undefined) product.status = status;
    if (price !== undefined) product.price = parseNumber(price, product.price);
    if (stock !== undefined) product.stock = parseNumber(stock, product.stock);

    if (existingImages !== undefined) {
        // A single value arrives as a string, multiple as an array.
        product.images = Array.isArray(existingImages)
            ? existingImages
            : [existingImages].filter(Boolean);
    }
    const uploaded = (req.files ?? []).map(toImageUrl);
    if (uploaded.length) product.images = [...product.images, ...uploaded];

    await product.save();

    res.json({ product: toPublicProduct(product) });
});

// DELETE /api/admin/products/:id — also clears reviews so no orphans remain.
export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error('Product not found');
    }

    await Review.deleteMany({ product: product._id });
    await product.deleteOne();

    res.json({ message: 'Product deleted' });
});
