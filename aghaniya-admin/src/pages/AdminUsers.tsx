import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getDatabaseInstance, isSuperUser } from '@/lib/firebase';
import { ref, get, push, set, update, remove, child } from 'firebase/database';
import { UserPlus, Pencil, Trash2, ShieldAlert, Shield } from 'lucide-react';
import { ADMIN_MODULES } from '@/config/modules';

interface AdminUser {
  id: string;
  adminId: string;
  name: string;
  email: string;
  phone?: string;
  department?: string;
  managerName?: string; // Manual input for director/manager name
  joiningDate?: string;
  modules?: string[]; // Added modules
  status: 'active' | 'inactive';
  createdAt: string;
}

export function AdminUsers() {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    adminId: '', // Auto-generated with AG prefix
    name: '',
    email: '',
    phone: '',
    department: '',
    managerName: '',
    joiningDate: new Date().toISOString().split('T')[0],
    modules: [] as string[], // Default empty modules
    status: 'active' as 'active' | 'inactive',
  });

  useEffect(() => {
    checkSuperUser();
  }, []);

  useEffect(() => {
    if (isDialogOpen && !editingAdmin) {
      generateNextAdminId();
    }
  }, [isDialogOpen]);

  const generateNextAdminId = async () => {
    const db = getDatabaseInstance();
    if (!db) return;

    try {
      // Get global employee counter from settings
      const counterRef = child(ref(db), 'settings/employeeCounter');
      const counterSnap = await get(counterRef);
      let nextNumber = 1;

      if (counterSnap.exists()) {
        nextNumber = (counterSnap.val().lastNumber || 0) + 1;
      }

      // Admin ID format: AG001, AG002, etc.
      const paddedNumber = String(nextNumber).padStart(3, '0');
      const newAdminId = `AG${paddedNumber}`;

      setFormData(prev => ({ ...prev, adminId: newAdminId }));
    } catch (error) {
      console.error('Error generating admin ID:', error);
    }
  };

  const checkSuperUser = async () => {
    const ok = await isSuperUser((await import('firebase/auth')).getAuth()?.currentUser || null);
    setAuthorized(ok);
    if (ok) {
      loadAdminUsers();
    }
  };

  const loadAdminUsers = async () => {
    setLoading(true);
    const db = getDatabaseInstance();
    if (!db) {
      setLoading(false);
      return;
    }

    try {
      const adminsRef = ref(db, 'adminUsers');
      const snapshot = await get(adminsRef);

      const adminsList: AdminUser[] = [];

      snapshot.forEach((childSnap) => {
        const val = childSnap.val();
        adminsList.push({ id: childSnap.key!, ...val } as AdminUser);
      });

      // Sort by createdAt desc if possible, otherwise by key/creation order?
      // Assuming createdAt exists
      adminsList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      setAdminUsers(adminsList);
    } catch (error) {
      console.error('Error loading admin users:', error);
      alert('Failed to load admin users');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.adminId || !formData.name || !formData.email) {
      alert('Please fill in all required fields');
      return;
    }

    // Check for duplicate admin ID
    if (!editingAdmin && adminUsers.some(admin => admin.adminId === formData.adminId)) {
      alert(`Admin ID ${formData.adminId} already exists`);
      return;
    }

    const db = getDatabaseInstance();
    if (!db) return;

    setLoading(true);
    try {
      const adminData = {
        ...formData,
        createdAt: editingAdmin?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (editingAdmin) {
        await update(ref(db, `adminUsers/${editingAdmin.id}`), adminData);
        alert('Admin user updated successfully!');
      } else {
        const adminsRef = ref(db, 'adminUsers');
        const newAdminRef = push(adminsRef);

        await set(newAdminRef, {
          ...adminData,
          createdAt: new Date().toISOString(),
        });

        // Increment global employee counter
        const counterRef = child(ref(db), 'settings/employeeCounter');
        const counterSnap = await get(counterRef);
        const currentNumber = counterSnap.exists() ? (counterSnap.val().lastNumber || 0) : 0;

        await update(counterRef, { lastNumber: currentNumber + 1 });

        alert('Admin user added successfully!');
      }

      setIsDialogOpen(false);
      resetForm();
      loadAdminUsers();
    } catch (error) {
      console.error('Error saving admin user:', error);
      alert('Failed to save admin user');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    setFormData({
      adminId: admin.adminId,
      name: admin.name,
      email: admin.email,
      phone: admin.phone || '',
      department: admin.department || '',
      managerName: admin.managerName || '',
      joiningDate: admin.joiningDate || new Date().toISOString().split('T')[0],
      modules: admin.modules || [],
      status: admin.status,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (admin: AdminUser) => {
    if (!confirm(`Are you sure you want to delete ${admin.name}?`)) return;

    const db = getDatabaseInstance();
    if (!db) return;

    setLoading(true);
    try {
      await remove(ref(db, `adminUsers/${admin.id}`));
      alert('Admin user deleted successfully!');
      loadAdminUsers();
    } catch (error) {
      console.error('Error deleting admin user:', error);
      alert('Failed to delete admin user');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      adminId: '',
      name: '',
      email: '',
      phone: '',
      department: '',
      managerName: '',
      joiningDate: new Date().toISOString().split('T')[0],
      modules: [],
      status: 'active',
    });
    setEditingAdmin(null);
  };

  if (!authorized) {
    return (
      <AdminLayout>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center py-20">
          <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-gray-600">You must be a superuser to manage admin accounts.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin User Management</h1>
            <p className="text-gray-600 mt-1">Manage admin users and their access credentials</p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={(open: boolean) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Add Admin User
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAdmin ? 'Edit Admin User' : 'Add New Admin User'}</DialogTitle>
                <DialogDescription>
                  {editingAdmin ? 'Update admin user information' : 'Add a new admin user to the system'}
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="adminId">Admin ID *</Label>
                    <input
                      id="adminId"
                      type="text"
                      required
                      value={formData.adminId}
                      readOnly
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                      placeholder="Auto-generated"
                    />
                    <p className="text-xs text-gray-500 mt-1">Auto-generated (Format: AG001, AG002...)</p>
                  </div>

                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="admin@example.com"
                    />
                    <p className="text-xs text-gray-500 mt-1">Must be a valid Google account</p>
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+91 1234567890"
                    />
                  </div>

                  <div>
                    <Label htmlFor="managerName">Manager/Director Name</Label>
                    <input
                      id="managerName"
                      type="text"
                      value={formData.managerName}
                      onChange={(e) => setFormData({ ...formData, managerName: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter manager or director name"
                    />
                    <p className="text-xs text-gray-500 mt-1">Manually enter if not in system</p>
                  </div>

                  <div>
                    <Label htmlFor="department">Department</Label>
                    <input
                      id="department"
                      type="text"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Administration"
                    />
                  </div>

                  <div>
                    <Label htmlFor="joiningDate">Joining Date *</Label>
                    <input
                      id="joiningDate"
                      type="date"
                      required
                      value={formData.joiningDate}
                      onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <Label htmlFor="status">Status *</Label>
                    <select
                      id="status"
                      required
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                      className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <Label className="mb-2 block">Assigned Modules</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 border p-4 rounded-md bg-gray-50">
                      {ADMIN_MODULES.filter(m => m.id !== 'superadmin').map((module) => (
                        <div key={module.id} className="flex items-start space-x-2">
                          <input
                            type="checkbox"
                            id={`module-${module.id}`}
                            checked={formData.modules?.includes(module.id)}
                            onChange={(e) => {
                              const checked = e.target.checked;
                              setFormData(prev => ({
                                ...prev,
                                modules: checked
                                  ? [...(prev.modules || []), module.id]
                                  : (prev.modules || []).filter(id => id !== module.id)
                              }));
                            }}
                            className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                          <Label htmlFor={`module-${module.id}`} className="text-sm font-normal cursor-pointer leading-tight">
                            {module.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Select the modules this admin is allowed to access.</p>
                  </div>


                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : editingAdmin ? 'Update Admin' : 'Add Admin'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Admin Users List */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Users</CardTitle>
            <CardDescription>Manage all admin user accounts and their details</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && adminUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Loading admin users...</div>
            ) : adminUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No admin users found. Click "Add Admin User" to get started.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Admin ID</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Phone</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Manager/Director</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Department</th>
                      <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                      <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {adminUsers.map((admin) => (
                      <tr key={admin.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">
                          <div className="flex items-center">
                            <Shield className="h-4 w-4 text-red-500 mr-2" />
                            {admin.adminId}
                          </div>
                        </td>
                        <td className="px-4 py-3 font-medium">{admin.name}</td>
                        <td className="px-4 py-3 text-gray-600">{admin.email}</td>
                        <td className="px-4 py-3 text-gray-600">{admin.phone || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{admin.managerName || '-'}</td>
                        <td className="px-4 py-3 text-gray-600">{admin.department || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-1 text-xs rounded-full ${admin.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                            }`}>
                            {admin.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEdit(admin)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-500 hover:text-red-700"
                              onClick={() => handleDelete(admin)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
