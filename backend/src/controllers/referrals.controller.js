import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.model.js';
import ReferralCommission from '../models/ReferralCommission.model.js';

// GET /api/referrals/my
// Counts only — no PII of the referred people. The admin panel is where a
// referrer's affiliated signups are shown by name/email (see adminReferrals).
export const getMyReferralSummary = asyncHandler(async (req, res) => {
    // Accounts created before the referral field existed were never assigned
    // one (the pre-save hook that generates it only fires on save, and login
    // doesn't save) — backfill lazily here so every account self-heals the
    // first time it checks its referral summary.
    if (!req.user.referralCode) {
        await req.user.save();
    }

    const [totalReferred, consultationsBooked] = await Promise.all([
        User.countDocuments({ referredBy: req.user._id }),
        ReferralCommission.countDocuments({ referrer: req.user._id }),
    ]);

    res.json({
        referralCode: req.user.referralCode,
        totalReferred,
        consultationsBooked,
    });
});
