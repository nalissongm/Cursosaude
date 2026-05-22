import { Outlet, useLocation } from 'react-router';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const location = useLocation();
  const userName = user?.name || 'Usuário';

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header userName={userName} />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 ml-20 lg:ml-64">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
