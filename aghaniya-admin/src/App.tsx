import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { AdminLogin } from '@/pages/AdminLogin';
import { AdminDashboard } from '@/pages/AdminDashboard';
import { AdminWebsiteLeads } from '@/pages/AdminWebsiteLeads';
import { AdminManualLeads } from '@/pages/AdminManualLeads';
import { AdminContacts } from '@/pages/AdminContacts';
import { AdminCareers } from '@/pages/AdminCareers';
import { AdminCibilCheck } from '@/pages/AdminCibilCheck';

import { AdminSettings } from '@/pages/AdminSettings';
import { AdminUsers } from '@/pages/AdminUsers';
import { AdminExportLeads } from '@/pages/AdminExportLeads';
import { AdminImportLeads } from '@/pages/AdminImportLeads';
import { AdminSuperAdminSettings } from '@/pages/AdminSuperAdminSettings';
import { AdminAgents } from '@/pages/AdminAgents';
import { AgentSelfLeads } from '@/pages/AgentSelfLeads';
import { AgentContactManager } from '@/pages/AgentContactManager';
import { AgentUserProfile } from '@/pages/AgentUserProfile';
import { ManagerTeamDashboard } from '@/pages/ManagerTeamDashboard';
import { AdminPerformanceDashboard } from '@/pages/AdminPerformanceDashboard';
import { AgentProvider, useAgent } from '@/contexts/AgentContext';
import { AgentDashboard } from '@/pages/AgentDashboard';
import './App.css';

const DashboardHome = () => {
  const { currentAgent, loading } = useAgent();

  if (loading) {
    return <div className="p-10 flex justify-center text-gray-500">Loading...</div>;
  }

  // If user is Admin or has no specific agent profile, show Admin Dashboard
  if (!currentAgent || currentAgent.role === 'admin') {
    return <AdminDashboard />;
  }

  return <AgentDashboard />;
};

function App() {
  return (
    <AgentProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-gray-50">
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Login route */}
            <Route path="/login" element={<AdminLogin />} />

            {/* Protected admin routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardHome />
                </ProtectedRoute>
              }
            />
            <Route path="/leads/website" element={<ProtectedRoute><AdminWebsiteLeads /></ProtectedRoute>} />
            <Route path="/leads/manual" element={<ProtectedRoute><AdminManualLeads /></ProtectedRoute>} />
            <Route path="/leads/contacts" element={<ProtectedRoute><AdminContacts /></ProtectedRoute>} />
            <Route path="/leads/careers" element={<ProtectedRoute><AdminCareers /></ProtectedRoute>} />
            <Route path="/leads/cibil" element={<ProtectedRoute><AdminCibilCheck /></ProtectedRoute>} />

            <Route path="/settings" element={<ProtectedRoute><AdminSettings /></ProtectedRoute>} />
            <Route path="/agents" element={<ProtectedRoute><AdminAgents /></ProtectedRoute>} />
            <Route path="/users" element={<ProtectedRoute><AdminUsers /></ProtectedRoute>} />
            <Route path="/superadmin" element={<ProtectedRoute><AdminSuperAdminSettings /></ProtectedRoute>} />
            <Route path="/export" element={<ProtectedRoute><AdminExportLeads /></ProtectedRoute>} />
            <Route path="/import" element={<ProtectedRoute><AdminImportLeads /></ProtectedRoute>} />

            {/* Agent-specific routes */}
            <Route path="/my-leads" element={<ProtectedRoute><AgentSelfLeads /></ProtectedRoute>} />
            <Route path="/contact-manager" element={<ProtectedRoute><AgentContactManager /></ProtectedRoute>} />
            <Route path="/user-profile" element={<ProtectedRoute><AgentUserProfile /></ProtectedRoute>} />

            {/* Manager-specific routes */}
            <Route path="/team-dashboard" element={<ProtectedRoute><ManagerTeamDashboard /></ProtectedRoute>} />

            {/* Admin-specific routes */}
            <Route path="/performance-dashboard" element={<ProtectedRoute><AdminPerformanceDashboard /></ProtectedRoute>} />

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AgentProvider>
  );
}

export default App;
