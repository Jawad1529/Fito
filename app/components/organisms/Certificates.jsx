// Trust/certification marquee.
//
// Was a client component purely because of `styled-jsx`; the keyframes now live
// in globals.css so this ships no JavaScript.
//
// The marquee itself is a transform animation, which the compositor handles
// without the main thread — but it used to run forever, even scrolled out of
// view. `section-defer` (content-visibility: auto) now lets the browser skip it
// entirely when off-screen, and it pauses under prefers-reduced-motion.
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
    <section className="relative py-20 section-defer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12">
        <H2>Trusted &amp; Certified</H2>
        <Text muted className="mt-3 max-w-xl mx-auto">
          Every product is third-party tested and certified to the highest industry standards, so
          you know exactly what you&apos;re putting in your body.
        </Text>
      </div>

      <div className="group overflow-hidden">
        <div className="marquee flex w-max gap-12 px-6">
          {track.map((cert, idx) => (
            <div
              key={`${cert.name}-${idx}`}
              className="flex flex-col items-center w-36 shrink-0"
              // The second copy exists only to make the loop seamless, so hide
              // it from assistive tech rather than announcing everything twice.
              aria-hidden={idx >= certificates.length ? 'true' : undefined}
            >
              <div className="relative w-24 h-24 rounded-full overflow-hidden border border-border-light bg-overlay">
                <Image
                  src={cert.img}
                  alt={cert.name}
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover"
                />
              </div>
              <span className="mt-4 text-sm text-text-muted text-center leading-snug">
                {cert.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
