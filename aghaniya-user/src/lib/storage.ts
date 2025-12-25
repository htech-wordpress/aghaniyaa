// Lead types
export type LeadCategory = string;

export interface Lead {
  id: string;
  category: LeadCategory;
  timestamp: string;
  data: Record<string, unknown>;
}

export interface LeadDocument {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}
