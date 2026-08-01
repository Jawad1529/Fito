import { createContext, useContext, useMemo, useState } from 'react';
import { ROLES } from '../constants/roles';

const AuthContext = createContext(null);

const STORAGE_KEY = 'Fitoo_admin_auth';

const DUMMY_ADMINS = [
    { email: 'super@Fitoo.com', password: 'password', name: 'Omar Farooq', role: ROLES.SUPER_ADMIN },
    { email: 'admin@Fitoo.com', password: 'password', name: 'Dr. Amina Farooq', role: ROLES.ADMIN },
];

const loadStoredUser = () => {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

export function AuthProvider({ children }) {
    const [user, setUser] = useState(loadStoredUser);

    const login = async (email, password) => {
        const found = DUMMY_ADMINS.find(
            (admin) => admin.email === email && admin.password === password
        );
        if (!found) {
            throw new Error('Invalid email or password');
        }
        const nextUser = { name: found.name, email: found.email, role: found.role };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
        setUser(nextUser);
        return nextUser;
    };

    const logout = () => {
        localStorage.removeItem(STORAGE_KEY);
        setUser(null);
    };

    const value = useMemo(
        () => ({
            user,
            isAuthenticated: !!user,
            isSuperAdmin: user?.role === ROLES.SUPER_ADMIN,
            login,
            logout,
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
