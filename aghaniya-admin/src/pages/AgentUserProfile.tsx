import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAgent } from '@/contexts/AgentContext';
import { getDatabaseInstance } from '@/lib/firebase';
import { ref, child, get, query, orderByChild, equalTo } from 'firebase/database';
import { User, Mail, Phone, Briefcase, Calendar, Shield, Users, Building } from 'lucide-react';

export function AgentUserProfile() {
    interface ManagerInfo {
        id: string;
        name?: string;
        email?: string;
        phone?: string;
        agentId?: string;
        role?: string;
        [key: string]: any; // Fallback for other fields
    }

    const { currentAgent, loading: agentLoading } = useAgent();
    const [manager, setManager] = useState<ManagerInfo | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadManagerInfo = async () => {
            if (!currentAgent?.managerId) {
                setLoading(false);
                return;
            }

            const db = getDatabaseInstance();
            if (!db) {
                setLoading(false);
                return;
            }

            try {
                // 1. Try Agents Collection (Doc ID) - System ID
                // In RDB: agents/$uid
                const managerSnap = await get(child(ref(db), `agents/${currentAgent.managerId}`));
                if (managerSnap.exists()) {
                    setManager({ id: managerSnap.key!, ...managerSnap.val() } as ManagerInfo);
                    return;
                }

                // 2. Try Agents Collection (Custom ID - agentId field)
                const agentsRef = ref(db, 'agents');
                const q = query(agentsRef, orderByChild('agentId'), equalTo(currentAgent.managerId));
                const snapshot = await get(q);

                if (snapshot.exists()) {
                    // Get first match
                    let found: ManagerInfo | null = null;
                    snapshot.forEach((childSnap) => {
                        found = { id: childSnap.key!, ...childSnap.val() } as ManagerInfo;
                        return true; // Stop
                    });
                    if (found) {
                        setManager(found);
                        return;
                    }
                }

                // 3. Try Admins Collection (Doc ID) - If manager is an admin
                const adminSnap = await get(child(ref(db), `admins/${currentAgent.managerId}`));
                if (adminSnap.exists()) {
                    setManager({ id: adminSnap.key!, ...adminSnap.val(), role: 'admin' } as ManagerInfo);
                    return;
                }

                console.warn(`Manager details not found in 'agents' or 'admins' for ID: ${currentAgent.managerId}`);
            } catch (error) {
                console.error('Error loading manager:', error);
            } finally {
                setLoading(false);
            }
        };

        loadManagerInfo();
    }, [currentAgent]);

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (agentLoading || loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-500">Loading profile...</div>
                </div>
            </AdminLayout>
        );
    }

    if (!currentAgent) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-red-500">Unable to load profile. Please contact administrator.</div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">User Profile</h1>
                    <p className="text-gray-600 mt-1">Your profile information and details</p>
                </div>

                {/* Profile Overview */}
                <Card>
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Your personal and professional details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Agent ID */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <Shield className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Agent ID</p>
                                    <p className="font-semibold text-lg">{currentAgent.agentId}</p>
                                </div>
                            </div>

                            {/* Full Name */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-purple-100 p-2 rounded-lg">
                                    <User className="h-5 w-5 text-purple-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Full Name</p>
                                    <p className="font-semibold text-lg">{currentAgent.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <Mail className="h-5 w-5 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-semibold">{currentAgent.email}</p>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-orange-100 p-2 rounded-lg">
                                    <Phone className="h-5 w-5 text-orange-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Phone Number</p>
                                    <p className="font-semibold">{currentAgent.phone || 'Not provided'}</p>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-indigo-100 p-2 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Role</p>
                                    <p className="font-semibold capitalize">{currentAgent.role}</p>
                                </div>
                            </div>

                            {/* Department */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-pink-100 p-2 rounded-lg">
                                    <Building className="h-5 w-5 text-pink-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Department</p>
                                    <p className="font-semibold">{currentAgent.department || 'Not assigned'}</p>
                                </div>
                            </div>

                            {/* Joining Date */}
                            <div className="flex items-start space-x-3">
                                <div className="bg-cyan-100 p-2 rounded-lg">
                                    <Calendar className="h-5 w-5 text-cyan-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Onboarding Date</p>
                                    <p className="font-semibold">{formatDate(currentAgent.joiningDate)}</p>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-start space-x-3">
                                <div className={`p-2 rounded-lg ${currentAgent.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                                    }`}>
                                    <User className={`h-5 w-5 ${currentAgent.status === 'active' ? 'text-green-600' : 'text-gray-600'
                                        }`} />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Status</p>
                                    <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${currentAgent.status === 'active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {currentAgent.status === 'active' ? 'Active' : 'Inactive'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Manager Information */}
                {currentAgent.managerId && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Reporting Manager</CardTitle>
                            <CardDescription>Your direct manager's information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {manager ? (
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-blue-100 p-2 rounded-lg">
                                            <Users className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Manager Name</p>
                                            <p className="font-semibold text-lg">{manager.name}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="bg-purple-100 p-2 rounded-lg">
                                            <Shield className="h-5 w-5 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Manager ID</p>
                                            <p className="font-semibold">{manager.agentId}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="bg-green-100 p-2 rounded-lg">
                                            <Mail className="h-5 w-5 text-green-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Manager Email</p>
                                            <p className="font-semibold">{manager.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <div className="bg-orange-100 p-2 rounded-lg">
                                            <Phone className="h-5 w-5 text-orange-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Manager Phone</p>
                                            <p className="font-semibold">{manager.phone || 'Not provided'}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : loading ? (
                                <div className="text-gray-500 py-4 text-center">Loading manager information...</div>
                            ) : (
                                <div className="text-amber-600 py-4 text-center">
                                    Unable to load manager details (ID: {currentAgent.managerId})
                                </div>
                            )}
                        </CardContent>
                    </Card>
                )}

                {/* Account Info */}
                <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>Account creation and last update details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="flex items-start space-x-3">
                                <div className="bg-gray-100 p-2 rounded-lg">
                                    <Calendar className="h-5 w-5 text-gray-600" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Account Created</p>
                                    <p className="font-semibold">{formatDate(currentAgent.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
