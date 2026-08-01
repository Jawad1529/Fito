import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import { toPublicUser } from '../utils/serializers.js';
import { USER_STATUS } from '../constants/userStatus.js';

// GET /api/admin/users
export const listUsers = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map(toPublicUser) });
});

// PATCH /api/admin/users/:id/status
// This is how a super admin moves a signup from inactive to active.
export const updateUserStatus = asyncHandler(async (req, res) => {
    const { status } = req.body;

    if (!Object.values(USER_STATUS).includes(status)) {
        res.status(400);
        throw new Error(`Status must be one of: ${Object.values(USER_STATUS).join(', ')}`);
    }

    const user = await User.findById(req.params.id);
    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.status = status;
    await user.save();

    res.json({ user: toPublicUser(user) });
});
