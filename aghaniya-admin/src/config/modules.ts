import {
    Home, Database, Mail, Briefcase, FileSearch,
    Settings, Users, Shield, TrendingUp, Building
} from 'lucide-react';

export interface AdminModule {
    id: string;
    label: string;
    path: string;
    icon: any;
    description?: string;
}

export const ADMIN_MODULES: AdminModule[] = [
    {
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: Home,
        description: 'Overview of system performance and quick stats'
    },
    {
        id: 'performance',
        label: 'Performance Dashboard',
        path: '/performance-dashboard',
        icon: TrendingUp,
        description: 'Detailed analytics and performance metrics'
    },
    {
        id: 'leads_manual',
        label: 'Manual Leads',
        path: '/leads/manual',
        icon: Database,
        description: 'Manage manually entered leads'
    },
    {
        id: 'leads_website',
        label: 'Website Leads',
        path: '/leads/website',
        icon: FileSearch,
        description: 'Leads captured from the website forms'
    },
    {
        id: 'leads_contacts',
        label: 'Contact Inquiries',
        path: '/leads/contacts',
        icon: Mail,
        description: 'Messages from contact us page'
    },
    {
        id: 'leads_careers',
        label: 'Job Applications',
        path: '/leads/careers',
        icon: Briefcase,
        description: 'Applications from careers page'
    },
    {
        id: 'leads_cibil',
        label: 'CIBIL Checks',
        path: '/leads/cibil',
        icon: FileSearch,
        description: 'Credit score check requests'
    },
    {
        id: 'agents',
        label: 'Agent Management',
        path: '/agents',
        icon: Users,
        description: 'Manage agents and their commissions'
    },
    {
        id: 'users',
        label: 'Admin Users',
        path: '/users',
        icon: Settings,
        description: 'Manage admin accounts and permissions'
    },
    {
        id: 'branches',
        label: 'Branch Management',
        path: '/branches',
        icon: Building,
        description: 'Manage branch locations'
    },
    {
        id: 'superadmin',
        label: 'Super Admin Settings',
        path: '/superadmin',
        icon: Shield,
        description: 'Global system configuration'
    },
    {
        id: 'loans',
        label: 'Loan Products',
        path: '/loans',
        icon: Briefcase,
        description: 'Manage loan products and details'
    },
];
