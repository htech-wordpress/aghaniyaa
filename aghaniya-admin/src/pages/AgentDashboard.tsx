import { useEffect, useState } from 'react';
import { useAgent } from '@/contexts/AgentContext';
import { getFirestoreInstance } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardTitle, CardHeader, CardDescription } from '@/components/ui/card';
import { Loader2, TrendingUp, Calendar, Clock, BarChart3, PieChart as PieIcon, Activity } from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    BarChart,
    Bar,
    Legend
} from 'recharts';

// Professional color palette
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export function AgentDashboard() {
    const { currentAgent } = useAgent();
    const [stats, setStats] = useState({ daily: 0, weekly: 0, monthly: 0, total: 0 });
    const [chartData, setChartData] = useState<{
        trend: any[];
        status: any[];
        category: any[];
    }>({ trend: [], status: [], category: [] });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentAgent) return;
        loadStats();
    }, [currentAgent]);

    const loadStats = async () => {
        if (!currentAgent?.id) return;

        const firestore = getFirestoreInstance();
        if (!firestore) return;

        try {
            const leadsRef = collection(firestore, 'leads');
            const q = query(leadsRef, where('assignedTo', '==', currentAgent.id));
            const snapshot = await getDocs(q);

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

            const startOfWeek = new Date(today);
            startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday as start

            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

            let daily = 0;
            let weekly = 0;
            let monthly = 0;

            // Aggregation objects
            const statusCounts: Record<string, number> = {};
            const categoryCounts: Record<string, number> = {};
            const dateCounts: Record<string, number> = {};

            // Initialize last 7 days for trend
            for (let i = 6; i >= 0; i--) {
                const d = new Date(today);
                d.setDate(today.getDate() - i);
                const dateKey = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                dateCounts[dateKey] = 0;
            }

            snapshot.forEach(doc => {
                const data = doc.data();
                const createdVal = data.createdAt || data.timestamp;
                if (!createdVal) return;

                const date = new Date(createdVal);

                // Metrics
                if (date >= today) daily++;
                if (date >= startOfWeek) weekly++;
                if (date >= startOfMonth) monthly++;

                // Status Aggregation
                const status = data.status || 'new';
                statusCounts[status] = (statusCounts[status] || 0) + 1;

                // Category Aggregation
                const category = data.category || 'other';
                categoryCounts[category] = (categoryCounts[category] || 0) + 1;

                // Trend Aggregation (Last 7 Days)
                // Simple string key match
                const dateKey = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                if (dateCounts.hasOwnProperty(dateKey)) {
                    dateCounts[dateKey]++;
                }
            });

            // Transform for Recharts
            const trendData = Object.keys(dateCounts).map(key => ({
                name: key,
                leads: dateCounts[key]
            }));

            const statusData = Object.keys(statusCounts).map(key => ({
                name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
                value: statusCounts[key]
            }));

            const categoryData = Object.keys(categoryCounts).map(key => ({
                name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
                value: categoryCounts[key]
            }));

            setStats({
                daily,
                weekly,
                monthly,
                total: snapshot.size
            });

            setChartData({
                trend: trendData,
                status: statusData,
                category: categoryData
            });

        } catch (error) {
            console.error('Error loading stats:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20 min-h-[500px]">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="text-gray-500">Loading your dashboard analytics...</span>
                    </div>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-8 pb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Agent Dashboard</h1>
                    <p className="text-gray-500 mt-2">Performance metrics and lead analytics overview.</p>
                </div>

                {/* Top Metrics Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <Card className="border-l-4 border-l-blue-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">Total Leads</CardTitle>
                            <div className="p-2 bg-blue-50 rounded-full">
                                <BarChart3 className="h-4 w-4 text-blue-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.total}</div>
                            <p className="text-xs text-gray-500 mt-1">All time assigned leads</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">Today</CardTitle>
                            <div className="p-2 bg-green-50 rounded-full">
                                <Clock className="h-4 w-4 text-green-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.daily}</div>
                            <p className="text-xs text-gray-500 mt-1">Leads added today</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-purple-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">This Week</CardTitle>
                            <div className="p-2 bg-purple-50 rounded-full">
                                <Calendar className="h-4 w-4 text-purple-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.weekly}</div>
                            <p className="text-xs text-gray-500 mt-1">Since Sunday</p>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-orange-500 shadow-sm hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 uppercase tracking-wider">This Month</CardTitle>
                            <div className="p-2 bg-orange-50 rounded-full">
                                <TrendingUp className="h-4 w-4 text-orange-500" />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-gray-900">{stats.monthly}</div>
                            <p className="text-xs text-gray-500 mt-1">Current calendar month</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Trend Chart */}
                    <Card className="lg:col-span-2 shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-gray-500" />
                                Weekly Lead Trend
                            </CardTitle>
                            <CardDescription>Daily lead acquisition over the last 7 days</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData.trend} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                        <defs>
                                            <linearGradient id="colorLeads" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                                        <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                            itemStyle={{ color: '#111827', fontWeight: 600 }}
                                        />
                                        <Area type="monotone" dataKey="leads" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorLeads)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Status Distribution */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <PieIcon className="h-5 w-5 text-gray-500" />
                                Lead Status Distribution
                            </CardTitle>
                            <CardDescription>Breakdown of leads by current status</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={chartData.status}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {chartData.status.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Category Chart */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5 text-gray-500" />
                                Leads by Category
                            </CardTitle>
                            <CardDescription>Distribution across different loan types</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div style={{ width: '100%', height: 300, minHeight: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData.category} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
                                        <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis dataKey="name" type="category" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} width={100} />
                                        <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '8px' }} />
                                        <Bar dataKey="value" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                            {chartData.category.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AdminLayout>
    );
}
