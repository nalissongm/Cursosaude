import { useState } from 'react';
import { ChevronDown, ChevronUp, Play, Check, Clock, Download } from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { motion, AnimatePresence } from 'motion/react';

interface ModulePageProps {
  onNavigateToPlayer: (lessonId: string) => void;
}

export function ModulePage({ onNavigateToPlayer }: ModulePageProps) {
  const [openModules, setOpenModules] = useState<string[]>(['1', '2']);

  const modules = [
    {
      id: '1',
      title: 'Fundamentos da Urgência e Emergência',
      duration: '8h 30min',
      lessons: [
        { id: '1-1', title: 'Introdução à Urgência e Emergência', duration: '45min', completed: true },
        { id: '1-2', title: 'Triagem e Classificação de Risco', duration: '1h 10min', completed: true },
        { id: '1-3', title: 'Atendimento Inicial ao Paciente Crítico', duration: '1h 20min', completed: true },
        { id: '1-4', title: 'Protocolo ABCDE', duration: '1h 15min', completed: false },
      ],
    },
    {
      id: '2',
      title: 'Parada Cardiorrespiratória',
      duration: '6h 45min',
      lessons: [
        { id: '2-1', title: 'Reconhecimento da PCR', duration: '50min', completed: false },
        { id: '2-2', title: 'Suporte Básico de Vida', duration: '1h 30min', completed: false },
        { id: '2-3', title: 'Suporte Avançado de Vida', duration: '1h 40min', completed: false },
        { id: '2-4', title: 'Uso do Desfibrilador', duration: '1h 10min', completed: false },
      ],
    },
    {
      id: '3',
      title: 'Emergências Cardiovasculares',
      duration: '7h 20min',
      lessons: [
        { id: '3-1', title: 'Infarto Agudo do Miocárdio', duration: '1h 30min', completed: false },
        { id: '3-2', title: 'Arritmias Cardíacas', duration: '1h 20min', completed: false },
        { id: '3-3', title: 'Insuficiência Cardíaca Aguda', duration: '1h 15min', completed: false },
        { id: '3-4', title: 'Hipertensão de Emergência', duration: '1h 10min', completed: false },
      ],
    },
    {
      id: '4',
      title: 'Emergências Respiratórias',
      duration: '5h 30min',
      lessons: [
        { id: '4-1', title: 'Insuficiência Respiratória Aguda', duration: '1h 15min', completed: false },
        { id: '4-2', title: 'Crise Asmática', duration: '1h 00min', completed: false },
        { id: '4-3', title: 'DPOC Exacerbado', duration: '1h 10min', completed: false },
        { id: '4-4', title: 'Pneumotórax', duration: '55min', completed: false },
      ],
    },
  ];

  const toggleModule = (moduleId: string) => {
    setOpenModules((prev) =>
      prev.includes(moduleId)
        ? prev.filter((id) => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = modules.reduce(
    (acc, module) => acc + module.lessons.filter((lesson) => lesson.completed).length,
    0
  );

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-4xl mb-3">Urgência e Emergência</h1>
            <p className="text-[#64748b]">
              Prepare-se para atuar em situações críticas com confiança e conhecimento técnico
            </p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-all shadow-lg shadow-[#10b981]/20 hover:shadow-xl hover:shadow-[#10b981]/30">
            <Download className="w-5 h-5" />
            Cronograma PDF
          </button>
        </div>

        {/* Progress Stats */}
        <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#64748b] mb-1">Progresso do Curso</p>
              <p className="text-2xl text-[#1e40af]">{completedLessons} de {totalLessons} aulas concluídas</p>
            </div>
            <div className="text-right">
              <p className="text-3xl text-[#1e40af]">
                {Math.round((completedLessons / totalLessons) * 100)}%
              </p>
            </div>
          </div>
          <div className="h-3 bg-[#f1f5f9] rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(completedLessons / totalLessons) * 100}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="h-full bg-gradient-to-r from-[#1e40af] to-[#3b82f6]"
            />
          </div>
        </div>
      </div>

      {/* Modules List */}
      <div className="space-y-4">
        {modules.map((module) => {
          const isOpen = openModules.includes(module.id);
          const completedCount = module.lessons.filter((l) => l.completed).length;
          const progress = (completedCount / module.lessons.length) * 100;

          return (
            <Collapsible.Root
              key={module.id}
              open={isOpen}
              onOpenChange={() => toggleModule(module.id)}
              className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden hover:shadow-md transition-shadow"
            >
              <Collapsible.Trigger className="w-full p-6 flex items-center justify-between hover:bg-[#f8fafc] transition-colors">
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl">{module.title}</h3>
                    {progress === 100 && (
                      <span className="px-3 py-1 bg-[#d1fae5] text-[#10b981] rounded-full text-xs">
                        Concluído
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[#64748b]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {module.duration}
                    </span>
                    <span>
                      {completedCount}/{module.lessons.length} aulas
                    </span>
                    <div className="flex-1 max-w-xs">
                      <div className="h-1.5 bg-[#f1f5f9] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#10b981] transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {isOpen ? (
                    <ChevronUp className="w-5 h-5 text-[#64748b]" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-[#64748b]" />
                  )}
                </div>
              </Collapsible.Trigger>

              <AnimatePresence>
                {isOpen && (
                  <Collapsible.Content forceMount>
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 space-y-2">
                        {module.lessons.map((lesson, index) => (
                          <button
                            key={lesson.id}
                            onClick={() => onNavigateToPlayer(lesson.id)}
                            className="w-full flex items-center gap-4 p-4 rounded-lg hover:bg-[#f8fafc] transition-colors group"
                          >
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                lesson.completed
                                  ? 'bg-[#10b981] text-white'
                                  : 'bg-[#f1f5f9] text-[#64748b] group-hover:bg-[#1e40af] group-hover:text-white'
                              }`}
                            >
                              {lesson.completed ? (
                                <Check className="w-4 h-4" />
                              ) : (
                                <Play className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className={`${lesson.completed ? 'text-[#64748b]' : ''}`}>
                                Aula {index + 1}: {lesson.title}
                              </p>
                            </div>
                            <span className="text-sm text-[#64748b]">{lesson.duration}</span>
                          </button>
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
  );
}
