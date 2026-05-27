import React from 'react';
import { Navigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: ('ADMIN' | 'INSTRUCTOR' | 'STUDENT')[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f8fafc]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e40af]"></div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role as any)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
