import { Home, BookOpen, FileText, ClipboardList, Award } from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Início' },
    { id: 'courses', icon: BookOpen, label: 'Meus Cursos' },
    { id: 'simulados', icon: ClipboardList, label: 'Simulados' },
    { id: 'materials', icon: FileText, label: 'Materiais' },
    { id: 'certificates', icon: Award, label: 'Certificados' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-[#f8fafc] border-r border-[#e2e8f0] fixed left-0 top-[73px] bottom-0 z-30">
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-[#1e40af] text-white shadow-lg shadow-[#1e40af]/20'
                  : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1e40af]'
              }`}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
