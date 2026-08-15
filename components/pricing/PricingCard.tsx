import Card from "../ui/Card";
import { Heading } from "../ui/Heading";
import Text from "../ui/Text";
import Button from "../ui/Button";

interface PricingCardProps {
  name: string;
  description?: string | null;
  priceCents: number;
  currency: string;
  creditCount?: number | null;
}

function formatPrice(priceCents: number, currency: string) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency,
  }).format(priceCents / 100);
}

export default function PricingCard({
  name,
  description,
  priceCents,
  currency,
  creditCount,
}: PricingCardProps) {
  return (
    <Card className="pricing-card">
      <Heading as="h2" size="h3">
        {name}
      </Heading>

      {description && <Text>{description}</Text>}

      <p className="pricing-card__price">
        {formatPrice(priceCents, currency)}
      </p>

      {creditCount !== null && creditCount !== undefined && (
        <p className="pricing-card__credits">
          {creditCount} {creditCount === 1 ? "class" : "classes"}
        </p>
      )}

      <Button type="button">
        Get Started
      </Button>
    </Card>
  );
}