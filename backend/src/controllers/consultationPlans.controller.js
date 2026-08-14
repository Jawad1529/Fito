import asyncHandler from '../utils/asyncHandler.js';
import ConsultationPlan from '../models/ConsultationPlan.model.js';
import { CONSULTATION_GOALS } from '../constants/consultationGoals.js';
import { CONSULTATION_PLAN_DEFAULTS } from '../constants/consultationPlanDefaults.js';
import { toPublicConsultationPlan } from '../utils/serializers.js';

// Seeds a goal's 3 default programs the first time it's read with none —
// self-healing so nothing needs to be manually seeded. Once any plan exists
// for a goal (including ones an admin later deletes down to zero — an edge
// case we accept re-seeding on), this is a no-op.
const ensureGoalHasPlans = async (goal) => {
    const count = await ConsultationPlan.countDocuments({ goal });
    if (count > 0) return;
    const defaults = CONSULTATION_PLAN_DEFAULTS.filter((d) => d.goal === goal);
    if (defaults.length) await ConsultationPlan.insertMany(defaults);
};

const cleanFeatures = (features) =>
    Array.isArray(features)
        ? features.filter((f) => typeof f === 'string' && f.trim()).map((f) => f.trim())
        : [];

// GET /api/consultation-plans and GET /api/admin/consultation-plans — same
// shape for both; the admin route additionally requires protectAdmin (see
// route). Optional ?goal= scopes to one goal (used by the admin pricing page).
export const listConsultationPlans = asyncHandler(async (req, res) => {
    const { goal } = req.query;
    const goalFilter = CONSULTATION_GOALS.includes(goal) ? goal : null;

    if (goalFilter) {
        await ensureGoalHasPlans(goalFilter);
    } else {
        await Promise.all(CONSULTATION_GOALS.map(ensureGoalHasPlans));
    }

    const plans = await ConsultationPlan.find(goalFilter ? { goal: goalFilter } : {}).sort({
        goal: 1,
        durationMonths: 1,
        createdAt: 1,
    });
    res.json({ plans: plans.map(toPublicConsultationPlan) });
});

// POST /api/admin/consultation-plans — creates a new program under a goal.
export const createConsultationPlan = asyncHandler(async (req, res) => {
    const { goal, label, durationMonths, price, discountPercent, features } = req.body;

    if (!CONSULTATION_GOALS.includes(goal)) {
        res.status(400);
        throw new Error(`Goal must be one of: ${CONSULTATION_GOALS.join(', ')}`);
    }
    if (!label?.trim()) {
        res.status(400);
        throw new Error('Label is required');
    }
    if (typeof durationMonths !== 'number' || durationMonths < 1) {
        res.status(400);
        throw new Error('Duration must be at least 1 month');
    }
    if (typeof price !== 'number' || price < 0) {
        res.status(400);
        throw new Error('Price must be a non-negative number');
    }
    if (discountPercent !== undefined && (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100)) {
        res.status(400);
        throw new Error('Discount percent must be between 0 and 100');
    }

    const plan = await ConsultationPlan.create({
        goal,
        label: label.trim(),
        durationMonths,
        price,
        discountPercent: discountPercent ?? 0,
        features: cleanFeatures(features),
    });

    res.status(201).json({ plan: toPublicConsultationPlan(plan) });
});

// PATCH /api/admin/consultation-plans/:id
export const updateConsultationPlan = asyncHandler(async (req, res) => {
    const { label, durationMonths, price, discountPercent, features } = req.body;

    const plan = await ConsultationPlan.findById(req.params.id);
    if (!plan) {
        res.status(404);
        throw new Error('Consultation plan not found');
    }

    if (label !== undefined) {
        if (!label.trim()) {
            res.status(400);
            throw new Error('Label is required');
        }
        plan.label = label.trim();
    }
    if (durationMonths !== undefined) {
        if (typeof durationMonths !== 'number' || durationMonths < 1) {
            res.status(400);
            throw new Error('Duration must be at least 1 month');
        }
        plan.durationMonths = durationMonths;
    }
    if (price !== undefined) {
        if (typeof price !== 'number' || price < 0) {
            res.status(400);
            throw new Error('Price must be a non-negative number');
        }
        plan.price = price;
    }
    if (discountPercent !== undefined) {
        if (typeof discountPercent !== 'number' || discountPercent < 0 || discountPercent > 100) {
            res.status(400);
            throw new Error('Discount percent must be between 0 and 100');
        }
        plan.discountPercent = discountPercent;
    }
    if (features !== undefined) plan.features = cleanFeatures(features);

    await plan.save();
    res.json({ plan: toPublicConsultationPlan(plan) });
});

// DELETE /api/admin/consultation-plans/:id
export const deleteConsultationPlan = asyncHandler(async (req, res) => {
    const plan = await ConsultationPlan.findById(req.params.id);
    if (!plan) {
        res.status(404);
        throw new Error('Consultation plan not found');
    }

    await plan.deleteOne();
    res.json({ message: 'Consultation plan deleted' });
});
