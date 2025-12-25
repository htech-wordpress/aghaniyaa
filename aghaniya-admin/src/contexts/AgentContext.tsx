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
    status: 'active' | 'inactive';
    createdAt: string;
}

interface AgentContextType {
    currentAgent: Agent | null;
    loading: boolean;
    isAgent: boolean;
    isManager: boolean;
    isAdmin: boolean;
    refreshAgent: () => Promise<void>;
}

const AgentContext = createContext<AgentContextType | undefined>(undefined);

export function AgentProvider({ children }: { children: ReactNode }) {
    const [currentAgent, setCurrentAgent] = useState<Agent | null>(null);
    const [loading, setLoading] = useState(true);

    const loadAgentByEmail = async (email: string) => {
        const db = getDatabaseInstance();
        if (!db) return null;

        try {
            const agentsRef = ref(db, 'agents');
            // Assuming we index 'agents' by email or just scan (filtering by email)
            // Realtime DB requires index on rules for performant queries on props
            const q = query(
                agentsRef,
                orderByChild('email'),
                equalTo(email)
            );
            const snapshot = await get(q);

            if (!snapshot.exists()) {
                // Also check if admin? Or logic strictly says this context is for Agents?
                // The interface has role 'admin', so maybe we should check admins too if not found in agents?
                // The original code only checked 'agents' collection. Sticking to that.
                return null;
            }

            // Snapshot can have multiple matches (though unique email is expected)
            // It returns an object of keys
            let foundAgent: Agent | null = null;

            snapshot.forEach((childSnap) => {
                const data = childSnap.val();
                if (data.status === 'active') {
                    foundAgent = { id: childSnap.key!, ...data } as Agent;
                    return true; // Stop iteration? No, forEach in RB doesn't support break easily, but we take the first active one.
                }
            });

            return foundAgent;
        } catch (error) {
            console.error('Error loading agent:', error);
            return null;
        }
    };

    const refreshAgent = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user?.email) {
            const agent = await loadAgentByEmail(user.email);
            setCurrentAgent(agent);
        } else {
            setCurrentAgent(null);
        }
    };

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user: User | null) => {
            setLoading(true);

            if (user?.email) {
                const agent = await loadAgentByEmail(user.email);
                setCurrentAgent(agent);
            } else {
                setCurrentAgent(null);
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
