import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut, onAuthStateChanged, type User } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, getDoc, setDoc, arrayUnion } from 'firebase/firestore';

// Read config from environment variables (Vite)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  // databaseURL is not required for Firestore but leave if present
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, // Added
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: any = null;
let auth: ReturnType<typeof getAuth> | null = null;
let firestore: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null; // Added

if (firebaseConfig.apiKey) {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  firestore = getFirestore(app);
  storage = getStorage(app); // Added
} else {
  // No config provided; app will remain null and callers should handle that.
  console.warn('Firebase not configured. Set VITE_FIREBASE_* environment variables to enable Firebase.');
}

const provider = auth ? new GoogleAuthProvider() : null;

export function getFirebaseAuth() {
  return auth;
}

export function getFirestoreInstance() {
  return firestore;
}

export const db = firestore; // Export db for direct access

export function getStorageInstance() { // Added export
  return storage;
}

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth || !provider) throw new Error('Firebase not initialized');
  try {
    const res = await signInWithPopup(auth, provider);
    return res.user || null;
  } catch (err: any) {
    // Surfacing clearer guidance for configuration issues
    const code = err?.code || err?.message || '';
    if (String(code).includes('configuration-not-found') || String(code).includes('auth/configuration-not-found')) {
      throw new Error('Firebase auth configuration not found. Ensure your Firebase project has a registered Web App (App ID) and the Google sign-in provider and local authorized domain (e.g., localhost) are enabled in the Firebase Console.');
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

// Quick check for Identity Toolkit (Auth) configuration using the API key
export async function checkAuthConfiguration(): Promise<{ ok: boolean; message?: string; raw?: any }> {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  if (!key) return { ok: false, message: 'VITE_FIREBASE_API_KEY not set' };
  try {
    const res = await fetch(`https://identitytoolkit.googleapis.com/v1/projects?key=${key}`);
    const json = await res.json();
    if (!res.ok) {
      return { ok: false, message: json?.error?.message || 'Unknown error', raw: json };
    }
    return { ok: true, raw: json };
  } catch (e: any) {
    return { ok: false, message: e?.message || 'Network error', raw: e };
  }
}

// Quick network probe to check if Firestore requests are being blocked by the
// browser (eg. ad-blocker / privacy extension). We attempt a small REST call
// to the Firestore REST API using the configured project and API key. If the
// network is blocked, fetch will throw (TypeError) or fail; we return a helpful
// message that the developer can act on.
export async function checkFirestoreNetwork(): Promise<{ ok: boolean; message?: string; raw?: any }> {
  // Probe disabled to avoid confusing 404 errors if Project ID / DB name usage differs between SDK and REST.
  // The SDK is the source of truth for connectivity.
  return { ok: true, message: 'Network probe disabled', raw: null };
}

export async function isAdminUID(uid: string): Promise<boolean> {
  if (!firestore) return false;
  try {
    const snap = await getDoc(doc(firestore, `admins`, uid));
    return snap.exists();
  } catch (e) {
    console.warn('isAdminUID error', e);
    return false;
  }
}

// Check if user is an admin (either by explicit UID doc, superuser email, or allowed email list)
export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;
  if (!firestore) return false;
  try {
    // 1. Check by UID document
    const uidDoc = await getDoc(doc(firestore, `admins`, user.uid));
    if (uidDoc.exists()) return true;

    // 2. Check superuser emails list
    const superCfg = await getDoc(doc(firestore, 'adminConfig', 'superusers'));
    if (superCfg.exists()) {
      const data = superCfg.data();
      const emails: string[] = data?.emails || [];
      if (user.email && emails.includes(user.email)) return true;
    }

    // 3. Check allowed admin emails list
    const accessCfg = await getDoc(doc(firestore, 'adminConfig', 'access'));
    if (accessCfg.exists()) {
      const data = accessCfg.data();
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
  if (!firestore) return false;
  try {
    const cfg = await getDoc(doc(firestore, 'adminConfig', 'superusers'));
    if (!cfg.exists()) return false;
    const data = cfg.data();
    const emails: string[] = data?.emails || [];
    return Boolean(user.email && emails.includes(user.email));
  } catch (e: any) {
    const msg = String(e?.message || '').toLowerCase();
    const code = String(e?.code || '');
    if (code.includes('permission-denied') || msg.includes('missing or insufficient')) {
      console.debug('isSuperUser permission denied while checking superuser status');
    } else {
      console.warn('isSuperUser error', e);
    }
    return false;
  }
}

export async function addSuperAdminEmail(email: string): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  try {
    const cfgRef = doc(firestore, 'adminConfig', 'superusers');
    await setDoc(cfgRef, { emails: arrayUnion(email) }, { merge: true });
  } catch (e) {
    console.warn('addSuperAdminEmail error', e);
    throw e;
  }
}

// === NEW: Email Allowlist Management ===

export async function getAuthorizedAdminEmails(): Promise<string[]> {
  if (!firestore) return [];
  try {
    const cfgRef = doc(firestore, 'adminConfig', 'access');
    const snap = await getDoc(cfgRef);
    if (!snap.exists()) return [];
    return snap.data()?.adminEmails || [];
  } catch (e) {
    console.warn('getAuthorizedAdminEmails error', e);
    return [];
  }
}

export async function addAdminEmail(email: string): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  const cfgRef = doc(firestore, 'adminConfig', 'access');
  // Initialize doc if missing, then arrayUnion
  await setDoc(cfgRef, { adminEmails: arrayUnion(email) }, { merge: true });
}

export async function removeAdminEmail(email: string): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  const cfgRef = doc(firestore, 'adminConfig', 'access');
  const snap = await getDoc(cfgRef);
  if (snap.exists()) {
    const current = snap.data()?.adminEmails || [];
    const updated = current.filter((e: string) => e !== email);
    await setDoc(cfgRef, { adminEmails: updated });
  }
}

// Deprecated but kept for backward compatibility if needed
export async function addAdminByUid(uid: string, profile: { name?: string; email?: string } = {}): Promise<void> {
  if (!firestore) throw new Error('Firestore not initialized');
  const ref = doc(firestore, 'admins', uid);
  await setDoc(ref, { ...profile, createdAt: new Date().toISOString() }, { merge: true });
}

export async function getAdminList(): Promise<Array<{ id: string; data: any }>> {
  if (!firestore) return [];
  try {
    const qSnapshot = await (await import('firebase/firestore')).getDocs((await import('firebase/firestore')).collection(firestore, 'admins'));
    return qSnapshot.docs.map(d => ({ id: d.id, data: d.data() }));
  } catch (e: any) {
    console.debug('getAdminList (UIDs) permission denied or empty');
    return [];
  }
}

export async function getSuperAdminEmails(): Promise<string[]> {
  if (!firestore) return [];
  try {
    const cfgRef = doc(firestore, 'adminConfig', 'superusers');
    const snap = await getDoc(cfgRef);
    if (!snap.exists()) return [];
    const data = snap.data();
    return data?.emails || [];
  } catch (e: any) {
    console.warn('getSuperAdminEmails error', e);
    return [];
  }
}
