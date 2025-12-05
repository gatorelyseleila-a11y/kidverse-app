'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export function useAuth() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';
  const isLoading = status === 'loading';
  const user = session?.user;
  const accessToken = session?.accessToken;

  const login = useCallback(
    async (email: string, password: string, redirectTo?: string) => {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      if (redirectTo) {
        router.push(redirectTo);
      }

      return result;
    },
    [router]
  );

  const logout = useCallback(
    async (redirectTo?: string) => {
      await signOut({ redirect: false });
      
      if (redirectTo) {
        router.push(redirectTo);
      } else {
        router.push('/login');
      }
    },
    [router]
  );

  const hasRole = useCallback(
    (roles: string | string[]) => {
      if (!user?.role) return false;
      
      const roleArray = Array.isArray(roles) ? roles : [roles];
      return roleArray.includes(user.role);
    },
    [user?.role]
  );

  const isAdmin = hasRole('ADMIN');
  const isDirector = hasRole(['ADMIN', 'DIRECTOR']);
  const isEducator = hasRole(['ADMIN', 'DIRECTOR', 'EDUCATOR']);
  const isParent = hasRole('PARENT');

  return {
    user,
    session,
    accessToken,
    isAuthenticated,
    isLoading,
    login,
    logout,
    update,
    hasRole,
    isAdmin,
    isDirector,
    isEducator,
    isParent,
  };
}


