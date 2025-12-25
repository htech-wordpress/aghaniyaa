import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { getFirestoreInstance, isSuperUser } from '@/lib/firebase';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, orderBy, getDoc, setDoc, where } from 'firebase/firestore';
import { UserPlus, Pencil, Trash2, Users, Shield, Briefcase, AlertCircle } from 'lucide-react';

interface Agent {
    id: string;
    agentId: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'agent';
    employmentType: 'aghaniya' | 'contract' | 'others';
    managerId?: string;
    phone?: string;
    department?: string;
    joiningDate?: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

// Role is always 'agent' - no dropdown needed

export function AdminAgents() {
    const [agents, setAgents] = useState<Agent[]>([]);
    const [adminUsers, setAdminUsers] = useState<{ id: string; adminId: string; name: string; email: string; }[]>([]);
    const [loading, setLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
    const [maxAgents, setMaxAgents] = useState<number>(100);
    const [agentLimitEnabled, setAgentLimitEnabled] = useState<boolean>(true);
    const [isSuper, setIsSuper] = useState<boolean>(false);



    // Form state
    const [formData, setFormData] = useState({
        agentId: '', // Auto-generated based on employmentType
        name: '',
        email: '',
        role: 'agent' as 'admin' | 'manager' | 'agent',
        employmentType: 'aghaniya' as 'aghaniya' | 'contract' | 'others',
        managerId: '',
        phone: '',
        department: '',
        joiningDate: new Date().toISOString().split('T')[0],
        status: 'active' as 'active' | 'inactive',
    });

    useEffect(() => {
        checkSuperUser();
        loadAgents();
        loadAdminUsers();
        loadSystemSettings();
    }, []);

    useEffect(() => {
        if (isDialogOpen && !editingAgent) {
            generateNextAgentId();
        }
    }, [isDialogOpen, formData.employmentType]);

    const checkSuperUser = async () => {
        const ok = await isSuperUser((await import('firebase/auth')).getAuth()?.currentUser || null);
        setIsSuper(ok);
    };

    const loadAgents = async () => {
        setLoading(true);
        const firestore = getFirestoreInstance();
        if (!firestore) {
            console.error('Firestore not initialized');
            setLoading(false);
            return;
        }

        try {
            const agentsRef = collection(firestore, 'agents');
            const q = query(agentsRef, orderBy('createdAt', 'desc'));
            const snapshot = await getDocs(q);
            const agentsList: Agent[] = [];

            snapshot.forEach((doc) => {
                agentsList.push({ id: doc.id, ...doc.data() } as Agent);
            });

            setAgents(agentsList);
        } catch (error) {
            console.error('Error loading agents:', error);
            alert('Failed to load agents');
        } finally {
            setLoading(false);
        }
    };

    const loadAdminUsers = async () => {
        const firestore = getFirestoreInstance();
        if (!firestore) return;

        try {
            const adminUsersRef = collection(firestore, 'adminUsers');
            const q = query(adminUsersRef, where('status', '==', 'active'));
            const snapshot = await getDocs(q);
            const adminUsersList: { id: string; adminId: string; name: string; email: string; }[] = [];

            snapshot.forEach((doc) => {
                const data = doc.data();
                adminUsersList.push({
                    id: doc.id,
                    adminId: data.adminId,
                    name: data.name,
                    email: data.email,
                });
            });

            setAdminUsers(adminUsersList);
        } catch (error) {
            console.error('Error loading admin users:', error);
        }
    };

    const generateNextAgentId = async () => {
        const firestore = getFirestoreInstance();
        if (!firestore) return;

        try {
            // Get global employee counter from settings
            const counterDoc = await getDoc(doc(firestore, 'settings', 'employeeCounter'));
            let nextNumber = 1;

            if (counterDoc.exists()) {
                nextNumber = (counterDoc.data().lastNumber || 0) + 1;
            }

            // Generate ID based on employment type
            let prefix = '';
            switch (formData.employmentType) {
                case 'aghaniya':
                    prefix = 'AG0';
                    break;
                case 'contract':
                    prefix = 'AG0CT';
                    break;
                case 'others':
                    prefix = 'AG0OT';
                    break;
            }

            const paddedNumber = String(nextNumber).padStart(3, '0');
            const newAgentId = `${prefix}${paddedNumber}`;

            setFormData(prev => ({ ...prev, agentId: newAgentId }));
        } catch (error) {
            console.error('Error generating agent ID:', error);
        }
    };

    const loadSystemSettings = async () => {
        const firestore = getFirestoreInstance();
        if (!firestore) return;

        try {
            const systemDoc = await getDoc(doc(firestore, 'settings', 'system'));
            if (systemDoc.exists()) {
                const data = systemDoc.data();
                setMaxAgents(data.maxAgents || 100);
                setAgentLimitEnabled(data.enableAgentLimit !== false);
            }
        } catch (error) {
            console.error('Error loading system settings:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.agentId || !formData.name || !formData.email) {
            alert('Please fill in all required fields');
            return;
        }

        // Validate manager assignment (mandatory for non-admin roles)
        if (formData.role !== 'admin' && !formData.managerId) {
            alert('Manager assignment is mandatory for Managers and Agents');
            return;
        }

        // Check agent limit for new agents (SuperAdmins can bypass the limit)
        if (!editingAgent && agentLimitEnabled && !isSuper) {
            if (agents.length >= maxAgents) {
                alert(`Cannot create more agents. Maximum limit of ${maxAgents} agents reached. Contact SuperAdmin to increase the limit.`);
                return;
            }
        }

        const firestore = getFirestoreInstance();
        if (!firestore) return;

        setLoading(true);
        try {
            const agentData = {
                ...formData,
                managerId: formData.managerId || null,
                createdAt: editingAgent?.createdAt || new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            if (editingAgent) {
                // Update existing agent
                await updateDoc(doc(firestore, 'agents', editingAgent.id), agentData);
                alert('Agent updated successfully!');
            } else {
                // Check if Agent ID already exists
                const existingAgent = agents.find(agent => agent.agentId === formData.agentId);
                if (existingAgent) {
                    alert('Agent ID already exists. Please use a unique ID.');
                    setLoading(false);
                    return;
                }

                // Add new agent
                await addDoc(collection(firestore, 'agents'), {
                    ...agentData,
                    createdAt: new Date().toISOString(),
                });

                // Increment global employee counter
                const counterRef = doc(firestore, 'settings', 'employeeCounter');
                const counterDoc = await getDoc(counterRef);
                const currentNumber = counterDoc.exists() ? (counterDoc.data().lastNumber || 0) : 0;

                if (counterDoc.exists()) {
                    await updateDoc(counterRef, { lastNumber: currentNumber + 1 });
                } else {
                    await setDoc(counterRef, { lastNumber: 1 });
                }

                alert('Agent added successfully!');
            }

            setIsDialogOpen(false);
            resetForm();
            loadAgents();
        } catch (error) {
            console.error('Error saving agent:', error);
            alert('Failed to save agent');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (agent: Agent) => {
        setEditingAgent(agent);
        setFormData({
            agentId: agent.agentId,
            name: agent.name,
            email: agent.email,
            role: agent.role,
            employmentType: agent.employmentType || 'aghaniya',
            managerId: agent.managerId || '',
            phone: agent.phone || '',
            department: agent.department || '',
            joiningDate: agent.joiningDate || new Date().toISOString().split('T')[0],
            status: agent.status,
        });
        setIsDialogOpen(true);
    };

    const handleDelete = async (agentId: string, agentIdStr: string) => {
        if (!confirm(`Are you sure you want to delete agent ${agentIdStr}?`)) return;

        const firestore = getFirestoreInstance();
        if (!firestore) return;

        setLoading(true);
        try {
            await deleteDoc(doc(firestore, 'agents', agentId));
            alert('Agent deleted successfully!');
            loadAgents();
        } catch (error) {
            console.error('Error deleting agent:', error);
            alert('Failed to delete agent');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            agentId: '',
            name: '',
            email: '',
            role: 'agent',
            employmentType: 'aghaniya',
            managerId: '',
            phone: '',
            department: '',
            joiningDate: new Date().toISOString().split('T')[0],
            status: 'active',
        });
        setEditingAgent(null);
    };

    const getManagerName = (managerId: string) => {
        const managerFromAgents = agents.find(agent => agent.id === managerId);
        if (managerFromAgents) {
            return `${managerFromAgents.name} (${managerFromAgents.agentId})`;
        }

        const managerFromAdmins = adminUsers.find(admin => admin.id === managerId);
        if (managerFromAdmins) {
            return `${managerFromAdmins.name} (${managerFromAdmins.adminId})`;
        }

        return 'Not Assigned';
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin':
                return <Shield className="h-4 w-4" />;
            case 'manager':
                return <Briefcase className="h-4 w-4" />;
            case 'agent':
                return <Users className="h-4 w-4" />;
            default:
                return <Users className="h-4 w-4" />;
        }
    };

    // Get potential managers (all agents + admin users)
    const potentialManagers = [
        ...agents.map(a => ({ id: a.id, name: a.name, identifier: a.agentId, type: 'Agent' })),
        ...adminUsers.map(au => ({ id: au.id, name: au.name, identifier: au.adminId, type: 'Admin' }))
    ].filter(m => m.id !== editingAgent?.id);


    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Agent Limit Warning */}
                {agentLimitEnabled && agents.length >= maxAgents && !isSuper && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-sm font-semibold text-red-800">Agent Limit Reached</h3>
                                <p className="text-sm text-red-700 mt-1">
                                    You have reached the maximum limit of {maxAgents} agents.
                                    Please contact a SuperAdmin to increase the limit before creating more agents.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* SuperAdmin Notice */}
                {isSuper && agentLimitEnabled && agents.length >= maxAgents && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start">
                            <Shield className="h-5 w-5 text-purple-600 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-sm font-semibold text-purple-800">SuperAdmin Privilege</h3>
                                <p className="text-sm text-purple-700 mt-1">
                                    Agent limit ({maxAgents}) has been reached, but as a SuperAdmin, you can still create agents.
                                    Consider increasing the limit in SuperAdmin Settings if needed.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Agent Count Info */}
                {agentLimitEnabled && (
                    <div className={`border rounded-lg p-4 ${agents.length >= maxAgents ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium">
                                    Agent Usage: <span className="font-bold">{agents.length} / {maxAgents}</span>
                                    {isSuper && agents.length >= maxAgents && (
                                        <span className="ml-2 text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">
                                            SuperAdmin Override Active
                                        </span>
                                    )}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    {agents.length >= maxAgents
                                        ? isSuper
                                            ? 'Limit reached - You can still create agents as SuperAdmin'
                                            : 'Contact SuperAdmin to increase limit'
                                        : `${maxAgents - agents.length} agent slots remaining`
                                    }
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="w-32 bg-gray-200 rounded-full h-2">
                                    <div
                                        className={`h-2 rounded-full ${(agents.length / maxAgents) >= 0.9 ? 'bg-red-500' :
                                            (agents.length / maxAgents) >= 0.7 ? 'bg-yellow-500' : 'bg-blue-500'
                                            }`}
                                        style={{ width: `${Math.min((agents.length / maxAgents) * 100, 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Agent Management</h1>
                        <p className="text-gray-600 mt-1">Manage DSA agents, roles, and reporting structure</p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={(open: boolean) => {
                        setIsDialogOpen(open);
                        if (!open) resetForm();
                    }}>
                        <DialogTrigger asChild>
                            <Button disabled={agentLimitEnabled && agents.length >= maxAgents && !isSuper}>
                                <UserPlus className="h-4 w-4 mr-2" />
                                {agentLimitEnabled && agents.length >= maxAgents && !isSuper
                                    ? `Limit Reached (${maxAgents})`
                                    : 'Add Agent'
                                }
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingAgent ? 'Edit Agent' : 'Add New Agent'}</DialogTitle>
                                <DialogDescription>
                                    {editingAgent ? 'Update agent information' : 'Add a new DSA agent to the system'}
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="agentId">Agent ID *</Label>
                                        <input
                                            id="agentId"
                                            type="text"
                                            required
                                            value={formData.agentId}
                                            readOnly
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                                            placeholder="Auto-generated"
                                        />
                                        <p className="text-xs text-gray-500 mt-1">Auto-generated based on employment type</p>
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
                                            placeholder="john@example.com"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="employmentType">Employment Type *</Label>
                                        <select
                                            id="employmentType"
                                            required
                                            value={formData.employmentType}
                                            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value as 'aghaniya' | 'contract' | 'others' })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={!!editingAgent}
                                        >
                                            <option value="aghaniya">Aghaniya</option>
                                            <option value="contract">Contract</option>
                                            <option value="others">Others</option>
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            {formData.employmentType === 'aghaniya' && 'ID format: AG0XXX'}
                                            {formData.employmentType === 'contract' && 'ID format: AG0CTXXX'}
                                            {formData.employmentType === 'others' && 'ID format: AG0OTXXX'}
                                        </p>
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
                                        <Label htmlFor="managerId">
                                            Manager <span className="text-red-500">*</span>
                                        </Label>
                                        <select
                                            id="managerId"
                                            required
                                            value={formData.managerId}
                                            onChange={(e) => setFormData({ ...formData, managerId: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="">Select Manager</option>
                                            {potentialManagers.map((manager) => (
                                                <option key={manager.id} value={manager.id}>
                                                    {manager.name} ({manager.identifier}) - {manager.type}
                                                </option>
                                            ))}
                                        </select>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Select manager (Agents or Admins). Type to search in dropdown.
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="department">Department</Label>
                                        <input
                                            id="department"
                                            type="text"
                                            value={formData.department}
                                            onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Sales"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="joiningDate">Joining Date</Label>
                                        <input
                                            id="joiningDate"
                                            type="date"
                                            value={formData.joiningDate}
                                            onChange={(e) => setFormData({ ...formData, joiningDate: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="status">Status</Label>
                                        <select
                                            id="status"
                                            value={formData.status}
                                            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            <option value="active">Active</option>
                                            <option value="inactive">Inactive</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={loading}>
                                        {loading ? 'Saving...' : editingAgent ? 'Update Agent' : 'Add Agent'}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Agents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{agents.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Admins</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{agents.filter((a: Agent) => a.role === 'admin').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Managers</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{agents.filter((a: Agent) => a.role === 'manager').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Active</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{agents.filter((a: Agent) => a.status === 'active').length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Agents Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>All Agents</CardTitle>
                        <CardDescription>Manage DSA agents and reporting structure - These agents can login to the admin panel</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading && agents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">Loading agents...</div>
                        ) : agents.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No agents found. Click "Add Agent" to get started.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Agent ID</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Email</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Manager</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Department</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {agents.map((agent: Agent) => (
                                            <tr key={agent.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">{agent.agentId}</td>
                                                <td className="px-4 py-3">{agent.name}</td>
                                                <td className="px-4 py-3 text-gray-600">{agent.email}</td>
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center gap-2">
                                                        {getRoleIcon(agent.role)}
                                                        <span className="capitalize">{agent.role}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    {agent.managerId ? getManagerName(agent.managerId) : 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-gray-600">{agent.department || '-'}</td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${agent.status === 'active'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {agent.status}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => handleEdit(agent)}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-700"
                                                            onClick={() => handleDelete(agent.id, agent.agentId)}
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
