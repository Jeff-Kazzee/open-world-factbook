/**
 * Open World Factbook - Data Layer
 * Parses factbook.json data and provides access functions
 */

import { Country, CountryIndex, Region } from './types';
import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '..', 'data', 'factbook-json', 'factbook.json-master');

// Region mapping from folder names to display names
const REGION_DISPLAY_NAMES: Record<string, string> = {
  'africa': 'Africa',
  'antarctica': 'Antarctica',
  'australia-oceania': 'Australia & Oceania',
  'central-america-n-caribbean': 'Central America & Caribbean',
  'central-asia': 'Central Asia',
  'east-n-southeast-asia': 'East & Southeast Asia',
  'europe': 'Europe',
  'middle-east': 'Middle East',
  'north-america': 'North America',
  'south-america': 'South America',
  'south-asia': 'South Asia',
  'oceans': 'Oceans',
  'world': 'World',
};

// Country code to name mapping (extracted from data)
const CODE_TO_NAME: Record<string, string> = {};

/**
 * Get all region directories
 */
function getRegionDirs(): string[] {
  const entries = fs.readdirSync(DATA_DIR, { withFileTypes: true });
  return entries
    .filter(entry => entry.isDirectory() && entry.name !== 'meta')
    .map(entry => entry.name);
}

/**
 * Parse a single country JSON file
 */
function parseCountryFile(filePath: string, region: string): Country | null {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(content);
    
    const code = path.basename(filePath, '.json');
    
    // Extract country name from Government section
    let name = code.toUpperCase();
    if (data.Government?.['Country name']?.['conventional short form']?.text) {
      name = data.Government['Country name']['conventional short form'].text;
      if (name === 'none') {
        name = data.Government['Country name']?.['conventional long form']?.text || code.toUpperCase();
      }
    }
    
    // Clean HTML tags from name
    name = name.replace(/<[^>]*>/g, '');
    
    // Generate URL-friendly slug
    const slug = name.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    CODE_TO_NAME[code] = name;
    
    return {
      slug,
      code,
      name,
      region,
      ...data
    };
  } catch (error) {
    console.error(`Error parsing ${filePath}:`, error);
    return null;
  }
}

/**
 * Get all countries
 */
export function getAllCountries(): Country[] {
  const countries: Country[] = [];
  
  for (const regionDir of getRegionDirs()) {
    const regionPath = path.join(DATA_DIR, regionDir);
    const files = fs.readdirSync(regionPath).filter(f => f.endsWith('.json'));
    
    for (const file of files) {
      const country = parseCountryFile(path.join(regionPath, file), regionDir);
      if (country) {
        countries.push(country);
      }
    }
  }
  
  return countries.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get country index (lightweight summary for listings)
 */
export function getCountryIndex(): CountryIndex[] {
  const countries = getAllCountries();
  
  return countries.map(country => ({
    slug: country.slug,
    code: country.code,
    name: country.name,
    region: country.region,
    population: extractPopulation(country),
    capital: extractCapital(country),
    area: extractArea(country),
  }));
}

/**
 * Get a single country by slug
 */
export function getCountryBySlug(slug: string): Country | null {
  const countries = getAllCountries();
  return countries.find(c => c.slug === slug) || null;
}

/**
 * Get a single country by code
 */
export function getCountryByCode(code: string): Country | null {
  const countries = getAllCountries();
  return countries.find(c => c.code === code) || null;
}

/**
 * Get all regions with their countries
 */
export function getAllRegions(): Region[] {
  const countryIndex = getCountryIndex();
  const regionDirs = getRegionDirs();
  
  return regionDirs.map(dir => ({
    id: dir,
    name: dir,
    displayName: REGION_DISPLAY_NAMES[dir] || dir,
    countries: countryIndex.filter(c => c.region === dir),
  })).sort((a, b) => a.displayName.localeCompare(b.displayName));
}

/**
 * Get countries by region
 */
export function getCountriesByRegion(region: string): CountryIndex[] {
  return getCountryIndex().filter(c => c.region === region);
}

// Helper functions to extract key stats

function extractPopulation(country: Country): string | undefined {
  const pop = country['People and Society']?.Population as any;
  if (pop?.total?.text) {
    return pop.total.text;
  }
  return undefined;
}

function extractCapital(country: Country): string | undefined {
  const cap = country.Government?.Capital as any;
  if (cap?.name?.text) {
    return cap.name.text.replace(/<[^>]*>/g, '');
  }
  return undefined;
}

function extractArea(country: Country): string | undefined {
  const area = country.Geography?.Area as any;
  if (area?.['total ']?.text) {
    return area['total '].text;
  }
  if (area?.total?.text) {
    return area.total.text;
  }
  return undefined;
}

/**
 * Extract a specific field value from country data
 */
export function extractFieldValue(obj: any, path: string[]): string | null {
  let current = obj;
  for (const key of path) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      return null;
    }
  }
  
  if (typeof current === 'string') {
    return current;
  }
  if (current?.text) {
    return current.text;
  }
  return null;
}

/**
 * Strip HTML tags from text
 */
export function stripHtml(text: string): string {
  return text.replace(/<[^>]*>/g, '').replace(/&[^;]+;/g, ' ').trim();
}
