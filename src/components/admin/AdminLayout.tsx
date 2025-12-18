import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { isAdminAuthenticated, setAdminAuthenticated, subscribeToLeads } from '@/lib/storage';
import { onAuthChange, isSuperUser } from '@/lib/firebase';
import { Home, Database, Mail, Briefcase, FileSearch, Settings, HelpCircle, LogOut } from 'lucide-react';

import type { LeadCategory } from '@/lib/storage';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [counts, setCounts] = useState<Record<LeadCategory, number>>({} as Record<LeadCategory, number>);
  const [total, setTotal] = useState<number>(0);
  const [manualCount, setManualCount] = useState<number>(0);
  const [isSuper, setIsSuper] = useState<boolean>(false);

  const [firestoreBlocked, setFirestoreBlocked] = useState<string | null>(null);

  useEffect(() => {
    // Track auth changes so we can show/hide superuser-only UI
    const unsub = onAuthChange(async (u) => {
      const ok = await isSuperUser(u || null);
      setIsSuper(ok);
    });

    // Initialize immediately with current user if available
    (async () => {
      const auth = (await import('firebase/auth')).getAuth();
      const ok = await isSuperUser(auth?.currentUser || null);
      setIsSuper(ok);

      // Probe Firestore network connectivity and detect client-side blocking
      try {
        const probe = await (await import('@/lib/firebase')).checkFirestoreNetwork();
        if (!probe.ok) {
          setFirestoreBlocked(probe.message || 'Firestore network blocked');
        }
      } catch (e) {
        // ignore probe errors silently
      }
    })();

    return unsub;
  }, []);

  useEffect(() => {
    if (!isAdminAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    // subscribe to leads changes and compute counts
    const unsub = subscribeToLeads((next) => {
      const countsMap: Record<string, number> = {};
      next.forEach(l => { countsMap[l.category] = (countsMap[l.category] || 0) + 1; });
      setCounts(countsMap as Record<LeadCategory, number>);
      setTotal(next.length);
      setManualCount(next.filter(l => String(l.data?.source || '').toLowerCase().includes('manual')).length);
    });

    return () => unsub();
  }, [location.pathname, navigate]);

  const isActive = (path: string) => location.pathname === path || (path === '/admin/leads' && location.pathname === '/admin');

  return (
    <div className="container mx-auto px-4 py-8">
      {firestoreBlocked && (
        <div className="mb-4">
          <div className="rounded-md bg-yellow-50 p-4 border border-yellow-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11V5a1 1 0 10-2 0v2a1 1 0 002 0zm0 6a1 1 0 10-2 0 1 1 0 002 0z" clipRule="evenodd" /></svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-800">{firestoreBlocked}</p>
                <p className="mt-1 text-xs text-yellow-700">Disable ad-blockers / privacy extensions for <code>firestore.googleapis.com</code> or use the Firebase Emulator for local development.</p>
              </div>
              <div className="ml-auto pl-3">
                <button className="text-yellow-700 underline text-sm" onClick={() => setFirestoreBlocked(null)}>Dismiss</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Menu</div>
                <Button variant={isActive('/admin') || isActive('/admin/dashboard') ? 'default' : 'ghost'} size="sm" onClick={() => navigate('/admin/dashboard')} title="Dashboard">
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant={isActive('/admin/leads') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3" onClick={() => navigate('/admin/leads')} title={`All Leads (${total})`}>
                  <div className="flex items-center gap-3">
                    <Home className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-800">All Leads</span>
                  </div>
                  <span className="text-xs text-gray-700">{total}</span>
                </Button>

                <Button variant={isActive('/admin/leads/manual') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3 mt-2" onClick={() => navigate('/admin/leads/manual')} title={`Manual Leads (${manualCount})`}>
                  <div className="flex items-center gap-3">
                    <Database className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-800">Manual Leads</span>
                  </div>
                  <span className="text-xs text-gray-700">{manualCount}</span>
                </Button>

                <Button variant={isActive('/admin/leads/contacts') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3 mt-2" onClick={() => navigate('/admin/leads/contacts')} title={`Contacts (${counts['contact'] || 0})`}>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-800">Contacts</span>
                  </div>
                  <span className="text-xs text-gray-700">{counts['contact'] || 0}</span>
                </Button>

                <Button variant={isActive('/admin/leads/careers') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3 mt-2" onClick={() => navigate('/admin/leads/careers')} title={`Careers (${counts['careers'] || 0})`}>
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-800">Careers</span>
                  </div>
                  <span className="text-xs text-gray-700">{counts['careers'] || 0}</span>
                </Button>

                <Button variant={isActive('/admin/leads/cibil') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3 mt-2" onClick={() => navigate('/admin/leads/cibil')} title={`CIBIL Check (${counts['cibil-check'] || 0})`}>
                  <div className="flex items-center gap-3">
                    <FileSearch className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-800">CIBIL Check</span>
                  </div>
                  <span className="text-xs text-gray-700">{counts['cibil-check'] || 0}</span>
                </Button>

                <Button variant={isActive('/admin/support') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3 mt-2" onClick={() => navigate('/admin/support')} title="Support">
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-800">Support</span>
                  </div>
                </Button>

                <Button variant={isActive('/admin/settings') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3 mt-2" onClick={() => navigate('/admin/settings')} title="Settings">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-gray-700" />
                    <span className="text-sm text-gray-800">Settings</span>
                  </div>
                </Button>

                {/* Admin Users (superuser only) */}
                {isSuper && (
                  <Button onClick={() => navigate('/admin/users')} variant={isActive('/admin/users') ? 'default' : 'ghost'} className="w-full justify-between py-3 px-3 mt-2" title="Admin Users">
                    <div className="flex items-center gap-3">
                      <Settings className="h-5 w-5 text-gray-700" />
                      <span className="text-sm text-gray-800">Admin Users</span>
                    </div>
                  </Button>
                )}

              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {children}
        </div>
      </div>

      {/* Logout at the bottom of sidebar */}
      <div className="container mx-auto px-4 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="mt-4 lg:mt-0">
              <Button variant="destructive" className="w-full justify-start" onClick={async () => { await (await import('@/lib/firebase')).signOutUser(); setAdminAuthenticated(false); navigate('/admin/login'); }}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
