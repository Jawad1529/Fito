const express = require('express');
const { listUsers, updateUserStatus } = require('../controllers/adminUsers.controller');
const { protectAdmin, requireSuperAdmin } = require('../middleware/adminAuth.middleware');

const router = express.Router();

// App-user management (including activating signups) is super-admin-only,
// matching the /users route gating already in the admin panel.
router.use(protectAdmin, requireSuperAdmin);

router.get('/', listUsers);
router.patch('/:id/status', updateUserStatus);

module.exports = router;
