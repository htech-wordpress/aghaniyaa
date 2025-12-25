import { getDatabaseInstance } from './firebase';
import type { Lead, LeadCategory } from './storage';
import {
  ref,
  push,
  set
} from 'firebase/database';

// Realtime DB-backed leads helpers. These functions gracefully throw if DB is not initialized.

function ensureDatabase() {
  const db = getDatabaseInstance();
  if (!db) throw new Error('Database not initialized');
  return db;
}

export async function saveLeadAsync(category: LeadCategory, data: Record<string, unknown>): Promise<Lead> {
  const db = ensureDatabase();
  const timestamp = new Date().toISOString();
  const payload = { category, data, timestamp };
  console.log('Saving lead to Realtime DB:', payload); // Debug log

  const leadsRef = ref(db, 'leads');
  const newLeadRef = push(leadsRef);
  await set(newLeadRef, payload);

  return {
    id: newLeadRef.key as string,
    category,
    timestamp,
    data,
  };
}
