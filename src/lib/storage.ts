// Lead types
export type LeadCategory = 
  | 'home-loan'
  | 'personal-loan'
  | 'business-loan'
  | 'education-loan'
  | 'car-loan'
  | 'gold-loan'
  | 'loan-against-property'
  | 'credit-card'
  | 'cibil-check'
  | 'contact'
  | 'careers';

export interface Lead {
  id: string;
  category: LeadCategory;
  timestamp: string;
  data: Record<string, any>;
}

const STORAGE_KEY = 'aghaniya_leads';
const ADMIN_PASSWORD_KEY = 'aghaniya_admin_password';

// Default admin password (user can change it)
const DEFAULT_ADMIN_PASSWORD = 'admin123';

// Initialize admin password if not set
export function initAdminPassword() {
  if (!localStorage.getItem(ADMIN_PASSWORD_KEY)) {
    localStorage.setItem(ADMIN_PASSWORD_KEY, DEFAULT_ADMIN_PASSWORD);
  }
}

//  authentication
export function checkAdminPassword(password: string): boolean {
  const storedPassword = localStorage.getItem(ADMIN_PASSWORD_KEY);
  return storedPassword === password;
}

export function setAdminPassword(password: string) {
  localStorage.setItem(ADMIN_PASSWORD_KEY, password);
}

export function isAdminAuthenticated(): boolean {
  // legacy local session
  if (sessionStorage.getItem('admin_authenticated') === 'true') return true;
  // If Firebase is configured, rely on auth state instead (checked elsewhere)
  return false;
}

export function setAdminAuthenticated(value: boolean) {
  if (value) {
    sessionStorage.setItem('admin_authenticated', 'true');
  } else {
    sessionStorage.removeItem('admin_authenticated');
  }
}

