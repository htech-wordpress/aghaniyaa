import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { exportLeadsToCSV, getAllLeadsAsync, getLeadsByCategoryAsync } from '@/lib/storage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminExportLeads() {
  const [category, setCategory] = useState<string>('all');
  const navigate = useNavigate();

  const handleDownload = async () => {
    const all = await getAllLeadsAsync();
    const leads = category === 'all' ? all.filter(l => !String(l.data?.source || '').toLowerCase().includes('manual')) : await getLeadsByCategoryAsync(category as any);
    const csv = exportLeadsToCSV(leads);
    if (!csv) {
      alert('No leads to export.');
      return;
    }
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `leads_${category === 'all' ? 'website' : category}_${new Date().toISOString().split('T')[0]}.csv`;
    link.download = fileName;
    link.click();
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Export Leads (CSV)</h2>
        <p className="text-sm text-gray-600 mb-4">Download leads as CSV. You can export all leads or filter by category.</p>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <label className="text-sm text-gray-600">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="border rounded px-2 py-1 text-sm">
              <option value="all">All (Website Leads)</option>
              <option value="home-loan">Home Loan</option>
              <option value="personal-loan">Personal Loan</option>
              <option value="business-loan">Business Loan</option>
              <option value="education-loan">Education Loan</option>
              <option value="car-loan">Car Loan</option>
              <option value="gold-loan">Gold Loan</option>
              <option value="loan-against-property">Loan against Property</option>
              <option value="credit-card">Credit Cards</option>
              <option value="cibil-check">CIBIL Check</option>
              <option value="contact">Contact Form</option>
              <option value="careers">Careers</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Button onClick={handleDownload} variant="default">Download CSV</Button>
            <Button variant="outline" onClick={() => navigate('/admin/leads')}>Back</Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
