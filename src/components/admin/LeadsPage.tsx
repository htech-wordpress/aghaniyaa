import React, { useEffect, useState, useRef } from 'react'; // updated
import { useLocation } from 'react-router-dom';
import { getAuth } from 'firebase/auth'; // updated
import { Button } from '@/components/ui/button';
import { saveLeadAsync, updateLeadAsync, subscribeToLeads, importLeadsFromCSV, importLeadsFromExcel, exportLeadsToCSV, uploadLeadDocument, addDocumentToLeadAsync } from '@/lib/leads';
import type { Lead, LeadCategory } from '@/lib/storage';

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
  const [updatedByFilter, setUpdatedByFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    // category override handled below when deriving displayedLeads

    // subscribe to leads for realtime updates
    // subscription is also re-created when `effectiveCategory` changes below
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
  }, [leads, selectedLead]); // Added selectedLead to dependencies for correctness, reliant on the diff check

  const sortedDisplayedLeads = displayedLeads.slice().sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const processedLeads = sortedDisplayedLeads.filter(l => {
    const status = l.data?.status || 'New';
    const loanType = l.data?.loanType || '';
    const source = l.data?.source || 'Website Leads';
    const updatedBy = l.data?.updatedBy || '';
    // ... existing filter logic ...
    if (statusFilter !== 'All' && status !== statusFilter) return false;
    if (loanTypeFilter !== 'All' && loanTypeFilter !== 'Website Leads' && loanType !== loanTypeFilter) return false;
    if (sourceFilter !== 'All' && source !== sourceFilter) return false;
    if (updatedByFilter !== 'All' && updatedBy !== updatedByFilter) return false;

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




  // Small UI subcomponents (copied for isolation)
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
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status] || 'bg-gray-100 text-gray-800'}`}>{status}</span>
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

  const LeadDetailsDialog = ({ lead, onClose, onUpdate }: any) => {
    const [currentStatus, setCurrentStatus] = useState(lead.data?.status || 'New');
    const [comment, setComment] = useState('');
    const [activeTab, setActiveTab] = useState('update');

    // State for new loan input
    const [newLoan, setNewLoan] = useState({ bank: '', amount: '', emi: '' });

    const parseExistingLoans = (val: any) => {
      if (Array.isArray(val)) return val;
      if (typeof val === 'string' && val.trim()) {
        try { return JSON.parse(val); } catch (e) { return [{ bank: 'Unknown', amount: val, emi: '-' }]; }
      }
      return [];
    };

    // Edit form state
    const [form, setForm] = useState({
      fullName: lead.data?.fullName || lead.data?.name || '',
      email: lead.data?.email || '',
      mobile: lead.data?.mobile || '',
      loanType: lead.data?.loanType || '',
      amount: lead.data?.amount || lead.data?.loanAmount || '',
      reason: lead.data?.reason || '',
      source: lead.data?.source || '',
      // Additional Details
      employmentType: lead.data?.employmentType || '',
      monthlyIncome: lead.data?.monthlyIncome || '',
      existingLoans: parseExistingLoans(lead.data?.existingLoans),
      // Bank Config
      accountHolder: lead.data?.accountHolder || '',
      accountNumber: lead.data?.accountNumber || '',
      ifsc: lead.data?.ifsc || '',
      bankName: lead.data?.bankName || '',
      // Address
      address: lead.data?.address || '',
      city: lead.data?.city || '',
      state: lead.data?.state || '',
      zipCode: lead.data?.zipCode || '',
    });

    useEffect(() => {
      setForm({
        fullName: lead.data?.fullName || lead.data?.name || '',
        email: lead.data?.email || '',
        mobile: lead.data?.mobile || '',
        loanType: lead.data?.loanType || '',
        amount: lead.data?.amount || lead.data?.loanAmount || '',
        reason: lead.data?.reason || '',
        source: lead.data?.source || '',
        // Additional Details
        employmentType: lead.data?.employmentType || '',
        monthlyIncome: lead.data?.monthlyIncome || '',
        existingLoans: parseExistingLoans(lead.data?.existingLoans),
        // Bank Config
        accountHolder: lead.data?.accountHolder || '',
        accountNumber: lead.data?.accountNumber || '',
        ifsc: lead.data?.ifsc || '',
        bankName: lead.data?.bankName || '',
        // Address
        address: lead.data?.address || '',
        city: lead.data?.city || '',
        state: lead.data?.state || '',
        zipCode: lead.data?.zipCode || '',
      });
      // Also update current status when lead updates from background
      if (lead.data?.status) setCurrentStatus(lead.data.status);
    }, [lead]);

    if (!lead) return null;

    const handleDownload = async (url: string, filename: string) => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      } catch (e) {
        console.error('Download failed, opening in new tab', e);
        window.open(url, '_blank');
      }
    };

    const handleStatusUpdate = () => {
      if (!comment.trim()) { alert('Please add a comment'); return; }
      const currentUser = getAuth().currentUser?.email || 'Unknown User';
      const updated: Lead = {
        ...lead,
        data: {
          ...lead.data,
          status: currentStatus,
          updatedBy: currentUser, // Record who updated
          lastUpdated: new Date().toISOString(),
          pipeline: [...(lead.data?.pipeline || []), {
            status: currentStatus,
            date: new Date().toISOString(),
            comment,
            updatedBy: currentUser
          }],
        }
      };
      onUpdate(updated);
    };

    const handleSaveEdit = () => {
      if (!form.fullName || !form.email || !form.mobile) { alert('Please fill at least name, email and mobile'); return; }
      const currentUser = getAuth().currentUser?.email || 'Unknown User';
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
          // New fields
          employmentType: form.employmentType,
          monthlyIncome: form.monthlyIncome,
          existingLoans: form.existingLoans,
          accountHolder: form.accountHolder,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
          bankName: form.bankName,
          address: form.address,
          city: form.city,
          state: form.state,
          zipCode: form.zipCode,
          updatedBy: currentUser, // Record who updated
          lastUpdated: new Date().toISOString(),
        }
      };
      onUpdate(updated);
      setActiveTab('details');
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
                <button onClick={() => setActiveTab('update')} className={`px-4 py-2 ${activeTab === 'update' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Update Status</button>
                <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2 ${activeTab === 'pipeline' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Pipeline</button>
                <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Documents</button>
                <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Edit</button>
                <button onClick={() => setActiveTab('details')} className={`px-4 py-2 ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Details</button>
              </div>

              {activeTab === 'details' && (
                <div className="space-y-4">
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap">{JSON.stringify(lead.data, null, 2)}</pre>
                </div>
              )}

              {activeTab === 'documents' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Uploaded Documents</h3>
                    <label className="cursor-pointer bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-blue-700">
                      Upload New
                      <input type="file" className="hidden" onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          // Dynamic import to avoid heavy load if unused, or just allow it since used often
                          const { uploadLeadDocument, addDocumentToLeadAsync } = await import('@/lib/leads');
                          if (!confirm(`Upload ${file.name}?`)) return;

                          // Show temp loading state if needed, or just let global refresh handle it? 
                          // Ideally local state key
                          const url = await uploadLeadDocument(lead.id, file);
                          await addDocumentToLeadAsync(lead.id, { name: file.name, url, type: file.type });
                          alert('Document uploaded successfully!');
                          // Force refresh or rely on subscription?
                          // Subscription to 'leads' updates the list, but 'selectedLead' might be stale?
                          // 'selectedLead' in LeadsPage is just a state object.
                          // We need to close dialog or re-fetch active lead. 
                          // Actually, subscription updates 'leads' array. We should derive 'selectedLead' from 'leads' array to be reactive?
                          // For now, simpler: close dialog or just alert.
                          // Better: Trigger a local update if possible, or just re-select from props?
                          // Since 'onUpdate' prop exists but is for saving...
                          // The Firestore update will trigger subscription update.
                          // But LeadDetailsDialog uses 'lead' prop which comes from 'selectedLead' state.
                          // 'selectedLead' state is static once set!
                          // We should make LeadDetailsDialog reactive or manually update 'selectedLead'.
                          // Quick fix: manually update selectedLead copy? 
                          // Or just close dialog.
                          // Let's rely on parent re-render? No, parent passes 'selectedLead' which is state.
                          // We will call onUpdate with new data locally to refresh view?
                          onUpdate({
                            ...lead,
                            data: {
                              ...lead.data,
                              documents: [...(lead.data?.documents || []), { name: file.name, url, type: file.type, uploadedAt: new Date().toISOString(), uploadedBy: getAuth().currentUser?.email }]
                            }
                          });
                        } catch (err: any) {
                          console.error(err);
                          alert('Upload failed: ' + err.message);
                        }
                      }} />
                    </label>
                  </div>

                  {(!lead.data?.documents || lead.data.documents.length === 0) && (
                    <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
                  )}

                  <div className="grid grid-cols-1 gap-2">
                    {lead.data?.documents?.map((doc: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-blue-100 rounded flex items-center justify-center text-blue-600">📄</div>
                          <div>
                            <a href={doc.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline">{doc.name}</a>
                            <p className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleString()} • {doc.uploadedBy || 'Unknown'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'pipeline' && (
                <div className="space-y-4">
                  {(lead.data?.pipeline || []).map((item: any, idx: number) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex flex-col">
                          <StatusBadge status={item.status} />
                          <span className="text-xs text-gray-500 mt-1">Updated by: {item.updatedBy || 'Unknown'}</span>
                        </div>
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

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Additional Information</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Employment Type</label>
                        <input value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Salaried / Business" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Income</label>
                        <input value={form.monthlyIncome} onChange={(e) => setForm({ ...form, monthlyIncome: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Existing Loans</label>
                        <div className="space-y-2 mb-2">
                          {Array.isArray(form.existingLoans) && form.existingLoans.map((loan: any, idx: number) => (
                            <div key={idx} className="flex items-center gap-2 bg-gray-50 p-2 rounded border">
                              <span className="flex-1 text-sm font-medium">{loan.bank} - ₹{loan.amount} (EMI: {loan.emi})</span>
                              <button onClick={() => {
                                const newLoans = [...form.existingLoans];
                                newLoans.splice(idx, 1);
                                setForm({ ...form, existingLoans: newLoans });
                              }} className="text-red-500 hover:text-red-700">×</button>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input placeholder="Bank Name" value={newLoan.bank} onChange={(e) => setNewLoan({ ...newLoan, bank: e.target.value })} className="flex-1 px-2 py-1 border rounded text-sm" />
                          <input placeholder="Amount" value={newLoan.amount} onChange={(e) => setNewLoan({ ...newLoan, amount: e.target.value })} className="w-24 px-2 py-1 border rounded text-sm" />
                          <input placeholder="EMI" value={newLoan.emi} onChange={(e) => setNewLoan({ ...newLoan, emi: e.target.value })} className="w-20 px-2 py-1 border rounded text-sm" />
                          <Button size="sm" onClick={() => {
                            if (newLoan.bank && newLoan.amount) {
                              setForm({ ...form, existingLoans: [...(Array.isArray(form.existingLoans) ? form.existingLoans : []), newLoan] });
                              setNewLoan({ bank: '', amount: '', emi: '' });
                            }
                          }}>Add</Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Address Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                        <input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                        <input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                        <input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Zip Code</label>
                        <input value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">Bank Details</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder</label>
                        <input value={form.accountHolder} onChange={(e) => setForm({ ...form, accountHolder: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
                        <input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                        <input value={form.accountNumber} onChange={(e) => setForm({ ...form, accountNumber: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                        <input value={form.ifsc} onChange={(e) => setForm({ ...form, ifsc: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                      </div>
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

        {/* Loan Type Dropdown removed in favor of tabs for Website Leads, but kept for others or mobile if needed. 
            Actually, let's keep it as specific filter or rely on tabs. 
            User want "within table" list. Tabs are better UI for this.
        */}
        <div>
          {/* Fallback or secondary filter */}
          <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="All">All Sources</option>
            <option value="Website Leads">Website Leads</option>
            {category !== 'all' && <option value="Manual Entry">Manual Entry</option>}
          </select>
        </div>

        <div>
          <select value={updatedByFilter} onChange={(e) => setUpdatedByFilter(e.target.value)} className="w-full border rounded px-3 py-2">
            <option value="All">Updated By (All)</option>
            {Array.from(new Set(leads.map(l => l.data?.updatedBy).filter(Boolean))).map((email: any) => (
              <option key={email} value={email}>{email}</option>
            ))}
          </select>
        </div>
      </div>

      {effectiveCategory === 'all' && (
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
      )}

      <div className="text-sm text-gray-600 mb-4">Showing {(page - 1) * pageSize + 1} - {Math.min(page * pageSize, totalItems)} of {totalItems} leads</div>

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

      {selectedLead && (
        <LeadDetailsDialog lead={selectedLead} onClose={() => setSelectedLead(null)} onUpdate={handleUpdateLead} />
      )}


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
    </div>
  );
}
