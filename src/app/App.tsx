import { Routes, Route, Navigate, Outlet } from 'react-router';
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

        {/* Protected Main Routes with Nested Dashboard */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requireOnboarding={true}>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<MyCoursesPage />} />
          <Route path="certificados" element={<CertificatesPage />} />
          <Route path="simulados" element={<SimuladoPage onExit={() => {}} />} />
          <Route path="materiais" element={<MaterialsPage />} />
          <Route path="cursos" element={<MyCoursesPage />} />
        </Route>

        {/* Other Protected Routes */}
        <Route 
          path="/player" 
          element={
            <ProtectedRoute requireOnboarding={true}>
              <VideoPlayer />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/module" 
          element={
            <ProtectedRoute requireOnboarding={true}>
              <ModulePage onNavigateToPlayer={() => {}} />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  );
}
