import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogHeader } from '@/components/ui/dialog';
import type { Lead } from '@/lib/storage';

export const StatusBadge = ({ status }: { status: string }) => {
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

export const LeadDetailsDialog = ({ lead, onClose, onUpdate, hideDetailsTab }: { lead: Lead, onClose: () => void, onUpdate: (lead: Lead) => void, hideDetailsTab?: boolean }) => {
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

    const leadName = (l: Lead) => l.data?.fullName || l.data?.name || 'N/A';
    const leadSource = (l: Lead) => l.data?.source || 'Website Leads';
    const leadLoanType = (l: Lead) => l.data?.loanType || '';
    const leadAmount = (l: Lead) => {
        if (l.data?.loanAmount) return `₹${Number(l.data.loanAmount).toLocaleString('en-IN')}`;
        if (l.data?.amount) return `₹${Number(l.data.amount).toLocaleString('en-IN')}`;
        return '-';
    };
    const leadStatus = (l: Lead) => l.data?.status || 'New';

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
        <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Lead Details</DialogTitle>
                </DialogHeader>
                <div className="p-1">
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
                            <div className="flex items-center gap-2 border-b border-gray-200 mb-4 overflow-x-auto">
                                <button onClick={() => setActiveTab('update')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'update' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Update Status</button>
                                <button onClick={() => setActiveTab('pipeline')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'pipeline' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Pipeline</button>
                                {!hideDetailsTab && (
                                    <button onClick={() => setActiveTab('details')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'details' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Details</button>
                                )}
                                <button onClick={() => setActiveTab('documents')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'documents' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Documents</button>
                                <button onClick={() => setActiveTab('edit')} className={`px-4 py-2 whitespace-nowrap ${activeTab === 'edit' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}>Edit</button>
                            </div>

                            {activeTab === 'details' && !hideDetailsTab && (
                                <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2">
                                    {/* Personal & Employment */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 border-b border-blue-100 pb-2">Personal & Employment</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Full Name</span><span className="font-medium text-gray-900">{lead.data?.fullName || lead.data?.name || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Email</span><span className="font-medium text-gray-900 break-all">{lead.data?.email || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Mobile</span><span className="font-medium text-gray-900">{lead.data?.mobile || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Employment Type</span><span className="font-medium text-gray-900 capitalize">{lead.data?.employmentType || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Monthly Income</span><span className="font-medium text-gray-900">{lead.data?.monthlyIncome ? `₹${lead.data.monthlyIncome}` : '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Source</span><span className="font-medium text-gray-900">{lead.data?.source || '-'}</span></div>
                                        </div>
                                    </div>

                                    {/* Loan Details */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 border-b border-blue-100 pb-2">Loan Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Loan Type</span><span className="font-medium text-gray-900 capitalize">{lead.data?.loanType || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Requested Amount</span><span className="font-medium text-gray-900">{leadAmount(lead)}</span></div>
                                            <div className="col-span-1 md:col-span-2">
                                                <span className="text-gray-500 block text-xs uppercase tracking-wide">Reason/Purpose</span>
                                                <p className="font-medium text-gray-900 mt-1">{lead.data?.reason || 'No specific reason provided.'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Existing Loans */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 border-b border-blue-100 pb-2">Existing Loans</h4>
                                        {lead.data?.existingLoans && Array.isArray(lead.data.existingLoans) && lead.data.existingLoans.length > 0 ? (
                                            <div className="bg-white rounded border border-gray-200 divide-y divide-gray-100">
                                                {lead.data.existingLoans.map((l: any, i: number) => (
                                                    <div key={i} className="p-3 flex justify-between items-center text-sm">
                                                        <div>
                                                            <p className="font-semibold text-gray-800">{l.bank || 'Unknown Bank'}</p>
                                                            <p className="text-xs text-gray-500">EMI Amount</p>
                                                        </div>
                                                        <div className="text-right">
                                                            <p className="font-medium text-gray-900">₹{l.amount}</p>
                                                            <p className="text-xs text-gray-500">{l.emi ? `₹${l.emi}/mo` : 'EMI N/A'}</p>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-gray-500 italic">No existing loans recorded.</p>
                                        )}
                                    </div>

                                    {/* Address & Location */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 border-b border-blue-100 pb-2">Address & Location</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div className="col-span-1 md:col-span-2"><span className="text-gray-500 block text-xs uppercase tracking-wide">Street Address</span><span className="font-medium text-gray-900">{lead.data?.address || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">City</span><span className="font-medium text-gray-900">{lead.data?.city || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">State</span><span className="font-medium text-gray-900">{lead.data?.state || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Zip Code</span><span className="font-medium text-gray-900">{lead.data?.zipCode || '-'}</span></div>
                                        </div>
                                    </div>

                                    {/* Bank Details */}
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="text-sm font-semibold text-blue-900 mb-3 border-b border-blue-100 pb-2">Bank Details</h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Bank Name</span><span className="font-medium text-gray-900">{lead.data?.bankName || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Account Holder</span><span className="font-medium text-gray-900">{lead.data?.accountHolder || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">Account Number</span><span className="font-medium text-gray-900">{lead.data?.accountNumber || '-'}</span></div>
                                            <div><span className="text-gray-500 block text-xs uppercase tracking-wide">IFSC Code</span><span className="font-medium text-gray-900">{lead.data?.ifsc || '-'}</span></div>
                                        </div>
                                    </div>
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
                                                    // Dynamic import to avoid heavy load if unused
                                                    const { uploadLeadDocument, addDocumentToLeadAsync } = await import('@/lib/leads');
                                                    if (!confirm(`Upload ${file.name}?`)) return;

                                                    // Use window alert for simplicity as in original
                                                    const url = await uploadLeadDocument(lead.id, file);
                                                    await addDocumentToLeadAsync(lead.id, { name: file.name, url, type: file.type });
                                                    alert('Document uploaded successfully!');

                                                    // Immediately update local state to reflect change?
                                                    // Since we can't easily mutate the prop, we call onUpdate with the predicted new state
                                                    const currentUser = getAuth().currentUser?.email || 'Unknown';
                                                    onUpdate({
                                                        ...lead,
                                                        data: {
                                                            ...lead.data,
                                                            documents: [...(lead.data?.documents || []), { name: file.name, url, type: file.type, uploadedAt: new Date().toISOString(), uploadedBy: currentUser }]
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
                                    {(lead.data?.pipeline || []).length === 0 && <p className="text-gray-500">No history available.</p>}
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
                                                            <span className="flex-1 text-sm font-medium">{loan.bank || 'Unknown'} - ₹{loan.amount} (EMI: {loan.emi})</span>
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
            </DialogContent>
        </Dialog>
    );
};
