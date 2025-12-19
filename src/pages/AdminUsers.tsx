import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { getAuthorizedAdminEmails, addAdminEmail, removeAdminEmail, isSuperUser } from '@/lib/firebase';
import { Trash2, UserPlus, ShieldAlert } from 'lucide-react';

export function AdminUsers() {
  const [adminEmails, setAdminEmails] = useState<string[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const ok = await isSuperUser((await import('firebase/auth')).getAuth()?.currentUser || null);
      setAuthorized(ok);
      if (ok) {
        loadEmails();
      }
    })();
  }, []);

  const loadEmails = async () => {
    const list = await getAuthorizedAdminEmails();
    setAdminEmails(list);
  };

  const handleAdd = async () => {
    if (!newEmail || !newEmail.includes('@')) return alert('Enter a valid email');
    try {
      setLoading(true);
      await addAdminEmail(newEmail.trim());
      await loadEmails();
      setNewEmail('');
      alert('Admin email added. They can now login with Google.');
    } catch (e) {
      console.error(e);
      alert('Failed to add admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (email: string) => {
    if (!confirm(`Revoke admin access for ${email}?`)) return;
    try {
      setLoading(true);
      await removeAdminEmail(email);
      await loadEmails();
    } catch (e) {
      console.error(e);
      alert('Failed to remove admin');
    } finally {
      setLoading(false);
    }
  };

  if (!authorized) return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center py-20">
        <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
        <p className="text-gray-600">You must be a superuser to manage admin accounts.</p>
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Admin Access Control</h2>
            <p className="text-sm text-gray-500">Manage who can access the admin panel by email.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add New Admin */}
          <div className="lg:col-span-1">
            <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-blue-600" />
                Add New Admin
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Google Email Address</label>
                  <input
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="colleague@example.com"
                    onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
                  />
                  <p className="text-xs text-gray-600 mt-2">
                    Users must use "Sign in with Google" with this email to access the admin panel.
                  </p>
                </div>
                <Button className="w-full" onClick={handleAdd} disabled={loading}>
                  {loading ? 'Adding...' : 'Grant Access'}
                </Button>
              </div>
            </div>
          </div>

          {/* List Existing Admins */}
          <div className="lg:col-span-2">
            <div className="border rounded-md overflow-hidden">
              <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
                <h3 className="font-medium text-gray-700">Authorized Emails</h3>
                <span className="text-xs bg-gray-200 px-2 py-1 rounded-full text-gray-600">
                  {adminEmails.length} Users
                </span>
              </div>

              {adminEmails.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No additional admins configured.
                </div>
              ) : (
                <table className="w-full text-sm text-left">
                  <tbody className="divide-y">
                    {adminEmails.map(email => (
                      <tr key={email} className="hover:bg-gray-50 group">
                        <td className="px-4 py-3 font-medium text-gray-800">{email}</td>
                        <td className="px-4 py-3 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleRemove(email)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
