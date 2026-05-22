import { Home, BookOpen, FileText, ClipboardList, Award } from 'lucide-react';
import { NavLink } from 'react-router';

export function Sidebar() {
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Início', path: '/dashboard' },
    { id: 'courses', icon: BookOpen, label: 'Meus Cursos', path: '/dashboard/cursos' },
    { id: 'simulados', icon: ClipboardList, label: 'Simulados', path: '/dashboard/simulados' },
    { id: 'materials', icon: FileText, label: 'Materiais', path: '/dashboard/materiais' },
    { id: 'certificates', icon: Award, label: 'Certificados', path: '/dashboard/certificados' },
  ];

  return (
    <aside className="w-20 lg:w-64 bg-[#f8fafc] border-r border-[#e2e8f0] fixed left-0 top-[73px] bottom-0 z-30">
      <nav className="p-4 space-y-2">
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
                  ? 'bg-[#1e40af] text-white shadow-lg shadow-[#1e40af]/20'
                  : 'text-[#475569] hover:bg-[#f1f5f9] hover:text-[#1e40af]'}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="hidden lg:block">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}
