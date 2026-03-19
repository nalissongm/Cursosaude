import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ModulePage } from './components/ModulePage';
import { VideoPlayer } from './components/VideoPlayer';
import { SimuladoPage } from './components/SimuladoPage';
import { MaterialsPage } from './components/MaterialsPage';
import { CertificatesPage } from './components/CertificatesPage';
import { MyCoursesPage } from './components/MyCoursesPage';

type Page = 'login' | 'dashboard' | 'courses' | 'module' | 'player' | 'simulados' | 'materials' | 'certificates';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const userName = 'Maria Silva';

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  const handleNavigateToCourse = (courseId: string) => {
    setCurrentPage('module');
  };

  const handleNavigateToPlayer = (lessonId: string) => {
    setCurrentPage('player');
  };

  const handleExitSimulado = () => {
    setCurrentPage('dashboard');
  };

  // Login screen
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // Video Player (full screen, no sidebar/header modifications)
  if (currentPage === 'player') {
    return (
      <div className="min-h-screen bg-white">
        <Header userName={userName} />
        <VideoPlayer />
      </div>
    );
  }

  // Simulado (full screen, no sidebar)
  if (currentPage === 'simulados') {
    return <SimuladoPage onExit={handleExitSimulado} />;
  }

  // Main app layout with sidebar
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header userName={userName} />
      <div className="flex">
        <Sidebar currentPage={currentPage} onNavigate={handleNavigate} />
        <main className="flex-1 ml-20 lg:ml-64">
          {currentPage === 'dashboard' && (
            <Dashboard userName={userName} onNavigateToCourse={handleNavigateToCourse} />
          )}
          {currentPage === 'module' && (
            <ModulePage onNavigateToPlayer={handleNavigateToPlayer} />
          )}
          {currentPage === 'courses' && (
            <MyCoursesPage onNavigateToCourse={handleNavigateToCourse} />
          )}
          {currentPage === 'materials' && (
            <MaterialsPage />
          )}
          {currentPage === 'certificates' && (
            <CertificatesPage />
          )}
        </main>
      </div>
    </div>
  );
}