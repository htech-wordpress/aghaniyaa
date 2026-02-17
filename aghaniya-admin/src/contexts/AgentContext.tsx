import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getDatabaseInstance } from '@/lib/firebase';
import { ref, query, orderByChild, equalTo, get } from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';

interface Agent {
    id: string;
    agentId: string;
    name: string;
    email: string;
    role: 'admin' | 'manager' | 'agent';
    managerId?: string;
    phone?: string;
    department?: string;
    joiningDate?: string;
    modules?: string[]; // Array of allowed module IDs
    status: 'active' | 'inactive';
    createdAt: string;
}

interface AgentContextType {
    currentAgent: Agent | null;
    loading: boolean;
    isAgent: boolean;
    isManager: boolean;
    isAdmin: boolean;
    isSuperAdmin: boolean;
    accessibleModules: string[];
    refreshAgent: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
    const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);
    const [accessibleModules, setAccessibleModules] = useState<string[]>([]);

    const loadAgentByEmail = async (email: string) => {
        const db = getDatabaseInstance();
        if (!db) return null;

        try {
            // 1. Check 'agents' collection first
            const agentsRef = ref(db, 'agents');
            const agentQuery = query(
                agentsRef,
                orderByChild('email'),
                equalTo(email)
            );
            const agentSnap = await get(agentQuery);

            if (agentSnap.exists()) {
                let foundAgent: Agent | null = null;
                agentSnap.forEach((childSnap) => {
                    const data = childSnap.val();
                    if (data.status === 'active') {
                        foundAgent = { id: childSnap.key!, ...data } as Agent;
                    }
                });
                if (foundAgent) return foundAgent;
            }

            // 2. If not agent, check 'adminUsers' collection
            const adminsRef = ref(db, 'adminUsers');
            const adminQuery = query(
                adminsRef,
                orderByChild('email'),
                equalTo(email)
            );
            const adminSnap = await get(adminQuery);

            if (adminSnap.exists()) {
                let foundAdmin: Agent | null = null;
                adminSnap.forEach((childSnap) => {
                    const data = childSnap.val();
                    if (data.status === 'active') {
                        // Cast admin user to Agent shape for consistent context
                        foundAdmin = {
                            id: childSnap.key!,
                            agentId: data.adminId,
                            role: 'admin',
                            modules: data.modules || [], // Load assigned modules
                            ...data
                        } as Agent;
                    }
                });
                if (foundAdmin) return foundAdmin;
            }

            return null;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    };

    const refreshAgent = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user?.email) {
            // Check super admin status
            const superUser = await (await import('@/lib/firebase')).isSuperUser(user);
            setIsSuperAdmin(superUser);

            const agent = await loadAgentByEmail(user.email);
            setCurrentAgent(agent);

            // Cast to any to bypass TS inference issues in build
            const agentInLoop: any = agent;

            if (superUser) {
                setAccessibleModules(['*']); // All access
            } else if (agentInLoop?.role === 'admin' && agentInLoop?.modules) {
                setAccessibleModules(agentInLoop.modules);
            } else if (agentInLoop?.role === 'manager') {
                // Default manager modules
                setAccessibleModules(['dashboard', 'team_dashboard', 'leads_manual', 'leads_website', 'leads_contacts', 'leads_careers', 'agents']);
            } else if (agentInLoop?.role === 'agent') {
                // Default agent modules
                setAccessibleModules(['dashboard', 'my_leads', 'user_profile']);
            } else {
                setAccessibleModules([]);
            }
        } else {
            setCurrentAgent(null);
            setIsSuperAdmin(false);
            setAccessibleModules([]);
        }
    };

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setLoading(true);

            if (user?.email) {
                const superUser = await (await import('@/lib/firebase')).isSuperUser(user);
                setIsSuperAdmin(superUser);

                const agent = await loadAgentByEmail(user.email);
                setCurrentAgent(agent); // Update state!

                // Cast to any to bypass TS inference issues in build
                const agentInLoop: any = agent;

                if (superUser) {
                    setAccessibleModules(['*']); // All access
                } else if (agentInLoop?.role === 'admin' && agentInLoop?.modules) {
                    setAccessibleModules(agentInLoop.modules);
                } else if (agentInLoop?.role === 'manager') {
                    setAccessibleModules(['dashboard', 'team_dashboard', 'leads_manual', 'leads_website', 'leads_contacts', 'leads_careers', 'agents']);
                } else if (agentInLoop?.role === 'agent') {
                    setAccessibleModules(['dashboard', 'my_leads', 'user_profile']);
                } else {
                    setAccessibleModules([]);
                }
            } else {
                setCurrentAgent(null);
                setIsSuperAdmin(false);
                setAccessibleModules([]);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const value: AgentContextType = {
        currentAgent,
        loading,
        isAgent: currentAgent?.role === 'agent',
        isManager: currentAgent?.role === 'manager',
        isAdmin: currentAgent?.role === 'admin',
        isSuperAdmin,
        accessibleModules,
        refreshAgent,
    };

    return <AgentContext.Provider value={value}>{children}</AgentContext.Provider>;
}

export function useAgent() {
    const context = useContext(AgentContext);
    if (context === undefined) {
        throw new Error('useAgent must be used within an AgentProvider');
    }
    return context;
}
