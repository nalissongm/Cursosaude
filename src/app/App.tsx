import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { LoginPage } from './components/LoginPage';
import { RegisterEmailPage } from './components/RegisterEmailPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { CompleteProfilePage } from './components/CompleteProfilePage';
import { Dashboard } from './components/Dashboard';
import { ModulePage } from './components/ModulePage';
import { MyCoursesPage } from './components/MyCoursesPage';
import { MaterialsPage } from './components/MaterialsPage';
import { CertificatesPage } from './components/CertificatesPage';
import { VideoPlayer } from './components/VideoPlayer';
import { SimuladoPage } from './components/SimuladoPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useLocation } from 'react-router';

function AppLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isPlayer = location.pathname.includes('/player');
  const isSimulado = location.pathname.includes('/simulado');
  const userName = 'Maria Silva'; // This should ideally come from useAuth()

  if (isSimulado) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header userName={userName} />
      <div className="flex">
        {!isPlayer && <Sidebar currentPage={location.pathname.split('/')[1] || 'dashboard'} onNavigate={() => {}} />}
        <main className={`flex-1 ${!isPlayer ? 'ml-20 lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
          
          {/* Onboarding Routes */}
          <Route 
            path="/onboarding/email" 
            element={
              <ProtectedRoute>
                <RegisterEmailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding/verify" 
            element={
              <ProtectedRoute>
                <VerifyEmailPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/onboarding/profile" 
            element={
              <ProtectedRoute>
                <CompleteProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Protected App Routes */}
          <Route 
            path="/*" 
            element={
              <ProtectedRoute requireOnboardingCompleted={true}>
                <AppLayout>
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard userName="Maria Silva" onNavigateToCourse={() => {}} />} />
                    <Route path="/courses" element={<MyCoursesPage onNavigateToCourse={() => {}} />} />
                    <Route path="/module" element={<ModulePage onNavigateToPlayer={() => {}} />} />
                    <Route path="/player" element={<VideoPlayer />} />
                    <Route path="/simulado" element={<SimuladoPage onExit={() => {}} />} />
                    <Route path="/materials" element={<MaterialsPage />} />
                    <Route path="/certificates" element={<CertificatesPage />} />
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  </Routes>
                </AppLayout>
              </ProtectedRoute>
            } 
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
