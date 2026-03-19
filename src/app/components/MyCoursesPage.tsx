import { useState } from 'react';
import { Play, Clock, Award, BookOpen, Filter, Search, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as Progress from '@radix-ui/react-progress';

interface MyCoursesPageProps {
  onNavigateToCourse: (courseId: string) => void;
}

export function MyCoursesPage({ onNavigateToCourse }: MyCoursesPageProps) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filters = [
    { id: 'all', label: 'Todos os Cursos', count: 6 },
    { id: 'in-progress', label: 'Em Andamento', count: 3 },
    { id: 'completed', label: 'Concluídos', count: 2 },
    { id: 'not-started', label: 'Não Iniciados', count: 1 },
  ];

  const courses = [
    {
      id: '1',
      title: 'Urgência e Emergência',
      description: 'Prepare-se para atuar em situações críticas com confiança e conhecimento técnico avançado',
      image: 'https://images.unsplash.com/photo-1758404958502-44f156617bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBtZWRpY2FsJTIwdHJhaW5pbmclMjB1cmdlbmN5fGVufDF8fHx8MTc3MTQ5NTc1NXww&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 65,
      category: 'Residência',
      duration: '32h',
      totalLessons: 42,
      completedLessons: 27,
      instructor: 'Dr. João Santos',
      status: 'in-progress',
      lastAccessed: 'Há 2 dias',
      nextLesson: 'Parada Cardiorrespiratória',
    },
    {
      id: '2',
      title: 'Terapia Intensiva',
      description: 'Domine os cuidados intensivos, ventilação mecânica e monitorização avançada de pacientes críticos',
      image: 'https://images.unsplash.com/photo-1708461859488-2a0c081ff826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlbnNpdmUlMjBjYXJlJTIwbnVyc2luZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzE0OTU3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 40,
      category: 'Residência',
      duration: '28h',
      totalLessons: 38,
      completedLessons: 15,
      instructor: 'Dra. Ana Paula',
      status: 'in-progress',
      lastAccessed: 'Há 5 dias',
      nextLesson: 'Ventilação Mecânica Invasiva',
    },
    {
      id: '3',
      title: 'Enfermagem Clínica',
      description: 'Fundamentos e práticas essenciais para o cuidado de enfermagem em diversos contextos clínicos',
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdHJhaW5pbmclMjBwcm9mZXNzaW9uYWwlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzE0MzExNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 100,
      category: 'Estágio',
      duration: '24h',
      totalLessons: 32,
      completedLessons: 32,
      instructor: 'Profa. Carla Mendes',
      status: 'completed',
      lastAccessed: 'Há 1 semana',
      completionDate: '15 de Janeiro de 2026',
    },
    {
      id: '4',
      title: 'Saúde da Mulher',
      description: 'Cuidados especializados em saúde da mulher, incluindo obstetrícia e ginecologia',
      image: 'https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZWR1Y2F0aW9uJTIwb25saW5lJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcxNDIzMDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 20,
      category: 'Estágio',
      duration: '20h',
      totalLessons: 28,
      completedLessons: 6,
      instructor: 'Dra. Beatriz Lima',
      status: 'in-progress',
      lastAccessed: 'Há 1 dia',
      nextLesson: 'Pré-natal de Baixo Risco',
    },
    {
      id: '5',
      title: 'Farmacologia Aplicada',
      description: 'Estudo aprofundado de medicamentos e suas aplicações na prática de enfermagem',
      image: 'https://images.unsplash.com/photo-1757125736482-328a3cdd9743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxudXJzZSUyMHN0dWR5aW5nJTIwbWVkaWNhbCUyMGVkdWNhdGlvbiUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzE0OTU3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 100,
      category: 'Estágio',
      duration: '20h',
      totalLessons: 25,
      completedLessons: 25,
      instructor: 'Dr. Ricardo Alves',
      status: 'completed',
      lastAccessed: 'Há 2 semanas',
      completionDate: '10 de Dezembro de 2025',
    },
    {
      id: '6',
      title: 'Pediatria e Neonatologia',
      description: 'Cuidados especializados em saúde infantil e neonatal para enfermeiros',
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdHJhaW5pbmclMjBwcm9mZXNzaW9uYWwlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzE0MzExNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 0,
      category: 'Residência',
      duration: '26h',
      totalLessons: 35,
      completedLessons: 0,
      instructor: 'Dra. Fernanda Costa',
      status: 'not-started',
      lastAccessed: 'Nunca',
      nextLesson: 'Introdução à Pediatria',
    },
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
    totalHours: courses.reduce((sum, c) => sum + parseInt(c.duration), 0),
  };

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
        {filteredCourses.map((course) => (
          <div
            key={course.id}
            className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group cursor-pointer"
            onClick={() => onNavigateToCourse(course.id)}
          >
            <div className="flex flex-col md:flex-row">
              {/* Course Image */}
              <div className="relative w-full md:w-80 h-48 md:h-auto overflow-hidden">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    course.category === 'Residência'
                      ? 'bg-[#1e40af] text-white'
                      : 'bg-[#10b981] text-white'
                  }`}>
                    {course.category}
                  </span>
                </div>
                {course.status === 'completed' && (
                  <div className="absolute top-4 right-4 w-10 h-10 bg-[#10b981] rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>

              {/* Course Content */}
              <div className="flex-1 p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-xl mb-2">{course.title}</h3>
                    <p className="text-[#64748b] text-sm mb-4">{course.description}</p>
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
                    <span>{course.instructor}</span>
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
                      <span className="text-sm text-[#1e40af]">{course.progress}%</span>
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
                <div className="flex items-center justify-between">
                  {course.status === 'completed' ? (
                    <div className="flex items-center gap-2 text-[#10b981]">
                      <Award className="w-5 h-5" />
                      <span className="text-sm">Concluído em {course.completionDate}</span>
                    </div>
                  ) : course.status === 'not-started' ? (
                    <span className="text-sm text-[#64748b]">Clique para começar</span>
                  ) : (
                    <span className="text-sm text-[#64748b]">Próxima aula: {course.nextLesson}</span>
                  )}
                  
                  <button className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all duration-200 flex items-center gap-2 shadow-lg shadow-[#1e40af]/20">
                    {course.status === 'completed' ? 'Revisar' : course.status === 'not-started' ? 'Iniciar' : 'Continuar'}
                    <Play className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-[#e2e8f0] text-center">
          <div className="w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[#64748b]" />
          </div>
          <h3 className="mb-2">Nenhum curso encontrado</h3>
          <p className="text-[#64748b]">
            Tente ajustar sua busca ou filtros para encontrar o que procura
          </p>
        </div>
      )}
    </div>
  );
}
