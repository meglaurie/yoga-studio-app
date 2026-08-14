export function calculateCreditsRequired(
  attendeeCount: number,
  hasActiveMembership: boolean,
): number {
  if (!Number.isInteger(attendeeCount) || attendeeCount < 1) {
    throw new Error("attendeeCount must be a positive integer");
  }

  if (hasActiveMembership) {
    return attendeeCount - 1;
  }

  return attendeeCount;
}