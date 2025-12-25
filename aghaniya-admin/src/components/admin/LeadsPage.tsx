import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { saveLeadAsync, updateLeadAsync, subscribeToLeads, importLeadsFromCSV, importLeadsFromExcel, exportLeadsToCSV } from '@/lib/leads';
import type { Lead, LeadCategory } from '@/lib/storage';
import { LeadDetailsDialog } from './LeadDetailsDialog';
import { getDatabaseInstance } from '@/lib/firebase';
import { get, ref } from 'firebase/database';

type Props = {
  category: LeadCategory | 'all' | 'manual';
  title?: string;
};

export function LeadsPage({ category, title }: Props) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [loanTypeFilter, setLoanTypeFilter] = useState<string>('All');
  const [sourceFilter, setSourceFilter] = useState<string>('All');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' }>({ key: 'timestamp', direction: 'desc' });
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Agent Filters
  const [agentsMap, setAgentsMap] = useState<Record<string, { name: string; role: string }>>({});
  const [agentNameFilter, setAgentNameFilter] = useState<string>('All');
  const [agentRoleFilter, setAgentRoleFilter] = useState<string>('All');

  // Fetch agents for filtering
  useEffect(() => {
    const fetchAgents = async () => {
      const db = getDatabaseInstance();
      if (!db) return;
      try {
        const snap = await get(ref(db, 'agents'));
        const map: Record<string, { name: string; role: string }> = {};
        if (snap.exists()) {
          snap.forEach(childSnap => {
            const d = childSnap.val();
            if (d.email) map[d.email] = { name: d.name, role: d.role };
          });
        }
        setAgentsMap(map);
      } catch (e) {
        console.error("Failed to fetch agents map", e);
      }
    };
    fetchAgents();
  }, []);

  // read query params to prefill filters
  const { search } = useLocation();
  useEffect(() => {
    const params = new URLSearchParams(search);
    const qStatus = params.get('status');
    const qLoan = params.get('loanType');
    const qSource = params.get('source');

    if (qStatus) setStatusFilter(qStatus);
    if (qLoan) setLoanTypeFilter(qLoan);
    if (qSource) setSourceFilter(qSource);
  }, [search]);

  const manualPredicate = (l: Lead) => String(l.data?.source || '').toLowerCase().includes('manual');

  // allow query category override
  const params2 = new URLSearchParams(search);
  const qCategory = params2.get('category') as (LeadCategory | 'all' | 'manual') | null;
  const effectiveCategory = qCategory || category;

  const displayedLeads = effectiveCategory === 'all'
    ? leads.filter(l => !manualPredicate(l))
    : effectiveCategory === 'manual'
      ? leads.filter(manualPredicate)
      : leads.filter(l => l.category === effectiveCategory);

  // subscribe to leads changes (real-time)
  useEffect(() => {
    const unsub = subscribeToLeads((next) => setLeads(next),
      effectiveCategory === 'all' ? undefined : (effectiveCategory === 'manual' ? undefined : (effectiveCategory as LeadCategory))
    );

    return () => unsub();

  }, [effectiveCategory]);

  // Sync selectedLead with real-time updates
  useEffect(() => {
    if (selectedLead) {
      const fresh = leads.find(l => l.id === selectedLead.id);
      // Compare stringified to avoid infinite loops if object reference changes but content is same
      if (fresh && JSON.stringify(fresh.data) !== JSON.stringify(selectedLead.data)) {
        setSelectedLead(fresh);
      }
    }
  }, [leads, selectedLead]);

  const sortedDisplayedLeads = displayedLeads.slice().sort((a, b) => {
    const key = sortConfig.key;
    const dir = sortConfig.direction === 'asc' ? 1 : -1;

    let valA: any = '';
    let valB: any = '';

    if (key === 'timestamp') {
      return (new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()) * dir;
    } else if (key === 'lastUpdated') {
      const timeA = a.data?.lastUpdated ? new Date(a.data.lastUpdated).getTime() : 0;
      const timeB = b.data?.lastUpdated ? new Date(b.data.lastUpdated).getTime() : 0;
      return (timeA - timeB) * dir;
    } else if (key === 'amount') {
      valA = Number(a.data?.amount || a.data?.loanAmount || 0);
      valB = Number(b.data?.amount || b.data?.loanAmount || 0);
      return (valA - valB) * dir;
    } else if (key === 'loanType') {
      valA = (a.data?.loanType || '').toLowerCase();
      valB = (b.data?.loanType || '').toLowerCase();
    } else if (key === 'status') {
      valA = (a.data?.status || '').toLowerCase();
      valB = (b.data?.status || '').toLowerCase();
    }

    if (valA < valB) return -1 * dir;
    if (valA > valB) return 1 * dir;
    return 0;
  });

  const processedLeads = sortedDisplayedLeads.filter(l => {
    const status = l.data?.status || 'New';
    const loanType = l.data?.loanType || '';
    const source = l.data?.source || 'Website Leads';
    const updatedBy = l.data?.updatedBy || '';
    // ... existing filter logic ...
    if (statusFilter !== 'All' && status !== statusFilter) return false;
    if (loanTypeFilter !== 'All' && loanTypeFilter !== 'Website Leads' && loanType !== loanTypeFilter) return false;
    if (sourceFilter !== 'All' && source !== sourceFilter) return false;



    // Agent Filters
    if (agentNameFilter !== 'All' || agentRoleFilter !== 'All') {
      const agentInfo = agentsMap[updatedBy] || { name: 'Unknown', role: 'unknown' };
      if (agentNameFilter !== 'All' && agentInfo.name !== agentNameFilter) return false;
      if (agentRoleFilter !== 'All' && agentInfo.role !== agentRoleFilter) return false;
    }

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

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  useEffect(() => setPage(1), [category, pageSize, leads]);

  const pagedLeads = processedLeads.slice((page - 1) * pageSize, page * pageSize);

  const leadName = (l: Lead) => l.data?.fullName || l.data?.name || 'N/A';
  const leadSource = (l: Lead) => l.data?.source || 'Website Leads';
  const leadLoanType = (l: Lead) => l.data?.loanType || '';
  const leadAmount = (l: Lead) => {
    if (l.data?.loanAmount) return `₹${Number(l.data.loanAmount).toLocaleString('en-IN')}`;
    if (l.data?.amount) return `₹${Number(l.data.amount).toLocaleString('en-IN')}`;
    return '-';
  };
  const leadStatus = (l: Lead) => l.data?.status || 'New';

  // Local simple Dialog definition for AddLead and Export (preserved)
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

  const AddLeadDialog = ({ open, onClose, onAdd }: any) => {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', loanType: 'Personal Loan', amount: '', source: 'Manual Entry', category: 'contact' });

    if (!open) return null;

    return (
      <Dialog open={open} onOpenChange={onClose}>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Add New Lead</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone *</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
                <input type="text" value={formData.loanType} onChange={(e) => setFormData({ ...formData, loanType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={() => { if (!formData.name || !formData.email || !formData.phone) { alert('Please fill required fields'); return; } onAdd(formData); }}>Add Lead</Button>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
            </div>
          </div>
        </div>
      </Dialog>
    );
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;

    // Reset input so same file can be selected again if needed
    e.target.value = '';

    setIsImporting(true);
    const reader = new FileReader();
    reader.onload = async () => {
      try {
        // Check for Excel
        if (f.name.endsWith('.xlsx') || f.name.endsWith('.xls')) {
          const buffer = reader.result as ArrayBuffer;
          const imported = await importLeadsFromExcel(buffer);
          if (imported > 0) {
            alert(`${imported} leads imported successfully.`);
          } else {
            alert('No leads were imported from Excel.');
          }
        }
        // Fallback to CSV/Text
        else if (f.name.endsWith('.csv') || f.type === 'text/csv' || f.name.endsWith('.txt')) {
          const text = String(reader.result || '');
          const imported = await importLeadsFromCSV(text);
          if (imported > 0) {
            alert(`${imported} leads imported successfully.`);
          } else {
            alert('No leads were imported. Please check your CSV format.');
          }
        } else {
          alert('Only CSV and Excel (.xlsx, .xls) files are supported.');
        }
      } catch (err) {
        console.error(err);
        alert('Import failed due to an error.');
      } finally {
        setIsImporting(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setIsImporting(false);
    };

    if (f.name.endsWith('.xlsx') || f.name.endsWith('.xls')) {
      reader.readAsArrayBuffer(f);
    } else {
      reader.readAsText(f);
    }
  };

  const handleAddLead = async (formData: any) => {
    const category = (formData.category as LeadCategory) || 'contact';
    const currentUser = getAuth().currentUser?.email || 'Unknown User';
    const data = {
      fullName: formData.name,
      name: formData.name,
      email: formData.email,
      mobile: formData.phone,
      loanType: formData.loanType,
      amount: formData.amount,
      source: formData.source || 'Manual Entry',
      status: 'New',
      comments: [],
      updatedBy: currentUser,
      lastUpdated: new Date().toISOString(),
      pipeline: [{ status: 'New', date: new Date().toISOString(), comment: 'Lead created manually', updatedBy: currentUser }],
    };

    console.log('Attempting to save manual lead:', { category, data });
    try {
      const result = await saveLeadAsync(category, data);
      console.log('Lead saved successfully:', result);
      setShowAddDialog(false);
      alert('Lead added successfully');
    } catch (e: any) {
      console.error('Failed to save lead:', e);
      alert('Failed to save lead: ' + (e.message || JSON.stringify(e)));
    }
  };

  const handleUpdateLead = async (updated: Lead) => {
    try {
      await updateLeadAsync(updated);
      setSelectedLead(null);
    } catch (e) {
      alert('Failed to update lead: ' + (e as Error).message);
    }
  };

  const handleExportCSV = () => {
    setShowExportDialog(true);
  };

  const handleExportChoice = (scope: 'all' | 'page') => {
    const dataToExport = scope === 'all' ? sortedDisplayedLeads : pagedLeads;
    const csv = exportLeadsToCSV(dataToExport);
    if (!csv) { alert('No leads to export.'); setShowExportDialog(false); return; }

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_${scope}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    setShowExportDialog(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-sm text-gray-500 mt-1">Manage and track your leads</p>
        </div>

        {effectiveCategory === 'manual' && (
          <div className="flex items-center gap-2">
            <Button variant="default" onClick={() => setShowAddDialog(true)}>Add Lead</Button>

            <input
              type="file"
              ref={fileInputRef}
              accept=".csv,text/csv,.xlsx,.xls"
              onChange={handleImportFile}
              disabled={isImporting}
              className="hidden"
            />
            <Button variant="outline" onClick={() => import('@/lib/demo_template').then(m => m.downloadDemoCSVTemplate())}>
              Download Template
            </Button>

            <Button
              variant="outline"
              disabled={isImporting}
              onClick={() => fileInputRef.current?.click()}
            >
              {isImporting ? 'Importing...' : 'Import'}
            </Button>

            <Button variant="outline" onClick={handleExportCSV}>Export CSV</Button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-4">
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
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="All">All Sources</option>
            <option value="Website Leads">Website Leads</option>
            {category !== 'all' && <option value="Manual Entry">Manual Entry</option>}
          </select>
        </div>




        {/* New Agent Filters for Manual Leads / All */}
        <div>
          <select value={agentRoleFilter} onChange={(e) => setAgentRoleFilter(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="All">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="agent">Agent</option>
          </select>
        </div>

        <div>
          <select value={agentNameFilter} onChange={(e) => setAgentNameFilter(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="All">All Agents</option>
            {Object.values(agentsMap).map(a => a.name).filter((v, i, a) => a.indexOf(v) === i).sort().map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {
        effectiveCategory === 'all' && (
          <div className="mb-6 overflow-x-auto pb-2">
            <div className="flex space-x-2">
              {[
                'All',
                'Home Loan',
                'Personal Loan',
                'Business Loan',
                'Education Loan',
                'Car Loan',
                'Gold Loan',
                'Loan against Property',
                'Credit Cards'
              ].map(type => {
                const count = type === 'All'
                  ? displayedLeads.length
                  : displayedLeads.filter(l => l.data?.loanType === type).length;

                return (
                  <button
                    key={type}
                    onClick={() => { setLoanTypeFilter(type === 'All' ? 'All' : type); setPage(1); }}
                    className={`px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${(loanTypeFilter === type || (loanTypeFilter === 'All' && type === 'All'))
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {type} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )
      }

      <div className="text-sm text-gray-600 mb-4">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} of {totalItems} leads</div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-blue-600 hover:text-white transition-colors rounded-t-sm" onClick={() => setSortConfig({ key: 'loanType', direction: sortConfig.key === 'loanType' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                Loan Type {sortConfig.key === 'loanType' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-blue-600 hover:text-white transition-colors rounded-t-sm" onClick={() => setSortConfig({ key: 'amount', direction: sortConfig.key === 'amount' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                Amount {sortConfig.key === 'amount' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-blue-600 hover:text-white transition-colors rounded-t-sm" onClick={() => setSortConfig({ key: 'status', direction: sortConfig.key === 'status' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                Status {sortConfig.key === 'status' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-blue-600 hover:text-white transition-colors rounded-t-sm" onClick={() => setSortConfig({ key: 'timestamp', direction: sortConfig.key === 'timestamp' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                Creation Date {sortConfig.key === 'timestamp' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-blue-600 hover:text-white transition-colors rounded-t-sm" onClick={() => setSortConfig({ key: 'lastUpdated', direction: sortConfig.key === 'lastUpdated' && sortConfig.direction === 'asc' ? 'desc' : 'asc' })}>
                Last Updated {sortConfig.key === 'lastUpdated' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
              </th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {lead.data?.lastUpdated ? new Date(lead.data.lastUpdated).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <button onClick={() => setSelectedLead(lead)} className="text-blue-600 hover:text-blue-800 font-medium">View Details</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
        <div>
          <label className="inline-flex items-center gap-2">
            <span className="text-sm text-gray-600">Per page</span>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="ml-2 border rounded px-2 py-1">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>

        <div className="flex gap-2 items-center">
          <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-4 py-2 border border-gray-300 rounded-md">Prev</button>
          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)} className={p === page ? 'px-4 py-2 rounded-md bg-blue-600 text-white' : 'px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50'}>{p}</button>
            ))}
          </div>
          <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="px-4 py-2 border border-gray-300 rounded-md">Next</button>
        </div>
      </div>

      {
        selectedLead && (
          <LeadDetailsDialog lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleUpdateLead} />
        )
      }


      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <div className="p-6">
          <h3 className="text-lg font-bold mb-4">Export Options</h3>
          <p className="mb-6 text-gray-600">Choose which leads you want to export:</p>
          <div className="space-y-3">
            <Button className="w-full justify-start text-left" onClick={() => handleExportChoice('all')}>
              <span className="font-semibold mr-2">Export All Leads</span>
              <span className="text-xs text-gray-500">({sortedDisplayedLeads.length} leads - Current Category)</span>
            </Button>
            <Button variant="outline" className="w-full justify-start text-left" onClick={() => handleExportChoice('page')}>
              <span className="font-semibold mr-2">Export Current Page</span>
              <span className="text-xs text-gray-500">({pagedLeads.length} leads - Visible on screen)</span>
            </Button>
          </div>
        </div>
      </Dialog>

      <AddLeadDialog open={showAddDialog} onClose={() => setShowAddDialog(false)} onAdd={handleAddLead} />
    </div >
  );
}
