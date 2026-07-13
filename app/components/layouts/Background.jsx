'use client';

import { motion } from 'framer-motion';

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">  {/* ← z-0 instead of -z-10 */}
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-black/0 to-yellow-600/5" />

      {/* Large glowing circle – centered */}
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-3xl"
      />

      {/* Smaller glowing circle – top right */}
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 15, -15, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-3xl"
      />
    </div>
  );
}