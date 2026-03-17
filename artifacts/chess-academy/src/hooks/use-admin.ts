import { create } from "zustand";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/query-client";

const ADMIN_TOKEN_KEY = "chess_academy_admin_token";

interface AdminState {
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  token: sessionStorage.getItem(ADMIN_TOKEN_KEY),
  setToken: (token) => {
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    }
    set({ token });
  },
  logout: () => {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY);
    set({ token: null });
    queryClient.removeQueries({ queryKey: ["/api/admin/users"] });
    queryClient.removeQueries({ queryKey: ["/api/admin/stats"] });
  },
}));

export const getAdminHeaders = () => {
  const token = useAdminStore.getState().token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export function useAdminLogin() {
  const setToken = useAdminStore((state) => state.setToken);
  return useMutation({
    mutationFn: async (creds: { username: string; password: string }) => {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(creds),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Invalid admin credentials");
      }
      return res.json() as Promise<{ token: string; role: string }>;
    },
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}

export function useAdminUsers() {
  const token = useAdminStore((state) => state.token);
  return useQuery({
    queryKey: ["/api/admin/users"],
    queryFn: async () => {
      const res = await fetch("/api/admin/users", {
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json() as Promise<{
        users: {
          id: string;
          username: string;
          email: string;
          displayName: string;
          level: string;
          rating: number;
          lessonsCompleted: number;
          openingsStudied: number;
          joinedAt: string;
        }[];
        total: number;
      }>;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useAdminStats() {
  const token = useAdminStore((state) => state.token);
  return useQuery({
    queryKey: ["/api/admin/stats"],
    queryFn: async () => {
      const res = await fetch("/api/admin/stats", {
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Unauthorized");
      return res.json() as Promise<{
        totalUsers: number;
        avgRating: number;
        levelCounts: Record<string, number>;
        totalLessonsCompleted: number;
        totalOpeningsStudied: number;
        bannedUsers: number;
      }>;
    },
    enabled: !!token,
    retry: false,
  });
}

export function useAdminDeleteUser() {
  const qc = queryClient;
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete user");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });
}

export function useAdminBanUser() {
  const qc = queryClient;
  return useMutation({
    mutationFn: async ({ userId, reason }: { userId: string; reason?: string }) => {
      const res = await fetch(`/api/admin/users/${userId}/ban`, {
        method: "POST",
        headers: getAdminHeaders(),
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error("Failed to ban user");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });
}

export function useAdminUnbanUser() {
  const qc = queryClient;
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}/unban`, {
        method: "POST",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to unban user");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
      qc.invalidateQueries({ queryKey: ["/api/admin/stats"] });
    },
  });
}

export function useAdminResetProgress() {
  const qc = queryClient;
  return useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch(`/api/admin/users/${userId}/reset-progress`, {
        method: "POST",
        headers: getAdminHeaders(),
      });
      if (!res.ok) throw new Error("Failed to reset progress");
      return res.json();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
  });
}
