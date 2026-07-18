'use client';

import { motion, useReducedMotion } from 'framer-motion';

export default function Background() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      {/* Brand wash — background fading into primary, per design tokens */}
      <div className="absolute inset-0 bg-gradient-brand opacity-20" />

      {/* Large glow – centered */}
      <motion.div
        animate={reduceMotion ? {} : { x: [0, 30, -20, 0], y: [0, -20, 20, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl"
      />

      {/* Smaller glow – top right */}
      <motion.div
        animate={reduceMotion ? {} : { x: [0, -25, 15, 0], y: [0, 15, -15, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-primary/10 rounded-full blur-3xl"
      />

      {/* Precision grid — defined once in globals.css, shared app-wide */}
      <div className="absolute inset-0 opacity-[0.1] bg-grid-pattern" />
    </div>
  );
}