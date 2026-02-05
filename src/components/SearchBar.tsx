'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Fuse from 'fuse.js';

interface CountrySearchItem {
  name: string;
  code: string;
  flagCode: string;
  slug: string;
  region: string;
  capital?: string;
}

export default function SearchBar({ countries }: { countries: CountrySearchItem[] }) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Initialize Fuse.js
  const fuse = useMemo(() => {
    return new Fuse(countries, {
      keys: ['name', 'capital', 'region'],
      threshold: 0.3,
      includeScore: true,
    });
  }, [countries]);
  
  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // Compute search results
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const searchResults = fuse.search(query);
    return searchResults.slice(0, 8).map(r => r.item);
  }, [query, fuse]);
  
  return (
    <div ref={searchRef} className="relative max-w-xl mx-auto mb-12">
      <svg 
        className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-muted)] pointer-events-none z-10"
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
      </svg>
      
      <input
        type="text"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        placeholder="Search countries, regions, capitals..."
        className="search-input w-full"
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') setIsOpen(false);
        }}
      />
      
      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg shadow-lg overflow-hidden z-50">
          {results.map((country) => (
            <Link
              key={country.code}
              href={`/country/${country.slug}`}
              className="flex items-center gap-3 px-4 py-3 hover:bg-[var(--bg-tertiary)] transition-colors border-b border-[var(--border-subtle)] last:border-b-0"
              onClick={() => {
                setIsOpen(false);
                setQuery('');
              }}
            >
              {/* Flag */}
              {country.flagCode && (
                <Image
                  src={`https://flagcdn.com/w40/${country.flagCode}.png`}
                  alt={`${country.name} flag`}
                  width={32}
                  height={24}
                  className="rounded object-cover"
                  unoptimized
                />
              )}
              
              {/* Country Info */}
              <div className="flex-1">
                <div className="font-medium text-[var(--text-primary)]">
                  {country.name}
                </div>
                <div className="text-sm text-[var(--text-muted)]">
                  {country.region.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  {country.capital && ` · ${country.capital}`}
                </div>
              </div>
              
              {/* Arrow */}
              <svg
                className="w-5 h-5 text-[var(--text-muted)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      )}
      
      {/* No Results */}
      {isOpen && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-default)] rounded-lg shadow-lg p-4 text-center text-[var(--text-muted)] z-50">
          No countries found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
