import { getFirestoreInstance } from './firebase';
import type { Lead, LeadCategory } from './storage';
import {
  collection,
  addDoc,
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
  console.log('Saving lead to Firestore:', payload); // Debug log
  const ref = await addDoc(collection(db, 'leads'), payload);
  // Avoid reading back the document to prevent permission errors for unauthenticated users
  // who have create but not read access.
  return {
    id: ref.id,
    category,
    timestamp,
    data,
  };
}
