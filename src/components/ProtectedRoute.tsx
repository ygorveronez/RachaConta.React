import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-pulse-soft text-brand-600 font-display text-xl">RachaConta</div>
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/entrar" state={{ from: location }} replace />;
  }
  return <>{children}</>;
}
