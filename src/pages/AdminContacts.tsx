
import { LeadsPage } from '@/components/admin/LeadsPage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminContacts() {
  return (
    <AdminLayout>
      <LeadsPage category="contact" title="Contacts" />
    </AdminLayout>
  );
}
