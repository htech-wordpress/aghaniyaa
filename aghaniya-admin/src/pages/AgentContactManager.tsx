import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAgent } from '@/contexts/AgentContext';
import { getFirestoreInstance } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Mail, Phone, User, Shield, MessageCircle, Building } from 'lucide-react';

export function AgentContactManager() {
    const { currentAgent, loading: agentLoading } = useAgent();
    const [manager, setManager] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadManagerInfo();
    }, [currentAgent]);

    const loadManagerInfo = async () => {
        if (!currentAgent?.managerId) {
            setLoading(false);
            return;
        }

        const firestore = getFirestoreInstance();
        if (!firestore) {
            setLoading(false);
            return;
        }

        try {
            const managerDoc = await getDoc(doc(firestore, 'agents', currentAgent.managerId));
            if (managerDoc.exists()) {
                setManager({ id: managerDoc.id, ...managerDoc.data() });
            }
        } catch (error) {
            console.error('Error loading manager:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEmailManager = () => {
        if (manager?.email) {
            window.location.href = `mailto:${manager.email}?subject=Query from ${currentAgent?.name} (${currentAgent?.agentId})`;
        }
    };

    const handleCallManager = () => {
        if (manager?.phone) {
            window.location.href = `tel:${manager.phone}`;
        }
    };

    if (agentLoading || loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-500">Loading manager information...</div>
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

    if (!currentAgent.managerId || !manager) {
        return (
            <AdminLayout>
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Contact Manager</h1>
                        <p className="text-gray-600 mt-1">Get in touch with your reporting manager</p>
                    </div>

                    <Card>
                        <CardContent className="py-20">
                            <div className="text-center">
                                <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Manager Assigned</h3>
                                <p className="text-gray-600">
                                    You don't have a reporting manager assigned yet. Please contact the administrator.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Contact Manager</h1>
                    <p className="text-gray-600 mt-1">Get in touch with your reporting manager</p>
                </div>

                {/* Manager Profile Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                            <User className="h-6 w-6" />
                            <span>Your Manager</span>
                        </CardTitle>
                        <CardDescription>Direct contact information for your reporting manager</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-6">
                            {/* Manager Details */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="flex items-start space-x-3">
                                    <div className="bg-blue-100 p-3 rounded-lg">
                                        <User className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Manager Name</p>
                                        <p className="font-semibold text-xl">{manager.name}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <Shield className="h-6 w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Manager ID</p>
                                        <p className="font-semibold text-xl">{manager.agentId}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Mail className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Email Address</p>
                                        <p className="font-semibold">{manager.email}</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-3">
                                    <div className="bg-orange-100 p-3 rounded-lg">
                                        <Phone className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone Number</p>
                                        <p className="font-semibold">{manager.phone || 'Not provided'}</p>
                                    </div>
                                </div>

                                {manager.department && (
                                    <div className="flex items-start space-x-3">
                                        <div className="bg-pink-100 p-3 rounded-lg">
                                            <Building className="h-6 w-6 text-pink-600" />
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500">Department</p>
                                            <p className="font-semibold">{manager.department}</p>
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-start space-x-3">
                                    <div className="bg-indigo-100 p-3 rounded-lg">
                                        <MessageCircle className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Role</p>
                                        <p className="font-semibold capitalize">{manager.role}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Actions */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={handleEmailManager}
                                        className="flex items-center space-x-2"
                                    >
                                        <Mail className="h-4 w-4" />
                                        <span>Send Email</span>
                                    </Button>

                                    {manager.phone && (
                                        <Button
                                            onClick={handleCallManager}
                                            variant="outline"
                                            className="flex items-center space-x-2"
                                        >
                                            <Phone className="h-4 w-4" />
                                            <span>Call Manager</span>
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Help Card */}
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle className="text-blue-900">Need Help?</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-blue-800">
                            Your manager <strong>{manager.name}</strong> is here to help you with:
                        </p>
                        <ul className="mt-3 space-y-2 text-blue-700">
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Lead assignment and queries</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Process guidelines and best practices</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>Performance feedback and support</span>
                            </li>
                            <li className="flex items-start">
                                <span className="mr-2">•</span>
                                <span>System access and technical issues</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
