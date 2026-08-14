// Starting set of 3 programs per goal (18 total), used to lazily create
// ConsultationPlan documents the first time a goal is read with zero plans
// (see consultationPlans.controller.js). Once created, admins fully own this
// data — they can rename, reprice, or delete these, and add as many more
// programs as they like. Content mirrors what app/utils/consultationConfig.js
// shipped with before pricing/features moved into the database.
export const CONSULTATION_PLAN_DEFAULTS = [
    // fat-loss
    { goal: 'fat-loss', label: 'Basic', durationMonths: 1, price: 4500, features: [
        'Personalized fat loss nutrition plan', '2 follow-up check-ins', 'WhatsApp support (working hours)', '1 plan revision',
    ] },
    { goal: 'fat-loss', label: 'Pro', durationMonths: 3, price: 12000, features: [
        'Everything in the Basic plan', 'Monthly plan revisions (3 total)', '6 follow-up check-ins', 'Priority WhatsApp support',
    ] },
    { goal: 'fat-loss', label: 'Premium', durationMonths: 6, price: 21000, features: [
        'Everything in the Pro plan', 'Bi-weekly check-ins (12 total)', 'Unlimited plan revisions', 'Priority support, 7 days a week',
    ] },

    // muscle-gain
    { goal: 'muscle-gain', label: 'Basic', durationMonths: 1, price: 5000, features: [
        'Personalized muscle gain nutrition plan', '2 follow-up check-ins', 'WhatsApp support (working hours)', '1 plan revision',
    ] },
    { goal: 'muscle-gain', label: 'Pro', durationMonths: 3, price: 13500, features: [
        'Everything in the Basic plan', 'Monthly plan revisions (3 total)', '6 follow-up check-ins', 'Priority WhatsApp support',
    ] },
    { goal: 'muscle-gain', label: 'Premium', durationMonths: 6, price: 24000, features: [
        'Everything in the Pro plan', 'Bi-weekly check-ins (12 total)', 'Unlimited plan revisions', 'Priority support, 7 days a week',
    ] },

    // body-recomposition
    { goal: 'body-recomposition', label: 'Basic', durationMonths: 1, price: 5000, features: [
        'Personalized body recomposition plan', '2 follow-up check-ins', 'WhatsApp support (working hours)', '1 plan revision',
    ] },
    { goal: 'body-recomposition', label: 'Pro', durationMonths: 3, price: 13500, features: [
        'Everything in the Basic plan', 'Monthly plan revisions (3 total)', '6 follow-up check-ins', 'Priority WhatsApp support',
    ] },
    { goal: 'body-recomposition', label: 'Premium', durationMonths: 6, price: 24000, features: [
        'Everything in the Pro plan', 'Bi-weekly check-ins (12 total)', 'Unlimited plan revisions', 'Priority support, 7 days a week',
    ] },

    // pcos
    { goal: 'pcos', label: 'Basic', durationMonths: 1, price: 5500, features: [
        'Personalized PCOS-friendly nutrition plan', '2 follow-up check-ins', 'WhatsApp support (working hours)', '1 plan revision',
    ] },
    { goal: 'pcos', label: 'Pro', durationMonths: 3, price: 15000, features: [
        'Everything in the Basic plan', 'Monthly plan revisions (3 total)', '6 follow-up check-ins', 'Priority WhatsApp support',
    ] },
    { goal: 'pcos', label: 'Premium', durationMonths: 6, price: 27000, features: [
        'Everything in the Pro plan', 'Bi-weekly check-ins (12 total)', 'Unlimited plan revisions', 'Priority support, 7 days a week',
    ] },

    // mother-wellness
    { goal: 'mother-wellness', label: 'Basic', durationMonths: 1, price: 6000, features: [
        'Personalized maternal nutrition plan', '2 follow-up check-ins', 'WhatsApp support (working hours)', '1 plan revision',
    ] },
    { goal: 'mother-wellness', label: 'Pro', durationMonths: 3, price: 16500, features: [
        'Everything in the Basic plan', 'Monthly plan revisions (3 total)', '6 follow-up check-ins', 'Priority WhatsApp support',
    ] },
    { goal: 'mother-wellness', label: 'Premium', durationMonths: 6, price: 30000, features: [
        'Everything in the Pro plan', 'Bi-weekly check-ins (12 total)', 'Unlimited plan revisions', 'Priority support, 7 days a week',
    ] },

    // diabetes
    { goal: 'diabetes', label: 'Basic', durationMonths: 1, price: 5500, features: [
        'Personalized diabetic-friendly nutrition plan', '2 follow-up check-ins', 'WhatsApp support (working hours)', '1 plan revision',
    ] },
    { goal: 'diabetes', label: 'Pro', durationMonths: 3, price: 15000, features: [
        'Everything in the Basic plan', 'Monthly plan revisions (3 total)', '6 follow-up check-ins', 'Priority WhatsApp support',
    ] },
    { goal: 'diabetes', label: 'Premium', durationMonths: 6, price: 27000, features: [
        'Everything in the Pro plan', 'Bi-weekly check-ins (12 total)', 'Unlimited plan revisions', 'Priority support, 7 days a week',
    ] },
];
