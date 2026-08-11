import Section from "../ui/Section";
import Card from "../ui/Card";
import { Heading } from '../ui/Heading';
import Text from "../ui/Text";
import Button from "../ui/Button";
import Grid from "../ui/Grid";

const plans = [
  {
    name: "10 Classes Pass",
    price: "$200",
    features: [
      "Access to all classes",
      "Basic support",
    ],
    variant: "basic",
  },
  {
    name: "20 Classes Pass",
    price: "$350",
    features: [
      "Access to all classes",
      "Priority support",
      "Personalized coaching",
    ],
    variant: "premium",
  },
  {
    name: "Monthly Membership",
    price: "$120/month",
    features: [
      "Access to all classes",
      "Priority support",
      "Personalized coaching",
    ],
    variant: "premium",
  },
  {
    name: "Annual Membership",
    price: "$1320/year",
    features: [
      "Access to all classes",
      "Priority support",
      "Personalized coaching",
    ],
    variant: "premium",
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
          <Card
            key={plan.name}
            className={`pricing-card pricing-card--${plan.variant}`}
          >
            <Heading as="h3" size="h3">
              {plan.name}
            </Heading>

            <p className="pricing-card__price">
              {plan.price}
            </p>

            <ul className="pricing-card__features">
              {plan.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>

            <Button>
              Get Started
            </Button>
          </Card>
        ))}
        </Grid>
      </div>
    </Section>
  );
}

