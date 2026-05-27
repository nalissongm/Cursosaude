import { useState, useEffect } from 'react';
import { Play, Check, ChevronRight, ChevronLeft, FileText, MessageSquare, AlertCircle } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';
import MuxPlayer from '@mux/mux-player-react';
import { useNavigate } from 'react-router';
import { useLessonDetail } from '../../hooks/useLessonDetail';
import { useLessons } from '../../hooks/useLessons';
import { Skeleton } from './ui/skeleton';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuth } from '../../context/AuthContext';

interface VideoPlayerProps {
  lessonId: string;
}

export function VideoPlayer({ lessonId }: VideoPlayerProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userName = user?.name || 'Usuário';
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [nextLessonId, setNextLessonId] = useState<string | null>(null);
  const [prevLessonId, setPrevLessonId] = useState<string | null>(null);
  
  const { data: lesson, loading: loadingLesson, error: lessonError } = useLessonDetail(lessonId);
  const { lessons: playlist, loading: loadingPlaylist } = useLessons(lesson?.moduleId || '');

  useEffect(() => {
    if (playlist.length > 0 && lessonId) {
      const currentIndex = playlist.findIndex((l) => l.id === lessonId);
      if (currentIndex !== -1) {
        setPrevLessonId(playlist[currentIndex - 1]?.id || null);
        setNextLessonId(playlist[currentIndex + 1]?.id || null);
      }
    }
  }, [playlist, lessonId]);

  if (loadingLesson) {
    return (
      <div className="flex h-screen w-screen bg-[#f8fafc] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header userName={userName} />
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <div className="flex flex-col lg:flex-row h-full bg-[#0f172a]">
              <div className="flex-1 flex flex-col">
                <Skeleton className="w-full aspect-video" />
                <div className="flex-1 bg-white p-6 space-y-4">
                  <Skeleton className="h-8 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                </div>
              </div>
              <div className="w-full lg:w-96 bg-white border-l border-[#e2e8f0] overflow-hidden">
                <div className="p-6 border-b border-[#e2e8f0]">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
                <div className="p-4 space-y-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (lessonError || !lesson) {
    return (
      <div className="flex h-screen w-screen bg-[#f8fafc] overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header userName={userName} />
          <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
            <div className="flex flex-col items-center justify-center h-full bg-[#f8fafc] p-6 text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Erro ao carregar aula</h2>
              <p className="text-[#64748b] mb-6">{lessonError?.message || 'Aula não encontrada'}</p>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors"
              >
                Tentar novamente
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header userName={userName} />
        <main className={`flex-1 overflow-y-auto transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-64' : 'ml-20'}`}>
          <div className="flex flex-col lg:flex-row h-full bg-[#0f172a]">
            {/* Main Content - Video and Tabs */}
            <div className="flex-1 flex flex-col overflow-y-auto">
              {/* Video Player */}
              <div className="relative bg-black aspect-video lg:flex-shrink-0">
                {lesson.contentType === 'video' && lesson.videoUrl ? (
                  <MuxPlayer
                    playbackId={lesson.videoUrl}
                    metadata={{
                      video_id: lesson.id,
                      video_title: lesson.title,
                    }}
                    primaryColor="#1e40af"
                    className="w-full h-full"
                    onEnded={() => nextLessonId && navigate(`/player/${nextLessonId}`)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
                    <div className="text-center p-6">
                      <FileText className="w-20 h-20 text-[#1e40af] mx-auto mb-4" />
                      <p className="text-white text-lg font-medium">{lesson.title}</p>
                      <p className="text-gray-400">Esta aula é um documento/material de leitura.</p>
                      <button className="mt-6 px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors">
                        Visualizar Material
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs Section */}
              <Tabs.Root defaultValue="description" className="flex-1 bg-white">
                <Tabs.List className="flex border-b border-[#e2e8f0] px-6 sticky top-0 bg-white z-10">
                  <Tabs.Trigger
                    value="description"
                    className="px-4 py-3 text-[#64748b] border-b-2 border-transparent data-[state=active]:border-[#1e40af] data-[state=active]:text-[#1e40af] transition-colors font-medium"
                  >
                    Descrição da Aula
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="attachments"
                    className="px-4 py-3 text-[#64748b] border-b-2 border-transparent data-[state=active]:border-[#1e40af] data-[state=active]:text-[#1e40af] transition-colors font-medium"
                  >
                    Anexos ({lesson.attachments?.length || 0})
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="doubts"
                    className="px-4 py-3 text-[#64748b] border-b-2 border-transparent data-[state=active]:border-[#1e40af] data-[state=active]:text-[#1e40af] transition-colors font-medium"
                  >
                    Dúvidas
                  </Tabs.Trigger>
                </Tabs.List>

                <Tabs.Content value="description" className="p-6 space-y-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Sobre esta aula</h3>
                    <div className="text-[#64748b] leading-relaxed whitespace-pre-wrap">
                      {lesson.description}
                    </div>
                  </div>
                </Tabs.Content>

                <Tabs.Content value="attachments" className="p-6">
                  <div className="space-y-3">
                    {lesson.attachments && lesson.attachments.length > 0 ? (
                      lesson.attachments.map((attachment, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#dbeafe] rounded-lg flex items-center justify-center group-hover:bg-[#1e40af] transition-colors">
                              <FileText className="w-5 h-5 text-[#1e40af] group-hover:text-white" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{attachment.name}</p>
                              <p className="text-xs text-[#64748b]">{attachment.size}</p>
                            </div>
                          </div>
                          <button className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors text-sm">
                            Baixar
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 border-2 border-dashed border-[#e2e8f0] rounded-xl">
                        <FileText className="w-12 h-12 text-[#cbd5e1] mx-auto mb-2" />
                        <p className="text-[#64748b]">Nenhum anexo disponível para esta aula.</p>
                      </div>
                    )}
                  </div>
                </Tabs.Content>

                <Tabs.Content value="doubts" className="p-6">
                  <div className="space-y-4">
                    <div className="bg-[#f8fafc] rounded-lg p-4 border border-[#e2e8f0]">
                      <textarea
                        placeholder="Tem alguma dúvida sobre esta aula? Digite aqui..."
                        className="w-full p-3 bg-white border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent resize-none"
                        rows={4}
                      />
                      <button className="mt-3 px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors font-medium">
                        Enviar Dúvida
                      </button>
                    </div>
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-[#64748b]">Dúvidas frequentes:</p>
                      <div className="bg-white rounded-lg p-4 border border-[#e2e8f0] shadow-sm">
                        <div className="flex items-start gap-3 mb-2">
                          <MessageSquare className="w-5 h-5 text-[#1e40af] flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-sm font-medium mb-1">Como identificar rapidamente uma obstrução de vias aéreas?</p>
                            <p className="text-xs text-[#64748b]">Ana Paula • Suporte Técnico</p>
                          </div>
                        </div>
                        <div className="ml-8 bg-[#f8fafc] rounded-lg p-3 text-sm text-[#64748b]">
                          Observe sinais como estridor, tiragem intercostal e uso de musculatura acessória.
                        </div>
                      </div>
                    </div>
                  </div>
                </Tabs.Content>
              </Tabs.Root>
            </div>

            {/* Sidebar - Playlist */}
            <div className="w-full lg:w-96 bg-white border-l border-[#e2e8f0] flex flex-col overflow-hidden">
              <div className="p-6 border-b border-[#e2e8f0] bg-white">
                <h3 className="text-lg font-semibold mb-1">Conteúdo do Módulo</h3>
                <p className="text-sm text-[#64748b]">
                  {loadingPlaylist ? 'Carregando aulas...' : `${playlist.length} aulas`}
                </p>
              </div>
              <div className="flex-1 overflow-y-auto divide-y divide-[#e2e8f0]">
                {loadingPlaylist ? (
                  Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="p-4 flex gap-3">
                      <Skeleton className="w-8 h-8 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    </div>
                  ))
                ) : (
                  playlist.map((item) => {
                    const itemDuration = (item as any).duration ?? '';

                    return (
                      <button
                        key={item.id}
                        className={`w-full p-4 flex items-start gap-3 hover:bg-[#f8fafc] transition-colors text-left group ${
                          item.id === lessonId ? 'bg-[#f1f5f9]' : ''
                        }`}
                        onClick={() => navigate(`/player/${item.id}`)}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                            item.completed
                              ? 'bg-[#10b981] text-white'
                              : item.id === lessonId
                              ? 'bg-[#1e40af] text-white'
                              : 'bg-[#f1f5f9] text-[#64748b] group-hover:bg-[#e2e8f0]'
                          }`}
                        >
                          {item.completed ? (
                            <Check className="w-4 h-4" />
                          ) : (
                            <Play className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium mb-1 transition-colors ${
                            item.id === lessonId ? 'text-[#1e40af]' : 'text-[#1e293b]'
                          }`}>
                            {item.title}
                          </p>
                          <p className="text-xs text-[#64748b]">{itemDuration}</p>
                        </div>
                        {item.id === lessonId && <ChevronRight className="w-5 h-5 text-[#1e40af] flex-shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Floating Action Buttons */}
            <div className="fixed bottom-6 right-6 flex items-center gap-3 z-50">
              {prevLessonId && (
                <button 
                  onClick={() => navigate(`/player/${prevLessonId}`)}
                  className="px-6 py-3 bg-white text-[#1e293b] border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc] transition-all shadow-lg hover:shadow-xl flex items-center gap-2 font-medium"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>
              )}
              
              {!lesson.completed && (
                <button className="px-6 py-3 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-all shadow-lg shadow-[#10b981]/30 hover:shadow-xl flex items-center gap-2 font-medium">
                  <Check className="w-5 h-5" />
                  Marcar como concluída
                </button>
              )}

              {nextLessonId && (
                <button 
                  onClick={() => navigate(`/player/${nextLessonId}`)}
                  className="px-6 py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all shadow-lg shadow-[#1e40af]/30 hover:shadow-xl flex items-center gap-2 font-medium"
                >
                  Próxima Aula
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
