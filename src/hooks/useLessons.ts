import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export interface Lesson {
  id: string;
  title: string;
  contentType: 'video' | 'document';
  durationSeconds?: number;
  orderIndex: number;
  completed: boolean;
  moduleId: string;
}

export function useLessons(moduleId: string) {
  const [data, setData] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!moduleId) return;

    async function fetchLessons() {
      try {
        setLoading(true);
        const response = await api.get<Lesson[]>(`/modules/${moduleId}/lessons`);
        // Sort by orderIndex
        const sortedLessons = response.data.sort((a, b) => a.orderIndex - b.orderIndex);
        setData(sortedLessons);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lessons'));
      } finally {
        setLoading(false);
      }
    }

    fetchLessons();
  }, [moduleId]);

  return { lessons: data, loading, error };
}
