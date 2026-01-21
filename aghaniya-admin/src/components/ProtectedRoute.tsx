import { Navigate, useLocation } from 'react-router-dom';
import { useAgent } from '@/contexts/AgentContext';
import { RefreshCw } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredModule?: string;
}

export function ProtectedRoute({ children, requiredModule }: ProtectedRouteProps) {
  const { currentAgent, isSuperAdmin, accessibleModules, loading } = useAgent();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="h-8 w-8 animate-spin text-primary" />
          <p className="text-gray-500">Verifying access...</p>
        </div>
      </div>
    );
  }

  // Not logged in
  if (!currentAgent && !isSuperAdmin) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check module access if a specific module is required
  if (requiredModule) {
    const hasAccess =
      isSuperAdmin ||
      accessibleModules.includes('*') ||
      accessibleModules.includes(requiredModule);

    if (!hasAccess) {
      console.warn(`Access denied to module: ${requiredModule} for user: ${currentAgent?.email}`);
      // Redirect to the first accessible module or dashboard
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
}
