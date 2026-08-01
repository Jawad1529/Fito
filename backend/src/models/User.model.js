const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { USER_STATUS } = require('../constants/userStatus');

// App-side (customer) account — no roles, that's admin-only. New signups
// start inactive and can't log in until a super admin activates them.
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 8, select: false },
        phone: { type: String, trim: true },
        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.INACTIVE,
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function hashPassword(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
