export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getMonday(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();

  const difference = day === 0 ? -6 : 1 - day;

  result.setDate(result.getDate() + difference);

  return result;
}

export function getWeekDates(date: Date): Date[] {
  const monday = getMonday(date);

  return Array.from({ length: 5 }, (_, index) => {
    const result = new Date(monday);

    result.setDate(monday.getDate() + index);

    return result;
  });
}