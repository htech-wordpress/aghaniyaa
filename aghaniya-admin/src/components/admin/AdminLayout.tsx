import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Home, Database, Mail, Briefcase, FileSearch, LogOut, Settings, Shield, Users, User, TrendingUp, Zap } from 'lucide-react';
import { onAuthChange, isSuperUser } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isSuper, setIsSuper] = useState(false);
  const { currentAgent, isAgent: isAgentRole } = useAgent();

  const [firestoreBlocked, setFirestoreBlocked] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const superUser = await isSuperUser(currentUser);
        setIsSuper(superUser);
      } else {
        navigate('/login');
      }
    });

    // Probe Firestore network connectivity and detect client-side blocking
    (async () => {
      try {
        const probe = await (await import('@/lib/firebase')).checkFirestoreNetwork();
        if (!probe.ok) {
          setFirestoreBlocked(probe.message || 'Firestore network blocked');
        }
      } catch (e) {
        // ignore probe errors silently
      }
    })();
    return () => unsubscribe();
  }, [navigate]);

  const isActive = (path: string) => location.pathname === path || (path === '/leads' && location.pathname === '/dashboard');

  return (
    <div className="container mx-auto py-2">
      {/* App Header */}
      <header className="flex items-center justify-between mb-2 border-b border-gray-200 pb-2">
        <a href="https://aghaniyaenterprises.web.app" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
            <Briefcase className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">Aghaniya</h1>
            <p className="text-xs text-gray-500 font-medium">Admin Portal</p>
          </div>
        </a>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>Powered by</span>
          <a href="https://htechdigital.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 font-semibold text-gray-800 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors">
            <Zap className="h-3 w-3 text-orange-500" />
            H-Tech Digital
          </a>
        </div>
      </header>
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
          <Card className="h-full flex flex-col">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">Menu</div>
                <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} size="sm" onClick={() => navigate('/dashboard')} title="Dashboard">
                  <Home className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2">
                {isSuper ? (
                  // SuperAdmin Menu - Only 3 items
                  <>
                    <Button variant={isActive('/superadmin') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/superadmin')}>
                      <Shield className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">SuperAdmin Settings</span>
                    </Button>
                    <Button variant={isActive('/users') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/users')}>
                      <Settings className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Admin Users</span>
                    </Button>
                    <Button variant={isActive('/agents') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/agents')}>
                      <Users className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Agents</span>
                    </Button>
                  </>
                ) : isAgentRole ? (
                  // Agent Menu
                  <>
                    <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/dashboard')}>
                      <Home className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Dashboard</span>
                    </Button>
                    <Button variant={isActive('/my-leads') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/my-leads')}>
                      <Database className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Self Leads</span>
                    </Button>

                    <Button variant={isActive('/user-profile') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/user-profile')}>
                      <User className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">User Profile</span>
                    </Button>
                  </>
                ) : currentAgent?.role === 'manager' ? (
                  // Manager Menu - Dashboard + Team Dashboard + Regular items
                  <>
                    <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/dashboard')}>
                      <Home className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Dashboard</span>
                    </Button>

                    <Button variant={isActive('/team-dashboard') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/team-dashboard')}>
                      <Users className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Team Dashboard</span>
                    </Button>

                    <Button variant={isActive('/leads/manual') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/manual')}>
                      <Database className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Manual Leads</span>
                    </Button>

                    <Button variant={isActive('/leads/website') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/website')}>
                      <FileSearch className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Website Leads</span>
                    </Button>

                    <Button variant={isActive('/leads/contacts') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/contacts')}>
                      <Mail className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Contact</span>
                    </Button>

                    <Button variant={isActive('/leads/careers') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/careers')}>
                      <Briefcase className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Careers</span>
                    </Button>



                    <Button variant={isActive('/agents') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/agents')}>
                      <Users className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Agents</span>
                    </Button>
                  </>
                ) : (
                  // Regular Admin Menu - Full menu
                  <>
                    <Button variant={isActive('/dashboard') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/dashboard')}>
                      <Home className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Dashboard</span>
                    </Button>

                    <Button variant={isActive('/performance-dashboard') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/performance-dashboard')}>
                      <TrendingUp className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Performance</span>
                    </Button>

                    <Button variant={isActive('/leads/manual') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/manual')}>
                      <Database className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Manual Leads</span>
                    </Button>

                    <Button variant={isActive('/leads/website') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/website')}>
                      <FileSearch className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Website Leads</span>
                    </Button>

                    <Button variant={isActive('/leads/contacts') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/contacts')}>
                      <Mail className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Contact</span>
                    </Button>

                    <Button variant={isActive('/leads/careers') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/leads/careers')}>
                      <Briefcase className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Careers</span>
                    </Button>



                    <Button variant={isActive('/agents') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/agents')}>
                      <Users className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Agents</span>
                    </Button>
                  </>
                )}
              </div>

              <div className="mt-8 border-t pt-6">
                <div className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 mb-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-xs font-medium uppercase">{currentAgent?.name?.substring(0, 2) || user?.email?.substring(0, 2) || 'AD'}</span>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-medium text-gray-900 truncate">{currentAgent?.name || 'Admin'}</p>
                    <p className="text-xs text-gray-500 truncate">{currentAgent?.role || 'Administrator'}</p>
                  </div>
                </div>
                <Button variant="destructive" className="w-full justify-start md:w-auto" onClick={async () => { await (await import('@/lib/firebase')).signOutUser(); navigate('/login'); }}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {children}
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-2 pt-2 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Aghaniya. All rights reserved.</p>
        <p>Managed by H-Tech Solutions</p>
      </footer>
    </div>
  );
};
