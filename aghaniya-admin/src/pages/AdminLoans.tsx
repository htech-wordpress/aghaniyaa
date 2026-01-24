import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { getCompanyStats, updateCompanyStats, type CompanyStats, defaultStats } from '@/lib/stats';
import { Loader2, Save, Plus, Trash2, Briefcase, Pencil, Search, X, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { AdminLayout } from '@/components/admin/AdminLayout';

interface LoanProduct {
    id: string;
    title: string;
    description: string;
    iconName: string;
    interestRate: string;
    features: string[];
    eligibility?: string[];
    documents?: string[];
    route: string;
    featured?: boolean;
}

export function AdminLoans() {
    const [stats, setStats] = useState<CompanyStats>(defaultStats);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Filter state
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    // Modal state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<LoanProduct | null>(null);
    const [formData, setFormData] = useState<LoanProduct>({
        id: '',
        title: '',
        description: '',
        iconName: 'Banknote',
        interestRate: '',
        features: [],
        eligibility: [],
        documents: [],
        route: '',
        featured: false
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await getCompanyStats();
            setStats(data);
        } catch (error) {
            console.error('Failed to load stats:', error);
            setMessage({ type: 'error', text: 'Failed to load data.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStats = async (updatedStats: CompanyStats) => {
        setSaving(true);
        setMessage(null);
        try {
            await updateCompanyStats(updatedStats);
            setStats(updatedStats);
            setMessage({ type: 'success', text: 'Loan products updated successfully!' });
            setIsDialogOpen(false);
        } catch (error) {
            console.error('Failed to save stats:', error);
            setMessage({ type: 'error', text: 'Failed to save data.' });
        } finally {
            setSaving(false);
        }
    };

    const openAddDialog = () => {
        setEditingProduct(null);
        setFormData({
            id: uuidv4(),
            title: '',
            description: '',
            iconName: 'Banknote',
            interestRate: '',
            features: [],
            route: '',
            featured: false
        });
        setIsDialogOpen(true);
    };

    const openEditDialog = (product: LoanProduct) => {
        setEditingProduct(product);
        setFormData({ ...product }); // create copy
        setIsDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this loan product?')) return;

        const updatedProducts = (stats.loanProducts || []).filter(p => p.id !== id);
        const updatedStats = { ...stats, loanProducts: updatedProducts };
        await handleSaveStats(updatedStats);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation for featured products limit (Max 10)
        if (formData.featured) {
            const currentFeaturedCount = (stats.loanProducts || []).filter(p => p.featured).length;
            const isAlreadyFeatured = editingProduct?.featured;

            // If adding new featured OR enabling feature on existing non-featured
            if (!isAlreadyFeatured && currentFeaturedCount >= 10) {
                setMessage({ type: 'error', text: 'You can only mark up to 10 products as featured.' });
                return;
            }
        }

        let updatedProducts = [...(stats.loanProducts || [])];

        if (editingProduct) {
            // Update existing
            updatedProducts = updatedProducts.map(p => p.id === formData.id ? formData : p);
        } else {
            // Add new
            updatedProducts.push(formData);
        }

        const updatedStats = { ...stats, loanProducts: updatedProducts };
        await handleSaveStats(updatedStats);
    };

    const handleFormChange = (field: keyof LoanProduct, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleListChange = (field: 'features' | 'eligibility' | 'documents', index: number, value: string) => {
        const newList = [...(formData[field] || [])];
        newList[index] = value;
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const addListItem = (field: 'features' | 'eligibility' | 'documents') => {
        setFormData(prev => ({ ...prev, [field]: [...(prev[field] || []), ''] }));
    };

    const removeListItem = (field: 'features' | 'eligibility' | 'documents', index: number) => {
        const newList = [...(formData[field] || [])];
        newList.splice(index, 1);
        setFormData(prev => ({ ...prev, [field]: newList }));
    };

    const filteredProducts = (stats.loanProducts || []).filter(p =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Reset page to 1 when search query changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery]);

    // Pagination logic
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex items-center justify-center p-12">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Loan Products</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage the loan products displayed on the website.
                    </p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.type === 'success' ? <Save className="h-4 w-4" /> : <Loader2 className="h-4 w-4" />}
                        {message.text}
                    </div>
                )}

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="p-2 bg-primary/10 rounded-lg">
                                    <Briefcase className="h-5 w-5 text-primary" />
                                </div>
                                <div>
                                    <CardTitle>Products List</CardTitle>
                                    <CardDescription>View and manage all loan products</CardDescription>
                                </div>
                            </div>
                            <Button onClick={openAddDialog}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Product
                            </Button>
                        </div>
                        <div className="mt-4">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search products..."
                                    className="pl-8 max-w-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Interest Rate</TableHead>
                                        <TableHead className="hidden md:table-cell">Description</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {currentProducts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={4} className="h-24 text-center">
                                                No products found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        currentProducts.map((product) => (
                                            <TableRow key={product.id}>
                                                <TableCell className="font-medium">
                                                    <div className="flex items-center gap-2">
                                                        <div className="text-sm font-bold text-primary bg-primary/5 px-2 py-1 rounded">
                                                            {product.iconName}
                                                        </div>
                                                        {product.title}
                                                        {product.featured && <Star className="h-4 w-4 text-yellow-500 fill-yellow-500 ml-1" />}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{product.interestRate}</TableCell>
                                                <TableCell className="hidden md:table-cell max-w-[300px] truncate">
                                                    {product.description}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button variant="ghost" size="icon" onClick={() => openEditDialog(product as LoanProduct)}>
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDelete(product.id)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>

                {/* Pagination Controls */}
                {filteredProducts.length > productsPerPage && (
                    <div className="flex items-center justify-end space-x-2 py-4">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            <ChevronLeft className="h-4 w-4" />
                            Previous
                        </Button>
                        <div className="text-sm">
                            Page {currentPage} of {totalPages}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            Next
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                )}

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>{editingProduct ? 'Edit Loan Product' : 'Add New Loan Product'}</DialogTitle>
                            <DialogDescription>
                                Fill in the details for the loan product. Click save when you're done.
                            </DialogDescription>
                        </DialogHeader>

                        <form onSubmit={handleFormSubmit} className="space-y-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={formData.title}
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                        placeholder="e.g. Home Loan"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="interestRate">Interest Rate</Label>
                                    <Input
                                        id="interestRate"
                                        value={formData.interestRate}
                                        onChange={(e) => handleFormChange('interestRate', e.target.value)}
                                        placeholder="e.g. 8.50 % P.A*"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="iconName">Icon Name (Lucide React)</Label>
                                    <Input
                                        id="iconName"
                                        value={formData.iconName}
                                        onChange={(e) => handleFormChange('iconName', e.target.value)}
                                        placeholder="e.g. Home, Car, Briefcase"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="route">Route Path</Label>
                                    <Input
                                        id="route"
                                        value={formData.route}
                                        onChange={(e) => handleFormChange('route', e.target.value)}
                                        placeholder="e.g. /loans/home-loan"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Input
                                        id="description"
                                        value={formData.description}
                                        onChange={(e) => handleFormChange('description', e.target.value)}
                                        placeholder="Brief description of the loan product"
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <div className="flex items-center space-x-2 border p-3 rounded-md">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            checked={formData.featured || false}
                                            onChange={(e) => handleFormChange('featured', e.target.checked)}
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                        />
                                        <Label htmlFor="featured" className="cursor-pointer">Mark as Featured (Shown on Home Page)</Label>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                {/* Features Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Key Features</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={() => addListItem('features')}>
                                            <Plus className="h-3 w-3 mr-1" /> Add Feature
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                                        {(formData.features || []).map((feature, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={feature}
                                                    onChange={(e) => handleListChange('features', index, e.target.value)}
                                                    placeholder="Feature description"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 text-red-500"
                                                    onClick={() => removeListItem('features', index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {(!formData.features || formData.features.length === 0) && (
                                            <p className="text-sm text-muted-foreground italic text-center py-2">No features added.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Eligibility Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Eligibility Criteria</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={() => addListItem('eligibility')}>
                                            <Plus className="h-3 w-3 mr-1" /> Add Criteria
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                                        {(formData.eligibility || []).map((item, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={item}
                                                    onChange={(e) => handleListChange('eligibility', index, e.target.value)}
                                                    placeholder="Eligibility criterion"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 text-red-500"
                                                    onClick={() => removeListItem('eligibility', index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {(!formData.eligibility || formData.eligibility.length === 0) && (
                                            <p className="text-sm text-muted-foreground italic text-center py-2">No eligibility criteria added.</p>
                                        )}
                                    </div>
                                </div>

                                {/* Documents Section */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Required Documents</Label>
                                        <Button type="button" variant="outline" size="sm" onClick={() => addListItem('documents')}>
                                            <Plus className="h-3 w-3 mr-1" /> Add Document
                                        </Button>
                                    </div>
                                    <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2">
                                        {(formData.documents || []).map((doc, index) => (
                                            <div key={index} className="flex gap-2">
                                                <Input
                                                    value={doc}
                                                    onChange={(e) => handleListChange('documents', index, e.target.value)}
                                                    placeholder="Document name"
                                                />
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="shrink-0 text-red-500"
                                                    onClick={() => removeListItem('documents', index)}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        ))}
                                        {(!formData.documents || formData.documents.length === 0) && (
                                            <p className="text-sm text-muted-foreground italic text-center py-2">No documents added.</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button type="submit" disabled={saving}>
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        'Save Changes'
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AdminLayout>
    );
}
