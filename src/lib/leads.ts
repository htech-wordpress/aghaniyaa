import { getFirestoreInstance } from './firebase';
import * as XLSX from 'xlsx';
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
import { getAuth } from 'firebase/auth';

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
      try { callback(initialLeads); } catch (e) { }

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
          try { callback([]); } catch (e) { }
          try { unsub && unsub(); } catch (e) { }
          return;
        }

        console.error('subscribeToLeads error', err);
      });
    }).catch((err: any) => {
      const msg = String(err?.message || '').toLowerCase();
      const code = String(err?.code || '').toLowerCase();
      if (code.includes('permission-denied') || msg.includes('permission-denied') || msg.includes('missing or insufficient')) {
        console.debug('subscribeToLeads permission denied on initial probe');
        try { callback([]); } catch (e) { }
        return;
      }

      console.error('subscribeToLeads initial probe failed', err);
      try { callback([]); } catch (e) { }
    });

    // Return a synchronous unsubscribe that will cancel pending probe or the live listener
    return () => { cancelled = true; try { unsub && unsub(); } catch (e) { } };
  } catch (e) {
    // If onSnapshot itself throws synchronously, fallback to no-op
    console.debug('subscribeToLeads failed to attach listener', e);
    try { callback([]); } catch (err) { }
    return () => { };
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

export function exportLeadsToCSV(leads: Lead[]): string {
  if (!leads.length) return '';
  const headers = [
    'ID', 'Category', 'Date', 'Status', 'Updated By', 'Last Updated',
    'Full Name', 'Email', 'Mobile', 'Source', 'Message',
    'Loan Type', 'Amount', 'Reason',
    'Employment Type', 'Monthly Income',
    'Street Address', 'City', 'State', 'Zip Code',
    'Bank Name', 'Account Holder', 'Account Number', 'IFSC',
    'Existing Loans'
  ];

  const rows = leads.map(l => {
    const d = l.data || {};

    // Format existing loans
    let loansStr = '';
    if (d.existingLoans) {
      if (Array.isArray(d.existingLoans)) {
        loansStr = d.existingLoans.map((loan: any) => `${loan.bank || 'Unknown'}: ${loan.amount || 0} (EMI: ${loan.emi || 0})`).join(' | ');
      } else if (typeof d.existingLoans === 'string') {
        loansStr = d.existingLoans;
      }
    }

    return [
      l.id,
      l.category,
      new Date(l.timestamp).toLocaleDateString(),
      d.status || 'New',
      d.updatedBy || '',
      d.lastUpdated ? new Date(d.lastUpdated).toLocaleString() : '',
      `"${(d.fullName || d.name || '').replace(/"/g, '""')}"`,
      d.email || '',
      d.mobile || '',
      d.source || '',
      `"${(d.message || '').replace(/"/g, '""')}"`,
      d.loanType || '',
      d.amount || d.loanAmount || '',
      `"${(d.reason || '').replace(/"/g, '""')}"`,
      d.employmentType || '',
      d.monthlyIncome || '',
      `"${(d.address || '').replace(/"/g, '""')}"`,
      d.city || '',
      d.state || '',
      d.zipCode || '',
      d.bankName || '',
      d.accountHolder || '',
      `'${d.accountNumber || ''}`, // Prepend ' to force string in Excel for acc nos
      d.ifsc || '',
      `"${loansStr.replace(/"/g, '""')}"`
    ].join(',');
  });
  return [headers.join(','), ...rows].join('\n');
}

// Helper to parse a CSV line respecting quotes
function parseCSVLine(text: string): string[] {
  const result: string[] = [];
  let cur = '';
  let inQuote = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (inQuote) {
      if (char === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          cur += '"';
          i++;
        } else {
          inQuote = false;
        }
      } else {
        cur += char;
      }
    } else {
      if (char === '"') {
        inQuote = true;
      } else if (char === ',') {
        result.push(cur);
        cur = '';
      } else {
        cur += char;
      }
    }
  }
  result.push(cur);
  return result;
}

