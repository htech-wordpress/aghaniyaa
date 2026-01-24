import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getCompanyStats, updateCompanyStats, type CompanyStats, defaultStats, type Address } from '@/lib/stats';
import { Loader2, Save, BarChart3, MapPin, Plus, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

import { AdminLayout } from '@/components/admin/AdminLayout';

export function AdminStats() {
    const [stats, setStats] = useState<CompanyStats>(defaultStats);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

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
            setMessage({ type: 'error', text: 'Failed to load statistics.' });
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            await updateCompanyStats(stats);
            setMessage({ type: 'success', text: 'Statistics updated successfully!' });
        } catch (error) {
            console.error('Failed to save stats:', error);
            setMessage({ type: 'error', text: 'Failed to save statistics.' });
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setStats(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddAddress = () => {
        setStats(prev => ({
            ...prev,
            addresses: [
                ...(prev.addresses || []),
                { id: uuidv4(), label: '', value: '', mapLink: '', phone: '' }
            ]
        }));
    };

    const handleRemoveAddress = (id: string) => {
        setStats(prev => ({
            ...prev,
            addresses: (prev.addresses || []).filter(a => a.id !== id)
        }));
    };

    const handleAddressChange = (id: string, field: keyof Address, value: string) => {
        setStats(prev => ({
            ...prev,
            addresses: (prev.addresses || []).map(a =>
                a.id === id ? { ...a, [field]: value } : a
            )
        }));
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
                    <h1 className="text-3xl font-bold tracking-tight">Website Statistics</h1>
                    <p className="text-muted-foreground mt-2">
                        Manage the key metrics displayed on the website home and about pages.
                    </p>
                </div>

                {message && (
                    <div className={`p-4 rounded-lg flex items-center gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        {message.type === 'success' ? <Save className="h-4 w-4" /> : <Loader2 className="h-4 w-4" />}
                        {message.text}
                    </div>
                )}

                <Card className="border-border/50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-primary/10 rounded-lg">
                                <BarChart3 className="h-5 w-5 text-primary" />
                            </div>
                            <CardTitle>Key Metrics</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSave} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="experience">Years of Experience</Label>
                                    <Input
                                        id="experience"
                                        name="experience"
                                        value={stats.experience}
                                        onChange={handleChange}
                                        placeholder="e.g. 10+"
                                    />
                                    <p className="text-xs text-muted-foreground">Displayed as "Years of Experience"</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="partners">Partner Institutions</Label>
                                    <Input
                                        id="partners"
                                        name="partners"
                                        value={stats.partners}
                                        onChange={handleChange}
                                        placeholder="e.g. 10+"
                                    />
                                    <p className="text-xs text-muted-foreground">Displayed as "Financial Institution Partners"</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="cities">Cities Covered</Label>
                                    <Input
                                        id="cities"
                                        name="cities"
                                        value={stats.cities}
                                        onChange={handleChange}
                                        placeholder="e.g. 10+"
                                    />
                                    <p className="text-xs text-muted-foreground">Displayed as "Cities Through A Wide Branch Network"</p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="loansDisbursed">Loans Disbursed</Label>
                                    <Input
                                        id="loansDisbursed"
                                        name="loansDisbursed"
                                        value={stats.loansDisbursed}
                                        onChange={handleChange}
                                        placeholder="e.g. ₹100 Cr+"
                                    />
                                    <p className="text-xs text-muted-foreground">Displayed as "In Loans Disbursed"</p>
                                </div>
                            </div>



                            <div className="pt-6 border-t">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <MapPin className="h-5 w-5 text-primary" />
                                        </div>
                                        <h3 className="text-lg font-semibold">Office Addresses</h3>
                                    </div>
                                    <Button type="button" onClick={handleAddAddress} variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        Add Address
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    {(!stats.addresses || stats.addresses.length === 0) && (
                                        <p className="text-sm text-muted-foreground italic">No addresses added yet.</p>
                                    )}
                                    {(stats.addresses || []).map((address, index) => (
                                        <div key={address.id || index} className="p-4 border rounded-lg bg-slate-50 relative group">
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-2 right-2 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleRemoveAddress(address.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pr-8">
                                                <div className="space-y-2">
                                                    <Label>Label</Label>
                                                    <Input
                                                        value={address.label}
                                                        onChange={(e) => handleAddressChange(address.id, 'label', e.target.value)}
                                                        placeholder="e.g. Head Office"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Address</Label>
                                                    <Input
                                                        value={address.value}
                                                        onChange={(e) => handleAddressChange(address.id, 'value', e.target.value)}
                                                        placeholder="Full address string"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Map Link (Optional)</Label>
                                                    <Input
                                                        value={address.mapLink || ''}
                                                        onChange={(e) => handleAddressChange(address.id, 'mapLink', e.target.value)}
                                                        placeholder="Google Maps URL"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Phone (Optional)</Label>
                                                    <Input
                                                        value={address.phone || ''}
                                                        onChange={(e) => handleAddressChange(address.id, 'phone', e.target.value)}
                                                        placeholder="+91..."
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={saving} size="lg" className="px-8 font-semibold">
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AdminLayout>
    );
}
