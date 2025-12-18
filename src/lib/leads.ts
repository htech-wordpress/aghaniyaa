import { getFirestoreInstance } from './firebase';
import type { Lead, LeadCategory } from './storage';
import {
  collection,
  addDoc,
  setDoc,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore';

// Firestore-backed leads helpers. These functions gracefully throw if Firestore is not configured.

function ensureFirestore() {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore not initialized');
  return db;
}

export async function saveLeadAsync(category: LeadCategory, data: Record<string, any>): Promise<Lead> {
  const db = ensureFirestore();
  const timestamp = new Date().toISOString();
  const payload = { category, data, timestamp };
  const ref = await addDoc(collection(db, 'leads'), payload);
  const snap = await getDoc(ref);
  const docData = snap.data() as any;
  return {
    id: ref.id,
    category: docData.category,
    timestamp: docData.timestamp,
    data: docData.data,
  };
}

export async function updateLeadAsync(updated: Lead): Promise<boolean> {
  const db = ensureFirestore();
  const ref = doc(db, 'leads', updated.id);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  await setDoc(ref, { category: updated.category, data: updated.data, timestamp: updated.timestamp }, { merge: true });
  return true;
}

export async function deleteLeadAsync(leadId: string): Promise<boolean> {
  const db = ensureFirestore();
  const ref = doc(db, 'leads', leadId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return false;
  await deleteDoc(ref);
  return true;
}

export async function getLeadAsync(leadId: string): Promise<Lead | null> {
  const db = ensureFirestore();
  const ref = doc(db, 'leads', leadId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return null;
  const d = snap.data() as any;
  return { id: snap.id, category: d.category, timestamp: d.timestamp, data: d.data };
}

export async function getAllLeadsAsync(): Promise<Lead[]> {
  const db = ensureFirestore();
  const q = query(collection(db, 'leads'), orderBy('timestamp', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(s => {
    const d = s.data() as any;
    return { id: s.id, category: d.category, timestamp: d.timestamp, data: d.data };
  });
}

export async function getLeadsByCategoryAsync(category: LeadCategory): Promise<Lead[]> {
  const db = ensureFirestore();
  const q = query(collection(db, 'leads'), where('category', '==', category), orderBy('timestamp', 'desc'));
  const snaps = await getDocs(q);
  return snaps.docs.map(s => {
    const d = s.data() as any;
    return { id: s.id, category: d.category, timestamp: d.timestamp, data: d.data };
  });
}

export function subscribeToLeads(callback: (leads: Lead[]) => void, category?: LeadCategory) {
  const db = ensureFirestore();
  const ref = collection(db, 'leads');
  const q = category ? query(ref, where('category', '==', category), orderBy('timestamp', 'desc')) : query(ref, orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const leads = snapshot.docs.map(s => {
      const d = s.data() as any;
      return { id: s.id, category: d.category, timestamp: d.timestamp, data: d.data };
    });
    callback(leads);
  });
}

// Migrate localStorage leads into Firestore. Idempotent: will skip documents that already exist by id.
export async function migrateLocalLeadsToFirestore(): Promise<{ migrated: number; skipped: number }> {
  const db = getFirestoreInstance();
  if (!db) throw new Error('Firestore not initialized');
  const STORAGE_KEY = 'aghaniya_leads';
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return { migrated: 0, skipped: 0 };
  const localLeads: Lead[] = JSON.parse(stored);
  let migrated = 0;
  let skipped = 0;
  for (const l of localLeads) {
    const ref = doc(db, 'leads', l.id);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      skipped++;
      continue;
    }
    await setDoc(ref, { category: l.category, data: l.data, timestamp: l.timestamp });
    migrated++;
  }
  return { migrated, skipped };
}
