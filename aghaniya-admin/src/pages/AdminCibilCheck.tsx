
import { LeadsPage } from '@/components/admin/LeadsPage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminCibilCheck() {
  return (
    <AdminLayout>
      <LeadsPage category="cibil-check" title="CIBIL Check" />
    </AdminLayout>
  );
}
