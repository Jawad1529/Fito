import Hero from '@/sections/home/Hero';
import Certificates from '@/components/organisms/Certificates';
import GoalsSection from '@/sections/home/GoalsSection';
import FeaturedProducts from '@/components/organisms/FeaturedProducts';
import WhyChooseFito from '@/sections/home/WhyChooseFito';
import ConsultationCTA from '@/sections/home/ConsultationCTA';
import TransformationStories from '@/sections/home/TransformationStories';
import LatestArticles from '@/sections/home/LatestArticles';
import NewsLetterCTA from '@/sections/home/NewsLetter';

// Navbar deliberately not rendered here — MainLayout already provides it for
// every non-auth route. This page was mounting a second one on top of it,
// which meant two fixed headers, two cart subscriptions, and two scroll
// listeners stacked at z-50.
export default function HomePage() {
  return (
    <>
      <Hero />
      <Certificates />
      <GoalsSection />
      <FeaturedProducts />
      <WhyChooseFito />
      <ConsultationCTA />
      <TransformationStories />
      <LatestArticles />
      <NewsLetterCTA />
    </>
  );
}