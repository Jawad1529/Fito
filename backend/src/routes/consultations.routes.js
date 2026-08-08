import express from 'express';
import {
    createConsultation,
    getMyConsultations,
    getMyConsultationById,
    addMyMessage,
} from '../controllers/consultations.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { uploadConsultationFiles } from '../middleware/upload.middleware.js';

const router = express.Router();

// Consultations involve ongoing chat + medical data, so unlike guest
// checkout (Order), every route here requires a logged-in account.
router.use(protect);

router.post('/', uploadConsultationFiles, createConsultation);
router.get('/my', getMyConsultations);
router.get('/:id', getMyConsultationById);
router.post('/:id/messages', addMyMessage);

export default router;
