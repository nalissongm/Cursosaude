import { Play, Clock, TrendingUp } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import * as Progress from '@radix-ui/react-progress';

interface DashboardProps {
  userName: string;
  onNavigateToCourse: (courseId: string) => void;
}

export function Dashboard({ userName, onNavigateToCourse }: DashboardProps) {
  const courses = [
    {
      id: '1',
      title: 'Urgência e Emergência',
      image: 'https://images.unsplash.com/photo-1758404958502-44f156617bae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlbWVyZ2VuY3klMjBtZWRpY2FsJTIwdHJhaW5pbmclMjB1cmdlbmN5fGVufDF8fHx8MTc3MTQ5NTc1NXww&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 65,
      category: 'Residência',
      duration: '32h',
    },
    {
      id: '2',
      title: 'Terapia Intensiva',
      image: 'https://images.unsplash.com/photo-1708461859488-2a0c081ff826?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnRlbnNpdmUlMjBjYXJlJTIwbnVyc2luZyUyMGVkdWNhdGlvbnxlbnwxfHx8fDE3NzE0OTU3NTV8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 40,
      category: 'Residência',
      duration: '28h',
    },
    {
      id: '3',
      title: 'Enfermagem Clínica',
      image: 'https://images.unsplash.com/photo-1659353888906-adb3e0041693?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFsdGhjYXJlJTIwdHJhaW5pbmclMjBwcm9mZXNzaW9uYWwlMjBkZXZlbG9wbWVudHxlbnwxfHx8fDE3NzE0MzExNDh8MA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 80,
      category: 'Estágio',
      duration: '24h',
    },
    {
      id: '4',
      title: 'Saúde da Mulher',
      image: 'https://images.unsplash.com/photo-1673515335586-f9f662c01482?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwZWR1Y2F0aW9uJTIwb25saW5lJTIwbGVhcm5pbmd8ZW58MXx8fHwxNzcxNDIzMDA0fDA&ixlib=rb-4.1.0&q=80&w=1080',
      progress: 20,
      category: 'Estágio',
      duration: '20h',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-xl p-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1">
            <h2 className="text-3xl mb-2">Bem-vindo de volta, {userName}!</h2>
            <p className="text-blue-100 mb-6">Continue de onde parou e alcance seus objetivos</p>
            
            <button
              onClick={() => onNavigateToCourse('1')}
              className="bg-white text-[#1e40af] px-6 py-3 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center gap-2 shadow-lg group"
            >
              <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Continuar assistindo: Parada Cardiorrespiratória
            </button>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 min-w-[200px]">
            <p className="text-blue-100 text-sm mb-2">Progresso Geral</p>
            <div className="flex items-end gap-2 mb-3">
              <span className="text-4xl">51</span>
              <span className="text-xl mb-1">%</span>
            </div>
            <Progress.Root className="h-2 bg-white/20 rounded-full overflow-hidden">
              <Progress.Indicator
                className="h-full bg-[#10b981] transition-all duration-500"
                style={{ width: '51%' }}
              />
            </Progress.Root>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#dbeafe] rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-[#1e40af]" />
            </div>
            <div>
              <p className="text-2xl text-[#1e40af]">104h</p>
              <p className="text-sm text-[#64748b]">Horas de estudo</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#d1fae5] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <p className="text-2xl text-[#10b981]">87%</p>
              <p className="text-sm text-[#64748b]">Taxa de aproveitamento</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#fef3c7] rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-[#f59e0b]" />
            </div>
            <div>
              <p className="text-2xl text-[#f59e0b]">156</p>
              <p className="text-sm text-[#64748b]">Aulas concluídas</p>
            </div>
          </div>
        </div>
      </div>

      {/* Courses Grid */}
      <div>
        <h3 className="text-2xl mb-6">Meus Cursos</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <div
              key={course.id}
              onClick={() => onNavigateToCourse(course.id)}
              className="bg-white rounded-xl overflow-hidden border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="relative h-48 overflow-hidden">
                <ImageWithFallback
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${
                    course.category === 'Residência'
                      ? 'bg-[#1e40af] text-white'
                      : 'bg-[#10b981] text-white'
                  }`}>
                    {course.category}
                  </span>
                </div>
              </div>
              
              <div className="p-5">
                <h4 className="mb-3">{course.title}</h4>
                <div className="flex items-center gap-2 text-sm text-[#64748b] mb-4">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration}</span>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#64748b]">Progresso</span>
                    <span className="text-sm text-[#1e40af]">{course.progress}%</span>
                  </div>
                  <Progress.Root className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                    <Progress.Indicator
                      className="h-full bg-[#1e40af] transition-all duration-500"
                      style={{ width: `${course.progress}%` }}
                    />
                  </Progress.Root>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
