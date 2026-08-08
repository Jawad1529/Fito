import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import Admin from '../models/Admin.model.js';
import Product from '../models/Product.model.js';
import Consultation from '../models/Consultation.model.js';
import Blog from '../models/Blog.model.js';
import Review from '../models/Review.model.js';
import Order from '../models/Order.model.js';
import { toPublicUser, toPublicOrder, toPublicReview } from '../utils/serializers.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

// Cancelled orders never collected payment, so they're excluded from every
// revenue figure on the dashboard (summary total + sales chart).
const paidOrderFilter = { status: { $ne: ORDER_STATUS.CANCELLED } };

// GET /api/admin/dashboard/summary
export const getDashboardSummary = asyncHandler(async (req, res) => {
    const [
        totalUsers,
        totalAdmins,
        totalProducts,
        totalConsultations,
        totalBlogs,
        totalReviews,
        salesAgg,
        recentUsers,
        recentOrders,
        recentReviews,
    ] = await Promise.all([
        User.countDocuments(),
        Admin.countDocuments(),
        Product.countDocuments(),
        Consultation.countDocuments(),
        Blog.countDocuments(),
        Review.countDocuments(),
        Order.aggregate([{ $match: paidOrderFilter }, { $group: { _id: null, total: { $sum: '$total' } } }]),
        User.find().sort({ createdAt: -1 }).limit(5),
        Order.find().sort({ createdAt: -1 }).limit(5),
        Review.find().populate('product', 'name').sort({ createdAt: -1 }).limit(5),
    ]);

    res.json({
        summary: {
            totalUsers,
            totalAdmins,
            totalProducts,
            totalConsultations,
            totalBlogs,
            totalReviews,
            totalSales: salesAgg[0]?.total ?? 0,
        },
        recentUsers: recentUsers.map(toPublicUser),
        recentOrders: recentOrders.map(toPublicOrder),
        recentReviews: recentReviews.map(toPublicReview),
    });
});

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// GET /api/admin/dashboard/sales?range=7d|30d|12m
// Bucketing is done in UTC throughout (both the Mongo $group keys and the JS
// label loop below) because Mongo's $year/$month/$dateToString default to
// UTC — mixing in server-local dates would shift the last bucket by a day on
// any server not running in UTC.
export const getSalesAnalytics = asyncHandler(async (req, res) => {
    const range = ['7d', '30d', '12m'].includes(req.query.range) ? req.query.range : '7d';

    if (range === '12m') {
        const now = new Date();
        const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11, 1));
        const rows = await Order.aggregate([
            { $match: { ...paidOrderFilter, createdAt: { $gte: start } } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    sales: { $sum: '$total' },
                },
            },
        ]);
        const byKey = new Map(rows.map((r) => [`${r._id.year}-${r._id.month}`, r.sales]));

        const data = Array.from({ length: 12 }, (_, i) => {
            const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 11 + i, 1));
            const key = `${d.getUTCFullYear()}-${d.getUTCMonth() + 1}`;
            return { label: MONTH_LABELS[d.getUTCMonth()], sales: byKey.get(key) ?? 0 };
        });
        return res.json({ data });
    }

    const days = range === '30d' ? 30 : 7;
    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - (days - 1)));

    const rows = await Order.aggregate([
        { $match: { ...paidOrderFilter, createdAt: { $gte: start } } },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                sales: { $sum: '$total' },
            },
        },
    ]);
    const byKey = new Map(rows.map((r) => [r._id, r.sales]));

    const data = Array.from({ length: days }, (_, i) => {
        const d = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate() + i));
        const key = d.toISOString().slice(0, 10);
        const label = range === '7d' ? DAY_LABELS[d.getUTCDay()] : `${MONTH_LABELS[d.getUTCMonth()]} ${d.getUTCDate()}`;
        return { label, sales: byKey.get(key) ?? 0 };
    });
    res.json({ data });
});
