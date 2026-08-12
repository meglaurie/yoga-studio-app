import bcrypt from 'bcryptjs';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';

import { prisma } from '@/lib/prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',

      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

       if (!user) {
        return null;
        }

        const isPasswordValid = await bcrypt.compare(
        credentials.password,
        user.passwordHash,
        );

        if (!isPasswordValid) {
        return null;
        }

        return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },
};