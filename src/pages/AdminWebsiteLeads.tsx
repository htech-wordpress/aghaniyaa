import React from 'react';
import { LeadsPage } from '@/components/admin/LeadsPage';
import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminWebsiteLeads() {
  return (
    <AdminLayout>
      <LeadsPage category="all" title="Website Leads" />
    </AdminLayout>
  );
}