export async function importLeadsFromCSV(csvText: string): Promise<number> {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length < 2) return 0; // Header only or empty

  const headers = parseCSVLine(lines[0]).map(h => h.toLowerCase().trim().replace(/['"]/g, ''));

  // Map headers to data keys
  const map: Record<string, number> = {};

  // Helper to find index of best matching header
  const findIndex = (keywords: string[], antiKeywords: string[] = []) => {
    // 1. Exact match (trimmed, lowercase)
    let idx = headers.findIndex(h => keywords.includes(h));
    if (idx !== -1) return idx;

    // 2. Contains match
    return headers.findIndex(h =>
      keywords.some(k => h.includes(k)) &&
      !antiKeywords.some(ak => h.includes(ak))
    );
  };

  map['category'] = findIndex(['category', 'type', 'product']);
  map['fullName'] = findIndex(['name', 'customer', 'full name', 'contact person']);
  map['email'] = findIndex(['email', 'mail']);
  map['mobile'] = findIndex(['mobile', 'phone', 'contact no', 'contact number', 'cell'], ['contact person']); // Avoid "Contact Person" mapping to mobile
  map['city'] = findIndex(['city', 'location']);
  map['state'] = findIndex(['state', 'region']);
  map['message'] = findIndex(['message', 'comment', 'query']);
  map['source'] = findIndex(['source', 'referrer']);
  map['loanType'] = findIndex(['loan type', 'loan_type']);
  map['amount'] = findIndex(['amount', 'loan amount', 'value']);

  // Extended fields
  map['reason'] = findIndex(['reason', 'purpose']);
  map['employmentType'] = findIndex(['employment type', 'employment']);
  map['monthlyIncome'] = findIndex(['monthly income', 'income', 'salary']);
  map['address'] = findIndex(['address', 'street', 'street address'], ['email', 'ip']);
  map['zipCode'] = findIndex(['zip code', 'zip', 'postal code', 'pincode']);
  map['bankName'] = findIndex(['bank name', 'bank']);
  map['accountHolder'] = findIndex(['account holder', 'holder name']);
  map['accountNumber'] = findIndex(['account number', 'account no']);
  map['ifsc'] = findIndex(['ifsc', 'ifsc code']);
  map['existingLoans'] = findIndex(['existing loans', 'current loans']); // Will be stored as string or parsed if JSON

  let imported = 0;
  // Use a batch or sequential approach. Sequential for now to avoid specific Firestore rate limits if any on Write.
  for (let i = 1; i < lines.length; i++) {
    const parts = parseCSVLine(lines[i]);
    if (parts.length < 2) continue; // Skip empty/malformed rows

    // Helper to get value safely
    const getVal = (key: string) => (map[key] !== undefined && map[key] !== -1 && parts[map[key]]) ? parts[map[key]].trim() : '';

    // Determine category: Priority: CSV column -> 'contact' default
    let categoryRaw = getVal('category').toLowerCase();
    // Validate category or fallback
    const validCategories: LeadCategory[] = ['home-loan', 'personal-loan', 'business-loan', 'education-loan', 'car-loan', 'gold-loan', 'loan-against-property', 'credit-card', 'cibil-check', 'contact', 'careers'];

    // Attempt to normalize category from string (e.g. "Home Loan" -> "home-loan")
    let category: LeadCategory = 'contact';
    if (validCategories.includes(categoryRaw as any)) {
      category = categoryRaw as LeadCategory;
    } else {
      const normalized = categoryRaw.replace(/\s+/g, '-');
      if (validCategories.includes(normalized as any)) category = normalized as LeadCategory;
    }

    const auth = getAuth();
    const currentUser = auth.currentUser?.email || 'Import Tool';

    const data: Record<string, any> = {
      fullName: getVal('fullName'),
      email: getVal('email'),
      mobile: getVal('mobile'),
      city: getVal('city'),
      state: getVal('state'),
      address: getVal('address'),
      zipCode: getVal('zipCode'),
      message: getVal('message'),
      loanType: getVal('loanType'),
      amount: getVal('amount'),
      reason: getVal('reason'),
      employmentType: getVal('employmentType'),
      monthlyIncome: getVal('monthlyIncome'),
      bankName: getVal('bankName'),
      accountHolder: getVal('accountHolder'),
      accountNumber: getVal('accountNumber'),
      ifsc: getVal('ifsc'),
      existingLoans: getVal('existingLoans'), // Basic string import for now
      source: getVal('source') || 'manual-import',
      status: 'New',
      importedAt: new Date().toISOString(),
      updatedBy: currentUser,
      lastUpdated: new Date().toISOString(),
      pipeline: [{ status: 'New', date: new Date().toISOString(), comment: 'Lead imported via CSV/Excel', updatedBy: currentUser }]
    };

    // Only save if we have at least a name or email or mobile
    if (data.fullName || data.email || data.mobile) {
      try {
        await saveLeadAsync(category, data);
        imported++;
      } catch (e) {
        console.error('Error importing row', i, e);
      }
    }
  }
  return imported;
}

export async function importLeadsFromExcel(buffer: ArrayBuffer): Promise<number> {
  try {
    const wb = XLSX.read(buffer, { type: 'array' });
    const firstSheetName = wb.SheetNames[0];
    const ws = wb.Sheets[firstSheetName];
    // Convert to CSV to reuse robust CSV parsing logic (headers map, etc)
    const csv = XLSX.utils.sheet_to_csv(ws);
    return await importLeadsFromCSV(csv);
  } catch (e) {
    console.error('Excel parse error:', e);
    return 0;
  }
}

export async function clearAllLeadsAsync(): Promise<void> {
  const db = ensureFirestore();
  const q = query(collection(db, 'leads'));
  const snapshot = await getDocs(q);
  const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
  await Promise.all(deletePromises);
}

import { getStorageInstance } from './firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export async function uploadLeadDocument(leadId: string, file: File): Promise<string> {
  const storage = getStorageInstance();
  if (!storage) throw new Error('Storage not initialized');

  const path = `leads/${leadId}/documents/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);

  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function addDocumentToLeadAsync(leadId: string, docData: { name: string; url: string; type: string }) {
  const db = ensureFirestore();
  const leadRef = doc(db, 'leads', leadId);
  const auth = getAuth();
  const userEmail = auth.currentUser?.email || 'Unknown';

  const newDoc = {
    id: Date.now().toString(),
    ...docData,
    uploadedAt: new Date().toISOString(),
    uploadedBy: userEmail
  };

  const { updateDoc, arrayUnion } = await import('firebase/firestore');

  await updateDoc(leadRef, {
    'data.documents': arrayUnion(newDoc)
  });

  return newDoc;
}

export async function seedDummyDataAsync(): Promise<void> {
  const dummyLeads: any[] = [];

  // Home Loan leads (3)
  const homeLoanData = [
    { fullName: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', mobile: '9876543210', city: 'Mumbai', state: 'Maharashtra', loanAmount: '5000000', employmentType: 'salaried', monthlyIncome: '150000', message: 'Need loan for new home in Mumbai' },
    { fullName: 'Priya Sharma', email: 'priya.sharma@email.com', mobile: '9876543211', city: 'Delhi', state: 'Delhi', loanAmount: '3500000', employmentType: 'self-employed', monthlyIncome: '200000', message: 'Looking for home loan with flexible EMI' },
    { fullName: 'Amit Patel', email: 'amit.patel@email.com', mobile: '9876543212', city: 'Bangalore', state: 'Karnataka', loanAmount: '6000000', employmentType: 'business', monthlyIncome: '300000', message: 'Want to purchase 3BHK apartment' },
  ];
  homeLoanData.forEach((data) => {
    dummyLeads.push({
      category: 'home-loan' as LeadCategory,
      data: { ...data, loanType: 'Home Loan' },
    });
  });

  // Personal Loan leads (2)
  const personalLoanData = [
    { fullName: 'Sneha Reddy', email: 'sneha.reddy@email.com', mobile: '9876543213', city: 'Hyderabad', state: 'Telangana', loanAmount: '500000', employmentType: 'salaried', monthlyIncome: '80000', message: 'Need urgent personal loan for medical expenses' },
    { fullName: 'Vikram Singh', email: 'vikram.singh@email.com', mobile: '9876543214', city: 'Pune', state: 'Maharashtra', loanAmount: '300000', employmentType: 'salaried', monthlyIncome: '60000', message: 'Wedding expenses' },
  ];
  personalLoanData.forEach((data) => {
    dummyLeads.push({
      category: 'personal-loan' as LeadCategory,
      data: { ...data, loanType: 'Personal Loan' },
    });
  });

  // Credit Card leads (2)
  const creditCardData = [
    { fullName: 'Neha Kapoor', email: 'neha.kapoor@email.com', mobile: '9876543226', city: 'Mumbai', state: 'Maharashtra', monthlyIncome: '120000', employmentType: 'salaried', selectedCard: 'Premium Rewards Card', selectedCardIssuer: 'HDFC Bank' },
    { fullName: 'Karan Shah', email: 'karan.shah@email.com', mobile: '9876543227', city: 'Vadodara', state: 'Gujarat', monthlyIncome: '150000', employmentType: 'business', selectedCard: 'Cashback Plus Card', selectedCardIssuer: 'ICICI Bank' },
  ];
  creditCardData.forEach((data) => {
    dummyLeads.push({
      category: 'credit-card' as LeadCategory,
      data,
    });
  });

  // Execute saves in parallel
  await Promise.all(dummyLeads.map(l => saveLeadAsync(l.category, l.data)));
}
