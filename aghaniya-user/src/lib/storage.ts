// Lead types
export type LeadCategory =
  | 'home-loan'
  | 'personal-loan'
  | 'business-loan'
  | 'education-loan'
  | 'car-loan'
  | 'gold-loan'
  | 'loan-against-property'
  // | 'credit-card'
  | 'cibil-check'
  | 'contact'
  | 'careers'
  | 'becomedsa';

export interface Lead {
  id: string;
  category: LeadCategory;
  timestamp: string;
  data: Record<string, any>;
}

export interface LeadDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}
