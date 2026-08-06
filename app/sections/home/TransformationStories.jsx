// Static section. The before/after reveal is CSS-only now, so this needs no
// state, no framer-motion, and no client bundle.
import Image from 'next/image';
import Link from 'next/link';
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
  return (
    <section className="relative py-20 section-defer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 reveal">
          <H2>Transformation Stories</H2>
          <Text muted className="mt-3 max-w-xl mx-auto">
            Real results from real people who trusted Fito to help them reach their goals.
          </Text>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
          {transformations.map((story) => {
            const delta = story.beforeWeight - story.afterWeight;

            return (
              <div
                key={story.id}
                className="story group relative glass border border-border-light rounded-2xl overflow-hidden hover-lift hover-lift-sm hover:border-primary/30"
              >
                {/* Before/After Image Container */}
                <div className="relative w-full aspect-[4/5] overflow-hidden">
                  {/* Before — always visible underneath */}
                  <div className="absolute inset-0">
                    <Image
                      src={story.beforeImage}
                      alt={`${story.name} before transformation`}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-background/20" />
                    <span className="absolute top-3 left-3 glass-strong text-text text-xs font-medium px-3 py-1.5 rounded-full">
                      Before
                    </span>
                  </div>

                  {/* After — wiped in on hover.
                      clip-path via a CSS transition instead of framer-motion:
                      the old version drove clipPath off React state, so every
                      frame of the 600ms wipe was a React render plus a full
                      image repaint. Also gated behind a hover-capable pointer,
                      since on touch it just flashed. */}
                  <div className="story-after absolute inset-0">
                    <Image
                      src={story.afterImage}
                      alt={`${story.name} after transformation`}
                      fill
                      unoptimized
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-background/20" />
                    <span className="absolute top-3 left-3 bg-primary/90 text-text-inverse text-xs font-medium px-3 py-1.5 rounded-full">
                      After
                    </span>
                  </div>

                  {/* Wipe edge */}
                  <div className="story-handle absolute top-0 bottom-0 w-0.5 bg-primary shadow-lg shadow-primary/50" />
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-text">{story.name}</h3>
                      <p className="text-sm text-text-muted">
                        {story.age} years • {story.goal}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <span className="text-text-muted">{story.beforeWeight}kg</span>
                      <span className="text-primary">→</span>
                      <span className="text-primary font-semibold">{story.afterWeight}kg</span>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary leading-relaxed">{story.story}</p>

                  <div className="flex items-center justify-between pt-2 border-t border-border-light">
                    <span className="text-xs text-text-muted">⏱ {story.duration}</span>
                    <div className="flex items-center gap-1 text-primary text-sm">
                      <span className="font-medium">
                        {delta > 0 ? `-${delta}kg` : `+${Math.abs(delta)}kg`}
                      </span>
                      <Icon name="trending-up" className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Hover hint — only rendered for hover-capable pointers, since
                    "Hover to see transformation" is meaningless on a phone. */}
                <div className="story-hint absolute inset-0 pointer-events-none hidden md:flex items-center justify-center">
                  <div className="glass-strong text-text text-xs font-medium px-4 py-2 rounded-full border border-border-light">
                    Hover to see transformation →
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12 reveal">
          <Text className="text-text-secondary">Ready to write your own success story?</Text>
          <Link
            href="/consultation"
            className="mt-4 inline-flex items-center gap-2 text-primary font-semibold hover:text-primary-hover transition-colors group"
          >
            Start Your Transformation Today
            <span className="transition-transform md:group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
