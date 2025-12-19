import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Home, Database, Mail, Briefcase, FileSearch, HelpCircle, LogOut, Settings } from 'lucide-react';
import { onAuthChange, isSuperUser } from '@/lib/firebase';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSuper, setIsSuper] = useState<boolean>(false);

  const [firestoreBlocked, setFirestoreBlocked] = useState<string | null>(null);

  useEffect(() => {
    const unsub = onAuthChange(async (u) => {
      const ok = await isSuperUser(u || null);
      setIsSuper(ok);
    });

    // Initialize immediately
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
                <Button variant={isActive('/admin/dashboard') ? 'default' : 'ghost'} size="sm" onClick={() => navigate('/admin/dashboard')} title="Dashboard">
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant={isActive('/admin/dashboard') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/admin/dashboard')}>
                  <Home className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-sm text-gray-800">Dashboard</span>
                </Button>

                <Button variant={isActive('/admin/leads/manual') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/admin/leads/manual')}>
                  <Database className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-sm text-gray-800">Manual Leads</span>
                </Button>

                <Button variant={isActive('/admin/leads/website') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/admin/leads/website')}>
                  <FileSearch className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-sm text-gray-800">Website Leads</span>
                </Button>

                <Button variant={isActive('/admin/leads/contacts') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/admin/leads/contacts')}>
                  <Mail className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-sm text-gray-800">Contact</span>
                </Button>

                <Button variant={isActive('/admin/leads/careers') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/admin/leads/careers')}>
                  <Briefcase className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-sm text-gray-800">Careers</span>
                </Button>

                <Button variant={isActive('/admin/support') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/admin/support')}>
                  <HelpCircle className="h-5 w-5 text-gray-700 mr-3" />
                  <span className="text-sm text-gray-800">Support</span>
                </Button>

                {isSuper && (
                  <Button variant={isActive('/admin/users') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/admin/users')}>
                    <Settings className="h-5 w-5 text-gray-700 mr-3" />
                    <span className="text-sm text-gray-800">Admin Users</span>
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

      <div className="mt-8 border-t pt-6">
        <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 mb-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-xs font-medium">AD</span>
          </div>
          <div className="flex-1">
            <p className="font-medium text-gray-900">Admin</p>
          </div>
        </div>
        <Button variant="destructive" className="w-full justify-start md:w-auto" onClick={async () => { await (await import('@/lib/firebase')).signOutUser(); navigate('/admin/login'); }}>
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>
    </div>
  );
};
