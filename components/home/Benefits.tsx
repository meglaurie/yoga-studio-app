import FeatureSplit from '@/components/layout/FeatureSplit';

export default function Benefits() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-16">
      <FeatureSplit
        image={'/imgs/dylan-gillis-YJdCZba0TYE-unsplash 1.png'}

        title="Benefits of Practicing Yoga"

        description="Regular yoga practice helps increase flexibility and range of motion."

        buttonText="View"

        reverse={false}
      />
    </section>
  );
}
