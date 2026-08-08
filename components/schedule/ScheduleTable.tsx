import { scheduleData } from '@/components/data/scheduleData';

interface ScheduleTableProps {
  selectedDate: string;
}

export default function ScheduleTable({
  selectedDate,
}: ScheduleTableProps) {
  const classes = scheduleData.filter(
    (classItem) => classItem.date === selectedDate,
  );

  return (
    <section>
      <h2>Classes</h2>

      {classes.length === 0 ? (
        <p>No classes are scheduled for this day.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Time</th>
              <th>Class</th>
              <th>Instructor</th>
              <th>Duration</th>
              <th>Availability</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {classes.map((classItem) => {
              const spotsRemaining =
                classItem.capacity - classItem.booked;

              return (
                <tr key={classItem.id}>
                  <td>{classItem.time}</td>

                  <td>{classItem.title}</td>

                  <td>{classItem.instructor}</td>

                  <td>{classItem.duration}</td>

                  <td>
                    {spotsRemaining > 0
                      ? `${spotsRemaining} spots`
                      : 'Full'}
                  </td>

                  <td>
                    <button type="button">
                      Login
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}