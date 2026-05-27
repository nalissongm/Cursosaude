import { useState } from 'react';
import { Play, Clock, Award, BookOpen, Filter, Search, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as Progress from '@radix-ui/react-progress';
import { useNavigate } from 'react-router';
import { useCourses, getCourseImage } from '@/hooks/useCourses';
import { Skeleton } from './ui/skeleton';
import { Card } from './ui/card';

function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden border-[#e2e8f0] shadow-sm">
      <div className="flex flex-col md:flex-row">
        <Skeleton className="w-full md:w-80 h-48 md:h-auto aspect-video md:aspect-auto" />
        <div className="flex-1 p-6 space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-7 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full" />
          </div>
          <div className="flex justify-between items-center pt-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export function MyCoursesPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const { data: courses, loading, error } = useCourses();
  
  const handleNavigateToCourse = (courseId: string) => {
    navigate(`/courses/${courseId}`);
  };

  const filters = [
    { id: 'all', label: 'Todos os Cursos', count: courses.length },
    { id: 'in-progress', label: 'Em Andamento', count: courses.filter(c => c.status === 'in-progress').length },
    { id: 'completed', label: 'Concluídos', count: courses.filter(c => c.status === 'completed').length },
    { id: 'not-started', label: 'Não Iniciados', count: courses.filter(c => c.status === 'not-started').length },
  ];

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = selectedFilter === 'all' || course.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    totalCourses: courses.length,
    inProgress: courses.filter(c => c.status === 'in-progress').length,
    completed: courses.filter(c => c.status === 'completed').length,
    totalHours: courses.reduce((sum, c) => sum + (parseInt(c.duration) || 0), 0),
  };

  if (error) {
    return (
      <div className="p-12 text-center">
        <h2 className="text-red-600 mb-2">Erro ao carregar cursos</h2>
        <p className="text-[#64748b]">{error.message}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-[#1e40af] text-white rounded-lg"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-3">Meus Cursos</h1>
        <p className="text-[#64748b]">
          Gerencie seus cursos e acompanhe seu progresso de aprendizagem
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))
        ) : (
          <>
            <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-6 h-6" />
                <span className="text-3xl">{stats.totalCourses}</span>
              </div>
              <p className="text-sm text-blue-100">Total de Cursos</p>
            </div>

            <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Play className="w-6 h-6" />
                <span className="text-3xl">{stats.inProgress}</span>
              </div>
              <p className="text-sm text-green-100">Em Andamento</p>
            </div>

            <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-6 h-6" />
                <span className="text-3xl">{stats.completed}</span>
              </div>
              <p className="text-sm text-orange-100">Concluídos</p>
            </div>

            <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6" />
                <span className="text-3xl">{stats.totalHours}h</span>
              </div>
              <p className="text-sm text-indigo-100">Carga Horária Total</p>
            </div>
          </>
        )}
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Buscar cursos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#64748b]" />
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all cursor-pointer"
            >
              {filters.map((filter) => (
                <option key={filter.id} value={filter.id}>
                  {filter.label} ({filter.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setSelectedFilter(filter.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedFilter === filter.id
                ? 'bg-[#1e40af] text-white shadow-lg shadow-[#1e40af]/20'
                : 'bg-white text-[#64748b] border border-[#e2e8f0] hover:border-[#1e40af] hover:text-[#1e40af]'
            }`}
          >
            {filter.label}
            <span className="ml-2 opacity-75">({filter.count})</span>
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className="space-y-6">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <CourseCardSkeleton key={i} />
          ))
        ) : (
          filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
              onClick={() => handleNavigateToCourse(course.id)}
            >
              <div className="flex flex-col md:flex-row">
                {/* Course Image */}
                <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden">
                  <ImageWithFallback
                    src={getCourseImage(course)}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      course.category === 'Residência'
                        ? 'bg-[#1e40af] text-white'
                        : 'bg-[#10b981] text-white'
                    }`}>
                      {course.category}
                    </span>
                  </div>
                  {course.status === 'completed' && (
                    <div className="absolute top-4 right-4 w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  )}
                </div>

                {/* Course Content */}
                <div className="flex-1 p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-xl mb-2 font-semibold text-[#1e293b]">{course.title}</h3>
                      <p className="text-[#64748b] text-sm mb-4 line-clamp-2">{course.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-[#64748b]">
                      <Clock className="w-4 h-4" />
                      <span>{course.duration}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748b]">
                      <BookOpen className="w-4 h-4" />
                      <span>{course.totalLessons} aulas</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748b]">
                      <TrendingUp className="w-4 h-4" />
                      <span className="truncate">
                        {typeof course.instructor === 'string' 
                          ? course.instructor 
                          : course.instructor?.user?.name || (course.instructor as any)?.name || 'Professor'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[#64748b]">
                      <Clock className="w-4 h-4" />
                      <span>{course.lastAccessed}</span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {course.status !== 'not-started' && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-[#64748b]">
                          {course.status === 'completed' ? 'Concluído' : `${course.completedLessons} de ${course.totalLessons} aulas`}
                        </span>
                        <span className="text-sm font-medium text-[#1e40af]">{course.progress}%</span>
                      </div>
                      <Progress.Root className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <Progress.Indicator
                          className={`h-full transition-all duration-500 ${
                            course.progress === 100 ? 'bg-[#10b981]' : 'bg-[#1e40af]'
                          }`}
                          style={{ width: `${course.progress}%` }}
                        />
                      </Progress.Root>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex-1">
                      {course.status === 'completed' ? (
                        <div className="flex items-center gap-2 text-[#10b981]">
                          <Award className="w-5 h-5" />
                          <span className="text-sm">Concluído em {course.completionDate}</span>
                        </div>
                      ) : course.status === 'not-started' ? (
                        <span className="text-sm text-[#64748b]">Clique para começar</span>
                      ) : (
                        <span className="text-sm text-[#64748b] truncate">Próxima aula: {course.nextLesson}</span>
                      )}
                    </div>
                    
                    <button className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#1e40af]/20 font-medium">
                      {course.status === 'completed' ? 'Revisar' : course.status === 'not-started' ? 'Iniciar' : 'Continuar'}
                      <Play className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Empty State */}
      {!loading && filteredCourses.length === 0 && (
        <Card className="p-12 text-center border-[#e2e8f0]">
          <div className="w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[#64748b]" />
          </div>
          <h3 className="mb-2 text-xl font-medium">Nenhum curso encontrado</h3>
          <p className="text-[#64748b]">
            Tente ajustar sua busca ou filtros para encontrar o que procura
          </p>
        </Card>
      )}
    </div>
  );
}
