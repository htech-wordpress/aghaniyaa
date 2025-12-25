import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { useAgent } from '@/contexts/AgentContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { getDatabaseInstance } from '@/lib/firebase';
import { ref, get } from 'firebase/database';
import { Users, TrendingUp, CheckCircle, Clock, User, Search, RefreshCw } from 'lucide-react';

interface Agent {
    id: string;
    agentId: string;
    name: string;
    email: string;
    phone?: string;
    role: 'admin' | 'manager' | 'agent';
    managerId?: string;
    managerName?: string;
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

interface AgentPerformance {
    agent: Agent;
    stats: LeadStats;
}

export function AdminPerformanceDashboard() {
    const { currentAgent } = useAgent();
    const [agentPerformances, setAgentPerformances] = useState<AgentPerformance[]>([]);
    const [filteredPerformances, setFilteredPerformances] = useState<AgentPerformance[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('active');

    useEffect(() => {
        loadAllAgentsPerformance();
    }, []);

    useEffect(() => {
        filterAgents();
    }, [searchQuery, roleFilter, statusFilter, agentPerformances]);

    const loadAllAgentsPerformance = async () => {
        setLoading(true);
        const db = getDatabaseInstance();
        if (!db) {
            setLoading(false);
            return;
        }

        try {
            // 1. Load Agents
            const agentsRef = ref(db, 'agents');
            const agentsSnap = await get(agentsRef);
            const allAgents: Agent[] = [];

            // Create a map to store manager IDs -> Names
            const agentMap = new Map<string, string>();

            agentsSnap.forEach((childSnap) => {
                const data = childSnap.val();
                allAgents.push({ id: childSnap.key!, ...data } as Agent);
                agentMap.set(childSnap.key!, data.name);
            });

            // Also load Admin Users (admins can store agent data or be managers)
            // But usually performance is about Agents. If admins also take leads, they might be in adminUsers.
            // For now, let's assume we performance track 'agents' node primarily. 
            // If managers are in adminUsers, we might need their names.
            const adminsRef = ref(db, 'adminUsers');
            const adminsSnap = await get(adminsRef);
            adminsSnap.forEach((childSnap) => {
                const data = childSnap.val();
                agentMap.set(childSnap.key!, data.name);
                // We typically don't track admin performance in this specific dashboard unless they are in 'agents' list
                // If the user wants admins here, they should be in the agents list or merged.
            });

            // Sort agents by name
            allAgents.sort((a, b) => (a.name || '').localeCompare(b.name || ''));

            // Add manager names to agents
            const agentsWithManagers = allAgents.map(agent => ({
                ...agent,
                managerName: agent.managerId ? agentMap.get(agent.managerId) : undefined
            }));

            // 2. Load All Leads (for aggregation)
            const leadsRef = ref(db, 'leads');
            const leadsSnap = await get(leadsRef);

            // Initialize stats map
            const statsMap = new Map<string, LeadStats>();
            agentsWithManagers.forEach(agent => {
                statsMap.set(agent.id, {
                    total: 0,
                    today: 0,
                    new: 0,
                    contacted: 0,
                    inProgress: 0,
                    approved: 0,
                    rejected: 0,
                });
            });

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // 3. Aggregate Stats
            leadsSnap.forEach((childSnap) => {
                const lead = childSnap.val();
                const assignedTo = lead.assignedTo;

                if (assignedTo && statsMap.has(assignedTo)) {
                    const stats = statsMap.get(assignedTo)!;
                    stats.total++;

                    // Created Today
                    if (lead.createdAt) {
                        const created = new Date(lead.createdAt);
                        if (created >= today) {
                            stats.today++;
                        }
                    } else if (lead.timestamp) {
                        const created = new Date(lead.timestamp);
                        if (created >= today) {
                            stats.today++;
                        }
                    }

                    // Status
                    const status = (lead.status || 'new').toLowerCase();
                    if (status === 'new') stats.new++;
                    else if (status === 'contacted') stats.contacted++;
                    else if (['in-progress', 'in progress', 'proposal', 'negotiation', 'qualified'].includes(status)) stats.inProgress++;
                    else if (status === 'approved') stats.approved++;
                    else if (status === 'rejected') stats.rejected++;
                }
            });

            // 4. Combine
            const finalPerformances: AgentPerformance[] = agentsWithManagers.map(agent => ({
                agent,
                stats: statsMap.get(agent.id)!
            }));

            setAgentPerformances(finalPerformances);
            setFilteredPerformances(finalPerformances);

        } catch (error) {
            console.error('Error loading agent performance:', error);
            alert('Failed to load agent performance data');
        } finally {
            setLoading(false);
        }
    };

    const filterAgents = () => {
        let filtered = [...agentPerformances];

        // Filter by search query (name or agent ID)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                (perf) =>
                    (perf.agent.name || '').toLowerCase().includes(query) ||
                    (perf.agent.agentId || '').toLowerCase().includes(query) ||
                    (perf.agent.email || '').toLowerCase().includes(query)
            );
        }

        // Filter by role
        if (roleFilter !== 'all') {
            filtered = filtered.filter((perf) => perf.agent.role === roleFilter);
        }

        // Filter by status
        if (statusFilter !== 'all') {
            filtered = filtered.filter((perf) => perf.agent.status === statusFilter);
        }

        setFilteredPerformances(filtered);
    };

