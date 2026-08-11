import FeatureSplit from "../layout/FeatureSplit";
import Section from "../ui/Section";

export default function FeaturedClasses() {
  return (
    <Section className="featured-classes">
      <FeatureSplit
          image={'/imgs/jaspinder-singh-Deqn8q739DA-unsplash 1.png'}
          imageAlt="Yoga class in session"
          title="Featured Classes"
          description="Explore our most popular classes and find the perfect fit for your yoga journey."
          buttonText="View"
          reverse={true}
        />
      <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {/* Class cards will go here */}
      </div>
    </Section>
  );
}
