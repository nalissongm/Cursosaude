import { Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from '../context/AuthContext';
import { ProtectedRoute } from '../components/ProtectedRoute';

// Pages
import { LoginPage } from './components/LoginPage';
import { FirstAccessPage } from './components/FirstAccessPage';
import { ForgotPasswordPage } from './components/ForgotPasswordPage';
import { ResetPasswordPage } from './components/ResetPasswordPage';
import { RegisterEmailPage } from './components/RegisterEmailPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';
import { CompleteProfilePage } from './components/CompleteProfilePage';
import { Dashboard } from './components/Dashboard';
import { MyCoursesPage } from './components/MyCoursesPage';
import { ModulePage } from './components/ModulePage';
import { VideoPlayer } from './components/VideoPlayer';
import { SimuladoPage } from './components/SimuladoPage';
import { MaterialsPage } from './components/MaterialsPage';
import { CertificatesPage } from './components/CertificatesPage';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { useLocation } from 'react-router';

function MainLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isPlayer = location.pathname.includes('/player');
  const isSimulado = location.pathname.includes('/simulado');

  if (isSimulado) return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Header userName="Usuário" />
      <div className="flex">
        {!isPlayer && <Sidebar currentPage={location.pathname.split('/')[1]} onNavigate={() => {}} />}
        <main className={`flex-1 ${!isPlayer ? 'ml-20 lg:ml-64' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/primeiro-acesso" element={<FirstAccessPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Protected Onboarding Routes */}
        <Route 
          path="/onboarding/email" 
          element={
            <ProtectedRoute requireOnboarding={false}>
              <RegisterEmailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding/verify" 
          element={
            <ProtectedRoute requireOnboarding={false}>
              <VerifyEmailPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/onboarding/profile" 
          element={
            <ProtectedRoute requireOnboarding={false}>
              <CompleteProfilePage />
            </ProtectedRoute>
          } 
        />

        {/* Protected Main Routes */}
        <Route 
          path="/*" 
          element={
            <ProtectedRoute requireOnboarding={true}>
              <MainLayout>
                <Routes>
                  <Route path="/dashboard" element={<Dashboard userName="Usuário" onNavigateToCourse={() => {}} />} />
                  <Route path="/my-courses" element={<MyCoursesPage onNavigateToCourse={() => {}} />} />
                  <Route path="/module" element={<ModulePage onNavigateToPlayer={() => {}} />} />
                  <Route path="/player" element={<VideoPlayer />} />
                  <Route path="/simulado" element={<SimuladoPage onExit={() => {}} />} />
                  <Route path="/materials" element={<MaterialsPage />} />
                  <Route path="/certificates" element={<CertificatesPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </AuthProvider>
  );
}
