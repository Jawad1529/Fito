// One-off script to create the first super admin, since there's no public
// admin signup route. Run with `npm run seed:admin`.
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin.model');
const { ROLES } = require('../constants/roles');

const run = async () => {
    await connectDB();

    const email = process.env.SEED_SUPER_ADMIN_EMAIL || 'super@Fitoo.com';
    const existing = await Admin.findOne({ email });
    if (existing) {
        console.log(`Super admin already exists: ${email}`);
        await mongoose.disconnect();
        return;
    }

    await Admin.create({
        name: 'Super Admin',
        email,
        password: process.env.SEED_SUPER_ADMIN_PASSWORD || 'password',
        role: ROLES.SUPER_ADMIN,
    });

    console.log(`Super admin created: ${email}`);
    await mongoose.disconnect();
};

run().catch((err) => {
    console.error(err);
    process.exit(1);
});
