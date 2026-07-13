'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../atoms/Icon';
import Button from '../atoms/Button';
import Badge from '../atoms/Badge';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Categories', href: '/categories' },
  { label: 'Consultation', href: '/consultation' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contact', href: '/contact' },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <>
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
          isScrolled ? 'bg-black/80 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="text-2xl font-bold text-white tracking-tight shrink-0">
              Fito
            </Link>

            {/* Desktop nav — only from lg up, so tablets don't get crammed */}
            <div className="hidden lg:flex items-center space-x-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="relative text-white/80 hover:text-white px-3 py-2 text-sm font-medium transition-colors group"
                >
                  {link.label}
                  <span
                    className={`absolute left-0 right-0 bottom-0 h-0.5 bg-yellow-400 origin-left transition-transform ${
                      link.label === 'Home' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                    }`}
                  />
                </Link>
              ))}
            </div>

            {/* Right side */}
            <div className="hidden lg:flex items-center space-x-5">
              <button aria-label="Search" className="text-white/70 hover:text-white transition-colors">
                <Icon name="search" className="w-5 h-5" />
              </button>
              <Badge count={3}>
                <button aria-label="Notifications" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="bell" className="w-5 h-5" />
                </button>
              </Badge>
              <Badge count={2}>
                <button aria-label="Cart" className="text-white/70 hover:text-white transition-colors">
                  <Icon name="cart" className="w-5 h-5" />
                </button>
              </Badge>
              <Link href="/login">
                <Button variant="primary" icon={<Icon name="login" className="w-4 h-4" />}>
                  Login
                </Button>
              </Link>
            </div>

            {/* Compact controls below lg: search + menu only */}
            <div className="flex lg:hidden items-center space-x-4">
              <button aria-label="Search" className="text-white/70 hover:text-white transition-colors">
                <Icon name="search" className="w-5 h-5" />
              </button>
              <button aria-label="Open menu" className="text-white" onClick={() => setMobileOpen(true)}>
                <Icon name="menu" className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile / tablet menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed top-0 right-0 z-50 h-full w-[280px] max-w-[85vw] bg-black lg:hidden"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex justify-end mb-6">
                  <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-white">
                    <Icon name="close" className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex flex-col space-y-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="text-white/80 hover:text-white text-lg font-medium transition-colors border-b border-white/10 py-3"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>

                <div className="flex items-center space-x-5 pt-5">
                  <Badge count={3}>
                    <button aria-label="Notifications" className="text-white/70 hover:text-white">
                      <Icon name="bell" className="w-5 h-5" />
                    </button>
                  </Badge>
                  <Badge count={2}>
                    <button aria-label="Cart" className="text-white/70 hover:text-white">
                      <Icon name="cart" className="w-5 h-5" />
                    </button>
                  </Badge>
                </div>

                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button
                    variant="primary"
                    icon={<Icon name="login" className="w-4 h-4" />}
                    fullWidth
                    className="mt-6"
                  >
                    Login
                  </Button>
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}