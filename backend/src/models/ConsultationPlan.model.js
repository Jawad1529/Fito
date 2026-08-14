import mongoose from 'mongoose';
import { CONSULTATION_GOALS } from '../constants/consultationGoals.js';

// Admin-managed price for one (goal, duration) combination — e.g. fat-loss's
// 3-month plan. There are 18 of these (6 goals x 3 durations); missing ones
// are lazily created from consultationPlanDefaults.js the first time they're
// read (see consultationPlans.controller.js), so no manual seeding is required.
const consultationPlanSchema = new mongoose.Schema(
    {
        goal: { type: String, enum: CONSULTATION_GOALS, required: true },
        planId: { type: String, required: true, trim: true },
        label: { type: String, required: true, trim: true },
        durationMonths: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        // Percentage off `price`, shown as a struck-through original price on
        // the app. 0 means no discount.
        discountPercent: { type: Number, default: 0, min: 0, max: 100 },
    },
    { timestamps: true }
);

consultationPlanSchema.index({ goal: 1, planId: 1 }, { unique: true });

export default mongoose.model('ConsultationPlan', consultationPlanSchema);
