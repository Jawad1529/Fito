export const ROUTES = {
    LOGIN: '/login',
    SIGNUP: '/signup',
    DASHBOARD: '/',
    USERS: '/users',
    CONSULTATIONS: '/consultations',
    CONSULTATION_DETAIL: '/consultations/:id',
    CONSULTATION_PRICING: '/consultations/goal/:goalId/pricing',
    PRODUCTS: '/products',
    REVIEWS: '/reviews',
    ORDERS: '/orders',
    BLOGS: '/blogs',
    NOTIFICATIONS: '/notifications',
    SETTINGS: '/settings',
    UNAUTHORIZED: '/unauthorized',
};

export const consultationDetailPath = (id) => `/consultations/${id}`;
export const consultationPricingPath = (goalId) => `/consultations/goal/${goalId}/pricing`;
