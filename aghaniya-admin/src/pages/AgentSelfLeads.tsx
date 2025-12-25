import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useAgent } from '@/contexts/AgentContext';
import { getDatabaseInstance } from '@/lib/firebase';
import { ref, query, orderByChild, equalTo, get, push, update, child } from 'firebase/database';
import { Plus, Ban, Upload, Download } from 'lucide-react';
import { LeadDetailsDialog } from '@/components/admin/LeadDetailsDialog';
import type { Lead, LeadCategory } from '@/lib/storage';
import * as XLSX from 'xlsx';

export function AgentSelfLeads() {
    const { currentAgent, loading: agentLoading } = useAgent();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

    // Simple Add Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        loanType: 'home-loan',
        loanAmount: '',
        city: '',
        state: '',
        notes: '',
        status: 'New',
    });

    useEffect(() => {
        if (currentAgent) {
            loadLeads();
        }
    }, [currentAgent]);

    const loadLeads = async () => {
        if (!currentAgent) return;

        setLoading(true);
        const db = getDatabaseInstance();
        if (!db) {
            setLoading(false);
            return;
        }

        try {
            const leadsRef = ref(db, 'leads');
            const q = query(
                leadsRef,
                orderByChild('assignedTo'),
                equalTo(currentAgent.id)
            );
            const snapshot = await get(q);
            const leadsList: Lead[] = [];

            snapshot.forEach((childSnap) => {
                const d = childSnap.val();
                if (d.data) {
                    leadsList.push({ id: childSnap.key!, category: d.category, timestamp: d.timestamp, data: d.data } as Lead);
                } else {
                    const category = (d.loanType || d.category || 'contact') as LeadCategory;
                    leadsList.push({
                        id: childSnap.key!,
                        category: category,
                        timestamp: d.createdAt || new Date().toISOString(),
                        data: {
                            ...d,
                            fullName: d.name,
                            mobile: d.phone,
                            loanAmount: d.loanAmount,
                            amount: d.loanAmount,
                            status: d.status || 'New',
                            source: 'Manual Entry',
                            documents: d.documents || []
                        }
                    });
                }
            });

            // Client-side sort by timestamp descending
            leadsList.sort((a, b) => {
                const tA = new Date(a.timestamp || 0).getTime();
                const tB = new Date(b.timestamp || 0).getTime();
                return tB - tA;
            });

            setLeads(leadsList);
        } catch (error) {
            console.error('Error loading leads:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSimpleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await saveLead(formData);
        setIsDialogOpen(false);
        resetForm();
    };

    const saveLead = async (data: typeof formData) => {
        if (!data.name || !data.email || !data.phone) {
            alert('Name, Email and Phone are required');
            return;
        }

        const db = getDatabaseInstance();
        if (!db || !currentAgent) return;

        const timestamp = new Date().toISOString();
        const leadData = {
            fullName: data.name,
            name: data.name,
            email: data.email,
            mobile: data.phone,
            loanType: data.loanType,
            loanAmount: data.loanAmount,
            amount: data.loanAmount,
            city: data.city,
            state: data.state,
            reason: data.notes,
            status: data.status,
            source: 'Manual Entry',
            documents: [],
            pipeline: [{ status: data.status, date: timestamp, comment: 'Lead created by agent', updatedBy: currentAgent.email }]
        };

        const leadsRef = ref(db, 'leads');
        await push(leadsRef, {
            category: (data.loanType as LeadCategory) || 'contact',
            timestamp: timestamp,
            createdAt: timestamp,
            assignedTo: currentAgent.id,
            assignedToAgentId: currentAgent.agentId,
            data: leadData
        });

        loadLeads();
    };

    const handleDownloadSample = () => {
        const sampleData = [
            {
                "Full Name": "John Doe",
                "Email": "john@example.com",
                "Phone": "9876543210",
                "Loan Type": "home-loan",
                "Loan Amount": 500000,
                "City": "Mumbai",
                "State": "Maharashtra",
                "Status": "New",
                "Notes": "Urgent requirement"
            },
            {
                "Full Name": "Jane Smith",
                "Email": "jane@example.com",
                "Phone": "9123456780",
                "Loan Type": "personal-loan",
                "Loan Amount": 100000,
                "City": "Delhi",
                "State": "Delhi",
                "Status": "Contacted",
                "Notes": "Call after 6 PM"
            }
        ];
        const ws = XLSX.utils.json_to_sheet(sampleData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Leads");
        XLSX.writeFile(wb, "Leads_Import_Sample.xlsx");
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data);
            const worksheet = workbook.Sheets[workbook.SheetNames[0]];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            if (jsonData.length === 0) {
                alert('No data found in the Excel file.');
                setLoading(false);
                return;
            }

            let successCount = 0;
            // Process sequentially
            for (const row of jsonData as any[]) {
                const leadInput = {
                    name: row['Full Name'] || row['Name'] || '',
                    email: row['Email'] || '',
                    phone: String(row['Phone'] || row['Mobile'] || ''), // Ensure string
                    loanType: (row['Loan Type'] || 'home-loan').toLowerCase().replace(' ', '-'),
                    loanAmount: String(row['Loan Amount'] || ''),
                    city: row['City'] || '',
                    state: row['State'] || '',
                    notes: row['Notes'] || '',
                    status: row['Status'] || 'New',
                };

                // Basic validation
                if (leadInput.name && (leadInput.email || leadInput.phone)) {
                    await saveLead(leadInput);
                    successCount++;
                }
            }

            alert(`Successfully imported ${successCount} leads.`);
            loadLeads();
        } catch (err) {
            console.error('Import error:', err);
            alert('Failed to import leads. Please check the file format.');
        } finally {
            setLoading(false);
            e.target.value = ''; // Reset file input
        }
    };

    const handleComplexUpdate = async (updatedLead: Lead) => {
        const db = getDatabaseInstance();
        if (!db) return;

        setLoading(true);
        try {
            await update(child(ref(db, 'leads'), updatedLead.id), {
                category: updatedLead.category,
                data: updatedLead.data,
                updatedAt: new Date().toISOString()
            });
            alert('Lead updated successfully!');
            setSelectedLead(null);
            loadLeads();
        } catch (error) {
            console.error('Error updating lead:', error);
            alert('Failed to update lead');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (leadId: string, leadName: string, currentData: any) => {
        if (!confirm(`Are you sure you want to REJECT the lead for ${leadName}?`)) return;

        const db = getDatabaseInstance();
        if (!db || !currentAgent) return;

        setLoading(true);
        try {
            const timestamp = new Date().toISOString();
            // Create updated pipeline
            const newPipeline = [
                ...(currentData.pipeline || []),
                { status: 'Rejected', date: timestamp, comment: 'Rejected by agent', updatedBy: currentAgent.email }
            ];

            // We need to update specific fields in the data object.
            // In RTDB, nested updates are tricky if not careful with paths.
            // We can update "data/status" and "data/pipeline".
            const updates = {
                [`data/status`]: 'Rejected',
                [`data/pipeline`]: newPipeline,
                updatedAt: timestamp
            };

            await update(child(ref(db, 'leads'), leadId), updates);

            alert('Lead rejected successfully!');
            loadLeads();
        } catch (error) {
            console.error('Error rejecting lead:', error);
            alert('Failed to reject lead.');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            email: '',
            phone: '',
            loanType: 'home-loan',
            loanAmount: '',
            city: '',
            state: '',
            notes: '',
            status: 'New',
        });
    };

    const getStatusColor = (status: string) => {
        const s = status || 'New';
        switch (s) {
            case 'New': return 'bg-blue-100 text-blue-800';
            case 'Contacted': return 'bg-yellow-100 text-yellow-800';
            case 'Approved': return 'bg-green-100 text-green-800';
            case 'Rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (agentLoading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center py-20">
                    <div className="text-gray-500">Loading...</div>
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

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Self Leads</h1>
                        <p className="text-gray-600 mt-1">Manage your assigned leads and customer inquiries</p>
                    </div>

                    <div className="flex gap-3">
                        <div className="relative">
                            <input
                                type="file"
                                onChange={handleImport}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                accept=".xlsx, .xls"
                                title="Upload Excel"
                            />
                            <Button variant="outline" className="w-full">
                                <Upload className="h-4 w-4 mr-2" />
                                Import Excel
                            </Button>
                        </div>
                        <Button variant="outline" onClick={handleDownloadSample}>
                            <Download className="h-4 w-4 mr-2" />
                            Sample
                        </Button>
                        <Dialog open={isDialogOpen} onOpenChange={(open: boolean) => {
                            setIsDialogOpen(open);
                            if (!open) resetForm();
                        }}>
                            <Button onClick={() => setIsDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Lead
                            </Button>
                            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                    <DialogTitle>Add New Lead</DialogTitle>
                                    <DialogDescription>Add a new lead to your list</DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleSimpleAdd} className="space-y-4">
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="name">Full Name *</Label>
                                            <input
                                                id="name"
                                                type="text"
                                                required
                                                value={formData.name}
                                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="John Doe"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="email">Email *</Label>
                                            <input
                                                id="email"
                                                type="email"
                                                required
                                                value={formData.email}
                                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="john@example.com"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="phone">Phone *</Label>
                                            <input
                                                id="phone"
                                                type="tel"
                                                required
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="+91 1234567890"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="loanType">Loan Type *</Label>
                                            <select
                                                id="loanType"
                                                required
                                                value={formData.loanType}
                                                onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="home-loan">Home Loan</option>
                                                <option value="personal-loan">Personal Loan</option>
                                                <option value="business-loan">Business Loan</option>
                                                <option value="car-loan">Car Loan</option>
                                                <option value="education-loan">Education Loan</option>
                                                <option value="gold-loan">Gold Loan</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="loanAmount">Loan Amount *</Label>
                                            <input
                                                id="loanAmount"
                                                type="text"
                                                required
                                                value={formData.loanAmount}
                                                onChange={(e) => setFormData({ ...formData, loanAmount: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="500000"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="status">Status *</Label>
                                            <select
                                                id="status"
                                                required
                                                value={formData.status}
                                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            >
                                                <option value="New">New</option>
                                                <option value="Contacted">Contacted</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Approved">Approved</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                        </div>

                                        <div>
                                            <Label htmlFor="city">City</Label>
                                            <input
                                                id="city"
                                                type="text"
                                                value={formData.city}
                                                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <Label htmlFor="state">State</Label>
                                            <input
                                                id="state"
                                                type="text"
                                                value={formData.state}
                                                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            />
                                        </div>

                                        <div className="md:col-span-2">
                                            <Label htmlFor="notes">Notes</Label>
                                            <textarea
                                                id="notes"
                                                value={formData.notes}
                                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                                className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                placeholder="Additional notes..."
                                                rows={3}
                                            />
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit" disabled={loading}>
                                            {loading ? 'Saving...' : 'Add Lead'}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Total Leads</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">New</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.filter(l => (l.data.status || 'New') === 'New').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">In Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{leads.filter(l => ['In Progress', 'Contacted', 'Qualified', 'Proposal', 'Negotiation'].includes(l.data.status)).length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{leads.filter(l => l.data.status === 'Approved').length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600">Rejected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{leads.filter(l => l.data.status === 'Rejected').length}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Leads Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>Your Leads</CardTitle>
                        <CardDescription>Leads assigned to you - Click "View" to see full details and pipeline</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading && leads.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">Loading leads...</div>
                        ) : leads.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                No leads found. Click "Add Lead" to get started.
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b">
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Name</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Contact</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Loan Type</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Amount</th>
                                            <th className="px-4 py-3 text-left font-medium text-gray-600">Status</th>
                                            <th className="px-4 py-3 text-right font-medium text-gray-600">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y">
                                        {leads.map((lead: Lead) => (
                                            <tr key={lead.id} className="hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">{lead.data.fullName || lead.data.name}</td>
                                                <td className="px-4 py-3 text-gray-600">
                                                    <div>{lead.data.email}</div>
                                                    <div className="text-xs">{lead.data.mobile}</div>
                                                </td>
                                                <td className="px-4 py-3 capitalize">{(lead.data.loanType || '').replace('-', ' ')}</td>
                                                <td className="px-4 py-3">
                                                    {lead.data.amount || lead.data.loanAmount ? `₹${parseInt(lead.data.amount || lead.data.loanAmount).toLocaleString('en-IN')}` : '-'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`inline-flex px-2 py-1 text-xs rounded-full ${getStatusColor(lead.data.status)}`}>
                                                        {lead.data.status || 'New'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            onClick={() => setSelectedLead(lead)}
                                                            className="text-blue-600 hover:text-blue-800"
                                                        >
                                                            View Details
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="ghost"
                                                            className="text-red-500 hover:text-red-700"
                                                            title="Reject Lead"
                                                            onClick={() => handleReject(lead.id, lead.data.fullName || lead.data.name, lead.data)}
                                                        >
                                                            <Ban className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Complex Lead Details Dialog */}
                {selectedLead && (
                    <LeadDetailsDialog
                        lead={selectedLead}
                        onClose={() => setSelectedLead(null)}
                        onUpdate={handleComplexUpdate}
                        hideDetailsTab={true}
                    />
                )}
            </div>
        </AdminLayout>
    );
}
