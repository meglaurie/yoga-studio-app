import Container from '@/components/layout/Container';
import Section from '@/components/ui/Section';
import { Heading } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Card from '@/components/ui/Card';

import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage() {
  return (
    <Section>
      <Container>
          <Heading as="h1" size="display">
            Welcome Back
          </Heading>
        <Card>
          <Text>
            Sign in to manage your classes and bookings.
          </Text>

          <LoginForm />
        </Card>  
      </Container>
    </Section>
  );
}