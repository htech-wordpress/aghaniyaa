import { getDatabaseInstance } from './firebase';
import {
    ref,
    push,
    set,
    get,
    child,
    update,
    remove,
    query,
    orderByChild,
    onValue,
    off
} from 'firebase/database';

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

function ensureDatabase() {
    const db = getDatabaseInstance();
    if (!db) throw new Error('Database not initialized');
    return db;
}

export async function saveBranchAsync(data: Omit<Branch, 'id' | 'createdAt'>): Promise<Branch> {
    const db = ensureDatabase();
    const createdAt = new Date().toISOString();
    const branchesRef = ref(db, 'branches');
    const newBranchRef = push(branchesRef);

    const branchData = {
        ...data,
        createdAt
    };

    await set(newBranchRef, branchData);

    return {
        id: newBranchRef.key as string,
        ...branchData
    };
}

export async function updateBranchAsync(branch: Branch): Promise<boolean> {
    const db = ensureDatabase();
    const branchRef = ref(db, `branches/${branch.id}`);

    const snap = await get(branchRef);
    if (!snap.exists()) return false;

    const { id, ...updateData } = branch;

    await update(branchRef, updateData);
    return true;
}

export async function deleteBranchAsync(branchId: string): Promise<boolean> {
    const db = ensureDatabase();
    const branchRef = ref(db, `branches/${branchId}`);
    const snap = await get(branchRef);
    if (!snap.exists()) return false;
    await remove(branchRef);
    return true;
}

export async function getBranchAsync(branchId: string): Promise<Branch | null> {
    const db = ensureDatabase();
    const snap = await get(child(ref(db), `branches/${branchId}`));
    if (!snap.exists()) return null;
    const d = snap.val();
    return { id: snap.key!, ...d };
}

export async function getAllBranchesAsync(): Promise<Branch[]> {
    const db = ensureDatabase();
    const q = query(ref(db, 'branches'), orderByChild('createdAt'));
    const snap = await get(q);
    const branches: Branch[] = [];
    snap.forEach((childSnap) => {
        branches.push({ id: childSnap.key!, ...childSnap.val() });
    });
    return branches.reverse(); // Newest first
}

export function subscribeToBranches(callback: (branches: Branch[]) => void) {
    const db = ensureDatabase();
    const q = query(ref(db, 'branches'), orderByChild('createdAt'));

    const listener = onValue(q, (snapshot) => {
        const branches: Branch[] = [];
        snapshot.forEach((childSnap) => {
            branches.push({ id: childSnap.key!, ...childSnap.val() });
        });
        callback(branches.reverse());
    }, (error) => {
        console.error('subscribeToBranches error', error);
        callback([]);
    });

    return () => off(q, 'value', listener);
}
