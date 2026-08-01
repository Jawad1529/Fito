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
