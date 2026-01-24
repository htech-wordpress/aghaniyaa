import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Home, Database, Mail, Briefcase, FileSearch, LogOut, Settings, Shield, Users, User, Zap } from 'lucide-react';
import { onAuthChange, isSuperUser } from '@/lib/firebase';
import { useAgent } from '@/contexts/AgentContext';
import { useConfig } from '@/contexts/ConfigContext';
import { ADMIN_MODULES } from '@/config/modules';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [isSuper, setIsSuper] = useState(false);
  const { currentAgent, isAgent: isAgentRole, accessibleModules } = useAgent();
  const { companySettings } = useConfig();



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

    return () => unsubscribe();
  }, [navigate]);

  const isActive = (path: string) => location.pathname === path || (path === '/leads' && location.pathname === '/dashboard');

  return (
    <div className="container mx-auto py-2">
      {/* App Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 flex items-center justify-between mb-2 border-b border-gray-200 py-2">
        <a href={companySettings.website || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          {companySettings.companyLogo ? (
            <img src={companySettings.companyLogo} alt="Logo" className="h-10 w-auto object-contain" />
          ) : (
            <div className="bg-blue-600 p-2 rounded-lg shadow-sm">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight leading-none">
              {companySettings.companyName || 'Aghaniya'}
            </h1>
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
                    <Button variant={isActive('/site-stats') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/site-stats')}>
                      <Zap className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Site Statistics</span>
                    </Button>
                    <Button variant={isActive('/loans') ? 'default' : 'ghost'} className="w-full justify-start py-3 px-3" onClick={() => navigate('/loans')}>
                      <Briefcase className="h-5 w-5 text-gray-700 mr-3" />
                      <span className="text-sm text-gray-800">Loan Products</span>
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
                  // Dynamic Menu for Admins based on permissions
                  <>
                    {ADMIN_MODULES.filter(module =>
                      accessibleModules.includes(module.id) || accessibleModules.includes('*')
                    ).map(module => {
                      const Icon = module.icon;
                      return (
                        <Button
                          key={module.id}
                          variant={isActive(module.path) ? 'default' : 'ghost'}
                          className="w-full justify-start py-3 px-3"
                          onClick={() => navigate(module.path)}
                        >
                          <Icon className="h-5 w-5 text-gray-700 mr-3" />
                          <span className="text-sm text-gray-800">{module.label}</span>
                        </Button>
                      );
                    })}
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
        <p>&copy; {new Date().getFullYear()} H-Tech Digital. All rights reserved.</p>
        <p>Managed by H-Tech Solutions</p>
      </footer>
    </div>
  );
};
