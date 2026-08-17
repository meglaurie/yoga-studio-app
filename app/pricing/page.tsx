import Section from '@/components/ui/Section';
import Grid from '@/components/ui/Grid';
import { Heading } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import PricingCard from '@/components/pricing/PricingCard';
import { prisma } from '@/lib/prisma';

export default async function PricingPage() {
  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    orderBy: [
      {
        type: 'asc',
      },
      {
        priceCents: 'asc',
      },
    ],
  });

  return (
    <main>
      <Section>
        <div className="pricing-page__header">
          <Heading as="h1" size="h1">
            Pricing
          </Heading>

          <Text>
            Choose the plan that works best for you.
          </Text>
        </div>

        <div className="pricing-page__plans">
          <Grid columns={4}>
            {products.map((product) => (
              <PricingCard
                key={product.id}
                id={product.id}
                name={product.name}
                description={product.description}
                priceCents={product.priceCents}
                currency={product.currency}
                creditCount={product.creditCount}
              />
            ))}
          </Grid>
        </div>
      </Section>
    </main>
  );
}