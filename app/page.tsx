'use client';

import Hero from '@/components/home/Hero';
import Benefits from '@/components/home/Benefits';
import FeaturedClasses from '@/components/home/FeaturedClasses';
import PricingPreview from '@/components/home/PricingPreview';
import CTA from '@/components/home/CTA';
import Schedule from '@/components/home/Schedule';

export default function Home() {
  return (
    <>
      <Hero
        backgroundImage="/imgs/yogaHeroImg.jpg"
        title="Stillwater Yoga Studio"
        description="Find your inner peace and strength with our expert instructors."
        buttonText="Book Now"
        buttonHref="/classes"
      />

      <Benefits />

      <FeaturedClasses />

      <Schedule />

      <PricingPreview />

      <CTA />
    </>
  );
}
