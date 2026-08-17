import Container from '@/components/layout/Container';
import Section from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <Section>
      <Container>
        <div className="mx-auto w-full max-w-md">
          <Heading as="h1" size="display">
            Create Your Account
          </Heading>

          <Text>
            Create an account to manage your classes and bookings.
          </Text>

          <RegisterForm />
        </div>
      </Container>
    </Section>
  );
}