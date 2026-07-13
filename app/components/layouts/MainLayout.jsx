'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/organisms/Navbar';
import Footer from '@/components/organisms/Footer';
import Background from './Background';

export default function MainLayout({ children }) {
  const pathname = usePathname();
  const isAuthRoute = pathname.startsWith('/login') || pathname.startsWith('/register') || pathname.startsWith('/forgot-password');

  if (isAuthRoute) {
    
    return (
      <div className="min-h-screen flex flex-col bg-black text-white antialiased selection:bg-yellow-400 selection:text-black relative">
        <Background />
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-black text-white antialiased selection:bg-yellow-400 selection:text-black relative">
      <Background />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}