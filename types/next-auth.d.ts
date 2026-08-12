import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: 'MEMBER' | 'OWNER';
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    role: 'MEMBER' | 'OWNER';
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'MEMBER' | 'OWNER';
  }
}