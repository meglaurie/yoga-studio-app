import Section from '../ui/Section';
import Container from '../layout/Container';
import Button from '../ui/Button';
import Stack from '../layout/Stack';
import Link from 'next/link';
import { Heading } from '../ui/Heading';

interface HeroProps {
  backgroundImage: string;

  title: string;

  subtitle?: string;

  description: string;

  buttonText?: string;

  buttonHref?: string;
}

export default function Hero({
  backgroundImage,

  title,

  subtitle,

  description,

  buttonText,

  buttonHref,
}: HeroProps) {
  return (
    <Section className="hero">
      <div
        className="hero__background"

        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      />

      <div className="hero__overlay" />

      <Container>
        <div className="hero__content">
          <Stack size="lg">
            <Heading as="h1" size="display">
              {title}
            </Heading>

            {subtitle && (
              <Heading as="h2" size="h2">
                {subtitle}
              </Heading>
            )}

            <p>{description}</p>

            {buttonText && buttonHref && (
              <Link href={buttonHref}>
                <Button>{buttonText}</Button>
              </Link>
            )}
          </Stack>
        </div>
      </Container>
    </Section>
  );
}
