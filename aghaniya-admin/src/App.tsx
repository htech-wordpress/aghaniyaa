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
import { AdminBranches } from '@/pages/AdminBranches';
import { AgentSelfLeads } from '@/pages/AgentSelfLeads';
import { AgentContactManager } from '@/pages/AgentContactManager';
import { AgentUserProfile } from '@/pages/AgentUserProfile';
import { ManagerTeamDashboard } from '@/pages/ManagerTeamDashboard';
import { AdminPerformanceDashboard } from '@/pages/AdminPerformanceDashboard';
import { AgentProvider, useAgent } from '@/contexts/AgentContext';
import { ConfigProvider } from '@/contexts/ConfigContext';
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
    <ConfigProvider>
      <AgentProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-gray-50">
            <Routes>
              {/* Redirect root to login */}
              <Route path="/" element={<Navigate to="/login" replace />} />

              {/* Login route */}
              <Route path="/login" element={<AdminLogin />} />

              {/* Protected admin routes */}
              {/* Protected admin routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute requiredModule="dashboard">
                    <DashboardHome />
                  </ProtectedRoute>
                }
              />
              <Route path="/leads/website" element={<ProtectedRoute requiredModule="leads_website"><AdminWebsiteLeads /></ProtectedRoute>} />
              <Route path="/leads/manual" element={<ProtectedRoute requiredModule="leads_manual"><AdminManualLeads /></ProtectedRoute>} />
              <Route path="/leads/contacts" element={<ProtectedRoute requiredModule="leads_contacts"><AdminContacts /></ProtectedRoute>} />
              <Route path="/leads/careers" element={<ProtectedRoute requiredModule="leads_careers"><AdminCareers /></ProtectedRoute>} />
              <Route path="/leads/cibil" element={<ProtectedRoute requiredModule="leads_cibil"><AdminCibilCheck /></ProtectedRoute>} />

              <Route path="/settings" element={<ProtectedRoute requiredModule="users"><AdminSettings /></ProtectedRoute>} />
              <Route path="/agents" element={<ProtectedRoute requiredModule="agents"><AdminAgents /></ProtectedRoute>} />
              <Route path="/users" element={<ProtectedRoute requiredModule="users"><AdminUsers /></ProtectedRoute>} />
              <Route path="/branches" element={<ProtectedRoute requiredModule="branches"><AdminBranches /></ProtectedRoute>} />
              <Route path="/superadmin" element={<ProtectedRoute requiredModule="superadmin"><AdminSuperAdminSettings /></ProtectedRoute>} />
              <Route path="/export" element={<ProtectedRoute requiredModule="leads_website"><AdminExportLeads /></ProtectedRoute>} />
              <Route path="/import" element={<ProtectedRoute requiredModule="leads_website"><AdminImportLeads /></ProtectedRoute>} />

              {/* Agent-specific routes */}
              <Route path="/my-leads" element={<ProtectedRoute requiredModule="my_leads"><AgentSelfLeads /></ProtectedRoute>} />
              <Route path="/contact-manager" element={<ProtectedRoute requiredModule="dashboard"><AgentContactManager /></ProtectedRoute>} />
              <Route path="/user-profile" element={<ProtectedRoute requiredModule="user_profile"><AgentUserProfile /></ProtectedRoute>} />

              {/* Manager-specific routes */}
              <Route path="/team-dashboard" element={<ProtectedRoute requiredModule="team_dashboard"><ManagerTeamDashboard /></ProtectedRoute>} />

              {/* Admin-specific routes */}
              <Route path="/performance-dashboard" element={<ProtectedRoute requiredModule="performance"><AdminPerformanceDashboard /></ProtectedRoute>} />

              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AgentProvider>
    </ConfigProvider>
  );
}

export default App;
