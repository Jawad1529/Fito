'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { H2, Text } from '../../components/atoms/Typography';
import Icon from '../../components/atoms/Icon';
import Button from '../../components/atoms/Button';

const goals = [
  {
    id: 'build-muscle',
    icon: 'dumbbell',
    title: 'Build Muscle',
    description: 'Boost protein synthesis and strength with targeted nutrition.',
  },
  {
    id: 'lose-fat',
    icon: 'flame',
    title: 'Lose Fat',
    description: 'Optimize metabolism and burn fat while preserving lean mass.',
  },
  {
    id: 'weight-gain',
    icon: 'scale',
    title: 'Weight Gain',
    description: 'Healthy mass gain with calorie-dense supplements and meals.',
  },
  {
    id: 'healthy-lifestyle',
    icon: 'heart',
    title: 'Healthy Lifestyle',
    description: 'Daily wellness, immune support, and balanced nutrition.',
  },
  {
    id: 'endurance',
    icon: 'shoe',
    title: 'Endurance',
    description: 'Sustained energy and recovery for athletes and runners.',
  },
];

export default function     GoalsSection() {
  const [selectedGoal, setSelectedGoal] = useState(null);

  const handleGoalClick = (goalId) => {
    setSelectedGoal(goalId);
    // In a real implementation, you would filter products and update the UI.
    // For now, we log and could navigate to a filtered page.
    console.log('Selected goal:', goalId);
    // Example: router.push(`/products?goal=${goalId}`);
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
          <H2>What's Your Goal?</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            Select your fitness objective and we'll recommend the perfect
            supplements and consultation plan tailored to you.
          </Text>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {goals.map((goal, index) => (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.03, y: -4 }}
              onClick={() => handleGoalClick(goal.id)}
              className={`
                relative cursor-pointer group
                bg-overlay backdrop-blur-sm
                border rounded-2xl p-6 text-center
                transition-all duration-300
                ${
                  selectedGoal === goal.id
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/10'
                    : 'border-border-light hover:border-primary/30 hover:bg-overlay-strong'
                }
              `}
            >
              <div className="flex justify-center mb-4">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary/20 transition-colors">
                  <Icon name={goal.icon} className="w-7 h-7" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-text">{goal.title}</h3>
              <p className="mt-2 text-sm text-text-muted leading-relaxed">
                {goal.description}
              </p>
              <div className="mt-4 text-primary text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                Explore Products →
              </div>
            </motion.div>
          ))}
        </div>

        {selectedGoal && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-12 text-center"
          >
            <Text>
              Showing recommendations for{' '}
              <span className="text-primary font-semibold">
                {goals.find((g) => g.id === selectedGoal)?.title}
              </span>
            </Text>
            <Button variant="primary" size="lg" className="mt-4">
              View Consultation Plans
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
