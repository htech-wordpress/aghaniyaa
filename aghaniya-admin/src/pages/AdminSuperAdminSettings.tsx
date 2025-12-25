import { useEffect, useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { isSuperUser, getDatabaseInstance } from '@/lib/firebase';
import { ref, get, set, child } from 'firebase/database';
import { ShieldAlert, CreditCard, Mail, Building2, Save, RefreshCw, Settings2 } from 'lucide-react';

interface PaymentSettings {
    razorpayKeyId: string;
    razorpayKeySecret: string;
    enabled: boolean;
}

interface EmailSettings {
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
    enabled: boolean;
}

interface CompanySettings {
    companyName: string;
    companyLogo: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    website: string;
}

interface SystemSettings {
    maxAgents: number;
    enableAgentLimit: boolean;
}

export function AdminSuperAdminSettings() {
    const [authorized, setAuthorized] = useState(false);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>({
        razorpayKeyId: '',
        razorpayKeySecret: '',
        enabled: false,
    });

    // Email Settings
    const [emailSettings, setEmailSettings] = useState<EmailSettings>({
        smtpHost: '',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        fromEmail: '',
        fromName: '',
        enabled: false,
    });

    // Company Settings
    const [companySettings, setCompanySettings] = useState<CompanySettings>({
        companyName: 'Aghaniya',
        companyLogo: '',
        companyEmail: '',
        companyPhone: '',
        companyAddress: '',
        website: '',
    });

    // System Settings
    const [systemSettings, setSystemSettings] = useState<SystemSettings>({
        maxAgents: 100,
        enableAgentLimit: true,
    });

    useEffect(() => {
        checkAuthorization();
    }, []);

    const checkAuthorization = async () => {
        setLoading(true);
        const ok = await isSuperUser((await import('firebase/auth')).getAuth()?.currentUser || null);
        setAuthorized(ok);
        if (ok) {
            await loadSettings();
        }
        setLoading(false);
    };

    const loadSettings = async () => {
        const db = getDatabaseInstance();
        if (!db) {
            console.error('Database not initialized');
            return;
        }

        try {
            // Load Payment Settings
            const paymentSnap = await get(child(ref(db), 'settings/payment'));
            if (paymentSnap.exists()) {
                setPaymentSettings(paymentSnap.val() as PaymentSettings);
            }

            // Load Email Settings
            const emailSnap = await get(child(ref(db), 'settings/email'));
            if (emailSnap.exists()) {
                setEmailSettings(emailSnap.val() as EmailSettings);
            }

            // Load Company Settings
            const companySnap = await get(child(ref(db), 'settings/company'));
            if (companySnap.exists()) {
                setCompanySettings(companySnap.val() as CompanySettings);
            }

            // Load System Settings
            const systemSnap = await get(child(ref(db), 'settings/system'));
            if (systemSnap.exists()) {
                setSystemSettings(systemSnap.val() as SystemSettings);
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    };

    const saveSetting = async (path: string, data: any, name: string) => {
        const db = getDatabaseInstance();
        if (!db) return;
        setSaving(true);
        try {
            await set(child(ref(db), path), data);
            alert(`${name} settings saved successfully!`);
        } catch (error) {
            console.error(`Error saving ${name} settings:`, error);
            alert(`Failed to save ${name} settings`);
        } finally {
            setSaving(false);
        }
    };

    const savePaymentSettings = () => saveSetting('settings/payment', paymentSettings, 'Payment');
    const saveEmailSettings = () => saveSetting('settings/email', emailSettings, 'Email');
    const saveCompanySettings = () => saveSetting('settings/company', companySettings, 'Company');
    const saveSystemSettings = () => saveSetting('settings/system', systemSettings, 'System');

    if (loading) {
        return (
            <AdminLayout>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex items-center justify-center py-20">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            </AdminLayout>
        );
    }

    if (!authorized) {
        return (
            <AdminLayout>
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col items-center justify-center py-20">
                    <ShieldAlert className="h-12 w-12 text-red-500 mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                    <p className="text-gray-600">You must be a superuser to access SuperAdmin settings.</p>
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">SuperAdmin Settings</h1>
                    <p className="text-gray-600 mt-1">Configure global application settings (Realtime DB)</p>
                </div>

                <Tabs defaultValue="system" className="w-full">
                    <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="system">
                            <Settings2 className="h-4 w-4 mr-2" />
                            System
                        </TabsTrigger>
                        <TabsTrigger value="payment">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Payment
                        </TabsTrigger>
                        <TabsTrigger value="email">
                            <Mail className="h-4 w-4 mr-2" />
                            Email
                        </TabsTrigger>
                        <TabsTrigger value="company">
                            <Building2 className="h-4 w-4 mr-2" />
                            Company
                        </TabsTrigger>
                    </TabsList>

                    {/* System Settings */}
                    <TabsContent value="system">
                        <Card>
                            <CardHeader>
                                <CardTitle>System Configuration</CardTitle>
                                <CardDescription>Configure system-wide settings and limitations</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="border-b pb-4">
                                    <h3 className="text-lg font-semibold mb-4">Agent Limitations</h3>

                                    <div className="flex items-center space-x-2 mb-4">
                                        <input
                                            type="checkbox"
                                            id="enable-agent-limit"
                                            checked={systemSettings.enableAgentLimit}
                                            onChange={(e) => setSystemSettings({ ...systemSettings, enableAgentLimit: e.target.checked })}
                                            className="h-4 w-4"
                                        />
                                        <Label htmlFor="enable-agent-limit">Enable Agent Creation Limit</Label>
                                    </div>

                                    <div>
                                        <Label htmlFor="max-agents">Maximum Number of Agents</Label>
                                        <input
                                            id="max-agents"
                                            type="number"
                                            min="1"
                                            max="10000"
                                            value={systemSettings.maxAgents}
                                            onChange={(e) => setSystemSettings({ ...systemSettings, maxAgents: parseInt(e.target.value) || 0 })}
                                            disabled={!systemSettings.enableAgentLimit}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                                            placeholder="100"
                                        />
                                        <p className="text-sm text-gray-500 mt-1">
                                            Admins will not be able to create more than this number of agent users.
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button onClick={saveSystemSettings} disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save System Settings'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Payment Settings */}
                    <TabsContent value="payment">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Gateway Settings</CardTitle>
                                <CardDescription>Configure Razorpay payment gateway</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="payment-enabled"
                                        checked={paymentSettings.enabled}
                                        onChange={(e) => setPaymentSettings({ ...paymentSettings, enabled: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="payment-enabled">Enable Payment Gateway</Label>
                                </div>

                                <div className="grid gap-4">
                                    <div>
                                        <Label htmlFor="razorpay-key-id">Razorpay Key ID</Label>
                                        <input
                                            id="razorpay-key-id"
                                            type="text"
                                            value={paymentSettings.razorpayKeyId}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeyId: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="razorpay-key-secret">Razorpay Key Secret</Label>
                                        <input
                                            id="razorpay-key-secret"
                                            type="password"
                                            value={paymentSettings.razorpayKeySecret}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, razorpayKeySecret: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button onClick={savePaymentSettings} disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Payment Settings'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Email Settings */}
                    <TabsContent value="email">
                        <Card>
                            <CardHeader>
                                <CardTitle>Email Configuration</CardTitle>
                                <CardDescription>Configure SMTP settings for email notifications</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        id="email-enabled"
                                        checked={emailSettings.enabled}
                                        onChange={(e) => setEmailSettings({ ...emailSettings, enabled: e.target.checked })}
                                        className="h-4 w-4"
                                    />
                                    <Label htmlFor="email-enabled">Enable Email Notifications</Label>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="smtp-host">SMTP Host</Label>
                                        <input
                                            id="smtp-host"
                                            type="text"
                                            value={emailSettings.smtpHost}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="smtp-port">SMTP Port</Label>
                                        <input
                                            id="smtp-port"
                                            type="text"
                                            value={emailSettings.smtpPort}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="smtp-user">SMTP Username</Label>
                                        <input
                                            id="smtp-user"
                                            type="text"
                                            value={emailSettings.smtpUser}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="smtp-password">SMTP Password</Label>
                                        <input
                                            id="smtp-password"
                                            type="password"
                                            value={emailSettings.smtpPassword}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="from-email">From Email</Label>
                                        <input
                                            id="from-email"
                                            type="email"
                                            value={emailSettings.fromEmail}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="from-name">From Name</Label>
                                        <input
                                            id="from-name"
                                            type="text"
                                            value={emailSettings.fromName}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button onClick={saveEmailSettings} disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Email Settings'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Company Settings */}
                    <TabsContent value="company">
                        <Card>
                            <CardHeader>
                                <CardTitle>Company Information</CardTitle>
                                <CardDescription>Configure company details and branding</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="company-name">Company Name</Label>
                                        <input
                                            id="company-name"
                                            type="text"
                                            value={companySettings.companyName}
                                            onChange={(e) => setCompanySettings({ ...companySettings, companyName: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company-logo">Company Logo URL</Label>
                                        <input
                                            id="company-logo"
                                            type="text"
                                            value={companySettings.companyLogo}
                                            onChange={(e) => setCompanySettings({ ...companySettings, companyLogo: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company-email">Contact Email</Label>
                                        <input
                                            id="company-email"
                                            type="email"
                                            value={companySettings.companyEmail}
                                            onChange={(e) => setCompanySettings({ ...companySettings, companyEmail: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company-phone">Contact Phone</Label>
                                        <input
                                            id="company-phone"
                                            type="tel"
                                            value={companySettings.companyPhone}
                                            onChange={(e) => setCompanySettings({ ...companySettings, companyPhone: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <Label htmlFor="company-website">Website</Label>
                                        <input
                                            id="company-website"
                                            type="url"
                                            value={companySettings.website}
                                            onChange={(e) => setCompanySettings({ ...companySettings, website: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <Label htmlFor="company-address">Address</Label>
                                        <textarea
                                            id="company-address"
                                            value={companySettings.companyAddress}
                                            onChange={(e) => setCompanySettings({ ...companySettings, companyAddress: e.target.value })}
                                            className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            rows={3}
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <Button onClick={saveCompanySettings} disabled={saving}>
                                        <Save className="h-4 w-4 mr-2" />
                                        {saving ? 'Saving...' : 'Save Company Settings'}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </AdminLayout>
    );
}
