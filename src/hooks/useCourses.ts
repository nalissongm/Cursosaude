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
        // 1. Fetch enrolled courses
        const enrollmentsResponse = await api.get('/enrollments/me');
        const enrollments = enrollmentsResponse.data;

        // 2. Fetch progress for each course
        const coursesWithProgress = await Promise.all(
          enrollments.map(async (enrollment: any) => {
            const course = enrollment.course;
            try {
              const progressResponse = await api.get(`/progress/course/${course.id}`);
              const progressData = progressResponse.data;

              // Calculate status based on progress
              let status: 'not-started' | 'in-progress' | 'completed' = 'not-started';
              if (progressData.percentage === 100) {
                status = 'completed';
              } else if (progressData.percentage > 0) {
                status = 'in-progress';
              }

              return {
                ...course,
                progress: progressData.percentage || 0,
                status,
                completedLessons: progressData.completedLessons || 0,
                totalLessons: progressData.totalLessons || course.totalLessons || 0,
                lastAccessed: progressData.lastAccessedAt 
                  ? new Date(progressData.lastAccessedAt).toLocaleDateString('pt-BR') 
                  : 'Nunca acessado',
                nextLesson: progressData.nextLesson?.title || 'Próxima aula',
                completionDate: progressData.completedAt 
                  ? new Date(progressData.completedAt).toLocaleDateString('pt-BR') 
                  : undefined,
                duration: course.duration || '0h',
              } as Course;
            } catch (err) {
              console.error(`Error fetching progress for course ${course.id}:`, err);
              return {
                ...course,
                progress: 0,
                status: 'not-started',
                completedLessons: 0,
                totalLessons: course.totalLessons || 0,
                lastAccessed: 'Erro ao carregar',
                duration: course.duration || '0h',
              } as Course;
            }
          })
        );

        setData(coursesWithProgress);
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
