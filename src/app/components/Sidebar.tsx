import { 
  Home, 
  BookOpen, 
  FileText, 
  ClipboardList, 
  Award, 
  Menu, 
  ChevronLeft, 
  Users, 
  BookMarked, 
  UserPlus, 
  MessageSquare,
  LayoutDashboard
} from 'lucide-react';
import { NavLink } from 'react-router';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ isOpen = true, onToggle }: SidebarProps) {
  const { user } = useAuth();
  const role = user?.role || 'STUDENT';

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard', icon: Home, label: 'Início', path: '/dashboard' },
    ];

    if (role === 'ADMIN') {
      return [
        ...commonItems,
        { id: 'admin-courses', icon: BookMarked, label: 'Gestão de Cursos', path: '/dashboard/gestao-cursos' },
        { id: 'users', icon: Users, label: 'Usuários', path: '/dashboard/usuarios' },
        { id: 'enrollments', icon: UserPlus, label: 'Matrículas', path: '/dashboard/matriculas' },
        { id: 'files', icon: FileText, label: 'Arquivos', path: '/dashboard/arquivos' },
        { id: 'doubts', icon: MessageSquare, label: 'Dúvidas', path: '/dashboard/duvidas' },
      ];
    }

    if (role === 'INSTRUCTOR') {
      return [
        ...commonItems,
        { id: 'admin-courses', icon: BookMarked, label: 'Meus Cursos', path: '/dashboard/gestao-cursos' },
        { id: 'files', icon: FileText, label: 'Arquivos', path: '/dashboard/arquivos' },
        { id: 'doubts', icon: MessageSquare, label: 'Dúvidas', path: '/dashboard/duvidas' },
      ];
    }

    // Default STUDENT items
    return [
      ...commonItems,
      { id: 'courses', icon: BookOpen, label: 'Meus Cursos', path: '/dashboard/cursos' },
      { id: 'simulados', icon: ClipboardList, label: 'Simulados', path: '/dashboard/simulados' },
      { id: 'materials', icon: FileText, label: 'Materiais', path: '/dashboard/materiais' },
      { id: 'certificates', icon: Award, label: 'Certificados', path: '/dashboard/certificados' },
    ];
  };

  const menuItems = getMenuItems();

  return (
    <aside 
      className={`
        bg-[#f8fafc] border-r border-[#e2e8f0] fixed left-0 top-[73px] bottom-0 z-30 
        transition-all duration-300 ease-in-out
        ${isOpen ? 'w-64' : 'w-20'}
      `}
    >
      <div className="flex flex-col h-full">
        {/* Toggle Button */}
        <div className={`p-4 flex ${isOpen ? 'justify-end' : 'justify-center'} border-b border-[#e2e8f0] mb-2`}>
          <button 
            onClick={onToggle}
            className="p-2 hover:bg-[#f1f5f9] rounded-lg transition-colors text-[#64748b] hover:text-[#1e40af]"
            title={isOpen ? "Recolher menu" : "Expandir menu"}
          >
            {isOpen ? <ChevronLeft className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.path === '/dashboard'}
                className={({ isActive }) => `
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                    ? 'bg-[#1e40af] text-white shadow-lg shadow-[#1e40af]/20 font-semibold'
                    : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1e40af]'}
                  ${!isOpen ? 'justify-center px-0' : ''}
                `}
                title={!isOpen ? item.label : undefined}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="whitespace-nowrap overflow-hidden transition-all duration-300">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
