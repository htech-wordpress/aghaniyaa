import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getAdminProfile, setAdminProfile, setAdminPassword, initAdminPassword, migrateLocalLeadsToFirestore } from '@/lib/storage';
import { Button } from '@/components/ui/button';
import { addSuperAdminEmail, getSuperAdminEmails } from '@/lib/firebase';

export function AdminSettings() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');

  useEffect(() => {
    initAdminPassword();
    const p = getAdminProfile();
    setName(p.name || '');
    setEmail(p.email || '');
  }, []);

  const [superEmail, setSuperEmail] = useState('');
  const [superEmailsList, setSuperEmailsList] = useState<string[]>([]);

  const loadSuperEmails = async () => {
    const list = await getSuperAdminEmails();
    setSuperEmailsList(list);
  };

  useEffect(() => { loadSuperEmails(); }, []);

  const handleSave = () => {
    setAdminProfile({ name, email });
    alert('Settings saved.');
  };

  const handleChangePassword = () => {
    if (!newPassword) { alert('Enter a new password'); return; }
    setAdminPassword(newPassword);
    setNewPassword('');
    alert('Password updated.');
  };

  const handleAddSuper = async () => {
    if (!superEmail || !superEmail.includes('@')) { alert('Enter a valid email'); return; }
    try {
      await addSuperAdminEmail(superEmail);
      alert('Superuser email added');
      setSuperEmail('');
      await loadSuperEmails();
    } catch (e) {
      alert('Failed to add superuser');
    }
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

        <hr className="my-6" />

        <h3 className="text-lg font-semibold mb-2">Change Admin Password</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
            <input type="password" className="w-full border rounded px-3 py-2" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          </div>
          <div>
            <Button onClick={handleChangePassword}>Change password</Button>
          </div>
        </div>

        <hr className="my-6" />

        <h3 className="text-lg font-semibold mb-2">Superusers (can create admins)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end mb-4">
          <div>
            <input className="w-full border rounded px-3 py-2" placeholder="email@example.com" value={superEmail} onChange={(e) => setSuperEmail(e.target.value)} />
          </div>
          <div>
            <Button onClick={handleAddSuper}>Add Superuser</Button>
          </div>
        </div>

        <div className="mb-4">
          {superEmailsList.length === 0 ? (
            <div className="text-sm text-gray-500">No superusers added yet.</div>
          ) : (
            <ul className="list-disc pl-5 text-sm">
              {superEmailsList.map((e) => (
                <li key={e}>{e}</li>
              ))}
            </ul>
          )}
        </div>

        <hr className="my-6" />
        <h3 className="text-lg font-semibold mb-2">Migrate local leads to Firestore</h3>
        <div className="flex items-center gap-2 mb-4">
          <Button onClick={async () => {
            try {
              const res = await migrateLocalLeadsToFirestore();
              alert(`Migrated ${res.migrated} leads; skipped ${res.skipped} already-existing leads.`);
            } catch (e) {
              alert('Migration failed: ' + (e as Error).message);
            }
          }}>Migrate Local Leads</Button>
          <div className="text-sm text-gray-500">Run this from the admin browser session to copy local leads into Firestore. Ensure you are signed in as an admin.</div>
        </div>

      </div>
    </AdminLayout>
  );
}
