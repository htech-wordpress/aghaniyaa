import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAgent } from '@/contexts/AgentContext';
import { getDatabaseInstance } from '@/lib/firebase';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { Users, TrendingUp, CheckCircle, Clock, User } from 'lucide-react';

interface TeamMember {
    id: string;
    agentId: string;
    name: string;
    email: string;
    phone?: string;
    department?: string;
    joiningDate?: string;
    status: 'active' | 'inactive';
}

interface LeadStats {
    total: number;
    today: number;
    new: number;
    contacted: number;
    inProgress: number;
    approved: number;
    rejected: number;
}

interface TeamMemberStats {
    agent: TeamMember;
    stats: LeadStats;
}

export function ManagerTeamDashboard() {
    const { currentAgent, loading: agentLoading } = useAgent();
    const [teamStats, setTeamStats] = useState<TeamMemberStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadTeamData = async () => {
            if (!currentAgent) return;

            setLoading(true);
            const db = getDatabaseInstance();
            if (!db) {
                setLoading(false);
                return;
            }

            try {
                // Load team members (agents reporting to this manager)
                const agentsRef = ref(db, 'agents');
                // Realtime DB limitation: can only sort/filter by one property.
                // We filter by managerId, then filter status in memory.
                const q = query(
                    agentsRef,
                    orderByChild('managerId'),
                    equalTo(currentAgent.id)
                );
                const snapshot = await get(q);
                const teamMembers: TeamMember[] = [];

                snapshot.forEach((childSnap) => {
                    const data = childSnap.val();
                    if (data.status === 'active') {
                        teamMembers.push({ id: childSnap.key!, ...data } as TeamMember);
                    }
                });

                // Load leads for each team member
                const leadsRef = ref(db, 'leads');
                const statsPromises = teamMembers.map(async (member) => {
                    const memberLeadsQuery = query(
                        leadsRef,
                        orderByChild('assignedTo'),
                        equalTo(member.id)
                    );
                    const leadsSnapshot = await get(memberLeadsQuery);

                    const stats: LeadStats = {
                        total: 0,
                        today: 0,
                        new: 0,
                        contacted: 0,
                        inProgress: 0,
                        approved: 0,
                        rejected: 0,
                    };

                    const today = new Date();
                    today.setHours(0, 0, 0, 0);

                    leadsSnapshot.forEach((leadSnap) => {
                        const rawData = leadSnap.val();
                        // Handle both nested 'data' structure and legacy flat structure
                        const leadDetails = rawData.data || rawData;

                        stats.total++;

                        // Check if created today
                        const createdAtStr = rawData.createdAt || rawData.timestamp || leadDetails.timestamp;
                        if (createdAtStr) {
                            const createdAt = new Date(createdAtStr);
                            if (createdAt >= today) {
                                stats.today++;
                            }
                        }

                        // Count by status
                        const status = (leadDetails.status || 'new').toLowerCase();
                        if (status === 'new') stats.new++;
                        else if (status === 'contacted') stats.contacted++;
                        else if (status === 'in-progress' || status === 'in progress') stats.inProgress++;
                        else if (status === 'approved') stats.approved++;
                        else if (status === 'rejected') stats.rejected++;
                    });

                    return {
                        agent: member,
                        stats,
                    };
                });

                const allStats = await Promise.all(statsPromises);
                setTeamStats(allStats);
            } catch (error) {
                console.error('Error loading team data:', error);
                alert('Failed to load team data');
            } finally {
                setLoading(false);
            }
        };

        if (currentAgent && currentAgent.role === 'manager') {
            loadTeamData();
        }
    }, [currentAgent]);

    const getTotalTeamStats = (): LeadStats => {
        return teamStats.reduce(
            (acc, member) => ({
                total: acc.total + member.stats.total,
                today: acc.today + member.stats.today,
                new: acc.new + member.stats.new,
                contacted: acc.contacted + member.stats.contacted,
                inProgress: acc.inProgress + member.stats.inProgress,
                approved: acc.approved + member.stats.approved,
                rejected: acc.rejected + member.stats.rejected,
            }),
            {
                total: 0,
                today: 0,
                new: 0,
                contacted: 0,
                inProgress: 0,
                approved: 0,
                rejected: 0,
            }
        );
    };

    if (agentLoading || loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-500">Loading team data...</div>
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

    if (currentAgent.role !== 'manager') {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-red-500">This page is only accessible to managers.</div>
                </div>
            </AdminLayout>
        );
    }

    const totalStats = getTotalTeamStats();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Team Dashboard</h1>
                    <p className="text-gray-600 mt-1">Monitor your team's performance and lead statistics</p>
                </div>

                {/* Team Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Team Size</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-500 mr-3" />
                                <div className="text-3xl font-bold">{teamStats.length}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <TrendingUp className="h-8 w-8 text-purple-500 mr-3" />
                                <div className="text-3xl font-bold">{totalStats.total}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Today's Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-orange-500 mr-3" />
                                <div className="text-3xl font-bold">{totalStats.today}</div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <CheckCircle className="h-8 w-8 text-green-500 mr-3" />
                                <div className="text-3xl font-bold text-green-600">{totalStats.approved}</div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Team Members Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Team Performance</CardTitle>
                        <CardDescription>Detailed statistics for each team member</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {teamStats.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No team members found. Agents need to be assigned to you as their manager.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Agent</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Total Leads</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Today</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">New</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Contacted</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">In Progress</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Approved</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Rejected</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {teamStats.map(({ agent, stats }) => (
                                            <tr key={agent.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3">
                                                    <div className="flex items-center">
                                                        <div className="bg-blue-100 p-2 rounded-full mr-3">
                                                            <User className="h-4 w-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold">{agent.name}</div>
                                                            <div className="text-xs text-gray-500">{agent.agentId}</div>
                                                            <div className="text-xs text-gray-500">{agent.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="font-bold text-lg">{stats.total}</span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-semibold">
                                                        {stats.today}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-semibold">
                                                        {stats.new}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-yellow-100 text-yellow-700 font-semibold">
                                                        {stats.contacted}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-semibold">
                                                        {stats.inProgress}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 text-green-700 font-semibold">
                                                        {stats.approved}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-700 font-semibold">
                                                        {stats.rejected}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot className="bg-gray-50 border-t-2 font-semibold">
                                        <tr>
                                            <td className="px-4 py-3">
                                                <span className="font-bold">TOTAL</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-lg">{totalStats.total}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-orange-600">{totalStats.today}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-blue-600">{totalStats.new}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-yellow-600">{totalStats.contacted}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-purple-600">{totalStats.inProgress}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-green-600">{totalStats.approved}</span>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className="font-bold text-red-600">{totalStats.rejected}</span>
                                            </td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Individual Agent Cards (Mobile-friendly alternative) */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:hidden">
                    {teamStats.map(({ agent, stats }) => (
                        <Card key={agent.id}>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center">
                                    <User className="h-5 w-5 mr-2" />
                                    {agent.name}
                                </CardTitle>
                                <CardDescription>{agent.agentId} • {agent.email}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-gray-500">Total Leads</p>
                                        <p className="font-bold text-xl">{stats.total}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Today</p>
                                        <p className="font-bold text-xl text-orange-600">{stats.today}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">New</p>
                                        <p className="font-semibold text-blue-600">{stats.new}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Contacted</p>
                                        <p className="font-semibold text-yellow-600">{stats.contacted}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">In Progress</p>
                                        <p className="font-semibold text-purple-600">{stats.inProgress}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Approved</p>
                                        <p className="font-semibold text-green-600">{stats.approved}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Rejected</p>
                                        <p className="font-semibold text-red-600">{stats.rejected}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
