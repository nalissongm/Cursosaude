import { useState, useEffect } from 'react';
import api from '@/lib/axios';

export interface Instructor {
  id: string;
  userId: string;
  bio?: string;
  specialty?: string;
  crm?: string;
  crmUf?: string;
  user?: {
    name: string;
  };
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image?: string;
  imageCourseUrl?: string; // New field from API
  thumbnail?: string;
  coverImage?: string;
  progress: number;
  category: string;
  duration: string;
  totalLessons: number;
  completedLessons: number;
  instructor: string | Instructor;
  status: 'in-progress' | 'completed' | 'not-started';
  lastAccessed: string;
  nextLesson?: string;
  completionDate?: string;
}

export function getCourseImage(course: Course): string {
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
  const sanitizedBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;

  if (course.imageCourseUrl) {
    return `${sanitizedBaseUrl}/uploads/courses/covers/${course.imageCourseUrl}`;
  }

  const imageUrl = course.image || course.thumbnail || course.coverImage;
  
  if (!imageUrl) return '';
  
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  const sanitizedImagePath = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`;
  return `${sanitizedBaseUrl}${sanitizedImagePath}`;
}

export function useCourses() {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        const response = await api.get<Course[]>('/courses');
        console.log('Courses API Response:', response.data);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch courses'));
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return { data, loading, error };
}
