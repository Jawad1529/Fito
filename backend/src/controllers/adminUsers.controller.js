const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User.model');
const { toPublicUser } = require('../utils/serializers');
const { USER_STATUS } = require('../constants/userStatus');

// GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users: users.map(toPublicUser) });
});

// PATCH /api/admin/users/:id/status
// This is how a super admin moves a signup from inactive to active.
const updateUserStatus = asyncHandler(async (req, res) => {
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

module.exports = { listUsers, updateUserStatus };
