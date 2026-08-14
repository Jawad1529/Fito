import asyncHandler from '../utils/asyncHandler.js';
import ConsultationPlan from '../models/ConsultationPlan.model.js';
import { CONSULTATION_GOALS } from '../constants/consultationGoals.js';
import { CONSULTATION_PLAN_DEFAULTS } from '../constants/consultationPlanDefaults.js';
import { toPublicConsultationPlan } from '../utils/serializers.js';

// Creates any of the 18 (goal, duration) plans that don't exist yet from the
// default price table, then returns the full set. Self-healing so nothing
// needs to be manually seeded, and existing docs (and any admin edits) are
// left untouched.
const ensurePlansExist = async () => {
    await Promise.all(
        CONSULTATION_PLAN_DEFAULTS.map((defaults) =>
            ConsultationPlan.findOneAndUpdate(
                { goal: defaults.goal, planId: defaults.planId },
                { $setOnInsert: defaults },
                { upsert: true }
            )
        )
    );
};

// GET /api/consultation-plans and GET /api/admin/consultation-plans — same
// shape for both; the admin route additionally requires protectAdmin (see route).
export const listConsultationPlans = asyncHandler(async (req, res) => {
    await ensurePlansExist();
    const plans = await ConsultationPlan.find().sort({ goal: 1, durationMonths: 1 });
    res.json({ plans: plans.map(toPublicConsultationPlan) });
});

// PATCH /api/admin/consultation-plans/:goal/:planId — price and/or discountPercent.
export const updateConsultationPlan = asyncHandler(async (req, res) => {
    const { goal, planId } = req.params;
    const { price, discountPercent } = req.body;

    if (!CONSULTATION_GOALS.includes(goal)) {
        res.status(400);
        throw new Error(`Goal must be one of: ${CONSULTATION_GOALS.join(', ')}`);
    }
    if (price !== undefined && (typeof price !== 'number' || price < 0)) {
        res.status(400);
        throw new Error('Price must be a non-negative number');
    }
    if (discountPercent !== undefined && (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100)) {
        res.status(400);
        throw new Error('Discount percent must be a number between 0 and 100');
    }

    await ensurePlansExist();

    const update = {};
    if (price !== undefined) update.price = price;
    if (discountPercent !== undefined) update.discountPercent = discountPercent;

    const plan = await ConsultationPlan.findOneAndUpdate({ goal, planId }, update, { new: true });
    if (!plan) {
        res.status(404);
        throw new Error('Consultation plan not found');
    }

    res.json({ plan: toPublicConsultationPlan(plan) });
});
