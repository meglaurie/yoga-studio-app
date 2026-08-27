import Container from '@/components/layout/Container';
import { Heading } from '@/components/ui/Heading';
import Text from '@/components/ui/Text';

import RegisterForm from '@/components/auth/RegisterForm';
import Background from '@/components/ui/Background';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';

export default function RegisterPage() {
  return (
    <>
      <Background />
      <Container>
        <Heading as="h1" size="display">
          Create Your Account
        </Heading>
        <Card>
          <Text>
            Create an account to manage your classes and bookings.
          </Text>
          <RegisterForm />
        </Card>
      </Container>
      <Footer/>
    </>
  );
}