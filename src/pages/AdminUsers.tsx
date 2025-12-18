import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { getAdminList, addAdminByUid, isSuperUser } from '@/lib/firebase';

export function AdminUsers() {
  const [admins, setAdmins] = useState<Array<{ id: string; data: any }>>([]);
  const [uid, setUid] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await isSuperUser((await import('firebase/auth')).getAuth()?.currentUser || null);
      setAuthorized(ok);
      if (ok) {
        const list = await getAdminList();
        setAdmins(list);
      }
    })();
  }, []);

  const handleAdd = async () => {
    if (!uid) return alert('Enter UID');
    try {
      await addAdminByUid(uid, { email: profileEmail });
      const list = await getAdminList();
      setAdmins(list);
      setUid(''); setProfileEmail('');
      alert('Admin added');
    } catch (e) {
      console.error(e);
      alert('Failed to add admin');
    }
  };

  if (!authorized) return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Users</h2>
        <div className="text-sm text-gray-600">You must be a superuser to manage admin accounts.</div>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">Admin Users</h2>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">UID</label>
          <input className="w-full border rounded px-3 py-2" value={uid} onChange={(e) => setUid(e.target.value)} />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email (optional)</label>
          <input className="w-full border rounded px-3 py-2" value={profileEmail} onChange={(e) => setProfileEmail(e.target.value)} />
        </div>
        <div className="flex items-center gap-2 mb-6">
          <Button onClick={handleAdd}>Create Admin</Button>
        </div>

        <h3 className="text-lg font-semibold mb-2">Existing Admins</h3>
        <ul className="list-disc pl-5">
          {admins.map(a => (
            <li key={a.id}>{a.id} — {a.data?.email || 'no-email'}</li>
          ))}
        </ul>
      </div>
    </AdminLayout>
  );
}