// Lead management
export function saveLead(category: LeadCategory, data: Record<string, any>): Lead {
  const leads = getAllLeads();
  const lead: Lead = {
    id: `lead_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    category,
    timestamp: new Date().toISOString(),
    data,
  };
  
  leads.push(lead);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  return lead;
}

export function getAllLeads(): Lead[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function getLeadsByCategory(category: LeadCategory): Lead[] {
  return getAllLeads().filter(lead => lead.category === category);
}

export function deleteLead(leadId: string): boolean {
  const leads = getAllLeads();
  const filtered = leads.filter(lead => lead.id !== leadId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return filtered.length < leads.length;
}

export function updateLead(updated: Lead): boolean {
  const leads = getAllLeads();
  const idx = leads.findIndex(l => l.id === updated.id);
  if (idx === -1) return false;
  leads[idx] = updated;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  return true;
}

export function clearAllLeads() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getLeadsCount(): Record<LeadCategory, number> {
  const leads = getAllLeads();
  const counts: Record<string, number> = {};
  
  leads.forEach(lead => {
    counts[lead.category] = (counts[lead.category] || 0) + 1;
  });
  
  return counts as Record<LeadCategory, number>;
}

// Seed dummy data for testing
export function seedDummyData() {
  const existingLeads = getAllLeads();
  const now = Date.now();
  const dummyLeads: Lead[] = [];

  // Home Loan leads (3)
  const homeLoanData = [
    { fullName: 'Rajesh Kumar', email: 'rajesh.kumar@email.com', mobile: '9876543210', city: 'Mumbai', state: 'Maharashtra', loanAmount: '5000000', employmentType: 'salaried', monthlyIncome: '150000', message: 'Need loan for new home in Mumbai' },
    { fullName: 'Priya Sharma', email: 'priya.sharma@email.com', mobile: '9876543211', city: 'Delhi', state: 'Delhi', loanAmount: '3500000', employmentType: 'self-employed', monthlyIncome: '200000', message: 'Looking for home loan with flexible EMI' },
    { fullName: 'Amit Patel', email: 'amit.patel@email.com', mobile: '9876543212', city: 'Bangalore', state: 'Karnataka', loanAmount: '6000000', employmentType: 'business', monthlyIncome: '300000', message: 'Want to purchase 3BHK apartment' },
  ];
  homeLoanData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (10 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'home-loan',
      timestamp: new Date(now - (10 - index) * 3600000).toISOString(),
      data: { ...data, loanType: 'Home Loan' },
    });
  });

  // Personal Loan leads (3)
  const personalLoanData = [
    { fullName: 'Sneha Reddy', email: 'sneha.reddy@email.com', mobile: '9876543213', city: 'Hyderabad', state: 'Telangana', loanAmount: '500000', employmentType: 'salaried', monthlyIncome: '80000', message: 'Need urgent personal loan for medical expenses' },
    { fullName: 'Vikram Singh', email: 'vikram.singh@email.com', mobile: '9876543214', city: 'Pune', state: 'Maharashtra', loanAmount: '300000', employmentType: 'salaried', monthlyIncome: '60000', message: 'Wedding expenses' },
    { fullName: 'Anjali Mehta', email: 'anjali.mehta@email.com', mobile: '9876543215', city: 'Ahmedabad', state: 'Gujarat', loanAmount: '750000', employmentType: 'professional', monthlyIncome: '120000', message: 'Home renovation' },
  ];
  personalLoanData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (8 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'personal-loan',
      timestamp: new Date(now - (8 - index) * 3600000).toISOString(),
      data: { ...data, loanType: 'Personal Loan' },
    });
  });

  // Business Loan leads (2)
  const businessLoanData = [
    { fullName: 'Mohammed Ali', email: 'mohammed.ali@email.com', mobile: '9876543216', city: 'Chennai', state: 'Tamil Nadu', loanAmount: '2000000', employmentType: 'business', monthlyIncome: '400000', message: 'Expanding my retail business' },
    { fullName: 'Deepak Gupta', email: 'deepak.gupta@email.com', mobile: '9876543217', city: 'Kolkata', state: 'West Bengal', loanAmount: '5000000', employmentType: 'business', monthlyIncome: '600000', message: 'Working capital for manufacturing unit' },
  ];
  businessLoanData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (6 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'business-loan',
      timestamp: new Date(now - (6 - index) * 3600000).toISOString(),
      data: { ...data, loanType: 'Business Loan' },
    });
  });

  // Education Loan leads (2)
  const educationLoanData = [
    { fullName: 'Rahul Verma', email: 'rahul.verma@email.com', mobile: '9876543218', city: 'Jaipur', state: 'Rajasthan', loanAmount: '1500000', employmentType: 'self-employed', monthlyIncome: '100000', message: 'Son studying abroad in USA' },
    { fullName: 'Kavita Nair', email: 'kavita.nair@email.com', mobile: '9876543219', city: 'Kochi', state: 'Kerala', loanAmount: '800000', employmentType: 'salaried', monthlyIncome: '70000', message: 'Daughter pursuing MBA' },
  ];
  educationLoanData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (5 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'education-loan',
      timestamp: new Date(now - (5 - index) * 3600000).toISOString(),
      data: { ...data, loanType: 'Education Loan' },
    });
  });

  // Car Loan leads (2)
  const carLoanData = [
    { fullName: 'Arjun Malhotra', email: 'arjun.malhotra@email.com', mobile: '9876543220', city: 'Chandigarh', state: 'Punjab', loanAmount: '800000', employmentType: 'salaried', monthlyIncome: '90000', message: 'Want to buy SUV' },
    { fullName: 'Meera Desai', email: 'meera.desai@email.com', mobile: '9876543221', city: 'Surat', state: 'Gujarat', loanAmount: '500000', employmentType: 'salaried', monthlyIncome: '75000', message: 'First car purchase' },
  ];
  carLoanData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (4 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'car-loan',
      timestamp: new Date(now - (4 - index) * 3600000).toISOString(),
      data: { ...data, loanType: 'Car Loan' },
    });
  });

  // Gold Loan leads (2)
  const goldLoanData = [
    { fullName: 'Lakshmi Iyer', email: 'lakshmi.iyer@email.com', mobile: '9876543222', city: 'Coimbatore', state: 'Tamil Nadu', loanAmount: '300000', employmentType: 'self-employed', monthlyIncome: '80000', message: 'Need quick funds against gold' },
    { fullName: 'Harish Joshi', email: 'harish.joshi@email.com', mobile: '9876543223', city: 'Dehradun', state: 'Uttarakhand', loanAmount: '500000', employmentType: 'business', monthlyIncome: '150000', message: 'Short term business requirement' },
  ];
  goldLoanData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (3 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'gold-loan',
      timestamp: new Date(now - (3 - index) * 3600000).toISOString(),
      data: { ...data, loanType: 'Gold Loan' },
    });
  });

  // Loan against Property leads (2)
  const lapData = [
    { fullName: 'Sunita Rao', email: 'sunita.rao@email.com', mobile: '9876543224', city: 'Indore', state: 'Madhya Pradesh', loanAmount: '10000000', employmentType: 'business', monthlyIncome: '500000', message: 'Commercial property as collateral' },
    { fullName: 'Ramesh Nair', email: 'ramesh.nair@email.com', mobile: '9876543225', city: 'Thiruvananthapuram', state: 'Kerala', loanAmount: '7500000', employmentType: 'self-employed', monthlyIncome: '250000', message: 'Residential property mortgage' },
  ];
  lapData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (2 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'loan-against-property',
      timestamp: new Date(now - (2 - index) * 3600000).toISOString(),
      data: { ...data, loanType: 'Loan against Property' },
    });
  });

  // Credit Card leads (3)
  const creditCardData = [
    { fullName: 'Neha Kapoor', email: 'neha.kapoor@email.com', mobile: '9876543226', city: 'Mumbai', state: 'Maharashtra', monthlyIncome: '120000', employmentType: 'salaried', selectedCard: 'Premium Rewards Card', selectedCardIssuer: 'HDFC Bank' },
    { fullName: 'Karan Shah', email: 'karan.shah@email.com', mobile: '9876543227', city: 'Vadodara', state: 'Gujarat', monthlyIncome: '150000', employmentType: 'business', selectedCard: 'Cashback Plus Card', selectedCardIssuer: 'ICICI Bank' },
    { fullName: 'Shreya Banerjee', email: 'shreya.banerjee@email.com', mobile: '9876543228', city: 'Kolkata', state: 'West Bengal', monthlyIncome: '95000', employmentType: 'salaried', selectedCard: 'Travel Elite Card', selectedCardIssuer: 'Axis Bank' },
  ];
  creditCardData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (7 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'credit-card',
      timestamp: new Date(now - (7 - index) * 3600000).toISOString(),
      data,
    });
  });

  // CIBIL Check leads (4)
  const cibilData = [
    { name: 'Pradeep Kumar', mobile: '9876543229', email: 'pradeep.kumar@email.com', pan: 'ABCDE1234F', dateOfBirth: '1985-05-15', cibilScore: 782 },
    { name: 'Divya Menon', mobile: '9876543230', email: 'divya.menon@email.com', pan: 'FGHIJ5678K', dateOfBirth: '1990-08-22', cibilScore: 735 },
    { name: 'Suresh Yadav', mobile: '9876543231', email: 'suresh.yadav@email.com', pan: 'LMNOP9012Q', dateOfBirth: '1988-12-10', cibilScore: 698 },
    { name: 'Anita Kumari', mobile: '9876543232', email: 'anita.kumari@email.com', pan: 'RSTUV3456W', dateOfBirth: '1992-03-25', cibilScore: 810 },
  ];
  cibilData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (9 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'cibil-check',
      timestamp: new Date(now - (9 - index) * 3600000).toISOString(),
      data,
    });
  });

  // Contact Form leads (3)
  const contactData = [
    { name: 'Ashok Tiwari', email: 'ashok.tiwari@email.com', mobile: '9876543233', city: 'Lucknow', state: 'Uttar Pradesh', subject: 'Loan Inquiry', reason: 'loan-inquiry', message: 'Interested in home loan, please contact' },
    { name: 'Geeta Prasad', email: 'geeta.prasad@email.com', mobile: '9876543234', city: 'Patna', state: 'Bihar', subject: 'Credit Card Information', reason: 'credit-card', message: 'Need information about rewards credit cards' },
    { name: 'Manoj Reddy', email: 'manoj.reddy@email.com', mobile: '9876543235', city: 'Visakhapatnam', state: 'Andhra Pradesh', subject: 'General Inquiry', reason: 'other', message: 'Want to become a DSA partner' },
  ];
  contactData.forEach((data, index) => {
    dummyLeads.push({
      id: `lead_${now - (11 - index) * 3600000}_${Math.random().toString(36).substr(2, 9)}`,
      category: 'contact',
      timestamp: new Date(now - (11 - index) * 3600000).toISOString(),
      data,
    });
  });

  // Merge with existing leads
  const allLeads = [...existingLeads, ...dummyLeads];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(allLeads));
  return dummyLeads.length;
}

// Export leads to CSV. If `leads` is not provided, exports all leads.
export function exportLeadsToCSV(leads?: Lead[]): string {
  const source = leads || getAllLeads();
  if (source.length === 0) return '';

  // Collect all keys from data fields
  const dataKeys = new Set<string>();
  source.forEach(l => Object.keys(l.data || {}).forEach(k => dataKeys.add(k)));
  const headers = ['id', 'category', 'timestamp', ...Array.from(dataKeys)];

  const escape = (val: any) => {
    if (val === null || val === undefined) return '';
    const s = String(val);
    if (s.includes(',') || s.includes('"') || s.includes('\n')) {
      return '"' + s.replace(/"/g, '""') + '"';
    }
    return s;
  };

  const rows = source.map(l => {
    const row: string[] = [];
    row.push(escape(l.id));
    row.push(escape(l.category));
    row.push(escape(l.timestamp));
    for (const k of dataKeys) {
      row.push(escape(l.data?.[k] ?? ''));
    }
    return row.join(',');
  });

  return headers.join(',') + '\n' + rows.join('\n');
}

// Firestore-backed async helpers (fallback to localStorage when Firestore not configured)
import * as firestoreLeads from './leads';

export async function saveLeadAsync(category: LeadCategory, data: Record<string, any>): Promise<Lead> {
  try {
    return await firestoreLeads.saveLeadAsync(category, data);
  } catch (e) {
    // fallback to local
    return Promise.resolve(saveLead(category, data));
  }
}

export async function updateLeadAsync(updated: Lead): Promise<boolean> {
  try {
    return await firestoreLeads.updateLeadAsync(updated);
  } catch (e) {
    return Promise.resolve(updateLead(updated));
  }
}

export async function deleteLeadAsync(leadId: string): Promise<boolean> {
  try {
    return await firestoreLeads.deleteLeadAsync(leadId);
  } catch (e) {
    return Promise.resolve(deleteLead(leadId));
  }
}

export async function getAllLeadsAsync(): Promise<Lead[]> {
  try {
    return await firestoreLeads.getAllLeadsAsync();
  } catch (e) {
    return Promise.resolve(getAllLeads());
  }
}

export async function getLeadsByCategoryAsync(category: LeadCategory): Promise<Lead[]> {
  try {
    return await firestoreLeads.getLeadsByCategoryAsync(category);
  } catch (e) {
    return Promise.resolve(getLeadsByCategory(category));
  }
}

export function subscribeToLeads(callback: (leads: Lead[]) => void, category?: LeadCategory) {
  try {
    return firestoreLeads.subscribeToLeads(callback, category);
  } catch (e) {
    // Fallback: emit current local leads and return a no-op unsubscribe
    callback(category ? getLeadsByCategory(category) : getAllLeads());
    return () => {};
  }
}

export async function migrateLocalLeadsToFirestore(): Promise<{ migrated: number; skipped: number }> {
  try {
    return await firestoreLeads.migrateLocalLeadsToFirestore();
  } catch (e) {
    return { migrated: 0, skipped: 0 };
  }
}
// Import leads from CSV string. Returns number of leads imported.
export function importLeadsFromCSV(csv: string): number {
  if (!csv) return 0;

  const lines = csv.split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return 0;

  const parseCSVLine = (line: string) => {
    const result: string[] = [];
    let cur = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else {
            inQuotes = false;
          }
        } else {
          cur += ch;
        }
      } else {
        if (ch === '"') {
          inQuotes = true;
        } else if (ch === ',') {
          result.push(cur);
          cur = '';
        } else {
          cur += ch;
        }
      }
    }
    result.push(cur);
    return result;
  };

  const header = parseCSVLine(lines[0]).map(h => h.trim());
  const rows = lines.slice(1).map(parseCSVLine);

  const imported: Lead[] = [];
  const now = new Date().toISOString();
  const validCategories = new Set<LeadCategory>([
    'home-loan','personal-loan','business-loan','education-loan','car-loan','gold-loan','loan-against-property','credit-card','cibil-check','contact','careers'
  ]);

  for (const r of rows) {
    if (r.every(c => c === '')) continue; // skip empty rows
    const obj: Record<string, any> = {};
    for (let i = 0; i < header.length; i++) {
      obj[header[i]] = r[i] ?? '';
    }

    const categoryRaw = (obj['category'] || '').trim();
    const category = validCategories.has(categoryRaw as LeadCategory) ? (categoryRaw as LeadCategory) : 'contact';
    const id = obj['id'] && obj['id'].trim() ? obj['id'].trim() : `lead_${Date.now()}_${Math.random().toString(36).substr(2,9)}`;
    const timestamp = obj['timestamp'] && obj['timestamp'].trim() ? obj['timestamp'].trim() : now;

    // Remove standard fields from data object
    const data: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      if (['id','category','timestamp'].includes(key)) continue;
      data[key] = obj[key];
    }

    // Mark imported leads as Manual Entry by default if no source is provided
    if (!data.source || String(data.source).trim() === '') {
      data.source = 'Manual Entry';
    }

    imported.push({ id, category, timestamp, data });
  }

  if (imported.length === 0) return 0;
  const existing = getAllLeads();
  const merged = [...existing, ...imported];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  return imported.length;
}

// Admin profile helpers
const ADMIN_PROFILE_KEY = 'aghaniya_admin_profile';

export function getAdminProfile(): { name?: string; email?: string } {
  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

export function setAdminProfile(profile: { name?: string; email?: string }) {
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile));
} 

