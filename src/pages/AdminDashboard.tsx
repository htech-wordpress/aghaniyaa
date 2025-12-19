import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardTitle, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AdminLayout } from '@/components/admin/AdminLayout';
import {
  subscribeToLeads,
} from '@/lib/leads';
import type { Lead, LeadCategory } from '@/lib/storage';
import { Download, Loader2, Home, Briefcase, Building2, GraduationCap, Car, Gem, Landmark, CreditCard, FileSearch, Mail } from 'lucide-react';

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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<LeadCategory, number>>({} as Record<LeadCategory, number>);
  const navigate = useNavigate();

  useEffect(() => {
    // Real-time subscription to leads
    const unsub = subscribeToLeads((updatedLeads) => {
      setLeads(updatedLeads);

      // Calculate counts
      const newCounts: Record<string, number> = {};
      updatedLeads.forEach(l => {
        newCounts[l.category] = (newCounts[l.category] || 0) + 1;
      });
      setCounts(newCounts as Record<LeadCategory, number>);
      setLoading(false);
    });

    return () => unsub();
  }, []);




  const totalLeads = leads.length;

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500">Overview of your leads and activities</p>
          </div>
        </div>

        {loading && leads.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-gray-500">Loading leads...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-primary mb-2">{totalLeads}</div>
                <div className="text-sm text-gray-600">Total Leads</div>
              </CardContent>
            </Card>
            {Object.entries(categoryLabels).slice(0, 7).map(([category, { label }]) => (
              <Card key={category}>
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">
                    {counts[category as LeadCategory] || 0}
                  </div>
                  <div className="text-sm text-gray-600">{label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Leads Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {leads.slice(0, 5).map(lead => (
                <div key={lead.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{lead.data?.fullName || lead.data?.name || 'Unknown User'}</p>
                    <p className="text-sm text-gray-500">{lead.category} • {new Date(lead.timestamp).toLocaleDateString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => navigate('/admin/leads/website')}>View</Button>
                </div>
              ))}
              {leads.length === 0 && <p className="text-center text-gray-500 py-4">No activity yet.</p>}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

