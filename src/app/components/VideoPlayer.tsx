import { useState } from 'react';
import { Play, Pause, Volume2, Maximize, Check, ChevronRight, FileText, MessageSquare } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';

export function VideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState('1x');

  const playlist = [
    { id: '1', title: 'Introdução à Urgência e Emergência', duration: '45min', completed: true },
    { id: '2', title: 'Triagem e Classificação de Risco', duration: '1h 10min', completed: true },
    { id: '3', title: 'Atendimento Inicial ao Paciente Crítico', duration: '1h 20min', completed: true },
    { id: '4', title: 'Protocolo ABCDE', duration: '1h 15min', completed: false, current: true },
    { id: '5', title: 'Reconhecimento da PCR', duration: '50min', completed: false },
    { id: '6', title: 'Suporte Básico de Vida', duration: '1h 30min', completed: false },
  ];

  const attachments = [
    { name: 'Protocolo ABCDE - Material Completo.pdf', size: '2.4 MB' },
    { name: 'Slides da Aula.pdf', size: '1.8 MB' },
    { name: 'Checklist de Atendimento.pdf', size: '980 KB' },
  ];

  return (
    <div className="flex flex-col lg:flex-row h-[calc(100vh-73px)] bg-[#0f172a]">
      {/* Main Content - Video and Tabs */}
      <div className="flex-1 flex flex-col">
        {/* Video Player */}
        <div className="relative bg-black aspect-video lg:flex-1">
          {/* Video Placeholder */}
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
            <div className="text-center">
              <div className="w-20 h-20 bg-[#1e40af] rounded-full flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-[#1e3a8a] transition-colors">
                {isPlaying ? (
                  <Pause className="w-10 h-10 text-white" onClick={() => setIsPlaying(false)} />
                ) : (
                  <Play className="w-10 h-10 text-white ml-1" onClick={() => setIsPlaying(true)} />
                )}
              </div>
              <p className="text-white text-lg">Protocolo ABCDE</p>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
            <div className="mb-3">
              <div className="h-1 bg-white/30 rounded-full overflow-hidden">
                <div className="h-full bg-[#1e40af] w-1/3" />
              </div>
            </div>
            <div className="flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-[#10b981] transition-colors">
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                </button>
                <Volume2 className="w-5 h-5" />
                <span className="text-sm">15:30 / 45:00</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex gap-1">
                  {['1x', '1.5x', '2x'].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSelectedSpeed(speed)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        selectedSpeed === speed
                          ? 'bg-[#1e40af] text-white'
                          : 'bg-white/10 hover:bg-white/20'
                      }`}
                    >
                      {speed}
                    </button>
                  ))}
                </div>
                <Maximize className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <Tabs.Root defaultValue="description" className="flex-1 bg-white">
          <Tabs.List className="flex border-b border-[#e2e8f0] px-6">
            <Tabs.Trigger
              value="description"
              className="px-4 py-3 text-[#64748b] border-b-2 border-transparent data-[state=active]:border-[#1e40af] data-[state=active]:text-[#1e40af] transition-colors"
            >
              Descrição da Aula
            </Tabs.Trigger>
            <Tabs.Trigger
              value="attachments"
              className="px-4 py-3 text-[#64748b] border-b-2 border-transparent data-[state=active]:border-[#1e40af] data-[state=active]:text-[#1e40af] transition-colors"
            >
              Anexos
            </Tabs.Trigger>
            <Tabs.Trigger
              value="doubts"
              className="px-4 py-3 text-[#64748b] border-b-2 border-transparent data-[state=active]:border-[#1e40af] data-[state=active]:text-[#1e40af] transition-colors"
            >
              Dúvidas
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="description" className="p-6 space-y-4">
            <div>
              <h3 className="mb-3">Sobre esta aula</h3>
              <p className="text-[#64748b] leading-relaxed">
                Nesta aula, você aprenderá o protocolo ABCDE, uma ferramenta essencial para o atendimento 
                sistematizado do paciente crítico. O protocolo garante uma abordagem organizada e eficiente, 
                priorizando as intervenções que salvam vidas.
              </p>
            </div>
            <div>
              <h4 className="mb-3">O que você vai aprender:</h4>
              <ul className="space-y-2 text-[#64748b]">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>A - Vias Aéreas (Airway) com proteção da coluna cervical</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>B - Respiração e Ventilação (Breathing)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>C - Circulação com controle de hemorragias (Circulation)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>D - Avaliação Neurológica (Disability)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-[#10b981] flex-shrink-0 mt-0.5" />
                  <span>E - Exposição com controle de temperatura (Exposure)</span>
                </li>
              </ul>
            </div>
          </Tabs.Content>

          <Tabs.Content value="attachments" className="p-6">
            <div className="space-y-3">
              {attachments.map((attachment, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-[#f8fafc] rounded-lg border border-[#e2e8f0] hover:bg-[#f1f5f9] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#dbeafe] rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-[#1e40af]" />
                    </div>
                    <div>
                      <p className="text-sm">{attachment.name}</p>
                      <p className="text-xs text-[#64748b]">{attachment.size}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors text-sm">
                    Baixar
                  </button>
                </div>
              ))}
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
                <button className="mt-3 px-6 py-2 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-colors">
                  Enviar Dúvida
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-sm text-[#64748b]">Dúvidas anteriores:</p>
                <div className="bg-white rounded-lg p-4 border border-[#e2e8f0]">
                  <div className="flex items-start gap-3 mb-2">
                    <MessageSquare className="w-5 h-5 text-[#1e40af] flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm mb-1">Como identificar rapidamente uma obstrução de vias aéreas?</p>
                      <p className="text-xs text-[#64748b]">Ana Paula • 2 dias atrás</p>
                    </div>
                  </div>
                  <div className="ml-8 bg-[#f8fafc] rounded-lg p-3 text-sm text-[#64748b]">
                    Resposta do instrutor: Observe sinais como estridor, tiragem intercostal...
                  </div>
                </div>
              </div>
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </div>

      {/* Sidebar - Playlist */}
      <div className="w-full lg:w-96 bg-white border-l border-[#e2e8f0] overflow-y-auto">
        <div className="p-6 border-b border-[#e2e8f0]">
          <h3 className="mb-2">Fundamentos da Urgência</h3>
          <p className="text-sm text-[#64748b]">{playlist.length} aulas</p>
        </div>
        <div className="divide-y divide-[#e2e8f0]">
          {playlist.map((lesson) => (
            <button
              key={lesson.id}
              className={`w-full p-4 flex items-start gap-3 hover:bg-[#f8fafc] transition-colors text-left ${
                lesson.current ? 'bg-[#f1f5f9]' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  lesson.completed
                    ? 'bg-[#10b981] text-white'
                    : lesson.current
                    ? 'bg-[#1e40af] text-white'
                    : 'bg-[#f1f5f9] text-[#64748b]'
                }`}
              >
                {lesson.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm mb-1 ${lesson.current ? 'text-[#1e40af]' : ''}`}>
                  {lesson.title}
                </p>
                <p className="text-xs text-[#64748b]">{lesson.duration}</p>
              </div>
              {lesson.current && <ChevronRight className="w-5 h-5 text-[#1e40af] flex-shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        <button className="px-6 py-3 bg-[#10b981] text-white rounded-lg hover:bg-[#059669] transition-all shadow-lg shadow-[#10b981]/30 hover:shadow-xl flex items-center gap-2">
          <Check className="w-5 h-5" />
          Marcar como concluída
        </button>
        <button className="px-6 py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all shadow-lg shadow-[#1e40af]/30 hover:shadow-xl flex items-center gap-2">
          Próxima Aula
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
