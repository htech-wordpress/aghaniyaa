import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Home } from '@/pages/Home';
import { About } from '@/pages/About';
import { Contact } from '@/pages/Contact';
import { Loans } from '@/pages/Loans';
import { LoanDetail } from '@/pages/LoanDetail';
import { CreditCards } from '@/pages/CreditCards';
import { EMICalculator } from '@/pages/EMICalculator';
import { CibilCheck } from '@/pages/CibilCheck';
import { OurTeam } from '@/pages/OurTeam';
import { Careers } from '@/pages/Careers';
import { AdminLogin } from '@/pages/AdminLogin';

import { AdminImportLeads } from '@/pages/AdminImportLeads';
import { AdminExportLeads } from '@/pages/AdminExportLeads';
import { AdminWebsiteLeads } from '@/pages/AdminWebsiteLeads';
import { AdminManualLeads } from '@/pages/AdminManualLeads';
import { AdminContacts } from '@/pages/AdminContacts';
import { AdminCareers } from '@/pages/AdminCareers';
import { AdminCibilCheck } from '@/pages/AdminCibilCheck';
import { AdminOverview } from '@/pages/AdminOverview';
import { AdminSettings } from '@/pages/AdminSettings';
import { AdminSupport } from '@/pages/AdminSupport';
import { WhatsAppButton } from '@/components/WhatsAppButton';

function App() {
  // chnages
  // Get base path from environment variable (for GitHub Pages deployment)
  const basePath = import.meta.env.VITE_BASE_PATH || '/';

  return (
    <BrowserRouter basename={basePath}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/loans" element={<Loans />} />
            <Route path="/loans/:loanType" element={<LoanDetail />} />
            <Route path="/credit-cards" element={<CreditCards />} />
            <Route path="/emi-calculator" element={<EMICalculator />} />
            <Route path="/cibil-check" element={<CibilCheck />} />
            <Route path="/our-team" element={<OurTeam />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute>
                  <AdminOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminOverview />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads"
              element={
                <ProtectedRoute>
                  <AdminWebsiteLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads/manual"
              element={
                <ProtectedRoute>
                  <AdminManualLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads/contacts"
              element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads/careers"
              element={
                <ProtectedRoute>
                  <AdminCareers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads/cibil"
              element={
                <ProtectedRoute>
                  <AdminCibilCheck />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads/import"
              element={
                <ProtectedRoute>
                  <AdminImportLeads />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/leads/export"
              element={
                <ProtectedRoute>
                  <AdminExportLeads />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/settings"
              element={
                <ProtectedRoute>
                  <AdminSettings />
                </ProtectedRoute>
              }
            />

            <Route
              path="/admin/support"
              element={
                <ProtectedRoute>
                  <AdminSupport />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </BrowserRouter>
  );
}

export default App;
