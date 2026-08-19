// Mirrors backend/src/constants/consultationPlanDefaults.js — used as the
// mock dataset for ConsultationPlanPricingPage when testing mode is on.
const tierFeatures = (tier) =>
    tier === 'Basic'
        ? ['Personalized nutrition plan', '2 follow-up check-ins', 'WhatsApp support (working hours)', '1 plan revision']
        : tier === 'Pro'
            ? ['Everything in the Basic plan', 'Monthly plan revisions (3 total)', '6 follow-up check-ins', 'Priority WhatsApp support']
            : ['Everything in the Pro plan', 'Bi-weekly check-ins (12 total)', 'Unlimited plan revisions', 'Priority support, 7 days a week'];

const makePlans = (goal, prices) => [
    { id: `${goal}-basic`, goal, label: 'Basic', durationMonths: 1, price: prices[0], discountPercent: 0, isPaused: false, features: tierFeatures('Basic') },
    { id: `${goal}-pro`, goal, label: 'Pro', durationMonths: 3, price: prices[1], discountPercent: 0, isPaused: false, features: tierFeatures('Pro') },
    { id: `${goal}-premium`, goal, label: 'Premium', durationMonths: 6, price: prices[2], discountPercent: 0, isPaused: false, features: tierFeatures('Premium') },
];

export const consultationPlans = [
    ...makePlans('fat-loss', [4500, 12000, 21000]).map((p, i) => (i === 1 ? { ...p, discountPercent: 15 } : p)),
    ...makePlans('muscle-gain', [5000, 13500, 24000]),
    ...makePlans('body-recomposition', [5000, 13500, 24000]),
    ...makePlans('pcos', [5500, 15000, 27000]),
    ...makePlans('mother-wellness', [6000, 16500, 30000]),
    ...makePlans('diabetes', [5500, 15000, 27000]),
];
