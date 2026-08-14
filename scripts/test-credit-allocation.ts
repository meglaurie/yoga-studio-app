import {
  allocateCredits,
  type CreditPass,
} from "../lib/credit-allocation";

function assertDeepEqual(
  actual: unknown,
  expected: unknown,
  description: string,
) {
  const actualJson = JSON.stringify(actual);
  const expectedJson = JSON.stringify(expected);

  if (actualJson !== expectedJson) {
    throw new Error(
      `${description}: expected ${expectedJson}, got ${actualJson}`,
    );
  }

  console.log(`✓ ${description}`);
}

function assertThrows(
  description: string,
  callback: () => void,
) {
  try {
    callback();
  } catch {
    console.log(`✓ ${description}`);
    return;
  }

  throw new Error(`${description}: expected function to throw`);
}

function main() {
  console.log("Testing credit allocation...");

  const passes: CreditPass[] = [
    {
      id: "pass-a",
      remainingCredits: 1,
    },
    {
      id: "pass-b",
      remainingCredits: 10,
    },
  ];

  assertDeepEqual(
    allocateCredits(passes, 3),
    [
      {
        classPassId: "pass-a",
        creditsUsed: 1,
      },
      {
        classPassId: "pass-b",
        creditsUsed: 2,
      },
    ],
    "credits are allocated across multiple passes",
  );

  assertDeepEqual(
    allocateCredits(passes, 1),
    [
      {
        classPassId: "pass-a",
        creditsUsed: 1,
      },
    ],
    "earlier pass is consumed before later pass",
  );

  assertDeepEqual(
    allocateCredits(passes, 0),
    [],
    "zero required credits produces no allocations",
  );

  assertDeepEqual(
    allocateCredits(
      [
        {
          id: "pass-a",
          remainingCredits: 0,
        },
        {
          id: "pass-b",
          remainingCredits: 5,
        },
      ],
      2,
    ),
    [
      {
        classPassId: "pass-b",
        creditsUsed: 2,
      },
    ],
    "passes with zero remaining credits are skipped",
  );

  assertThrows(
    "insufficient credits are rejected",
    () => allocateCredits(passes, 12),
  );

  assertThrows(
    "negative required credits are rejected",
    () => allocateCredits(passes, -1),
  );

  assertThrows(
    "fractional required credits are rejected",
    () => allocateCredits(passes, 1.5),
  );

  assertThrows(
    "invalid pass balance is rejected",
    () =>
      allocateCredits(
        [
          {
            id: "invalid-pass",
            remainingCredits: -1,
          },
        ],
        1,
      ),
  );

  console.log("Credit allocation tests passed.");
}

main();