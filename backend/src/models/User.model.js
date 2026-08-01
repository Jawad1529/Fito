import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { USER_STATUS } from '../constants/userStatus.js';
import { OTP_PURPOSE } from '../constants/otpPurpose.js';

// App-side (customer) account — no roles, that's admin-only. New signups
// start inactive and are only activated once they verify the OTP emailed to
// them; a super admin can still block/reactivate afterwards via status.
const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        // Not required for Google-signed-up accounts, which have no local password.
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
            minlength: 8,
            select: false,
        },
        googleId: { type: String, unique: true, sparse: true },
        phone: { type: String, trim: true },
        status: {
            type: String,
            enum: Object.values(USER_STATUS),
            default: USER_STATUS.INACTIVE,
        },
        isEmailVerified: { type: Boolean, default: false },
        // Hashed like the password — never store the raw code. select:false
        // keeps it out of normal queries/serialization by default.
        otp: {
            codeHash: { type: String, select: false },
            purpose: { type: String, enum: Object.values(OTP_PURPOSE), select: false },
            expiresAt: { type: Date, select: false },
            attempts: { type: Number, default: 0, select: false },
        },
    },
    { timestamps: true }
);

userSchema.pre('save', async function hashPassword() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
    return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);
