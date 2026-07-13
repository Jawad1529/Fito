'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { H2, Text } from '../../components/atoms/Typography';
import Icon from '../../components/atoms/Icon';

const transformations = [
  {
    id: 't1',
    name: 'Sarah Mitchell',
    age: 28,
    goal: 'Weight Loss',
    beforeWeight: 78,
    afterWeight: 62,
    duration: '4 months',
    story: 'Sarah lost 16 kg with a personalized diet plan and regular check-ins.',
    beforeImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbANoKO2axa0Y-52fSiYNJZmVp86Kgn3rxr0iT8zwtVQ&s=10',
    afterImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNpLdU91t50-j7Mt3Y-lqPk26LaJ9sCIqTCv3lsCtSdtLq_usXwQutBlWD&s=10',
  },
  {
    id: 't2',
    name: 'James Rodriguez',
    age: 34,
    goal: 'Muscle Gain',
    beforeWeight: 68,
    afterWeight: 82,
    duration: '6 months',
    story: 'James gained 14 kg of lean muscle with targeted nutrition and training.',
    beforeImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbANoKO2axa0Y-52fSiYNJZmVp86Kgn3rxr0iT8zwtVQ&s=10',
    afterImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNpLdU91t50-j7Mt3Y-lqPk26LaJ9sCIqTCv3lsCtSdtLq_usXwQutBlWD&s=10',
  },
  {
    id: 't3',
    name: 'Emily Chen',
    age: 31,
    goal: 'Healthy Lifestyle',
    beforeWeight: 72,
    afterWeight: 68,
    duration: '3 months',
    story: 'Emily transformed her habits with sustainable nutrition and daily wellness.',
    beforeImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSbANoKO2axa0Y-52fSiYNJZmVp86Kgn3rxr0iT8zwtVQ&s=10',
    afterImage: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNpLdU91t50-j7Mt3Y-lqPk26LaJ9sCIqTCv3lsCtSdtLq_usXwQutBlWD&s=10',
  },
];

export default function TransformationStories() {
  const [hoveredCard, setHoveredCard] = useState(null);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <H2>Transformation Stories</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            Real results from real people who trusted Fito to help them reach their goals.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {transformations.map((story, index) => {
            const isHovered = hoveredCard === story.id;

            return (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                onMouseEnter={() => setHoveredCard(story.id)}
                onMouseLeave={() => setHoveredCard(null)}
                className="group relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden transition-all duration-500 hover:border-yellow-400/30 hover:shadow-xl hover:shadow-yellow-400/5"
              >
                {/* Before/After Image Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  {/* Before Image (always visible) */}
                  <div className="absolute inset-0">
                    <Image
                      src={story.beforeImage}
                      alt={`${story.name} before transformation`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                      Before
                    </span>
                  </div>

                  {/* After Image (revealed on hover with clip) */}
                  <motion.div
                    className="absolute inset-0"
                    initial={{ clipPath: 'inset(0 100% 0 0)' }}
                    animate={{
                      clipPath: isHovered ? 'inset(0 0% 0 0)' : 'inset(0 100% 0 0)',
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  >
                    <Image
                      src={story.afterImage}
                      alt={`${story.name} after transformation`}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                    <span className="absolute top-3 left-3 bg-yellow-400/90 text-black text-xs font-medium px-3 py-1.5 rounded-full">
                      After
                    </span>
                  </motion.div>

                  {/* Slider handle (visible on hover) */}
                  <motion.div
                    className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 shadow-lg shadow-yellow-400/50"
                    animate={{
                      left: isHovered ? '0%' : '100%',
                    }}
                    transition={{ duration: 0.6, ease: 'easeInOut' }}
                  />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-white">{story.name}</h3>
                      <p className="text-sm text-gray-400">
                        {story.age} years • {story.goal}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-gray-400">{story.beforeWeight}kg</span>
                      <span className="text-yellow-400">→</span>
                      <span className="text-yellow-400 font-semibold">{story.afterWeight}kg</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-300 leading-relaxed">{story.story}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <span className="text-xs text-gray-400">⏱ {story.duration}</span>
                    <div className="flex items-center gap-1 text-yellow-400 text-sm">
                      <span className="font-medium">
                        {story.beforeWeight - story.afterWeight > 0
                          ? `-${story.beforeWeight - story.afterWeight}kg`
                          : `+${story.afterWeight - story.beforeWeight}kg`}
                      </span>
                      <Icon name="trending-up" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Hover instruction overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: isHovered ? 0 : 0.6 }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                >
                  <div className="bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-4 py-2 rounded-full border border-white/10">
                    Hover to see transformation →
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Text className="text-gray-300">
            Ready to write your own success story?
          </Text>
          <button className="mt-4 inline-flex items-center gap-2 text-yellow-400 font-semibold hover:text-yellow-300 transition-colors group">
            Start Your Transformation Today
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </motion.div>
      </div>
    </section>
  );
}