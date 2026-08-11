import FeatureSplit from '@/components/layout/FeatureSplit';
import Section from '../ui/Section';

export default function Benefits() {
  return (
    <Section className="benefits">
      <FeatureSplit
        image={'/imgs/dylan-gillis-YJdCZba0TYE-unsplash 1.png'}

        imageAlt="Person practicing yoga on a mat"

        title="Benefits of Practicing Yoga"

        description="Regular yoga practice helps increase flexibility and range of motion."

        buttonText="View"

        reverse={false}
      />
    </Section>
  );
}
