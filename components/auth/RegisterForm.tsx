'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import Button from '@/components/ui/Button';

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters.')
      .max(100, 'Name is too long.'),

    email: z
      .string()
      .email('Please enter a valid email address.'),

    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .max(128, 'Password is too long.'),

    confirmPassword: z
      .string()
      .min(1, 'Please confirm your password.'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords do not match.',
    path: ['confirmPassword'],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    setServerError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(
          data.error ?? 'Unable to create your account. Please try again.',
        );
        return;
      }

      router.push('/login');
    } catch {
      setServerError(
        'Unable to create your account. Please try again.',
      );
    }
  }

  return (
    <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>
      <div>
        <label className="form-label" htmlFor="name">Name</label>

        <input
          className="form-input"
          id="name"
          type="text"
          autoComplete="name"
          {...register('name')}
        />

        {errors.name && (
          <p role="alert">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="form-label" htmlFor="email">
          Email
        </label>

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
        <label className="form-label" htmlFor="password">
          Password
        </label>

        <input
          className="form-input"
          id="password"
          type="password"
          autoComplete="new-password"
          {...register('password')}
        />

        {errors.password && (
          <p role="alert">{errors.password.message}</p>
        )}
      </div>

      <div>
        <label className="form-label" htmlFor="confirmPassword">
          Confirm Password
        </label>

        <input
          className="form-input"
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          {...register('confirmPassword')}
        />

        {errors.confirmPassword && (
          <p role="alert">{errors.confirmPassword.message}</p>
        )}
      </div>

      {serverError && (
        <p role="alert">{serverError}</p>
      )}

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Creating Account...' : 'Create Account'}
      </Button>
    </form>
  );
}