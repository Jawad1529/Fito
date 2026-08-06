'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { TestingModeProvider } from '@/context/TestingModeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';

// All global providers in one place.
//
// GoogleOAuthProvider used to be mounted only on auth routes, which meant
// navigating from /login to anywhere else tore it down and rebuilt it. It's
// cheap and idempotent, so it wraps everything now and the tree stays stable
// across navigations — no remounting of Auth/Cart state on route change.
export default function AppProviders({ children }) {
    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
            <TestingModeProvider>
                <AuthProvider>
                    <CartProvider>{children}</CartProvider>
                </AuthProvider>
            </TestingModeProvider>
        </GoogleOAuthProvider>
    );
}
