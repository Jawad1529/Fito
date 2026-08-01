'use client';

import { usePathname } from 'next/navigation';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import { TestingModeProvider } from '@/context/TestingModeContext';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Background from './Background';

const AUTH_ROUTE_PREFIXES = ['/login', '/register', '/forgot-password', '/verify-otp', '/reset-password'];

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = AUTH_ROUTE_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isAuthRoute) {
    return (
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        <TestingModeProvider>
          <AuthProvider>
            <CartProvider>
              <div className="min-h-screen flex flex-col bg-background text-text antialiased relative">
                <Background />
                <main className="flex-1">{children}</main>
              </div>
            </CartProvider>
          </AuthProvider>
        </TestingModeProvider>
      </GoogleOAuthProvider>
    );
  }

  return (
    <TestingModeProvider>
      <AuthProvider>
        <CartProvider>
          <div className="min-h-screen flex flex-col bg-background text-text antialiased relative">
            <Background />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </CartProvider>
      </AuthProvider>
    </TestingModeProvider>
  );
}
