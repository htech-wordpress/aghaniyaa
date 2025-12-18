import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  getAllLeads, 
  getLeadsByCategory, 
  deleteLead, 
  clearAllLeads,
  getLeadsCount,
  isAdminAuthenticated,
  setAdminAuthenticated,
  seedDummyData,
} from '@/lib/storage';
import type { Lead, LeadCategory } from '@/lib/storage';
import { LogOut, Trash2, Download, Eye, EyeOff, Database } from 'lucide-react';
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
  const [selectedCategory, setSelectedCategory] = useState<LeadCategory | 'all'>('all');
  const [expandedLeads, setExpandedLeads] = useState<Set<string>>(new Set());
  const [counts, setCounts] = useState<Record<LeadCategory, number>>({} as Record<LeadCategory, number>);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }
    loadLeads();
  }, [navigate]);

  const loadLeads = () => {
    const allLeads = getAllLeads();
    setLeads(allLeads);
    setCounts(getLeadsCount());
  };

  const handleLogout = () => {
    setAdminAuthenticated(false);
    navigate('/admin/login');
  };

  const handleDelete = (leadId: string) => {
    if (confirm('Are you sure you want to delete this lead?')) {
      deleteLead(leadId);
      loadLeads();
    }
  };

  const handleClearAll = () => {
    if (confirm('Are you sure you want to delete ALL leads? This cannot be undone.')) {
      clearAllLeads();
      loadLeads();
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(leads, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `leads_${new Date().toISOString().split('T')[0]}.json`;
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

  const toggleExpand = (leadId: string) => {
    setExpandedLeads(prev => {
      const next = new Set(prev);
      if (next.has(leadId)) {
        next.delete(leadId);
      } else {
        next.add(leadId);
      }
      return next;
    });
  };

  const displayedLeads = selectedCategory === 'all' 
    ? leads 
    : getLeadsByCategory(selectedCategory);

  const totalLeads = leads.length;

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
                Export All
              </Button>
              <Button variant="destructive" onClick={handleClearAll}>
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Category Filter */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button
                    variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory('all')}
                  >
                    All Leads ({totalLeads})
                  </Button>
                  {Object.entries(categoryLabels).map(([category, { label, icon: Icon }]) => (
                    <Button
                      key={category}
                      variant={selectedCategory === category ? 'default' : 'ghost'}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category as LeadCategory)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {label} ({counts[category as LeadCategory] || 0})
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Leads List */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {selectedCategory === 'all' 
                    ? 'All Leads' 
                    : categoryLabels[selectedCategory]?.label || 'Leads'}
                </CardTitle>
                <CardDescription>
                  {displayedLeads.length} {displayedLeads.length === 1 ? 'lead' : 'leads'} found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {displayedLeads.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <p>No leads found in this category.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {displayedLeads
                      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                      .map((lead) => {
                        const isExpanded = expandedLeads.has(lead.id);
                        const Icon = categoryLabels[lead.category]?.icon || FileSearch;
                        
                        return (
                          <Card key={lead.id} className="border-l-4 border-l-primary">
                            <CardContent className="pt-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-3">
                                    <Icon className="h-5 w-5 text-primary" />
                                    <div>
                                      <div className="font-semibold text-lg">
                                        {lead.data.fullName || lead.data.name || 'N/A'}
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {categoryLabels[lead.category]?.label || lead.category}
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-3">
                                    {lead.data.mobile && (
                                      <div>
                                        <span className="text-gray-600">Mobile:</span>{' '}
                                        <span className="font-medium">{lead.data.mobile}</span>
                                      </div>
                                    )}
                                    {lead.data.email && (
                                      <div>
                                        <span className="text-gray-600">Email:</span>{' '}
                                        <span className="font-medium">{lead.data.email}</span>
                                      </div>
                                    )}
                                    {lead.data.pan && (
                                      <div>
                                        <span className="text-gray-600">PAN:</span>{' '}
                                        <span className="font-medium">{lead.data.pan}</span>
                                      </div>
                                    )}
                                    <div>
                                      <span className="text-gray-600">Date:</span>{' '}
                                      <span className="font-medium">
                                        {new Date(lead.timestamp).toLocaleDateString()}
                                      </span>
                                    </div>
                                    <div>
                                      <span className="text-gray-600">Time:</span>{' '}
                                      <span className="font-medium">
                                        {new Date(lead.timestamp).toLocaleTimeString()}
                                      </span>
                                    </div>
                                  </div>

                                  {isExpanded && (
                                    <div className="mt-4 p-4 bg-gray-50 rounded-md">
                                      <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                        {JSON.stringify(lead.data, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>

                                <div className="flex flex-col gap-2 ml-4">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => toggleExpand(lead.id)}
                                  >
                                    {isExpanded ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDelete(lead.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

