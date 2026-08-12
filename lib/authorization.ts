import { getCurrentUser } from '@/lib/auth-server';

export async function requireUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error('UNAUTHENTICATED');
  }

  return user;
}

export async function requireOwner() {
  const user = await requireUser();

  if (user.role !== 'OWNER') {
    throw new Error('FORBIDDEN');
  }

  return user;
}