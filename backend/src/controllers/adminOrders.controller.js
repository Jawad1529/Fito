import asyncHandler from '../utils/asyncHandler.js';
import Order from '../models/Order.model.js';
import { toPublicOrder } from '../utils/serializers.js';
import { ORDER_STATUS } from '../constants/orderStatus.js';

// GET /api/admin/orders
export const listOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({ orders: orders.map(toPublicOrder) });
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
