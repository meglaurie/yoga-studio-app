export interface CreditPass {
  id: string;
  remainingCredits: number;
}

export interface CreditAllocation {
  classPassId: string;
  creditsUsed: number;
}

export function allocateCredits(
  passes: CreditPass[],
  creditsRequired: number,
): CreditAllocation[] {
  if (!Number.isInteger(creditsRequired) || creditsRequired < 0) {
    throw new Error("creditsRequired must be a non-negative integer");
  }

  if (creditsRequired === 0) {
    return [];
  }

  let remaining = creditsRequired;
  const allocations: CreditAllocation[] = [];

  for (const pass of passes) {
    if (remaining === 0) {
      break;
    }

    if (
      !Number.isInteger(pass.remainingCredits) ||
      pass.remainingCredits < 0
    ) {
      throw new Error(
        `Invalid remainingCredits for class pass ${pass.id}`,
      );
    }

    if (pass.remainingCredits === 0) {
      continue;
    }

    const creditsToUse = Math.min(
      pass.remainingCredits,
      remaining,
    );

    allocations.push({
      classPassId: pass.id,
      creditsUsed: creditsToUse,
    });

    remaining -= creditsToUse;
  }

  if (remaining > 0) {
    throw new Error("Insufficient class-pass credits");
  }

  return allocations;
}