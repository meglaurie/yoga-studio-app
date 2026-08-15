import Section from "../ui/Section";
import Grid from "../ui/Grid";
import { Heading } from "../ui/Heading";
import Text from "../ui/Text";
import PricingCard from "../pricing/PricingCard";

const plans = [
  {
    name: "10 Classes Pass",
    description: "Access to all classes.",
    priceCents: 20000,
    currency: "CAD",
    creditCount: 10,
  },
  {
    name: "20 Classes Pass",
    description: "More classes, more flexibility.",
    priceCents: 35000,
    currency: "CAD",
    creditCount: 20,
  },
  {
    name: "Monthly Membership",
    description: "Unlimited access to all classes.",
    priceCents: 12000,
    currency: "CAD",
    creditCount: null,
  },
  {
    name: "Annual Membership",
    description: "Unlimited access for the year.",
    priceCents: 132000,
    currency: "CAD",
    creditCount: null,
  },
];

export default function PricingPreview() {
  return (
    <Section className="pricing-preview">
      <div className="pricing-preview__header">
        <Heading as="h2" size="h2">
          Simple, Transparent Pricing
        </Heading>

        <Text>
          Choose the plan that works best for you.
        </Text>
      </div>

      <div className="pricing-preview__plans">
        <Grid columns={4}>
          {plans.map((plan) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              description={plan.description}
              priceCents={plan.priceCents}
              currency={plan.currency}
              creditCount={plan.creditCount}
            />
          ))}
        </Grid>
      </div>
    </Section>
  );
}