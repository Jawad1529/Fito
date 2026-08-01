import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.model.js';
import { toPublicOrder } from '../utils/serializers.js';

// POST /api/orders — accepts guest checkout; if a valid token is attached
// (see attachUserIfPresent), the order is linked to that account.
export const createOrder = asyncHandler(async (req, res) => {
    const { items, total, paymentMethod, transactionId, screenshotAttached, shipping } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        res.status(400);
        throw new Error('Order must contain at least one item');
    }
    if (!shipping?.name || !shipping?.phone || !shipping?.address || !shipping?.city) {
        res.status(400);
        throw new Error('Shipping name, phone, address and city are required');
    }
    if (!['cod', 'online'].includes(paymentMethod)) {
        res.status(400);
        throw new Error('Payment method must be cod or online');
    }

    const order = await Order.create({
        user: req.user?._id,
        items,
        total,
        paymentMethod,
        transactionId,
        screenshotAttached,
        shipping,
    });

    res.status(201).json({ order: toPublicOrder(order) });
});

// GET /api/orders/my — requires login.
export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ orders: orders.map(toPublicOrder) });
});
