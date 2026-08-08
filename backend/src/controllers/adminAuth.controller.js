import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import Admin from '../models/Admin.model.js';
import { ROLES } from '../constants/roles.js';
import { ADMIN_STATUS } from '../constants/adminStatus.js';
import { toPublicAdmin } from '../utils/serializers.js';

// POST /api/admin/auth/login
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Missing status (admins created before this field existed) is treated
    // as active so pre-existing accounts aren't locked out.
    if (admin.status && admin.status !== ADMIN_STATUS.ACTIVE) {
        res.status(403);
        throw new Error('Your account is pending approval by a super admin.');
    }

    res.json({
        token: generateToken({ id: admin._id }),
        admin: toPublicAdmin(admin),
    });
});

// POST /api/admin/auth/signup — public self-serve signup. Always creates a
// plain admin (never super_admin) and leaves it inactive until a super
// admin activates it via updateAdminStatus below.
export const signupAdmin = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email and password are required');
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
        res.status(409);
        throw new Error('An admin with this email already exists');
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        role: ROLES.ADMIN,
        status: ADMIN_STATUS.INACTIVE,
    });

    res.status(201).json({
        admin: toPublicAdmin(admin),
        message: 'Signup successful. A super admin needs to activate your account before you can log in.',
    });
});

// GET /api/admin/auth — super admin only, lists all admin accounts.
export const listAdmins = asyncHandler(async (req, res) => {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.json({ admins: admins.map(toPublicAdmin) });
});

// PATCH /api/admin/auth/:id/status — this is how a super admin activates a
// pending self-serve signup (or deactivates an existing admin).
export const updateAdminStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!Object.values(ADMIN_STATUS).includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${Object.values(ADMIN_STATUS).join(', ')}`);
    }

    const admin = await Admin.findById(req.params.id);
    if (!admin) {
        res.status(404);
        throw new Error('Admin not found');
    }

    admin.status = status;
    await admin.save();

    res.json({ admin: toPublicAdmin(admin) });
});

// GET /api/admin/auth/me
export const getMeAdmin = asyncHandler(async (req, res) => {
    res.json({ admin: toPublicAdmin(req.admin) });
});

// POST /api/admin/auth/create — super admin only, directly provisions an
// already-usable admin (unlike the public /signup route, which is left
// inactive for a super admin to activate).
export const createAdmin = asyncHandler(async (req, res) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email and password are required');
    }

    const existing = await Admin.findOne({ email });
    if (existing) {
        res.status(409);
        throw new Error('An admin with this email already exists');
    }

    const admin = await Admin.create({
        name,
        email,
        password,
        role: Object.values(ROLES).includes(role) ? role : ROLES.ADMIN,
        status: ADMIN_STATUS.ACTIVE,
    });

    res.status(201).json({ admin: toPublicAdmin(admin) });
});
