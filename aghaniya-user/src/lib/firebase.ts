import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getDatabase, ref, get, child, set } from 'firebase/database';

// Read config from environment variables (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: any = null;
let auth: ReturnType<typeof getAuth> | null = null;
let database: ReturnType<typeof getDatabase> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  database = getDatabase(app);
  storage = getStorage(app);
} else {
  console.warn('Firebase not configured. Set VITE_FIREBASE_* environment variables to enable Firebase.');
}

const provider = auth ? new GoogleAuthProvider() : null;

export function getFirebaseAuth() {
  return auth;
}

export function getDatabaseInstance() {
  return database;
}

export function getStorageInstance() {
  return storage;
}

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !provider) throw new Error('Firebase not initialized');
  try {
    const res = await signInWithPopup(auth, provider);
    return res.user || null;
  } catch (err: any) {
    const code = err?.code || err?.message || '';
    if (String(code).includes('configuration-not-found') || String(code).includes('auth/configuration-not-found')) {
      throw new Error('Firebase auth configuration not found.');
    }
    throw err;
  }
}

export async function signOutUser() {
  if (!auth) return;
  await fbSignOut(auth);
}

export function onAuthChange(cb: (user: User | null) => void) {
  if (!auth) return () => { };
  return onAuthStateChanged(auth, cb);
}

export async function checkAuthConfiguration(): Promise<{ ok: boolean; message?: string; raw?: any }> {
  /* ... same implementation ... */
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!key) return { ok: false, message: 'VITE_FIREBASE_API_KEY not set' };
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects?key=${key}`);
    const json = await res.json();
    if (!res.ok) return { ok: false, message: json?.error?.message || 'Unknown error', raw: json };
    return { ok: true, raw: json };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'Network error', raw: e };
  }
}

export async function checkFirestoreNetwork(): Promise<{ ok: boolean; message?: string; raw?: any }> {
  return { ok: true, message: 'Network probe disabled (using Realtime DB)', raw: null };
}

// === Realtime DB Helpers ===

export async function isAdminUID(uid: string): Promise<boolean> {
  if (!database) return false;
  try {
    const snapshot = await get(child(ref(database), `admins/${uid}`));
    return snapshot.exists();
  } catch (e) {
    console.warn('isAdminUID error', e);
    return false;
  }
}

export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (!database) return false;
  try {
    // 1. Check by UID
    const uidSnap = await get(child(ref(database), `admins/${user.uid}`));
    if (uidSnap.exists()) return true;

    // 2. Check superuser emails
    const superSnap = await get(child(ref(database), 'adminConfig/superusers'));
    if (superSnap.exists()) {
      const data = superSnap.val();
      const emails: string[] = data?.emails || [];
      if (user.email && emails.includes(user.email)) return true;
    }

    // 3. Check allowed admin emails
    const accessSnap = await get(child(ref(database), 'adminConfig/access'));
    if (accessSnap.exists()) {
      const data = accessSnap.val();
      const emails: string[] = data?.adminEmails || [];
      if (user.email && emails.includes(user.email)) return true;
    }

    return false;
  } catch (e) {
    console.warn('isAdminUser error', e);
    return false;
  }
}

export async function isSuperUser(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (!database) return false;
  try {
    const snap = await get(child(ref(database), 'adminConfig/superusers'));
    if (!snap.exists()) return false;
    const data = snap.val();
    const emails: string[] = data?.emails || [];
    return Boolean(user.email && emails.includes(user.email));
  } catch (e) {
    console.warn('isSuperUser error', e);
    return false;
  }
}

export async function addSuperAdminEmail(email: string): Promise<void> {
  if (!database) throw new Error('DB not initialized');
  // Note: Realtime DB array updates are different, simpler to just read-modify-write for now
  // or use a transactional update if high concurrency, but this is rare admin action.
  // For simplicity, we'll assume the client handles the full list or we just push.
  // Ideally use data structure: superusers/emails/{safeEmail} = true
  // But adhering to previous Array structure:
  const dbRef = ref(database);
  const snap = await get(child(dbRef, 'adminConfig/superusers'));
  let emails: string[] = [];
  if (snap.exists()) emails = snap.val().emails || [];
  if (!emails.includes(email)) {
    emails.push(email);
    await set(child(dbRef, 'adminConfig/superusers/emails'), emails);
  }
}

export async function getAuthorizedAdminEmails(): Promise<string[]> {
  if (!database) return [];
  try {
    const snap = await get(child(ref(database), 'adminConfig/access'));
    if (!snap.exists()) return [];
    return snap.val()?.adminEmails || [];
  } catch (e) {
    console.warn('getAuthorizedAdminEmails error', e);
    return [];
  }
}

export async function addAdminEmail(email: string): Promise<void> {
  if (!database) throw new Error('DB not initialized');
  const dbRef = ref(database);
  const snap = await get(child(dbRef, 'adminConfig/access'));
  let emails: string[] = [];
  if (snap.exists()) emails = snap.val().adminEmails || [];
  if (!emails.includes(email)) {
    emails.push(email);
    await set(child(dbRef, 'adminConfig/access/adminEmails'), emails);
  }
}

export async function removeAdminEmail(email: string): Promise<void> {
  if (!database) throw new Error('DB not initialized');
  const dbRef = ref(database);
  const snap = await get(child(dbRef, 'adminConfig/access'));
  if (snap.exists()) {
    const current = snap.val()?.adminEmails || [];
    const updated = current.filter((e: string) => e !== email);
    await set(child(dbRef, 'adminConfig/access/adminEmails'), updated);
  }
}

