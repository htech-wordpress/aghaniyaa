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

  // Attach an error handler to avoid uncaught permission errors from bubbling up
  // into the Firestore internals (which can cause internal assertion failures).
  try {
    let cancelled = false;
    let unsub: (() => void) | null = null;

    // Probe permissions with a one-time read. If the caller doesn't have
    // permission to read `leads`, getDocs will throw and we avoid attaching
    // the watch which can drive internal client errors.
    getDocs(q).then((initial) => {
      if (cancelled) return;
      const initialLeads = initial.docs.map(s => {
        const d = s.data() as any;
        return { id: s.id, category: d.category, timestamp: d.timestamp, data: d.data };
      });
      try { callback(initialLeads); } catch (e) {}

      // Now attach the real-time listener
      unsub = onSnapshot(q, (snapshot) => {
        const leads = snapshot.docs.map(s => {
          const d = s.data() as any;
          return { id: s.id, category: d.category, timestamp: d.timestamp, data: d.data };
        });
        callback(leads);
      }, (err) => {
        const msg = String(err?.message || '').toLowerCase();
        const code = String(err?.code || '').toLowerCase();
        if (code.includes('permission-denied') || msg.includes('permission-denied') || msg.includes('missing or insufficient')) {
          console.debug('subscribeToLeads permission denied (snapshot)');
          try { callback([]); } catch (e) {}
          try { unsub && unsub(); } catch (e) {}
          return;
        }

        console.error('subscribeToLeads error', err);
      });
    }).catch((err: any) => {
      const msg = String(err?.message || '').toLowerCase();
      const code = String(err?.code || '').toLowerCase();
      if (code.includes('permission-denied') || msg.includes('permission-denied') || msg.includes('missing or insufficient')) {
        console.debug('subscribeToLeads permission denied on initial probe');
        try { callback([]); } catch (e) {}
        return;
      }

      console.error('subscribeToLeads initial probe failed', err);
      try { callback([]); } catch (e) {}
    });

    // Return a synchronous unsubscribe that will cancel pending probe or the live listener
    return () => { cancelled = true; try { unsub && unsub(); } catch (e) {} };
  } catch (e) {
    // If onSnapshot itself throws synchronously, fallback to no-op
    console.debug('subscribeToLeads failed to attach listener', e);
    try { callback([]); } catch (err) {}
    return () => {};
  }
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
