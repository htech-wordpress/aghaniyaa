import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getAdminProfile, setAdminProfile } from '@/lib/storage';
import { Button } from '@/components/ui/button';

export function AdminSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    const p = getAdminProfile();
    setName(p.name || '');
    setEmail(p.email || '');
  }, []);

  const handleSave = () => {
    setAdminProfile({ name, email });
    alert('Settings saved.');
  };

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button onClick={handleSave}>Save</Button>
        </div>



      </div>
    </AdminLayout>
  );
}
