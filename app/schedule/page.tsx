import Section from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

import Schedule from '@/components/schedule/Schedule';
import { getClassesForDate } from '@/lib/schedule';
import { getCurrentUser } from '@/lib/auth-server';
import { formatDateForInput } from '@/lib/date';
import { mapClassToYogaClass } from '@/lib/mappers/class';

interface SchedulePageProps {
  searchParams: Promise<{
    date?: string;
  }>;
}

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const params = await searchParams;

  const selectedDate = params.date ?? formatDateForInput(new Date());

  const user = await getCurrentUser();

  const classes = await getClassesForDate(
    selectedDate,
    user?.id,
  );

  const scheduleClasses = classes.map(mapClassToYogaClass);

  return (
    <Section>
      <Heading as="h1" size="display">
        Class Schedule
      </Heading>

      <Text>
        Find a class that fits your schedule and your practice.
      </Text>

     <Schedule
        selectedDate={selectedDate}
        classes={scheduleClasses}
        isAuthenticated={Boolean(user)}
    />
    </Section>
  );
}