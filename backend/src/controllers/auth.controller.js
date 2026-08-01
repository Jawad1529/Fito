import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.model.js';
import { USER_STATUS } from '../constants/userStatus.js';
import { toPublicUser } from '../utils/serializers.js';

// POST /api/auth/register
// New signups start as USER_STATUS.INACTIVE (schema default) and cannot log
// in until a super admin activates them, so no token is issued here.
export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Name, email and password are required');
    }

    const existing = await User.findOne({ email });
    if (existing) {
        res.status(409);
        throw new Error('An account with this email already exists');
    }

    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
        user: toPublicUser(user),
        message: 'Registration successful. Your account is pending approval from an admin.',
    });
});

// POST /api/auth/login
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    if (user.status === USER_STATUS.BLOCKED) {
        res.status(403);
        throw new Error('Your account has been blocked. Please contact support.');
    }

    if (user.status !== USER_STATUS.ACTIVE) {
        res.status(403);
        throw new Error("Your account is pending approval. We'll notify you once an admin activates it.");
    }

    res.json({
        token: generateToken({ id: user._id }),
        user: toPublicUser(user),
    });
});

// GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
    res.json({ user: toPublicUser(req.user) });
});
