'use client';

import { motion } from 'framer-motion';
import { H2, Text } from '../../components/atoms/Typography';

// If you have an Icon component, you can use it.
// Otherwise, we'll use inline SVG icons for reliability and premium feel.
const FeatureIcon = ({ name }) => {
  const icons = {
    'shield-check': (
      <path d="M12 2L3 7v5c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5zm0 2.18l7 3.89v4.89c0 4.47-3.16 8.7-7 9.89-3.84-1.19-7-5.42-7-9.89V8.07l7-3.89zM12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
    ),
    'flask': (
      <path d="M19 3h-4V2H9v1H5c-.55 0-1 .45-1 1s.45 1 1 1h1.78l4.22 8.44V18H9c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1h-2v-5.56L17.22 5H19c.55 0 1-.45 1-1s-.45-1-1-1zm-3.78 2l-3.22 6.44V5h3.22z" />
    ),
    'clipboard': (
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1s-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 9H9c-.55 0-1-.45-1-1s.45-1 1-1h5c.55 0 1 .45 1 1s-.45 1-1 1zm3-4H9c-.55 0-1-.45-1-1s.45-1 1-1h8c.55 0 1 .45 1 1s-.45 1-1 1z" />
    ),
    'truck': (
      <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
    ),
    'credit-card': (
      <path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
    ),
    'headset': (
      <path d="M12 1C7.03 1 3 5.03 3 10v4c0 2.21 1.79 4 4 4h1c.55 0 1-.45 1-1v-5c0-.55-.45-1-1-1H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-3c-.55 0-1 .45-1 1v5c0 .55.45 1 1 1h1c2.21 0 4-1.79 4-4v-4c0-4.97-4.03-9-9-9z" />
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-7 h-7 text-primary"
    >
      {icons[name] || icons['shield-check']}
    </svg>
  );
};

const features = [
  {
    id: 'experts',
    icon: 'shield-check',
    title: 'Certified Nutrition Experts',
    description: 'Our team holds advanced degrees and certifications in sports nutrition.',
  },
  {
    id: 'authentic',
    icon: 'flask',
    title: '100% Authentic Supplements',
    description: 'Every product is tested for purity, potency, and safety in third‑party labs.',
  },
  {
    id: 'personalized',
    icon: 'clipboard',
    title: 'Personalized Diet Plans',
    description: 'Custom meal and supplement plans designed for your unique goals and body.',
  },
  {
    id: 'delivery',
    icon: 'truck',
    title: 'Fast Delivery',
    description: 'Express shipping with real‑time tracking so you never wait too long.',
  },
  {
    id: 'payments',
    icon: 'credit-card',
    title: 'Secure Payments',
    description: 'All transactions are encrypted and processed through trusted gateways.',
  },
  {
    id: 'support',
    icon: 'headset',
    title: 'Customer Support',
    description: 'Dedicated support team ready to assist you 7 days a week.',
  },
];

export default function WhyChooseFito() {
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
          <H2>Why Choose Fito</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            We combine science, quality, and care to deliver the best nutrition experience.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              viewport={{ once: true }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="group relative bg-overlay backdrop-blur-sm border border-border-light rounded-2xl p-6 transition-all duration-300 hover:border-primary/30 hover:bg-overlay-strong hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <FeatureIcon name={feature.icon} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-text">{feature.title}</h3>
                  <p className="mt-1 text-sm text-text-muted leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
