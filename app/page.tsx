import Hero from "@/components/home/Hero";
import Benefits from "@/components/home/Benefits";
import FeaturedClasses from "@/components/home/FeaturedClasses";
import PricingPreview from "@/components/home/PricingPreview";
import CTA from "@/components/home/CTA";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Hero />

        <Benefits />

        <FeaturedClasses />

        <PricingPreview />

        <CTA />
      </main>
    </div>
  );
}
