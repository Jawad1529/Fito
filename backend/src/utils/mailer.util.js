import { Resend } from 'resend';
import { OTP_PURPOSE } from '../constants/otpPurpose.js';

// Resend's API is plain HTTPS, so it isn't subject to the outbound-SMTP
// blocking/dropping that made raw Gmail SMTP hang for minutes on Railway.
// RESEND_FROM defaults to the sandbox address, which works with no domain
// verification — swap it for a verified domain address once one is set up.
let resend;
const getResend = () => {
    if (!resend) {
        resend = new Resend(process.env.RESEND_API_KEY);
    }
    return resend;
};

const FROM_ADDRESS = process.env.RESEND_FROM || 'Fito <onboarding@resend.dev>';

const OTP_SUBJECT = {
    [OTP_PURPOSE.VERIFY_EMAIL]: 'Verify your email — Fito',
    [OTP_PURPOSE.RESET_PASSWORD]: 'Reset your password — Fito',
};

const OTP_INTRO = {
    [OTP_PURPOSE.VERIFY_EMAIL]: 'Use the code below to verify your email address.',
    [OTP_PURPOSE.RESET_PASSWORD]: 'Use the code below to reset your password.',
};

export const sendOtpEmail = async ({ to, otp, purpose }) => {
    const { error } = await getResend().emails.send({
        from: FROM_ADDRESS,
        to,
        subject: OTP_SUBJECT[purpose],
        html: `
            <p>${OTP_INTRO[purpose]}</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
            <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        `,
    });
    if (error) {
        const err = new Error(error.message || 'Failed to send verification email');
        err.statusCode = 502;
        throw err;
    }
};
