import { Search, Bell } from 'lucide-react';

interface HeaderProps {
  userName: string;
}

export function Header({ userName }: HeaderProps) {
  return (
    <header className="bg-white border-b border-[#e2e8f0] sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#1e40af] rounded-lg flex items-center justify-center">
            <span className="text-white">+</span>
          </div>
          <span className="text-xl text-[#1e40af]">MedPrep</span>
        </div>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#64748b]" />
            <input
              type="text"
              placeholder="Buscar por cursos, aulas ou materiais..."
              className="w-full pl-12 pr-4 py-2.5 bg-[#f8fafc] border border-[#e2e8f0] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e40af] focus:border-transparent transition-all"
            />
          </div>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 hover:bg-[#f8fafc] rounded-lg transition-colors">
            <Bell className="w-5 h-5 text-[#64748b]" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#10b981] rounded-full"></span>
          </button>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-[#e2e8f0]">
            <div className="text-right hidden sm:block">
              <p className="text-sm">{userName}</p>
              <p className="text-xs text-[#64748b]">Aluno</p>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#1e40af] to-[#10b981] rounded-full flex items-center justify-center text-white">
              {userName.charAt(0).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
