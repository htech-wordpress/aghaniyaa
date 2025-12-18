import { useMemo, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { subscribeToLeads } from '@/lib/storage';
import type { Lead } from '@/lib/storage';

function StatCard({ title, value, onClick }: { title: string; value: string | number; onClick?: () => void }) {
  return (
    <div onClick={onClick} className="cursor-pointer bg-white rounded-lg shadow p-4 hover:shadow-md transition">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
    </div>
  );
}

function BarChart({ data, onBarClick }: { data: { label: string; value: number }[]; onBarClick?: (label: string) => void }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="space-y-2">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-4" onClick={() => onBarClick?.(d.label)}>
          <div className="w-32 text-sm text-gray-700">{d.label}</div>
          <div className="flex-1 bg-gray-100 rounded overflow-hidden h-6">
            <div className="h-6 bg-blue-600" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <div className="w-12 text-right text-sm text-gray-700">{d.value}</div>
        </div>
      ))}
    </div>
  );
}

function LineChart({ points }: { points: { x: string; y: number }[] }) {
  // simple small sparkline using polyline
  const max = Math.max(...points.map(p => p.y), 1);
  const w = 300; const h = 80;
  const step = w / Math.max(points.length - 1, 1);
  const pointsStr = points.map((p, i) => `${i * step},${h - (p.y / max) * h}`).join(' ');

  return (
    <svg width={w} height={h} className="block">
      <polyline fill="none" stroke="#2563eb" strokeWidth={2} points={pointsStr} />
    </svg>
  );
}

export function AdminOverview() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    const unsub = subscribeToLeads((next) => setLeads(next));
    return () => unsub();
  }, []);

  const total = leads.length;

  // by status
  const statusCounts = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { const s = l.data?.status || 'New'; map[s] = (map[s] || 0) + 1; });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [leads]);

  // by category
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    leads.forEach(l => { map[l.category] = (map[l.category] || 0) + 1; });
    return Object.entries(map).map(([label, value]) => ({ label, value }));
  }, [leads]);

  // last 14 days series
  const recentSeries = useMemo(() => {
    const days = 14;
    const now = new Date();
    const result: { x: string; y: number }[] = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
      const key = d.toISOString().split('T')[0];
      result.push({ x: key, y: 0 });
    }
    const map = Object.fromEntries(result.map(r => [r.x, 0]));
    leads.forEach(l => {
      const key = new Date(l.timestamp).toISOString().split('T')[0];
      if (key in map) map[key]++;
    });
    return result.map(r => ({ x: r.x, y: map[r.x] || 0 }));
  }, [leads]);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard title="Total Leads" value={total} onClick={() => navigate('/admin/leads')} />
        <StatCard title="Website Leads" value={leads.filter(l => !String(l.data?.source || '').toLowerCase().includes('manual')).length} onClick={() => navigate('/admin/leads')} />
        <StatCard title="Manual Leads" value={leads.filter(l => String(l.data?.source || '').toLowerCase().includes('manual')).length} onClick={() => navigate('/admin/leads/manual')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Leads by Status</h3>
          <BarChart data={statusCounts} onBarClick={(label) => navigate(`/admin/leads?status=${encodeURIComponent(label)}`)} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Leads by Category</h3>
          <BarChart data={categoryCounts} onBarClick={(label) => navigate(`/admin/leads?category=${encodeURIComponent(label)}`)} />
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-medium mb-2">Leads (last 14 days)</h3>
          <LineChart points={recentSeries} />
        </div>
      </div>
    </AdminLayout>
  );
}
