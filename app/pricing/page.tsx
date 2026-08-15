import { prisma } from "@/lib/prisma";
import PricingPreview from "@/components/home/PricingPreview";

export default async function HomePage() {
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: [
      { type: "asc" },
      { priceCents: "asc" },
    ],
  });

  return (
    <>
      {/* existing homepage sections */}

      <PricingPreview />
    </>
  );
}