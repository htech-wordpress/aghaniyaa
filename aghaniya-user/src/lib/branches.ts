import { getDatabaseInstance } from './firebase';
import { ref, onValue, query, orderByChild } from 'firebase/database';

export interface Branch {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    phone: string;
    mapLink: string;
    status: 'active' | 'inactive';
    createdAt: string;
}

export const subscribeToBranches = (callback: (branches: Branch[]) => void) => {
    const db = getDatabaseInstance();
    if (!db) {
        console.error('Database not initialized');
        return () => { };
    }

    const branchesRef = ref(db, 'branches');
    // Order by status to easily group them, though we'll filter client-side too
    const branchesQuery = query(branchesRef, orderByChild('status'));

    const unsubscribe = onValue(branchesQuery, (snapshot) => {
        const branches: Branch[] = [];
        snapshot.forEach((childSnapshot) => {
            const data = childSnapshot.val();
            // Only include active branches for the public website
            if (data.status === 'active') {
                branches.push({
                    id: childSnapshot.key as string,
                    ...data,
                });
            }
        });

        // Sort active branches optionally (e.g., by city or name)
        branches.sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name));

        callback(branches);
    }, (error) => {
        console.error('Error fetching branches:', error);
        callback([]);
    });

    return unsubscribe;
};
