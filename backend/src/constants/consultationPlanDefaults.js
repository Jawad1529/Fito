// Default price table for the 18 (goal, duration) consultation plans, mirroring
// the prices app/utils/consultationConfig.js shipped with before pricing moved
// into the ConsultationPlan collection. Used to lazily create any ConsultationPlan
// documents that don't exist yet (see consultationPlans.controller.js) so today's
// prices don't change until an admin edits them.
export const CONSULTATION_PLAN_DEFAULTS = [
    { goal: 'fat-loss', planId: '1-month', label: '1 Month', durationMonths: 1, price: 4500 },
    { goal: 'fat-loss', planId: '3-month', label: '3 Months', durationMonths: 3, price: 12000 },
    { goal: 'fat-loss', planId: '6-month', label: '6 Months', durationMonths: 6, price: 21000 },

    { goal: 'muscle-gain', planId: '1-month', label: '1 Month', durationMonths: 1, price: 5000 },
    { goal: 'muscle-gain', planId: '3-month', label: '3 Months', durationMonths: 3, price: 13500 },
    { goal: 'muscle-gain', planId: '6-month', label: '6 Months', durationMonths: 6, price: 24000 },

    { goal: 'body-recomposition', planId: '1-month', label: '1 Month', durationMonths: 1, price: 5000 },
    { goal: 'body-recomposition', planId: '3-month', label: '3 Months', durationMonths: 3, price: 13500 },
    { goal: 'body-recomposition', planId: '6-month', label: '6 Months', durationMonths: 6, price: 24000 },

    { goal: 'pcos', planId: '1-month', label: '1 Month', durationMonths: 1, price: 5500 },
    { goal: 'pcos', planId: '3-month', label: '3 Months', durationMonths: 3, price: 15000 },
    { goal: 'pcos', planId: '6-month', label: '6 Months', durationMonths: 6, price: 27000 },

    { goal: 'mother-wellness', planId: '1-month', label: '1 Month', durationMonths: 1, price: 6000 },
    { goal: 'mother-wellness', planId: '3-month', label: '3 Months', durationMonths: 3, price: 16500 },
    { goal: 'mother-wellness', planId: '6-month', label: '6 Months', durationMonths: 6, price: 30000 },

    { goal: 'diabetes', planId: '1-month', label: '1 Month', durationMonths: 1, price: 5500 },
    { goal: 'diabetes', planId: '3-month', label: '3 Months', durationMonths: 3, price: 15000 },
    { goal: 'diabetes', planId: '6-month', label: '6 Months', durationMonths: 6, price: 27000 },
];
