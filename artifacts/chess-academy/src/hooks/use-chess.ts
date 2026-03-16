import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAuthHeaders } from './use-auth';
import type { Opening, Lesson, UserProgress, UpdateProgressRequest } from '@shared/schema';

// Openings
export function useOpenings() {
  return useQuery({
    queryKey: ['/api/openings'],
    queryFn: async () => {
      const res = await fetch('/api/openings');
      if (!res.ok) throw new Error('Failed to fetch openings');
      return res.json() as Promise<Opening[]>;
    },
  });
}

export function useOpening(id: string) {
  return useQuery({
    queryKey: ['/api/openings', id],
    queryFn: async () => {
      const res = await fetch(`/api/openings/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch opening');
      return res.json() as Promise<Opening>;
    },
    enabled: !!id,
  });
}

// Lessons
export function useLessons() {
  return useQuery({
    queryKey: ['/api/lessons'],
    queryFn: async () => {
      const res = await fetch('/api/lessons');
      if (!res.ok) throw new Error('Failed to fetch lessons');
      return res.json() as Promise<Lesson[]>;
    },
  });
}

export function useLesson(id: string) {
  return useQuery({
    queryKey: ['/api/lessons', id],
    queryFn: async () => {
      const res = await fetch(`/api/lessons/${id}`);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error('Failed to fetch lesson');
      return res.json() as Promise<Lesson>;
    },
    enabled: !!id,
  });
}

// Progress
export function useProgress() {
  return useQuery({
    queryKey: ['/api/progress'],
    queryFn: async () => {
      const res = await fetch('/api/progress', {
        headers: getAuthHeaders(),
      });
      if (res.status === 401) throw new Error('Unauthorized');
      if (!res.ok) throw new Error('Failed to fetch progress');
      return res.json() as Promise<UserProgress>;
    },
    retry: false,
  });
}

export function useUpdateProgress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateProgressRequest) => {
      const res = await fetch('/api/progress', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update progress');
      return res.json() as Promise<UserProgress>;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/progress'] });
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
    },
  });
}
