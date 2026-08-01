import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import Admin from '../models/Admin.model.js';
import { ROLES } from '../constants/roles.js';
import { toPublicAdmin } from '../utils/serializers.js';

// POST /api/admin/auth/login
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin || !(await admin.comparePassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    res.json({
        token: generateToken({ id: admin._id }),
        admin: toPublicAdmin(admin),
    });
});

// GET /api/admin/auth/me
export const getMeAdmin = asyncHandler(async (req, res) => {
    res.json({ admin: toPublicAdmin(req.admin) });
});

// POST /api/admin/auth/create — super admin only, no public admin signup.
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
    });

    res.status(201).json({ admin: toPublicAdmin(admin) });
});
