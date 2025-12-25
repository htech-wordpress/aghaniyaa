import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { getFirestoreInstance } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
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
        const firestore = getFirestoreInstance();
        if (!firestore) return null;

        try {
            const agentsRef = collection(firestore, 'agents');
            const q = query(
                agentsRef,
                where('email', '==', email),
                where('status', '==', 'active')
            );
            const snapshot = await getDocs(q);

            if (snapshot.empty) return null;

            const doc = snapshot.docs[0];
            return { id: doc.id, ...doc.data() } as Agent;
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
