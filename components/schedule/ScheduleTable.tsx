import Link from 'next/link';

import Button from '@/components/ui/Button';
import BookingButton from './BookingButton';

import { YogaClass } from '@/types/class';

interface ScheduleTableProps {
  classes: YogaClass[];
  isAuthenticated: boolean;
}

export default function ScheduleTable({
  classes,
  isAuthenticated,
}: ScheduleTableProps) {
  if (classes.length === 0) {
    return (
      <div className="schedule-table__empty">
        <p>No classes are scheduled for this day.</p>
      </div>
    );
  }

  return (
    <div className="schedule-table__wrapper">
      <table className="schedule-table">
        <thead>
          <tr>
            <th scope="col">Time</th>
            <th scope="col">Class</th>
            <th scope="col">Instructor</th>
            <th scope="col">Level</th>
            <th scope="col">Availability</th>
            <th scope="col">
              <span className="sr-only">Booking action</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {classes.map((yogaClass) => {
            const spotsRemaining =
              yogaClass.capacity - yogaClass.booked;

            const isFull = spotsRemaining <= 0;

            return (
              <tr key={yogaClass.id}>
                <td>
                  <span>{yogaClass.startTime}</span>

                  <span className="schedule-table__time-end">
                    {yogaClass.endTime}
                  </span>
                </td>

                <td>
                  <strong>{yogaClass.name}</strong>
                </td>

                <td>{yogaClass.instructor}</td>

                <td>{yogaClass.level}</td>

                <td>
                  {isFull ? 'Full' : `${spotsRemaining} spots`}
                </td>

                <td>
                  {isFull ? (
                    <Button variant="outline" disabled>
                      Full
                    </Button>
                  ) : isAuthenticated ? (
                    <BookingButton
                      classId={yogaClass.id}
                      isBooked={yogaClass.isBooked}
                      bookingId={yogaClass.bookingId}
                    />
                  ) : (
                    <Link
                      href="/login?callbackUrl=/schedule"
                      className="schedule-table__login-link"
                    >
                      Login
                    </Link>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}