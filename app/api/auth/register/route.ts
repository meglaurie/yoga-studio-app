import bcrypt from 'bcryptjs';
import { z } from 'zod';

import { prisma } from '@/lib/prisma';

const registerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters.')
    .max(100, 'Name is too long.'),

  email: z
    .string()
    .trim()
    .email('Please enter a valid email address.')
    .max(254, 'Email address is too long.'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters.')
    .max(128, 'Password is too long.'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        {
          error: result.error.issues[0]?.message ?? 'Invalid registration details.',
        },
        { status: 400 },
      );
    }

    const name = result.data.name;
    const email = result.data.email.toLowerCase();
    const password = result.data.password;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return Response.json(
        {
          error: 'An account with this email already exists.',
        },
        { status: 409 },
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      },
    });

    return Response.json(
      {
        message: 'Account created successfully.',
      },
      { status: 201 },
    );
  } catch {
    return Response.json(
      {
        error: 'Unable to create your account. Please try again.',
      },
      { status: 500 },
    );
  }
}