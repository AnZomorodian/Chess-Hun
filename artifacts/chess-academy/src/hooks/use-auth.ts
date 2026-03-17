import { create } from 'zustand';
import { useMutation, useQuery } from '@tanstack/react-query';
import { queryClient } from '@/lib/query-client';
import type { LoginRequest, RegisterRequest, UserProfile, AuthResponse } from '@shared/schema';

const TOKEN_KEY = 'chess_academy_token';

interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem(TOKEN_KEY),
  setToken: (token) => {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    set({ token });
  },
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({ token: null });
    // Clear ALL cached queries so navbar/pages update immediately
    queryClient.clear();
  },
}));

export const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (credentials: LoginRequest) => {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to login');
      }

      return res.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      setToken(data.token);
      // Immediately seed the cache so navbar shows the user right away
      queryClient.setQueryData(['/api/auth/me'], data.user);
      // Invalidate progress so it re-fetches for the logged-in user
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });
}

export function useRegister() {
  const setToken = useAuthStore((state) => state.setToken);

  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to register');
      }

      return res.json() as Promise<AuthResponse>;
    },
    onSuccess: (data) => {
      setToken(data.token);
      queryClient.setQueryData(['/api/auth/me'], data.user);
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
    },
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async (data: {
      displayName?: string;
      bio?: string;
      country?: string;
      favoriteOpening?: string;
      preferredSide?: "White" | "Black" | "Both";
      avatarColor?: string;
    }) => {
      const res = await fetch('/api/auth/profile', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update profile');
      }
      return res.json() as Promise<{ user: UserProfile }>;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/me'], data.user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      const res = await fetch('/api/auth/password', {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to change password');
      }
      return res.json() as Promise<{ success: boolean; message: string }>;
    },
  });
}

export function useUser() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: ['/api/auth/me'],
    queryFn: async () => {
      if (!token) return null;

      const res = await fetch('/api/auth/me', {
        headers: getAuthHeaders(),
      });

      if (res.status === 401) {
        useAuthStore.getState().logout();
        return null;
      }

      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json() as Promise<UserProfile>;
    },
    enabled: !!token,
    retry: false,
  });
}
