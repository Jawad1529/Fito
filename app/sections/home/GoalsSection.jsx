import Link from 'next/link';
import Image from 'next/image';
import { H2, Text } from '../../components/atoms/Typography';

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

// No 'use client' — the cards are links, not buttons with JS handlers, so this
// whole section ships zero JavaScript. Links also prefetch and work on
// middle-click, which router.push never did.
export default function GoalsSection() {
  return (
    <section className="relative py-20 section-defer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <H2>What&apos;s Your Goal?</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            Pick your goal and we&apos;ll drop you straight into the matching consultation flow.
          </Text>
        </div>

        {/* Reveal + hover are pure CSS now. Six framer-motion nodes with
            staggered whileInView meant six JS-driven animations competing with
            the scroll on the main thread. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 reveal">
          {goals.map((goal) => (
            <Link
              key={goal.id}
              href={`/consultation?goal=${goal.id}`}
              className="relative block group glass border border-border-light rounded-2xl p-6 text-center hover-lift hover-lift-sm hover:border-primary/30"
            >
              <div className="flex justify-center mb-4">
                {/* Static import, so next/image knows the intrinsic size and
                    generates a blur placeholder at build time — no need for the
                    client-side skeleton wrapper in atoms/Image. `alt=""`
                    because the heading right below already names the goal. */}
                <Image
                  src={goal.image}
                  alt=""
                  width={56}
                  height={56}
                  placeholder="blur"
                  className="w-14 h-14 rounded-full object-contain"
                />
              </div>
              <h3 className="text-lg font-semibold text-text">{goal.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">{goal.description}</p>
              <div className="mt-4 text-primary text-sm font-medium md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                Start Consultation →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
