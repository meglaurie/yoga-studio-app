'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '@/components/ui/Button';

const loginSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid email address.'),
  password: z
    .string()
    .min(1, 'Please enter your password.'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginForm() {
const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: LoginFormValues) {
    setServerError(null);

    const result = await signIn('credentials', {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    if (!result || result.error) {
      console.log('NextAuth signIn error:', result?.error);

      if (result?.error && result.error !== 'CredentialsSignin') {
        setServerError(result.error);
      } else {
        setServerError('Invalid email or password.');
      }
      return;
    }

    router.push('/schedule');
  }

  return (
    <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="form-label" htmlFor="email">Email</label>

        <input
          className="form-input"
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
        />

        {errors.email && (
          <p role="alert">{errors.email.message}</p>
        )}
      </div>

      <div>
        <label className="form-label" htmlFor="password">Password</label>

        <input
          className="form-input"
          id="password"
          type="password"
          autoComplete="current-password"
          {...register('password')}
        />

        {errors.password && (
          <p role="alert">{errors.password.message}</p>
        )}
      </div>

      {serverError && (
        <p role="alert">{serverError}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
}