import express from 'express';
import { createOrder, getMyOrders } from '../controllers/orders.controller.js';
import { protect, attachUserIfPresent } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', attachUserIfPresent, createOrder);
router.get('/my', protect, getMyOrders);

export default router;
