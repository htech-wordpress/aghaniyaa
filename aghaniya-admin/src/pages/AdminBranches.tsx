import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Plus, Pencil, Trash2, MapPin, Phone, CheckCircle, XCircle } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import {
    saveBranchAsync,
    updateBranchAsync,
    deleteBranchAsync,
    subscribeToBranches,
    type Branch
} from '@/lib/branches';

export function AdminBranches() {
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingBranch, setEditingBranch] = useState<Branch | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        phone: '',
        mapLink: '',
        status: 'active' as 'active' | 'inactive'
    });

    useEffect(() => {
        const unsubscribe = subscribeToBranches((data) => {
            setBranches(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const handleOpenDialog = (branch?: Branch) => {
        if (branch) {
            setEditingBranch(branch);
            setFormData({
                name: branch.name,
                address: branch.address,
                city: branch.city,
                state: branch.state,
                phone: branch.phone,
                mapLink: branch.mapLink,
                status: branch.status
            });
        } else {
            setEditingBranch(null);
            setFormData({
                name: '',
                address: '',
                city: '',
                state: '',
                phone: '',
                mapLink: '',
                status: 'active'
            });
        }
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this branch?')) {
            await deleteBranchAsync(id);
        }
    };

    const handleSave = async () => {
        try {
            if (editingBranch) {
                await updateBranchAsync({
                    id: editingBranch.id,
                    createdAt: editingBranch.createdAt,
                    ...formData
                });
            } else {
                await saveBranchAsync(formData);
            }
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Error saving branch:', error);
            alert('Failed to save branch');
        }
    };

    const toggleStatus = async (branch: Branch) => {
        const newStatus = branch.status === 'active' ? 'inactive' : 'active';
        await updateBranchAsync({ ...branch, status: newStatus });
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Branch Management</h1>
                <Button onClick={() => handleOpenDialog()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Branch
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-10 text-gray-500">Loading branches...</div>
            ) : branches.length === 0 ? (
                <div className="text-center py-10 bg-white rounded-lg border border-gray-200">
                    <p className="text-gray-500 mb-4">No branches found.</p>
                    <Button variant="outline" onClick={() => handleOpenDialog()}>
                        Create your first branch
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {branches.map((branch) => (
                        <Card key={branch.id} className="relative group">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-900">{branch.name}</h3>
                                        <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                            <MapPin className="w-3 h-3" />
                                            {branch.city}, {branch.state}
                                        </p>
                                    </div>
                                    <div className={`
                    px-2 py-1 rounded text-xs font-medium
                    ${branch.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                  `}>
                                        {branch.status === 'active' ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 text-sm text-gray-600 mb-4">
                                    <p>{branch.address}</p>
                                    <p className="flex items-center gap-2">
                                        <Phone className="w-3 h-3" />
                                        {branch.phone}
                                    </p>
                                    {branch.mapLink && (
                                        <a
                                            href={branch.mapLink}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline text-xs"
                                        >
                                            View on Map
                                        </a>
                                    )}
                                </div>

                                <div className="border-t pt-3 flex justify-between items-center">
                                    <button
                                        onClick={() => toggleStatus(branch)}
                                        className="text-gray-500 hover:text-gray-700 text-xs flex items-center gap-1"
                                    >
                                        {branch.status === 'active' ? (
                                            <><XCircle className="w-3 h-3" /> Deactivate</>
                                        ) : (
                                            <><CheckCircle className="w-3 h-3" /> Activate</>
                                        )}
                                    </button>

                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(branch)}>
                                            <Pencil className="w-4 h-4 text-blue-600" />
                                        </Button>
                                        <Button variant="ghost" size="sm" onClick={() => handleDelete(branch.id)}>
                                            <Trash2 className="w-4 h-4 text-red-600" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <label htmlFor="name" className="text-sm font-medium">Branch Name</label>
                            <input
                                id="name"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="e.g. Pune Head Office"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <textarea
                                id="address"
                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                value={formData.address}
                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                placeholder="Full street address"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <label htmlFor="city" className="text-sm font-medium">City</label>
                                <input
                                    id="city"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    placeholder="City"
                                />
                            </div>
                            <div className="grid gap-2">
                                <label htmlFor="state" className="text-sm font-medium">State</label>
                                <input
                                    id="state"
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    placeholder="State"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="phone" className="text-sm font-medium">Phone Number</label>
                            <input
                                id="phone"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="+91 99999 99999"
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="mapLink" className="text-sm font-medium">Google Maps Link</label>
                            <input
                                id="mapLink"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={formData.mapLink}
                                onChange={(e) => setFormData({ ...formData, mapLink: e.target.value })}
                                placeholder="https://maps.google.com/..."
                            />
                        </div>
                        <div className="grid gap-2">
                            <label htmlFor="status" className="text-sm font-medium">Status</label>
                            <select
                                id="status"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' })}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleSave}>Save Branch</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
}
