/**
 * Open World Factbook - TypeScript Types
 * Defines interfaces for country data from factbook.json
 */

export interface TextField {
  text: string;
  note?: string;
}

export interface NestedTextField {
  [key: string]: TextField | string;
}

export interface Category {
  [fieldName: string]: TextField | NestedTextField | string;
}

export interface Country {
  slug: string;
  code: string;
  flagCode: string; // ISO 3166-1 alpha-2 code for flag API
  name: string;
  region: string;
  
  // Main categories from factbook data
  Introduction?: Category;
  Geography?: Category;
  "People and Society"?: Category;
  Environment?: Category;
  Government?: Category;
  Economy?: Category;
  Energy?: Category;
  Communications?: Category;
  Transportation?: Category;
  Military?: Category;
  "Military and Security"?: Category;
  "Transnational Issues"?: Category;
  Terrorism?: Category;
}

export interface CountryIndex {
  slug: string;
  code: string;
  flagCode: string; // ISO 3166-1 alpha-2 code for flag API
  name: string;
  region: string;
  population?: string;
  capital?: string;
  area?: string;
}

export interface Region {
  id: string;
  name: string;
  displayName: string;
  countries: CountryIndex[];
}

// API response types
export interface CountriesResponse {
  total: number;
  updated: string;
  countries: CountryIndex[];
}

export interface SearchResult {
  slug: string;
  name: string;
  region: string;
  matchField?: string;
  score: number;
}
