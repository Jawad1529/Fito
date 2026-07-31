export const ROUTES = {
    LOGIN: '/login',
    DASHBOARD: '/',
    USERS: '/users',
    CONSULTATIONS: '/consultations',
    CONSULTATION_DETAIL: '/consultations/:id',
    PRODUCTS: '/products',
    REVIEWS: '/reviews',
    BLOGS: '/blogs',
    SETTINGS: '/settings',
    UNAUTHORIZED: '/unauthorized',
};

export const consultationDetailPath = (id) => `/consultations/${id}`;
