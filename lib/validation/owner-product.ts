import { z } from "zod";

export const productTypeEnum = z.enum([
  "DROP_IN",
  "CLASS_PASS",
  "MONTHLY_MEMBERSHIP",
  "ANNUAL_MEMBERSHIP",
]);

export type ProductType = z.infer<typeof productTypeEnum>;

const productDetailsFields = {
  name: z
    .string()
    .trim()
    .min(1, "Product name is required.")
    .max(100, "Product name must be 100 characters or fewer."),

  description: z
    .string()
    .trim()
    .max(500, "Description must be 500 characters or fewer.")
    .optional()
    .or(z.literal("")),

  priceDollars: z.coerce
    .number()
    .min(0.01, "Price must be greater than $0.")
    .max(10000, "Price cannot exceed $10,000."),

  creditCount: z.coerce
    .number()
    .int("Credits must be a whole number.")
    .min(1, "Credits must be at least 1.")
    .max(1000, "Credits cannot exceed 1000.")
    .optional(),
};

function requiresCreditCount(type: ProductType) {
  return type === "DROP_IN" || type === "CLASS_PASS";
}

function applyCreditCountRule(
  data: { creditCount?: number },
  type: ProductType,
  ctx: z.RefinementCtx,
) {
  const needsCredits = requiresCreditCount(type);

  if (needsCredits && data.creditCount === undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["creditCount"],
      message: "Credit count is required for this product type.",
    });
  }

  if (!needsCredits && data.creditCount !== undefined) {
    ctx.addIssue({
      code: "custom",
      path: ["creditCount"],
      message: "Credit count does not apply to membership products.",
    });
  }
}

export const createProductSchema = z
  .object({
    type: productTypeEnum,
    ...productDetailsFields,
  })
  .superRefine((data, ctx) => applyCreditCountRule(data, data.type, ctx));

export type CreateProductInput = z.infer<typeof createProductSchema>;

// type is intentionally NOT part of this schema — it's immutable after
// creation, so the update route builds this against the product's
// existing type rather than trusting the request body.
export function buildUpdateProductSchema(existingType: ProductType) {
  return z
    .object(productDetailsFields)
    .superRefine((data, ctx) => applyCreditCountRule(data, existingType, ctx));
}

export type UpdateProductInput = z.infer<
  ReturnType<typeof buildUpdateProductSchema>
>;