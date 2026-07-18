// sections/home/About.jsx
'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import Icon from '../../../components/atoms/Icon';
import Tag from '../../../components/atoms/Tag';

// Swap these for real photography/assets when available.
const coachingImage =
  'https://imgcdn.stablediffusionweb.com/2024/3/20/6c19cf22-f0a0-4c8c-ab9c-e63c909d31a6.jpg';
const labImage =
  'https://i.ebayimg.com/images/g/i14AAOSwH9lnAFas/s-l1200.jpg';
const teamMembers = [
  {
    name: 'Founder One',
    title: 'Co-Founder & Head Coach',
    image: 'https://images.squarespace-cdn.com/content/v1/5fbb9f4023132a4ab82151f6/0631ad68-a508-4903-aeab-b5303d8d0486/DSC06724-min.jpg',
    credentials: ['CISSN Certified', '10+ Yrs Coaching'],
  },
  {
    name: 'Founder Two',
    title: 'Co-Founder & Operations',
    image: 'https://images.squarespace-cdn.com/content/v1/5fbb9f4023132a4ab82151f6/0631ad68-a508-4903-aeab-b5303d8d0486/DSC06724-min.jpg',
    credentials: ['MBA', 'Supply Chain'],
  },
  {
    name: 'Nutritionist Name',
    title: 'Lead Nutritionist',
    image: 'https://images.squarespace-cdn.com/content/v1/5fbb9f4023132a4ab82151f6/0631ad68-a508-4903-aeab-b5303d8d0486/DSC06724-min.jpg',
    credentials: ['Registered Dietitian', 'PCOS Specialist'],
  },
];

const stats = [
  { value: '10,000+', label: 'Clients Coached' },
  { value: '50,000+', label: 'Orders Fulfilled' },
  { value: '4.9/5', label: 'Avg. Rating' },
];

// ---------------------------------------------------------------------
// Local icons — self-contained, currentColor
// ---------------------------------------------------------------------
function FlaskIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M10 3h4M10 3v5.4L5.6 17a2 2 0 001.8 3h9.2a2 2 0 001.8-3L14 8.4V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 15h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UsersIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3.5 19c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.5" cy="9" r="2.3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M16 14c2.4.4 4 2 4 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function TargetIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 10.5v6M7.5 7.8v.01M11 16.5v-3.6c0-1.2.9-2.1 2-2.1s2 .9 2 2.1v3.6M11 10.5v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InstagramIcon({ className }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" />
    </svg>
  );
}

const values = [
  { icon: FlaskIcon, title: 'Evidence First', description: 'Every formula is dosed to peer-reviewed research, not marketing trends.' },
  { icon: UsersIcon, title: 'One Team', description: 'Your coach and your supplement come from the same room, not separate companies.' },
  { icon: EyeIcon, title: 'Radical Transparency', description: 'Full ingredient panels and third-party test results, batch by batch.' },
  { icon: TargetIcon, title: 'Client-Led Progress', description: 'Plans adjust to your results, not a template everyone gets.' },
];

// ---------------------------------------------------------------------
// Motion
// ---------------------------------------------------------------------
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const glowShadow = { boxShadow: '0 25px 60px -20px color-mix(in srgb, var(--primary) 30%, transparent)' };

