import express from 'express';
import { listConsultationPlans, updateConsultationPlan } from '../controllers/consultationPlans.controller.js';
import { protectAdmin } from '../middleware/adminAuth.middleware.js';

const router = express.Router();

// Any admin can manage plan pricing, matching the /products and
// /consultations route gating in the admin panel.
router.use(protectAdmin);

router.get('/', listConsultationPlans);
router.patch('/:goal/:planId', updateConsultationPlan);

export default router;
