// App user account status. Kept in sync with the values already used by
// the admin panel's app-users table (admin/src/data/appUsers.js).
const USER_STATUS = Object.freeze({
    INACTIVE: 'inactive',
    ACTIVE: 'active',
    BLOCKED: 'blocked',
});

module.exports = { USER_STATUS };
