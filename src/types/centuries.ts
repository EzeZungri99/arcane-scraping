export type Century = 'XIV' | 'XV' | 'XVI';

export interface CenturyInfo {
  name: string;
  displayName: string;
  order: number;
}

export const CENTURIES: Record<Century, CenturyInfo> = {
  XIV: { name: 'XIV', displayName: 'Siglo XIV', order: 1 },
  XV: { name: 'XV', displayName: 'Siglo XV', order: 2 },
  XVI: { name: 'XVI', displayName: 'Siglo XVI', order: 3 }
};

export interface CenturyProcessingResult {
  success: boolean;
  century: Century;
  extractedCode?: string;
  error?: string;
}

export interface CenturiesState {
  currentCentury: number;
  unlockedCenturies: number[];
  completedCenturies: number[];
  extractedCodes: Record<number, string>;
}

export interface ProcessCenturyRequest {
  centuryId: number;
  code?: string;
}

export interface ProcessCenturyResponse {
  success: boolean;
  message: string;
  nextCentury?: Century;
  extractedCode?: string;
} 