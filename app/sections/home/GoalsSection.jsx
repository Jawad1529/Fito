'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { H2, Text } from '../../components/atoms/Typography';
import Image from '../../components/atoms/Image';

import heroImage from '../../assets/images/hero.png';

// Kept in sync with CONSULTATION_GOALS ids in utils/consultationConfig.js —
// clicking a card jumps straight into that goal's step in /consultation.
const goals = [
  {
    id: 'fat-loss',
    image: heroImage,
    title: 'Fat Loss',
    description: 'Lose body fat with a personalized nutrition plan.',
  },
  {
    id: 'muscle-gain',
    image: heroImage,
    title: 'Muscle Gain',
    description: 'Build lean muscle and increase strength.',
  },
  {
    id: 'body-recomposition',
    image: heroImage,
    title: 'Body Recomposition',
    description: 'Build muscle while reducing body fat.',
  },
  {
    id: 'pcos',
    image: heroImage,
    title: 'PCOS',
    description: 'Nutrition guidance for managing PCOS symptoms.',
  },
  {
    id: 'mother-wellness',
    image: heroImage,
    title: 'Mother Wellness',
    description: 'Nutrition support for pregnancy, postpartum & breastfeeding.',
  },
  {
    id: 'diabetes',
    image: heroImage,
    title: 'Diabetic Patients',
    description: 'Nutrition guidance for managing blood sugar and diabetes.',
  },
];

export default function GoalsSection() {
  const router = useRouter();

  const handleGoalClick = (goalId) => {
    router.push(`/consultation?goal=${goalId}`);
  };

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
          <H2>What&apos;s Your Goal?</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            Pick your goal and we&apos;ll drop you straight into the matching consultation flow.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal, index) => (
            <motion.button
              key={goal.id}
              type="button"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -4 }}
              onClick={() => handleGoalClick(goal.id)}
              className="relative cursor-pointer group bg-overlay backdrop-blur-sm border border-border-light rounded-2xl p-6 text-center transition-all duration-300 hover:border-primary/30 hover:bg-overlay-strong"
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14">
                  <Image
                    src={goal.image}
                    alt={goal.title}
                    fill
                    objectFit="contain"
                    rounded="rounded-full"
                  />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text">{goal.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {goal.description}
              </p>
              <div className="mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Start Consultation →
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}
