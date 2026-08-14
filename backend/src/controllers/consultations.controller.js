import asyncHandler from '../utils/asyncHandler.js';
import Consultation from '../models/Consultation.model.js';
import ConsultationPlan from '../models/ConsultationPlan.model.js';
import { CONSULTATION_GOALS } from '../constants/consultationGoals.js';
import { REPLY_AUTHOR } from '../constants/contentStatus.js';
import { toPublicConsultation, computeDiscountedPrice } from '../utils/serializers.js';
import { toImageUrl } from '../middleware/upload.middleware.js';

// Multipart bodies arrive as strings, so JSON fields need parsing. Returns
// `fallback` (rather than throwing) on malformed JSON — the caller decides
// whether that's acceptable for the given field.
const parseJson = (value, fallback) => {
    if (value === undefined || value === '') return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

// Loads a consultation owned by req.user or 404s — shared by every /:id route.
const findMyConsultationOr404 = async (id, userId) => {
    const consultation = await Consultation.findOne({ _id: id, user: userId });
    if (!consultation) {
        const err = new Error('Consultation not found');
        err.statusCode = 404;
        throw err;
    }
    return consultation;
};

// POST /api/consultations (multipart/form-data) — login required (see
// `protect` on the route). Fields: goal, plan (JSON), personalInfo (JSON),
// goalData (JSON), transactionId, plus file fields bodyPhotos/reports/paymentScreenshot.
export const createConsultation = asyncHandler(async (req, res) => {
    const { goal, transactionId } = req.body;
    const submittedPlan = parseJson(req.body.plan, null);
    const personalInfo = parseJson(req.body.personalInfo, null);
    const goalData = parseJson(req.body.goalData, {});

    if (!CONSULTATION_GOALS.includes(goal)) {
        res.status(400);
        throw new Error(`Goal must be one of: ${CONSULTATION_GOALS.join(', ')}`);
    }
    if (!personalInfo?.fullName || !personalInfo?.email || !personalInfo?.phone) {
        res.status(400);
        throw new Error('Personal info must include fullName, email and phone');
    }

    // The price actually charged is looked up from the admin-managed
    // ConsultationPlan collection rather than trusted from the client, so a
    // tampered `plan.price` in the request can't change what gets billed.
    let plan = null;
    if (submittedPlan?.id) {
        const planDoc = await ConsultationPlan.findOne({ goal, planId: submittedPlan.id });
        if (!planDoc) {
            res.status(400);
            throw new Error('Invalid plan selected');
        }
        const discountedPrice = computeDiscountedPrice(planDoc.price, planDoc.discountPercent);
        plan = {
            id: planDoc.planId,
            label: planDoc.label,
            durationMonths: planDoc.durationMonths,
            price: discountedPrice,
            originalPrice: planDoc.discountPercent > 0 ? planDoc.price : undefined,
        };
    }

    const files = req.files ?? {};

    const consultation = await Consultation.create({
        user: req.user._id,
        goal,
        plan,
        personalInfo,
        goalData,
        uploads: {
            bodyPhotos: (files.bodyPhotos ?? []).map(toImageUrl),
            reports: (files.reports ?? []).map(toImageUrl),
            paymentScreenshot: (files.paymentScreenshot ?? []).map(toImageUrl),
        },
        transactionId,
    });

    res.status(201).json({ consultation: toPublicConsultation(consultation) });
});

// GET /api/consultations/my
export const getMyConsultations = asyncHandler(async (req, res) => {
    const consultations = await Consultation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ consultations: consultations.map(toPublicConsultation) });
});

// GET /api/consultations/:id
export const getMyConsultationById = asyncHandler(async (req, res) => {
    const consultation = await findMyConsultationOr404(req.params.id, req.user._id).catch((err) => {
        res.status(err.statusCode || 404);
        throw err;
    });
    res.json({ consultation: toPublicConsultation(consultation) });
});

// POST /api/consultations/:id/messages — the customer continuing the thread.
export const addMyMessage = asyncHandler(async (req, res) => {
    const { message } = req.body;
    if (!message?.trim()) {
        res.status(400);
        throw new Error('Message is required');
    }

    const consultation = await findMyConsultationOr404(req.params.id, req.user._id).catch((err) => {
        res.status(err.statusCode || 404);
        throw err;
    });

    consultation.conversation.push({
        authorType: REPLY_AUTHOR.USER,
        user: req.user._id,
        authorName: req.user.name,
        message: message.trim(),
    });
    await consultation.save();

    res.status(201).json({ consultation: toPublicConsultation(consultation) });
});
