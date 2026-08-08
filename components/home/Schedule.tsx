import FeatureSplit from '@/components/layout/FeatureSplit';
import Section from '../ui/Section';

export default function Schedule() {
  return (
    <Section className="schedule">
      <FeatureSplit
        image={'/imgs/anupam-mahapatra-Vz0RbclzG_w-unsplash 1.png'}

        title="Schedule"

        description="Check out our class schedule and find the perfect time for you."

        buttonText="View"

        reverse={false}
      />
    </Section>
  );
}