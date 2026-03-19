import { useState } from 'react';
import { FileText, Download, Search, Filter, Book, FileSpreadsheet, Image as ImageIcon, Video } from 'lucide-react';

export function MaterialsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'Todos', count: 24 },
    { id: 'apostilas', label: 'Apostilas', count: 8 },
    { id: 'protocolos', label: 'Protocolos', count: 6 },
    { id: 'resumos', label: 'Resumos', count: 5 },
    { id: 'infograficos', label: 'Infográficos', count: 3 },
    { id: 'planilhas', label: 'Planilhas', count: 2 },
  ];

  const materials = [
    {
      id: '1',
      title: 'Apostila Completa - Urgência e Emergência',
      description: 'Material completo com todos os protocolos de atendimento em situações de urgência e emergência',
      type: 'apostilas',
      icon: Book,
      size: '8.5 MB',
      pages: 120,
      downloads: 1234,
      category: 'Urgência e Emergência',
      color: 'bg-[#dbeafe] text-[#1e40af]',
    },
    {
      id: '2',
      title: 'Protocolo ABCDE Atualizado 2026',
      description: 'Protocolo de atendimento ao paciente crítico - versão atualizada com as últimas diretrizes',
      type: 'protocolos',
      icon: FileText,
      size: '2.4 MB',
      pages: 15,
      downloads: 2156,
      category: 'Protocolos Clínicos',
      color: 'bg-[#d1fae5] text-[#10b981]',
    },
    {
      id: '3',
      title: 'Resumo - Parada Cardiorrespiratória',
      description: 'Resumo objetivo com os pontos principais sobre PCR e Suporte Básico e Avançado de Vida',
      type: 'resumos',
      icon: FileText,
      size: '1.8 MB',
      pages: 8,
      downloads: 1876,
      category: 'Urgência e Emergência',
      color: 'bg-[#fef3c7] text-[#f59e0b]',
    },
    {
      id: '4',
      title: 'Infográfico - Vias de Administração de Medicamentos',
      description: 'Guia visual completo sobre as diferentes vias de administração e suas indicações',
      type: 'infograficos',
      icon: ImageIcon,
      size: '3.2 MB',
      pages: 1,
      downloads: 3421,
      category: 'Farmacologia',
      color: 'bg-[#e0e7ff] text-[#6366f1]',
    },
    {
      id: '5',
      title: 'Checklist de Atendimento ao Politraumatizado',
      description: 'Lista de verificação completa para não esquecer nenhum passo no atendimento ao trauma',
      type: 'planilhas',
      icon: FileSpreadsheet,
      size: '980 KB',
      pages: 4,
      downloads: 1543,
      category: 'Urgência e Emergência',
      color: 'bg-[#dcfce7] text-[#16a34a]',
    },
    {
      id: '6',
      title: 'Apostila - Terapia Intensiva',
      description: 'Conteúdo completo sobre cuidados intensivos, ventilação mecânica e monitorização avançada',
      type: 'apostilas',
      icon: Book,
      size: '12.3 MB',
      pages: 156,
      downloads: 987,
      category: 'Terapia Intensiva',
      color: 'bg-[#dbeafe] text-[#1e40af]',
    },
    {
      id: '7',
      title: 'Protocolo de Sepse e Choque Séptico',
      description: 'Diretrizes atualizadas para identificação e manejo da sepse nas primeiras horas',
      type: 'protocolos',
      icon: FileText,
      size: '2.1 MB',
      pages: 12,
      downloads: 1654,
      category: 'Protocolos Clínicos',
      color: 'bg-[#d1fae5] text-[#10b981]',
    },
    {
      id: '8',
      title: 'Resumo - Farmacologia Cardiovascular',
      description: 'Principais medicamentos utilizados em emergências cardiovasculares com doses e indicações',
      type: 'resumos',
      icon: FileText,
      size: '1.5 MB',
      pages: 6,
      downloads: 2234,
      category: 'Farmacologia',
      color: 'bg-[#fef3c7] text-[#f59e0b]',
    },
    {
      id: '9',
      title: 'Infográfico - ECG de Emergência',
      description: 'Guia rápido para interpretação de ECG em situações de emergência',
      type: 'infograficos',
      icon: ImageIcon,
      size: '2.8 MB',
      pages: 1,
      downloads: 4123,
      category: 'Cardiologia',
      color: 'bg-[#e0e7ff] text-[#6366f1]',
    },
    {
      id: '10',
      title: 'Planilha de Cálculo de Medicações',
      description: 'Ferramenta prática para cálculo de doses e diluições de medicamentos',
      type: 'planilhas',
      icon: FileSpreadsheet,
      size: '750 KB',
      pages: 3,
      downloads: 2876,
      category: 'Farmacologia',
      color: 'bg-[#dcfce7] text-[#16a34a]',
    },
    {
      id: '11',
      title: 'Protocolo de Intubação Orotraqueal',
      description: 'Passo a passo detalhado para procedimento de IOT com checklist de segurança',
      type: 'protocolos',
      icon: FileText,
      size: '3.1 MB',
      pages: 10,
      downloads: 1432,
      category: 'Protocolos Clínicos',
      color: 'bg-[#d1fae5] text-[#10b981]',
    },
    {
      id: '12',
      title: 'Apostila - Saúde da Mulher',
      description: 'Material completo sobre obstetrícia, ginecologia e cuidados específicos',
      type: 'apostilas',
      icon: Book,
      size: '9.2 MB',
      pages: 98,
      downloads: 765,
      category: 'Saúde da Mulher',
      color: 'bg-[#dbeafe] text-[#1e40af]',
    },
  ];

  const filteredMaterials = materials.filter((material) => {
    const matchesSearch = material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         material.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || material.type === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl mb-3">Materiais de Apoio</h1>
        <p className="text-[#64748b]">
          Acesse apostilas, protocolos e materiais complementares para seus estudos
        </p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Buscar materiais..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#64748b]" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all cursor-pointer"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.label} ({category.count})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-lg transition-all ${
              selectedCategory === category.id
                ? 'bg-[#1e40af] text-white shadow-lg shadow-[#1e40af]/20'
                : 'bg-white text-[#64748b] border border-[#e2e8f0] hover:border-[#1e40af] hover:text-[#1e40af]'
            }`}
          >
            {category.label}
            <span className="ml-2 opacity-75">({category.count})</span>
          </button>
        ))}
      </div>

      {/* Materials Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMaterials.map((material) => {
          const Icon = material.icon;
          return (
            <div
              key={material.id}
              className="bg-white rounded-xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${material.color} group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="mb-1 line-clamp-2">{material.title}</h3>
                  <span className="inline-block px-2 py-1 bg-[#f8fafc] text-[#64748b] rounded text-xs">
                    {material.category}
                  </span>
                </div>
              </div>

              <p className="text-sm text-[#64748b] mb-4 line-clamp-2">
                {material.description}
              </p>

              <div className="flex items-center justify-between text-sm text-[#64748b] mb-4">
                <span>{material.size}</span>
                <span>•</span>
                <span>{material.pages} {material.pages === 1 ? 'página' : 'páginas'}</span>
                <span>•</span>
                <span>{material.downloads.toLocaleString('pt-BR')} downloads</span>
              </div>

              <button className="w-full py-3 bg-[#1e40af] text-white rounded-lg hover:bg-[#1e3a8a] transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-[#1e40af]/20 group-hover:shadow-xl group-hover:shadow-[#1e40af]/30">
                <Download className="w-5 h-5" />
                Baixar Material
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredMaterials.length === 0 && (
        <div className="bg-white rounded-xl p-12 border border-[#e2e8f0] text-center">
          <div className="w-16 h-16 bg-[#f8fafc] rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-[#64748b]" />
          </div>
          <h3 className="mb-2">Nenhum material encontrado</h3>
          <p className="text-[#64748b]">
            Tente ajustar sua busca ou filtros para encontrar o que procura
          </p>
        </div>
      )}

      {/* Stats Footer */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-[#1e40af] to-[#3b82f6] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Book className="w-6 h-6" />
            <span className="text-2xl">24</span>
          </div>
          <p className="text-sm text-blue-100">Materiais disponíveis</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#10b981] to-[#059669] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Download className="w-6 h-6" />
            <span className="text-2xl">48</span>
          </div>
          <p className="text-sm text-green-100">Downloads realizados</p>
        </div>

        <div className="bg-gradient-to-br from-[#f59e0b] to-[#d97706] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-6 h-6" />
            <span className="text-2xl">12</span>
          </div>
          <p className="text-sm text-orange-100">Novos este mês</p>
        </div>

        <div className="bg-gradient-to-br from-[#6366f1] to-[#4f46e5] rounded-xl p-6 text-white shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <Video className="w-6 h-6" />
            <span className="text-2xl">156</span>
          </div>
          <p className="text-sm text-indigo-100">Videoaulas assistidas</p>
        </div>
      </div>
    </div>
  );
}
