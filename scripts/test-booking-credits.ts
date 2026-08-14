import { calculateCreditsRequired } from "../lib/booking-credits";

function assertEqual(actual: number, expected: number, description: string) {
  if (actual !== expected) {
    throw new Error(
      `${description}: expected ${expected}, got ${actual}`,
    );
  }

  console.log(`✓ ${description}`);
}

function assertThrows(description: string, callback: () => void) {
  try {
    callback();
  } catch {
    console.log(`✓ ${description}`);
    return;
  }

  throw new Error(`${description}: expected function to throw`);
}

function main() {
  console.log("Testing booking credit calculation...");

  assertEqual(
    calculateCreditsRequired(1, false),
    1,
    "non-member booking for 1 attendee requires 1 credit",
  );

  assertEqual(
    calculateCreditsRequired(2, false),
    2,
    "non-member booking for 2 attendees requires 2 credits",
  );

  assertEqual(
    calculateCreditsRequired(3, false),
    3,
    "non-member booking for 3 attendees requires 3 credits",
  );

  assertEqual(
    calculateCreditsRequired(1, true),
    0,
    "member booking for themselves requires 0 credits",
  );

  assertEqual(
    calculateCreditsRequired(2, true),
    1,
    "member booking with 1 guest requires 1 credit",
  );

  assertEqual(
    calculateCreditsRequired(3, true),
    2,
    "member booking with 2 guests requires 2 credits",
  );

  assertThrows(
    "zero attendees is rejected",
    () => calculateCreditsRequired(0, false),
  );

  assertThrows(
    "negative attendees are rejected",
    () => calculateCreditsRequired(-1, false),
  );

  assertThrows(
    "fractional attendees are rejected",
    () => calculateCreditsRequired(1.5, false),
  );

  console.log("Booking credit calculation tests passed.");
}

main();