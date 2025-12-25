import { useState, useEffect } from 'react';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { getDatabaseInstance } from '@/lib/firebase';
import { ref, query, orderByChild, limitToLast, get } from 'firebase/database';
import type { Lead, LeadCategory } from '@/lib/storage';
import { updateLeadAsync } from '@/lib/leads';
import { Loader2, Home, Briefcase, Building2, GraduationCap, Car, Gem, Landmark, CreditCard, FileSearch, Mail } from 'lucide-react';
import { LeadDetailsDialog } from '@/components/admin/LeadDetailsDialog';

const categoryLabels: Record<LeadCategory, { label: string; icon: any }> = {
  'home-loan': { label: 'Home Loan', icon: Home },
  'personal-loan': { label: 'Personal Loan', icon: Briefcase },
  'business-loan': { label: 'Business Loan', icon: Building2 },
  'education-loan': { label: 'Education Loan', icon: GraduationCap },
  'car-loan': { label: 'Car Loan', icon: Car },
  'gold-loan': { label: 'Gold Loan', icon: Gem },
  'loan-against-property': { label: 'Loan against Property', icon: Landmark },
  'credit-card': { label: 'Credit Cards', icon: CreditCard },
  'cibil-check': { label: 'CIBIL Check', icon: FileSearch },
  contact: { label: 'Contact Form', icon: Mail },
  careers: { label: 'Careers', icon: Briefcase },
};

export function AdminDashboard() {
  const [recentLeads, setRecentLeads] = useState<Lead[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(true);

  const [stats, setStats] = useState<{ total: number; counts: Record<string, number> }>({ total: 0, counts: {} });
  const [loadingStats, setLoadingStats] = useState(true);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  const fetchRecent = async () => {
    const db = getDatabaseInstance();
    if (!db) return;
    try {
      // Get last 5 by timestamp (which are the newest)
      const q = query(ref(db, 'leads'), orderByChild('timestamp'), limitToLast(5));
      const snap = await get(q);
      const leads: Lead[] = [];
      snap.forEach(childSnap => {
        const d = childSnap.val();
        leads.push({ id: childSnap.key!, category: d.category, timestamp: d.timestamp, data: d.data });
      });
      // Reverse to show newest first
      setRecentLeads(leads.reverse());
    } catch (err) {
      console.error("Error fetching recent leads:", err);
    } finally {
      setLoadingRecent(false);
    }
  };

  const handleUpdateLead = async (updated: Lead) => {
    try {
      await updateLeadAsync(updated);
      setSelectedLead(null);
      fetchRecent(); // Refresh list to show changes
    } catch (e) {
      alert('Failed to update lead: ' + (e as Error).message);
    }
  };

  useEffect(() => {
    const db = getDatabaseInstance();
    if (!db) return;

    // 1. Fetch Recent Leads (Fast)
    fetchRecent();

    // 2. Fetch Stats (Background)
    const fetchStats = async () => {
      try {
        // We fetch all documents to count them. 
        // Note: For very large datasets (10k+), this should be replaced with server-side aggregation or distributed counters.
        const leadsRef = ref(db, 'leads');
        const snap = await get(leadsRef);

        const counts: Record<string, number> = {};
        let total = 0;

        snap.forEach(childSnap => {
          total++;
          const val = childSnap.val();
          const cat = val.category as string || 'other';
          counts[cat] = (counts[cat] || 0) + 1;
        });

        setStats({
          total,
          counts
        });
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoadingStats(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Overview of your leads and activities</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              {loadingStats ? (
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              ) : (
                <div className="text-3xl font-bold text-primary mb-2">{stats.total}</div>
              )}
              <div className="text-sm text-gray-600">Total Leads</div>
            </CardContent>
          </Card>

          {Object.entries(categoryLabels).slice(0, 7).map(([category, { label }]) => (
            <Card key={category}>
              <CardContent className="pt-6">
                {loadingStats ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                ) : (
                  <div className="text-3xl font-bold text-primary mb-2">
                    {stats.counts[category] || 0}
                  </div>
                )}
                <div className="text-sm text-gray-600">{label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Leads Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingRecent ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : recentLeads.length > 0 ? (
                recentLeads.map(lead => (
                  <div key={lead.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="font-medium">{lead.data?.fullName || lead.data?.name || 'Unknown User'}</p>
                      <p className="text-sm text-gray-500">{lead.category} • {new Date(lead.timestamp).toLocaleDateString()}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setSelectedLead(lead)}>View</Button>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">No activity yet.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedLead && (
        <LeadDetailsDialog
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={handleUpdateLead}
        />
      )}
    </AdminLayout>
  );
}
