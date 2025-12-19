
import { LeadsPage } from '@/components/admin/LeadsPage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminCareers() {
  return (
    <AdminLayout>
      <LeadsPage category="careers" title="Careers" />
    </AdminLayout>
  );
}
