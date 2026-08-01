import nodemailer from 'nodemailer';
import { OTP_PURPOSE } from '../constants/otpPurpose.js';

// Free Gmail SMTP (no paid email provider) — needs a Google Account with
// 2-Step Verification and an App Password, not the normal login password.
// https://myaccount.google.com/apppasswords
let transporter;
const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });
    }
    return transporter;
};

const OTP_SUBJECT = {
    [OTP_PURPOSE.VERIFY_EMAIL]: 'Verify your email — Fito',
    [OTP_PURPOSE.RESET_PASSWORD]: 'Reset your password — Fito',
};

const OTP_INTRO = {
    [OTP_PURPOSE.VERIFY_EMAIL]: 'Use the code below to verify your email address.',
    [OTP_PURPOSE.RESET_PASSWORD]: 'Use the code below to reset your password.',
};

export const sendOtpEmail = async ({ to, otp, purpose }) => {
    await getTransporter().sendMail({
        from: `"Fito" <${process.env.GMAIL_USER}>`,
        to,
        subject: OTP_SUBJECT[purpose],
        html: `
            <p>${OTP_INTRO[purpose]}</p>
            <p style="font-size: 28px; font-weight: bold; letter-spacing: 4px;">${otp}</p>
            <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>
        `,
    });
};