// Reusable image-left/right + content layout, local to this file.
function Row({ image, imageAlt, reverse, children }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center ${
        reverse ? 'md:[&>*:first-child]:order-2' : ''
      }`}
    >
      <motion.div
        initial="hidden"
        animate={isInView ? 'show' : 'hidden'}
        variants={fadeUp}
        style={glowShadow}
        className="relative aspect-[4/5] sm:aspect-[4/3] rounded-3xl overflow-hidden ring-1 ring-border-light"
      >
        <Image src={image} alt={imageAlt} fill unoptimized className="object-cover" />
      </motion.div>

      <motion.div initial="hidden" animate={isInView ? 'show' : 'hidden'} variants={fadeUp}>
        {children}
      </motion.div>
    </div>
  );
}

export default function About() {
  const valuesRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, amount: 0.2 });

  const founderRef = useRef(null);
  const founderInView = useInView(founderRef, { once: true, amount: 0.3 });

  return (
    <section
      id="about"
      aria-label="About us"
      className="relative py-20 sm:py-24 lg:py-28 bg-background-secondary/40 border-t border-b border-border-light"
    >
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 sm:space-y-28">
        {/* Row 1 — image left, content right */}
        <Row image={coachingImage} imageAlt="Certified coach guiding a client">
          <Tag variant="outline" className="mb-5">
            <Icon name="bolt" className="w-3.5 h-3.5" />
            One Team. One Standard.
          </Tag>

          <h2 className="text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight">
            We built what we
            <span className="bg-clip-text text-transparent bg-gradient-text">
              {' '}couldn&apos;t find.
            </span>
          </h2>

          <p className="mt-4 text-text-secondary max-w-md">
            Most brands make you choose between a coach who understands your
            body and a supplement you can actually trust. We&apos;re run by
            the same certified coaches who formulate what&apos;s on the shelf.
          </p>

          <ul className="mt-6 space-y-3">
            {['Coaches who also formulate the product', 'Nothing ships until our own team has used it'].map(
              (item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-text-secondary">
                  <Icon name="check" className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  {item}
                </li>
              )
            )}
          </ul>
        </Row>

        {/* Row 2 — image right, content left */}
        <Row image={labImage} imageAlt="In-house formulation lab" reverse>
          <h2 className="text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight">
            Radically transparent,
            <br />
            by default.
          </h2>

          <p className="mt-4 text-text-secondary max-w-md">
            Every formula is third-party lab tested, batch by batch, with
            full ingredient panels published — not buried in fine print.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold text-text font-mono">{s.value}</div>
                <div className="text-xs uppercase tracking-[0.12em] text-text-muted mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/quality"
            className="mt-7 inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:text-primary-hover transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
          >
            See our certifications and lab reports →
          </Link>
        </Row>

        {/* Team — two founders and the lead nutritionist */}
        <div ref={founderRef}>
          <div className="max-w-2xl mx-auto text-center">
            <motion.div
              initial="hidden"
              animate={founderInView ? 'show' : 'hidden'}
              variants={fadeUp}
              className="flex justify-center"
            >
              <Tag variant="outline" className="mb-5">
                <Icon name="bolt" className="w-3.5 h-3.5" />
                Led By Example
              </Tag>
            </motion.div>

            <motion.h2
              initial="hidden"
              animate={founderInView ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-text leading-tight tracking-tight"
            >
              The people behind the standard.
            </motion.h2>

            <motion.p
              initial="hidden"
              animate={founderInView ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ delay: 0.2 }}
              className="mt-4 text-text-secondary"
            >
              Founded by two coaches who got tired of recommending products
              they couldn&apos;t stand behind, and built alongside a lead
              nutritionist who makes sure every formula earns its place on
              the label.
            </motion.p>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-6 max-w-4xl mx-auto">
            {teamMembers.map((member, i) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 24 }}
                animate={founderInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              >
                <div
                  style={glowShadow}
                  className="relative aspect-[4/5] rounded-3xl overflow-hidden ring-1 ring-border-light"
                >
                  <Image src={member.image} alt={`${member.name} portrait`} fill unoptimized className="object-cover" />
                </div>

                <div className="mt-4 text-center sm:text-left">
                  <div className="text-sm font-semibold text-text">{member.name}</div>
                  <div className="text-xs text-text-muted font-mono uppercase tracking-wide mt-0.5">
                    {member.title}
                  </div>
                  <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-2">
                    {member.credentials.map((c) => (
                      <span
                        key={c}
                        className="text-[11px] font-mono uppercase tracking-wide text-primary border border-primary/30 rounded-full px-2.5 py-1"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={founderInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <a
              href="#"
              aria-label="Follow us on LinkedIn"
              className="text-text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              <LinkedinIcon className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Follow us on Instagram"
              className="text-text-muted hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded"
            >
              <InstagramIcon className="w-4 h-4" />
            </a>
          </motion.div>
        </div>

        {/* Values grid */}
        <div ref={valuesRef}>
          <div className="max-w-2xl mx-auto text-center">
            <motion.div initial="hidden" animate={valuesInView ? 'show' : 'hidden'} variants={fadeUp} className="flex justify-center">
              <Tag variant="outline" className="mb-5">
                <Icon name="bolt" className="w-3.5 h-3.5" />
                What We Stand For
              </Tag>
            </motion.div>

            <motion.h2
              initial="hidden"
              animate={valuesInView ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl font-bold text-text tracking-tight"
            >
              Four rules we don&apos;t break.
            </motion.h2>
          </div>

          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-6 max-w-5xl mx-auto">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.25 + i * 0.1 }}
                className="text-center sm:text-left"
              >
                <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary/10 text-primary mb-4">
                  <v.icon className="w-5 h-5" />
                </span>
                <h3 className="text-text font-semibold text-lg">{v.title}</h3>
                <p className="mt-2 text-sm text-text-muted leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}