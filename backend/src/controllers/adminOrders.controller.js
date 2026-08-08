import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.model.js';
import { toPublicOrder } from '../utils/serializers.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';
import { parsePagination, searchRegex } from '../utils/queryHelpers.js';

// GET /api/admin/orders?page=&limit=&search=&status=
export const listOrders = asyncHandler(async (req, res) => {
    const { page, limit, skip } = parsePagination(req.query);
    const { search, status } = req.query;

    const filter = {};
    if (Object.values(ORDER_STATUS).includes(status)) filter.status = status;
    if (search?.trim()) {
        const trimmed = search.trim();
        // Order "id" the admin panel searches by is the Mongo _id itself, so
        // only match it when the search text is actually a valid ObjectId.
        filter.$or = [
            { transactionId: searchRegex(trimmed) },
            ...(mongoose.isValidObjectId(trimmed) ? [{ _id: trimmed }] : []),
        ];
    }

    const [orders, total] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
        Order.countDocuments(filter),
    ]);
    res.json({ items: orders.map(toPublicOrder), total, page, limit });
});

// PATCH /api/admin/orders/:id/status
export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!Object.values(ORDER_STATUS).includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`);
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
        res.status(404);
        throw new Error('Order not found');
    }

    order.status = status;
    await order.save();

    res.json({ order: toPublicOrder(order) });
});
