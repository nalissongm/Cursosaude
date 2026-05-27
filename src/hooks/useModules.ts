import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export interface Module {
  id: string;
  title: string;
  description?: string;
  orderIndex: number;
  courseId: string;
}

export function useModules(courseId: string) {
  const [data, setData] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!courseId) return;

    async function fetchModules() {
      try {
        setLoading(true);
        const response = await api.get<Module[]>(`/courses/${courseId}/modules`);
        // Sort by orderIndex
        const sortedModules = response.data.sort((a, b) => a.orderIndex - b.orderIndex);
        setData(sortedModules);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch modules'));
      } finally {
        setLoading(false);
      }
    }

    fetchModules();
  }, [courseId]);

  return { modules: data, loading, error };
}
