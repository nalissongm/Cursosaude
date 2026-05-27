import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export interface LessonDetail {
  id: string;
  title: string;
  description: string;
  duration: string;
  completed: boolean;
  moduleId: string;
  contentType: 'video' | 'document';
  videoUrl?: string; // Mux Playback ID
  attachments?: Array<{ name: string; size: string }>;
}

export function useLessonDetail(lessonId: string) {
  const [data, setData] = useState<LessonDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!lessonId) return;

    async function fetchLessonDetail() {
      try {
        setLoading(true);
        const response = await api.get<LessonDetail>(`/lessons/${lessonId}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch lesson detail'));
      } finally {
        setLoading(false);
      }
    }

    fetchLessonDetail();
  }, [lessonId]);

  return { data, loading, error };
}
