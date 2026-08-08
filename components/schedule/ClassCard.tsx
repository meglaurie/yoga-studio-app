import Card from '@/components/ui/Card';
import { Heading } from '@/components/ui/Heading';

interface ClassCardProps {
  title: string;
  description: string;
  instructor: string;
  time: string;
  duration: string;
  capacity: number;
}

export default function ClassCard({
  title,
  description,
  instructor,
  time,
  duration,
  capacity,
}: ClassCardProps) {
  return (
    <Card>
      <Heading as="h3" size="h3">
        {title}
      </Heading>

      <p>{description}</p>

      <div>
        <p>{time}</p>
        <p>{duration}</p>
        <p>Instructor: {instructor}</p>
        <p>{capacity} spots</p>
      </div>
    </Card>
  );
}