import mongoose from 'mongoose';
import { CONSULTATION_GOALS } from '../constants/consultationGoals.js';

// A single admin-managed "program" offered under one goal — e.g. fat-loss's
// "Basic" plan. Admins can freely create/edit/delete any number of these per
// goal (see consultationPlans.controller.js); each goal starts out with the
// 3 defaults from consultationPlanDefaults.js, lazily created the first time
// that goal is read with zero plans, so no manual seeding is required.
const consultationPlanSchema = new mongoose.Schema(
    {
        goal: { type: String, enum: CONSULTATION_GOALS, required: true, index: true },
        // Admin-entered display name (e.g. "Basic", "Pro", "6-Week Reset") —
        // shown as-is on the app's plan selection screen.
        label: { type: String, required: true, trim: true },
        durationMonths: { type: Number, required: true, min: 1 },
        price: { type: Number, required: true, min: 0 },
        // Percentage off `price`, shown as a struck-through original price on
        // the app. 0 means no discount.
        discountPercent: { type: Number, default: 0, min: 0, max: 100 },
        // Short bullet points describing what's included — no images, per
        // product decision; the app already owns imagery at the goal level.
        features: [{ type: String, trim: true }],
        // Admin can pause a program without deleting it — the app shows it
        // blurred with a "Coming Soon" label and it can't be selected/bought.
        isPaused: { type: Boolean, default: false },
    },
    { timestamps: true }
);

export default mongoose.model('ConsultationPlan', consultationPlanSchema);
