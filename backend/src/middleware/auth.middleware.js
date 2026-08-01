const jwt = require('jsonwebtoken');
const asyncHandler = require('../utils/asyncHandler');
const User = require('../models/User.model');
const { USER_STATUS } = require('../constants/userStatus');

// Protects app-side (customer) routes.
const protect = asyncHandler(async (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    let decoded;
    try {
        decoded = jwt.verify(header.split(' ')[1], process.env.JWT_SECRET);
    } catch {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }

    const user = await User.findById(decoded.id);
    if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
    }

    // Re-checked here (not just at login) so a status change takes effect
    // immediately instead of waiting out an already-issued token.
    if (user.status !== USER_STATUS.ACTIVE) {
        res.status(403);
        throw new Error('Your account is not active. Please contact support.');
    }

    req.user = user;
    next();
});

module.exports = { protect };
