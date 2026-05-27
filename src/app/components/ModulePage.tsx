import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ChevronDown, ChevronUp, Play, Check, Clock, Download } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { motion, AnimatePresence } from 'motion/react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';
import { Skeleton } from './ui/skeleton';
import api from '../../lib/axios';

interface ModulePageProps {
  onNavigateToPlayer?: (lessonId: string) => void;
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`;
}

export function ModulePage({ onNavigateToPlayer }: ModulePageProps) {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.name || 'Usuário';
  
  const [modules, setModules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState<string[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!courseId) return;
      try {
        setLoading(true);
        const modulesRes = await api.get(`/courses/${courseId}/modules`);
        const modulesData = modulesRes.data;

        const fullModules = await Promise.all(
          modulesData.map(async (mod: any) => {
            const lessonsRes = await api.get(`/modules/${mod.id}/lessons`);
            const lessonsData = lessonsRes.data;
            
            let totalSeconds = 0;
            const formattedLessons = lessonsData.map((lesson: any) => {
              totalSeconds += lesson.durationSeconds || 0;
              return {
                id: lesson.id,
                title: lesson.title,
                duration: formatDuration(lesson.durationSeconds || 0),
                completed: false, // Default as per instructions
                type: lesson.contentType === 'video' ? 'video' : 'document'
              };
            });

            return {
              id: mod.id,
              title: mod.title,
              duration: formatDuration(totalSeconds),
              lessons: formattedLessons
            };
          })
        );

        setModules(fullModules);
        if (fullModules.length > 0) {
          setOpenModules([fullModules[0].id]);
        }
      } catch (error) {
        console.error('Error loading modules:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [courseId]);

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header userName={userName} />
          <main className="flex-1 overflow-y-auto ml-20 lg:ml-64">
            <div className="p-6">
              <div className="mb-8">
                <Skeleton className="h-10 w-64 mb-4" />
                <Skeleton className="h-4 w-96" />
              </div>
              <div className="space-y-4">
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
                <Skeleton className="h-24 w-full rounded-xl" />
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} />
        <main className="flex-1 overflow-y-auto ml-20 lg:ml-64">
          <div className="p-6">
            {/* Header Area */}
            <div className="mb-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-4xl mb-3">Conteúdo do Curso</h1>
                  <p className="text-[#64748b]">
                    Explore os módulos e aulas disponíveis para sua especialização.
                  </p>
                </div>
                <button className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-all shadow-lg shadow-[#10b981]/20 hover:shadow-xl hover:shadow-[#10b981]/30">
                  <Download className="w-5 h-5" />
                  Cronograma PDF
                </button>
              </div>
            </div>

            {/* Modules List */}
            <div className="space-y-4">
              {modules.map((module, moduleIdx) => {
                const isOpen = openModules.includes(module.id);
                const completedCount = module.lessons.filter((l: any) => l.completed).length;

                return (
                  <Collapsible.Root
                    key={module.id}
                    open={isOpen}
                    onOpenChange={() => toggleModule(module.id)}
                    className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <Collapsible.Trigger className="w-full p-6 flex items-center justify-between hover:bg-[#f8fafc] transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-[#f1f5f9] rounded-lg flex items-center justify-center text-[#1e40af] font-bold">
                          {moduleIdx + 1}
                        </div>
                        <div className="text-left">
                          <h3 className="text-xl font-medium">{module.title}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-[#64748b]">
                            <span className="flex items-center gap-1.5">
                              <Play className="w-4 h-4" />
                              {module.lessons.length} aulas
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              {module.duration}
                            </span>
                            {completedCount > 0 && (
                              <span className="flex items-center gap-1.5 text-[#10b981] font-medium">
                                <Check className="w-4 h-4" />
                                {completedCount}/{module.lessons.length} concluídas
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {completedCount === module.lessons.length && module.lessons.length > 0 && (
                          <div className="px-3 py-1 bg-[#d1fae5] text-[#10b981] rounded-full text-xs font-medium">
                            Módulo Completo
                          </div>
                        )}
                        {isOpen ? (
                          <ChevronUp className="w-6 h-6 text-[#64748b]" />
                        ) : (
                          <ChevronDown className="w-6 h-6 text-[#64748b]" />
                        )}
                      </div>
                    </Collapsible.Trigger>

                    <AnimatePresence>
                      {isOpen && (
                        <Collapsible.Content forceMount asChild>
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                          >
                            <div className="px-6 pb-6 space-y-2 pt-2 border-t border-[#f1f5f9]">
                              {module.lessons.map((lesson: any, index: number) => (
                                <motion.div
                                  key={lesson.id}
                                  initial={{ x: -20, opacity: 0 }}
                                  animate={{ x: 0, opacity: 1 }}
                                  transition={{ delay: index * 0.05 }}
                                  className="group flex items-center gap-4 p-4 rounded-lg hover:bg-[#f8fafc] transition-all cursor-pointer border border-transparent hover:border-[#e2e8f0]"
                                  onClick={() => {
                                    onNavigateToPlayer?.(lesson.id);
                                    navigate(`/player/${lesson.id}`);
                                  }}
                                >
                                  <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                                      lesson.completed
                                        ? 'bg-[#10b981] text-white'
                                        : 'bg-[#f1f5f9] text-[#64748b] group-hover:bg-[#1e40af] group-hover:text-white'
                                    }`}
                                  >
                                    {lesson.completed ? (
                                      <Check className="w-4 h-4" />
                                    ) : (
                                      <Play className="w-4 h-4 ml-0.5" />
                                    )}
                                  </div>
                                  <div className="flex-1">
                                    <p className={`text-sm font-medium ${lesson.completed ? 'text-[#64748b]' : 'text-[#1e293b]'}`}>
                                      Aula {index + 1}: {lesson.title}
                                    </p>
                                  </div>
                                  <div className="flex items-center gap-2 text-[#64748b] text-xs">
                                    <Clock className="w-3 h-3" />
                                    <span>{lesson.duration}</span>
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        </Collapsible.Content>
                      )}
                    </AnimatePresence>
                  </Collapsible.Root>
                );
              })}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
