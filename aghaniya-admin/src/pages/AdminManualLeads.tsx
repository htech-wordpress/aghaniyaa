
import { LeadsPage } from '@/components/admin/LeadsPage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminManualLeads() {
  return (
    <AdminLayout>
      <LeadsPage category="manual" title="Manual Leads" />
    </AdminLayout>
  );
}
