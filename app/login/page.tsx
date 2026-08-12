import Container from '@/components/layout/Container';
import Section from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto w-full max-w-md">
          <Heading as="h1" size="display">
            Welcome Back
          </Heading>

          <Text>
            Sign in to manage your classes and bookings.
          </Text>

          <LoginForm />
        </div>
      </Container>
    </Section>
  );
}