// sections/home/Certificates.jsx
'use client';

import Image from 'next/image';
import { H2, Text } from '../../components/atoms/Typography';

const certificates = [
  { name: 'GMP Certified', img: 'https://placehold.co/160x160/111111/facc15?text=GMP' },
  { name: 'Informed-Sport Certified', img: 'https://placehold.co/160x160/111111/facc15?text=IS' },
  { name: 'NSF Certified for Sport', img: 'https://placehold.co/160x160/111111/facc15?text=NSF' },
  { name: 'ISO 9001:2015', img: 'https://placehold.co/160x160/111111/facc15?text=ISO' },
  { name: 'Non-GMO Project Verified', img: 'https://placehold.co/160x160/111111/facc15?text=NON-GMO' },
  { name: 'Halal Certified', img: 'https://placehold.co/160x160/111111/facc15?text=HALAL' },
  { name: 'Vegan Society Approved', img: 'https://placehold.co/160x160/111111/facc15?text=VEGAN' },
  { name: 'Gluten-Free Certified', img: 'https://placehold.co/160x160/111111/facc15?text=GF' },
];

// Duplicate the list once so the marquee can loop seamlessly at -50%.
const track = [...certificates, ...certificates];

export default function Certificates() {
  return (
    <section className="relative py-20 overflow-hidden ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <H2>Trusted &amp; Certified</H2>
        <Text muted className="mt-3 max-w-xl mx-auto">
          Every product is third-party tested and certified to the highest
          industry standards, so you know exactly what you're putting in your body.
        </Text>
      </div>

      {/* fade the track out at both edges instead of a hard cut */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24  z-10" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 z-10" />

      <div className="group overflow-hidden">
        <div className="flex w-max animate-marquee gap-12 px-6 group-hover:[animation-play-state:paused]">
          {track.map((cert, idx) => (
            <div key={`${cert.name}-${idx}`} className="flex flex-col items-center w-36 shrink-0">
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-white/10 bg-white/5 transition-colors hover:border-yellow-400/40">
                <Image src={cert.img} alt={cert.name} fill unoptimized className="object-cover" />
              </div>
              <span className="mt-4 text-sm text-gray-400 text-center leading-snug">
                {cert.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}</style>
    </section>
  );
}