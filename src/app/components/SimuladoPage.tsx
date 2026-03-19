import { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Flag } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface SimuladoPageProps {
  onExit: () => void;
}

export function SimuladoPage({ onExit }: SimuladoPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 60 minutes in seconds
  const [markedQuestions, setMarkedQuestions] = useState<number[]>([]);

  const totalQuestions = 30;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = [
    {
      id: 1,
      text: 'Durante o atendimento de uma vítima de trauma, ao aplicar o protocolo ABCDE, qual deve ser a primeira prioridade do enfermeiro?',
      image: null,
      options: [
        { id: 'a', text: 'Avaliar o nível de consciência utilizando a Escala de Glasgow' },
        { id: 'b', text: 'Garantir a permeabilidade das vias aéreas com proteção da coluna cervical' },
        { id: 'c', text: 'Verificar a presença de pulso e iniciar compressões torácicas se necessário' },
        { id: 'd', text: 'Controlar sangramentos externos visíveis' },
        { id: 'e', text: 'Realizar exposição completa da vítima para identificar lesões' },
      ],
    },
  ];

  const currentQuestionData = questions[0];

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
    }
  };

  const toggleMarkQuestion = () => {
    setMarkedQuestions((prev) =>
      prev.includes(currentQuestion)
        ? prev.filter((q) => q !== currentQuestion)
        : [...prev, currentQuestion]
    );
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-[#e2e8f0] shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onExit}
              className="p-2 hover:bg-[#f8fafc] rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="text-lg">Simulado - Urgência e Emergência</h2>
              <p className="text-sm text-[#64748b]">
                Questão {currentQuestion} de {totalQuestions}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeRemaining < 600
                  ? 'bg-red-50 text-red-600'
                  : 'bg-[#dbeafe] text-[#1e40af]'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="text-lg tabular-nums">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-[#f1f5f9]">
          <div
            className="h-full bg-[#1e40af] transition-all duration-300"
            style={{ width: `${(currentQuestion / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-6">
          {/* Question Card */}
          <div className="bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1e40af] text-white rounded-lg flex items-center justify-center">
                  {currentQuestion}
                </div>
                <span className="text-sm text-[#64748b]">Questão de múltipla escolha</span>
              </div>
              <button
                onClick={toggleMarkQuestion}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition-colors ${
                  markedQuestions.includes(currentQuestion)
                    ? 'bg-[#fef3c7] text-[#f59e0b]'
                    : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'
                }`}
              >
                <Flag className="w-4 h-4" />
                <span className="text-sm">
                  {markedQuestions.includes(currentQuestion) ? 'Marcada' : 'Marcar'}
                </span>
              </button>
            </div>

            {/* Question Text */}
            <div className="mb-8">
              <p className="text-lg leading-relaxed">{currentQuestionData.text}</p>
            </div>

            {/* Question Image (if any) */}
            {currentQuestionData.image && (
              <div className="mb-8">
                <ImageWithFallback
                  src={currentQuestionData.image}
                  alt="Imagem da questão"
                  className="max-w-md mx-auto rounded-lg border border-[#e2e8f0]"
                />
              </div>
            )}

            {/* Options */}
            <div className="space-y-3">
              {currentQuestionData.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedAnswer(option.id)}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswer === option.id
                      ? 'border-[#1e40af] bg-[#dbeafe]'
                      : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                        selectedAnswer === option.id
                          ? 'border-[#1e40af] bg-[#1e40af] text-white'
                          : 'border-[#cbd5e1] bg-white'
                      }`}
                    >
                      <span className="uppercase">{option.id}</span>
                    </div>
                    <p className="flex-1 pt-0.5">{option.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 1}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-[#e2e8f0] rounded-lg hover:bg-[#f8fafc] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>

            <div className="flex gap-3">
              <button
                disabled={!selectedAnswer}
                className="px-6 py-3 bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Pular questão
              </button>
              <button
                onClick={handleNext}
                disabled={!selectedAnswer}
                className="flex items-center gap-2 px-6 py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all shadow-lg shadow-[#1e40af]/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {currentQuestion === totalQuestions ? 'Finalizar' : 'Responder'}
                {currentQuestion < totalQuestions && <ChevronRight className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="mt-8 bg-white rounded-xl shadow-sm border border-[#e2e8f0] p-6">
            <h3 className="mb-4">Navegação Rápida</h3>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentQuestion(num)}
                  className={`aspect-square rounded-lg text-sm transition-all ${
                    num === currentQuestion
                      ? 'bg-[#1e40af] text-white'
                      : markedQuestions.includes(num)
                      ? 'bg-[#fef3c7] text-[#f59e0b] hover:bg-[#fde68a]'
                      : 'bg-[#f8fafc] text-[#64748b] hover:bg-[#f1f5f9]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
