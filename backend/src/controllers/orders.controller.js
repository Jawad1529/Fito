import mongoose from 'mongoose';
import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.model.js';
import { toPublicOrder } from '../utils/serializers.js';

// Digits only, so "0300-1234567" and "+92 300 1234567" both match what was
// stored at checkout.
const normalizePhone = (phone) => String(phone ?? '').replace(/\D/g, '');

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

// GET /api/orders/track?orderId=&phone= — no auth, so the phone used at
// checkout doubles as the shared secret proving the requester owns the order.
export const trackOrder = asyncHandler(async (req, res) => {
    const { orderId, phone } = req.query;

    if (!orderId || !phone || !mongoose.isValidObjectId(orderId)) {
        res.status(400);
        throw new Error('A valid order ID and phone number are required');
    }

    const order = await Order.findById(orderId);

    if (!order || normalizePhone(order.shipping.phone) !== normalizePhone(phone)) {
        res.status(404);
        throw new Error('No order found for that order ID and phone number');
    }

    res.json({ order: toPublicOrder(order) });
});