    const getTotalStats = (): LeadStats => {
        return filteredPerformances.reduce(
            (acc, perf) => ({
                total: acc.total + perf.stats.total,
                today: acc.today + perf.stats.today,
                new: acc.new + perf.stats.new,
                contacted: acc.contacted + perf.stats.contacted,
                inProgress: acc.inProgress + perf.stats.inProgress,
                approved: acc.approved + perf.stats.approved,
                rejected: acc.rejected + perf.stats.rejected,
            }),
            {
                total: 0, today: 0, new: 0, contacted: 0, inProgress: 0, approved: 0, rejected: 0
            }
        );
    };

    const totalStats = getTotalStats();

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Performance Dashboard</h1>
                        <p className="text-gray-600 mt-1">Monitor all agents' performance and lead statistics (Realtime DB)</p>
                    </div>
                    <Button onClick={loadAllAgentsPerformance} disabled={loading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </Button>
                </div>

                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Agents</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <Users className="h-8 w-8 text-blue-500 mr-3" />
                                <div className="text-3xl font-bold">{filteredPerformances.length}</div>
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

                {/* Filters */}
                <Card>
                    <CardHeader>
                        <CardTitle>Filter Agents</CardTitle>
                        <CardDescription>Search and filter by name, ID, role, or status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <Label htmlFor="search">Search by Name or ID</Label>
                                <div className="relative mt-1">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        id="search"
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search name, ID, or email..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="roleFilter">Filter by Role</Label>
                                <select
                                    id="roleFilter"
                                    value={roleFilter}
                                    onChange={(e) => setRoleFilter(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Roles</option>
                                    {(currentAgent?.role === 'admin' || !currentAgent) && <option value="admin">Admin</option>}
                                    <option value="manager">Manager</option>
                                    <option value="agent">Agent</option>
                                </select>
                            </div>

                            <div>
                                <Label htmlFor="statusFilter">Filter by Status</Label>
                                <select
                                    id="statusFilter"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">All Status</option>
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Performance Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Agent Performance</CardTitle>
                        <CardDescription>
                            Showing {filteredPerformances.length} of {agentPerformances.length} agents
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="text-center py-8 text-gray-500">Loading agent performance...</div>
                        ) : filteredPerformances.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No agents found matching your filters.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Agent</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Role</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Manager</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Total</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Today</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">New</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Contacted</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Progress</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Approved</th>
                                            <th className="px-4 py-3 text-center font-medium text-gray-600">Rejected</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {filteredPerformances.map(({ agent, stats }) => (
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
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${agent.role === 'admin' ? 'bg-red-100 text-red-700' :
                                                        agent.role === 'manager' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-blue-100 text-blue-700'
                                                        }`}>
                                                        {agent.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-sm text-gray-600">
                                                    {agent.managerName || '-'}
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
                                            <td className="px-4 py-3" colSpan={3}>
                                                <span className="font-bold">TOTAL ({filteredPerformances.length} agents)</span>
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
            </div>
        </AdminLayout>
    );
}
