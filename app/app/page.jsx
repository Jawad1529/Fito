import Navbar from '@/components/organisms/Navbar';
import Hero from '@/sections/home/Hero';
import Certificates from '@/components/organisms/Certificates';
import GoalsSection from '@/sections/home/GoalsSection';
import FeaturedProducts from '@/components/organisms/FeaturedProducts';
import WhyChooseFitoo from '@/sections/home/WhyChooseFitoo';
import ConsultationCTA from '@/sections/home/ConsultationCTA';
import TransformationStories from '@/sections/home/TransformationStories';
import LatestArticles from '@/sections/home/LatestArticles';
import NewsLetterCTA from '@/sections/home/NewsLetter';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <Hero />
   <Certificates/>
   <GoalsSection />
   <FeaturedProducts/>
   <WhyChooseFitoo />
   <ConsultationCTA/>
   <TransformationStories />
   <LatestArticles />
   <NewsLetterCTA/>
    </>
  );
}