import mongoose from 'mongoose';
import { PRODUCT_STATUS } from '../constants/contentStatus.js';
import { buildProductSeo, buildProductSlug } from '../utils/productSeo.js';

// `rating` and `reviewCount` are denormalized aggregates maintained by
// Review.model.js whenever a review is created/updated/deleted, so product
// listings don't need to join reviews on every read.
const productSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        // Stores a Category.slug (see Category.model.js), not a display name.
        // Kept as a plain string rather than a schema-level enum since the
        // admin-managed category list changes at runtime; validated against
        // the Category collection in adminProducts.controller.js instead.
        category: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        // Percentage off `price`, shown as a struck-through original price on
        // the storefront. 0 means no discount.
        discountPercent: { type: Number, default: 0, min: 0, max: 100 },
        stock: { type: Number, default: 0, min: 0 },
        description: { type: String, required: true, trim: true },
        // First entry of `images` is the primary/thumbnail image. Stored as
        // absolute Cloudinary URLs (see upload.middleware.js).
        images: [{ type: String }],
        rating: { type: Number, default: 0, min: 0, max: 5 },
        reviewCount: { type: Number, default: 0, min: 0 },
        // Ordered key/value pairs (e.g. "Calories" -> "120 kcal"), rendered as a
        // table on the app's product page. Order is preserved since it's an array.
        nutritionFacts: [
            {
                _id: false,
                key: { type: String, required: true, trim: true },
                value: { type: String, required: true, trim: true },
            },
        ],
        status: {
            type: String,
            enum: Object.values(PRODUCT_STATUS),
            default: PRODUCT_STATUS.DRAFT,
        },
        // SEO fields below are generated, never entered by the admin. `seo.*`
        // values are regenerated whenever the source fields change so meta tags
        // can't drift away from the product content.
        slug: { type: String, unique: true, sparse: true, index: true },
        seo: {
            metaTitle: String,
            metaDescription: String,
            keywords: [{ type: String }],
            headline: String,
            imageAlt: String,
            generatedAt: Date,
        },
    },
    { timestamps: true }
);

// Fields the generated copy reads from; touching any of them invalidates the SEO block.
const SEO_SOURCE_FIELDS = ['name', 'category', 'price', 'stock', 'status', 'description'];

productSchema.pre('save', function assignSeo() {
    if (this.isNew || SEO_SOURCE_FIELDS.some((field) => this.isModified(field))) {
        this.seo = buildProductSeo(this);
    }
    // Slug stays pinned to the original name so existing links keep resolving.
    if (!this.slug) this.slug = buildProductSlug(this);
});

// Powers the shop page's text search without a full-text index scan per keystroke.
productSchema.index({ name: 'text', description: 'text', category: 'text' });

export default mongoose.model('Product', productSchema);
