import express from 'express';
import { createOrder, getMyOrders, trackOrder } from '../controllers/orders.controller.js';
import { protect, attachUserIfPresent } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', attachUserIfPresent, createOrder);
router.get('/my', protect, getMyOrders);
// Registered before any /:id-style route would be added, so "track" is never
// swallowed as an id param.
router.get('/track', trackOrder);

export default router;
