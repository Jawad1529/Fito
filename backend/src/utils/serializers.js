// Shared response shapes so User/Admin documents are serialized the same
// way everywhere they're returned (auth, admin user management, etc).
export const toPublicUser = (user) => ({
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    status: user.status,
    createdAt: user.createdAt,
});

export const toPublicAdmin = (admin) => ({
    id: admin._id,
    name: admin.name,
    email: admin.email,
    role: admin.role,
});

export const toPublicOrder = (order) => ({
    id: order._id,
    user: order.user,
    items: order.items,
    total: order.total,
    paymentMethod: order.paymentMethod,
    transactionId: order.transactionId,
    screenshotAttached: order.screenshotAttached,
    shipping: order.shipping,
    status: order.status,
    placedAt: order.createdAt,
});
