const express = require('express');
const { loginAdmin, getMeAdmin, createAdmin } = require('../controllers/adminAuth.controller');
const { protectAdmin, requireSuperAdmin } = require('../middleware/adminAuth.middleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protectAdmin, getMeAdmin);
// Only an authenticated super admin can create new admin accounts.
router.post('/create', protectAdmin, requireSuperAdmin, createAdmin);

module.exports = router;
