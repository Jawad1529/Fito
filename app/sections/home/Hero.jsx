// sections/home/Hero.jsx
'use client';

import { useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Image from 'next/image';
import Button from '../../components/atoms/Button';
import Icon from '../../components/atoms/Icon';
import Tag from '../../components/atoms/Tag';
import Placeholder from '../../assets/images/hero-placeholder.png';

const floatingCards = [
  { label: 'Protein Powder', icon: 'scoop', delay: 0 },
  { label: 'Protein Bars', icon: 'bar', delay: 0.2 },
  { label: 'Protein Shake', icon: 'shaker', delay: 0.4 },
  { label: 'Creatine', icon: 'bolt', delay: 0.6 },
];

const trustItems = ['Certified Nutrition Experts', 'Genuine Products', 'Fast Delivery'];

const stats = [
  { value: '500+', label: 'Diet Plans' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '4.9★', label: 'Customer Rating' },
];

const cardPositions = [
  { top: '10%', right: '-8%' },
  { top: '30%', left: '-8%' },
  { top: '50%', right: '-8%' },
  { top: '70%', left: '-8%' },
];

export default function Hero() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 });
  const rotateX = useTransform(springY, [-1, 1], [5, -5]);
  const rotateY = useTransform(springX, [-1, 1], [-5, 5]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen overflow-hidden flex items-center"
      onMouseMove={handleMouseMove}
    >
      {/* Background gradients — subtle ambient drift for a less static feel */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-black/0 to-yellow-600/5 pointer-events-none" />
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          x: [0, -25, 15, 0],
          y: [0, 15, -15, 0],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <Tag variant="outline" className="mb-5">
                <Icon name="bolt" className="w-3.5 h-3.5" />
                Premium Sports Nutrition
              </Tag>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight"
            >
              Fuel Your Goals.
              <br />
              <span className="relative inline-block text-yellow-400">
                Transform Your Body.
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={isInView ? { scaleX: 1 } : {}}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                  className="absolute left-0 -bottom-2 h-1 w-full origin-left rounded-full bg-gradient-to-r from-yellow-400 to-yellow-400/0"
                />
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-4 text-lg text-gray-300 max-w-md"
            >
              Premium supplements and personalized diet consultation designed to
              help you achieve your fitness goals.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.4 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Button variant="primary" size="lg">
                Shop Supplements
              </Button>
              <Button variant="outline" size="lg">
                Book Consultation
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.6 }}
              className="mt-8 flex flex-col sm:flex-row sm:items-center gap-3 text-gray-300 text-sm"
            >
              {trustItems.map((item, idx) => (
                <span key={idx} className="flex items-center gap-1.5">
                  <Icon name="check" className="w-4 h-4 text-yellow-400" />
                  {item}
                  {idx < trustItems.length - 1 && (
                    <span className="hidden sm:inline mx-2 text-white/20">|</span>
                  )}
                </span>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="mt-10 flex flex-wrap gap-8"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side – Illustration + Floating Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.3 }}
            style={{ perspective: 1000 }}
            className="relative flex justify-center items-center"
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
              className="relative w-full max-w-md mx-auto"
            >
              {/* Main Illustration — group-hover drives the zoom + shine sweep */}
              <div className="group relative aspect-square rounded-2xl overflow-hidden shadow-2xl ring-1 ring-yellow-400/10">
                <motion.div
                  className="absolute inset-0"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <Image
                    src={Placeholder}
                    alt="Hero Illustration"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </motion.div>

                {/* base gradient overlay — deepens slightly on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent transition-all duration-500 group-hover:from-black/35 pointer-events-none" />

                {/* diagonal shine sweep */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  <div className="absolute -inset-y-10 -left-1/2 w-1/3 -rotate-12 bg-gradient-to-r from-transparent via-yellow-100/25 to-transparent -translate-x-[150%] group-hover:translate-x-[420%] transition-transform duration-1000 ease-out" />
                </div>
              </div>

              {/* Floating Cards – entrance + gentle float */}
              {floatingCards.map((card, index) => {
                const pos = cardPositions[index];
                return (
                  <motion.div
                    key={card.label}
                    initial={{ opacity: 0, y: 30, scale: 0.85 }}
                    animate={
                      isInView
                        ? {
                            opacity: 1,
                            scale: 1,
                            y: [0, -8, 0],
                            transition: {
                              duration: 0.6,
                              delay: 0.8 + card.delay,
                              y: {
                                duration: 3 + index * 0.5,
                                repeat: Infinity,
                                ease: 'easeInOut',
                                delay: index * 0.3,
                              },
                            },
                          }
                        : {}
                    }
                    whileHover={{ scale: 1.06, borderColor: 'rgba(250, 204, 21, 0.4)' }}
                    className="absolute bg-black/70 backdrop-blur-sm border border-white/10 rounded-xl pl-2.5 pr-4 py-2 shadow-lg flex items-center gap-2.5 text-white text-sm font-medium transition-colors"
                    style={pos}
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-yellow-400/10 text-yellow-400 shrink-0">
                      <Icon name={card.icon} className="w-4 h-4" />
                    </span>
                    <span>{card.label}</span>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}