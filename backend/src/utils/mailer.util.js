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

const formatCurrency = (amount) => `PKR ${Number(amount).toFixed(2)}`;

const PAYMENT_METHOD_LABEL = {
    cod: 'Cash on Delivery',
    online: 'Online Payment (Bank Transfer)',
};

// Sent right after an order is created, when the customer supplied an email
// at checkout — carries the order number so they can look it up later on the
// track-order page.
export const sendOrderConfirmationEmail = async ({ to, order }) => {
    const itemsHtml = order.items
        .map(
            (item) => `
                <tr>
                    <td style="padding:6px 0;">${item.name} × ${item.qty}</td>
                    <td style="padding:6px 0; text-align:right;">${formatCurrency(item.price * item.qty)}</td>
                </tr>`
        )
        .join('');

    const { error } = await getResend().emails.send({
        from: FROM_ADDRESS,
        to,
        subject: `Order Confirmed — ${order.orderNumber}`,
        html: `
            <p>Thanks for your order! Here's your confirmation.</p>
            <p style="font-size: 20px; font-weight: bold; letter-spacing: 1px;">Order #${order.orderNumber}</p>
            <table style="width: 100%; border-collapse: collapse;">
                ${itemsHtml}
                <tr>
                    <td style="padding:10px 0; font-weight:bold; border-top:1px solid #ddd;">Total</td>
                    <td style="padding:10px 0; font-weight:bold; text-align:right; border-top:1px solid #ddd;">${formatCurrency(order.total)}</td>
                </tr>
            </table>
            <p>Payment method: ${PAYMENT_METHOD_LABEL[order.paymentMethod] || order.paymentMethod}</p>
            <p>Shipping to: ${order.shipping.name}, ${order.shipping.address}, ${order.shipping.city}</p>
            <p style="margin-top: 24px;">Keep your order number handy — you can use it to track your order status anytime on our Track Order page.</p>
        `,
    });
    if (error) {
        const err = new Error(error.message || 'Failed to send order confirmation email');
        err.statusCode = 502;
        throw err;
    }
};

// Every recipient gets their own personal unsubscribe link, so this can't be
// a single shared email — each one is addressed individually.
const BACKEND_PUBLIC_URL = process.env.BACKEND_PUBLIC_URL || 'http://localhost:5000';
const unsubscribeUrl = (email) => `${BACKEND_PUBLIC_URL}/api/newsletter/unsubscribe?email=${encodeURIComponent(email)}`;

// resend.batch.send caps out at 100 emails per call, so larger lists go out
// in sequential chunks rather than one request.
const BATCH_SIZE = 100;
const chunk = (items, size) =>
    Array.from({ length: Math.ceil(items.length / size) }, (_, i) => items.slice(i * size, i * size + size));

// Sends `subject`/`html` to every subscriber email, one Resend batch request
// per 100 recipients. A failed batch doesn't stop the rest — the caller gets
// back how many sent vs failed so it can report a partial result.
export const sendNewsletterBroadcast = async ({ emails, subject, html }) => {
    let sent = 0;
    let failed = 0;

    for (const batch of chunk(emails, BATCH_SIZE)) {
        const { data, error } = await getResend().batch.send(
            batch.map((email) => ({
                from: FROM_ADDRESS,
                to: email,
                subject,
                html: `${html}<p style="margin-top:32px;font-size:12px;color:#888;">
                    <a href="${unsubscribeUrl(email)}">Unsubscribe</a> from this newsletter.
                </p>`,
            }))
        );
        if (error) {
            failed += batch.length;
        } else {
            sent += data?.data?.length ?? batch.length;
        }
    }

    return { sent, failed };
};
