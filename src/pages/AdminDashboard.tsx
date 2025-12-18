import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { 
  clearAllLeads,
  isAdminAuthenticated,
  seedDummyData,
  subscribeToLeads,
  updateLeadAsync,
} from '@/lib/storage';
import type { Lead, LeadCategory } from '@/lib/storage';
import { Trash2, Download, Database } from 'lucide-react';
import {
  Home,
  Briefcase,
  Building2,
  GraduationCap,
  Car,
  Gem,
  Landmark,
  CreditCard,
  FileSearch,
  Mail,
} from 'lucide-react';

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

  const [counts, setCounts] = useState<Record<LeadCategory, number>>({} as Record<LeadCategory, number>);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    // subscribe to leads (realtime); this will pick up Firestore or local fallback
    const unsub = subscribeToLeads((next: Lead[]) => {
      setLeads(next);
      const countsMap: Record<string, number> = {};
      next.forEach(l => { countsMap[l.category] = (countsMap[l.category] || 0) + 1; });
      setCounts(countsMap as Record<LeadCategory, number>);
    });

    return () => unsub();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadLeads = () => {
    // left intentionally blank; realtime subscription handles updates
  };


  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL leads? This cannot be undone.')) {
      clearAllLeads();
      loadLeads();
    }
  };

  // Export JSON (website leads only)
  const handleExport = () => {
    const website = leads.filter(l => !String(l.data?.source || '').toLowerCase().includes('manual'));
    const dataStr = JSON.stringify(website, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_website_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };



  const handleSeedDummyData = () => {
    if (leads.length > 0) {
      if (!confirm('You already have leads. Do you want to add dummy data anyway?')) {
        return;
      }
    } else {
      if (!confirm('This will populate the leads table with sample dummy data for all categories. Continue?')) {
        return;
      }
    }
    
    seedDummyData();
    loadLeads();
    alert('Dummy data has been successfully added to the leads table!');
  };



  // Dashboard shows Website leads (exclude Manual Entry leads)
  const displayedLeads = leads.filter(l => !String(l.data?.source || '').toLowerCase().includes('manual'));

  const totalLeads = leads.length;

  // Pagination state
  const [page, setPage] = useState<number>(1);
  const pageSize = 10;

  // Reset to first page when leads or filters change
  useEffect(() => {
    setPage(1);
  }, [leads]);

  // Sort once and derive pagination values
  const sortedDisplayedLeads = displayedLeads
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  // Filters & UI state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loanTypeFilter, setLoanTypeFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  // Apply UI filters on sorted leads
  const processedLeads = sortedDisplayedLeads.filter(l => {
    const status = l.data?.status || 'New';
    const loanType = l.data?.loanType || categoryLabels[l.category]?.label || '';
    const source = l.data?.source || 'Website Leads';

    if (statusFilter !== 'All' && status !== statusFilter) return false;
    if (loanTypeFilter !== 'All' && loanTypeFilter !== 'Website Leads' && loanType !== loanTypeFilter) return false;
    if (sourceFilter !== 'All' && source !== sourceFilter) return false;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const name = String(l.data?.fullName || l.data?.name || '').toLowerCase();
      const email = String(l.data?.email || '').toLowerCase();
      const mobile = String(l.data?.mobile || '');
      if (!name.includes(q) && !email.includes(q) && !mobile.includes(q)) return false;
    }

    return true;
  });

  const totalItems = processedLeads.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Keep page within bounds
  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, totalItems);

  const pagedLeads = processedLeads.slice((page - 1) * pageSize, page * pageSize);

  // Helper accessors
  const leadName = (l: Lead) => l.data?.fullName || l.data?.name || 'N/A';
  const leadSource = (l: Lead) => l.data?.source || 'Website Leads';
  const leadLoanType = (l: Lead) => l.data?.loanType || categoryLabels[l.category]?.label || '';
  const leadAmount = (l: Lead) => {
    if (l.data?.loanAmount) return `₹${Number(l.data.loanAmount).toLocaleString('en-IN')}`;
    if (l.data?.amount) return `₹${Number(l.data.amount).toLocaleString('en-IN')}`;
    return '-';
  };
  const leadStatus = (l: Lead) => l.data?.status || 'New';

  const openLeadDetails = (l: Lead) => setSelectedLead(l);





  const handleUpdateLead = async (updated: Lead) => {
    try {
      await updateLeadAsync(updated);
      setSelectedLead(null);
    } catch (e) {
      alert('Failed to update lead: ' + (e as Error).message);
    }
  };

  // Small UI components
  const StatusBadge = ({ status }: { status: string }) => {
    const colors: Record<string, string> = {
      'New': 'bg-blue-100 text-blue-800',
      'Contacted': 'bg-yellow-100 text-yellow-800',
      'Qualified': 'bg-purple-100 text-purple-800',
      'Proposal': 'bg-indigo-100 text-indigo-800',
      'Negotiation': 'bg-orange-100 text-orange-800',
      'Approved': 'bg-green-100 text-green-800',
      'Rejected': 'bg-red-100 text-red-800',
    };
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  const Dialog = ({ open, onOpenChange, children }: any) => {
    if (!open) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };



  const LeadDetailsDialog = ({ lead, onClose, onUpdate }: any) => {
    const [currentStatus, setCurrentStatus] = useState(lead.data?.status || 'New');
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState('details');

    // Edit form state
    const [form, setForm] = useState({
      fullName: lead.data?.fullName || lead.data?.name || '',
      email: lead.data?.email || '',
      mobile: lead.data?.mobile || '',
      loanType: lead.data?.loanType || '',
      amount: lead.data?.amount || lead.data?.loanAmount || '',
      reason: lead.data?.reason || '',
      source: lead.data?.source || '',
    });

    // Reset form when lead changes
    useEffect(() => {
      setForm({
        fullName: lead.data?.fullName || lead.data?.name || '',
        email: lead.data?.email || '',
        mobile: lead.data?.mobile || '',
        loanType: lead.data?.loanType || '',
        amount: lead.data?.amount || lead.data?.loanAmount || '',
        reason: lead.data?.reason || '',
        source: lead.data?.source || '',
      });
    }, [lead]);

    const handleSaveEdit = () => {
      // minimal validation
      if (!form.fullName || !form.email || !form.mobile) {
        alert('Please fill at least name, email and mobile');
        return;
      }

      const updated: Lead = {
        ...lead,
        data: {
          ...lead.data,
          fullName: form.fullName,
          name: form.fullName,
          email: form.email,
          mobile: form.mobile,
          loanType: form.loanType,
          amount: form.amount,
          loanAmount: form.amount,
          reason: form.reason,
          source: form.source,
        },
      };

      onUpdate(updated);
      setActiveTab('details');
    };

    if (!lead) return null;

    const handleStatusUpdate = () => {
      if (!comment.trim()) { alert('Please add a comment'); return; }
      const updated: Lead = {
        ...lead,
        data: {
          ...lead.data,
          status: currentStatus,
          pipeline: [ ...(lead.data?.pipeline || []), { status: currentStatus, date: new Date().toISOString(), comment } ],
        }
      };
      onUpdate(updated);
    };

    return (
      <Dialog open={true} onOpenChange={onClose}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Lead Details</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Name</label>
                <p className="text-gray-900">{leadName(lead)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <p className="text-gray-900">{lead.data?.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <p className="text-gray-900">{lead.data?.mobile}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Loan Type</label>
                <p className="text-gray-900">{leadLoanType(lead)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Amount</label>
                <p className="text-gray-900">{leadAmount(lead)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Source</label>
                <p className="text-gray-900">{leadSource(lead)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Status</label>
                <StatusBadge status={leadStatus(lead)} />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700">Date</label>
                <p className="text-gray-900">{new Date(lead.timestamp).toLocaleDateString()}</p>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 border-b border-gray-200 mb-4">
                <button onClick={() => setActiveTab('details')} className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Details</button>
                <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2 ${activeTab === 'pipeline' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Pipeline</button>
                <button onClick={() => setActiveTab('update')} className={`px-4 py-2 ${activeTab === 'update' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Update Status</button>
                <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Edit</button>
              </div>

              {activeTab === 'details' && (
                <div className="space-y-4">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(lead.data, null, 2)}</pre>
                </div>
              )}

              {activeTab === 'pipeline' && (
                <div className="space-y-4">
                  {(lead.data?.pipeline || []).map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <StatusBadge status={item.status} />
                        <span className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</span>
                      </div>
                      <p className="text-gray-700">{item.comment}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'update' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Status</label>
                    <select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)} className="w-full border rounded px-3 py-2">
                      <option>New</option>
                      <option>Contacted</option>
                      <option>Qualified</option>
                      <option>Proposal</option>
                      <option>Negotiation</option>
                      <option>Approved</option>
                      <option>Rejected</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
                    <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Add a comment about this status update..." />
                  </div>

                  <button onClick={handleStatusUpdate} className="w-full px-4 py-2 bg-blue-600 text-white rounded-md">Update Status</button>
                </div>
              )}

              {activeTab === 'edit' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                      <input value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
                      <input value={form.loanType} onChange={(e) => setForm({ ...form, loanType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                      <input value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} type="number" className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                      <input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                    <textarea value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                  </div>

                  <div className="flex items-center gap-2">
                    <Button onClick={handleSaveEdit}>Save</Button>
                    <Button variant="outline" onClick={() => setActiveTab('details')}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    );
  };

  if (!isAdminAuthenticated()) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Manage all leads and inquiries</p>
            </div>
            <div className="flex items-center gap-4 flex-wrap">
              <Button variant="default" onClick={handleSeedDummyData}>
                <Database className="h-4 w-4 mr-2" />
                Add Dummy Data
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>

              <Button variant="destructive" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <AdminLayout>
        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-primary mb-2">{totalLeads}</div>
              <div className="text-sm text-gray-600">Total Leads</div>
            </CardContent>
          </Card>
          {Object.entries(categoryLabels).slice(0, 4).map(([category, { label }]) => (
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Website Leads</h2>
              <p className="text-sm text-gray-500 mt-1">Manage and track your leads</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div className="relative">
              <input type="text" placeholder="Search leads..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div>
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="All">All Status</option>
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Proposal">Proposal</option>
                <option value="Negotiation">Negotiation</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div>
              <select value={loanTypeFilter} onChange={(e) => setLoanTypeFilter(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="All">All Loan Types</option>
                <option value="Website Leads">Website Leads</option>
                <option value="Home Loan">Home Loan</option>
                <option value="Personal Loan">Personal Loan</option>
                <option value="Business Loan">Business Loan</option>
                <option value="Education Loan">Education Loan</option>
                <option value="Car Loan">Car Loan</option>
                <option value="Gold Loan">Gold Loan</option>
                <option value="Loan against Property">Loan against Property</option>
                <option value="Credit Cards">Credit Cards</option>
              </select>
            </div>

            <div>
              <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full border rounded px-3 py-2">
                <option value="All">All Sources</option>
                <option value="Website Leads">Website Leads</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600 mb-4">Showing {start} - {end} of {totalItems} leads</div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loan Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagedLeads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <div className="w-5 h-5 text-blue-600">👤</div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{leadName(lead)}</div>
                          <div className="text-sm text-gray-500">{leadSource(lead)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{lead.data?.email || ''}</div>
                      <div className="text-sm text-gray-500">{lead.data?.mobile || ''}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium bg-purple-100 text-purple-800 rounded-full">{leadLoanType(lead)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leadAmount(lead)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">{leadStatus(lead)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(lead.timestamp).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => openLeadDetails(lead)} className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Prev</button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} className={p === page ? 'px-4 py-2 rounded-md bg-blue-600 text-white' : 'px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50'}>{p}</button>
              ))}
            </div>

            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50">Next</button>
          </div>
        </div>

        {selectedLead && (
          <LeadDetailsDialog lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleUpdateLead} />
        )}


      </AdminLayout>
    </div>
  );
}

