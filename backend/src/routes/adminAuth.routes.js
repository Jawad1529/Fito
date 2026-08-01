import express from 'express';
import { loginAdmin, getMeAdmin, createAdmin } from '../controllers/adminAuth.controller.js';
import { protectAdmin, requireSuperAdmin } from '../middleware/adminAuth.middleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMeAdmin);
// Only an authenticated super admin can create new admin accounts.
router.post('/create', protectAdmin, requireSuperAdmin, createAdmin);

export default router;
