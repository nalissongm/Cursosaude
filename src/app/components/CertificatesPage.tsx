import { Award, Download, Share2, Calendar, Clock, CheckCircle, Lock } from 'lucide-react';

export function CertificatesPage() {
  const completedCertificates = [
    {
      id: '1',
      courseName: 'Enfermagem Clínica',
      category: 'Estágio',
      completionDate: '15 de Janeiro de 2026',
      workload: '24 horas',
      score: 92,
      certificateNumber: 'MEDP-2026-001543',
      status: 'completed',
    },
    {
      id: '2',
      courseName: 'Fundamentos de Urgência e Emergência',
      category: 'Residência',
      completionDate: '28 de Dezembro de 2025',
      workload: '32 horas',
      score: 88,
      certificateNumber: 'MEDP-2025-009876',
      status: 'completed',
    },
    {
      id: '3',
      courseName: 'Farmacologia Aplicada à Enfermagem',
      category: 'Estágio',
      completionDate: '10 de Dezembro de 2025',
      workload: '20 horas',
      score: 95,
      certificateNumber: 'MEDP-2025-009234',
      status: 'completed',
    },
  ];

  const inProgressCertificates = [
    {
      id: '4',
      courseName: 'Urgência e Emergência',
      category: 'Residência',
      progress: 65,
      workload: '32 horas',
      estimatedCompletion: 'Março de 2026',
      status: 'in-progress',
    },
    {
      id: '5',
      courseName: 'Terapia Intensiva',
      category: 'Residência',
      progress: 40,
      workload: '28 horas',
      estimatedCompletion: 'Abril de 2026',
      status: 'in-progress',
    },
    {
      id: '6',
      courseName: 'Saúde da Mulher',
      category: 'Estágio',
      progress: 20,
      workload: '20 horas',
      estimatedCompletion: 'Maio de 2026',
      status: 'in-progress',
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-3">Certificados</h1>
        <p className="text-[#64748b]">
          Acompanhe seus certificados conquistados e cursos em andamento
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-6 h-6" />
            <span className="text-3xl">{completedCertificates.length}</span>
          </div>
          <p className="text-sm text-blue-100">Certificados conquistados</p>
        </div>

        <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6" />
            <span className="text-3xl">76h</span>
          </div>
          <p className="text-sm text-green-100">Carga horária total</p>
        </div>

        <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6" />
            <span className="text-3xl">92%</span>
          </div>
          <p className="text-sm text-orange-100">Média de aproveitamento</p>
        </div>

        <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-6 h-6" />
            <span className="text-3xl">{inProgressCertificates.length}</span>
          </div>
          <p className="text-sm text-indigo-100">Em andamento</p>
        </div>
      </div>

      {/* Completed Certificates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Certificados Conquistados</h2>
          <span className="text-sm text-[#64748b]">
            {completedCertificates.length} certificado(s)
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {completedCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl border-2 border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group"
            >
              {/* Certificate Header */}
              <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] p-6 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Award className="w-8 h-8" />
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      cert.category === 'Residência'
                        ? 'bg-white/20 text-white'
                        : 'bg-[#10b981] text-white'
                    }`}>
                      {cert.category}
                    </span>
                  </div>
                  <h3 className="text-xl mb-2">{cert.courseName}</h3>
                  <p className="text-blue-100 text-sm">
                    Certificado de Conclusão
                  </p>
                </div>
              </div>

              {/* Certificate Body */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#dbeafe] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-[#1e40af]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#64748b]">Conclusão</p>
                      <p className="text-sm">{cert.completionDate}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#d1fae5] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-[#10b981]" />
                    </div>
                    <div>
                      <p className="text-xs text-[#64748b]">Carga Horária</p>
                      <p className="text-sm">{cert.workload}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#f8fafc] rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#64748b]">Aproveitamento</span>
                    <span className="text-lg text-[#10b981]">{cert.score}%</span>
                  </div>
                  <div className="h-2 bg-[#e2e8f0] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#10b981] transition-all duration-500"
                      style={{ width: `${cert.score}%` }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#e2e8f0]">
                  <p className="text-xs text-[#64748b] mb-1">Número do Certificado</p>
                  <p className="text-sm font-mono text-[#1e40af]">{cert.certificateNumber}</p>
                </div>

                <div className="flex gap-3">
                  <button className="flex-1 py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#1e40af]/20 group-hover:shadow-xl">
                    <Download className="w-5 h-5" />
                    Baixar
                  </button>
                  <button className="px-4 py-3 bg-[#f8fafc] text-[#64748b] border border-[#e2e8f0] rounded-lg hover:bg-[#f1f5f9] hover:text-[#1e40af] transition-all duration-200 flex items-center justify-center">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* In Progress Certificates */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl">Em Andamento</h2>
          <span className="text-sm text-[#64748b]">
            {inProgressCertificates.length} curso(s)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inProgressCertificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-[#f8fafc] rounded-lg flex items-center justify-center">
                  <Lock className="w-6 h-6 text-[#64748b]" />
                </div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  cert.category === 'Residência'
                    ? 'bg-[#dbeafe] text-[#1e40af]'
                    : 'bg-[#d1fae5] text-[#10b981]'
                }`}>
                  {cert.category}
                </span>
              </div>

              <h3 className="mb-4">{cert.courseName}</h3>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#64748b]">Progresso</span>
                  <span className="text-[#1e40af]">{cert.progress}%</span>
                </div>
                <div className="h-2 bg-[#f1f5f9] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#1e40af] transition-all duration-500"
                    style={{ width: `${cert.progress}%` }}
                  />
                </div>
              </div>

              <div className="space-y-2 text-sm text-[#64748b] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{cert.workload} de conteúdo</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Prev: {cert.estimatedCompletion}</span>
                </div>
              </div>

              <button className="w-full py-3 bg-[#f8fafc] text-[#1e40af] border border-[#e2e8f0] rounded-lg hover:bg-[#1e40af] hover:text-white transition-all duration-200">
                Continuar Curso
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-[#f8fafc] to-white rounded-xl p-8 border border-[#e2e8f0]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[#dbeafe] rounded-xl flex items-center justify-center flex-shrink-0">
            <Award className="w-6 h-6 text-[#1e40af]" />
          </div>
          <div className="flex-1">
            <h3 className="mb-2">Sobre os Certificados</h3>
            <p className="text-[#64748b] mb-4">
              Todos os certificados da MedPrep são digitais, verificáveis e reconhecidos por instituições de saúde em todo o país. 
              Ao concluir um curso com aproveitamento mínimo de 70%, você receberá automaticamente seu certificado.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#64748b]">Certificado digital válido</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#64748b]">Código de verificação único</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#64748b]">Download ilimitado</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#10b981]" />
                <span className="text-[#64748b]">Compartilhamento fácil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
