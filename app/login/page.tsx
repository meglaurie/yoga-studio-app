import Container from '@/components/layout/Container';
import { Heading } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';
import Card from '@/components/ui/Card';

import LoginForm from '@/components/auth/LoginForm';
import Background from '@/components/ui/Background';

export default function LoginPage() {
  return (
    <>
      <Background />
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
    </>
  );
}