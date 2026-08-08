import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLES } from '../constants/roles.js';
import { ADMIN_STATUS } from '../constants/adminStatus.js';

const adminSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true, minlength: 8, select: false },
        role: {
            type: String,
            enum: Object.values(ROLES),
            default: ROLES.ADMIN,
        },
        // Self-serve signups start inactive and can't log in until a super
        // admin activates them (see requireSuperAdmin-gated status route).
        status: {
            type: String,
            enum: Object.values(ADMIN_STATUS),
            default: ADMIN_STATUS.INACTIVE,
        },
    },
    { timestamps: true }
);

adminSchema.pre('save', async function hashPassword() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

adminSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('Admin', adminSchema);
