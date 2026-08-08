import Section from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';

import Schedule from '@/components/schedule/Schedule';

export default function SchedulePage() {
  return (
    <Section>
      <Heading as="h1" size="display">
        Class Schedule
      </Heading>

      <p>Find a class that fits your schedule and your practice.</p>

      <Schedule />
    </Section>
  );
}